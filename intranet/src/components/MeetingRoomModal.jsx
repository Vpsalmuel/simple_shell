import { CalendarClock, ExternalLink } from 'lucide-react'
import { externalApps } from '../config/brand'
import Modal from './Modal'

// Meeting rooms are booked in SeamlessHR, not in Rex Hub. This tells people where they're going.
export default function MeetingRoomModal({ open, onClose }) {
  const app = externalApps.seamlessHr
  return (
    <Modal open={open} onClose={onClose} title="Book a meeting room">
      <div className="space-y-5 text-sm">
        <div className="flex gap-3 rounded-2xl bg-brand-50 p-4 text-brand-800 dark:bg-slate-800 dark:text-brand-100">
          <CalendarClock size={20} className="mt-0.5 shrink-0" />
          <p>This goes to <b>{app.name}</b>. Meeting rooms are booked there, not in Rex Hub.</p>
        </div>
        <div className="flex justify-end gap-2">
          {app.url ? (
            <>
              <button onClick={onClose} className="btn-ghost">Cancel</button>
              <a href={app.url} target="_blank" rel="noreferrer" onClick={onClose} className="btn-primary">Continue to {app.name} <ExternalLink size={14} /></a>
            </>
          ) : (
            <button onClick={onClose} className="btn-primary">Got it</button>
          )}
        </div>
      </div>
    </Modal>
  )
}
