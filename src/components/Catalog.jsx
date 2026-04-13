import { useState, useMemo, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { WORKWEAR_CATEGORIES, FALLBACK_PRODUCTS } from '../data/products'
import { productsApi } from '../lib/airtable'
import './Catalog.css'

const COLOR_MAP = {
  'שחור':        '#1a1a1a',
  'לבן':         '#ffffff',
  'אפור עכבר':   '#6b7280',
  'אפור':        '#9ca3af',
  'אפור בהיר':   '#d1d5db',
  'כחול כהה':    '#1e3a5f',
  'כחול':        '#2563eb',
  'כחול בהיר':   '#60a5fa',
  'נייבי':       '#1d3461',
  'חאקי':        '#8a7f5e',
  'ירוק':        '#16a34a',
  'צהוב':        '#facc15',
  'כתום':        '#f97316',
  'אדום':        '#dc2626',
  'בורדו':       '#7f1d1d',
  'חום':         '#92400e',
}

function useProducts() {
  const [products, setProducts] = useState(FALLBACK_PRODUCTS)

  useEffect(() => {
    const pat = import.meta.env.VITE_AIRTABLE_PAT
    const baseId = import.meta.env.VITE_AIRTABLE_BASE_ID
    if (!pat || !baseId) return

    let cancelled = false
    productsApi.list().then(data => {
      if (!cancelled && Array.isArray(data) && data.length > 0) {
        const mapped = data.filter(p => p.active !== false)
        if (mapped.length > 0) setProducts(mapped)
      }
    }).catch(() => {})
    return () => { cancelled = true }
  }, [])

  return products
}

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
  const [selectedColor, setSelectedColor] = useState('')
  const [brandingOption, setBrandingOption] = useState('none')
  const [brandingFile, setBrandingFile] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const brandingFileRef = useRef(null)

  if (!product) return null

  const colorImagesMap = product.color_images || {}
  const lightboxItems = (product.colors && Array.isArray(product.colors) && product.colors.length > 0)
    ? product.colors.map(color => ({ src: colorImagesMap[color] || product.image, color }))
    : [{ src: product.image, color: null }]
  const uniqueLightboxItems = Array.from(new Map(lightboxItems.map(item => [item.src, item])).values())
  const activeImageSrc = product.color_images?.[selectedColor] ?? product.image
  const currentLightboxItem = uniqueLightboxItems[lightboxIndex] || uniqueLightboxItems[0]

  const openLightbox = () => {
    const initialIndex = uniqueLightboxItems.findIndex(item => item.src === activeImageSrc)
    setLightboxIndex(initialIndex >= 0 ? initialIndex : 0)
    setLightboxOpen(true)
  }

  const closeLightbox = () => setLightboxOpen(false)
  const prevLightbox = () => setLightboxIndex(index => (index - 1 + uniqueLightboxItems.length) % uniqueLightboxItems.length)
  const nextLightbox = () => setLightboxIndex(index => (index + 1) % uniqueLightboxItems.length)

  const hasColors = product.colors && product.colors.length > 0
  const canAdd = selectedSize && (!hasColors || selectedColor)

  const handleAdd = () => {
    if (!canAdd) return
    const branding = brandingOption === 'branding'
      ? { requested: true, fileName: brandingFile?.name || '', file: brandingFile }
      : null
    onAddToCart(product, selectedSize, selectedColor || null, branding, quantity)
  }

  const handleBrandingFile = (e) => {
    const file = e.target.files?.[0]
    if (file) setBrandingFile(file)
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

        <div className="modal-image-wrapper">
          <img
            src={activeImageSrc}
            alt={product.name}
            className="modal-image"
            loading="lazy"
            onClick={openLightbox}
          />
          <button
            type="button"
            className="image-zoom-button"
            onClick={openLightbox}
            title="פתח בגלריית תמונות"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
        </div>

        <div className="modal-body">
          <span className="modal-category">{product.category}</span>
          <h2>{product.name}</h2>
          <span className="modal-sku">מק״ט: {product.sku}</span>

          <p className="modal-description">{product.description}</p>

          <div className="modal-details-grid">
            <div className="modal-detail-card">
              <span className="modal-detail-label">מחיר ליחידה (לא כולל מע״מ)</span>
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
                    key={f}
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

          {hasColors && (
            <div className="modal-color-selector">
              <h4>בחירת צבע{selectedColor && <span className="selected-color-label"> — {selectedColor}</span>}</h4>
              <div className="color-options">
                {product.colors.map(color => (
                  <motion.button
                    key={color}
                    title={color}
                    className={`color-swatch ${selectedColor === color ? 'active' : ''}`}
                    style={{ backgroundColor: COLOR_MAP[color.trim()] ?? '#cccccc' }}
                    onClick={() => setSelectedColor(color)}
                    whileHover={{ scale: 1.12 }}
                    whileTap={{ scale: 0.9 }}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="modal-branding-selector">
            <h4>מיתוג</h4>
            <div className="branding-options">
              <motion.button
                className={`branding-option ${brandingOption === 'none' ? 'active' : ''}`}
                onClick={() => { setBrandingOption('none'); setBrandingFile(null) }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                ללא מיתוג
              </motion.button>
              <motion.button
                className={`branding-option ${brandingOption === 'branding' ? 'active' : ''}`}
                onClick={() => setBrandingOption('branding')}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                עם מיתוג
              </motion.button>
            </div>
            {brandingOption === 'branding' && (
              <div className="branding-file-upload">
                <input
                  ref={brandingFileRef}
                  type="file"
                  accept=".pdf,.ai,.eps,.png,.jpg,.svg"
                  style={{ display: 'none' }}
                  onChange={handleBrandingFile}
                />
                <motion.button
                  className="branding-file-btn"
                  type="button"
                  onClick={() => brandingFileRef.current?.click()}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {brandingFile ? `✓ ${brandingFile.name}` : 'צרף קובץ מיתוג'}
                </motion.button>
                <span className="branding-file-hint">PDF / AI / EPS / PNG / SVG</span>
              </div>
            )}
          </div>

          <div className="modal-quantity-selector">
            <h4>כמות</h4>
            <div className="quantity-controls">
              <motion.button
                className="quantity-btn"
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                −
              </motion.button>
              <span className="quantity-value">{quantity}</span>
              <motion.button
                className="quantity-btn"
                onClick={() => setQuantity(q => q + 1)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                +
              </motion.button>
            </div>
          </div>

          <div className="modal-footer">
            <motion.button
              className={`modal-add-button ${isAdded ? 'added' : ''} ${!canAdd ? 'disabled' : ''}`}
              onClick={handleAdd}
              whileHover={canAdd ? { scale: 1.02 } : {}}
              whileTap={canAdd ? { scale: 0.97 } : {}}
              disabled={!canAdd}
            >
              {isAdded ? '✓ נוסף לסל בהצלחה' : !selectedSize ? 'יש לבחור מידה' : hasColors && !selectedColor ? 'יש לבחור צבע' : 'הוסף לסל'}
            </motion.button>
            <div className="modal-price-display">
              <span className="price-label">סה״כ (לא כולל מע״מ)</span>
              <span className="price-value">₪{product.price * quantity}</span>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {lightboxOpen && (
            <motion.div
              className="lightbox-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="lightbox-backdrop" onClick={closeLightbox} />
              <motion.div
                className="lightbox-content"
                initial={{ scale: 0.96, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.96, y: 20 }}
              >
                <button className="lightbox-close" onClick={closeLightbox} type="button" aria-label="Close image lightbox">✕</button>
                {uniqueLightboxItems.length > 1 && (
                  <button className="lightbox-nav prev" onClick={prevLightbox} type="button" aria-label="Previous image">‹</button>
                )}
                <img src={currentLightboxItem.src} alt={product.name} className="lightbox-image" />
                {uniqueLightboxItems.length > 1 && (
                  <button className="lightbox-nav next" onClick={nextLightbox} type="button" aria-label="Next image">›</button>
                )}
                {currentLightboxItem.color && (
                  <div className="lightbox-caption">{currentLightboxItem.color}</div>
                )}
                <div className="lightbox-counter">{lightboxIndex + 1}/{uniqueLightboxItems.length}</div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}

function Catalog({ addToCart }) {
  const allProducts = useProducts()
  const [selectedCategory, setSelectedCategory] = useState('הכל')
  const [addedToCart, setAddedToCart] = useState({})
  const [imageLoaded, setImageLoaded] = useState({})
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProduct, setSelectedProduct] = useState(null)

  const filteredProducts = useMemo(() => {
    let products = selectedCategory === 'הכל'
      ? allProducts
      : allProducts.filter(p => p.category === selectedCategory)

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
  }, [selectedCategory, searchQuery, allProducts])

  const handleAddToCart = (product, selectedSize, selectedColor, branding, quantity) => {
    addToCart(product, selectedSize, selectedColor, branding, quantity)
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
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <title>חיפוש</title>
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
                <div className="gift-card-inner">
                  <div className="gift-image-wrapper">
                    {!imageLoaded[product.id] && <div className="img-skeleton" />}
                    <motion.img
                      src={product.color_images ? Object.values(product.color_images)[0] : product.image}
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
                    {product.fabric && (
                      <div className="gift-meta">
                        <span className="gift-supplier">{product.fabric}</span>
                      </div>
                    )}
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
                </div>
                {product.colors?.length > 0 && (
                  <div className="gift-card-swatches">
                    {product.colors.slice(0, 9).map(color => (
                      <span
                        key={color}
                        title={color}
                        className="gift-card-swatch"
                        style={{ background: COLOR_MAP[color.trim()] ?? '#cccccc' }}
                      />
                    ))}
                    {product.colors.length > 9 && (
                      <span className="gift-card-swatch-more">+{product.colors.length - 9}</span>
                    )}
                  </div>
                )}
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
