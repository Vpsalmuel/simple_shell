import logoNavy from '../assets/rex-logo-navy.svg'
import logoWhite from '../assets/rex-logo-white.svg'

// Company identity. Logo files live in src/assets.
export const brand = {
  name: 'Rex Insurance',
  shortName: 'Rex',
  product: 'Rex Hub',
  tagline: 'Protecting what matters, together.',
  logo: { navy: logoNavy, white: logoWhite },
}

// Third-party apps opened from Rex Hub. Optional: set `url` to add a "Continue to SeamlessHR" button.
export const externalApps = {
  seamlessHr: { name: 'SeamlessHR', url: null },
}

// Company tools pinned to Home as Quick tools. Set `url` for each; a tool with url: null shows a "link coming" notice.
// `internal` routes stay inside Rex Hub.
export const companyTools = [
  { id: 'email', label: 'Emails', desc: 'Outlook mail and calendar', icon: 'Mail', url: 'https://outlook.office.com/mail/' },
  { id: 'kissflow', label: 'Kissflow', desc: 'Workflows and approvals', icon: 'Kanban', url: null },
  { id: 'ies', label: 'IES', desc: 'Insurance enterprise system', icon: 'Desktop', url: null },
  { id: 'help', label: 'Help Desk', desc: 'IT and HR support', icon: 'LifeBuoy', internal: '/help' },
]

