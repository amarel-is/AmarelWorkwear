/**
 * sync-products.mjs
 * מסנכרן את Airtable לפי קובץ האקסל + תמונות
 * הרצה: node scripts/sync-products.mjs
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const PAT = process.env.VITE_AIRTABLE_PAT
const BASE_ID = process.env.VITE_AIRTABLE_BASE_ID
const IMAGES_DIR = 'C:/Users/Dolev.H/Downloads/FW_ [EXTERNAL] תמונות אהובה'

const sleep = ms => new Promise(r => setTimeout(r, ms))

if (!PAT || !BASE_ID) {
  console.error('❌ Missing VITE_AIRTABLE_PAT or VITE_AIRTABLE_BASE_ID in the environment')
  console.error(`   Run with: node --env-file=.env ${path.relative(process.cwd(), path.join(__dirname, 'sync-products.mjs'))}`)
  process.exit(1)
}

// ─── נתוני מוצרים מהאקסל ───────────────────────────────────────────────────
const EXCEL_PRODUCTS = [
  { sku:'101',  name:'חולצה טריקו קצר',                   category:'טריקו',       colors:'אפור עכבר, אפור בהיר, שחור, כחול',    sizes:'S,M,L,XL,XXL,3XL', price:12,  fabric:'100% כותנה',                    description:'',                                                                                             features:[], sort_order:1 },
  { sku:'104',  name:'חולצה טריקו ארוך',                   category:'טריקו',       colors:'אפור עכבר, אפור בהיר, שחור, כחול',    sizes:'S,M,L,XL,XXL,3XL', price:17,  fabric:'',                              description:'',                                                                                             features:[], sort_order:2 },
  { sku:'1408', name:'חולצה דרייפיט קצר',                  category:'דרייפיט',     colors:'אפור עכבר, שחור, כחול',               sizes:'S,M,L,XL,XXL,3XL', price:11,  fabric:'פוליאסטר 100%',                 description:'מותאמת לאקלים הישראלי, קלה ונושמת לנוחות מקסימלית בעבודה וביום יום',                        features:[], sort_order:3 },
  { sku:'141',  name:'חולצה דרייפיט ארוך',                  category:'דרייפיט',     colors:'אפור עכבר, אפור בהיר, שחור, כחול',    sizes:'S,M,L,XL,XXL,3XL', price:20,  fabric:'',                              description:'',                                                                                             features:[], sort_order:4 },
  { sku:'106',  name:'חולצה פולו קצר',                     category:'פולו',        colors:'אפור עכבר, אפור בהיר, שחור, כחול',    sizes:'S,M,L,XL,XXL,3XL', price:24,  fabric:'כותנה 60%, פוליאסטר 40%',       description:'שילוב בין נוחות לסגנון',                                                                       features:[], sort_order:5 },
  { sku:'107',  name:'חולצה פולו ארוך',                    category:'פולו',        colors:'אפור עכבר, אפור בהיר, שחור, כחול',    sizes:'S,M,L,XL,XXL,3XL', price:26,  fabric:'',                              description:'',                                                                                             features:[], sort_order:6 },
  { sku:'103',  name:'חולצה פולו קצר עם כיס',             category:'פולו',        colors:'אפור עכבר, אפור בהיר, שחור, כחול',    sizes:'S,M,L,XL,XXL,3XL', price:26,  fabric:'כותנה 100%',                    description:'קלאסיקה נוחה לעבודה וליומיום',                                                                features:[], sort_order:7 },
  { sku:'235',  name:'חולצה פולו דרייפיט קצר',             category:'פולו',        colors:'אפור עכבר, שחור, כחול',               sizes:'S,M,L,XL,XXL,3XL', price:27,  fabric:'פוליאסטר 100%',                 description:'למי שמעריך נוחות במהלך היום, עם בד קל ומנדף זיעה',                                            features:[], sort_order:8 },
  { sku:'143',  name:'חולצה פולו דרייפיט ארוך',            category:'פולו',        colors:'אפור עכבר, כחול, שחור',               sizes:'S,M,L,XL,XXL,3XL', price:29,  fabric:'',                              description:'',                                                                                             features:[], sort_order:9 },
  { sku:'129',  name:'חולצה פולו דרייפיט קצר עם כיס',     category:'פולו',        colors:'אפור עכבר, כחול, שחור',               sizes:'S,M,L,XL,XXL,3XL', price:20,  fabric:'פוליאסטר 100%',                 description:'למי שמעריך נוחות במהלך היום, עם בד קל ומנדף זיעה',                                            features:[], sort_order:10 },
  { sku:'1409', name:'חולצה פולו טקטית קצר',               category:'פולו',        colors:'שחור, אפור עכבר',                     sizes:'S,M,L,XL,XXL,3XL', price:55,  fabric:'פוליאסטר 100%',                 description:'עמידה, נושמת ומוכנה לשטח',                                                                     features:['אלסטיות גבוהה, ייבוש מהיר והגנה מקרינת UV', 'כיס ייעודי לאוזנית וכיסים למחסניות בשרוול שמאל', 'קשר מתחת לתפרי הכתפיים'], sort_order:11 },
  { sku:'133',  name:'סווטשירט עבודה',                     category:'סווטשירט',    colors:'כחול כהה',                            sizes:'S,M,L,XL,XXL,3XL', price:36,  fabric:'כותנה 100%',                    description:'פתרון בטיחותי ונוח לסביבות עבודה רגישות',                                                     features:['פיתוח ייעודי לעבודות חשמל, סביבות אנטי-סטטיות, דלקים ונשק', 'בד טבעי ואיכותי המבטיח בטיחות ונוחות עבודה לאורך זמן', 'פתרון אידיאלי למקצוענים הזקוקים להגנה ממוקדת בתנאים מאתגרים'], sort_order:12 },
  { sku:'109',  name:'סווטשירט ייצוגי עם צווארון וכיס',    category:'סווטשירט',    colors:'אפור עכבר, אפור בהיר, שחור, כחול',    sizes:'S,M,L,XL,XXL,3XL', price:29,  fabric:'כותנה 20%, פוליאסטר 80%',       description:'',                                                                                             features:[], sort_order:13 },
  { sku:'108',  name:'סווצר ניקי',                         category:'מכופתרת',     colors:'אפור עכבר, אפור בהיר, שחור, כחול',    sizes:'S,M,L,XL,XXL,3XL', price:25,  fabric:'80% פוליאסטר, 20% כותנה',       description:'',                                                                                             features:[], sort_order:14 },
  { sku:'1410', name:'חולצה טקטית',                        category:'מכופתרת',     colors:'שחור, אפור',                          sizes:'S,M,L,XL,XXL,3XL', price:103, fabric:'פוליאסטר 100%',                 description:'קל, נושם, חזק במיוחד ועמיד לכביסות',                                                          features:['משקל בד 140 גרם למ"ר – אידיאלי לעבודה בתנאי שטח מאתגרים', 'הגנה מהשמש עם מסנן UPF – לשימוש ממושך גם בשמש ישירה', 'עיצוב טקטי עם כיסים ייחודיים – מראה מקצועי ופונקציונלי'], sort_order:15 },
  { sku:'310',  name:'ייצוגי קצר',                         category:'מכופתרת',     colors:'שחור, כחול',                          sizes:'S,M,L,XL,XXL,3XL', price:45,  fabric:'',                              description:'',                                                                                             features:[], sort_order:16 },
  { sku:'311',  name:'ייצוגי ארוך',                        category:'מכופתרת',     colors:'שחור, כחול',                          sizes:'S,M,L,XL,XXL,3XL', price:45,  fabric:'',                              description:'',                                                                                             features:[], sort_order:17 },
  { sku:'978',  name:'סופטשייל סטנדרטי',                   category:"ג'קט",        colors:'שחור',                                sizes:'S,M,L,XL,XXL,3XL', price:99,  fabric:'',                              description:'',                                                                                             features:[], sort_order:18 },
  { sku:'3539', name:'סופטשייל איכותי',                    category:"ג'קט",        colors:'שחור, כחול',                          sizes:'S,M,L,XL,XXL,3XL', price:119, fabric:'',                              description:'',                                                                                             features:[], sort_order:19 },
  { sku:'528N', name:"ג'קט פליז",                          category:"ג'קט",        colors:'שחור, כחול, אפור עכבר',              sizes:'S,M,L,XL,XXL,3XL', price:45,  fabric:'',                              description:'',                                                                                             features:[], sort_order:20 },
  { sku:'31',   name:'מכנסי עבודה גומי מלא',               category:'מכנסיים',     colors:'שחור, אפור עכבר',                     sizes:'S,M,L,XL,XXL,3XL', price:95,  fabric:'כותנה 35%, פוליאסטר 65%',       description:'מתאים לעבודה אינטנסיבית ושימוש יומיומי',                                                     features:['עמיד בפני כתמים וחומרי ניקוי', 'גומי בגב ובצדדים וסרט קשירה פנימי להתאמה מושלמת', '5 כיסים שימושיים – קדמיים, אחוריים וצדדיים', 'אידאלי לתעשייה, מטבחים, מרפאות, ניקיון ומעבדות'], sort_order:21 },
  { sku:'1334', name:'מכנסי עבודה מקצועיים',               category:'מכנסיים',     colors:'שחור, אפור עכבר',                     sizes:'S,M,L,XL,XXL,3XL', price:95,  fabric:'כותנה 100%',                    description:'תוכנן במיוחד עבור אנשי מקצוע בתנאי שטח מאתגרים',                                             features:['10 כיסים לאחסון יעיל של כלי עבודה ואביזרים בשטח', 'חיזוקי קורדורה בכל הכיסים לעמידות גבוהה בפני שחיקה', 'פאטצ\'ים כפולים באזור הברכיים לתמיכה, בידוד והגנה', 'גזרה נוחה ויציבה המאפשרת תנועה חופשית'], sort_order:22 },
  { sku:'32',   name:'מכנס נבאדה 2 חלקים עם רוכסנים',     category:'מכנסיים',     colors:'שחור, אפור עכבר',                     sizes:'S,M,L,XL,XXL,3XL', price:57,  fabric:'',                              description:'',                                                                                             features:[], sort_order:23 },
  { sku:'4',    name:'מכנס דגמ"ח אינדיאני',                category:'מכנסיים',     colors:'שחור, כחול, אפור עכבר',              sizes:'S,M,L,XL,XXL,3XL', price:32,  fabric:'כותנה 100%',                    description:'מכנס עבודה מקצועי המתאים לכל סביבת עבודה',                                                    features:['36 נקודות חיזוק וחיזוק כפול במפשעה', '6 כיסים מרווחים כולל כיסי סקוטש', 'גומי אלסטי בגב המכנס'], sort_order:24 },
  { sku:'364',  name:'כובע ברש',                           category:'כובעים',      colors:'שחור',                                sizes:'OS',               price:8,   fabric:'',                              description:'',                                                                                             features:[], sort_order:25 },
  { sku:'342',  name:'כובע דרייפיט קל',                    category:'כובעים',      colors:'שחור, אפור עכבר, כחול, אפור בהיר',   sizes:'OS',               price:8,   fabric:'',                              description:'',                                                                                             features:[], sort_order:26 },
]

// ─── מיפוי מק"ט → קובץ תמונה ───────────────────────────────────────────────
const IMAGE_MAP = {
  '101':  '101.jpg',
  '104':  '104_7.jpg',
  '1408': '1408_12.jpg',
  '106':  '106_6.jpg',
  '103':  '103.jpg',
  '235':  '235_2.jpg',
  '129':  '129.jpg',
  '1409': '1409_13.jpg',
  '109':  '109.jpg',
  '108':  '108.jpg',
  '1410': '1410_02 גב.jpg',
  '310':  '310.png',
  '311':  '311.jpg',
  '978':  '978_1.jpg',
  '3539': '3539_2.jpg',
  '528N': '528N.jpg',
  '1334': '1334 _02.jpg',
  '4':    '004.jpg',
}

// ─── עזרים ──────────────────────────────────────────────────────────────────
const BASE_URL = `https://api.airtable.com/v0/${BASE_ID}`
const HEADERS   = { Authorization: `Bearer ${PAT}`, 'Content-Type': 'application/json' }

async function api(path, opts = {}) {
  const res = await fetch(`${BASE_URL}/${path}`, { ...opts, headers: { ...HEADERS, ...opts.headers } })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error?.message || `Airtable ${res.status}`)
  return json
}

async function uploadImage(recordId, filename) {
  const filePath = path.join(IMAGES_DIR, filename)
  const buffer = fs.readFileSync(filePath)
  const mimeType = filename.endsWith('.png') ? 'image/png' : 'image/jpeg'
  const base64 = buffer.toString('base64')

  const res = await fetch(
    `https://content.airtable.com/v0/${BASE_ID}/${recordId}/image/uploadAttachment`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${PAT}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ contentType: mimeType, file: base64, filename })
    }
  )
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`Upload error ${res.status}: ${body}`)
  }
  return res.json()
}

// ─── ראשי ────────────────────────────────────────────────────────────────────
async function main() {
  // 1. שלוף את כל המוצרים הנוכחיים מ-Airtable
  console.log('\n📋 שולף רשומות נוכחיות מ-Airtable...')
  let current = []
  let offset = ''
  do {
    const d = await api(`Products?${offset ? 'offset='+offset : ''}`)
    current.push(...d.records)
    offset = d.offset || ''
  } while (offset)
  console.log(`   נמצאו ${current.length} מוצרים`)

  // 2. קבע אילו למחוק
  const excelSkus = new Set(EXCEL_PRODUCTS.map(p => p.sku))
  // גם ת.ז. "004" תואמת ל-"4"
  const normalizeSkuMatch = (atSku) => {
    if (excelSkus.has(atSku)) return true
    // "004" → "4" match
    const stripped = atSku.replace(/^0+/, '')
    return excelSkus.has(stripped)
  }

  const toDelete = current.filter(r => !normalizeSkuMatch(r.fields.sku || ''))
  const toKeep   = current.filter(r =>  normalizeSkuMatch(r.fields.sku || ''))

  console.log(`\n🗑  מוחק ${toDelete.length} מוצרים שאינם באקסל:`)
  for (const rec of toDelete) {
    console.log(`   ✗ ${rec.fields.sku} | ${rec.fields.name}`)
    await api(`Products/${rec.id}`, { method: 'DELETE' })
    await sleep(220)
  }

  // בנה map של sku→recordId מהרשומות שנשארות
  const existingBySku = {}
  for (const r of toKeep) {
    const sku = r.fields.sku || ''
    existingBySku[sku] = r.id
    // גם map "004" → record, כך ש-"4" תמצא דרכו
    const stripped = sku.replace(/^0+/, '')
    if (stripped !== sku) existingBySku[stripped] = r.id
  }

  // 3. עדכן / צור
  console.log(`\n🔄 מסנכרן ${EXCEL_PRODUCTS.length} מוצרים...`)
  for (const product of EXCEL_PRODUCTS) {
    const hasImage = Boolean(IMAGE_MAP[product.sku])
    const fields = {
      name:        product.name,
      sku:         product.sku,
      price:       product.price,
      category:    product.category,
      description: product.description || '',
      fabric:      product.fabric || '',
      colors:      product.colors,
      sizes:       product.sizes,
      features:    product.features.length ? product.features.join('\n') : '',
      active:      true,
      sort_order:  product.sort_order,
      ...(hasImage ? { image: [] } : {}) // נקה תמונה קיימת רק אם נעלה חדשה
    }

    let recordId = existingBySku[product.sku]

    if (recordId) {
      await api(`Products/${recordId}`, {
        method: 'PATCH',
        body: JSON.stringify({ fields, typecast: true })
      })
      console.log(`   ✏️  עודכן: ${product.sku} | ${product.name}`)
    } else {
      const res = await api('Products', {
        method: 'POST',
        body: JSON.stringify({ records: [{ fields }], typecast: true })
      })
      recordId = res.records[0].id
      console.log(`   ➕ נוצר:  ${product.sku} | ${product.name}`)
    }

    // 4. העלה תמונה אם קיימת
    if (hasImage) {
      await sleep(300)
      try {
        await uploadImage(recordId, IMAGE_MAP[product.sku])
        console.log(`   🖼  תמונה הועלתה: ${IMAGE_MAP[product.sku]}`)
      } catch (e) {
        console.error(`   ⚠️  שגיאת תמונה (${product.sku}): ${e.message}`)
      }
    }

    await sleep(220)
  }

  console.log('\n✅ סנכרון הושלם!')
}

main().catch(err => { console.error('❌ שגיאה:', err.message); process.exit(1) })
