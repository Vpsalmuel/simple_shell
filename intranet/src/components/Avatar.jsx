const palette = ['bg-brand-100 text-brand-700', 'bg-accent-100 text-accent-700', 'bg-emerald-100 text-emerald-700', 'bg-violet-100 text-violet-700', 'bg-sky-100 text-sky-700', 'bg-rose-100 text-rose-700']
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
