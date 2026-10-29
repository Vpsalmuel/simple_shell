// Sample content. Replace with API calls (SharePoint, HRIS, claims system) when wiring a backend.

export const departments = ['Executive Office', 'Brand & Communications', 'Claims', 'Underwriting', 'Actuarial', 'Customer Care', 'IT', 'HR', 'Finance', 'Legal & Compliance']

// People from the AI Studio prototype's roster. Ibrahim Musa (Actuarial) and David Okon (Legal & Compliance)
// are placeholders: the prototype has no one in those departments.
export const people = [
  { id: 1, name: 'Sarah Jenkins', joined: '2020-03-15', role: 'Senior Claims Specialist / Onboarding Buddy', dept: 'Claims', location: 'Lagos Main Campus, Block C', email: 'sarah.jenkins@rexinsurance.com', phone: 'Ext. 309', status: 'online', manager: 'Arthur Pendelton', skills: ['Communication', 'Analysis', 'Insurance Logic'], bio: 'Dedicated claims investigator with over 5 years of tenure. Onboarding buddy supporting Samuel Adebayo’s learning track.' },
  { id: 2, name: 'Arthur Pendelton', role: 'VP of Claims', dept: 'Claims', location: 'Lagos Main Campus, Block C Executive', email: 'arthur.pendelton@rexinsurance.com', phone: 'Ext. 300', status: 'meeting', manager: 'Victoria Hawthorne', skills: ['Leadership', 'Strategic Planning', 'Risk Mitigation'], bio: 'Oversees all claims operations across motor, property and general liability portfolios.' },
  { id: 3, name: 'Victoria Hawthorne', joined: '2015-01-10', role: 'Managing Director & CEO', dept: 'Executive Office', location: 'Executive Leadership Office', email: 'victoria.hawthorne@rexinsurance.com', phone: 'Via the executive office', status: 'away', manager: '—', skills: ['Strategy', 'Leadership'], bio: 'Leads Rex Insurance and its executive board.' },
  { id: 4, name: 'Rebecca Sterling', joined: '2019-11-01', role: 'Lead Commercial Underwriter', dept: 'Underwriting', location: 'Lagos Main Campus, Block B', email: 'rebecca.sterling@rexinsurance.com', phone: 'Ext. 320', status: 'online', manager: 'Victoria Hawthorne', skills: ['Communication', 'Analysis', 'Insurance Logic'], bio: 'Manages underwriting checklists for commercial assets. Fan of risk mitigation structures and deep compliance audits.' },
  { id: 5, name: 'Samuel Adebayo', joined: '2026-05-24', role: 'Junior Claims Analyst', dept: 'Claims', location: 'Lagos Main Campus, Block C', email: 'samuel.adebayo@rexinsurance.com', phone: 'Ext. 312', status: 'online', manager: 'Arthur Pendelton', skills: ['Communication', 'Analysis', 'Insurance Logic'], bio: 'Joined the company this year. Driven to improve claimant fast-tracking while learning core underwriting assessment.' },
  { id: 6, name: 'Ibrahim Musa', role: 'Actuarial Analyst', dept: 'Actuarial', location: 'Lagos Main Campus', email: 'ibrahim.musa@rexinsurance.com', phone: 'Ext. 330', status: 'offline', manager: 'Victoria Hawthorne', skills: ['Reserving', 'Python'] },
  { id: 7, name: 'Marcus Vance', joined: '2022-09-12', role: 'Senior CX Manager', dept: 'Customer Care', location: 'Lagos Main Campus, Block A', email: 'marcus.vance@rexinsurance.com', phone: 'Ext. 404', status: 'online', manager: 'Victoria Hawthorne', skills: ['Communication', 'Analysis', 'Insurance Logic'], bio: 'Passionate about turning customer complaint metrics into process improvements.' },
  { id: 8, name: 'David Kojo', joined: '2018-05-10', role: 'IT Support Supervisor & System Admin', dept: 'IT', location: 'IT Command Suite, Basement 1', email: 'david.kojo@rexinsurance.com', phone: 'Ext. 999', status: 'meeting', manager: 'Victoria Hawthorne', skills: ['Communication', 'Analysis', 'Insurance Logic'], bio: 'Solves hardware bottlenecks and secures network systems. Raise a ticket with me for any access or sign-in problem.' },
  { id: 9, name: 'Thomas Mueller', joined: '2017-08-20', role: 'Head of Recruitment & Onboarding', dept: 'HR', location: 'Lagos Main Campus, Block A', email: 'thomas.mueller@rexinsurance.com', phone: 'Ext. 201', status: 'online', manager: 'Victoria Hawthorne', skills: ['Communication', 'Analysis', 'Insurance Logic'], bio: 'Welcomes new talent, shapes people policies and guides onboarding journeys across the company.' },
  { id: 10, name: 'David Okon', role: 'Compliance Officer', dept: 'Legal & Compliance', location: 'Lagos Main Campus', email: 'david.okon@rexinsurance.com', phone: 'Ext. 340', status: 'away', manager: 'Victoria Hawthorne', skills: ['AML/KYC', 'Regulatory reporting'] },
  { id: 11, name: 'Chloe Chen', role: 'Fire & Property Loss Adjuster', dept: 'Claims', location: 'Lagos Main Campus, Block C', email: 'chloe.chen@rexinsurance.com', phone: 'Ext. 315', status: 'online', manager: 'Arthur Pendelton', skills: ['Property Valuation', 'Investigation', 'Reporting'], bio: 'Handles large commercial property claims and fire damage assessments.' },
  { id: 12, name: 'John Davis', role: 'Motor Claims Assessor', dept: 'Claims', location: 'Lagos Main Campus, Block C', email: 'john.davis@rexinsurance.com', phone: 'Ext. 314', status: 'offline', manager: 'Arthur Pendelton', skills: ['Automotive Appraisal', 'Negotiation', 'Conflict Resolution'], bio: 'Specialist in motor accident assessments and third-party property damage negotiations.' },
  { id: 13, name: 'Amanda Lin', joined: '2021-04-18', role: 'Senior Financial Controlling Analyst', dept: 'Finance', location: 'Business Advisory Wing, Block A', email: 'amanda.lin@rexinsurance.com', phone: 'Ext. 104', status: 'online', manager: 'Victoria Hawthorne', skills: ['Communication', 'Analysis', 'Insurance Logic'], bio: 'Budget tracker, reimbursement auditor and Excel formula champion.' },
  { id: 14, name: 'Fatima Bello', role: 'Claims Auditor', dept: 'Claims', location: 'Lagos Main Campus, Block C', email: 'fatima.bello@rexinsurance.com', phone: 'Ext. 316', status: 'online', manager: 'Arthur Pendelton', skills: ['Auditing', 'Compliance', 'Data Analysis'], bio: 'Makes sure claims processing meets internal SLAs and regulatory standards.' },
  { id: 15, name: 'Elena Rostova', joined: '2021-02-14', role: 'Communications Lead', dept: 'Brand & Communications', location: 'Creative Hub, Penthouse Flat', email: 'elena.rostova@rexinsurance.com', phone: 'Ext. 112', status: 'online', manager: 'Victoria Hawthorne', skills: ['Communication', 'Analysis', 'Insurance Logic'], bio: 'Oversees brand and public relations. Contact me for brand asset folders or custom flyer support.' },
  { id: 16, name: 'Michael Okoro', role: 'Dispute Resolution Specialist', dept: 'Claims', location: 'Lagos Main Campus, Block C', email: 'michael.okoro@rexinsurance.com', phone: 'Ext. 317', status: 'meeting', manager: 'Arthur Pendelton', skills: ['Mediation', 'Legal Analysis', 'Customer Service'], bio: 'Manages escalated claims disputes that need alternative resolution or legal review.' },
]

