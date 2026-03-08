import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './CountdownBar.css'

// תאריך סיום בחירת המתנות - אפשר לשנות בקלות
const DEADLINE = new Date('2026-03-15T23:59:59')

function getTimeLeft() {
  const now = new Date()
  const diff = DEADLINE - now

  if (diff <= 0) return null

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((diff / (1000 * 60)) % 60)
  const seconds = Math.floor((diff / 1000) % 60)

  return { days, hours, minutes, seconds }
}

function CountdownBar() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  if (!timeLeft || dismissed) return null

  const isUrgent = timeLeft.days <= 3

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          className={`countdown-bar ${isUrgent ? 'urgent' : ''}`}
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          <div className="countdown-inner">
            <div className="countdown-text">
              <span className="countdown-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
              </span>
              <span className="countdown-label">נותרו לבחירת מתנה:</span>
            </div>

            <div className="countdown-units">
              <CountdownUnit value={timeLeft.days} label="ימים" pulse={isUrgent} />
              <span className="countdown-sep">:</span>
              <CountdownUnit value={timeLeft.hours} label="שעות" />
              <span className="countdown-sep">:</span>
              <CountdownUnit value={timeLeft.minutes} label="דקות" />
              <span className="countdown-sep">:</span>
              <CountdownUnit value={timeLeft.seconds} label="שניות" />
            </div>

            <motion.button
              className="countdown-close"
              onClick={() => setDismissed(true)}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.85 }}
              aria-label="סגור"
            >
              ✕
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function CountdownUnit({ value, label, pulse }) {
  return (
    <div className="countdown-unit">
      <motion.span
        className="countdown-number"
        key={value}
        initial={{ y: -8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      >
        {String(value).padStart(2, '0')}
      </motion.span>
      <span className="countdown-unit-label">{label}</span>
      {pulse && <span className="countdown-pulse" />}
    </div>
  )
}

export default CountdownBar
