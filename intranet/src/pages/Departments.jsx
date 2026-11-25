import { Link, useParams } from 'react-router-dom'
import { ArrowLeftIcon as ArrowLeft, ArrowRightIcon as ArrowRight, CopyIcon as Copy, FileTextIcon as FileText, EnvelopeSimpleIcon as Mail, MapPinIcon as MapPin, UsersIcon as Users } from '@phosphor-icons/react'
import { departmentTour as departments } from '../data/onboarding'
import { documents, events, people } from '../data'
import { useToast } from '../components/Toast'
import Avatar from '../components/Avatar'
import Photo from '../components/Photo'
import SectionHeader from '../components/SectionHeader'
import VideoPlayer from '../components/VideoPlayer'
import PageHeader from '../components/PageHeader'

// Which document-library categories belong to which department.
const docCategories = { Claims: ['Claims'], Underwriting: ['Underwriting'], HR: ['HR'], 'Legal & Compliance': ['Compliance'], Finance: ['Templates'] }

function CopyEmail({ email }) {
  const toast = useToast()
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email)
      toast('Email address copied')
    } catch {
      toast(email)
    }
  }
  return (
    <span className="flex items-center gap-2">
      <Mail size={14} className="shrink-0 text-slate-400" />
      <span className="truncate select-all">{email}</span>
      <button onClick={copy} className="btn-ghost h-7 w-7 px-0" aria-label={`Copy ${email}`}><Copy size={14} /></button>
    </span>
  )
}

function Detail({ d }) {
  const team = people.filter((p) => p.dept === d.dept)
  const head = people.find((p) => p.name === d.head)
  const docs = documents.filter((doc) => (docCategories[d.dept] ?? []).includes(doc.category))
  const evs = events.filter((e) => e.host === d.dept || e.host === d.name).slice(0, 3)

  return (
    <div>
      <Link to="/departments" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white"><ArrowLeft size={14} /> All departments</Link>
      <div className="mt-6">
        <PageHeader title={d.name} description={d.what}>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-slate-500">
            <span className="inline-flex items-center gap-1.5"><Users size={15} /> {d.headcount} people</span>
            <span className="inline-flex items-center gap-1.5"><MapPin size={15} /> {d.location}</span>
          </div>
        </PageHeader>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0 space-y-8">
          <section>
            <SectionHeader title="Life in the team" subtitle="A short culture video from the team" />
            <VideoPlayer title={`Inside ${d.name}`} {...d.video} watched={false} />
          </section>
          <section className="card p-5">
            <SectionHeader title="Team" subtitle={`${team.length} on Rex Hub`} />
            {team.length ? (
              <ul className="grid gap-3 sm:grid-cols-2">
                {team.map((p) => (
                  <li key={p.id}><a href={`mailto:${p.email}`} className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/60"><Avatar name={p.name} size="sm" /><span className="min-w-0"><span className="block truncate text-sm font-medium text-slate-900 dark:text-white">{p.name}</span><span className="block truncate text-xs text-slate-500">{p.role}</span></span></a></li>
                ))}
              </ul>
            ) : <p className="text-sm text-slate-500">Team profiles will appear here once they are added to the directory.</p>}
          </section>
        </div>

        <aside className="space-y-6">
          <section className="card p-5">
            <SectionHeader title="Head of department" />
            <div className="flex items-center gap-3">
              <Avatar name={d.head} size="lg" />
              <div className="min-w-0"><p className="font-semibold text-slate-900 dark:text-white">{d.head}</p><p className="text-sm text-slate-500">{head?.role ?? `Head of ${d.name}`}</p></div>
            </div>
            <div className="mt-4 border-t border-slate-100 pt-4 text-sm dark:border-slate-800"><CopyEmail email={d.contact} /></div>
          </section>
          <section className="card p-5">
            <SectionHeader title="How we can help" />
            <ul className="space-y-2 text-sm">{d.services.map((s) => <li key={s} className="flex items-center gap-2"><ArrowRight size={14} className="text-accent-600" />{s}</li>)}</ul>
          </section>
          {docs.length > 0 && (
            <section className="card p-5">
              <SectionHeader title="Key documents" />
              <ul className="space-y-2 text-sm">{docs.map((doc) => <li key={doc.id}><Link to={`/knowledge?tab=documents&q=${encodeURIComponent(doc.title)}`} className="flex items-center gap-2 hover:text-brand-600 dark:hover:text-brand-300"><FileText size={14} className="shrink-0 text-slate-400" /><span className="truncate">{doc.title}</span></Link></li>)}</ul>
            </section>
          )}
          {evs.length > 0 && (
            <section className="card p-5">
              <SectionHeader title="Team events" />
              <ul className="space-y-2 text-sm">{evs.map((e) => <li key={e.id}><Link to="/events" className="hover:text-brand-700 dark:hover:text-brand-300"><b className="font-medium">{new Date(`${e.date}T00:00`).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}</b>, {e.title}</Link></li>)}</ul>
            </section>
          )}
        </aside>
      </div>
    </div>
  )
}

export default function Departments() {
  const { id } = useParams()
  if (id) {
    const d = departments.find((x) => x.id === id)
    return d ? <Detail d={d} /> : <p className="text-slate-500">Department not found. <Link to="/departments" className="link">See all departments</Link></p>
  }

  return (
    <div>
      <PageHeader title="Departments" description={`${departments.length} teams, ${departments.reduce((t, d) => t + d.headcount, 0)} colleagues. Names and details are being confirmed with each department.`} />
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {departments.map((d) => (
          <Link key={d.id} to={`/departments/${d.id}`} className="card card-hover group flex flex-col overflow-hidden">
            <Photo src={d.image} alt="" className="aspect-[16/9] w-full" rounded="rounded-none" />
            <div className="flex flex-1 flex-col gap-1.5 p-5">
              <h2 className="text-[15px] font-semibold text-slate-900 group-hover:text-brand-700 dark:text-white dark:group-hover:text-brand-300">{d.name}</h2>
              <p className="line-clamp-2 text-sm text-slate-500">{d.what}</p>
              <div className="mt-auto flex items-center gap-2 pt-3 text-xs text-slate-500">
                <Avatar name={d.head} size="xs" /><span className="min-w-0 flex-1 truncate">{d.head}</span>
                <span className="inline-flex shrink-0 items-center gap-1"><Users size={12} />{d.headcount}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
