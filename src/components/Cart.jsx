import { motion, AnimatePresence } from 'framer-motion'
import './Cart.css'

function Cart({ cartItems, updateQuantity, removeFromCart, onNavigate }) {
  const getTotalPrice = () =>
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0)

  const getTotalItems = () =>
    cartItems.reduce((total, item) => total + item.quantity, 0)

  if (cartItems.length === 0) {
    return (
      <div className="cart">
        <div className="cart-container">
          <motion.div
            className="empty-cart"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="empty-icon"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.2 }}
            >
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#d1d1d6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
            </motion.div>
            <h2>הסל שלך ריק</h2>
            <p>הוסיפו פריטי ביגוד מהקטלוג כדי להתחיל</p>
            <motion.button
              className="continue-shopping-button"
              onClick={() => onNavigate('catalog')}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              חזרה לקטלוג
            </motion.button>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="cart">
      <div className="cart-container">
        <motion.div
          className="cart-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2>סל ההזמנה</h2>
          <p>{getTotalItems()} פריטים · {cartItems.length} סוגים</p>
        </motion.div>

        <div className="cart-content">
          <div className="cart-items">
            <div className="cart-items-header">
              <span className="col-product">מוצר</span>
              <span className="col-size">מידה</span>
              <span className="col-price">מחיר</span>
              <span className="col-qty">כמות</span>
              <span className="col-total">סה״כ</span>
              <span className="col-action"></span>
            </div>

            <AnimatePresence mode="popLayout">
              {cartItems.map((item, index) => (
                <motion.div
                  key={item.cartKey}
                  className="cart-line"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -60, height: 0, margin: 0, padding: 0 }}
                  transition={{ duration: 0.25, delay: index * 0.04 }}
                  layout
                >
                  <div className="col-product">
                    <div className="line-img">
                      <img src={item.image} alt={item.name} />
                    </div>
                    <div className="line-info">
                      <span className="line-name">{item.name}</span>
                      <span className="line-sku">מק״ט: {item.sku}</span>
                    </div>
                  </div>

                  <span className="col-size">
                    <span className="size-badge">{item.selectedSize}</span>
                  </span>

                  <span className="col-price">₪{item.price}</span>

                  <div className="col-qty">
                    <div className="qty-control">
                      <motion.button
                        className="qty-btn"
                        onClick={() => updateQuantity(item.cartKey, item.quantity - 1)}
                        whileTap={{ scale: 0.8 }}
                      >−</motion.button>
                      <motion.span
                        className="qty-value"
                        key={item.quantity}
                        initial={{ scale: 1.3 }}
                        animate={{ scale: 1 }}
                      >
                        {item.quantity}
                      </motion.span>
                      <motion.button
                        className="qty-btn"
                        onClick={() => updateQuantity(item.cartKey, item.quantity + 1)}
                        whileTap={{ scale: 0.8 }}
                      >+</motion.button>
                    </div>
                  </div>

                  <span className="col-total">
                    <motion.span
                      key={item.price * item.quantity}
                      initial={{ scale: 1.1 }}
                      animate={{ scale: 1 }}
                    >
                      ₪{item.price * item.quantity}
                    </motion.span>
                  </span>

                  <div className="col-action">
                    <motion.button
                      className="line-remove"
                      onClick={() => removeFromCart(item.cartKey)}
                      whileHover={{ scale: 1.15, color: '#ef4444' }}
                      whileTap={{ scale: 0.85 }}
                      title="הסר מהסל"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                      </svg>
                    </motion.button>
                  </div>

                  {/* mobile-only stacked view */}
                  <div className="line-mobile-bottom">
                    <span className="size-badge">{item.selectedSize}</span>
                    <div className="qty-control">
                      <motion.button className="qty-btn" onClick={() => updateQuantity(item.cartKey, item.quantity - 1)} whileTap={{ scale: 0.8 }}>−</motion.button>
                      <span className="qty-value">{item.quantity}</span>
                      <motion.button className="qty-btn" onClick={() => updateQuantity(item.cartKey, item.quantity + 1)} whileTap={{ scale: 0.8 }}>+</motion.button>
                    </div>
                    <span className="line-total-mobile">₪{item.price * item.quantity}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <motion.div
            className="cart-summary"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <div className="summary-card">
              <h3>סיכום הזמנה</h3>

              <div className="summary-breakdown">
                {cartItems.map(item => (
                  <div key={item.cartKey} className="summary-line">
                    <span className="summary-line-name">
                      {item.name}
                      <span className="summary-line-detail"> ({item.selectedSize}) ×{item.quantity}</span>
                    </span>
                    <span>₪{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="summary-divider" />

              <div className="summary-row">
                <span>סה״כ פריטים:</span>
                <span>{getTotalItems()}</span>
              </div>

              <div className="summary-row">
                <span>סכום ביניים (לפני מע״מ):</span>
                <span>₪{getTotalPrice()}</span>
              </div>

              <div className="summary-row">
                <span>מע״מ (18%):</span>
                <span>₪{Math.round(getTotalPrice() * 0.18)}</span>
              </div>

              <div className="summary-divider" />

              <div className="summary-row total">
                <span>סה״כ לתשלום:</span>
                <span>₪{getTotalPrice() + Math.round(getTotalPrice() * 0.18)}</span>
              </div>

              <motion.button
                className="checkout-button"
                onClick={() => onNavigate('checkout')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                </svg>
                המשך לסיום הזמנה
              </motion.button>

              <motion.button
                className="continue-shopping-link"
                onClick={() => onNavigate('catalog')}
                whileTap={{ scale: 0.97 }}
              >
                ← המשך בקניות
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Cart
