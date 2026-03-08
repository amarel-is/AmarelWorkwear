import { motion, AnimatePresence } from 'framer-motion'
import './Toast.css'

function Toast({ toasts, removeToast }) {
  return (
    <div className="toast-container">
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            className={`toast toast-${toast.type || 'success'}`}
            initial={{ opacity: 0, y: 50, x: '-50%', scale: 0.9 }}
            animate={{ opacity: 1, y: 0, x: '-50%', scale: 1 }}
            exit={{ opacity: 0, y: 20, x: '-50%', scale: 0.9 }}
            transition={{ type: 'spring', damping: 22, stiffness: 300 }}
            onClick={() => removeToast(toast.id)}
          >
            <span className="toast-icon">
              {toast.type === 'error' ? '✕' : '✓'}
            </span>
            <div className="toast-body">
              <span className="toast-message">{toast.message}</span>
              {toast.detail && <span className="toast-detail">{toast.detail}</span>}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export default Toast
