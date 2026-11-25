// A plain map of Rex Hub for Rex AI, so it can tell people where things are (17 Nov review).
// No imports: the server reads this file too. Keep it in step with src/config/nav.js.
export const siteGuide = [
  { to: '/', name: 'Home', what: 'your tasks and pending approvals, Quick tools (Emails, Kissflow, IES, Help Desk, Book a room, Payslips), company news, celebrations, events and the pulse poll', keywords: ['home', 'dashboard', 'tasks', 'approve', 'approval', 'quick tools', 'email', 'outlook', 'kissflow', 'ies', 'payslip', 'pay slip', 'meeting room', 'book a room', 'poll'] },
  { to: '/news', name: 'News', what: 'company stories and announcements, with likes and comments', keywords: ['news', 'story', 'stories', 'announcement', 'update'] },
  { to: '/events', name: 'Events', what: 'the company calendar and RSVPs', keywords: ['event', 'calendar', 'rsvp', 'town hall', 'party', 'training session'] },
  { to: '/celebrations', name: 'Celebrations', what: 'birthdays, work anniversaries, new joiners and recognition (kudos)', keywords: ['celebration', 'birthday', 'anniversary', 'kudos', 'recognition', 'milestone', 'new joiner', 'wishes'] },
  { to: '/knowledge', name: 'Knowledge & Learning', what: 'policies and guides, required training and courses, and the document library (pin up to three documents)', keywords: ['policy', 'policies', 'sop', 'guide', 'procedure', 'knowledge', 'course', 'courses', 'learning', 'training', 'document', 'documents', 'template', 'handbook', 'form'] },
  { to: '/help', name: 'Help Desk', what: 'ask IT, HR, Admin or Brand for help (access, passwords, payroll queries, supplies, branded items, design) and track your requests, plus common questions', keywords: ['help', 'ticket', 'request', 'it support', 'password', 'vpn', 'laptop', 'support', 'problem', 'issue', 'brand', 'design', 'branded', 'admin', 'facilities', 'supplies', 'courier', 'travel booking', 'system access', 'device', 'hr', 'payroll'] },
  { to: '/departments', name: 'Departments', what: 'what each team does, who leads it and how to reach them', keywords: ['department', 'team', 'who leads', 'head of', 'contact', 'claims team', 'underwriting team', 'finance team'] },
  { to: '/wellbeing', name: 'Health & Wellbeing', what: 'HMO cover, the REAP mental-health programme, the Gym Champion of the month and the monthly hike', keywords: ['health', 'wellbeing', 'hmo', 'medical', 'reap', 'mental', 'counsel', 'gym', 'fitness', 'hike', 'run club'] },
  { to: '/admin', name: 'Admin Workspace', what: 'for HR, IT, Brand & Communications and the Executive Office: publish news and see requests across teams', keywords: ['admin workspace', 'publish', 'post news'] },
]

// One paragraph describing every page, for the AI's instructions.
export const siteGuideText = siteGuide.map((p) => `${p.name} (${p.to}): ${p.what}.`).join(' ')
