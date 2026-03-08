import { useState, useEffect, useCallback, useRef } from 'react'
import { productsApi, ordersApi } from '../lib/airtable'
import { WORKWEAR_CATEGORIES } from '../data/products'
import './AdminPanel.css'

const ORDER_STATUSES = [
  { value: 'pending', label: 'ממתין', color: 'yellow' },
  { value: 'approved', label: 'אושר', color: 'blue' },
  { value: 'shipped', label: 'נשלח', color: 'purple' },
  { value: 'delivered', label: 'נמסר', color: 'green' }
]

const EMPTY_PRODUCT = {
  name: '', sku: '', price: '', category: '', description: '',
  image: '', fabric: '', weight: '', colors: '', features: '',
  sizes: '', active: true, sort_order: 0
}

// ─── Login ───

function LoginScreen({ onLogin }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (password === import.meta.env.VITE_ADMIN_PASSWORD) {
      onLogin()
    } else {
      setError('סיסמה שגויה')
      setPassword('')
    }
  }

  return (
    <div className="admin-login">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <h1>ניהול אמרל</h1>
          <p>הזן סיסמה כדי להיכנס לפאנל הניהול</p>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="password"
            value={password}
            onChange={e => { setPassword(e.target.value); setError('') }}
            placeholder="סיסמה"
          />
          {error && <span className="admin-login-error">{error}</span>}
          <button type="submit">כניסה</button>
        </form>
      </div>
    </div>
  )
}

// ─── Product Form Modal ───

