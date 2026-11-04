const palette = [
  'bg-brand-100 text-brand-700 dark:bg-brand-500/25 dark:text-brand-100',
  'bg-accent-100 text-accent-800 dark:bg-accent-600/25 dark:text-accent-200',
  'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-200',
  'bg-violet-100 text-violet-800 dark:bg-violet-500/20 dark:text-violet-200',
  'bg-sky-100 text-sky-800 dark:bg-sky-500/20 dark:text-sky-200',
  'bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-200',
]
const statusColor = { online: 'bg-emerald-500', meeting: 'bg-amber-500', away: 'bg-slate-400', offline: 'bg-slate-300' }

export function initials(name) {
  return name.split(' ').map((p) => p[0]).slice(0, 2).join('')
}

export default function Avatar({ name, size = 'md', status }) {
  const sizes = { sm: 'h-8 w-8 text-xs', md: 'h-10 w-10 text-sm', lg: 'h-16 w-16 text-lg', xl: 'h-20 w-20 text-2xl' }
  const tone = palette[name.length % palette.length]
  return (
    <span className={`relative inline-flex shrink-0 items-center justify-center rounded-full font-semibold ${sizes[size]} ${tone}`}>
      {initials(name)}
      {status && <span className={`absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full ring-2 ring-white dark:ring-slate-900 ${statusColor[status]}`} title={status} />}
    </span>
  )
}
