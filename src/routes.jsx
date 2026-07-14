// Definisi rute + metadata navigasi (dipakai Nav dan Footer).
export const NAV = [
  { path: '/points', label: 'Poin Saya', icon: <path d="M3 12h4l3 8 4-16 3 8h4" /> },
  { path: '/leaderboard', label: 'Leaderboard', icon: <path d="M8 21h8M12 17v4M6 4h12v4a6 6 0 0 1-12 0V4zM6 5H3v1a3 3 0 0 0 3 3M18 5h3v1a3 3 0 0 1-3 3" /> },
  { path: '/catalog', label: 'Katalog', icon: <g><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></g> },
  { path: '/prizes', label: 'Hadiah', icon: <path d="M20 12v9H4v-9M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" /> },
  { path: '/info', label: 'Info', icon: <g><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></g> },
  { path: '/contribute', label: 'Kontribusi', icon: <g><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></g> },
]

export function NavIcon({ icon }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{icon}</svg>
}
