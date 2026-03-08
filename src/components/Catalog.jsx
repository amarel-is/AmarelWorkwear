import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './Catalog.css'

const WORKWEAR_CATEGORIES = [
  'הכל',
  'טריקו',
  'דרייפיט',
  'פולו',
  'סווטשירט',
  'מכופתרת',
  "ג'קט",
  'מכנסיים',
  'נעלי בטיחות',
  'כובעים'
]

const SIZES = ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL']
const SHOE_SIZES = ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48']

const WORKWEAR_PRODUCTS = [
  {
    id: 1, sku: '101', name: 'חולצת טריקו שרוול קצר', price: 12, category: 'טריקו',
    fabric: '100% כותנה סרוקה', weight: '160 גרם למ"ר',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop',
    description: 'חולצת טריקו איכותית לעבודה יומיומית',
    colors: ['שחור', 'לבן', 'אפור', 'נייבי'],
    features: ['בד נבדק ע"י מכון התקנים הישראלי', 'ללא תפרי צד לנוחות מרבית', 'צווארון סרוג בגזרה רחבה במיוחד', 'מתאים לענף המזון'],
    sizes: SIZES
  },
  {
    id: 2, sku: '104', name: 'חולצת טריקו שרוול ארוך', price: 17, category: 'טריקו',
    fabric: '100% כותנה', weight: '160 גרם למ"ר',
    image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&h=600&fit=crop',
    description: 'חולצת טריקו ארוכה לעבודה בכל עונות השנה',
    colors: ['שחור', 'לבן', 'אפור', 'נייבי'],
    features: ['בד נבדק ע"י מכון התקנים הישראלי', 'חולצה ללא תפרי צד', 'מגט בסיומת השרוולים לבטיחות מרבית', 'מתאים לענף המזון'],
    sizes: SIZES
  },
  {
    id: 3, sku: '1408', name: 'חולצת דרייפיט מרתון שרוול קצר', price: 11, category: 'דרייפיט',
    fabric: '100% פוליאסטר', weight: '130 גרם',
    image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&h=600&fit=crop',
    description: 'מותאמת לאקלים הישראלי, קלה ונושמת לנוחות מקסימלית',
    colors: ['שחור', 'נייבי', 'לבן', 'אפור', 'פטרול'],
    features: ['בד דק ונושם – שרוול רגלן', 'משקל בד 130 גרם', 'מידות S-5XL', 'ייבוש מהיר ומנדפת זיעה'],
    sizes: SIZES
  },
  {
    id: 4, sku: '141', name: 'חולצת דרייפיט שרוול ארוך', price: 20, category: 'דרייפיט',
    fabric: '100% פוליאסטר', weight: '140 גרם למ"ר',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=600&fit=crop',
    description: 'בד עדין ואיכותי לנוחות מרבית בלבישה',
    colors: ['כחול כהה', 'שחור', 'אפור'],
    features: ['בד 100% פוליאסטר עדין במיוחד ללבישה', 'גזרה רחבה לעבודה', 'יכולת ידוף זיעה גבוהה המתאימה לאקלים הישראלי', 'בדיקת ידוף זיעה בוצעה במעבדת שקר'],
    sizes: SIZES
  },
  {
    id: 5, sku: '106', name: 'חולצת פולו שרוול קצר', price: 24, category: 'פולו',
    fabric: '60% כותנה, 40% פוליאסטר', weight: '210 גרם למ"ר',
    image: 'https://images.unsplash.com/photo-1625910513413-5fc7e5564942?w=600&h=600&fit=crop',
    description: 'שילוב בין נוחות לסגנון',
    colors: ['שחור', 'נייבי', 'לבן', 'אפור'],
    features: ['בד פיקה איכותי', 'מגט סרוג בשרוולים למראה ספורטיבי', 'צווארון סרוג', 'בד נבדק ע"י מכון התקנים הישראלי'],
    sizes: SIZES
  },
  {
    id: 6, sku: '103', name: 'חולצת פולו קצר עם כיס', price: 26, category: 'פולו',
    fabric: '100% כותנה', weight: '180 גרם למ"ר',
    image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736c10?w=600&h=600&fit=crop',
    description: 'קלאסיקה נוחה לעבודה וליומיום',
    colors: ['שחור', 'נייבי', 'לבן'],
    features: ['בד נבדק ע"י מכון התקנים הישראלי', 'טריקו לעבודה בגזרת פולו עם צווארון סרוג וכיס', '3 כפתורים בחזית החולצה', 'סיומת מגט סרוג בשרוולים'],
    sizes: SIZES
  },
  {
    id: 7, sku: '235', name: 'חולצת פולו דרייפיט ללא כיס', price: 27, category: 'פולו',
    fabric: '100% פוליאסטר', weight: '140 גרם למ"ר',
    image: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=600&h=600&fit=crop',
    description: 'למי שמעריך נוחות במהלך היום, עם בד קל ומנדף זיעה',
    colors: ['שחור', 'נייבי', 'אפור'],
    features: ['חולצה מדפת זיעה בגזרת פולו ספורטיבית עם צווארון', 'סיבי בד הדרייקול עובדו לדיפות מירבית לבגד', 'מתאים לפעילות ספורטיבית', 'בדיקת ידוף זיעה בוצעה במעבדת שקר'],
    sizes: SIZES
  },
  {
    id: 8, sku: '129', name: 'חולצת פולו דרייפיט קצר עם כיס', price: 20, category: 'פולו',
    fabric: '100% פוליאסטר', weight: '140 גרם למ"ר',
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=600&fit=crop',
    description: 'למי שמעריך נוחות במהלך היום, עם בד קל ומנדף זיעה',
    colors: ['שחור', 'נייבי', 'לבן'],
    features: ['חולצה מדפת זיעה בגזרת פולו ספורטיבית', 'כיס פנימי בחזית החולצה', 'סיבי בד הדרייקול עובדו לדיפות מירבית', 'מתאים לפעילות ספורטיבית'],
    sizes: SIZES
  },
  {
    id: 9, sku: '1409', name: 'חולצת פולו טקטית קצר', price: 55, category: 'פולו',
    fabric: '100% פוליאסטר', weight: '145 גרם',
    image: 'https://images.unsplash.com/photo-1564859228273-274232fdb516?w=600&h=600&fit=crop',
    description: 'עמידה, נושמת ומוכנה לשטח',
    colors: ['שחור', 'חאקי', 'אפור'],
    features: ['אלסטיות גבוהה, ייבוש מהיר והגנה מקרינת UV', 'כיס ייעודי לאוזנית וכיסים למחסניות בשרוול שמאל', 'קשר מתחת לתפרי הכתפיים', 'בד מדף ונעים ללבישה, ללא פילינג'],
    sizes: SIZES
  },
  {
    id: 10, sku: '133', name: 'סווטשירט עבודה 100% כותנה', price: 36, category: 'סווטשירט',
    fabric: '100% כותנה', weight: '300 גרם למ"ר',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=600&fit=crop',
    description: 'פתרון בטיחותי ונוח לסביבות עבודה רגישות',
    colors: ['כחול כהה', 'שחור', 'אפור'],
    features: ['פיתוח ייעודי לעבודות חשמל, סביבות אנטי-סטטיות, דלקים ונשק', 'בד טבעי ואיכותי המבטיח בטיחות ונוחות עבודה לאורך זמן', 'פתרון אידיאלי למקצוענים הזקוקים להגנה ממוקדת בתנאים מאתגרים', 'ראות גבוהה ואיכותית גם לאחר מספר רב של כביסות'],
    sizes: SIZES
  },
  {
    id: 11, sku: '108', name: 'סווטשירט ניקי', price: 25, category: 'סווטשירט',
    fabric: '80% פוליאסטר, 20% כותנה', weight: '300 גרם למ"ר',
    image: 'https://images.unsplash.com/photo-1578681994506-b8f463449011?w=600&h=600&fit=crop',
    description: 'עבה ומחמם במיוחד',
    colors: ['שחור', 'נייבי', 'אפור'],
    features: ['מגט סרוג ברוחב 6 ס"מ בחלק התחתון', 'מגטים בסיומת השרוולים לבטיחות מרבית', 'ראות גבוהה ואיכותית ללא כדוריות גם לאחר מספר רב של כביסות', 'בד נבדק ע"י מכון התקנים הישראלי'],
    sizes: SIZES
  },
  {
    id: 12, sku: '1410', name: 'חולצה טקטית משולבת שרוול ארוך', price: 103, category: 'מכופתרת',
    fabric: '100% פוליאסטר', weight: '145 גרם',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=600&fit=crop',
    description: 'קל, נושם, חזק במיוחד ועמיד לכביסות',
    colors: ['שחור', 'אפור'],
    features: ['משקל בד 145 גרם – אידיאלי לעבודה בתנאי שטח מאתגרים', 'שילוב בדי דרייפיט, רוכסנים, צווארון פולו עם רוכסן', 'פתח אוורור בבית השחי', 'מתאים לחברות שמירה ואבטחה, גופי ביטחון'],
    sizes: SIZES
  },
  {
    id: 13, sku: '310', name: 'חולצת סלים מכופתרת שרוול קצר', price: 45, category: 'מכופתרת',
    fabric: '76% כותנה, 30% פוליאסטר, 3% ספנדקס', weight: null,
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&h=600&fit=crop',
    description: 'חולצה אופנתית מכופתרת ללא כיס',
    colors: ['לבן', 'שחור', 'תכלת'],
    features: ['גזרת SLIM FIT צרה המותאמת לקהל צעיר יותר', 'צווארון ושיה בעיצוב עדכני', 'בד עדין ואיכותי', 'מתאים לבתי מלון, מסעדות, מלצרים, הייטק, שיווק וקבלת קהל'],
    sizes: SIZES
  },
  {
    id: 14, sku: '107', name: 'חולצת לקוסט שרוול ארוך עם כיס', price: 25, category: 'פולו',
    fabric: '60% כותנה, 40% פוליאסטר', weight: '210 גרם למ"ר',
    image: 'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=600&h=600&fit=crop',
    description: 'חולצת לקוסט שרוול ארוך עם כיס בחזית',
    colors: ['שחור', 'נייבי'],
    features: ['מגט בסיומת השרוולים לבטיחות ונוחות מרבית', 'כיס בחזית', 'בד פיקה איכותי 210 גרם למ"ר'],
    sizes: SIZES
  },
  {
    id: 15, sku: '143', name: 'חולצת פולו דרייפיט שרוול ארוך + כיס', price: 29, category: 'פולו',
    fabric: '100% פוליאסטר', weight: '140 גרם למ"ר',
    image: 'https://images.unsplash.com/photo-1618354691438-25bc04584c23?w=600&h=600&fit=crop',
    description: 'חולצה מדפת זיעה בגזרת פולו עם שרוול ארוך',
    colors: ['שחור', 'נייבי'],
    features: ['סיבי בד הדרייקול עובדו לדיפות מיידית', 'כיס שפתיים פנימי בחזית החולצה למראה נקי', 'מגטים בסיומת השרוולים לבטיחות מירבית ספורטיבית', 'נוחה ונעימה ללבישה'],
    sizes: SIZES
  },
  {
    id: 16, sku: '978', name: 'מעיל סופטשל עם פרווה', price: 99, category: "ג'קט",
    fabric: '94% פוליאסטר, 6% ספנדקס', weight: null,
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=600&fit=crop',
    description: 'שילוב מושלם של הגנה מגשם וקור',
    colors: ['שחור', 'נייבי', 'אפור'],
    features: ['עמידות למים 8000MM', 'יכולת אוורור 1000 MVP', 'בטנה פנימית דמוית פרווה לשמירה על חום הגוף', 'רוכסן קדמי מוגן ע"י פיסת בד פנימית להגנה מרוח', '5 כיסים מעוצבים בחזית המעיל'],
    sizes: SIZES
  },
  {
    id: 17, sku: '3539', name: 'מעיל סופטשל היברידי', price: 119, category: "ג'קט",
    fabric: '94% פוליאסטר, 6% אלסטן', weight: '340 גרם',
    image: 'https://images.unsplash.com/photo-1544923246-77307dd270b5?w=600&h=600&fit=crop',
    description: 'מעיל איכותי עם רוכסן גד מים ופרווה פנימית',
    colors: ['שחור', 'אפור', 'נייבי'],
    features: ['רוכסן קדמי גד מים מסיליקון', 'פרווה פנימית לשמירת חום גוף טובה יותר', 'רוכסי SBS איכותיים גד מים', 'בד ורוכסן גד גשם לאטימות מירבית', 'כיס חזה ולוגו רקום'],
    sizes: SIZES
  },
  {
    id: 18, sku: '3498', name: 'מעיל אלפיני', price: 99, category: "ג'קט",
    fabric: '100% פוליאסטר', weight: 'חיצוני 180 גרם, ביטנה 160 גרם',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=600&fit=crop',
    description: 'מעיל קל ואופנתי',
    colors: ['שחור', 'נייבי'],
    features: ['בד נבדק ע"י מכון התקנים הישראלי', 'מעיל קל ואופנתי', 'בד חיצוני 180 גרם + ביטנה 160 גרם'],
    sizes: SIZES
  },
  {
    id: 19, sku: '528N', name: "ג'קט פליז", price: 59, category: "ג'קט",
    fabric: 'מיקרו פליז 144F', weight: '350 גרם למ"ר',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=600&fit=crop&q=80',
    description: 'פליז איכותי מחמם במיוחד',
    colors: ['שחור', 'נייבי', 'אפור'],
    features: ['גזרה אופנתית וחדשית', '2 כיסים בצידי הפליז הנסגרים על ידי רוכסן', 'צווארון מבד סרוג', 'גומי בסיומת השרוולים'],
    sizes: SIZES
  },
  {
    id: 20, sku: '4211', name: 'מעיל CLOUD ביטנה פליז + כובע', price: 109, category: "ג'קט",
    fabric: null, weight: null,
    image: 'https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?w=600&h=600&fit=crop',
    description: 'מעיל עם ביטנת פליז וכובע מובנה',
    colors: ['כחול כהה', 'שחור'],
    features: ['ביטנת פליז לחימום מירבי', 'כובע מובנה', 'בד נבדק על ידי מכון התקנים הישראלי'],
    sizes: SIZES
  },
  {
    id: 21, sku: '31', name: 'מכנסי עבודה גומי מלא', price: 95, category: 'מכנסיים',
    fabric: '35% כותנה, 65% פוליאסטר', weight: null,
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&h=600&fit=crop',
    description: 'מתאים לעבודה אינטנסיבית ושימוש יומיומי',
    colors: ['שחור', 'נייבי', 'אפור'],
    features: ['עמיד בפני כתמים וחומרי ניקוי – שומר על מראה נקי לאורך זמן', 'גומי בגב ובצדדים וסרט קשירה פנימי להתאמה מושלמת', '5 כיסים שימושיים – קדמיים, אחוריים וצדדיים', 'אידיאלי לתעשייה, מטבחים, מרפאות, ניקיון ומעבדות'],
    sizes: SIZES
  },
  {
    id: 22, sku: '1334', name: 'מכנסי עבודה מקצועיים PRO', price: 95, category: 'מכנסיים',
    fabric: '97% כותנה, 3% ספנדקס, 320 GR', weight: '320 גרם',
    image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&h=600&fit=crop',
    description: 'תוכנן במיוחד עבור אנשי מקצוע בתנאי שטח מאתגרים',
    colors: ['שחור', 'אפור', 'זית'],
    features: ['כיסי קרגו הנסגרים באמצעות כפתור, עיצוב נוח וחדשי בעל אלסטיות', '2 כיסי שפה אחוריים', 'גזרת סלים', '10 כיסים לאחסון יעיל של כלי עבודה ואביזרים בשטח'],
    sizes: SIZES
  },
  {
    id: 23, sku: '004', name: 'מכנס דגמ"ח אינדיאני', price: 32, category: 'מכנסיים',
    fabric: '100% כותנה', weight: null,
    image: 'https://images.unsplash.com/photo-1517438476312-10d79c077509?w=600&h=600&fit=crop',
    description: 'מכנס עבודה מקצועי המתאים לכל סביבת עבודה',
    colors: ['שחור', 'זית', 'נייבי'],
    features: ['36 נקודות חיזוק וחיזוק כפול במפשעה', '6 כיסים מרווחים כולל כיסי סקוטש', 'גומי אלסטי בגב המכנס', 'אריגת טוויל 1/3', 'כפתור קדמי ממתכת'],
    sizes: SIZES
  },
  {
    id: 24, sku: '031', name: 'מכנסי דגמ"ח EXTREME', price: 95, category: 'מכנסיים',
    fabric: '97% כותנה, 3% ספנדקס', weight: null,
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=600&fit=crop',
    description: 'גזרת slim מחמיאה ונוחה',
    colors: ['שחור', 'אפור', 'קאמל', 'זית'],
    features: ['התאמה מושלמת לגוף – גומי מלא סביב המותניים ושרוך הידוק', 'עמיד וגמיש לנוחות מקסימלית', 'לכל משימה, בכל יום – מושלם לעבודות קלות ולשימוש יום-יומי'],
    sizes: SIZES
  },
  {
    id: 25, sku: '219', name: 'מכנסי מטיילים פטגוניה', price: 99, category: 'מכנסיים',
    fabric: '100% ניילון ריבסטופ', weight: null,
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=600&fit=crop&q=80',
    description: 'מכנסיים בטכנולוגיה חדשית עם יכולת ידוף גבוהה',
    colors: ['שחור', 'זית', 'אפור עכבר'],
    features: ['עשויים מבד קליל עם יכולת ידוף גבוהה', 'מתפרקים ומתחברים בקלות וביעילות ע"י רוכסן איכותי', 'ניתנים ללבישה כמכנסיים ארוכים ו/או כמכנסי ברמודה', '6 כיסים כולל 2 כיסים תחתונים מתפתחים', '36 חיזוקים כולל חיזוק מיוחד כפול באיזור המפשעה'],
    sizes: SIZES
  },
  {
    id: 26, sku: '3583', name: 'מכנס אוסטרלי ארוך', price: 95, category: 'מכנסיים',
    fabric: '90% ניילון, 10% ספנדקס', weight: null,
    image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&h=600&fit=crop',
    description: 'מכנס קרגו ארוך ניילון עם גומי בצדדים',
    colors: ['שחור', 'זית', 'אפור עכבר'],
    features: ['נוחות מירבית, 2 כיסי קרגו ו-2 כיסים אחוריים', 'בד דק אבל חזק, מדף, מתייבש מהר', 'בד גמיש בשילוב ניילון וספנדקס', 'גזרה צרה ואופנתית', 'חיזוקים בצדדים'],
    sizes: SIZES
  },
  {
    id: 27, sku: '032', name: 'מכנסי באדה', price: 57, category: 'מכנסיים',
    fabric: '100% כותנה קנבס', weight: '280 גרם למ"ר',
    image: 'https://images.unsplash.com/photo-1584865288642-42078afe6942?w=600&h=600&fit=crop',
    description: 'מכנסיים בעלי 9 כיסים ומראה אופנתי',
    colors: ['זית', 'שחור', 'נייבי'],
    features: ['9 כיסים – 2 כיסי אלכסון, 3 נסגרים ע"י רוכסן, 4 נסגרים ע"י כפתור חושת', 'בעל מראה אופנתי', 'לולאות חגורה רחבות', 'נוח ללבישה'],
    sizes: SIZES
  },
  {
    id: 28, sku: '666', name: 'נעל בטיחות אמיגו S3', price: 69, category: 'נעלי בטיחות',
    fabric: 'עור פרה', weight: null,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop',
    description: 'נעל בטיחות איכותית לסביבות עבודה מגוונות',
    colors: ['שחור'],
    features: ['תקן EN ISO 20345:2022', 'גפה העשויה מעור פרה חזק ועמיד', 'סוליה PU דו שכבתית עם התנגדות מצוינת להחלקה', 'כיפת מגן מתכתית', 'רפידת מגן מתכתית', 'מדרס עשוי EVA נוח במיוחד הזוכר את צורת כף הרגל'],
    sizes: SHOE_SIZES
  },
  {
    id: 29, sku: '1629', name: 'מגף דאלאס S3 חום', price: 149, category: 'נעלי בטיחות',
    fabric: 'עור פרה', weight: null,
    image: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600&h=600&fit=crop',
    description: 'מגף בטיחות מבית AUSTRALIAN לסביבות עבודה מגוונות',
    colors: ['חום'],
    features: ['תקן EN ISO 20345:2022', 'גפה עור פרה איכותי גמיש ועמיד', 'סוליה PU דו שכבתית עמידה בשמנים ודלקים (FO)', 'עמידות מצוינת להחלקה', 'כיפת מגן מתכת', 'רפידת מגן קוולאר, גמישה וקלה', 'מדרס PU מרופד ושלף בולם זעזועים'],
    sizes: SHOE_SIZES
  },
  {
    id: 30, sku: '1630', name: 'מגף שיקגו S3L שחור', price: 149, category: 'נעלי בטיחות',
    fabric: 'עור באפאלו', weight: null,
    image: 'https://images.unsplash.com/photo-1605812860427-4024433a70fd?w=600&h=600&fit=crop',
    description: 'מגף בטיחות מבית AUSTRALIAN לסביבות תעשייתיות',
    colors: ['שחור'],
    features: ['תקן EN ISO 20345:2022', 'גפה עור באפאלו איכותי חזק ועמיד', 'סוליה PU דו שכבתית עמידה בשמנים ודלקים (FO)', 'כיפת מגן ממתכת', 'רפידת מגן קוולאר, קלה וגמישה', 'מדרס PU מרופד רך ושלף בולם זעזועים'],
    sizes: SHOE_SIZES
  },
  {
    id: 31, sku: '1572', name: "מגף צ'לסי S3 ESD חום", price: 149, category: 'נעלי בטיחות',
    fabric: 'עור פרה הפוך', weight: null,
    image: 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=600&h=600&fit=crop',
    description: 'מגף בטיחות ESD לסביבות עבודה רגישות',
    colors: ['חום'],
    features: ['תקן EN ISO 20345:2011', 'גפה מעור פרה הפוך, איכותי ועמיד', 'סוליה PU דו שכבתית עם עמידות מצוינת להחלקה', 'כיפת מגן פיברגלס קלה וחזקה במיוחד', 'רפידת מגן אל מתכתית, קוולאר, קלה וגמישה', 'מדרס PU שלף בולם זעזועים', 'קטגוריית ESD – בעל יכולת פריקה אלקטרוסטטית'],
    sizes: SHOE_SIZES
  },
  {
    id: 32, sku: '1604', name: 'מגף וציה S3 חום – תוצרת איטליה', price: 219, category: 'נעלי בטיחות',
    fabric: 'עור NUBUK', weight: null,
    image: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=600&h=600&fit=crop',
    description: 'מגף פרימיום לסביבה קשה, תוצרת איטליה',
    colors: ['חום'],
    features: ['תקן EN ISO 20345', 'גפה: עור NUBUK', 'סוליה פוליאוריטן', 'לסביבה קשה, גמישה וקלה', 'דוחה חדירת מים', 'אנטיסטטית, מונעת החלקה, ללא מתכות', 'תוצרת איטליה'],
    sizes: SHOE_SIZES
  },
  {
    id: 33, sku: '1652', name: 'נעל EAGLE FTG S3S חום', price: 229, category: 'נעלי בטיחות',
    fabric: 'עור נובוק', weight: null,
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&h=600&fit=crop',
    description: 'נעל בטיחות מבית FTG לסביבות בנייה ותעשייה',
    colors: ['חום'],
    features: ['תקן EN ISO 20345:2022', 'גפה מעור נובוק איכותי חזק וגמיש', 'סוליה PU דו שכבתית עמידה בשמנים ודלקים (FO)', 'כיפת מגן אל מתכתית מחומרים מרוכבים', 'רפידת מגן אל מתכתית', 'מדרס בטכנולוגית FTG RELAX – מיכה לקשת כף הרגל', 'קטגוריית ESD'],
    sizes: SHOE_SIZES
  },
  {
    id: 34, sku: '1638', name: 'נעל NEW SKY S3S כחול', price: 239, category: 'נעלי בטיחות',
    fabric: 'עור נובוק בטכנולוגית BI-FRESH PLUS 3D', weight: null,
    image: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=600&h=600&fit=crop',
    description: 'נעל בטיחות בעיצוב ספורטיבי מבית BICAP',
    colors: ['אפור/כחול/אדום'],
    features: ['תקן EN ISO 20345:2022', 'עיצוב ספורטיבי', 'גפה מעור נובוק בטכנולוגית BI-FRESH PLUS 3D – עוטפת את הרגל ליציבות, מקסימום אוורור וידוף לחות', 'סוליה PU דו שכבתית עמידה בשמנים ודלקים (FO)', 'כיפת מגן בטכנולוגיית BI-SAFE', 'רפידת מגן אל מתכתית, קלת משקל, גמישה ובעלת בידוד תרמי מצוין', 'מדרס PU שלף בולם זעזועים וידוף נוזלים'],
    sizes: SHOE_SIZES
  },
  {
    id: 35, sku: '676', name: 'נעל הידרה S3 WR CI חום', price: 239, category: 'נעלי בטיחות',
    fabric: 'עור נובוק + ניילון', weight: null,
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&h=600&fit=crop',
    description: 'נעל בטיחות מבית BICAP לבנייה ולוגיסטיקה',
    colors: ['חום'],
    features: ['תקן EN ISO 20345:2011', 'גפה עור נובוק בשילוב ניילון עמיד למים, גמישה חזקה וקלה', 'סוליה PU דו שכבתית, מבודדת קור, עם מגרעת יעודית לעבודה על סולמות', 'כיפת מגן אל מתכתית מחומרים מרוכבים', 'רפידת מגן אל מתכתית, קלה וגמישה', 'מדרס GEL שלף ונוח במיוחד הבולם זעזועים באזור עקב הרגל'],
    sizes: SHOE_SIZES
  },
  {
    id: 36, sku: '364', name: 'כובע ברש 6 פנלים', price: 8, category: 'כובעים',
    fabric: '100% כותנה', weight: '300 גרם',
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c334e67a?w=600&h=600&fit=crop',
    description: 'כובע עם 6 פנלים ומצחיה',
    colors: ['שחור', 'נייבי', 'אפור'],
    features: ['כובע עם 6 פנלים ומצחיה', 'רצועה מתכוונת בחלק אחורי', 'מידה אחידה OS'],
    sizes: ['OS']
  },
  {
    id: 37, sku: '342', name: 'כובע דרייפיט קל', price: 9, category: 'כובעים',
    fabric: '100% פוליאסטר', weight: null,
    image: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=600&h=600&fit=crop',
    description: 'כובע קל ונושם מבד דרייפיט',
    colors: ['שחור', 'נייבי', 'לבן'],
    features: ['100% פוליאסטר דרייפיט', 'קל ונושם', 'מתאים לעבודה בחוץ'],
    sizes: ['OS']
  }
]

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.96 },
  visible: (i) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { delay: i * 0.06, duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }
  }),
  exit: { opacity: 0, scale: 0.92, transition: { duration: 0.2 } }
}

