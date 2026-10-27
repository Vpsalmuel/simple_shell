import { AlertOctagon, AlertTriangle, CheckCircle2, Clock } from 'lucide-react'

// Status always ships with an icon + label, never color alone.
const tones = {
  good: { cls: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400', Icon: CheckCircle2 },
  warning: { cls: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400', Icon: AlertTriangle },
  critical: { cls: 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400', Icon: AlertOctagon },
  neutral: { cls: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300', Icon: Clock },
}

export default function StatusBadge({ tone = 'neutral', children }) {
  const { cls, Icon } = tones[tone] ?? tones.neutral
  return <span className={`chip shrink-0 gap-1 ${cls}`}><Icon size={12} />{children}</span>
}
