import { m } from 'framer-motion'

// Progress bar milestone: tumbuh saat masuk viewport + kilau berkala biar tidak statis.
export default function Bar({ label, cur, req }) {
  const pct = Math.min(100, (cur / req) * 100)
  return (
    <div className="bar">
      <span>{label}</span>
      <span className="track">
        <m.span className="fill" style={{ width: pct + '%' }}
          initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
          {pct > 0 && <span className="fill-shine" />}
        </m.span>
      </span>
      <span className="val">{Math.min(cur, req)} / {req}</span>
    </div>
  )
}
