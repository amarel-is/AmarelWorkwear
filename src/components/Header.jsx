import { motion } from 'framer-motion'
import './Header.css'

const LOGO_URL = 'https://www.amarel.net/wp-content/uploads/2024/03/Logo_Amarel_white-Orange-1.svg'

function Header({ onNavigate, user }) {
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
        </motion.div>

        <motion.div
          className="header-user"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <span>שלום, {user?.name}</span>
        </motion.div>
      </div>
    </header>
  )
}

export default Header
