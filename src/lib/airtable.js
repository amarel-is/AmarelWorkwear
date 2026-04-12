const PAT = import.meta.env.VITE_AIRTABLE_PAT
const BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID
const API_URL = `https://api.airtable.com/v0/${BASE_ID}`

const TABLES = {
  products: 'Products',
  orders: 'Orders'
}

const headers = {
  Authorization: `Bearer ${PAT}`,
  'Content-Type': 'application/json'
}

async function request(endpoint, options = {}) {
  const res = await fetch(`${API_URL}/${endpoint}`, {
    ...options,
    headers: { ...headers, ...options.headers }
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error?.message || `Airtable error ${res.status}`)
  }

  return res.json()
}

function toArray(value, separator = ',') {
  if (Array.isArray(value)) return value
  if (typeof value === 'string' && value.trim()) {
    return value.split(separator).map(s => s.trim()).filter(Boolean)
  }
  return []
}

function parseRecord(record) {
  const fields = { ...record.fields }

  // Normalize image attachment → plain URL string
  if (Array.isArray(fields.image) && fields.image.length > 0) {
    fields.image = fields.image[0].url
  }

  // Normalize comma-separated strings → arrays (Products table)
  if ('colors' in fields) fields.colors = toArray(fields.colors)
  if ('sizes' in fields) fields.sizes = toArray(fields.sizes)

  // Normalize newline-separated string → array (Products table)
  if ('features' in fields && !Array.isArray(fields.features)) {
    fields.features = toArray(fields.features, '\n')
  }

  // Parse color_images JSON string
  if ('color_images' in fields && typeof fields.color_images === 'string') {
    try {
      fields.color_images = JSON.parse(fields.color_images)
    } catch {
      fields.color_images = null
    }
  }

  return { id: record.id, createdTime: record.createdTime, ...fields }
}

async function listAll(table, options = {}) {
  const records = []
  let offset = null

  do {
    const params = new URLSearchParams()
    if (offset) params.set('offset', offset)
    if (options.sort) {
      options.sort.forEach((s, i) => {
        params.set(`sort[${i}][field]`, s.field)
        params.set(`sort[${i}][direction]`, s.direction || 'asc')
      })
    }
    if (options.filterByFormula) params.set('filterByFormula', options.filterByFormula)
    if (options.maxRecords) params.set('maxRecords', String(options.maxRecords))
    if (options.fields) options.fields.forEach(f => params.append('fields[]', f))

    const qs = params.toString()
    const data = await request(`${table}${qs ? '?' + qs : ''}`)
    records.push(...data.records.map(parseRecord))
    offset = data.offset
  } while (offset)

  return records
}

async function getRecord(table, recordId) {
  const data = await request(`${table}/${recordId}`)
  return parseRecord(data)
}

async function createRecords(table, fieldsArray) {
  const batches = []
  for (let i = 0; i < fieldsArray.length; i += 10) {
    batches.push(fieldsArray.slice(i, i + 10))
  }

  const created = []
  for (const batch of batches) {
    const data = await request(table, {
      method: 'POST',
      body: JSON.stringify({
        records: batch.map(fields => ({ fields })),
        typecast: true
      })
    })
    created.push(...data.records.map(parseRecord))
  }
  return created
}

async function createRecord(table, fields) {
  const [record] = await createRecords(table, [fields])
  return record
}

async function updateRecord(table, recordId, fields) {
  const data = await request(`${table}/${recordId}`, {
    method: 'PATCH',
    body: JSON.stringify({ fields, typecast: true })
  })
  return parseRecord(data)
}

async function updateRecords(table, updates) {
  const batches = []
  for (let i = 0; i < updates.length; i += 10) {
    batches.push(updates.slice(i, i + 10))
  }

  const updated = []
  for (const batch of batches) {
    const data = await request(table, {
      method: 'PATCH',
      body: JSON.stringify({
        records: batch.map(u => ({ id: u.id, fields: u.fields })),
        typecast: true
      })
    })
    updated.push(...data.records.map(parseRecord))
  }
  return updated
}

async function deleteRecord(table, recordId) {
  await request(`${table}/${recordId}`, { method: 'DELETE' })
}

// Upload a File object as an attachment to an existing record.
// Uses Airtable's content upload API (different base URL, no JSON content-type).
export async function uploadAttachment(recordId, fieldName, file) {
  const formData = new FormData()
  formData.append('file', file, file.name)
  formData.append('filename', file.name)
  formData.append('contentType', file.type || 'application/octet-stream')

  const res = await fetch(
    `https://content.airtable.com/v0/${BASE_ID}/${recordId}/${encodeURIComponent(fieldName)}/uploadAttachment`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${PAT}` },
      body: formData
    }
  )
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error?.message || `Upload error ${res.status}`)
  }
  return res.json()
}

// ─── Products API ───

export const productsApi = {
  list: (options = {}) =>
    listAll(TABLES.products, {
      sort: [{ field: 'sort_order', direction: 'asc' }],
      ...options
    }),

  listActive: () =>
    listAll(TABLES.products, {
      filterByFormula: '{active} = TRUE()',
      sort: [{ field: 'sort_order', direction: 'asc' }]
    }),

  get: (id) => getRecord(TABLES.products, id),

  create: (fields) => createRecord(TABLES.products, fields),

  update: (id, fields) => updateRecord(TABLES.products, id, fields),

  delete: (id) => deleteRecord(TABLES.products, id),

  bulkCreate: (fieldsArray) => createRecords(TABLES.products, fieldsArray)
}

// ─── Orders API ───

export const ordersApi = {
  list: (options = {}) =>
    listAll(TABLES.orders, {
      sort: [{ field: 'created_at', direction: 'desc' }],
      ...options
    }),

  get: (id) => getRecord(TABLES.orders, id),

  create: (fields) => createRecord(TABLES.orders, fields),

  updateStatus: (id, status) => updateRecord(TABLES.orders, id, { status }),

  update: (id, fields) => updateRecord(TABLES.orders, id, fields)
}

// ─── Utility: check if Airtable is configured ───

export function isAirtableConfigured() {
  return Boolean(PAT && BASE_ID)
}
