import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { ArrowLeftIcon as ArrowLeft, CaretRightIcon as ChevronRight, InfoIcon as Info, LifebuoyIcon as LifeBuoy } from '@phosphor-icons/react'
import { personas, useUser } from '../context/UserContext'
import { useLocalStorage } from '../hooks/useLocalStorage'
import Avatar from '../components/Avatar'
import Logo from '../components/Logo'
import photo from '../assets/photos/news-claims-team.jpg'

// Microsoft's sign-in button follows Microsoft's published branding guidance:
// white background, #8C8C8C border, the four-square logo, and the label "Sign in with Microsoft".
function MicrosoftLogo() {
  return (
    <span className="grid h-[21px] w-[21px] shrink-0 grid-cols-2 gap-[1px]" aria-hidden="true">
      <span className="bg-[#F25022]" /><span className="bg-[#7FBA00]" /><span className="bg-[#00A4EF]" /><span className="bg-[#FFB900]" />
    </span>
  )
}

function MicrosoftButton({ onClick, busy }) {
  return (
    <button
      onClick={onClick}
      disabled={busy}
      className="flex h-[41px] w-full items-center justify-center gap-3 border border-[#8C8C8C] bg-white px-3 text-[15px] font-semibold text-[#5E5E5E] transition-colors hover:bg-[#F3F3F3] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 disabled:opacity-60"
    >
      <MicrosoftLogo />
      {busy ? 'Redirecting to Microsoft…' : 'Sign in with Microsoft'}
    </button>
  )
}

