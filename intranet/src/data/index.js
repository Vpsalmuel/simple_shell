// Sample content. Replace with API calls (SharePoint, HRIS, claims system) when wiring a backend.

export const departments = ['Executive Office', 'Claims', 'Underwriting', 'Actuarial', 'Customer Care', 'IT', 'HR', 'Finance', 'Legal & Compliance']

export const people = [
  { id: 1, name: 'Ada Okafor', role: 'Senior Claims Analyst', dept: 'Claims', location: 'Lagos', email: 'ada.okafor@rexinsurance.com', phone: '+234 801 000 1001', status: 'online', manager: 'Tunde Bello', skills: ['Motor claims', 'Fraud triage'] },
  { id: 2, name: 'Tunde Bello', role: 'Head of Claims', dept: 'Claims', location: 'Lagos', email: 'tunde.bello@rexinsurance.com', phone: '+234 801 000 1002', status: 'meeting', manager: 'Grace Eze', skills: ['Ops leadership', 'Reinsurance'] },
  { id: 3, name: 'Grace Eze', role: 'Managing Director / CEO', dept: 'Executive Office', location: 'Abuja', email: 'grace.eze@rexinsurance.com', phone: '+234 801 000 1003', status: 'away', manager: '—', skills: ['Strategy', 'Risk'] },
  { id: 4, name: 'Chinedu Obi', role: 'Underwriter II', dept: 'Underwriting', location: 'Lagos', email: 'chinedu.obi@rexinsurance.com', phone: '+234 801 000 1004', status: 'online', manager: 'Funmi Adeyemi', skills: ['Property', 'Marine'] },
  { id: 5, name: 'Funmi Adeyemi', role: 'Underwriting Manager', dept: 'Underwriting', location: 'Port Harcourt', email: 'funmi.adeyemi@rexinsurance.com', phone: '+234 801 000 1005', status: 'online', manager: 'Grace Eze', skills: ['Energy', 'Portfolio pricing'] },
  { id: 6, name: 'Ibrahim Musa', role: 'Actuarial Analyst', dept: 'Actuarial', location: 'Abuja', email: 'ibrahim.musa@rexinsurance.com', phone: '+234 801 000 1006', status: 'offline', manager: 'Grace Eze', skills: ['Reserving', 'Python'] },
  { id: 7, name: 'Zainab Lawal', role: 'Customer Care Lead', dept: 'Customer Care', location: 'Lagos', email: 'zainab.lawal@rexinsurance.com', phone: '+234 801 000 1007', status: 'online', manager: 'Tunde Bello', skills: ['CX', 'Escalations'] },
  { id: 8, name: 'Emeka Nwosu', role: 'IT Service Manager', dept: 'IT', location: 'Lagos', email: 'emeka.nwosu@rexinsurance.com', phone: '+234 801 000 1008', status: 'meeting', manager: 'Grace Eze', skills: ['ITSM', 'Security'] },
  { id: 9, name: 'Sarah Johnson', role: 'HR Business Partner', dept: 'HR', location: 'Abuja', email: 'sarah.johnson@rexinsurance.com', phone: '+234 801 000 1009', status: 'online', manager: 'Grace Eze', skills: ['Talent', 'Wellbeing'] },
  { id: 10, name: 'David Okon', role: 'Compliance Officer', dept: 'Legal & Compliance', location: 'Lagos', email: 'david.okon@rexinsurance.com', phone: '+234 801 000 1010', status: 'away', manager: 'Grace Eze', skills: ['AML/KYC', 'Regulatory reporting'] },
  { id: 11, name: 'Amaka Udeh', role: 'Claims Adjuster', dept: 'Claims', location: 'Enugu', email: 'amaka.udeh@rexinsurance.com', phone: '+234 801 000 1011', status: 'online', manager: 'Tunde Bello', skills: ['Site surveys', 'Health claims'] },
  { id: 13, name: 'Bola Martins', role: 'Financial Controller', dept: 'Finance', location: 'Lagos', email: 'bola.martins@rexinsurance.com', phone: '+234 801 000 1013', status: 'online', manager: 'Grace Eze', skills: ['IFRS 17', 'Treasury'] },
  { id: 14, name: 'Kemi Adebayo', role: 'Graduate Trainee', dept: 'Underwriting', location: 'Lagos', email: 'kemi.adebayo@rexinsurance.com', phone: '+234 801 000 1014', status: 'online', manager: 'Funmi Adeyemi', skills: ['Learning the ropes'] },
  { id: 12, name: 'Kelvin Ade', role: 'Frontend Engineer', dept: 'IT', location: 'Remote', email: 'kelvin.ade@rexinsurance.com', phone: '+234 801 000 1012', status: 'offline', manager: 'Emeka Nwosu', skills: ['React', 'Design systems'] },
]

