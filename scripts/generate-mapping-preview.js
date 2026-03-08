#!/usr/bin/env node
// Creates a local HTML preview so you can visually map catalog images to products.
// Run: node --env-file=.env scripts/generate-mapping-preview.js
// Then open: scripts/catalog-mapping.html

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PAT = process.env.VITE_AIRTABLE_PAT
const BASE_ID = process.env.VITE_AIRTABLE_BASE_ID

if (!PAT || !BASE_ID) {
  console.error('❌  Missing VITE_AIRTABLE_PAT or VITE_AIRTABLE_BASE_ID')
  process.exit(1)
}

const IMAGES_DIR = path.resolve(__dirname, '../public/catalog_images')

// Collect product images (90x90 and the one 1000x1000), sorted by page then index
function getProductImages() {
  const files = fs.readdirSync(IMAGES_DIR)
  return files
    .filter(f => /\.(jpeg|jpg|png)$/i.test(f) && !/_743x132|_354x94/.test(f))
    .sort((a, b) => {
      const [, ap, ai] = a.match(/page(\d+)_img(\d+)/) || [0, 0, 0]
      const [, bp, bi] = b.match(/page(\d+)_img(\d+)/) || [0, 0, 0]
      return Number(ap) - Number(bp) || Number(ai) - Number(bi)
    })
}

async function fetchProducts() {
  const records = []
  let offset = null
  do {
    const params = new URLSearchParams({ 'sort[0][field]': 'sort_order', 'sort[0][direction]': 'asc' })
    if (offset) params.set('offset', offset)
    const res = await fetch(
      `https://api.airtable.com/v0/${BASE_ID}/Products?${params}`,
      { headers: { Authorization: `Bearer ${PAT}` } }
    )
    const data = await res.json()
    records.push(...data.records)
    offset = data.offset
  } while (offset)
  return records
}

async function main() {
  console.log('⏳  Fetching Airtable products…')
  const records = await fetchProducts()
  const images = getProductImages()

  console.log(`📦  ${records.length} products in Airtable`)
  console.log(`🖼   ${images.length} product images found\n`)

  // Build rows: side-by-side image + product info
  const rows = Math.max(records.length, images.length)
  let tableRows = ''

  for (let i = 0; i < rows; i++) {
    const img = images[i]
    const rec = records[i]
    const fields = rec?.fields || {}

    const imgSrc = img ? `../public/catalog_images/${img}` : ''
    const imgCell = img
      ? `<td class="img-cell">
           <img src="${imgSrc}" alt="${img}" />
           <div class="img-name">${img}</div>
         </td>`
      : `<td class="img-cell missing">—</td>`

    const productCell = rec
      ? `<td class="product-cell">
           <span class="sku">${fields.sku || '—'}</span>
           <span class="name">${fields.name || '—'}</span>
           <span class="cat">${fields.category || ''}</span>
           <span class="rec-id">${rec.id}</span>
         </td>`
      : `<td class="product-cell missing">—</td>`

    tableRows += `<tr>
      <td class="idx">${i + 1}</td>
      ${imgCell}
      ${productCell}
    </tr>\n`
  }

  // Generate the mapping JSON template
  const mappingJson = JSON.stringify(
    images.map((img, i) => ({
      imageFile: img,
      sku: records[i]?.fields?.sku || '???',
      recordId: records[i]?.id || '???',
    })),
    null,
    2
  )

  const html = `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
<meta charset="UTF-8" />
<title>Catalog Image Mapping</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: system-ui, sans-serif; background: #f0f2f5; padding: 24px; }
  h1 { margin-bottom: 8px; font-size: 22px; }
  p { color: #666; margin-bottom: 20px; font-size: 14px; }
  table { width: 100%; border-collapse: collapse; background: #fff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,.1); }
  th { background: #1a1a2e; color: #fff; padding: 12px 16px; text-align: right; font-size: 13px; }
  td { padding: 10px 14px; border-bottom: 1px solid #eee; vertical-align: middle; }
  tr:hover { background: #f8f9ff; }
  .idx { width: 40px; color: #999; font-size: 12px; text-align: center; }
  .img-cell { width: 140px; }
  .img-cell img { width: 90px; height: 90px; object-fit: cover; border-radius: 6px; border: 1px solid #ddd; display: block; }
  .img-name { font-size: 10px; color: #888; margin-top: 4px; word-break: break-all; }
  .product-cell { }
  .sku { display: inline-block; background: #e8f0fe; color: #1a73e8; border-radius: 4px; padding: 2px 8px; font-size: 12px; font-weight: 700; margin-bottom: 4px; }
  .name { display: block; font-weight: 600; font-size: 14px; margin-bottom: 2px; }
  .cat { display: block; color: #666; font-size: 12px; margin-bottom: 4px; }
  .rec-id { display: block; font-family: monospace; font-size: 10px; color: #aaa; }
  .missing { color: #ccc; text-align: center; }
  pre { background: #1a1a2e; color: #7fffb0; padding: 20px; border-radius: 8px; font-size: 12px; overflow: auto; margin-top: 32px; white-space: pre-wrap; }
  h2 { margin-top: 32px; margin-bottom: 12px; font-size: 16px; }
  .legend { display: flex; gap: 16px; margin-bottom: 16px; font-size: 13px; }
  .legend span { display: flex; align-items: center; gap: 6px; }
  .dot { width: 12px; height: 12px; border-radius: 50%; display: inline-block; }
  .warn { background: #fff3cd; border: 1px solid #ffc107; padding: 12px 16px; border-radius: 8px; margin-bottom: 16px; font-size: 13px; }
</style>
</head>
<body>
<h1>🗂 Catalog Image ↔ Product Mapping</h1>
<p>Check each row — left column is the extracted PDF image, right column is the Airtable product (by sort_order).</p>

<div class="warn">
  ⚠️  There are <strong>${images.length} images</strong> and <strong>${records.length} products</strong>.
  ${images.length !== records.length ? `<strong>Mismatch of ${Math.abs(images.length - records.length)}</strong> — edit the mapping JSON below before uploading.` : '✅ Counts match!'}
</div>

<table>
  <thead>
    <tr>
      <th>#</th>
      <th>תמונה מהקטלוג (PDF)</th>
      <th>מוצר ב-Airtable (לפי sort_order)</th>
    </tr>
  </thead>
  <tbody>${tableRows}</tbody>
</table>

<h2>📋 Mapping JSON — copy to <code>scripts/upload-images.js</code> after fixing mismatches</h2>
<pre>${mappingJson.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
</body>
</html>`

  const outPath = path.join(__dirname, 'catalog-mapping.html')
  fs.writeFileSync(outPath, html)
  console.log(`✅  Preview saved → ${outPath}`)
  console.log('   Open it in your browser to visually confirm the mapping.\n')
}

main().catch(err => { console.error(err); process.exit(1) })
