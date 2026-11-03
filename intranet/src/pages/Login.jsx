import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { ArrowLeftIcon as ArrowLeft, CaretRightIcon as ChevronRight, InfoIcon as Info, LifebuoyIcon as LifeBuoy } from '@phosphor-icons/react'
import { personas, useUser } from '../context/UserContext'
import Avatar from '../components/Avatar'
import Logo from '../components/Logo'

// Microsoft's sign-in button follows Microsoft's published branding guidance:
// white background, #8C8C8C border, the four-square logo, and the label "Sign in with Microsoft".
function MicrosoftLogo() {
  return (
    <span className="grid h-[21px] w-[21px] shrink-0 grid-cols-2 gap-[1px]" aria-hidden="true">
      <span className="bg-[#F25022]" /><span className="bg-[#7FBA00]" /><span className="bg-[#00A4EF]" /><span className="bg-[#FFB900]" />
    </span>
  )
}

function DemoPicker({ onPick, onBack }) {
  const groups = [
    ['New staff', personas.filter((p) => p.newStaff)],
    ['Existing staff', personas.filter((p) => !p.newStaff)],
  ]
  return (
    <div className="animate-fade-up">
      <button onClick={onBack} className="btn-ghost -ml-3 mb-4 px-3 py-1.5"><ArrowLeft size={16} /> Back</button>
      <h2 className="text-xl font-semibold">Choose who to sign in as</h2>
      <p className="mt-1 flex gap-2 rounded-xl bg-amber-50 p-3 text-sm text-amber-900 dark:bg-amber-500/10 dark:text-amber-200">
        <Info size={16} className="mt-0.5 shrink-0" />
        Demo mode. Microsoft sign-in switches on once IT registers Rex Hub in Microsoft Entra ID.
      </p>
      <div className="mt-5 max-h-[50vh] space-y-5 overflow-y-auto pr-1">
        {groups.map(([label, list]) => (
          <div key={label}>
            <h3 className="mb-2 text-sm font-medium text-slate-500">{label}</h3>
            <ul className="space-y-1">
              {list.map((p) => (
                <li key={p.id}>
                  <button onClick={() => onPick(p.id)} className="flex w-full items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-left transition hover:border-slate-200 hover:bg-slate-50 dark:hover:border-slate-700 dark:hover:bg-slate-800">
                    <Avatar name={`${p.firstName} ${p.lastName}`} size="sm" />
                    <span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium">{p.firstName} {p.lastName}</span><span className="block truncate text-xs text-slate-500">{p.role}, {p.dept}</span></span>
                    <ChevronRight size={16} className="text-slate-300" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Login() {
  const { ready, signedIn, signIn, ssoConfigured } = useUser()
  const [picking, setPicking] = useState(false)
  const [busy, setBusy] = useState(false)

  if (ready && signedIn) return <Navigate to="/" replace />

  const start = async () => {
    if (!ssoConfigured) return setPicking(true)
    setBusy(true)
    try {
      await signIn()
    } catch {
      setBusy(false)
    }
  }

  return (
    <div className="grid min-h-[100dvh] bg-white lg:grid-cols-[1.1fr_1fr] dark:bg-slate-950">
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-brand-700 p-12 text-white lg:flex">
        <Logo onDark className="h-11 w-auto self-start" />
        <div className="max-w-md">
          <h1 className="text-4xl leading-tight font-bold">Everything you need for work at Rex, in one place.</h1>
          <p className="mt-4 text-lg text-brand-100">News, requests, learning and the people you work with.</p>
        </div>
        <p className="text-sm text-brand-200">Rex Insurance staff only. Activity on Rex Hub is subject to the IT Acceptable Use Policy.</p>
      </aside>

      <main className="flex items-center justify-center px-6 py-12 sm:px-12">
        <div className="w-full max-w-sm">
          <div className="mb-10 lg:hidden"><Logo className="h-10 w-auto" /></div>
          {picking ? (
            <DemoPicker onPick={(id) => signIn(id)} onBack={() => setPicking(false)} />
          ) : (
            <div className="animate-fade-up">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Sign in to Rex Hub</h2>
              <p className="mt-2 text-slate-600 dark:text-slate-300">Use your Rex Insurance Microsoft account.</p>
              <button
                onClick={start}
                disabled={busy}
                className="mt-8 flex h-[41px] w-full items-center justify-center gap-3 border border-[#8C8C8C] bg-white px-3 text-[15px] font-semibold text-[#5E5E5E] transition hover:bg-[#F3F3F3] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 disabled:opacity-60"
              >
                <MicrosoftLogo />
                {busy ? 'Redirecting to Microsoft…' : 'Sign in with Microsoft'}
              </button>
              <p className="mt-8 flex items-start gap-2 text-sm text-slate-500">
                <LifeBuoy size={16} className="mt-0.5 shrink-0" />
                Trouble signing in? Call the IT service desk on Ext. 999.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
