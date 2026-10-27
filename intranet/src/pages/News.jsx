import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Clock, Heart, MessageCircle, Search, Send } from 'lucide-react'
import { useNews } from '../hooks/useNews'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useUser } from '../context/UserContext'
import Avatar from '../components/Avatar'
import Photo from '../components/Photo'
import { EmptyIllustration } from '../components/Illustrations'

const fmtDate = (d) => new Date(d).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })

function useLikes() {
  const [liked, setLiked] = useLocalStorage('rex-liked', [])
  const toggle = (id) => setLiked(liked.includes(id) ? liked.filter((x) => x !== id) : [...liked, id])
  return [liked, toggle]
}

function LikeButton({ item, liked, toggle }) {
  const on = liked.includes(item.id)
  return (
    <button onClick={() => toggle(item.id)} aria-pressed={on} className={`inline-flex items-center gap-1 transition ${on ? 'text-accent-600' : 'hover:text-accent-600'}`}>
      <Heart size={14} className={on ? 'fill-current' : ''} /> {item.likes + (on ? 1 : 0)}
    </button>
  )
}

function Meta({ n, liked, toggle }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
      <span>{n.author}</span>
      <span>{fmtDate(n.date)}</span>
      <span className="inline-flex items-center gap-1"><Clock size={12} /> {n.readMins} min</span>
      <LikeButton item={n} liked={liked} toggle={toggle} />
      <span className="inline-flex items-center gap-1"><MessageCircle size={14} /> {n.comments}</span>
    </div>
  )
}

function Article({ id, news }) {
  const n = news.find((x) => String(x.id) === id)
  const [liked, toggle] = useLikes()
  const { user } = useUser()
  const [comments, setComments] = useLocalStorage(`rex-comments-${id}`, [])
  const [draft, setDraft] = useState('')

  if (!n) return <p className="text-slate-500">That story could not be found. <Link to="/news" className="text-brand-600 underline">Back to News</Link></p>

  const more = news.filter((x) => x.id !== n.id).slice(0, 3)
  const post = (e) => {
    e.preventDefault()
    if (!draft.trim()) return
    setComments([...comments, { name: user.name, text: draft.trim(), at: new Date().toISOString() }])
    setDraft('')
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_300px] [&>*]:min-w-0">
      <article>
        <Link to="/news" className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:underline dark:text-brand-300"><ArrowLeft size={14} /> All news</Link>
        <span className="chip mt-4 bg-accent-50 text-accent-700 dark:bg-accent-700/20 dark:text-accent-400">{n.category}</span>
        <h1 className="mt-2 text-3xl font-extrabold text-balance text-slate-900 sm:text-4xl dark:text-white">{n.title}</h1>
        <div className="mt-3"><Meta n={n} liked={liked} toggle={toggle} /></div>
        <Photo src={n.image} alt="" className="mt-6 aspect-[2/1] w-full" rounded="rounded-2xl" />
        <div className="mt-6 max-w-[65ch] space-y-4 text-[1.05rem] leading-relaxed text-slate-700 dark:text-slate-300">
          <p className="text-lg font-medium text-slate-900 dark:text-white">{n.excerpt}</p>
          {n.body.map((p, i) => <p key={i}>{p}</p>)}
        </div>

        <section className="mt-10 border-t border-slate-200 pt-6 dark:border-slate-800">
          <h2 className="text-base font-semibold">Comments ({n.comments + comments.length})</h2>
          <ul className="mt-4 space-y-4">
            {comments.map((c, i) => (
              <li key={i} className="flex gap-3"><Avatar name={c.name} size="sm" /><div className="min-w-0 rounded-2xl bg-slate-100 px-4 py-2.5 text-sm dark:bg-slate-800"><p className="font-semibold">{c.name}</p><p className="break-words">{c.text}</p></div></li>
            ))}
          </ul>
          <form onSubmit={post} className="mt-4 flex gap-2">
            <label htmlFor="comment" className="sr-only">Write a comment</label>
            <input id="comment" className="input" placeholder="Write a comment…" value={draft} onChange={(e) => setDraft(e.target.value)} />
            <button className="btn-primary" disabled={!draft.trim()}><Send size={16} /> <span className="hidden sm:inline">Post</span></button>
          </form>
        </section>
      </article>
      <aside className="space-y-4 lg:pt-10">
        <h2 className="text-sm font-semibold text-slate-500">More stories</h2>
        {more.map((m) => (
          <Link key={m.id} to={`/news/${m.id}`} className="card card-hover block overflow-hidden">
            <Photo src={m.image} alt="" label={m.category} className="aspect-[2/1] w-full" rounded="rounded-none" />
            <p className="p-4 text-sm font-semibold">{m.title}</p>
          </Link>
        ))}
      </aside>
    </div>
  )
}

