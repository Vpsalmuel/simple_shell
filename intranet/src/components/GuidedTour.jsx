import { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, X } from 'lucide-react'
import Portal from './Portal'

// Tour steps from the AI Studio prototype. `target` is a data-tour value; the first visible match is used.
const steps = [
  { title: 'Welcome to Rex Hub', text: 'A quick tour of your new digital workspace. It takes about 30 seconds.' },
  { target: ['nav', 'menu'], title: 'Everything in one menu', text: 'Your tools, teams and company news live here, grouped into Workspace, Work, Knowledge, Company and You.' },
  { target: ['search'], title: 'Search everything', text: 'Find colleagues, pages, news, documents and requests. Shortcut: Ctrl+K (⌘K on Mac).' },
  { target: ['rexai'], title: 'Ask Rex AI', text: 'Got a question? Rex AI can point you to the right policy, page or person.' },
  { target: ['profile'], title: 'Your profile', text: 'Your settings live here. You can replay this tour from this menu at any time.' },
]

function findTarget(names) {
  for (const n of names ?? []) {
    for (const el of document.querySelectorAll(`[data-tour="${n}"]`)) {
      const r = el.getBoundingClientRect()
      if (r.width > 0 && r.height > 0) return r
    }
  }
  return null
}

export default function GuidedTour({ open, onClose }) {
  const [i, setI] = useState(0)
  const [rect, setRect] = useState(null)
  const step = steps[i]

  const measure = useCallback(() => setRect(findTarget(step.target)), [step])
  useLayoutEffect(() => { if (open) measure() }, [open, measure])
  useEffect(() => {
    if (!open) return
    setI((x) => x)
    window.addEventListener('resize', measure)
    window.addEventListener('scroll', measure, true)
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') setI((x) => Math.min(x + 1, steps.length - 1))
      if (e.key === 'ArrowLeft') setI((x) => Math.max(x - 1, 0))
    }
    window.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('resize', measure); window.removeEventListener('scroll', measure, true); window.removeEventListener('keydown', onKey) }
  }, [open, measure, onClose])
  useEffect(() => { if (open) setI(0) }, [open])

  if (!open) return null
  const pad = 6
  const vw = window.innerWidth
  const vh = window.innerHeight
  const cardW = Math.min(340, vw - 32)

  // Place the card beside the target: right of tall/left items, otherwise below or above.
  let pos = { left: (vw - cardW) / 2, top: vh / 2 - 100 }
  if (rect) {
    if (rect.height > vh * 0.5 && rect.right + cardW + 24 < vw) pos = { left: rect.right + 16, top: Math.min(rect.top + 120, vh - 260) }
    else if (rect.bottom + 230 < vh) pos = { left: Math.min(Math.max(16, rect.left + rect.width / 2 - cardW / 2), vw - cardW - 16), top: rect.bottom + 14 }
    else pos = { left: Math.min(Math.max(16, rect.right - cardW), vw - cardW - 16), top: Math.max(16, rect.top - 230) }
  }
  const last = i === steps.length - 1

  return (
    <Portal>
      <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-labelledby="tour-title">
        {rect ? (
          <div className="pointer-events-none fixed rounded-2xl ring-4 ring-accent-500 transition-all duration-300" style={{ left: rect.left - pad, top: rect.top - pad, width: rect.width + pad * 2, height: rect.height + pad * 2, boxShadow: '0 0 0 9999px rgba(11, 17, 38, 0.6)' }} />
        ) : (
          <div className="fixed inset-0 bg-brand-950/60" />
        )}
        <div key={i} className="animate-fade-up fixed rounded-2xl bg-white p-5 shadow-2xl dark:bg-slate-900" style={{ ...pos, width: cardW }}>
          <div className="flex items-start justify-between gap-3">
            <p className="text-xs font-semibold text-accent-700 dark:text-accent-400">{i + 1} of {steps.length}</p>
            <button onClick={onClose} className="btn-ghost -m-1.5 p-1.5" aria-label="Skip tour"><X size={16} /></button>
          </div>
          <h2 id="tour-title" className="mt-1 text-lg font-bold">{step.title}</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{step.text}</p>
          <div className="mt-4 flex items-center gap-2">
            <div className="flex flex-1 gap-1" aria-hidden="true">{steps.map((_, n) => <span key={n} className={`h-1.5 rounded-full transition-all ${n === i ? 'w-5 bg-accent-600' : 'w-1.5 bg-slate-300 dark:bg-slate-600'}`} />)}</div>
            {i > 0 && <button onClick={() => setI(i - 1)} className="btn-ghost px-3 py-1.5"><ArrowLeft size={14} /> Back</button>}
            <button autoFocus onClick={() => (last ? onClose() : setI(i + 1))} className="btn-primary px-4 py-1.5">{last ? 'Done' : <>Next <ArrowRight size={14} /></>}</button>
          </div>
        </div>
      </div>
    </Portal>
  )
}