export const announcements = [
  { id: 1, tag: 'Company', title: 'Q3 results: gross written premium up 18%', body: 'Thank you to every team. Town hall recording and slides are now in the Docs hub.', tone: 'brand', cta: 'Watch town hall' },
  { id: 2, tag: 'Compliance', title: 'Annual AML & data-protection training due 15 Nov', body: 'Complete both modules in the Learning portal. Takes about 40 minutes.', tone: 'warn', cta: 'Start training' },
  { id: 3, tag: 'Wellbeing', title: 'Open enrolment for 2027 health plan is live', body: 'Review your HMO options and add dependants before 30 Nov.', tone: 'accent', cta: 'Review benefits' },
]

// `image`: a path in /public (e.g. '/images/telematics.jpg') or a URL. null shows the branded placeholder.
// `body`: paragraphs shown on the article page.
export const news = [
  { id: 1, category: 'Product', title: 'Telematics motor cover launches in pilot states', excerpt: 'Usage-based pricing goes live for 2,000 customers. Underwriting shares what we learned.', author: 'Rebecca Sterling', date: '2026-10-24', readMins: 4, likes: 42, comments: 9, image: null, featured: true,
    body: ['Our first usage-based motor product is live for 2,000 customers across three pilot states. Drivers who share trip data through the Rex app can save up to 20% on renewal.', 'Underwriting spent six months modelling driving behaviour with the Actuarial team. Early results show safer drivers opting in, which improves the risk pool for everyone.', 'Customer Care has a new script for telematics questions, and Claims can now see trip data for any motor claim from an enrolled customer.'] },
  { id: 2, category: 'Claims', title: 'Average claim settlement down to 6.2 days', excerpt: 'The new triage workflow cut handling time by 31%. Here is how the team did it.', author: 'Arthur Pendelton', date: '2026-10-22', readMins: 3, likes: 67, comments: 14, image: null,
    body: ['Twelve weeks ago the average claim took 8.1 days to settle. This week it was 6.2.', 'The biggest change was triage: simple claims under ₦500,000 now go straight to a fast-track queue with pre-approved settlement limits.', 'Next up: same-day settlement for windscreen and minor motor damage.'] },
  { id: 3, category: 'People', title: 'Meet the Customer Care team behind our 4.7★ rating', excerpt: 'A day on the frontline with the team that handles 3,000 calls a week.', author: 'Thomas Mueller', date: '2026-10-20', readMins: 5, likes: 38, comments: 6, image: null,
    body: ['From 7am the phones start ringing. Marcus Vance’s team of 40 handles policy questions, claims updates and the occasional very upset customer.', 'Their secret? Call back before the customer has to chase, and never end a call without a clear next step.'] },
  { id: 4, category: 'IT', title: 'Single sign-on rolls out to all core systems', excerpt: 'One login for the policy admin, claims portal and HR. Migration dates inside.', author: 'David Kojo', date: '2026-10-18', readMins: 2, likes: 25, comments: 3, image: null,
    body: ['From 3 November you will sign in once to reach policy admin, the claims workbench, HR and email.', 'Multi-factor authentication stays on for every system. Keep your authenticator app handy during the switch.'] },
  { id: 5, category: 'Company', title: 'Q3 results: gross written premium up 18%', excerpt: 'Strong growth in motor and health, with a combined ratio of 94%.', author: 'Victoria Hawthorne', date: '2026-10-15', readMins: 4, likes: 88, comments: 21, image: null,
    body: ['Gross written premium grew 18% year on year, led by motor and health.', 'Our combined ratio improved to 94%, and customer NPS rose to 62. Thank you to every team. The town hall recording is in the Docs hub.'] },
  { id: 6, category: 'Wellbeing', title: 'Open enrolment for the 2027 health plan', excerpt: 'Review your HMO options and add dependants before 30 November.', author: 'Thomas Mueller', date: '2026-10-12', readMins: 2, likes: 19, comments: 4, image: null,
    body: ['Three plan tiers are available for 2027, and you can now add up to four dependants.', 'Drop-in sessions with our HMO partner run every Wednesday in November.'] },
]

