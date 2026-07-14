// Medali peringkat 1-3 (emas/perak/perunggu) sebagai SVG, ganti emoji 🥇🥈🥉.
const MEDAL_COLORS = ['#fcc934', '#c9d3e6', '#d08b52']

export default function Medal({ i, className = '' }) {
  return (
    <svg className={'medal ' + className} viewBox="0 0 24 24" fill="none" stroke={MEDAL_COLORS[i]}
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-label={'Peringkat ' + (i + 1)}>
      <path d="M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15" />
      <path d="M11 12 5.12 2.2M13 12l5.88-9.8M8 7h8" />
      <circle cx="12" cy="17" r="5" />
      <path d="M12 18v-2h-.5" />
    </svg>
  )
}