function ProductModal({ product, onClose, onAddToCart, isAdded }) {
  const [selectedSize, setSelectedSize] = useState('')

  if (!product) return null

  const handleAdd = () => {
    if (!selectedSize) return
    onAddToCart(product, selectedSize)
  }

  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="modal-content"
        initial={{ opacity: 0, y: 60, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.95 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={e => e.stopPropagation()}
      >
        <motion.button
          className="modal-close"
          onClick={onClose}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          ✕
        </motion.button>

        <img src={product.image} alt={product.name} className="modal-image" />

        <div className="modal-body">
          <span className="modal-category">{product.category}</span>
          <h2>{product.name}</h2>
          <span className="modal-sku">מק״ט: {product.sku}</span>

          <p className="modal-description">{product.description}</p>

          <div className="modal-details-grid">
            <div className="modal-detail-card">
              <span className="modal-detail-label">מחיר ליחידה</span>
              <span className="modal-detail-value price">₪{product.price}</span>
            </div>
            {product.fabric && (
              <div className="modal-detail-card">
                <span className="modal-detail-label">הרכב בד</span>
                <span className="modal-detail-value">{product.fabric}</span>
              </div>
            )}
            {product.weight && (
              <div className="modal-detail-card">
                <span className="modal-detail-label">משקל בד</span>
                <span className="modal-detail-value">{product.weight}</span>
              </div>
            )}
            {product.colors && (
              <div className="modal-detail-card">
                <span className="modal-detail-label">צבעים זמינים</span>
                <span className="modal-detail-value">{product.colors.join(', ')}</span>
              </div>
            )}
          </div>

          {product.features && product.features.length > 0 && (
            <div className="modal-features">
              <h4>מאפיינים</h4>
              <ul>
                {product.features.map((f, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.06 }}
                  >
                    <span className="feature-dot" />
                    {f}
                  </motion.li>
                ))}
              </ul>
            </div>
          )}

          <div className="modal-size-selector">
            <h4>בחירת {product.category === 'נעלי בטיחות' ? 'מידת נעל' : 'מידה'}</h4>
            <div className="size-options">
              {product.sizes.map(size => (
                <motion.button
                  key={size}
                  className={`size-option ${selectedSize === size ? 'active' : ''}`}
                  onClick={() => setSelectedSize(size)}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                >
                  {size}
                </motion.button>
              ))}
            </div>
          </div>

          <div className="modal-footer">
            <motion.button
              className={`modal-add-button ${isAdded ? 'added' : ''} ${!selectedSize ? 'disabled' : ''}`}
              onClick={handleAdd}
              whileHover={selectedSize ? { scale: 1.02 } : {}}
              whileTap={selectedSize ? { scale: 0.97 } : {}}
              disabled={!selectedSize}
            >
              {isAdded ? '✓ נוסף לסל בהצלחה' : !selectedSize ? 'יש לבחור מידה' : 'הוסף לסל'}
            </motion.button>
            <div className="modal-price-display">
              <span className="price-label">מחיר</span>
              <span className="price-value">₪{product.price}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function Catalog({ addToCart }) {
  const [selectedCategory, setSelectedCategory] = useState('הכל')
  const [addedToCart, setAddedToCart] = useState({})
  const [imageLoaded, setImageLoaded] = useState({})
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProduct, setSelectedProduct] = useState(null)

  const filteredProducts = useMemo(() => {
    let products = selectedCategory === 'הכל'
      ? WORKWEAR_PRODUCTS
      : WORKWEAR_PRODUCTS.filter(p => p.category === selectedCategory)

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase()
      products = products.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        (p.fabric && p.fabric.toLowerCase().includes(q))
      )
    }
    return products
  }, [selectedCategory, searchQuery])

  const handleAddToCart = (product, selectedSize) => {
    addToCart(product, selectedSize)
    setAddedToCart(prev => ({ ...prev, [product.id]: true }))
    setTimeout(() => {
      setAddedToCart(prev => ({ ...prev, [product.id]: false }))
    }, 2000)
  }

  return (
    <div className="catalog">
      <div className="catalog-container">
        <motion.div
          className="catalog-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <motion.span
            className="catalog-badge"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            קטלוג ביגוד עבודה – אמרל
          </motion.span>
          <h2>ביגוד עבודה מקצועי</h2>
          <p>בחרו את הביגוד המתאים לכם מתוך הקטלוג שלנו</p>
        </motion.div>

        <motion.div
          className="catalog-search"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <span className="search-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </span>
          <input
            type="text"
            placeholder="חיפוש לפי שם, מק״ט או הרכב בד..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </motion.div>

        <motion.div
          className="category-filter"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
        >
          {WORKWEAR_CATEGORIES.map((category, index) => (
            <motion.button
              key={category}
              className={`category-button ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.04 }}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        {searchQuery && (
          <motion.p
            className="search-results-count"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {filteredProducts.length} תוצאות נמצאו
          </motion.p>
        )}

        <motion.div className="gifts-grid" layout>
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                className="gift-card"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                custom={index}
                layout
                onClick={() => setSelectedProduct(product)}
              >
                <div className="gift-image-wrapper">
                  <motion.img
                    src={product.image}
                    alt={product.name}
                    className={`gift-image ${imageLoaded[product.id] ? 'loaded' : ''}`}
                    loading="lazy"
                    onLoad={() => setImageLoaded(prev => ({ ...prev, [product.id]: true }))}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.4 }}
                  />
                  <span className="gift-category-tag">{product.category}</span>
                </div>
                <div className="gift-info">
                  <div className="gift-info-top">
                    <span className="gift-sku">מק״ט: {product.sku}</span>
                  </div>
                  <h3>{product.name}</h3>
                  <p className="gift-description">{product.description}</p>
                  <div className="gift-meta">
                    {product.fabric && <span className="gift-supplier">{product.fabric}</span>}
                    {product.colors && (
                      <span className="gift-exchange-value">{product.colors.length} צבעים</span>
                    )}
                  </div>
                  <div className="gift-footer">
                    <span className="gift-price">₪{product.price}</span>
                    <motion.button
                      className="add-to-cart-button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedProduct(product)
                      }}
                      whileHover={{ scale: 1.06 }}
                      whileTap={{ scale: 0.92 }}
                    >
                      בחר מידה
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedProduct && (
          <ProductModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            onAddToCart={handleAddToCart}
            isAdded={addedToCart[selectedProduct.id]}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default Catalog
