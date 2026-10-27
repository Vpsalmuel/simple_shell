import { useId, useState } from 'react'

// Single-series trend line with a hover crosshair + tooltip. No legend: the card title names the series.
export default function Sparkline({ series, format = (v) => v, label = 'Trend', height = 40 }) {
  const [hover, setHover] = useState(null)
  const gradId = useId()
  const w = 120
  const pad = 3
  const min = Math.min(...series)
  const max = Math.max(...series)
  const x = (i) => pad + (i / (series.length - 1)) * (w - pad * 2)
  const y = (v) => pad + (1 - (v - min) / (max - min || 1)) * (height - pad * 2)
  const points = series.map((v, i) => [x(i), y(v)])
  const line = points.map(([px, py], i) => `${i ? 'L' : 'M'}${px.toFixed(1)},${py.toFixed(1)}`).join(' ')
  const area = `${line} L${x(series.length - 1)},${height} L${x(0)},${height} Z`

  const onMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const rel = ((e.clientX - rect.left) / rect.width) * w
    const i = Math.round(((rel - pad) / (w - pad * 2)) * (series.length - 1))
    setHover(Math.max(0, Math.min(series.length - 1, i)))
  }

  const active = hover ?? series.length - 1
  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${w} ${height}`}
        preserveAspectRatio="none"
        className="block h-10 w-full overflow-visible"
        role="img"
        aria-label={`${label}: ${series.length} weeks, from ${format(series[0])} to ${format(series[series.length - 1])}`}
        onMouseMove={onMove}
        onMouseLeave={() => setHover(null)}
      >
        <defs>
          <linearGradient id={gradId} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity="0.18" />
            <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill={`url(#${gradId})`} />
        <path d={line} fill="none" stroke="var(--color-chart-1)" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" />
        {hover !== null && <line x1={points[active][0]} x2={points[active][0]} y1="0" y2={height} stroke="currentColor" className="text-slate-300 dark:text-slate-600" strokeWidth="1" vectorEffect="non-scaling-stroke" />}
      </svg>
      {/* Marker drawn in HTML so it stays round when the SVG stretches. */}
      <span
        className="pointer-events-none absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[var(--color-chart-1)] dark:border-slate-900"
        style={{ left: `${(points[active][0] / w) * 100}%`, top: `${(points[active][1] / height) * 100}%` }}
      />
      {hover !== null && (
        <span
          className="pointer-events-none absolute -top-7 -translate-x-1/2 rounded-md bg-slate-900 px-1.5 py-0.5 text-[11px] font-medium whitespace-nowrap text-white shadow"
          style={{ left: `${(points[active][0] / w) * 100}%` }}
        >
          {hover === series.length - 1 ? 'This week' : `${series.length - 1 - hover}w ago`} · {format(series[hover])}
        </span>
      )}
    </div>
  )
}
