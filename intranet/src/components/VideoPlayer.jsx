import { useEffect, useRef, useState } from 'react'
import { CheckCircle2, Pause, Play } from 'lucide-react'

const toSeconds = (d) => d.split(':').reduce((a, b) => a * 60 + Number(b), 0)
const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`

// Plays a real video when `src` is set and reports completion at 90% watched.
// Without `src` it renders a placeholder that simulates playback (sped up) so the flow can be tested.
export default function VideoPlayer({ src, poster, duration = '2:00', title, watched, onComplete, compact = false }) {
  const videoRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [pos, setPos] = useState(watched ? toSeconds(duration) : 0)
  const total = toSeconds(duration)

  // Placeholder playback: ~6 real seconds for the full clip.
  useEffect(() => {
    if (src || !playing) return
    const step = total / 60
    const t = setInterval(() => {
      setPos((p) => {
        const next = Math.min(total, p + step)
        if (next >= total) setPlaying(false)
        return next
      })
    }, 100)
    return () => clearInterval(t)
  }, [src, playing, total])

  useEffect(() => {
    if (!watched && pos >= total * 0.9) onComplete?.()
  }, [pos, total, watched, onComplete])

  const pct = (pos / total) * 100

  if (src) {
    return (
      <div className="overflow-hidden rounded-2xl bg-black">
        <video
          ref={videoRef}
          src={src}
          poster={poster ?? undefined}
          controls
          className="aspect-video w-full"
          onTimeUpdate={(e) => setPos((e.currentTarget.currentTime / (e.currentTarget.duration || 1)) * total)}
        />
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-700 via-brand-800 to-brand-950 text-white ${compact ? 'aspect-[16/10]' : 'aspect-video'}`}>
      <div className="absolute -top-1/3 -right-1/4 h-full w-2/3 rounded-full bg-accent-600/25 blur-3xl" aria-hidden="true" />
      <div className="absolute -bottom-1/2 -left-1/4 h-full w-2/3 rounded-full bg-brand-400/20 blur-3xl" aria-hidden="true" />
      <button
        onClick={() => (pos >= total ? (setPos(0), setPlaying(true)) : setPlaying(!playing))}
        className="absolute inset-0 flex items-center justify-center"
        aria-label={playing ? `Pause ${title}` : `Play ${title}`}
      >
        <span className={`flex items-center justify-center rounded-full bg-white/95 text-brand-800 shadow-xl transition hover:scale-105 ${compact ? 'h-12 w-12' : 'h-16 w-16'}`}>
          {playing ? <Pause size={compact ? 20 : 26} /> : <Play size={compact ? 20 : 26} className="ml-1" />}
        </span>
      </button>
      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-3">
        <span className={`font-semibold ${compact ? 'text-sm' : 'text-base'}`}>{title}</span>
        {watched && <span className="chip animate-pop gap-1 bg-emerald-500 text-white"><CheckCircle2 size={12} /> Watched</span>}
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 p-3">
        <div className="mb-1 flex justify-between text-[11px] text-white/80"><span>{fmt(pos)}</span><span>{duration}</span></div>
        <div className="h-1.5 rounded-full bg-white/20"><div className="h-1.5 rounded-full bg-accent-500 transition-[width] duration-100" style={{ width: `${pct}%` }} /></div>
        {!compact && <p className="mt-2 text-[11px] text-white/60">Video placeholder: add the file URL in src/data/onboarding.js</p>}
      </div>
    </div>
  )
}
