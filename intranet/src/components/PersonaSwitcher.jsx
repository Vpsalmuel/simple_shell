import { Eye } from 'lucide-react'
import { personas, useUser } from '../context/UserContext'

// Demo-only control to preview each staff type. Remove once real sign-in decides the user.
export default function PersonaSwitcher({ className = '' }) {
  const { user, setPersonaId } = useUser()
  return (
    <label className={`flex items-center gap-2 text-xs text-slate-500 ${className}`}>
      <Eye size={14} className="shrink-0" />
      <span className="sr-only sm:not-sr-only">View as</span>
      <select
        value={user.id}
        onChange={(e) => setPersonaId(e.target.value)}
        className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700 outline-none focus:border-brand-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
      >
        {personas.map((p) => (
          <option key={p.id} value={p.id}>{p.newStaff ? 'New staff' : p.dept} · {p.firstName}</option>
        ))}
      </select>
    </label>
  )
}
