// Animasi expand/collapse tinggi yang mulus tanpa perlu tahu tinggi konten:
// grid-template-rows 0fr -> 1fr (didukung browser modern). Nol dependency.
// Konten tetap di DOM; visibility diatur lewat class .open.
export default function Collapse({ open, children }) {
  return (
    <div className={'collapse' + (open ? ' open' : '')} aria-hidden={!open}>
      <div className="collapse-inner">{children}</div>
    </div>
  )
}