export const announcements = [
  { id: 1, tag: 'Company', title: 'Q3 results: gross written premium up 18%', body: 'Thank you to every team. Town hall recording and slides are now in the Docs hub.', tone: 'brand', cta: 'Watch town hall' },
  { id: 2, tag: 'Compliance', title: 'Annual AML & data-protection training due 15 Nov', body: 'Complete both modules in the Learning portal. Takes about 40 minutes.', tone: 'warn', cta: 'Start training' },
  { id: 3, tag: 'Wellbeing', title: 'Open enrolment for 2027 health plan is live', body: 'Review your HMO options and add dependants before 30 Nov.', tone: 'accent', cta: 'Review benefits' },
]

// `image`: a path in /public (e.g. '/images/telematics.jpg') or a URL. null shows the branded placeholder.
export const news = [
  { id: 1, category: 'Product', title: 'Telematics motor cover launches in pilot states', excerpt: 'Usage-based pricing goes live for 2,000 customers. Underwriting shares what we learned.', author: 'Funmi Adeyemi', date: '2026-10-24', readMins: 4, likes: 42, comments: 9, image: null },
  { id: 2, category: 'Claims', title: 'Average claim settlement down to 6.2 days', excerpt: 'The new triage workflow cut handling time by 31%. Here is how the team did it.', author: 'Tunde Bello', date: '2026-10-22', readMins: 3, likes: 67, comments: 14, image: null },
  { id: 3, category: 'People', title: 'Meet the Customer Care team behind our 4.7★ rating', excerpt: 'A day on the frontline with the team that handles 3,000 calls a week.', author: 'Sarah Johnson', date: '2026-10-20', readMins: 5, likes: 38, comments: 6, image: null },
  { id: 4, category: 'IT', title: 'Single sign-on rolls out to all core systems', excerpt: 'One login for the policy admin, claims portal and HR. Migration dates inside.', author: 'Emeka Nwosu', date: '2026-10-18', readMins: 2, likes: 25, comments: 3, image: null },
]

export const events = [
  { id: 1, date: '2026-10-29', time: '10:00', title: 'Monthly town hall', place: 'Auditorium + Teams', type: 'Company' },
  { id: 2, date: '2026-10-31', time: '14:00', title: 'Fraud detection masterclass', place: 'Room 4B', type: 'Learning' },
  { id: 3, date: '2026-11-04', time: '08:30', title: 'Wellness walk', place: 'HQ car park', type: 'Social' },
  { id: 4, date: '2026-11-07', time: '12:00', title: 'Reinsurance renewals briefing', place: 'Teams', type: 'Business' },
]

export const kudos = [
  { id: 1, from: 'Tunde Bello', to: 'Amaka Udeh', message: 'Closed a complex flood claim in 3 days and the customer sent a thank-you letter.', value: 'Customer first' },
  { id: 2, from: 'Zainab Lawal', to: 'Kelvin Ade', message: 'The new chat widget halved our wait times. Brilliant work.', value: 'Innovation' },
  { id: 3, from: 'Funmi Adeyemi', to: 'Chinedu Obi', message: 'Stepped up on the marine renewals while the team was stretched.', value: 'Ownership' },
]

export const quickLinks = [
  { label: 'Policy admin', icon: 'FileStack', href: '#' },
  { label: 'Claims portal', icon: 'ShieldCheck', href: '#' },
  { label: 'Payslips', icon: 'Wallet', href: '#' },
  { label: 'IT helpdesk', icon: 'LifeBuoy', href: '#' },
  { label: 'Learning', icon: 'GraduationCap', href: '#' },
  { label: 'Expenses', icon: 'Receipt', href: '#' },
]

export const claimsWeekly = [
  { day: 'Mon', opened: 148, closed: 132 },
  { day: 'Tue', opened: 162, closed: 155 },
  { day: 'Wed', opened: 139, closed: 160 },
  { day: 'Thu', opened: 171, closed: 149 },
  { day: 'Fri', opened: 125, closed: 168 },
]

export const claimsByLine = [
  { line: 'Motor', share: 41 },
  { line: 'Health', share: 26 },
  { line: 'Property', share: 18 },
  { line: 'Marine', share: 9 },
  { line: 'Life', share: 6 },
]