function DemoPicker({ onPick, onBack }) {
  const groups = [
    ['New staff', personas.filter((p) => p.newStaff)],
    ['Existing staff', personas.filter((p) => !p.newStaff)],
  ]
  return (
    <div className="animate-fade-up">
      <button onClick={onBack} className="btn-ghost -ml-3 mb-3 h-8 px-3"><ArrowLeft size={16} /> Back</button>
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Choose who to sign in as</h2>
      <p className="mt-2 flex gap-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-900 dark:bg-amber-500/10 dark:text-amber-200">
        <Info size={16} className="mt-0.5 shrink-0" />
        Demo mode. Microsoft sign-in switches on once IT registers Rex Hub in Microsoft Entra ID.
      </p>
      <div className="mt-4 max-h-[46vh] space-y-4 overflow-y-auto pr-1">
        {groups.map(([label, list]) => (
          <div key={label}>
            <h3 className="mb-1 text-xs font-medium text-slate-500">{label}</h3>
            <ul>
              {list.map((p) => (
                <li key={p.id}>
                  <button onClick={() => onPick(p.id)} className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-slate-100 dark:hover:bg-slate-800">
                    <Avatar name={`${p.firstName} ${p.lastName}`} size="sm" />
                    <span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium text-slate-900 dark:text-white">{p.firstName} {p.lastName}</span><span className="block truncate text-xs text-slate-500">{p.role}, {p.dept}</span></span>
                    <ChevronRight size={14} className="text-slate-400" />
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

// The sign-in content shared by both layouts.
function SignIn({ picking, setPicking, start, busy, signIn }) {
  if (picking) return <DemoPicker onPick={(id) => signIn(id)} onBack={() => setPicking(false)} />
  return (
    <div className="animate-fade-up">
      <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Sign in to Rex Hub</h1>
      <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300">Use your Rex Insurance Microsoft account.</p>
      <div className="mt-8"><MicrosoftButton onClick={start} busy={busy} /></div>
      <p className="mt-6 flex items-start gap-2 text-xs text-slate-500">
        <LifeBuoy size={14} className="mt-px shrink-0" />
        Trouble signing in? Call the IT service desk on Ext. 999.
      </p>
    </div>
  )
}

// Review-only switch between the two layouts proposed at the 17 Nov meeting. Remove once one is chosen.
function LayoutSwitch({ layout, setLayout, onPhoto }) {
  const opt = (id, label) => (
    <button
      onClick={() => setLayout(id)}
      aria-pressed={layout === id}
      className={`h-7 rounded-md px-2.5 text-xs font-medium transition-colors ${layout === id ? (onPhoto ? 'bg-white text-slate-900' : 'bg-slate-900 text-white dark:bg-white dark:text-slate-900') : onPhoto ? 'text-white/90 hover:bg-white/15' : 'text-slate-600 hover:bg-slate-200/70 dark:text-slate-300 dark:hover:bg-slate-800'}`}
    >
      {label}
    </button>
  )
  return (
    <div className={`fixed top-4 left-4 z-30 flex items-center gap-1 rounded-lg p-1 ${onPhoto ? 'bg-slate-900/50 backdrop-blur-md' : 'border border-slate-200 bg-white/90 backdrop-blur dark:border-slate-700 dark:bg-slate-900/90'}`} role="group" aria-label="Login design option (for review)">
      <span className={`px-1.5 text-[11px] ${onPhoto ? 'text-white/80' : 'text-slate-500'}`}>Option</span>
      {opt('split', '1. Split screen')}
      {opt('full', '2. Full image')}
    </div>
  )
}

export default function Login() {
  const { ready, signedIn, signIn, ssoConfigured } = useUser()
  const [picking, setPicking] = useState(false)
  const [busy, setBusy] = useState(false)
  const [layout, setLayout] = useLocalStorage('rex-login-layout', 'split')

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
  const content = <SignIn picking={picking} setPicking={setPicking} start={start} busy={busy} signIn={signIn} />

  // Option 2: a full-screen photo with a small sign-in panel on top. Logo top right (20 Aug review).
  if (layout === 'full') {
    return (
      <div className="relative min-h-[100dvh] overflow-hidden bg-slate-900">
        <img src={photo} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-950/90 via-brand-950/45 to-brand-950/30" aria-hidden="true" />
        <LayoutSwitch layout={layout} setLayout={setLayout} onPhoto />
        <div className="absolute top-5 right-5 z-20 sm:top-6 sm:right-8"><Logo onDark className="h-8 w-auto" /></div>
        <div className="relative z-10 flex min-h-[100dvh] flex-col justify-end gap-8 p-5 sm:p-10 lg:flex-row lg:items-end lg:justify-between lg:p-14">
          <div className="max-w-md text-white">
            <p className="text-[28px] leading-tight font-semibold sm:text-4xl">Everything you need for work at Rex, in one place.</p>
            <p className="mt-3 text-[15px] text-white/80">News, requests, learning and the people you work with.</p>
          </div>
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.5)] sm:p-7 dark:bg-slate-900">
            {content}
          </div>
        </div>
      </div>
    )
  }

  // Option 1: split screen, photo on one side and the form on the other.
  return (
    <div className="grid min-h-[100dvh] bg-white lg:grid-cols-[1.15fr_1fr] dark:bg-slate-950">
      <LayoutSwitch layout={layout} setLayout={setLayout} />
      <aside className="relative hidden overflow-hidden lg:block">
        <img src={photo} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-950/85 via-brand-950/20 to-transparent" aria-hidden="true" />
        <div className="absolute inset-x-0 bottom-0 max-w-lg p-12 text-white">
          <p className="text-[28px] leading-tight font-semibold">Everything you need for work at Rex, in one place.</p>
          <p className="mt-3 text-[15px] text-white/80">News, requests, learning and the people you work with.</p>
        </div>
      </aside>
      <main className="flex flex-col px-6 py-20 sm:px-12 lg:py-10">
        <div className="flex justify-end"><Logo className="h-8 w-auto" /></div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">{content}</div>
        </div>
        <p className="text-center text-xs text-slate-500">Rex Insurance staff only. Use of Rex Hub is covered by the IT Acceptable Use Policy.</p>
      </main>
    </div>
  )
}