// Dates in 2026. `type` drives the colour chip and filter.
export const events = [
  { id: 1, date: '2026-10-29', time: '10:00', end: '11:30', title: 'Monthly town hall', place: 'Auditorium + Teams', type: 'Company', host: 'Executive Office', desc: 'Q3 results, the 2027 plan, and open Q&A with the leadership team.' },
  { id: 2, date: '2026-10-31', time: '14:00', end: '16:00', title: 'Fraud detection masterclass', place: 'Room 4B', type: 'Learning', host: 'Claims', desc: 'Spotting staged accidents and inflated invoices, with real case studies.' },
  { id: 3, date: '2026-11-04', time: '08:30', end: '09:30', title: 'Wellness walk', place: 'HQ car park', type: 'Social', host: 'HR', desc: 'A 5km walk around the business district. Trainers and water provided.' },
  { id: 4, date: '2026-11-07', time: '12:00', end: '13:00', title: 'Reinsurance renewals briefing', place: 'Teams', type: 'Business', host: 'Finance', desc: 'What changes in the 2027 treaty programme and what it means for underwriting limits.' },
  { id: 5, date: '2026-11-12', time: '15:00', end: '16:00', title: 'New starters welcome session', place: 'Training room 1', type: 'Company', host: 'HR', desc: 'Meet the leadership team and your fellow new joiners.' },
  { id: 6, date: '2026-11-18', time: '10:00', end: '12:00', title: 'IFRS 17 refresher', place: 'Teams', type: 'Learning', host: 'Finance', desc: 'A practical refresher for finance, actuarial and underwriting staff.' },
  { id: 7, date: '2026-11-20', time: '17:30', end: '20:00', title: 'Inter-department football', place: 'Rex sports ground', type: 'Social', host: 'People & Culture', desc: 'Claims vs Underwriting in the semi-final. Bring your loudest voice.' },
  { id: 8, date: '2026-11-26', time: '09:00', end: '17:00', title: 'Customer Care awards day', place: 'Auditorium', type: 'Company', host: 'Customer Care', desc: 'Celebrating the colleagues who went the extra mile this year.' },
  { id: 9, date: '2026-12-03', time: '11:00', end: '12:00', title: 'Cyber security awareness', place: 'Teams', type: 'Learning', host: 'IT', desc: 'Phishing, passwords and how to report an incident.' },
  { id: 10, date: '2026-12-18', time: '18:00', end: '22:00', title: 'End-of-year party', place: 'To be decided by poll', type: 'Social', host: 'People & Culture', desc: 'Our biggest night of the year. Vote for the venue on the Home page.' },
]

