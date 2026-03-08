import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './App.css'
import Login from './components/Login'
import Catalog from './components/Catalog'
import Cart from './components/Cart'
import Checkout from './components/Checkout'
import Header from './components/Header'
import BottomNav from './components/BottomNav'
import Confetti from './components/Confetti'
import CountdownBar from './components/CountdownBar'

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
  const [currentPage, setCurrentPage] = useState('catalog')
  const [cartItems, setCartItems] = useState([])
  const [user, setUser] = useState(null)

  const handleLogin = (userData) => {
    setIsAuthenticated(true)
    setUser(userData)
  }

  const addToCart = (product) => {
    const existingItem = cartItems.find(item => item.id === product.id)
    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ))
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }])
    }
  }

  const removeFromCart = (productId) => {
    setCartItems(cartItems.filter(item => item.id !== productId))
  }

  const updateQuantity = (productId, quantity) => {
    if (quantity === 0) {
      removeFromCart(productId)
    } else {
      setCartItems(cartItems.map(item =>
        item.id === productId
          ? { ...item, quantity }
          : item
      ))
    }
  }

  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />
  }

  return (
    <div className="app">
      <Confetti />
      <div className="app-top-bar">
        <CountdownBar />
        <Header
          onNavigate={setCurrentPage}
          user={user}
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
            <Catalog
              addToCart={addToCart}
            />
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
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav
        cartCount={getCartCount()}
        onNavigate={setCurrentPage}
        currentPage={currentPage}
      />
    </div>
  )
}

export default App
