import { motion, AnimatePresence } from 'framer-motion'
import './Cart.css'

const MAX_ENTITLEMENTS = 1

function EntitlementWidget({ used }) {
  const ratio = Math.min(used / MAX_ENTITLEMENTS, 1)
  const circumference = 2 * Math.PI * 38
  const filled = circumference * ratio
  const remaining = MAX_ENTITLEMENTS - used
  const isFullyUsed = remaining <= 0

  return (
    <motion.div
      className="entitlement-widget"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="entitlement-ring-container">
        <svg width="90" height="90" viewBox="0 0 90 90" className="entitlement-ring">
          <circle
            cx="45" cy="45" r="38"
            fill="none"
            stroke="#f0f0f2"
            strokeWidth="6"
          />
          <motion.circle
            cx="45" cy="45" r="38"
            fill="none"
            stroke={isFullyUsed ? '#F97316' : '#F97316'}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - filled }}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            transform="rotate(-90 45 45)"
          />
        </svg>
        <div className="entitlement-ring-text">
          <motion.span
            className="entitlement-ring-number"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.8 }}
          >
            {used}
          </motion.span>
          <span className="entitlement-ring-of">מתוך {MAX_ENTITLEMENTS}</span>
        </div>
      </div>
      <div className="entitlement-info">
        <h4 className="entitlement-title">
          {isFullyUsed ? 'כל הזכאויות נוצלו' : 'ניצול זכאויות'}
        </h4>
        <p className="entitlement-desc">
          {isFullyUsed
            ? 'מעולה! בחרתם את כל המתנות שלכם'
            : `נותרו עוד ${remaining} זכאויות לבחירה`
          }
        </p>
        {isFullyUsed && (
          <motion.span
            className="entitlement-badge-full"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2 }}
          >
            מומש במלואו
          </motion.span>
        )}
      </div>
    </motion.div>
  )
}

function Cart({ cartItems, updateQuantity, removeFromCart, onNavigate }) {
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  }
  const totalItemTypes = cartItems.length

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
            <p>הוסיפו מתנות מהקטלוג כדי להתחיל</p>
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
          <h2>סל הקניות שלי</h2>
          <p>{cartItems.length} פריטים בסל</p>
        </motion.div>

        <EntitlementWidget used={totalItemTypes} />

        <div className="cart-content">
          <div className="cart-items">
            <AnimatePresence mode="popLayout">
              {cartItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  className="cart-item"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  layout
                >
                  <div className="cart-item-image">
                    <img src={item.image} alt={item.name} />
                  </div>

                  <div className="cart-item-body">
                    <div className="cart-item-top-row">
                      <div className="cart-item-info">
                        <h3>{item.name}</h3>
                        <p className="cart-item-price">₪{item.price}</p>
                      </div>
                      <motion.button
                        className="remove-button"
                        onClick={() => removeFromCart(item.id)}
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                      </motion.button>
                    </div>

                    <div className="cart-item-bottom-row">
                      <div className="quantity-controls">
                        <motion.button
                          className="quantity-button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          whileTap={{ scale: 0.85 }}
                        >
                          -
                        </motion.button>
                        <motion.span
                          className="quantity"
                          key={item.quantity}
                          initial={{ scale: 1.3 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 400 }}
                        >
                          {item.quantity}
                        </motion.span>
                        <motion.button
                          className="quantity-button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          whileTap={{ scale: 0.85 }}
                        >
                          +
                        </motion.button>
                      </div>
                      <span className="cart-item-total">₪{item.price * item.quantity}</span>
                    </div>
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

              <div className="summary-row">
                <span>סה"כ פריטים:</span>
                <span>{cartItems.reduce((total, item) => total + item.quantity, 0)}</span>
              </div>

              <div className="summary-row">
                <span>סכום ביניים:</span>
                <span>₪{getTotalPrice()}</span>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-row total">
                <span>סה"כ לתשלום:</span>
                <span>₪{getTotalPrice()}</span>
              </div>

              <motion.button
                className="checkout-button"
                onClick={() => onNavigate('checkout')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                המשך לסיום הזמנה
              </motion.button>

              <motion.button
                className="continue-shopping-link"
                onClick={() => onNavigate('catalog')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                המשך בקניות
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Cart
