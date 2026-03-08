import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './BottomNav.css'

function BottomNav({ cartCount, onNavigate, currentPage }) {
  const [showContact, setShowContact] = useState(false)

  const navItems = [
    { id: 'catalog', label: 'קטלוג', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1"/>
        <rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/>
        <rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
    )},
    { id: 'cart', label: 'סל הזמנה', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1"/>
        <circle cx="20" cy="21" r="1"/>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
      </svg>
    )},
    { id: 'contact', label: 'צור קשר', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    )}
  ]

  const handleNavClick = (id) => {
    if (id === 'contact') {
      setShowContact(true)
    } else {
      setShowContact(false)
      onNavigate(id)
    }
  }

  return (
    <>
      <AnimatePresence>
        {showContact && (
          <motion.div
            className="contact-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowContact(false)}
          >
            <motion.div
              className="contact-sheet"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="contact-sheet-handle" />
              <h3>צור קשר</h3>
              <p className="contact-subtitle">נשמח לעזור בכל שאלה בנוגע לביגוד העבודה</p>

              <div className="contact-options">
                <a href="mailto:workwear@amarel.net" className="contact-option">
                  <div className="contact-option-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </div>
                  <div className="contact-option-text">
                    <span className="contact-option-label">אימייל</span>
                    <span className="contact-option-value">workwear@amarel.net</span>
                  </div>
                </a>

                <a href="tel:+97235555555" className="contact-option">
                  <div className="contact-option-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                  </div>
                  <div className="contact-option-text">
                    <span className="contact-option-label">טלפון</span>
                    <span className="contact-option-value" dir="ltr">03-555-5555</span>
                  </div>
                </a>

                <a href="https://wa.me/97235555555" target="_blank" rel="noopener noreferrer" className="contact-option">
                  <div className="contact-option-icon whatsapp">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </div>
                  <div className="contact-option-text">
                    <span className="contact-option-label">וואטסאפ</span>
                    <span className="contact-option-value">שלח הודעה</span>
                  </div>
                </a>
              </div>

              <p className="contact-hours">שעות פעילות: א׳-ה׳ 09:00-17:00</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <nav className="bottom-nav">
        <div className="bottom-nav-inner">
          {navItems.map(item => (
            <motion.button
              key={item.id}
              className={`bottom-nav-item ${item.id !== 'contact' && currentPage === item.id ? 'active' : ''} ${item.id === 'contact' && showContact ? 'active' : ''}`}
              onClick={() => handleNavClick(item.id)}
              whileTap={{ scale: 0.9 }}
            >
              <div className="bottom-nav-icon-wrapper">
                <motion.div
                  className="bottom-nav-icon"
                  animate={(item.id !== 'contact' && currentPage === item.id) || (item.id === 'contact' && showContact) ? { y: -2 } : { y: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                >
                  {item.icon}
                </motion.div>
                {item.id === 'cart' && cartCount > 0 && (
                  <motion.span
                    className="bottom-nav-badge"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                    key={cartCount}
                  >
                    {cartCount}
                  </motion.span>
                )}
              </div>
              <span className="bottom-nav-label">{item.label}</span>
              {((item.id !== 'contact' && currentPage === item.id) || (item.id === 'contact' && showContact)) && (
                <motion.div
                  className="bottom-nav-indicator"
                  layoutId="activeTab"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </nav>
    </>
  )
}

export default BottomNav
