import { useMemo } from 'react'

const colors = ['#1e2d64', '#ea580c', '#fb923c', '#566dad', '#fdba74', '#b4c0e1']

// Lightweight CSS confetti burst. Pieces fall once and stop; hidden entirely for reduced motion.
export default function Confetti({ pieces = 90 }) {
  const bits = useMemo(() => Array.from({ length: pieces }, (_, i) => ({
    left: Math.random() * 100,
    delay: Math.random() * 0.6,
    duration: 2.2 + Math.random() * 1.6,
    drift: (Math.random() - 0.5) * 160,
    spin: (Math.random() - 0.5) * 900,
    w: 6 + Math.random() * 6,
    h: 8 + Math.random() * 8,
    color: colors[i % colors.length],
    round: Math.random() > 0.7,
  })), [pieces])
  return (
    <div className="confetti pointer-events-none fixed inset-0 z-[70] overflow-hidden" aria-hidden="true">
      {bits.map((b, i) => (
        <span
          key={i}
          className="confetti-piece"
          style={{
            left: `${b.left}%`, width: b.w, height: b.round ? b.w : b.h, background: b.color,
            borderRadius: b.round ? '9999px' : '2px', animationDelay: `${b.delay}s`, animationDuration: `${b.duration}s`,
            '--drift': `${b.drift}px`, '--spin': `${b.spin}deg`,
          }}
        />
      ))}
    </div>
  )
}
