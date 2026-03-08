#!/usr/bin/env node
// Uploads local catalog images to Airtable as file attachments.
//
// BEFORE RUNNING:
//   1. Open scripts/catalog-mapping.html in your browser
//   2. Check each row to confirm image ↔ product pairing
//   3. Edit MAPPING below to fix any mismatches (swap entries or set imageFile: null to skip)
//   4. Run: node --env-file=.env scripts/upload-images.js

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const PAT = process.env.VITE_AIRTABLE_PAT
const BASE_ID = process.env.VITE_AIRTABLE_BASE_ID

if (!PAT || !BASE_ID) {
  console.error('❌  Missing VITE_AIRTABLE_PAT or VITE_AIRTABLE_BASE_ID in .env')
  process.exit(1)
}

const IMAGES_DIR = path.resolve(__dirname, '../public/catalog_images')

// ─── MAPPING ────────────────────────────────────────────────────────────────
// Edit this after reviewing catalog-mapping.html.
// Set imageFile: null to skip a product (keeps its current Airtable image).
// The recordId values are filled in automatically at runtime by matching sku.
// ────────────────────────────────────────────────────────────────────────────
const MAPPING = [
  // page 1 — one large image
  { sku: '101',  imageFile: 'page1_img2_1000x1000.jpeg' },
  // page 2
  { sku: '104',  imageFile: 'page2_img1_90x90.jpeg' },
  // page 3
  { sku: '1408', imageFile: 'page3_img1_90x90.jpeg' },
  { sku: '141',  imageFile: 'page3_img2_90x90.jpeg' },
  { sku: '106',  imageFile: 'page3_img3_90x90.jpeg' },
  { sku: '103',  imageFile: 'page3_img4_90x90.jpeg' },
  { sku: '235',  imageFile: 'page3_img5_90x90.jpeg' },
  // page 4
  { sku: '129',  imageFile: 'page4_img1_90x90.jpeg' },
  { sku: '1409', imageFile: 'page4_img2_90x90.jpeg' },
  { sku: '133',  imageFile: 'page4_img3_90x90.jpeg' },
  { sku: '108',  imageFile: 'page4_img4_90x90.jpeg' },
  { sku: '1410', imageFile: 'page4_img5_90x90.jpeg' },
  { sku: '310',  imageFile: 'page4_img6_90x90.jpeg' },
  // page 5
  { sku: '107',  imageFile: 'page5_img1_90x90.jpeg' },
  { sku: '143',  imageFile: 'page5_img2_90x90.jpeg' },
  { sku: '978',  imageFile: 'page5_img3_90x90.jpeg' },
  { sku: '3539', imageFile: 'page5_img4_90x90.jpeg' },
  // page 6
  { sku: '3498', imageFile: 'page6_img1_90x90.jpeg' },
  { sku: '528N', imageFile: 'page6_img2_90x90.jpeg' },
  { sku: '4211', imageFile: 'page6_img3_90x90.jpeg' },
  { sku: '31',   imageFile: 'page6_img4_90x90.jpeg' },
  { sku: '1334', imageFile: 'page6_img5_90x90.jpeg' },
  // page 7
  { sku: '004',  imageFile: 'page7_img1_90x90.jpeg' },
  { sku: '031',  imageFile: 'page7_img2_90x90.jpeg' },
  { sku: '219',  imageFile: 'page7_img3_90x90.jpeg' },
  { sku: '3583', imageFile: 'page7_img4_90x90.jpeg' },
  { sku: '032',  imageFile: 'page7_img5_90x90.jpeg' },
  { sku: '666',  imageFile: 'page7_img6_90x90.jpeg' },
  // page 8
  { sku: '1629', imageFile: 'page8_img1_90x90.jpeg' },
  { sku: '1630', imageFile: 'page8_img2_90x90.jpeg' },
  { sku: '1572', imageFile: 'page8_img3_90x90.jpeg' },
  // page 9
  { sku: '1604', imageFile: 'page9_img1_90x90.jpeg' },
  { sku: '1652', imageFile: 'page9_img2_90x90.jpeg' },
  // page 10
  { sku: '1638', imageFile: 'page10_img1_90x90.jpeg' },
  { sku: '676',  imageFile: 'page10_img2_90x90.jpeg' },
  // No image for these two (set imageFile: null = keep Unsplash fallback)
  { sku: '364',  imageFile: null },
  { sku: '342',  imageFile: null },
]

// ─── Airtable helpers ────────────────────────────────────────────────────────

async function fetchAllProducts() {
  const records = []
  let offset = null
  do {
    const params = new URLSearchParams()
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

// Airtable content upload API — uploads binary directly (no public URL needed)
async function uploadAttachment(recordId, imageFile) {
  const filePath = path.join(IMAGES_DIR, imageFile)
  const buffer = fs.readFileSync(filePath)
  const ext = path.extname(imageFile).toLowerCase()
  const contentType = ext === '.png' ? 'image/png' : 'image/jpeg'

  const blob = new Blob([buffer], { type: contentType })
  const form = new FormData()
  form.append('file', blob, imageFile)
  form.append('filename', imageFile)
  form.append('contentType', contentType)

  const res = await fetch(
    `https://content.airtable.com/v0/${BASE_ID}/${recordId}/image/uploadAttachment`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${PAT}` },
      body: form,
    }
  )

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error?.message || `HTTP ${res.status}`)
  }
  return res.json()
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('⏳  Fetching Airtable records to resolve SKU → recordId…')
  const records = await fetchAllProducts()

  // Build SKU → recordId lookup
  const skuToRecord = {}
  for (const r of records) {
    skuToRecord[r.fields.sku] = r.id
  }

  const toUpload = MAPPING.filter(m => m.imageFile !== null)
  console.log(`🖼   Uploading ${toUpload.length} images (${MAPPING.length - toUpload.length} skipped)\n`)

  let ok = 0, fail = 0

  for (const { sku, imageFile } of toUpload) {
    const recordId = skuToRecord[sku]
    if (!recordId) {
      console.log(`  ⚠️   SKU ${sku} — record not found in Airtable, skipping`)
      fail++
      continue
    }

    const filePath = path.join(IMAGES_DIR, imageFile)
    if (!fs.existsSync(filePath)) {
      console.log(`  ⚠️   ${imageFile} — file not found, skipping`)
      fail++
      continue
    }

    process.stdout.write(`  ⏳  ${sku.padEnd(6)} ← ${imageFile}…`)
    try {
      await uploadAttachment(recordId, imageFile)
      console.log(' ✅')
      ok++
    } catch (err) {
      console.log(` ❌  ${err.message}`)
      fail++
    }

    // Rate limit: ~4 req/s to be safe
    await new Promise(r => setTimeout(r, 300))
  }

  console.log(`\n✅  Done — ${ok} uploaded, ${fail} failed/skipped`)
}

main().catch(err => { console.error('\n❌', err.message); process.exit(1) })
