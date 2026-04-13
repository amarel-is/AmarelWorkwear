import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ordersApi, uploadAttachment } from '../lib/airtable'
import { AMAREL_DIVISIONS } from '../data/products'
import './Checkout.css'

const WEBHOOK_URL = 'https://hook.eu2.make.com/REPLACE_WITH_YOUR_WEBHOOK_URL'

const STEPS = [
  { id: 'details', label: 'פרטים', icon: '1' },
  { id: 'review', label: 'אימות ואישור', icon: '2' },
]

function generateOrderId() {
  const ts = Date.now().toString(36).toUpperCase()
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `AMR-${ts.slice(-4)}-${rand}`
}

function Checkout({ cartItems, user, onComplete }) {
  const [step, setStep] = useState('details')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [orderResult, setOrderResult] = useState(null)
  const formRef = useRef(null)

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    division: '',
    projectName: '',
    projectNumber: '',
    site: '',
    notes: '',
    acceptTerms: false
  })

  const getTotalPrice = () =>
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0)

  const getTotalItems = () =>
    cartItems.reduce((total, item) => total + item.quantity, 0)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    if (name === 'projectNumber') {
      const digitsOnly = value.replace(/\D+/g, '')
      setFormData(prev => ({ ...prev, projectNumber: digitsOnly }))
      return
    }
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const goToReview = (e) => {
    e.preventDefault()
    if (!formRef.current.reportValidity()) return
    setStep('review')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const submitOrder = async () => {
    setIsSubmitting(true)
    setSubmitError(null)

    const orderId = generateOrderId()
    const orderPayload = {
      orderId,
      timestamp: new Date().toISOString(),
      customer: {
        idNumber: user?.idNumber || '',
        fullName: formData.fullName,
        email: formData.email,
        division: formData.division,
        projectName: formData.projectName,
        projectNumber: `PR${formData.projectNumber}`,
        site: formData.site
      },
      items: cartItems.map(item => ({
        sku: item.sku,
        name: item.name,
        size: item.selectedSize,
        color: item.selectedColor || '',
        branding: item.branding ? { requested: true, fileName: item.branding.fileName } : null,
        quantity: item.quantity,
        unitPrice: item.price,
        lineTotal: item.price * item.quantity,
        category: item.category
      })),
      summary: {
        totalItems: getTotalItems(),
        subtotal: getTotalPrice(),
        vat: Math.round(getTotalPrice() * 0.18),
        total: getTotalPrice() + Math.round(getTotalPrice() * 0.18)
      },
      notes: formData.notes || ''
    }

    try {
      const webhookPromise = fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      }).catch(err => console.error('Webhook error:', err))

      const airtableFields = {
        order_id: orderId,
        customer_name: formData.fullName,
        customer_email: formData.email,
        division: formData.division,
        project_name: formData.projectName || '',
        project_number: `PR${formData.projectNumber}`,
        site: formData.site || '',
        items_json: JSON.stringify(orderPayload.items),
        total_items: orderPayload.summary.totalItems,
        subtotal: orderPayload.summary.subtotal,
        vat: orderPayload.summary.vat,
        total: orderPayload.summary.total,
        notes: formData.notes || '',
        status: 'pending'
      }

      const airtablePromise = ordersApi.create(airtableFields)
        .then(async (record) => {
          const brandingItems = cartItems.filter(item => item.branding?.requested && item.branding?.file)
          if (brandingItems.length > 0 && record?.id) {
            for (const item of brandingItems) {
              await uploadAttachment(record.id, 'branding_files', item.branding.file)
                .catch(err => console.error('Branding upload error:', err))
            }
          }
        })
        .catch(err => console.error('Airtable save error:', err))

      await Promise.allSettled([webhookPromise, airtablePromise])

      setOrderResult({ orderId, payload: orderPayload })
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      console.error('Order submission error:', err)
      setOrderResult({ orderId, payload: orderPayload })
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const stepIndex = STEPS.findIndex(s => s.id === step)

  return (
    <div className="checkout">
      <div className="checkout-container">
        <div className="checkout-steps">
          {STEPS.map((s, i) => (
            <div key={s.id} className={`step ${i <= stepIndex ? 'active' : ''} ${i < stepIndex ? 'done' : ''}`}>
              <div className="step-circle">
                {i < stepIndex ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                ) : s.icon}
              </div>
              <span className="step-label">{s.label}</span>
              {i < STEPS.length - 1 && <div className="step-connector" />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 'details' && (
            <motion.div
              key="details"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
            >
              <div className="checkout-content">
                <div className="checkout-form-section">
                  <form ref={formRef} onSubmit={goToReview} className="checkout-form">
                    <div className="form-section">
                      <h3>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        פרטי מזמין
                      </h3>

                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="fullName">שם מלא *</label>
                          <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} required placeholder="ישראל ישראלי" />
                        </div>
                        <div className="form-group">
                          <label htmlFor="email">אימייל *</label>
                          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required placeholder="name@company.co.il" />
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="division">חטיבת אמרל *</label>
                          <select id="division" name="division" value={formData.division} onChange={handleChange} required>
                            <option value="">בחר חטיבה</option>
                            {AMAREL_DIVISIONS.map(d => <option key={d} value={d}>{d}</option>)}
                          </select>
                        </div>
                        <div className="form-group">
                          <label htmlFor="projectName">שם פרויקט</label>
                          <input type="text" id="projectName" name="projectName" value={formData.projectName} onChange={handleChange} placeholder="שם הפרויקט" />
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="projectNumber">מספר פרויקט *</label>
                        <div className="input-with-prefix" dir="ltr">
                          <span className="input-prefix">PR</span>
                          <input
                            type="text"
                            id="projectNumber"
                            name="projectNumber"
                            value={formData.projectNumber}
                            onChange={handleChange}
                            required
                            inputMode="numeric"
                            pattern="[0-9]*"
                            placeholder="123456"
                            dir="ltr"
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="notes">הערות להזמנה</label>
                        <textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} rows="3" placeholder="לדוגמה: רקמה מיוחדת, צבע מועדף, הערות לוגיסטיקה..." />
                      </div>
                    </div>

                    <motion.button
                      type="submit"
                      className="step-next-btn"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      המשך לאימות הזמנה
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>
                    </motion.button>
                  </form>
                </div>

                <div className="order-summary-section">
                  <OrderSummaryCard cartItems={cartItems} getTotalPrice={getTotalPrice} />
                </div>
              </div>
            </motion.div>
          )}

          {step === 'review' && (
            <motion.div
              key="review"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
            >
              <div className="review-page">
                {orderResult ? (
                  <motion.div
                    className="confirm-success-header"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <motion.div
                      className="confirm-icon"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 12 }}
                    >
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                    </motion.div>
                    <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                      ההזמנה נשלחה בהצלחה!
                    </motion.h2>
                    <motion.div className="confirm-order-id" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                      <span className="confirm-order-label">מספר הזמנה</span>
                      <span className="confirm-order-number">{orderResult.orderId}</span>
                    </motion.div>
                  </motion.div>
                ) : (
                  <div className="review-section">
                    <h3>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                      פרטי מזמין
                    </h3>
                    <div className="review-grid">
                      <div className="review-field"><span className="review-label">שם מלא</span><span className="review-value">{formData.fullName}</span></div>
                      <div className="review-field"><span className="review-label">אימייל</span><span className="review-value" dir="ltr">{formData.email}</span></div>
                      <div className="review-field"><span className="review-label">חטיבה</span><span className="review-value">{formData.division}</span></div>
                      {formData.projectName && <div className="review-field"><span className="review-label">שם פרויקט</span><span className="review-value">{formData.projectName}</span></div>}
                      <div className="review-field"><span className="review-label">מס׳ פרויקט</span><span className="review-value" dir="ltr">PR{formData.projectNumber}</span></div>
                    </div>
                    <motion.button className="review-edit-btn" onClick={() => setStep('details')} whileTap={{ scale: 0.95 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      ערוך פרטים
                    </motion.button>
                  </div>
                )}

                <div className="review-section">
                  <h3>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                    פריטים בהזמנה ({getTotalItems()})
                  </h3>
                  <div className="review-items-table">
                    <div className="review-items-head">
                      <span>מוצר</span><span>מידה / צבע</span><span>כמות</span><span>סה״כ</span>
                    </div>
                    {cartItems.map(item => (
                      <div key={item.cartKey} className="review-items-row">
                        <div className="review-item-product">
                          <img src={item.selectedImage || item.image} alt={item.name} />
                          <div>
                            <span className="review-item-name">{item.name}</span>
                            <span className="review-item-sku">מק״ט: {item.sku}</span>
                            {item.branding?.requested && (
                              <span className="review-item-branding">✦ מיתוג{item.branding.fileName ? `: ${item.branding.fileName}` : ''}</span>
                            )}
                          </div>
                        </div>
                        <div className="review-item-size-col">
                          <span className="review-item-size">{item.selectedSize}</span>
                          {item.selectedColor && <span className="review-item-color">{item.selectedColor}</span>}
                        </div>
                        <span>{item.quantity}</span>
                        <span className="review-item-total">₪{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="review-totals">
                  <div className="review-totals-row"><span>סכום ביניים (לפני מע״מ)</span><span>₪{getTotalPrice()}</span></div>
                  <div className="review-totals-row"><span>מע״מ (18%)</span><span>₪{Math.round(getTotalPrice() * 0.18)}</span></div>
                  <div className="review-totals-row total"><span>סה״כ לתשלום (כולל מע״מ)</span><span>₪{getTotalPrice() + Math.round(getTotalPrice() * 0.18)}</span></div>
                </div>

                {formData.notes && (
                  <div className="review-notes">
                    <strong>הערות:</strong> {formData.notes}
                  </div>
                )}

                {!orderResult && submitError && (
                  <motion.div className="submit-error" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <span>⚠️ {submitError}</span>
                  </motion.div>
                )}

                <div className="review-actions">
                  {orderResult ? (
                    <motion.button
                      className="submit-order-btn"
                      onClick={onComplete}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      חזרה לקטלוג
                    </motion.button>
                  ) : (
                    <>
                      <motion.button className="back-btn" onClick={() => setStep('details')} whileTap={{ scale: 0.95 }}>
                        ← חזרה לפרטים
                      </motion.button>
                      <motion.button
                        className="submit-order-btn"
                        onClick={submitOrder}
                        disabled={isSubmitting}
                        whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                        whileTap={!isSubmitting ? { scale: 0.97 } : {}}
                      >
                        {isSubmitting ? (
                          <span className="spinner" />
                        ) : (
                          <>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                            שליחת הזמנה
                          </>
                        )}
                      </motion.button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function OrderSummaryCard({ cartItems, getTotalPrice }) {
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0)

  return (
    <div className="order-summary-card">
      <h3>סיכום הזמנה ({totalItems} פריטים)</h3>

      <div className="summary-items">
        {cartItems.map(item => (
          <div key={item.cartKey} className="summary-item">
            <div className="summary-item-left">
              <img src={item.selectedImage || item.image} alt={item.name} className="summary-thumb" />
              <div className="summary-item-info">
                <span className="summary-item-name">{item.name}</span>
                <span className="summary-item-quantity">{item.selectedSize} × {item.quantity}</span>
              </div>
            </div>
            <span className="summary-item-price">₪{item.price * item.quantity}</span>
          </div>
        ))}
      </div>

      <div className="summary-divider" />

      <div className="summary-calc">
        <div className="summary-calc-row"><span>סכום ביניים (לפני מע״מ)</span><span>₪{getTotalPrice()}</span></div>
        <div className="summary-calc-row"><span>מע״מ (18%)</span><span>₪{Math.round(getTotalPrice() * 0.18)}</span></div>
      </div>

      <div className="summary-divider" />

      <div className="summary-calc-row total">
        <span>סה״כ כולל מע״מ</span>
        <span>₪{getTotalPrice() + Math.round(getTotalPrice() * 0.18)}</span>
      </div>

    </div>
  )
}

export default Checkout
