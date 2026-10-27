import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Inbox, Megaphone, Newspaper, Trash2, Users } from 'lucide-react'
import { people } from '../data'
import { closedStatuses, initialRequests, requestDepts } from '../data/requests'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useNews } from '../hooks/useNews'
import { useUser } from '../context/UserContext'
import { useToast } from '../components/Toast'
import Photo from '../components/Photo'
import SectionHeader from '../components/SectionHeader'

const categories = ['Company', 'Product', 'Claims', 'People', 'IT', 'Wellbeing', 'Compliance']
const audiences = ['Everyone', 'New staff', 'Existing staff', 'Management']
const blank = { title: '', category: 'Company', excerpt: '', body: '', audience: 'Everyone', featured: false }

function Stat({ icon: Ico, label, value, to }) {
  const inner = (
    <>
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 dark:bg-slate-800 dark:text-brand-200"><Ico size={20} /></span>
      <span><span className="block font-display text-2xl font-extrabold tabular-nums">{value}</span><span className="block text-xs text-slate-500">{label}</span></span>
    </>
  )
  return to ? <Link to={to} className="card card-hover flex items-center gap-4 p-5">{inner}</Link> : <div className="card flex items-center gap-4 p-5">{inner}</div>
}

export default function Admin() {
  const { user } = useUser()
  const toast = useToast()
  const [requests] = useLocalStorage('rex-requests', initialRequests)
  const { news, posts, publish, remove } = useNews()
  const [f, setF] = useState(blank)
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })

  const open = requests.filter((r) => !closedStatuses.includes(r.status))
  const byDept = requestDepts.map((d) => ({ dept: d, n: open.filter((r) => r.to === d).length })).sort((a, b) => b.n - a.n)
  const max = Math.max(1, ...byDept.map((d) => d.n))

  const submit = (e) => {
    e.preventDefault()
    publish({ ...f, author: user.name, date: new Date().toISOString().slice(0, 10), readMins: Math.max(1, Math.round(f.body.split(/\s+/).length / 200)), body: f.body.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean) })
    setF(blank)
    toast('Published to News and the Home feed')
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-accent-700 dark:text-accent-400">Signed in as {user.dept} admin</p>
        <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl dark:text-white">Admin Workspace</h1>
        <p className="mt-1 text-sm text-slate-500">Publish company news and keep an eye on requests across departments.</p>
      </div>

      <section className="stagger grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Overview">
        <Stat icon={Inbox} label="Open requests, all teams" value={open.length} to="/requests?tab=open" />
        <Stat icon={Inbox} label={`${user.dept} queue`} value={open.filter((r) => r.to === user.dept).length} to="/requests?tab=queue" />
        <Stat icon={Newspaper} label="Published stories" value={news.length} to="/news" />
        <Stat icon={Users} label="Colleagues on Rex Hub" value={people.length} to="/people" />
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_380px] [&>*]:min-w-0">
        <section className="card self-start p-5">
          <SectionHeader title="Publish news" subtitle="Appears on the News page and in everyone’s Home feed" />
          <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm font-medium md:col-span-2" htmlFor="ad-title">Headline
              <input id="ad-title" required maxLength={100} className="input mt-1" value={f.title} onChange={set('title')} placeholder="e.g. Single sign-on goes live on 3 November" />
            </label>
            <label className="block text-sm font-medium" htmlFor="ad-cat">Category
              <select id="ad-cat" className="input mt-1" value={f.category} onChange={set('category')}>{categories.map((c) => <option key={c}>{c}</option>)}</select>
            </label>
            <label className="block text-sm font-medium" htmlFor="ad-aud">Audience
              <select id="ad-aud" className="input mt-1" value={f.audience} onChange={set('audience')}>{audiences.map((c) => <option key={c}>{c}</option>)}</select>
            </label>
            <label className="block text-sm font-medium md:col-span-2" htmlFor="ad-sum">Summary
              <input id="ad-sum" required maxLength={160} className="input mt-1" value={f.excerpt} onChange={set('excerpt')} placeholder="One sentence shown on cards" />
            </label>
            <label className="block text-sm font-medium md:col-span-2" htmlFor="ad-body">Story
              <textarea id="ad-body" required rows={6} className="input mt-1" value={f.body} onChange={set('body')} placeholder="Leave a blank line between paragraphs." />
            </label>
            <label className="flex items-center gap-2 text-sm md:col-span-2">
              <input type="checkbox" checked={f.featured} onChange={(e) => setF({ ...f, featured: e.target.checked })} className="h-4 w-4 accent-[var(--color-brand-700)]" />
              Feature at the top of the News page
            </label>
            <div className="flex justify-end md:col-span-2"><button className="btn-primary"><Megaphone size={16} /> Publish</button></div>
          </form>
        </section>

        <div className="space-y-6">
          <section className="card overflow-hidden">
            <Photo src={null} label={f.category} className="aspect-[16/8] w-full" rounded="rounded-none" />
            <div className="p-5">
              <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Preview</p>
              <p className="mt-1 font-display text-lg font-bold">{f.title || 'Your headline'}</p>
              <p className="mt-1 text-sm text-slate-500">{f.excerpt || 'Your one-sentence summary.'}</p>
              <p className="mt-3 text-xs text-slate-400">{user.name} · for {f.audience.toLowerCase()}</p>
            </div>
          </section>

          <section className="card p-5">
            <SectionHeader title="Open requests by team" />
            <ul className="space-y-3" aria-label="Open requests by receiving team">
              {byDept.map((d) => (
                <li key={d.dept}>
                  <div className="mb-1 flex justify-between text-sm"><span>{d.dept}</span><span className="font-medium tabular-nums">{d.n}</span></div>
                  <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800"><div className="h-2 rounded-full bg-[var(--color-chart-1)] transition-[width] duration-700" style={{ width: `${(d.n / max) * 100}%` }} /></div>
                </li>
              ))}
            </ul>
          </section>

          {posts.length > 0 && (
            <section className="card p-5">
              <SectionHeader title="Your published stories" />
              <ul className="space-y-2">
                {posts.map((p) => (
                  <li key={p.id} className="flex items-center gap-2 text-sm">
                    <Link to={`/news/${p.id}`} className="min-w-0 flex-1 truncate hover:text-brand-600 dark:hover:text-brand-300">{p.title}</Link>
                    <button onClick={() => { remove(p.id); toast('Story removed') }} className="btn-ghost p-1.5 text-rose-600" aria-label={`Remove ${p.title}`}><Trash2 size={14} /></button>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
