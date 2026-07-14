import { useEffect, useState } from 'react'
import { animate, useReducedMotion } from 'framer-motion'

// Tween sebuah angka dari nilai lama ke nilai baru (untuk total poin, dll).
export function useCountUp(value, duration = 0.9) {
  const [display, setDisplay] = useState(value)
  const reduce = useReducedMotion()
  useEffect(() => {
    if (reduce) { setDisplay(value); return }
    const controls = animate(display, value, {
      duration, ease: 'easeOut', onUpdate: (v) => setDisplay(Math.round(v)),
    })
    return () => controls.stop()
  }, [value]) // eslint-disable-line react-hooks/exhaustive-deps
  return display
}
