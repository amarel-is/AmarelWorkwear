import { useState } from 'react'
import { motion } from 'framer-motion'
import './Login.css'

const LOGO_URL = 'https://www.amarel.net/wp-content/uploads/2024/03/Logo_Amarel_white-Orange-1.svg'

function Login({ onLogin }) {
  const [idNumber, setIdNumber] = useState('')
  const [error, setError] = useState('')

  const validateIsraeliID = (id) => {
    if (id.length !== 9) return false

    let sum = 0
    for (let i = 0; i < 9; i++) {
      let num = Number(id[i]) * ((i % 2) + 1)
      sum += num > 9 ? num - 9 : num
    }

    return sum % 10 === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!idNumber) {
      setError('נא להזין תעודת זהות')
      return
    }

    if (!validateIsraeliID(idNumber)) {
      setError('תעודת זהות לא תקינה')
      return
    }

    onLogin({
      idNumber,
      name: 'משתמש'
    })
  }

  return (
    <div className="login-container">
      <motion.div
        className="login-logo-wrapper"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <img src={LOGO_URL} alt="Amarel" className="login-logo-img" />
      </motion.div>

      <motion.div
        className="login-card"
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
      >
        <div className="login-header">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            אתר המתנות של עובדי אמרל
          </motion.h1>
          <motion.p
            className="login-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            בואו לבחור מתנות שוות
          </motion.p>
        </div>

        <motion.form
          onSubmit={handleSubmit}
          className="login-form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <div className="form-group">
            <label htmlFor="idNumber">תעודת זהות</label>
            <input
              type="text"
              id="idNumber"
              value={idNumber}
              onChange={(e) => {
                setIdNumber(e.target.value.replace(/\D/g, ''))
                setError('')
              }}
              maxLength="9"
              placeholder="הזן מספר תעודת זהות"
              className="login-input"
            />
            {error && (
              <motion.span
                className="error-message"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
              >
                {error}
              </motion.span>
            )}
          </div>

          <motion.button
            type="submit"
            className="login-button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            כניסה לקטלוג
          </motion.button>
        </motion.form>

        <motion.div
          className="login-footer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <p>לשאלות ובעיות, צור קשר עם מנהל המערכת</p>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Login
