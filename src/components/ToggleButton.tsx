// Tombol buka/tutup pendamping <Collapse>. Sebelumnya markup yang sama (class sh-toggle,
// chevron sh-chev yang berputar, aria-expanded) ditulis ulang di StartHere, PastGames, dan
// BonusMilestone, jadi aria-expanded gampang tertinggal saat menambah bagian baru.

import { IconChevronDown } from '../icons'

export interface ToggleButtonProps {
  open: boolean
  onToggle: () => void
  className?: string
  showLabel?: string
  hideLabel?: string
}

export default function ToggleButton({
  open,
  onToggle,
  className = '',
  showLabel = 'Lihat',
  hideLabel = 'Sembunyikan',
}: ToggleButtonProps) {
  return (
    <button
      type="button"
      className={'sh-toggle' + (className ? ' ' + className : '')}
      onClick={onToggle}
      aria-expanded={open}
    >
      {open ? hideLabel : showLabel}{' '}
      <span className={'sh-chev' + (open ? ' up' : '')} aria-hidden>
        <IconChevronDown style={{ width: 14, height: 14, display: 'inline-block', verticalAlign: 'middle' }} />
      </span>
    </button>
  )
}
