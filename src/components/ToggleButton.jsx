// Tombol buka/tutup pendamping <Collapse>. Sebelumnya markup yang sama (class sh-toggle,
// chevron sh-chev yang berputar, aria-expanded) ditulis ulang di StartHere, PastGames, dan
// BonusMilestone, jadi aria-expanded gampang tertinggal saat menambah bagian baru.
export default function ToggleButton({ open, onToggle, className = '', showLabel = 'Lihat', hideLabel = 'Sembunyikan' }) {
  return (
    <button className={'sh-toggle' + (className ? ' ' + className : '')} onClick={onToggle} aria-expanded={open}>
      {open ? hideLabel : showLabel} <span className={'sh-chev' + (open ? ' up' : '')} aria-hidden>▾</span>
    </button>
  )
}
