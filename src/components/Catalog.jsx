import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './Catalog.css'

const GIFT_CATEGORIES = [
  'הכל',
  'טכנולוגיה',
  'בית ומטבח',
  'ספורט ופנאי',
  'אופנה ואקססוריז',
  'ספרים ותרבות'
]

const SAMPLE_GIFTS = [
  {
    id: 1, sku: 'TEC-BT-001', name: 'אוזניות Bluetooth מתקדמות', price: 299, exchangeValue: 280,
    supplier: 'SoundMax', category: 'טכנולוגיה',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop',
    description: 'איכות צליל מעולה עם ביטול רעשים אקטיבי',
    longDescription: 'אוזניות אלחוטיות פרימיום עם טכנולוגיית ביטול רעשים אקטיבי (ANC), סוללה עד 30 שעות, חיבור Bluetooth 5.3 יציב, ומיקרופון מובנה לשיחות. עיצוב ארגונומי עם כריות אוזן מזיכרון קצף לנוחות מרבית.',
    features: ['ביטול רעשים אקטיבי (ANC)', 'סוללה עד 30 שעות', 'Bluetooth 5.3', 'מיקרופון מובנה HD', 'כריות אוזן מזיכרון קצף']
  },
  {
    id: 2, sku: 'HOM-CF-002', name: 'מארז קפה איכותי', price: 149, exchangeValue: 130,
    supplier: 'קפה עלית', category: 'בית ומטבח',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&h=600&fit=crop',
    description: 'מבחר קפסולות קפה פרימיום מרחבי העולם',
    longDescription: 'מארז מפנק הכולל 40 קפסולות קפה מובחרות ממיטב מטעי הקפה בעולם: אתיופיה, קולומביה, ברזיל וגואטמלה. כל קפסולה מכילה קפה טחון טרי שנצלה בקפידה. מתאים למכונות נספרסו.',
    features: ['40 קפסולות פרימיום', '4 מקורות שונים', 'צלייה טרייה', 'תואם מכונות נספרסו', 'אריזה אקולוגית']
  },
  {
    id: 3, sku: 'SPR-BT-003', name: 'בקבוק תרמי חכם', price: 189, exchangeValue: 170,
    supplier: 'ThermoTech', category: 'ספורט ופנאי',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&h=600&fit=crop',
    description: 'שומר על טמפרטורה עד 24 שעות',
    longDescription: 'בקבוק תרמי חכם עם תצוגת LED מובנית במכסה שמראה את טמפרטורת המשקה בזמן אמת. בידוד ואקום כפול שומר על שתייה חמה 12 שעות או קרה 24 שעות. נפח 500 מ"ל, עשוי נירוסטה 304 איכותית.',
    features: ['תצוגת טמפרטורה LED', 'בידוד ואקום כפול', 'חם 12 שעות / קר 24 שעות', 'נירוסטה 304', 'נפח 500 מ"ל']
  },
  {
    id: 4, sku: 'FSH-BG-004', name: 'תיק גב עור איכותי', price: 449, exchangeValue: 420,
    supplier: 'LeatherCraft', category: 'אופנה ואקססוריז',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop',
    description: 'עיצוב מודרני ואלגנטי לעבודה וטיולים',
    longDescription: 'תיק גב יוקרתי מעור PU איכותי בעיצוב מינימליסטי. תא מרופד למחשב נייד עד 15.6 אינץ\', מספר תאי אחסון פנימיים, כיס נגד גניבה בגב, ורצועות כתף מרופדות. מושלם לעבודה ולטיולים.',
    features: ['עור PU פרימיום', 'תא מחשב עד 15.6"', 'כיס נגד גניבה', 'רצועות מרופדות', 'עמיד במים']
  },
  {
    id: 5, sku: 'CUL-PN-005', name: 'סט כלי כתיבה מעוצב', price: 199, exchangeValue: 180,
    supplier: 'PenArt', category: 'ספרים ותרבות',
    image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=600&h=600&fit=crop',
    description: 'עט נובע איכותי עם נרתיק מהודר',
    longDescription: 'סט כתיבה יוקרתי הכולל עט נובע עם ציפורן זהב 14K, עט כדורי תואם, ונרתיק עור מהודר. העט מגיע עם בקבוקון דיו כחול ומחסנית חלופית. מתנה מושלמת לאוהבי כתיבה ואלגנטיות.',
    features: ['ציפורן זהב 14K', 'נרתיק עור אמיתי', 'עט כדורי תואם', 'בקבוקון דיו כלול', 'אריזת מתנה מהודרת']
  },
  {
    id: 6, sku: 'TEC-SP-006', name: 'רמקול נייד עמיד במים', price: 279, exchangeValue: 260,
    supplier: 'SoundMax', category: 'טכנולוגיה',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=600&fit=crop',
    description: 'צליל עוצמתי עם בס מרשים',
    longDescription: 'רמקול Bluetooth נייד עם הגנה מפני מים ואבק ברמת IP67. עוצמת שיא של 20W עם בס מודגש. סוללה ל-12 שעות השמעה רצופה. אפשרות לחיבור שני רמקולים יחד לסטריאו. עיצוב קומפקטי וקל.',
    features: ['עמידות IP67', 'עוצמה 20W', 'סוללה 12 שעות', 'חיבור סטריאו זוגי', 'מיקרופון מובנה']
  },
  {
    id: 7, sku: 'TEC-MG-007', name: 'מעמד מגנטי לטלפון', price: 129, exchangeValue: 110,
    supplier: 'GadgetPro', category: 'טכנולוגיה',
    image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&h=600&fit=crop',
    description: 'מתאים לרכב ולשולחן העבודה',
    longDescription: 'מעמד מגנטי אוניברסלי עם מגנטים חזקים מסוג N52 לאחיזה יציבה ובטוחה. כולל שני ראשי חיבור: אחד לרכב (פתח אוורור) ואחד לשולחן העבודה. סיבוב 360 מעלות לכל כיוון. תואם לכל הטלפונים כולל MagSafe.',
    features: ['מגנטים N52 חזקים', 'שני ראשי חיבור', 'סיבוב 360°', 'תואם MagSafe', 'התקנה קלה']
  },
  {
    id: 8, sku: 'HOM-CH-008', name: 'מארז שוקולד בלגי', price: 169, exchangeValue: 150,
    supplier: 'Belgian Delights', category: 'בית ומטבח',
    image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=600&h=600&fit=crop',
    description: 'שוקולד יוקרתי בעבודת יד',
    longDescription: 'מארז מפואר של 24 פרלינים בלגיים עשויים בעבודת יד משוקולד מריר, חלב ולבן. כל פרלין מכיל מילוי ייחודי: גנאש, קרמל מלוח, פרלין אגוזים ומוס פירות. באריזת מתנה אלגנטית עם סרט.',
    features: ['24 פרלינים בעבודת יד', 'שוקולד בלגי מובחר', 'מגוון מילויים', 'אריזת מתנה מפוארת', 'כשר למהדרין']
  },
  {
    id: 9, sku: 'SPR-WT-009', name: 'שעון ספורט חכם', price: 599, exchangeValue: 560,
    supplier: 'FitTech', category: 'ספורט ופנאי',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop',
    description: 'מעקב אחר פעילות גופנית ובריאות',
    longDescription: 'שעון ספורט חכם עם מסך AMOLED צבעוני 1.4 אינץ\', GPS מובנה, מד דופק ורמת חמצן בדם. תמיכה ב-100+ פרופילי ספורט, מעקב שינה, וסוללה עד 14 יום. עמיד במים עד 50 מטר. תואם iOS ו-Android.',
    features: ['מסך AMOLED 1.4"', 'GPS מובנה', 'מד דופק + SpO2', '100+ פרופילי ספורט', 'סוללה עד 14 יום']
  },
  {
    id: 10, sku: 'FSH-BR-010', name: 'צמיד עור מעוצב', price: 89, exchangeValue: 75,
    supplier: 'LeatherCraft', category: 'אופנה ואקססוריז',
    image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=600&h=600&fit=crop',
    description: 'עיצוב מינימליסטי ואלגנטי',
    longDescription: 'צמיד עור אמיתי בעבודת יד עם סוגר מגנטי מנירוסטה. עיצוב מינימליסטי מודרני שמשתלב עם כל לוק. זמין במספר צבעים: חום, שחור, ואפור. מגיע בקופסת מתנה מהודרת.',
    features: ['עור אמיתי איכותי', 'סוגר מגנטי נירוסטה', 'עבודת יד', 'מגוון צבעים', 'קופסת מתנה']
  },
  {
    id: 11, sku: 'CUL-BK-011', name: 'ספר בישול איכותי', price: 139, exchangeValue: 120,
    supplier: 'הוצאת כנרת', category: 'ספרים ותרבות',
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&h=600&fit=crop',
    description: 'מתכונים מהמטבח הישראלי',
    longDescription: 'ספר בישול מקיף עם 150 מתכונים מהמטבח הישראלי המודרני מאת שף מוביל. כולל צילומי מאכלים מקצועיים, טיפים וטכניקות, ופרקים מיוחדים לחגים. כריכה קשה באיכות הדפסה גבוהה.',
    features: ['150 מתכונים', 'צילום מקצועי', 'כריכה קשה', 'פרקי חגים', 'טיפים וטכניקות שף']
  },
  {
    id: 12, sku: 'HOM-LT-012', name: 'מנורת LED חכמה', price: 229, exchangeValue: 210,
    supplier: 'SmartHome', category: 'בית ומטבח',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=600&h=600&fit=crop',
    description: 'שליטה באפליקציה עם שינוי צבעים',
    longDescription: 'מנורת שולחן LED חכמה עם 16 מיליון צבעים ושליטה מלאה דרך אפליקציה. תמיכה ב-Alexa ו-Google Home. 5 מצבי תאורה: קריאה, עבודה, מנוחה, שינה ומסיבה. עמעום מלא והגדרת טיימר.',
    features: ['16 מיליון צבעים', 'שליטה באפליקציה', 'Alexa + Google Home', '5 מצבי תאורה', 'טיימר חכם']
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

function ProductModal({ gift, onClose, onAddToCart, isAdded }) {
  if (!gift) return null

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

        <img src={gift.image} alt={gift.name} className="modal-image" />

        <div className="modal-body">
          <span className="modal-category">{gift.category}</span>
          <h2>{gift.name}</h2>
          <span className="modal-sku">מק״ט: {gift.sku}</span>

          <p className="modal-description">{gift.longDescription || gift.description}</p>

          <div className="modal-details-grid">
            <div className="modal-detail-card">
              <span className="modal-detail-label">מחיר</span>
              <span className="modal-detail-value price">₪{gift.price}</span>
            </div>
            <div className="modal-detail-card">
              <span className="modal-detail-label">שווי החלפה</span>
              <span className="modal-detail-value exchange">₪{gift.exchangeValue}</span>
            </div>
            <div className="modal-detail-card">
              <span className="modal-detail-label">ספק</span>
              <span className="modal-detail-value">{gift.supplier}</span>
            </div>
            <div className="modal-detail-card">
              <span className="modal-detail-label">קטגוריה</span>
              <span className="modal-detail-value">{gift.category}</span>
            </div>
          </div>

          {gift.features && gift.features.length > 0 && (
            <div className="modal-features">
              <h4>מה כולל המוצר</h4>
              <ul>
                {gift.features.map((f, i) => (
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

          <div className="modal-footer">
            <motion.button
              className={`modal-add-button ${isAdded ? 'added' : ''}`}
              onClick={() => onAddToCart(gift)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              {isAdded ? '✓ נוסף לסל בהצלחה' : 'הוסף לסל'}
            </motion.button>
            <div className="modal-price-display">
              <span className="price-label">מחיר</span>
              <span className="price-value">₪{gift.price}</span>
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
  const [selectedGift, setSelectedGift] = useState(null)

  const filteredGifts = useMemo(() => {
    let gifts = selectedCategory === 'הכל'
      ? SAMPLE_GIFTS
      : SAMPLE_GIFTS.filter(g => g.category === selectedCategory)

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase()
      gifts = gifts.filter(g =>
        g.name.toLowerCase().includes(q) ||
        g.description.toLowerCase().includes(q) ||
        g.supplier.toLowerCase().includes(q) ||
        g.sku.toLowerCase().includes(q)
      )
    }
    return gifts
  }, [selectedCategory, searchQuery])

  const handleAddToCart = (gift) => {
    addToCart(gift)
    setAddedToCart(prev => ({ ...prev, [gift.id]: true }))
    setTimeout(() => {
      setAddedToCart(prev => ({ ...prev, [gift.id]: false }))
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
            אתר המתנות של עובדי אמרל
          </motion.span>
          <h2>בואו לבחור מתנות שוות</h2>
          <p>הגיע הזמן לפנק את עצמכם - בחרו מתנה מהקטלוג שלנו</p>
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
            placeholder="חיפוש מתנה לפי שם, ספק או מק״ט..."
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
          {GIFT_CATEGORIES.map((category, index) => (
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
            {filteredGifts.length} תוצאות נמצאו
          </motion.p>
        )}

        <motion.div className="gifts-grid" layout>
          <AnimatePresence mode="popLayout">
            {filteredGifts.map((gift, index) => (
              <motion.div
                key={gift.id}
                className="gift-card"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                custom={index}
                layout
                onClick={() => setSelectedGift(gift)}
              >
                <div className="gift-image-wrapper">
                  <motion.img
                    src={gift.image}
                    alt={gift.name}
                    className={`gift-image ${imageLoaded[gift.id] ? 'loaded' : ''}`}
                    loading="lazy"
                    onLoad={() => setImageLoaded(prev => ({ ...prev, [gift.id]: true }))}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.4 }}
                  />
                  <span className="gift-category-tag">{gift.category}</span>
                </div>
                <div className="gift-info">
                  <div className="gift-info-top">
                    <span className="gift-sku">מק״ט: {gift.sku}</span>
                  </div>
                  <h3>{gift.name}</h3>
                  <p className="gift-description">{gift.description}</p>
                  <div className="gift-meta">
                    <span className="gift-supplier">ספק: {gift.supplier}</span>
                    <span className="gift-exchange-value">שווי החלפה: ₪{gift.exchangeValue}</span>
                  </div>
                  <div className="gift-footer">
                    <span className="gift-price">₪{gift.price}</span>
                    <motion.button
                      className={`add-to-cart-button ${addedToCart[gift.id] ? 'added' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleAddToCart(gift)
                      }}
                      whileHover={{ scale: 1.06 }}
                      whileTap={{ scale: 0.92 }}
                    >
                      {addedToCart[gift.id] ? '✓ נוסף' : 'הוסף לסל'}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedGift && (
          <ProductModal
            gift={selectedGift}
            onClose={() => setSelectedGift(null)}
            onAddToCart={handleAddToCart}
            isAdded={addedToCart[selectedGift.id]}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default Catalog
