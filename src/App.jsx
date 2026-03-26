import { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './App.css'
import Login from './components/Login'
import Catalog from './components/Catalog'
import Cart from './components/Cart'
import Checkout from './components/Checkout'
import Header from './components/Header'
import BottomNav from './components/BottomNav'
import CartDrawer from './components/CartDrawer'
import Toast from './components/Toast'
import AdminPanel from './components/AdminPanel'

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 }
}

const pageTransition = {
  duration: 0.25,
  ease: 'easeInOut'
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentPage, setCurrentPage] = useState(
    window.location.pathname === '/admin' ? 'admin' : 'catalog'
  )
  const [cartItems, setCartItems] = useState([])
  const [user, setUser] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [toasts, setToasts] = useState([])
  const toastId = useRef(0)

  const pushToast = useCallback((message, detail, type = 'success') => {
    const id = ++toastId.current
    setToasts(prev => [...prev, { id, message, detail, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 3000)
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const handleLogin = (userData) => {
    setIsAuthenticated(true)
    setUser(userData)
  }

  const addToCart = useCallback((product, selectedSize, selectedColor, branding, quantity = 1) => {
    const colorKey = selectedColor || ''
    const brandingKey = branding?.requested ? '1' : '0'
    const cartKey = `${product.id}-${selectedSize}-${colorKey}-${brandingKey}`
    setCartItems(prev => {
      const existing = prev.find(item => item.cartKey === cartKey)
      if (existing) {
        return prev.map(item =>
          item.cartKey === cartKey
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      return [...prev, { ...product, cartKey, selectedSize, selectedColor: colorKey, branding: branding || null, quantity }]
    })
    const colorPart = selectedColor ? ` · ${selectedColor}` : ''
    pushToast(product.name, `מידה ${selectedSize}${colorPart} נוסף לסל`)
    setDrawerOpen(true)
  }, [pushToast])

  const removeFromCart = useCallback((cartKey) => {
    setCartItems(prev => {
      const item = prev.find(i => i.cartKey === cartKey)
      if (item) pushToast(item.name, 'הוסר מהסל', 'error')
      return prev.filter(i => i.cartKey !== cartKey)
    })
  }, [pushToast])

  const updateQuantity = useCallback((cartKey, quantity) => {
    if (quantity === 0) {
      removeFromCart(cartKey)
    } else {
      setCartItems(prev => prev.map(item =>
        item.cartKey === cartKey
          ? { ...item, quantity }
          : item
      ))
    }
  }, [removeFromCart])

  const getCartCount = () =>
    cartItems.reduce((total, item) => total + item.quantity, 0)

  if (currentPage === 'admin') {
    return <AdminPanel onBack={() => setCurrentPage('catalog')} />
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />
  }

  return (
    <div className="app">
      <div className="app-top-bar">
        <Header
          onNavigate={setCurrentPage}
          user={user}
          cartCount={getCartCount()}
          onCartClick={() => setDrawerOpen(true)}
        />
      </div>

      <AnimatePresence mode="wait">
        {currentPage === 'catalog' && (
          <motion.div
            key="catalog"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
          >
            <Catalog addToCart={addToCart} />
          </motion.div>
        )}

        {currentPage === 'cart' && (
          <motion.div
            key="cart"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
          >
            <Cart
              cartItems={cartItems}
              updateQuantity={updateQuantity}
              removeFromCart={removeFromCart}
              onNavigate={setCurrentPage}
            />
          </motion.div>
        )}

        {currentPage === 'checkout' && (
          <motion.div
            key="checkout"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
          >
            <Checkout
              cartItems={cartItems}
              user={user}
              onComplete={() => {
                setCartItems([])
                setCurrentPage('catalog')
                pushToast('ההזמנה נשלחה בהצלחה!', 'תודה על ההזמנה')
              }}
            />
          </motion.div>
        )}

        {currentPage === 'admin' && (
          <motion.div
            key="admin"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
          >
            <AdminPanel onBack={() => setCurrentPage('catalog')} />
          </motion.div>
        )}
      </AnimatePresence>

      <CartDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        cartItems={cartItems}
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
        onNavigate={setCurrentPage}
      />

      <Toast toasts={toasts} removeToast={removeToast} />

      <BottomNav
        cartCount={getCartCount()}
        onNavigate={setCurrentPage}
        currentPage={currentPage}
      />
    </div>
  )
}

export default App