function ProductFormModal({ product, onSave, onClose, saving }) {
  const [form, setForm] = useState(() => {
    if (!product) return { ...EMPTY_PRODUCT }
    return {
      name: product.name || '',
      sku: product.sku || '',
      price: product.price ?? '',
      category: product.category || '',
      description: product.description || '',
      image: product.image || '',
      fabric: product.fabric || '',
      weight: product.weight || '',
      colors: Array.isArray(product.colors) ? product.colors.join(', ') : (product.colors || ''),
      features: Array.isArray(product.features) ? product.features.join('\n') : (product.features || ''),
      sizes: Array.isArray(product.sizes) ? product.sizes.join(', ') : (product.sizes || ''),
      active: product.active !== false,
      sort_order: product.sort_order || 0
    }
  })

  const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    const fields = {
      name: form.name,
      sku: form.sku,
      price: Number(form.price) || 0,
      category: form.category,
      description: form.description,
      image: form.image,
      fabric: form.fabric || null,
      weight: form.weight || null,
      colors: form.colors ? form.colors.split(',').map(s => s.trim()).filter(Boolean) : [],
      features: form.features ? form.features.split('\n').filter(Boolean) : [],
      sizes: form.sizes ? form.sizes.split(',').map(s => s.trim()).filter(Boolean) : [],
      active: form.active,
      sort_order: Number(form.sort_order) || 0
    }
    onSave(fields)
  }

  const categories = WORKWEAR_CATEGORIES.filter(c => c !== 'הכל')

  return (
    <div className="admin-modal-overlay" role="dialog" aria-modal="true" onClick={onClose} onKeyDown={e => e.key === 'Escape' && onClose()}>
      <div className="admin-modal" role="document" onClick={e => e.stopPropagation()} onKeyDown={() => {}}>
        <div className="admin-modal-header">
          <h2>{product ? 'עריכת מוצר' : 'מוצר חדש'}</h2>
          <button type="button" className="admin-modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit} className="admin-product-form">
          <div className="admin-form-row">
            <label>
              <span>שם מוצר</span>
              <input type="text" value={form.name} onChange={e => set('name', e.target.value)} required />
            </label>
            <label>
              <span>מק״ט</span>
              <input type="text" value={form.sku} onChange={e => set('sku', e.target.value)} required />
            </label>
          </div>
          <div className="admin-form-row">
            <label>
              <span>מחיר (₪)</span>
              <input type="number" value={form.price} onChange={e => set('price', e.target.value)} required min="0" step="0.01" />
            </label>
            <label>
              <span>קטגוריה</span>
              <select value={form.category} onChange={e => set('category', e.target.value)} required>
                <option value="">בחר קטגוריה</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </label>
          </div>
          <label>
            <span>תיאור</span>
            <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={2} />
          </label>
          <label>
            <span>כתובת תמונה (URL)</span>
            <input type="url" value={form.image} onChange={e => set('image', e.target.value)} />
          </label>
          <div className="admin-form-row">
            <label>
              <span>הרכב בד</span>
              <input type="text" value={form.fabric} onChange={e => set('fabric', e.target.value)} />
            </label>
            <label>
              <span>משקל בד</span>
              <input type="text" value={form.weight} onChange={e => set('weight', e.target.value)} />
            </label>
          </div>
          <label>
            <span>צבעים (מופרדים בפסיק)</span>
            <input type="text" value={form.colors} onChange={e => set('colors', e.target.value)} placeholder="שחור, לבן, אפור" />
          </label>
          <label>
            <span>מאפיינים (כל מאפיין בשורה חדשה)</span>
            <textarea value={form.features} onChange={e => set('features', e.target.value)} rows={3} />
          </label>
          <label>
            <span>מידות (מופרדות בפסיק)</span>
            <input type="text" value={form.sizes} onChange={e => set('sizes', e.target.value)} placeholder="S, M, L, XL, 2XL" />
          </label>
          <div className="admin-form-row admin-form-row-bottom">
            <label className="admin-checkbox-label">
              <input type="checkbox" checked={form.active} onChange={e => set('active', e.target.checked)} />
              <span>פעיל</span>
            </label>
            <label>
              <span>סדר מיון</span>
              <input type="number" value={form.sort_order} onChange={e => set('sort_order', e.target.value)} min="0" className="admin-sort-input" />
            </label>
          </div>
          <div className="admin-form-actions">
            <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
              {saving ? 'שומר...' : (product ? 'עדכן מוצר' : 'צור מוצר')}
            </button>
            <button type="button" className="admin-btn admin-btn-secondary" onClick={onClose}>ביטול</button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Products Tab ───

function ProductsTab() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingProduct, setEditingProduct] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await productsApi.list()
      setProducts(data)
    } catch (err) {
      setError('שגיאה בטעינת מוצרים: ' + err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  const openNewForm = () => {
    setEditingProduct(null)
    setShowForm(true)
  }

  const openEditForm = (product) => {
    setEditingProduct(product)
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingProduct(null)
  }

  const handleSave = async (fields) => {
    setSaving(true)
    try {
      if (editingProduct) {
        await productsApi.update(editingProduct.id, fields)
      } else {
        await productsApi.create(fields)
      }
      closeForm()
      await fetchProducts()
    } catch (err) {
      alert('שגיאה בשמירה: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (product) => {
    if (!window.confirm(`למחוק את "${product.name}"?`)) return
    setDeletingId(product.id)
    try {
      await productsApi.delete(product.id)
      await fetchProducts()
    } catch (err) {
      alert('שגיאה במחיקה: ' + err.message)
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) return <div className="admin-loading">טוען מוצרים...</div>
  if (error) return <div className="admin-error">{error}<button type="button" onClick={fetchProducts} className="admin-btn admin-btn-secondary">נסה שוב</button></div>

  return (
    <div className="admin-tab-content">
      <div className="admin-tab-header">
        <h2>מוצרים ({products.length})</h2>
        <button type="button" className="admin-btn admin-btn-primary" onClick={openNewForm}>+ מוצר חדש</button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>תמונה</th>
              <th>שם</th>
              <th>מק״ט</th>
              <th>קטגוריה</th>
              <th>מחיר</th>
              <th>סטטוס</th>
              <th>פעולות</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td>
                  {p.image
                    ? <img src={p.image} alt={p.name} className="admin-product-thumb" />
                    : <div className="admin-product-thumb-placeholder">—</div>
                  }
                </td>
                <td className="admin-cell-name">{p.name}</td>
                <td>{p.sku}</td>
                <td>{p.category}</td>
                <td>₪{p.price}</td>
                <td>
                  <span className={`admin-badge ${p.active !== false ? 'admin-badge-green' : 'admin-badge-red'}`}>
                    {p.active !== false ? 'פעיל' : 'לא פעיל'}
                  </span>
                </td>
                <td className="admin-actions-cell">
                  <button type="button" className="admin-btn-icon admin-btn-edit" onClick={() => openEditForm(p)} title="ערוך">✎</button>
                  <button
                    type="button"
                    className="admin-btn-icon admin-btn-delete"
                    onClick={() => handleDelete(p)}
                    disabled={deletingId === p.id}
                    title="מחק"
                  >
                    {deletingId === p.id ? '⏳' : '🗑'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <ProductFormModal
          product={editingProduct}
          onSave={handleSave}
          onClose={closeForm}
          saving={saving}
        />
      )}
    </div>
  )
}

// ─── Order Detail Expansion ───

function OrderDetail({ order }) {
  let items = []
  try {
    items = order.items_json ? JSON.parse(order.items_json) : []
  } catch { /* malformed JSON fallback */ }

  return (
    <div className="admin-order-detail">
      <div className="admin-order-detail-grid">
        <div className="admin-order-detail-section">
          <h4>פרטי לקוח</h4>
          <p><strong>שם:</strong> {order.customer_name || '—'}</p>
          <p><strong>טלפון:</strong> {order.customer_phone || '—'}</p>
          <p><strong>אימייל:</strong> {order.customer_email || '—'}</p>
          <p><strong>חברה:</strong> {order.company_name || '—'}</p>
        </div>
        <div className="admin-order-detail-section">
          <h4>הערות</h4>
          <p>{order.notes || 'אין הערות'}</p>
        </div>
      </div>
      {items.length > 0 && (
        <div className="admin-order-items">
          <h4>פריטים בהזמנה</h4>
          <table className="admin-table admin-table-inner">
            <thead>
              <tr>
                <th>מוצר</th>
                <th>מק״ט</th>
                <th>מידה</th>
                <th>צבע</th>
                <th>כמות</th>
                <th>מחיר</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={`${item.sku}-${item.size}-${item.color}`}>
                  <td>{item.name || '—'}</td>
                  <td>{item.sku || '—'}</td>
                  <td>{item.size || '—'}</td>
                  <td>{item.color || '—'}</td>
                  <td>{item.quantity || 1}</td>
                  <td>₪{item.price || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ─── Orders Tab ───

function OrdersTab() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expandedOrder, setExpandedOrder] = useState(null)
  const [updatingId, setUpdatingId] = useState(null)

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await ordersApi.list()
      setOrders(data)
    } catch (err) {
      setError('שגיאה בטעינת הזמנות: ' + err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchOrders() }, [fetchOrders])

  const handleStatusChange = async (order, newStatus) => {
    setUpdatingId(order.id)
    try {
      await ordersApi.update(order.id, { status: newStatus })
      setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: newStatus } : o))
    } catch (err) {
      alert('שגיאה בעדכון סטטוס: ' + err.message)
    } finally {
      setUpdatingId(null)
    }
  }

  const getStatusBadgeClass = (status) => {
    const map = { pending: 'yellow', approved: 'blue', shipped: 'purple', delivered: 'green' }
    return `admin-badge admin-badge-${map[status] || 'yellow'}`
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '—'
    try {
      return new Date(dateStr).toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit', year: 'numeric' })
    } catch {
      return dateStr
    }
  }

  if (loading) return <div className="admin-loading">טוען הזמנות...</div>
  if (error) return <div className="admin-error">{error}<button type="button" onClick={fetchOrders} className="admin-btn admin-btn-secondary">נסה שוב</button></div>

  return (
    <div className="admin-tab-content">
      <div className="admin-tab-header">
        <h2>הזמנות ({orders.length})</h2>
        <button type="button" className="admin-btn admin-btn-secondary" onClick={fetchOrders}>רענן</button>
      </div>

      {orders.length === 0 ? (
        <div className="admin-empty">אין הזמנות עדיין</div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>מס׳ הזמנה</th>
                <th>לקוח</th>
                <th>תאריך</th>
                <th>סה״כ</th>
                <th>סטטוס</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <OrderRow
                  key={order.id}
                  order={order}
                  expanded={expandedOrder === order.id}
                  onToggle={() => setExpandedOrder(prev => prev === order.id ? null : order.id)}
                  onStatusChange={handleStatusChange}
                  updatingId={updatingId}
                  getStatusBadgeClass={getStatusBadgeClass}
                  formatDate={formatDate}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function OrderRow({ order, expanded, onToggle, onStatusChange, updatingId, getStatusBadgeClass, formatDate }) {
  return (
    <>
      <tr className={`admin-order-row ${expanded ? 'expanded' : ''}`} onClick={onToggle} onKeyDown={e => e.key === 'Enter' && onToggle()}>
        <td>{order.order_id || order.id}</td>
        <td>{order.customer_name || '—'}</td>
        <td>{formatDate(order.created_at || order.createdTime)}</td>
        <td>₪{order.total || 0}</td>
        <td onClick={e => e.stopPropagation()} onKeyDown={e => e.stopPropagation()}>
          <select
            className={getStatusBadgeClass(order.status)}
            value={order.status || 'pending'}
            onChange={e => onStatusChange(order, e.target.value)}
            disabled={updatingId === order.id}
          >
            {ORDER_STATUSES.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </td>
      </tr>
      {expanded && (
        <tr className="admin-order-detail-row">
          <td colSpan={5}>
            <OrderDetail order={order} />
          </td>
        </tr>
      )}
    </>
  )
}

// ─── Main Admin Panel ───

export default function AdminPanel({ onBack }) {
  const [authenticated, setAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState('products')

  if (!authenticated) {
    return <LoginScreen onLogin={() => setAuthenticated(true)} />
  }

  return (
    <div className="admin-panel" dir="rtl">
      <header className="admin-header">
        <h1 className="admin-header-title">פאנל ניהול – אמרל</h1>

        <nav className="admin-tabs">
          <button
            type="button"
            className={`admin-tab ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            מוצרים
          </button>
          <button
            type="button"
            className={`admin-tab ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            הזמנות
          </button>
        </nav>

        <div className="admin-header-actions">
          {onBack && (
            <button type="button" className="admin-btn admin-btn-back" onClick={onBack}>
              ← חזרה לקטלוג
            </button>
          )}
          <button type="button" className="admin-btn admin-btn-logout" onClick={() => setAuthenticated(false)}>
            התנתק
          </button>
        </div>
      </header>

      <main className="admin-main">
        {activeTab === 'products' ? <ProductsTab /> : <OrdersTab />}
      </main>
    </div>
  )
}