export const claims = [
  { id: 'CLM-24-08812', insured: 'Bisi Akande', line: 'Motor', amount: 1850000, stage: 'Assessment', sla: 2, owner: 'Ada Okafor' },
  { id: 'CLM-24-08790', insured: 'Coastline Logistics Ltd', line: 'Marine', amount: 24500000, stage: 'Investigation', sla: 5, owner: 'Ada Okafor' },
  { id: 'CLM-24-08755', insured: 'Ngozi Peters', line: 'Health', amount: 420000, stage: 'Approval', sla: 1, owner: 'Amaka Udeh' },
  { id: 'CLM-24-08731', insured: 'Unity Schools', line: 'Property', amount: 7300000, stage: 'Registered', sla: 7, owner: 'Ada Okafor' },
  { id: 'CLM-24-08702', insured: 'Musa Danjuma', line: 'Motor', amount: 960000, stage: 'Payment', sla: 0, owner: 'Amaka Udeh' },
]

// Average days to settle, last 12 weeks (oldest → newest).
export const settlementTrend = [8.1, 7.9, 7.6, 7.7, 7.3, 7.1, 6.9, 7.0, 6.7, 6.5, 6.4, 6.2]

export const claimStages = ['Registered', 'Assessment', 'Investigation', 'Approval', 'Payment']

export const tools = [
  { name: 'Policy administration', desc: 'Issue, endorse and renew policies', icon: 'FileStack' },
  { name: 'Claims workbench', desc: 'Register, assess and settle claims', icon: 'ShieldCheck' },
  { name: 'Underwriting workbench', desc: 'Risk scoring and referrals', icon: 'Scale' },
  { name: 'Rating engine', desc: 'Quote calculators by product line', icon: 'Calculator' },
  { name: 'Fraud analytics', desc: 'Red-flag scoring and case notes', icon: 'ScanSearch' },
  { name: 'Reinsurance ledger', desc: 'Treaties, cessions and recoveries', icon: 'Landmark' },
]

export const documents = [
  { id: 1, title: 'Claims handling manual v7', category: 'Claims', type: 'PDF', size: '4.2 MB', updated: '2026-10-12', owner: 'Claims Ops', pinned: true },
  { id: 2, title: 'Underwriting authority matrix 2026', category: 'Underwriting', type: 'XLSX', size: '310 KB', updated: '2026-09-30', owner: 'Underwriting', pinned: true },
  { id: 3, title: 'AML / KYC policy', category: 'Compliance', type: 'PDF', size: '1.1 MB', updated: '2026-08-21', owner: 'Legal & Compliance', pinned: false },
  { id: 4, title: 'Data protection (NDPA) guidelines', category: 'Compliance', type: 'PDF', size: '860 KB', updated: '2026-07-14', owner: 'Legal & Compliance', pinned: false },
  { id: 5, title: 'Employee handbook', category: 'HR', type: 'PDF', size: '2.7 MB', updated: '2026-06-02', owner: 'HR', pinned: true },
  { id: 6, title: 'Leave & remote work policy', category: 'HR', type: 'DOCX', size: '220 KB', updated: '2026-05-19', owner: 'HR', pinned: false },
  { id: 7, title: 'Brand & letterhead templates', category: 'Templates', type: 'ZIP', size: '12 MB', updated: '2026-04-11', owner: 'Marketing', pinned: false },
  { id: 8, title: 'Expense claim form', category: 'Templates', type: 'XLSX', size: '95 KB', updated: '2026-03-08', owner: 'Finance', pinned: false },
  { id: 9, title: 'Q3 town hall slides', category: 'Company', type: 'PPTX', size: '8.4 MB', updated: '2026-10-25', owner: 'Executive Office', pinned: false },
]

export const leaveBalance = [
  { type: 'Annual', used: 9, total: 20 },
  { type: 'Sick', used: 2, total: 10 },
  { type: 'Study', used: 0, total: 5 },
]

export const notifications = [
  { id: 1, text: 'Tunde Bello approved your leave request (11–13 Nov).', time: '12m', unread: true },
  { id: 2, text: 'CLM-24-08755 is due for approval today.', time: '1h', unread: true },
  { id: 3, text: 'New document: Q3 town hall slides.', time: '3h', unread: false },
]

export const poll = {
  question: 'Where should we hold the end-of-year party?',
  options: ['Beach resort', 'Rooftop lounge', 'Office + catering', 'Virtual games night'],
}