export default function News() {
  const { id } = useParams()
  const { news } = useNews()
  const [liked, toggle] = useLikes()
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('All')
  const cats = ['All', ...new Set(news.map((n) => n.category))]

  const filtered = useMemo(() => {
    const t = q.toLowerCase()
    return news.filter((n) => (cat === 'All' || n.category === cat) && (n.title.toLowerCase().includes(t) || n.excerpt.toLowerCase().includes(t)))
  }, [q, cat, news])

  if (id) return <Article id={id} news={news} />

  const showFeatured = cat === 'All' && !q
  const featured = news.find((n) => n.featured)
  const rest = showFeatured ? filtered.filter((n) => n !== featured) : filtered

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl dark:text-white">News</h1>
        <p className="mt-1 text-sm text-slate-500">Stories, results and updates from across Rex.</p>
      </div>

      {showFeatured && featured && (
        <Link to={`/news/${featured.id}`} className="card card-hover group grid overflow-hidden md:grid-cols-2">
          <Photo src={featured.image} alt="" className="aspect-[16/10] w-full md:aspect-auto md:h-full" rounded="rounded-none" />
          <div className="flex flex-col justify-center gap-3 p-6 sm:p-8">
            <span className="chip w-fit bg-accent-600 text-white">Featured · {featured.category}</span>
            <h2 className="text-2xl font-extrabold text-balance group-hover:text-brand-600 dark:group-hover:text-brand-300">{featured.title}</h2>
            <p className="text-slate-600 dark:text-slate-300">{featured.excerpt}</p>
            <div className="text-xs text-slate-500">{featured.author} · {fmtDate(featured.date)} · {featured.readMins} min read</div>
          </div>
        </Link>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={16} className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400" />
          <label htmlFor="news-q" className="sr-only">Search news</label>
          <input id="news-q" className="input pl-9" placeholder="Search news" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          {cats.map((c) => <button key={c} onClick={() => setCat(c)} className={`chip shrink-0 px-3 py-1.5 text-sm transition ${cat === c ? 'bg-brand-700 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-700'}`}>{c}</button>)}
        </div>
      </div>

      {rest.length === 0 ? (
        <div className="card flex flex-col items-center p-12 text-center"><EmptyIllustration /><p className="mt-3 font-semibold">No stories match</p><p className="text-sm text-slate-500">Try another word or category.</p></div>
      ) : (
        <div className="stagger grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((n) => (
            <article key={n.id} className="card card-hover flex flex-col overflow-hidden">
              <Link to={`/news/${n.id}`}><Photo src={n.image} alt="" label={n.category} className="aspect-[16/9] w-full" rounded="rounded-none" /></Link>
              <div className="flex flex-1 flex-col gap-2 p-5">
                <Link to={`/news/${n.id}`} className="font-display text-lg leading-snug font-bold hover:text-brand-600 dark:hover:text-brand-300">{n.title}</Link>
                <p className="line-clamp-2 text-sm text-slate-500">{n.excerpt}</p>
                <div className="mt-auto pt-2"><Meta n={n} liked={liked} toggle={toggle} /></div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
