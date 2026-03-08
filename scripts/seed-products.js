#!/usr/bin/env node
// Run with: node --env-file=.env scripts/seed-products.js

const PAT = process.env.VITE_AIRTABLE_PAT
const BASE_ID = process.env.VITE_AIRTABLE_BASE_ID

if (!PAT || !BASE_ID) {
  console.error('❌  Missing VITE_AIRTABLE_PAT or VITE_AIRTABLE_BASE_ID in .env')
  process.exit(1)
}

const API = `https://api.airtable.com/v0/${BASE_ID}/Products`
const HEADERS = {
  Authorization: `Bearer ${PAT}`,
  'Content-Type': 'application/json'
}

// ─── Product data ───────────────────────────────────────────────────────────

const SIZES = ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL']
const SHOE_SIZES = ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48']

const PRODUCTS = [
  { sku: '101', name: 'חולצת טריקו שרוול קצר', price: 12, category: 'טריקו', fabric: '100% כותנה סרוקה', weight: '160 גרם למ"ר', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop', description: 'חולצת טריקו איכותית לעבודה יומיומית', colors: 'שחור, לבן, אפור, נייבי', features: 'בד נבדק ע"י מכון התקנים הישראלי\nללא תפרי צד לנוחות מרבית\nצווארון סרוג בגזרה רחבה במיוחד\nמתאים לענף המזון', sizes: SIZES.join(','), sort_order: 1 },
  { sku: '104', name: 'חולצת טריקו שרוול ארוך', price: 17, category: 'טריקו', fabric: '100% כותנה', weight: '160 גרם למ"ר', image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&h=600&fit=crop', description: 'חולצת טריקו ארוכה לעבודה בכל עונות השנה', colors: 'שחור, לבן, אפור, נייבי', features: 'בד נבדק ע"י מכון התקנים הישראלי\nחולצה ללא תפרי צד\nמגט בסיומת השרוולים לבטיחות מרבית\nמתאים לענף המזון', sizes: SIZES.join(','), sort_order: 2 },
  { sku: '1408', name: 'חולצת דרייפיט מרתון שרוול קצר', price: 11, category: 'דרייפיט', fabric: '100% פוליאסטר', weight: '130 גרם', image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&h=600&fit=crop', description: 'מותאמת לאקלים הישראלי, קלה ונושמת לנוחות מקסימלית', colors: 'שחור, נייבי, לבן, אפור, פטרול', features: 'בד דק ונושם – שרוול רגלן\nמשקל בד 130 גרם\nמידות S-5XL\nייבוש מהיר ומנדפת זיעה', sizes: SIZES.join(','), sort_order: 3 },
  { sku: '141', name: 'חולצת דרייפיט שרוול ארוך', price: 20, category: 'דרייפיט', fabric: '100% פוליאסטר', weight: '140 גרם למ"ר', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=600&fit=crop', description: 'בד עדין ואיכותי לנוחות מרבית בלבישה', colors: 'כחול כהה, שחור, אפור', features: 'בד 100% פוליאסטר עדין במיוחד ללבישה\nגזרה רחבה לעבודה\nיכולת ידוף זיעה גבוהה המתאימה לאקלים הישראלי\nבדיקת ידוף זיעה בוצעה במעבדת שקר', sizes: SIZES.join(','), sort_order: 4 },
  { sku: '106', name: 'חולצת פולו שרוול קצר', price: 24, category: 'פולו', fabric: '60% כותנה, 40% פוליאסטר', weight: '210 גרם למ"ר', image: 'https://images.unsplash.com/photo-1625910513413-5fc7e5564942?w=600&h=600&fit=crop', description: 'שילוב בין נוחות לסגנון', colors: 'שחור, נייבי, לבן, אפור', features: 'בד פיקה איכותי\nמגט סרוג בשרוולים למראה ספורטיבי\nצווארון סרוג\nבד נבדק ע"י מכון התקנים הישראלי', sizes: SIZES.join(','), sort_order: 5 },
  { sku: '103', name: 'חולצת פולו קצר עם כיס', price: 26, category: 'פולו', fabric: '100% כותנה', weight: '180 גרם למ"ר', image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736c10?w=600&h=600&fit=crop', description: 'קלאסיקה נוחה לעבודה וליומיום', colors: 'שחור, נייבי, לבן', features: 'בד נבדק ע"י מכון התקנים הישראלי\nטריקו לעבודה בגזרת פולו עם צווארון סרוג וכיס\n3 כפתורים בחזית החולצה\nסיומת מגט סרוג בשרוולים', sizes: SIZES.join(','), sort_order: 6 },
  { sku: '235', name: 'חולצת פולו דרייפיט ללא כיס', price: 27, category: 'פולו', fabric: '100% פוליאסטר', weight: '140 גרם למ"ר', image: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=600&h=600&fit=crop', description: 'למי שמעריך נוחות במהלך היום, עם בד קל ומנדף זיעה', colors: 'שחור, נייבי, אפור', features: 'חולצה מדפת זיעה בגזרת פולו ספורטיבית עם צווארון\nסיבי בד הדרייקול עובדו לדיפות מירבית לבגד\nמתאים לפעילות ספורטיבית\nבדיקת ידוף זיעה בוצעה במעבדת שקר', sizes: SIZES.join(','), sort_order: 7 },
  { sku: '129', name: 'חולצת פולו דרייפיט קצר עם כיס', price: 20, category: 'פולו', fabric: '100% פוליאסטר', weight: '140 גרם למ"ר', image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=600&fit=crop', description: 'למי שמעריך נוחות במהלך היום, עם בד קל ומנדף זיעה', colors: 'שחור, נייבי, לבן', features: 'חולצה מדפת זיעה בגזרת פולו ספורטיבית\nכיס פנימי בחזית החולצה\nסיבי בד הדרייקול עובדו לדיפות מירבית\nמתאים לפעילות ספורטיבית', sizes: SIZES.join(','), sort_order: 8 },
  { sku: '1409', name: 'חולצת פולו טקטית קצר', price: 55, category: 'פולו', fabric: '100% פוליאסטר', weight: '145 גרם', image: 'https://images.unsplash.com/photo-1564859228273-274232fdb516?w=600&h=600&fit=crop', description: 'עמידה, נושמת ומוכנה לשטח', colors: 'שחור, חאקי, אפור', features: 'אלסטיות גבוהה, ייבוש מהיר והגנה מקרינת UV\nכיס ייעודי לאוזנית וכיסים למחסניות בשרוול שמאל\nקשר מתחת לתפרי הכתפיים\nבד מדף ונעים ללבישה, ללא פילינג', sizes: SIZES.join(','), sort_order: 9 },
  { sku: '133', name: 'סווטשירט עבודה 100% כותנה', price: 36, category: 'סווטשירט', fabric: '100% כותנה', weight: '300 גרם למ"ר', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=600&fit=crop', description: 'פתרון בטיחותי ונוח לסביבות עבודה רגישות', colors: 'כחול כהה, שחור, אפור', features: 'פיתוח ייעודי לעבודות חשמל, סביבות אנטי-סטטיות, דלקים ונשק\nבד טבעי ואיכותי המבטיח בטיחות ונוחות עבודה לאורך זמן\nפתרון אידיאלי למקצוענים הזקוקים להגנה ממוקדת בתנאים מאתגרים\nראות גבוהה ואיכותית גם לאחר מספר רב של כביסות', sizes: SIZES.join(','), sort_order: 10 },
  { sku: '108', name: 'סווטשירט ניקי', price: 25, category: 'סווטשירט', fabric: '80% פוליאסטר, 20% כותנה', weight: '300 גרם למ"ר', image: 'https://images.unsplash.com/photo-1578681994506-b8f463449011?w=600&h=600&fit=crop', description: 'עבה ומחמם במיוחד', colors: 'שחור, נייבי, אפור', features: 'מגט סרוג ברוחב 6 ס"מ בחלק התחתון\nמגטים בסיומת השרוולים לבטיחות מרבית\nראות גבוהה ואיכותית ללא כדוריות גם לאחר מספר רב של כביסות\nבד נבדק ע"י מכון התקנים הישראלי', sizes: SIZES.join(','), sort_order: 11 },
  { sku: '1410', name: 'חולצה טקטית משולבת שרוול ארוך', price: 103, category: 'מכופתרת', fabric: '100% פוליאסטר', weight: '145 גרם', image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=600&fit=crop', description: 'קל, נושם, חזק במיוחד ועמיד לכביסות', colors: 'שחור, אפור', features: 'משקל בד 145 גרם – אידיאלי לעבודה בתנאי שטח מאתגרים\nשילוב בדי דרייפיט, רוכסנים, צווארון פולו עם רוכסן\nפתח אוורור בבית השחי\nמתאים לחברות שמירה ואבטחה, גופי ביטחון', sizes: SIZES.join(','), sort_order: 12 },
  { sku: '310', name: 'חולצת סלים מכופתרת שרוול קצר', price: 45, category: 'מכופתרת', fabric: '76% כותנה, 30% פוליאסטר, 3% ספנדקס', weight: '', image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&h=600&fit=crop', description: 'חולצה אופנתית מכופתרת ללא כיס', colors: 'לבן, שחור, תכלת', features: 'גזרת SLIM FIT צרה המותאמת לקהל צעיר יותר\nצווארון ושיה בעיצוב עדכני\nבד עדין ואיכותי\nמתאים לבתי מלון, מסעדות, מלצרים, הייטק, שיווק וקבלת קהל', sizes: SIZES.join(','), sort_order: 13 },
  { sku: '107', name: 'חולצת לקוסט שרוול ארוך עם כיס', price: 25, category: 'פולו', fabric: '60% כותנה, 40% פוליאסטר', weight: '210 גרם למ"ר', image: 'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=600&h=600&fit=crop', description: 'חולצת לקוסט שרוול ארוך עם כיס בחזית', colors: 'שחור, נייבי', features: 'מגט בסיומת השרוולים לבטיחות ונוחות מרבית\nכיס בחזית\nבד פיקה איכותי 210 גרם למ"ר', sizes: SIZES.join(','), sort_order: 14 },
  { sku: '143', name: 'חולצת פולו דרייפיט שרוול ארוך + כיס', price: 29, category: 'פולו', fabric: '100% פוליאסטר', weight: '140 גרם למ"ר', image: 'https://images.unsplash.com/photo-1618354691438-25bc04584c23?w=600&h=600&fit=crop', description: 'חולצה מדפת זיעה בגזרת פולו עם שרוול ארוך', colors: 'שחור, נייבי', features: 'סיבי בד הדרייקול עובדו לדיפות מיידית\nכיס שפתיים פנימי בחזית החולצה למראה נקי\nמגטים בסיומת השרוולים לבטיחות מירבית ספורטיבית\nנוחה ונעימה ללבישה', sizes: SIZES.join(','), sort_order: 15 },
  { sku: '978', name: 'מעיל סופטשל עם פרווה', price: 99, category: "ג'קט", fabric: '94% פוליאסטר, 6% ספנדקס', weight: '', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=600&fit=crop', description: 'שילוב מושלם של הגנה מגשם וקור', colors: 'שחור, נייבי, אפור', features: 'עמידות למים 8000MM\nיכולת אוורור 1000 MVP\nבטנה פנימית דמוית פרווה לשמירה על חום הגוף\nרוכסן קדמי מוגן ע"י פיסת בד פנימית להגנה מרוח\n5 כיסים מעוצבים בחזית המעיל', sizes: SIZES.join(','), sort_order: 16 },
  { sku: '3539', name: 'מעיל סופטשל היברידי', price: 119, category: "ג'קט", fabric: '94% פוליאסטר, 6% אלסטן', weight: '340 גרם', image: 'https://images.unsplash.com/photo-1544923246-77307dd270b5?w=600&h=600&fit=crop', description: 'מעיל איכותי עם רוכסן גד מים ופרווה פנימית', colors: 'שחור, אפור, נייבי', features: 'רוכסן קדמי גד מים מסיליקון\nפרווה פנימית לשמירת חום גוף טובה יותר\nרוכסי SBS איכותיים גד מים\nבד ורוכסן גד גשם לאטימות מירבית\nכיס חזה ולוגו רקום', sizes: SIZES.join(','), sort_order: 17 },
  { sku: '3498', name: 'מעיל אלפיני', price: 99, category: "ג'קט", fabric: '100% פוליאסטר', weight: 'חיצוני 180 גרם, ביטנה 160 גרם', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=600&fit=crop', description: 'מעיל קל ואופנתי', colors: 'שחור, נייבי', features: 'בד נבדק ע"י מכון התקנים הישראלי\nמעיל קל ואופנתי\nבד חיצוני 180 גרם + ביטנה 160 גרם', sizes: SIZES.join(','), sort_order: 18 },
  { sku: '528N', name: "ג'קט פליז", price: 59, category: "ג'קט", fabric: 'מיקרו פליז 144F', weight: '350 גרם למ"ר', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=600&fit=crop&q=80', description: 'פליז איכותי מחמם במיוחד', colors: 'שחור, נייבי, אפור', features: 'גזרה אופנתית וחדשית\n2 כיסים בצידי הפליז הנסגרים על ידי רוכסן\nצווארון מבד סרוג\nגומי בסיומת השרוולים', sizes: SIZES.join(','), sort_order: 19 },
  { sku: '4211', name: 'מעיל CLOUD ביטנה פליז + כובע', price: 109, category: "ג'קט", fabric: '', weight: '', image: 'https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?w=600&h=600&fit=crop', description: 'מעיל עם ביטנת פליז וכובע מובנה', colors: 'כחול כהה, שחור', features: 'ביטנת פליז לחימום מירבי\nכובע מובנה\nבד נבדק על ידי מכון התקנים הישראלי', sizes: SIZES.join(','), sort_order: 20 },
  { sku: '31', name: 'מכנסי עבודה גומי מלא', price: 95, category: 'מכנסיים', fabric: '35% כותנה, 65% פוליאסטר', weight: '', image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&h=600&fit=crop', description: 'מתאים לעבודה אינטנסיבית ושימוש יומיומי', colors: 'שחור, נייבי, אפור', features: 'עמיד בפני כתמים וחומרי ניקוי – שומר על מראה נקי לאורך זמן\nגומי בגב ובצדדים וסרט קשירה פנימי להתאמה מושלמת\n5 כיסים שימושיים – קדמיים, אחוריים וצדדיים\nאידיאלי לתעשייה, מטבחים, מרפאות, ניקיון ומעבדות', sizes: SIZES.join(','), sort_order: 21 },
  { sku: '1334', name: 'מכנסי עבודה מקצועיים PRO', price: 95, category: 'מכנסיים', fabric: '97% כותנה, 3% ספנדקס, 320 GR', weight: '320 גרם', image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&h=600&fit=crop', description: 'תוכנן במיוחד עבור אנשי מקצוע בתנאי שטח מאתגרים', colors: 'שחור, אפור, זית', features: 'כיסי קרגו הנסגרים באמצעות כפתור, עיצוב נוח וחדשי בעל אלסטיות\n2 כיסי שפה אחוריים\nגזרת סלים\n10 כיסים לאחסון יעיל של כלי עבודה ואביזרים בשטח', sizes: SIZES.join(','), sort_order: 22 },
  { sku: '004', name: 'מכנס דגמ"ח אינדיאני', price: 32, category: 'מכנסיים', fabric: '100% כותנה', weight: '', image: 'https://images.unsplash.com/photo-1517438476312-10d79c077509?w=600&h=600&fit=crop', description: 'מכנס עבודה מקצועי המתאים לכל סביבת עבודה', colors: 'שחור, זית, נייבי', features: '36 נקודות חיזוק וחיזוק כפול במפשעה\n6 כיסים מרווחים כולל כיסי סקוטש\nגומי אלסטי בגב המכנס\nאריגת טוויל 1/3\nכפתור קדמי ממתכת', sizes: SIZES.join(','), sort_order: 23 },
  { sku: '031', name: 'מכנסי דגמ"ח EXTREME', price: 95, category: 'מכנסיים', fabric: '97% כותנה, 3% ספנדקס', weight: '', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=600&fit=crop', description: 'גזרת slim מחמיאה ונוחה', colors: 'שחור, אפור, קאמל, זית', features: 'התאמה מושלמת לגוף – גומי מלא סביב המותניים ושרוך הידוק\nעמיד וגמיש לנוחות מקסימלית\nלכל משימה, בכל יום – מושלם לעבודות קלות ולשימוש יום-יומי', sizes: SIZES.join(','), sort_order: 24 },
  { sku: '219', name: 'מכנסי מטיילים פטגוניה', price: 99, category: 'מכנסיים', fabric: '100% ניילון ריבסטופ', weight: '', image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=600&fit=crop&q=80', description: 'מכנסיים בטכנולוגיה חדשית עם יכולת ידוף גבוהה', colors: 'שחור, זית, אפור עכבר', features: 'עשויים מבד קליל עם יכולת ידוף גבוהה\nמתפרקים ומתחברים בקלות וביעילות ע"י רוכסן איכותי\nניתנים ללבישה כמכנסיים ארוכים ו/או כמכנסי ברמודה\n6 כיסים כולל 2 כיסים תחתונים מתפתחים\n36 חיזוקים כולל חיזוק מיוחד כפול באיזור המפשעה', sizes: SIZES.join(','), sort_order: 25 },
  { sku: '3583', name: 'מכנס אוסטרלי ארוך', price: 95, category: 'מכנסיים', fabric: '90% ניילון, 10% ספנדקס', weight: '', image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&h=600&fit=crop', description: 'מכנס קרגו ארוך ניילון עם גומי בצדדים', colors: 'שחור, זית, אפור עכבר', features: 'נוחות מירבית, 2 כיסי קרגו ו-2 כיסים אחוריים\nבד דק אבל חזק, מדף, מתייבש מהר\nבד גמיש בשילוב ניילון וספנדקס\nגזרה צרה ואופנתית\nחיזוקים בצדדים', sizes: SIZES.join(','), sort_order: 26 },
  { sku: '032', name: 'מכנסי באדה', price: 57, category: 'מכנסיים', fabric: '100% כותנה קנבס', weight: '280 גרם למ"ר', image: 'https://images.unsplash.com/photo-1584865288642-42078afe6942?w=600&h=600&fit=crop', description: 'מכנסיים בעלי 9 כיסים ומראה אופנתי', colors: 'זית, שחור, נייבי', features: '9 כיסים – 2 כיסי אלכסון, 3 נסגרים ע"י רוכסן, 4 נסגרים ע"י כפתור חושת\nבעל מראה אופנתי\nלולאות חגורה רחבות\nנוח ללבישה', sizes: SIZES.join(','), sort_order: 27 },
  { sku: '666', name: 'נעל בטיחות אמיגו S3', price: 69, category: 'נעלי בטיחות', fabric: 'עור פרה', weight: '', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop', description: 'נעל בטיחות איכותית לסביבות עבודה מגוונות', colors: 'שחור', features: 'תקן EN ISO 20345:2022\nגפה העשויה מעור פרה חזק ועמיד\nסוליה PU דו שכבתית עם התנגדות מצוינת להחלקה\nכיפת מגן מתכתית\nרפידת מגן מתכתית\nמדרס עשוי EVA נוח במיוחד הזוכר את צורת כף הרגל', sizes: SHOE_SIZES.join(','), sort_order: 28 },
  { sku: '1629', name: 'מגף דאלאס S3 חום', price: 149, category: 'נעלי בטיחות', fabric: 'עור פרה', weight: '', image: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600&h=600&fit=crop', description: 'מגף בטיחות מבית AUSTRALIAN לסביבות עבודה מגוונות', colors: 'חום', features: 'תקן EN ISO 20345:2022\nגפה עור פרה איכותי גמיש ועמיד\nסוליה PU דו שכבתית עמידה בשמנים ודלקים (FO)\nעמידות מצוינת להחלקה\nכיפת מגן מתכת\nרפידת מגן קוולאר, גמישה וקלה\nמדרס PU מרופד ושלף בולם זעזועים', sizes: SHOE_SIZES.join(','), sort_order: 29 },
  { sku: '1630', name: 'מגף שיקגו S3L שחור', price: 149, category: 'נעלי בטיחות', fabric: 'עור באפאלו', weight: '', image: 'https://images.unsplash.com/photo-1605812860427-4024433a70fd?w=600&h=600&fit=crop', description: 'מגף בטיחות מבית AUSTRALIAN לסביבות תעשייתיות', colors: 'שחור', features: 'תקן EN ISO 20345:2022\nגפה עור באפאלו איכותי חזק ועמיד\nסוליה PU דו שכבתית עמידה בשמנים ודלקים (FO)\nכיפת מגן ממתכת\nרפידת מגן קוולאר, קלה וגמישה\nמדרס PU מרופד רך ושלף בולם זעזועים', sizes: SHOE_SIZES.join(','), sort_order: 30 },
  { sku: '1572', name: "מגף צ'לסי S3 ESD חום", price: 149, category: 'נעלי בטיחות', fabric: 'עור פרה הפוך', weight: '', image: 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=600&h=600&fit=crop', description: 'מגף בטיחות ESD לסביבות עבודה רגישות', colors: 'חום', features: 'תקן EN ISO 20345:2011\nגפה מעור פרה הפוך, איכותי ועמיד\nסוליה PU דו שכבתית עם עמידות מצוינת להחלקה\nכיפת מגן פיברגלס קלה וחזקה במיוחד\nרפידת מגן אל מתכתית, קוולאר, קלה וגמישה\nמדרס PU שלף בולם זעזועים\nקטגוריית ESD – בעל יכולת פריקה אלקטרוסטטית', sizes: SHOE_SIZES.join(','), sort_order: 31 },
  { sku: '1604', name: 'מגף וציה S3 חום – תוצרת איטליה', price: 219, category: 'נעלי בטיחות', fabric: 'עור NUBUK', weight: '', image: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=600&h=600&fit=crop', description: 'מגף פרימיום לסביבה קשה, תוצרת איטליה', colors: 'חום', features: 'תקן EN ISO 20345\nגפה: עור NUBUK\nסוליה פוליאוריטן\nלסביבה קשה, גמישה וקלה\nדוחה חדירת מים\nאנטיסטטית, מונעת החלקה, ללא מתכות\nתוצרת איטליה', sizes: SHOE_SIZES.join(','), sort_order: 32 },
  { sku: '1652', name: 'נעל EAGLE FTG S3S חום', price: 229, category: 'נעלי בטיחות', fabric: 'עור נובוק', weight: '', image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&h=600&fit=crop', description: 'נעל בטיחות מבית FTG לסביבות בנייה ותעשייה', colors: 'חום', features: 'תקן EN ISO 20345:2022\nגפה מעור נובוק איכותי חזק וגמיש\nסוליה PU דו שכבתית עמידה בשמנים ודלקים (FO)\nכיפת מגן אל מתכתית מחומרים מרוכבים\nרפידת מגן אל מתכתית\nמדרס בטכנולוגית FTG RELAX – מיכה לקשת כף הרגל\nקטגוריית ESD', sizes: SHOE_SIZES.join(','), sort_order: 33 },
  { sku: '1638', name: 'נעל NEW SKY S3S כחול', price: 239, category: 'נעלי בטיחות', fabric: 'עור נובוק בטכנולוגית BI-FRESH PLUS 3D', weight: '', image: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=600&h=600&fit=crop', description: 'נעל בטיחות בעיצוב ספורטיבי מבית BICAP', colors: 'אפור/כחול/אדום', features: 'תקן EN ISO 20345:2022\nעיצוב ספורטיבי\nגפה מעור נובוק בטכנולוגית BI-FRESH PLUS 3D – עוטפת את הרגל ליציבות, מקסימום אוורור וידוף לחות\nסוליה PU דו שכבתית עמידה בשמנים ודלקים (FO)\nכיפת מגן בטכנולוגיית BI-SAFE\nרפידת מגן אל מתכתית, קלת משקל, גמישה ובעלת בידוד תרמי מצוין\nמדרס PU שלף בולם זעזועים וידוף נוזלים', sizes: SHOE_SIZES.join(','), sort_order: 34 },
  { sku: '676', name: 'נעל הידרה S3 WR CI חום', price: 239, category: 'נעלי בטיחות', fabric: 'עור נובוק + ניילון', weight: '', image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&h=600&fit=crop', description: 'נעל בטיחות מבית BICAP לבנייה ולוגיסטיקה', colors: 'חום', features: 'תקן EN ISO 20345:2011\nגפה עור נובוק בשילוב ניילון עמיד למים, גמישה חזקה וקלה\nסוליה PU דו שכבתית, מבודדת קור, עם מגרעת יעודית לעבודה על סולמות\nכיפת מגן אל מתכתית מחומרים מרוכבים\nרפידת מגן אל מתכתית, קלה וגמישה\nמדרס GEL שלף ונוח במיוחד הבולם זעזועים באזור עקב הרגל', sizes: SHOE_SIZES.join(','), sort_order: 35 },
  { sku: '364', name: 'כובע ברש 6 פנלים', price: 8, category: 'כובעים', fabric: '100% כותנה', weight: '300 גרם', image: 'https://images.unsplash.com/photo-1588850561407-ed78c334e67a?w=600&h=600&fit=crop', description: 'כובע עם 6 פנלים ומצחיה', colors: 'שחור, נייבי, אפור', features: 'כובע עם 6 פנלים ומצחיה\nרצועה מתכוונת בחלק אחורי\nמידה אחידה OS', sizes: 'OS', sort_order: 36 },
  { sku: '342', name: 'כובע דרייפיט קל', price: 9, category: 'כובעים', fabric: '100% פוליאסטר', weight: '', image: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=600&h=600&fit=crop', description: 'כובע קל ונושם מבד דרייפיט', colors: 'שחור, נייבי, לבן', features: '100% פוליאסטר דרייפיט\nקל ונושם\nמתאים לעבודה בחוץ', sizes: 'OS', sort_order: 37 },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

function toAirtableFields(p) {
  const fields = {
    name: p.name,
    sku: p.sku,
    price: p.price,
    category: p.category,
    description: p.description,
    colors: p.colors,
    features: p.features,
    sizes: p.sizes,
    active: true,
    sort_order: p.sort_order,
  }
  if (p.fabric) fields.fabric = p.fabric
  if (p.weight) fields.weight = p.weight
  // Attachment field — Airtable fetches the image from the URL
  if (p.image) fields.image = [{ url: p.image }]
  return fields
}

async function createBatch(records) {
  const res = await fetch(API, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify({
      records: records.map(fields => ({ fields })),
      typecast: true,
    }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error?.message || `HTTP ${res.status}`)
  }
  return res.json()
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function seed() {
  console.log(`🌱  Seeding ${PRODUCTS.length} products into Airtable base ${BASE_ID}…\n`)

  const fields = PRODUCTS.map(toAirtableFields)
  const BATCH = 10 // Airtable max per request

  for (let i = 0; i < fields.length; i += BATCH) {
    const batch = fields.slice(i, i + BATCH)
    const from = i + 1
    const to = Math.min(i + BATCH, fields.length)
    process.stdout.write(`  ⏳  Creating records ${from}–${to}…`)
    await createBatch(batch)
    console.log(' ✅')
    // Respect Airtable rate limit (5 req/s)
    if (i + BATCH < fields.length) await new Promise(r => setTimeout(r, 250))
  }

  console.log(`\n✅  Done! ${PRODUCTS.length} products created.`)
}

seed().catch(err => {
  console.error('\n❌  Seed failed:', err.message)
  process.exit(1)
})
