import { motion } from 'framer-motion'
import './Header.css'

const LOGO_URL = '/logo.png'

function Header({ onNavigate, user, cartCount, onCartClick }) {
  return (
    <header className="header">
      <div className="header-container">
        <motion.div
          className="header-logo"
          onClick={() => onNavigate('catalog')}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <img src={LOGO_URL} alt="Amarel" className="header-logo-img" />
          <span className="header-title">ביגוד עבודה</span>
        </motion.div>

        <div className="header-actions">
          <motion.button
            className="header-cart-btn"
            onClick={onCartClick}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            {cartCount > 0 && (
              <motion.span
                className="header-cart-badge"
                key={cartCount}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 15 }}
              >
                {cartCount}
              </motion.span>
            )}
          </motion.button>

          <motion.span
            className="header-user"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            שלום, {user?.name}
          </motion.span>
        </div>
      </div>
    </header>
  )
}

export default Header
