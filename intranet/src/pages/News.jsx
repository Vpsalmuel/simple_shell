import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeftIcon as ArrowLeft, ClockIcon as Clock, HeartIcon as Heart, ChatCircleIcon as MessageCircle, MagnifyingGlassIcon as Search, PaperPlaneTiltIcon as Send } from '@phosphor-icons/react'
import { useNews } from '../hooks/useNews'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useUser } from '../context/UserContext'
import Avatar from '../components/Avatar'
import Photo from '../components/Photo'
import PageHeader from '../components/PageHeader'

const fmtDate = (d) => new Date(d).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })

function useLikes() {
  const [liked, setLiked] = useLocalStorage('rex-liked', [])
  const toggle = (id) => setLiked(liked.includes(id) ? liked.filter((x) => x !== id) : [...liked, id])
  return [liked, toggle]
}

function LikeButton({ item, liked, toggle }) {
  const on = liked.includes(item.id)
  return (
    <button onClick={() => toggle(item.id)} aria-pressed={on} aria-label={on ? 'Unlike' : 'Like'} className={`inline-flex items-center gap-1 transition-colors ${on ? 'text-accent-700 dark:text-accent-400' : 'hover:text-accent-700 dark:hover:text-accent-400'}`}>
      <Heart size={14} weight={on ? 'fill' : 'regular'} /> {item.likes + (on ? 1 : 0)}
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

  if (!n) return <p className="text-slate-500">That story could not be found. <Link to="/news" className="link">Back to News</Link></p>

  const more = news.filter((x) => x.id !== n.id).slice(0, 5)
  const post = (e) => {
    e.preventDefault()
    if (!draft.trim()) return
    setComments([...comments, { name: user.name, text: draft.trim(), at: new Date().toISOString() }])
    setDraft('')
  }

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_16rem]">
      <article className="min-w-0">
        <Link to="/news" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white"><ArrowLeft size={14} /> All news</Link>
        <p className="mt-6 text-xs font-medium text-accent-700 dark:text-accent-400">{n.category}</p>
        <h1 className="mt-1 max-w-[30ch] text-[28px] leading-tight font-semibold text-slate-900 dark:text-white">{n.title}</h1>
        <div className="mt-3"><Meta n={n} liked={liked} toggle={toggle} /></div>
        <Photo src={n.image} alt="" className="mt-8 aspect-[2/1] w-full" rounded="rounded-xl" />
        <div className="mt-8 max-w-[65ch] space-y-4 text-[15px] leading-relaxed text-slate-700 dark:text-slate-300">
          <p className="text-[17px] text-slate-900 dark:text-white">{n.excerpt}</p>
          {n.body.map((p, i) => <p key={i}>{p}</p>)}
        </div>

        <section className="mt-12 max-w-[65ch] border-t border-slate-200 pt-6 dark:border-slate-800">
          <h2 className="section-title">Comments ({n.comments + comments.length})</h2>
          <ul className="mt-4 space-y-4">
            {comments.map((c, i) => (
              <li key={i} className="flex gap-3"><Avatar name={c.name} size="sm" /><div className="min-w-0 text-sm"><p className="font-medium text-slate-900 dark:text-white">{c.name}</p><p className="break-words">{c.text}</p></div></li>
            ))}
          </ul>
          <form onSubmit={post} className="mt-4 flex gap-2">
            <label htmlFor="comment" className="sr-only">Write a comment</label>
            <input id="comment" className="input h-9" placeholder="Write a comment" value={draft} onChange={(e) => setDraft(e.target.value)} />
            <button className="btn-primary" disabled={!draft.trim()}><Send size={16} /> <span className="hidden sm:inline">Post</span></button>
          </form>
        </section>
      </article>
      {/* 17 Nov review: More stories as a simple list. */}
      <aside className="lg:pt-16">
        <h2 className="mb-3 text-xs font-medium text-slate-500">More stories</h2>
        <ul className="divide-y divide-slate-200 border-y border-slate-200 dark:divide-slate-800 dark:border-slate-800">
          {more.map((m) => (
            <li key={m.id}>
              <Link to={`/news/${m.id}`} className="group block py-3">
                <span className="block text-sm leading-snug font-medium text-slate-800 group-hover:text-brand-700 dark:text-slate-200 dark:group-hover:text-brand-300">{m.title}</span>
                <span className="mt-1 block text-xs text-slate-500">{m.category}, {fmtDate(m.date)}</span>
              </Link>
            </li>
          ))}
        </ul>
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
    <div className="space-y-8">
      <PageHeader title="News" description="Stories, results and updates from across Rex." />

      {showFeatured && featured && (
        <Link to={`/news/${featured.id}`} className="img-zoom group -mt-2 grid gap-6 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:items-center">
          <Photo src={featured.image} alt="" className="aspect-[16/10] w-full" rounded="rounded-xl" />
          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium text-accent-700 dark:text-accent-400">Featured, {featured.category}</p>
            <h2 className="text-[22px] leading-snug font-semibold text-slate-900 group-hover:text-brand-700 dark:text-white dark:group-hover:text-brand-300">{featured.title}</h2>
            <p className="text-[15px] text-slate-600 dark:text-slate-300">{featured.excerpt}</p>
            <p className="text-xs text-slate-500">{featured.author}, {fmtDate(featured.date)}, {featured.readMins} min read</p>
          </div>
        </Link>
      )}

      <div className="flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center dark:border-slate-800">
        <div className="relative flex-1 sm:max-w-xs">
          <Search size={16} className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400" />
          <label htmlFor="news-q" className="sr-only">Search news</label>
          <input id="news-q" className="input h-9 pl-9" placeholder="Search news" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="-mx-1 flex gap-1 overflow-x-auto px-1">
          {cats.map((c) => <button key={c} onClick={() => setCat(c)} aria-pressed={cat === c} className={`h-8 shrink-0 rounded-lg px-3 text-sm transition-colors ${cat === c ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'}`}>{c}</button>)}
        </div>
      </div>

      {rest.length === 0 ? (
        <div className="card px-6 py-12 text-center"><p className="font-medium text-slate-900 dark:text-white">No stories match</p><p className="mt-1 text-sm text-slate-500">Try another word or category.</p></div>
      ) : (
        <div className="stagger grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((n) => (
            <article key={n.id} className="img-zoom flex flex-col">
              <Link to={`/news/${n.id}`} tabIndex={-1} aria-hidden="true"><Photo src={n.image} alt="" className="aspect-[16/9] w-full" rounded="rounded-lg" /></Link>
              <p className="mt-3 text-xs font-medium text-accent-700 dark:text-accent-400">{n.category}</p>
              <Link to={`/news/${n.id}`} className="mt-1 text-[15px] leading-snug font-semibold text-slate-900 hover:text-brand-700 dark:text-white dark:hover:text-brand-300">{n.title}</Link>
              <p className="mt-1 line-clamp-2 text-sm text-slate-500">{n.excerpt}</p>
              <div className="mt-auto pt-3"><Meta n={n} liked={liked} toggle={toggle} /></div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
