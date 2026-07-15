import { useEffect, useState } from 'react'
import { DEADLINE } from '../points.js'

// Hitung mundur ke penutupan program fasilitator.
export default function Deadline() {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 60000); return () => clearInterval(t) }, [])
  const ms = DEADLINE.getTime() - now
  if (ms <= 0) return <span className="dl closed">Program fasilitator ditutup</span>
  const days = Math.floor(ms / 864e5)
  const hours = Math.floor((ms % 864e5) / 36e5)
  const closeDate = DEADLINE.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
  return <span className="dl"><b>{days}</b> hari <b>{hours}</b> jam menuju penutupan fasilitator ({closeDate})</span>
}