// `mandatory` courses are assigned to everyone with a due date. `progress` is the demo user's completion %.
export const courses = [
  { id: 'aml', title: 'Anti-money laundering essentials', category: 'Compliance', mins: 40, level: 'All staff', mandatory: true, due: '2026-11-15', progress: 60 },
  { id: 'ndpa', title: 'Data protection (NDPA) in practice', category: 'Compliance', mins: 30, level: 'All staff', mandatory: true, due: '2026-11-15', progress: 0 },
  { id: 'cyber', title: 'Cyber security awareness', category: 'Compliance', mins: 25, level: 'All staff', mandatory: true, due: '2026-12-31', progress: 100 },
  { id: 'claims101', title: 'Claims handling fundamentals', category: 'Insurance', mins: 90, level: 'Beginner', progress: 0 },
  { id: 'uw', title: 'Introduction to underwriting', category: 'Insurance', mins: 75, level: 'Beginner', progress: 35 },
  { id: 'ifrs17', title: 'IFRS 17 for non-accountants', category: 'Insurance', mins: 60, level: 'Intermediate', progress: 0 },
  { id: 'cx', title: 'Handling difficult conversations', category: 'Customer', mins: 45, level: 'All staff', progress: 0 },
  { id: 'excel', title: 'Excel for analysis', category: 'Tools & data', mins: 120, level: 'Intermediate', progress: 0 },
  { id: 'lead', title: 'First-time manager programme', category: 'Leadership', mins: 240, level: 'Managers', progress: 0 },
  { id: 'feedback', title: 'Giving and receiving feedback', category: 'Leadership', mins: 35, level: 'All staff', progress: 0 },
]

export const kudos = [
  { id: 1, from: 'Arthur Pendelton', to: 'Chloe Chen', message: 'Closed a complex flood claim in 3 days and the customer sent a thank-you letter.', value: 'Client Empathy' },
  { id: 2, from: 'Marcus Vance', to: 'David Kojo', message: 'The new chat widget halved our wait times. Brilliant work.', value: 'Digital Precision' },
  { id: 3, from: 'Arthur Pendelton', to: 'Fatima Bello', message: 'Cleared the claims audit backlog while the team was stretched.', value: 'Continuous Growth' },
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
  { id: 'CLM-24-08812', insured: 'Bisi Akande', line: 'Motor', amount: 1850000, stage: 'Assessment', sla: 2, owner: 'Sarah Jenkins' },
  { id: 'CLM-24-08790', insured: 'Coastline Logistics Ltd', line: 'Marine', amount: 24500000, stage: 'Investigation', sla: 5, owner: 'Sarah Jenkins' },
  { id: 'CLM-24-08755', insured: 'Ngozi Peters', line: 'Health', amount: 420000, stage: 'Approval', sla: 1, owner: 'Chloe Chen' },
  { id: 'CLM-24-08731', insured: 'Unity Schools', line: 'Property', amount: 7300000, stage: 'Registered', sla: 7, owner: 'Sarah Jenkins' },
  { id: 'CLM-24-08702', insured: 'Musa Danjuma', line: 'Motor', amount: 960000, stage: 'Payment', sla: 0, owner: 'Chloe Chen' },
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
  { id: 1, text: 'Arthur Pendelton approved your leave request (11–13 Nov).', time: '12m', unread: true },
  { id: 2, text: 'CLM-24-08755 is due for approval today.', time: '1h', unread: true },
  { id: 3, text: 'New document: Q3 town hall slides.', time: '3h', unread: false },
]

export const poll = {
  question: 'Where should we hold the end-of-year party?',
  options: ['Beach resort', 'Rooftop lounge', 'Office + catering', 'Virtual games night'],
}
