import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const COLORS = ['#F97316', '#FB923C', '#FDBA74', '#FDE68A', '#FACC15', '#EAB308', '#FCD34D', '#FEF08A']

function createParticle(id) {
  return {
    id,
    x: Math.random() * 100,
    y: -10,
    size: Math.random() * 8 + 4,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    rotation: Math.random() * 360,
    velocityX: (Math.random() - 0.5) * 3,
    velocityY: Math.random() * 2 + 1,
    rotationSpeed: (Math.random() - 0.5) * 10,
    shape: Math.random() > 0.5 ? 'circle' : 'rect',
    opacity: Math.random() * 0.5 + 0.5,
    delay: Math.random() * 2
  }
}

function Confetti() {
  const [particles, setParticles] = useState([])
  const [burst, setBurst] = useState(false)

  const triggerBurst = useCallback(() => {
    const newParticles = Array.from({ length: 30 }, (_, i) => createParticle(Date.now() + i))
    setParticles(newParticles)
    setBurst(true)
    setTimeout(() => {
      setBurst(false)
      setParticles([])
    }, 4000)
  }, [])

  useEffect(() => {
    // Initial burst after page loads
    const initialTimer = setTimeout(triggerBurst, 1500)

    // Random bursts every 25-45 seconds
    const interval = setInterval(() => {
      triggerBurst()
    }, Math.random() * 20000 + 25000)

    return () => {
      clearTimeout(initialTimer)
      clearInterval(interval)
    }
  }, [triggerBurst])

  return (
    <div className="confetti-container" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: 1000,
      overflow: 'hidden'
    }}>
      <AnimatePresence>
        {burst && particles.map(p => (
          <motion.div
            key={p.id}
            initial={{
              x: `${p.x}vw`,
              y: '-5vh',
              rotate: p.rotation,
              opacity: p.opacity,
              scale: 0
            }}
            animate={{
              y: '110vh',
              x: `${p.x + p.velocityX * 20}vw`,
              rotate: p.rotation + p.rotationSpeed * 50,
              opacity: [p.opacity, p.opacity, 0],
              scale: [0, 1, 1, 0.5]
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 3.5 + Math.random(),
              delay: p.delay,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
            style={{
              position: 'absolute',
              width: p.size,
              height: p.shape === 'circle' ? p.size : p.size * 1.5,
              backgroundColor: p.color,
              borderRadius: p.shape === 'circle' ? '50%' : '2px',
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

export default Confetti
