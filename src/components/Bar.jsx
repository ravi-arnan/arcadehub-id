// Progress bar milestone (Games / Badges).
export default function Bar({ label, cur, req }) {
  const pct = Math.min(100, (cur / req) * 100)
  return (
    <div className="bar">
      <span>{label}</span>
      <span className="track"><span className="fill" style={{ width: pct + '%' }} /></span>
      <span className="val">{Math.min(cur, req)} / {req}</span>
    </div>
  )
}
