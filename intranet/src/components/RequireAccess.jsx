import { Link } from 'react-router-dom'
import { Lock } from 'lucide-react'
import { canAccess, navItem } from '../config/nav'
import { useUser } from '../context/UserContext'

// Guards a route listed in the nav config. Shown when someone opens a restricted page by its address.
export default function RequireAccess({ to, children }) {
  const { user } = useUser()
  const item = navItem(to)
  if (!item || canAccess(item, user)) return children
  return (
    <div className="card mx-auto mt-6 flex max-w-lg flex-col items-center p-10 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-700 dark:bg-slate-800 dark:text-brand-200"><Lock size={24} /></span>
      <h1 className="mt-4 text-xl font-extrabold">{item.label} is limited to {item.depts.length > 2 ? `${item.depts.slice(0, -1).join(', ')} and ${item.depts.at(-1)}` : item.depts.join(' and ')}</h1>
      <p className="mt-2 text-sm text-slate-500">You’re signed in as {user.dept}. If you need access, ask your line manager to raise an access request with IT.</p>
      <Link to="/" className="btn-primary mt-6">Back to Home</Link>
    </div>
  )
}
