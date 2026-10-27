import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Send, Sparkles, X } from 'lucide-react'
import { articles, faqs } from '../data/knowledge'
import { useUser } from '../context/UserContext'

const suggestions = ['How do I apply for leave?', 'I need access to a system', 'Where is the claims SOP?', 'Who do I call for IT help?']

// Offline answers when the server or API key is unavailable: match the Knowledge Center and FAQs.
function offlineAnswer(q) {
  const words = q.toLowerCase().split(/\W+/).filter((w) => w.length > 3)
  const score = (text) => words.filter((w) => text.toLowerCase().includes(w)).length
  const faq = faqs.map((f) => ({ f, s: score(f.q + ' ' + f.a) })).sort((a, b) => b.s - a.s)[0]
  const hits = articles.map((a) => ({ a, s: score([a.title, a.excerpt, ...a.body.flat()].join(' ')) })).filter((x) => x.s > 0).sort((a, b) => b.s - a.s).slice(0, 2)
  if (!hits.length && (!faq || faq.s === 0)) {
    return { text: 'I couldn’t find that in the Knowledge Center. The **Help Desk** can route your question to the right team.', links: [{ to: '/help', label: 'Open Help Desk' }] }
  }
  return {
    text: faq && faq.s > 0 ? `**${faq.f.q}**\n${faq.f.a}` : 'These Knowledge Center articles look relevant:',
    links: hits.map(({ a }) => ({ to: `/knowledge/${a.id}`, label: a.title })),
  }
}

// Minimal Markdown: paragraphs, "- " / "* " / "1. " lists, **bold**. Rendered as React nodes (no raw HTML).
function Markdown({ text }) {
  const bold = (line) => line.split(/(\*\*[^*]+\*\*)/g).map((part, i) => (part.startsWith('**') && part.endsWith('**') ? <strong key={i}>{part.slice(2, -2)}</strong> : part))
  const blocks = []
  for (const line of text.split('\n')) {
    const item = line.match(/^\s*(?:[-*]|\d+\.)\s+(.*)/)
    if (item) {
      const last = blocks.at(-1)
      if (last?.type === 'list') last.items.push(item[1])
      else blocks.push({ type: 'list', items: [item[1]] })
    } else if (line.trim()) blocks.push({ type: 'p', text: line })
  }
  return (
    <div className="space-y-2">
      {blocks.map((b, i) => (b.type === 'list'
        ? <ul key={i} className="list-disc space-y-1 pl-5">{b.items.map((t, j) => <li key={j}>{bold(t)}</li>)}</ul>
        : <p key={i}>{bold(b.text)}</p>))}
    </div>
  )
}

export default function RexAI() {
  const { user } = useUser()
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [draft, setDraft] = useState('')
  const [offline, setOffline] = useState(false)
  const [messages, setMessages] = useState([{ role: 'model', text: `Hi ${user.firstName}, I’m Rex AI. Ask me about policies, who to contact, or where to find something in Rex Hub.` }])
  const endRef = useRef(null)

  useEffect(() => { endRef.current?.scrollIntoView({ block: 'end' }) }, [messages, open])

  const send = async (text) => {
    const message = text.trim()
    if (!message || busy) return
    const history = messages.slice(1)
    setMessages((m) => [...m, { role: 'user', text: message }])
    setDraft('')
    setBusy(true)
    let reply
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, history, user: { name: user.name, role: user.role, dept: user.dept } }),
      })
      const data = await res.json()
      if (!res.ok) reply = { text: data.error ?? 'Rex AI is unavailable right now.' }
      else if (data.offline || !data.text) { setOffline(true); reply = offlineAnswer(message) }
      else reply = { text: data.text }
    } catch {
      setOffline(true)
      reply = offlineAnswer(message)
    }
    setMessages((m) => [...m, { role: 'model', ...reply }])
    setBusy(false)
  }

  return (
    <>
      {!open && (
        <button onClick={() => setOpen(true)} className="fixed right-4 bottom-4 z-40 flex items-center gap-2 rounded-full bg-accent-600 px-4 py-3 text-sm font-semibold text-white shadow-xl shadow-accent-600/30 transition hover:-translate-y-0.5 hover:bg-accent-700" style={{ marginBottom: 'env(safe-area-inset-bottom, 0px)' }}>
          <Sparkles size={18} /> Ask Rex AI
        </button>
      )}
      {open && (
        <section className="animate-fade-up fixed inset-x-2 bottom-2 z-50 flex max-h-[80vh] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl sm:inset-x-auto sm:right-4 sm:bottom-4 sm:w-96 dark:border-slate-800 dark:bg-slate-900" aria-label="Rex AI chat">
          <header className="flex items-center gap-3 bg-brand-700 px-4 py-3 text-white">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-600"><Sparkles size={16} /></span>
            <span className="flex-1"><span className="block text-sm font-semibold">Rex AI</span><span className="block text-[11px] text-brand-200">{offline ? 'Offline mode: answers from the Knowledge Center' : 'Powered by Gemini · can make mistakes'}</span></span>
            <button onClick={() => setOpen(false)} className="rounded-lg p-1.5 hover:bg-white/10" aria-label="Close Rex AI"><X size={18} /></button>
          </header>
          <div className="flex-1 space-y-3 overflow-y-auto p-4 text-sm" aria-live="polite">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : ''}`}>
                <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 ${m.role === 'user' ? 'bg-brand-700 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}>
                  <Markdown text={m.text} />
                  {m.links?.length > 0 && <div className="mt-2 flex flex-col gap-1">{m.links.map((l) => <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="font-medium text-brand-600 underline dark:text-brand-300">{l.label}</Link>)}</div>}
                </div>
              </div>
            ))}
            {busy && <div className="flex gap-1 px-2" aria-label="Rex AI is typing">{[0, 1, 2].map((i) => <span key={i} className="h-2 w-2 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: `${i * 120}ms` }} />)}</div>}
            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2 pt-1">{suggestions.map((s) => <button key={s} onClick={() => send(s)} className="chip border border-slate-200 px-3 py-1 text-xs hover:border-brand-400 dark:border-slate-700">{s}</button>)}</div>
            )}
            <div ref={endRef} />
          </div>
          <form onSubmit={(e) => { e.preventDefault(); send(draft) }} className="flex gap-2 border-t border-slate-100 p-3 dark:border-slate-800">
            <label htmlFor="rexai-input" className="sr-only">Message Rex AI</label>
            <input id="rexai-input" autoFocus className="input" placeholder="Ask anything about Rex…" value={draft} onChange={(e) => setDraft(e.target.value)} />
            <button className="btn-primary px-3" disabled={!draft.trim() || busy} aria-label="Send"><Send size={16} /></button>
          </form>
        </section>
      )}
    </>
  )
}
