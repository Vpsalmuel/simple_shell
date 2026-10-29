import { CalendarClock, ExternalLink, Info } from 'lucide-react'
import { externalApps } from '../config/brand'
import Modal from './Modal'

// Meeting rooms are booked in SeamlessHR, not in Rex Hub. This explains that and hands off.
export default function MeetingRoomModal({ open, onClose }) {
  const app = externalApps.seamlessHr
  return (
    <Modal open={open} onClose={onClose} title="Book a meeting room">
      <div className="space-y-4 text-sm">
        <div className="flex gap-3 rounded-2xl bg-brand-50 p-4 text-brand-800 dark:bg-slate-800 dark:text-brand-100">
          <CalendarClock size={20} className="mt-0.5 shrink-0" />
          <p>Meeting rooms are booked in <b>{app.name}</b>, our HR platform. You’ll leave Rex Hub and continue there.</p>
        </div>
        <ol className="list-decimal space-y-1 pl-5 text-slate-600 dark:text-slate-300">
          <li>Sign in to {app.name} with your work account.</li>
          <li>Open <b>Facilities → Room booking</b>.</li>
          <li>Pick a room, date and time, then confirm.</li>
        </ol>
        {!app.url && (
          <p className="flex gap-2 rounded-xl bg-amber-50 p-3 text-amber-800 dark:bg-amber-500/10 dark:text-amber-300">
            <Info size={16} className="mt-0.5 shrink-0" /> The {app.name} link is being set up. Until then, ask Facilities on Ext. 120.
          </p>
        )}
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="btn-ghost">{app.url ? 'Cancel' : 'Got it'}</button>
          {app.url && <a href={app.url} target="_blank" rel="noreferrer" onClick={onClose} className="btn-primary">Continue to {app.name} <ExternalLink size={14} /></a>}
        </div>
      </div>
    </Modal>
  )
}
