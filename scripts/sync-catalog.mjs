/**
 * sync-catalog.mjs
 * Reads the Stella Panorama Excel catalog and upserts products into Airtable.
 * Images are passed as URL attachments (Airtable fetches them directly).
 *
 * Run: node scripts/sync-catalog.mjs
 */

import XLSX from 'xlsx';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Load .env.local
const __dir = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dir, '..', '.env.local');
const env = Object.fromEntries(
  readFileSync(envPath, 'utf8').split('\n')
    .filter(l => l.includes('='))
    .map(l => l.split('=').map(s => s.trim()))
);

const PAT     = env.VITE_AIRTABLE_PAT;
const BASE_ID = env.VITE_AIRTABLE_BASE_ID;
const API_URL = `https://api.airtable.com/v0/${BASE_ID}`;
const TABLE   = 'Products';

const EXCEL_PATH = 'C:\\Users\\Dolev.H\\Downloads\\קטלוג סטלה פנורמה.xlsx';

// ── Airtable helpers ──────────────────────────────────────────────────────────

async function airtableRequest(endpoint, options = {}) {
  const res = await fetch(`${API_URL}/${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${PAT}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`Airtable ${res.status}: ${err.error?.message || JSON.stringify(err)}`);
  }
  return res.json();
}

async function listAllProducts() {
  const records = [];
  let offset = null;
  do {
    const qs = offset ? `?offset=${offset}` : '';
    const data = await airtableRequest(`${TABLE}${qs}`);
    records.push(...data.records);
    offset = data.offset;
  } while (offset);
  return records;
}

async function createProducts(fieldsArray) {
  const batches = [];
  for (let i = 0; i < fieldsArray.length; i += 10) batches.push(fieldsArray.slice(i, i + 10));
  const created = [];
  for (const batch of batches) {
    const data = await airtableRequest(TABLE, {
      method: 'POST',
      body: JSON.stringify({ records: batch.map(f => ({ fields: f })), typecast: true }),
    });
    created.push(...data.records);
    await sleep(250); // respect rate limits
  }
  return created;
}

async function updateProducts(updates) {
  const batches = [];
  for (let i = 0; i < updates.length; i += 10) batches.push(updates.slice(i, i + 10));
  const updated = [];
  for (const batch of batches) {
    const data = await airtableRequest(TABLE, {
      method: 'PATCH',
      body: JSON.stringify({
        records: batch.map(u => ({ id: u.id, fields: u.fields })),
        typecast: true,
      }),
    });
    updated.push(...data.records);
    await sleep(250);
  }
  return updated;
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ── Excel parsing ─────────────────────────────────────────────────────────────

function isCDN(url) {
  return typeof url === 'string' && url.includes('cdn.shopify.com');
}

function extractImage(row) {
  // columns 4 and 5 are sometimes swapped – detect by content
  if (isCDN(row[4])) return row[4];
  if (isCDN(row[5])) return row[5];
  return null;
}

function normalizeSizes(str) {
  if (!str || str === 'OS') return str || '';
  return str
    .split('-')
    .map(s => s.trim().replace(/^XXL$/i, '2XL'))
    .filter(Boolean)
    .join(',');
}

function normalizeColors(str) {
  if (!str) return '';
  return str.split(',').map(s => s.trim()).filter(Boolean).join(',');
}

function parseFeatures(str) {
  if (!str) return '';
  return str
    .split(/[\r\n]+/)
    .map(s => s.replace(/^[•\s]+/, '').trim())
    .filter(Boolean)
    .join('\n');
}

const CATEGORY_MAP = {
  'כובע':    'כובעים',
  "ג'קט":   "ג'קט",
  'מכנסיים': 'מכנסיים',
  'טריקו':   'טריקו',
  'דרייפיט': 'דרייפיט',
  'פולו':    'פולו',
  'סווטשירט':'סווטשירט',
  'מכופתרת': 'מכופתרת',
};

function parseExcel() {
  const wb   = XLSX.readFile(EXCEL_PATH);
  const ws   = wb.Sheets['גיליון1'];
  const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });

  const products = [];
  let currentCategory = '';
  let current = null;

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const catCell   = String(row[0] || '').trim();
    const nameCell  = String(row[1] || '').trim();
    const skuCell   = String(row[2] || '').trim();
    const colorCell = String(row[3] || '').trim();
    const colorsCell   = String(row[6] || '').trim();
    const sizesCell    = String(row[7] || '').trim();
    const priceCell    = row[8];
    const fabricCell   = String(row[9] || '').trim();
    const descCell     = String(row[10] || '').trim();
    const featuresCell = String(row[11] || '').trim();

    // Update category
    if (catCell) {
      currentCategory = CATEGORY_MAP[catCell] || catCell;
      // If appears mid-product (no new product name), update current product's category
      if (current && !nameCell && !skuCell) {
        current.category = currentCategory;
      }
    }

    // New product?
    if (nameCell && skuCell) {
      current = {
        sku:         skuCell,
        name:        nameCell,
        category:    currentCategory,
        price:       0,
        fabric:      '',
        description: '',
        features:    '',
        colors:      '',
        sizes:       '',
        imageURL:    null,
      };
      products.push(current);
    }

    if (!current) continue;

    // Merge first-seen non-empty values
    if (priceCell    && !current.price)       current.price       = Number(priceCell);
    if (fabricCell   && !current.fabric)      current.fabric      = fabricCell;
    if (descCell     && !current.description) current.description = descCell;
    if (featuresCell && !current.features)    current.features    = parseFeatures(featuresCell);
    if (colorsCell   && !current.colors)      current.colors      = normalizeColors(colorsCell);
    if (sizesCell    && !current.sizes)       current.sizes       = normalizeSizes(sizesCell);

    // Image: use first available CDN URL
    const img = extractImage(row);
    if (img && !current.imageURL) current.imageURL = img;
  }

  return products;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('📖  Reading Excel catalog...');
  const parsed = parseExcel();
  console.log(`    Found ${parsed.length} products\n`);

  parsed.forEach((p, i) =>
    console.log(
      `  ${String(i+1).padStart(2)}. [${p.sku}] ${p.name} | ${p.category} | ₪${p.price} | image: ${p.imageURL ? '✓' : '✗'}`
    )
  );

  console.log('\n📡  Fetching existing Airtable products...');
  const existing = await listAllProducts();
  const bySkuMap = new Map(existing.map(r => [String(r.fields.sku || '').trim(), r.id]));
  console.log(`    Found ${existing.length} existing records\n`);

  const toCreate = [];
  const toUpdate = [];

  for (const p of parsed) {
    const fields = {
      sku:         p.sku,
      name:        p.name,
      category:    p.category,
      price:       p.price || 0,
      fabric:      p.fabric,
      description: p.description,
      features:    p.features,
      colors:      p.colors,
      sizes:       p.sizes,
      active:      true,
    };

    // Attach image via URL (Airtable fetches it)
    if (p.imageURL) {
      fields.image = [{ url: p.imageURL }];
    }

    const existingId = bySkuMap.get(p.sku);
    if (existingId) {
      toUpdate.push({ id: existingId, fields });
    } else {
      toCreate.push(fields);
    }
  }

  console.log(`📝  Plan: ${toCreate.length} to create, ${toUpdate.length} to update\n`);

  if (toCreate.length > 0) {
    console.log('➕  Creating new products...');
    const created = await createProducts(toCreate);
    console.log(`    ✅  Created ${created.length} products`);
  }

  if (toUpdate.length > 0) {
    console.log('✏️   Updating existing products...');
    const updated = await updateProducts(toUpdate);
    console.log(`    ✅  Updated ${updated.length} products`);
  }

  console.log('\n🎉  Sync complete!');
}

main().catch(err => { console.error('❌ Error:', err.message); process.exit(1); });
