import { motion, AnimatePresence } from 'framer-motion'
import './CartDrawer.css'

function CartDrawer({ isOpen, onClose, cartItems, updateQuantity, removeFromCart, onNavigate }) {
  const getTotalPrice = () =>
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0)

  const getTotalItems = () =>
    cartItems.reduce((total, item) => total + item.quantity, 0)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="cart-drawer"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            <div className="drawer-header">
              <div className="drawer-header-text">
                <h3>סל הקניות</h3>
                <span className="drawer-count">{getTotalItems()} פריטים</span>
              </div>
              <motion.button
                className="drawer-close"
                onClick={onClose}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </motion.button>
            </div>

            {cartItems.length === 0 ? (
              <div className="drawer-empty">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d1d1d6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                </svg>
                <p>הסל ריק</p>
                <motion.button
                  className="drawer-shop-btn"
                  onClick={onClose}
                  whileTap={{ scale: 0.96 }}
                >
                  המשך לקטלוג
                </motion.button>
              </div>
            ) : (
              <>
                <div className="drawer-items">
                  <AnimatePresence mode="popLayout">
                    {cartItems.map(item => (
                      <motion.div
                        key={item.cartKey}
                        className="drawer-item"
                        layout
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -60, height: 0, padding: 0, margin: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <div className="drawer-item-img">
                          <img src={item.selectedImage || item.image} alt={item.name} />
                        </div>
                        <div className="drawer-item-details">
                          <span className="drawer-item-name">{item.name}</span>
                          <span className="drawer-item-meta">
                            מידה {item.selectedSize}{item.selectedColor ? ` · ${item.selectedColor}` : ''} · מק״ט {item.sku}
                            {item.branding?.requested && <> · ✦ מיתוג</>}
                          </span>
                          <div className="drawer-item-row">
                            <div className="drawer-qty">
                              <button onClick={() => updateQuantity(item.cartKey, item.quantity - 1)}>−</button>
                              <motion.span
                                key={item.quantity}
                                initial={{ scale: 1.3 }}
                                animate={{ scale: 1 }}
                              >
                                {item.quantity}
                              </motion.span>
                              <button onClick={() => updateQuantity(item.cartKey, item.quantity + 1)}>+</button>
                            </div>
                            <span className="drawer-item-price">₪{item.price * item.quantity}</span>
                          </div>
                        </div>
                        <motion.button
                          className="drawer-item-remove"
                          onClick={() => removeFromCart(item.cartKey)}
                          whileHover={{ scale: 1.15, color: '#ef4444' }}
                          whileTap={{ scale: 0.85 }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                          </svg>
                        </motion.button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                <div className="drawer-footer">
                  <div className="drawer-subtotal">
                    <span>סה״כ</span>
                    <motion.span
                      className="drawer-total-price"
                      key={getTotalPrice()}
                      initial={{ scale: 1.15 }}
                      animate={{ scale: 1 }}
                    >
                      ₪{getTotalPrice()}
                    </motion.span>
                  </div>
                  <p className="drawer-vat-note">* המחירים אינם כוללים מע״מ</p>
                  <motion.button
                    className="drawer-checkout-btn"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      onClose()
                      onNavigate('checkout')
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
                    </svg>
                    המשך לסיום הזמנה
                  </motion.button>
                  <motion.button
                    className="drawer-view-cart-btn"
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      onClose()
                      onNavigate('cart')
                    }}
                  >
                    צפייה בסל המלא
                  </motion.button>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default CartDrawer
