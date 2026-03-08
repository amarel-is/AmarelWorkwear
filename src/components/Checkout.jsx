import { useState } from 'react'
import { motion } from 'framer-motion'
import './Checkout.css'

function Checkout({ cartItems, user, onComplete }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    companyName: '',
    department: '',
    address: '',
    apartment: '',
    floor: '',
    entrance: '',
    city: '',
    zipCode: '',
    deliveryDate: '',
    notes: ''
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitted(true)

    // מדמה שליחת הזמנה לשרת
    setTimeout(() => {
      onComplete()
    }, 3000)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  if (isSubmitted) {
    return (
      <div className="checkout">
        <div className="checkout-container">
          <motion.div
            className="success-message"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <motion.div
              className="success-icon"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.2 }}
            >
              ✓
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              ההזמנה התקבלה בהצלחה!
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              מספר הזמנה: #{Math.floor(Math.random() * 10000)}
            </motion.p>
            <motion.div
              className="success-details"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <p>תודה על ההזמנה, {formData.fullName}</p>
              <p>המתנות שלך יישלחו בהקדם לכתובת שהזנת</p>
              <p>נשלח אליך אישור בהודעת SMS למספר {formData.phone}</p>
            </motion.div>
            <motion.button
              className="back-to-catalog-button"
              onClick={onComplete}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              חזרה לקטלוג
            </motion.button>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="checkout">
      <div className="checkout-container">
        <motion.div
          className="checkout-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2>סיום הזמנה</h2>
          <p>נותרו רק מספר פרטים</p>
        </motion.div>

        <div className="checkout-content">
          <motion.div
            className="checkout-form-section"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <form onSubmit={handleSubmit} className="checkout-form">
              <motion.div
                className="form-section"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <h3>פרטים אישיים</h3>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="fullName">שם מלא *</label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      placeholder="הזן שם מלא"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">טלפון נייד *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="050-1234567"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">אימייל *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="name@company.com"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="companyName">שם חברה</label>
                    <input
                      type="text"
                      id="companyName"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      placeholder="שם החברה"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="department">מחלקה</label>
                  <input
                    type="text"
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    placeholder="שם המחלקה"
                  />
                </div>
              </motion.div>

              <motion.div
                className="form-section"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
              >
                <h3>כתובת למשלוח</h3>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="address">רחוב ומספר בית *</label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      placeholder="רחוב הרצל 1"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="city">עיר *</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      placeholder="תל אביב"
                    />
                  </div>
                </div>

                <div className="form-row form-row-three">
                  <div className="form-group">
                    <label htmlFor="apartment">דירה</label>
                    <input
                      type="text"
                      id="apartment"
                      name="apartment"
                      value={formData.apartment}
                      onChange={handleChange}
                      placeholder="מספר דירה"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="floor">קומה</label>
                    <input
                      type="text"
                      id="floor"
                      name="floor"
                      value={formData.floor}
                      onChange={handleChange}
                      placeholder="מספר קומה"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="entrance">כניסה</label>
                    <input
                      type="text"
                      id="entrance"
                      name="entrance"
                      value={formData.entrance}
                      onChange={handleChange}
                      placeholder="כניסה"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="zipCode">מיקוד</label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      placeholder="1234567"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="deliveryDate">תאריך משלוח מבוקש</label>
                    <input
                      type="date"
                      id="deliveryDate"
                      name="deliveryDate"
                      value={formData.deliveryDate}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="notes">הערות למשלוח (אופציונלי)</label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="3"
                    placeholder="הערות מיוחדות למשלוח"
                  />
                </div>
              </motion.div>

              <motion.button
                type="submit"
                className="submit-order-button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                אישור הזמנה
              </motion.button>
            </form>
          </motion.div>

          <motion.div
            className="order-summary-section"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="order-summary-card">
              <h3>סיכום הזמנה</h3>

              <div className="summary-items">
                {cartItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    className="summary-item"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.08 }}
                  >
                    <div className="summary-item-info">
                      <span className="summary-item-name">{item.name}</span>
                      <span className="summary-item-quantity">× {item.quantity}</span>
                    </div>
                    <span className="summary-item-price">₪{item.price * item.quantity}</span>
                  </motion.div>
                ))}
              </div>

              <div className="summary-divider"></div>

              <div className="summary-total">
                <span>סה"כ לתשלום:</span>
                <span className="total-price">₪{getTotalPrice()}</span>
              </div>

              <div className="payment-notice">
                <p>💳 התשלום יתבצע דרך המחלקה הפיננסית</p>
                <p>📦 משלוח חינם לכל הארץ</p>
                <p>🎁 אריזת מתנה מהודרת</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
