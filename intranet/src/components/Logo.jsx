import { brand } from '../config/brand'

// SVG redraw of the Rex mark: orange arc over a navy "R" stem.
function RexMark({ className = 'h-9 w-9' }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path d="M6 9h20a16 16 0 0 1 16 16" fill="none" stroke="#ea580c" strokeWidth="7" strokeLinecap="round" />
      <path d="M6 21h16a9 9 0 0 1 9 9v12M6 21v21" fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function Logo({ compact = false, onLight = false }) {
  if (brand.logo) {
    return <img src={brand.logo} alt={brand.name} className={compact ? 'h-9 w-9 object-contain object-left' : 'h-10 w-auto'} />
  }
  // onLight: logo sits on a fixed white surface, so it stays navy in dark mode too.
  const color = onLight ? 'text-brand-700' : 'text-brand-700 dark:text-white'
  return (
    <span className={`flex items-center gap-2 ${color}`}>
      <RexMark />
      {!compact && (
        <span className="leading-none">
          <span className="block text-xl font-extrabold tracking-tight">rex</span>
          <span className="block text-[11px] font-semibold tracking-wide opacity-80">insurance</span>
        </span>
      )}
    </span>
  )
}
