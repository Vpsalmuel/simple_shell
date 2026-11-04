// Flat brand illustrations (navy / orange / soft neutrals). Decorative: aria-hidden.

export function WelcomeIllustration({ className = 'h-48 w-auto' }) {
  return (
    <svg viewBox="0 0 320 220" className={className} aria-hidden="true" fill="none">
      <ellipse cx="160" cy="200" rx="130" ry="12" fill="currentColor" className="text-slate-200 dark:text-slate-800" />
      <path d="M60 60h110a80 80 0 0 1 80 80" stroke="#ea580c" strokeWidth="22" />
      <path d="M60 105h70a45 45 0 0 1 45 45v45M60 105v90" stroke="#1e2d64" strokeWidth="22" className="dark:stroke-brand-300" />
      <rect x="49" y="176" width="22" height="22" fill="#1e2d64" className="dark:fill-brand-300" />
      {/* person */}
      <circle cx="252" cy="92" r="16" fill="#f4c7a1" />
      <path d="M236 88c0-14 10-22 18-22s16 6 16 16c-6-4-20-6-34 6Z" fill="#1e2d64" className="dark:fill-brand-200" />
      <path d="M226 196v-54c0-16 12-28 26-28s26 12 26 28v54" fill="#ea580c" />
      <path d="M226 150l-26 18" stroke="#f4c7a1" strokeWidth="9" strokeLinecap="round" />
      <path d="M278 146l18-30" stroke="#f4c7a1" strokeWidth="9" strokeLinecap="round" />
      <circle cx="298" cy="112" r="6" fill="#f4c7a1" />
      {/* sparkles */}
      <path d="M280 40l3 8 8 3-8 3-3 8-3-8-8-3 8-3Z" fill="#ea580c" />
      <path d="M40 30l2 5 5 2-5 2-2 5-2-5-5-2 5-2Z" fill="#3a5092" />
    </svg>
  )
}

export function CelebrateIllustration({ className = 'h-40 w-auto' }) {
  return (
    <svg viewBox="0 0 240 180" className={className} aria-hidden="true" fill="none">
      <ellipse cx="120" cy="164" rx="80" ry="8" fill="currentColor" className="text-slate-200 dark:text-slate-800" />
      <path d="M88 52h64v30a32 32 0 0 1-64 0Z" fill="#ea580c" />
      <path d="M88 60H70a16 16 0 0 0 18 26M152 60h18a16 16 0 0 1-18 26" stroke="#ea580c" strokeWidth="8" />
      <rect x="112" y="112" width="16" height="26" fill="#1e2d64" className="dark:fill-brand-300" />
      <rect x="94" y="136" width="52" height="16" rx="4" fill="#1e2d64" className="dark:fill-brand-300" />
      <path d="M112 72l6 6 12-14" stroke="#fff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      {[[30, 40, '#ea580c'], [200, 30, '#3a5092'], [50, 110, '#3a5092'], [196, 100, '#ea580c'], [120, 18, '#f59e0b'], [214, 64, '#10b981'], [26, 76, '#10b981']].map(([cx, cy, c], i) => (
        <rect key={i} x={cx} y={cy} width="8" height="14" rx="2" fill={c} transform={`rotate(${i * 37} ${cx} ${cy})`} />
      ))}
    </svg>
  )
}

export function EmptyIllustration({ className = 'h-28 w-auto' }) {
  return (
    <svg viewBox="0 0 160 120" className={className} aria-hidden="true" fill="none">
      <ellipse cx="80" cy="108" rx="56" ry="6" fill="currentColor" className="text-slate-200 dark:text-slate-800" />
      <rect x="36" y="20" width="64" height="80" rx="8" fill="currentColor" className="text-slate-100 dark:text-slate-800" />
      <rect x="48" y="36" width="40" height="6" rx="3" fill="currentColor" className="text-slate-300 dark:text-slate-600" />
      <rect x="48" y="50" width="30" height="6" rx="3" fill="currentColor" className="text-slate-300 dark:text-slate-600" />
      <circle cx="104" cy="70" r="20" stroke="#3a5092" strokeWidth="8" />
      <path d="M118 84l16 16" stroke="#ea580c" strokeWidth="10" strokeLinecap="round" />
    </svg>
  )
}
