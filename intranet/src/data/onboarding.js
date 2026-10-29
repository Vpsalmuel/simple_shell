// Walkthrough content for new staff. Replace copy, video `src` URLs and policy text with the real material.
// A video with `src: null` renders as a placeholder player so the flow can still be tested.

export const walkthroughSteps = [
  { id: 'md', label: "MD's welcome", blurb: 'Please watch the welcome message from our Managing Director/CEO.' },
  { id: 'company', label: 'Company overview', blurb: 'Our history, mission and where we are going' },
  { id: 'values', label: 'Our values', blurb: 'What we stand for, every day' },
  { id: 'culture', label: 'Culture & workplace norms', blurb: 'How we work together, in the office and remote' },
  { id: 'products', label: 'Insurance products', blurb: 'What we sell and who it protects' },
  { id: 'locations', label: 'Office locations', blurb: 'Find your way around headquarters' },
  { id: 'team', label: 'Meet your team', blurb: 'Your manager, your buddy and your colleagues' },
  { id: 'departments', label: 'Meet the departments', blurb: 'Culture videos from every team' },
  { id: 'policies', label: 'HR & IT Policies', blurb: 'Read and sign the policies that apply to everyone' },
  { id: 'tools', label: 'Your tools & IT setup', blurb: 'Get signed in to the systems you need' },
  { id: 'performance', label: 'Performance management', blurb: 'How we set goals and review progress' },
  { id: 'feedback', label: 'Schedule buddy feedback', blurb: 'Book your first-week check-in' },
]

export const company = {
  intro: 'Founded in 2010, Rex Insurance has grown into a leading provider of innovative risk management solutions. Our mission is to secure the futures of our clients through transparent, robust and accessible insurance products.',
  formerName: 'Metropulse Insurance',
  mission: 'To secure the futures of our clients through transparent, robust and accessible insurance products.',
  vision: 'To be the most trusted insurer in the markets we serve.',
  // Sample figures — replace with official numbers.
  stats: [
    { label: 'Founded', value: '2010' },
    { label: 'Customers protected', value: '1.2M' },
    { label: 'Branches', value: '18' },
    { label: 'Colleagues', value: '850' },
  ],
  milestones: [
    { year: '2010', text: 'Rex Insurance founded.' },
    { year: 'Rebrand', text: 'Metropulse Insurance becomes Rex Insurance.' },
    { year: '2026', text: 'Telematics motor cover launches in pilot states.' },
  ],
}

export const mdMessage = {
  name: 'Victoria Hawthorne',
  title: 'Managing Director & CEO',
  video: { src: null, poster: null, duration: '2:40' },
  letter: [
    'Welcome to Rex Insurance. You have joined a team that exists for one reason: to be there for our customers on their worst days.',
    'Over the next few weeks you will meet colleagues who care deeply about doing the right thing, quickly and fairly. Ask questions, challenge us, and bring your ideas.',
    'Our values are not posters on a wall. They are how we decide, how we treat each other, and how we earn trust. I am glad you are here.',
  ],
}

export const values = [
  { id: 'integrity', name: 'Integrity First', icon: 'ShieldCheck', short: 'We do the right thing, even when no one is watching.', detail: 'We follow the rules, protect customer data, and report anything that does not feel right.', example: 'A colleague declines a gift from a broker and logs it in the gifts register.' },
  { id: 'empathy', name: 'Client Empathy', icon: 'HeartHandshake', short: 'We listen and act with compassion in every interaction.', detail: 'We settle valid claims fast, explain decisions in plain language, and treat every customer like family.', example: 'A claims analyst calls a customer before the deadline to explain a delay, rather than waiting for them to chase.' },
  { id: 'precision', name: 'Digital Precision', icon: 'Target', short: 'We use data and technology to get it right, first time.', detail: 'We remove friction with good tools, accurate data and simple processes.', example: 'Customer Care built a chat widget that halved average wait time.' },
  { id: 'growth', name: 'Continuous Growth', icon: 'Lightbulb', short: 'We invest in the growth of our people and our business.', detail: 'We learn fast, share what we know, and support each other to develop.', example: 'An underwriter runs a lunchtime session on marine risk for the Claims team.' },
]

export const workplaceNorms = [
  { title: 'Office days (Tue–Thu)', text: 'Business casual. Client-facing roles wear full business attire during scheduled meetings.' },
  { title: 'Remote days (Mon & Fri)', text: 'Casual but presentable for video calls. Use a quiet background, with a professional virtual background if needed.' },
  { title: 'Core hours', text: 'Be reachable 10:00–16:00 on working days, and keep your Teams status up to date.' },
]

export const products = [
  { id: 'motor', title: 'Motor Insurance', icon: 'Car', variants: ['Third-party', 'Comprehensive', 'Royal Silver', 'Bronze'], description: 'Motor insurance for private and commercial vehicles against accident, theft and third-party liability, with 24/7 roadside assistance.' },
  { id: 'fire', title: 'Fire Insurance', icon: 'Flame', variants: ['Standard Fire', 'Special Perils'], description: 'Protects commercial and residential properties against loss or damage caused by fire, lightning and other specified perils.' },
  { id: 'agric', title: 'Agric Insurance', icon: 'Sprout', variants: ['Crop', 'Livestock', 'Poultry', 'Fish Farm'], description: 'Cover for farmers and agricultural businesses against natural disasters, disease and other risks affecting yields.' },
  { id: 'energy', title: 'Energy Insurance', icon: 'Zap', variants: ['Oil & Gas', 'Renewable', 'Power Generation'], description: 'Risk solutions for the energy sector, including offshore and onshore operations, renewables and power generation.' },
  { id: 'engineering', title: 'Engineering Insurance', icon: 'HardHat', variants: ['Contractors All Risk', 'Erection All Risk', 'Plant & Machinery'], description: 'Cover for construction projects, machinery installation and operational equipment against physical loss or damage.' },
  { id: 'travel', title: 'Travel Insurance', icon: 'Luggage', variants: ['Local', 'International', 'Student', 'Pilgrimage'], description: 'Covers medical emergencies, trip cancellations, lost baggage and travel delays.' },
  { id: 'marine', title: 'Marine Insurance', icon: 'Ship', variants: ['Marine Cargo', 'Marine Hull', 'Goods-in-Transit'], description: 'Covers goods moving by sea, air and road, and the vessels that carry them, against loss or damage in transit.' },
  { id: 'bond', title: 'Bond Insurance', icon: 'ScrollText', variants: ['Bid Bond', 'Performance Bond', 'Advance Payment Bond', 'Customs Bond'], description: 'Guarantees that protect project owners and government agencies if a contractor or importer fails to meet their obligations.' },
  { id: 'aviation', title: 'Aviation Insurance', icon: 'Plane', variants: ['Hull All Risks', 'Passenger Liability', 'Airport Operators Liability'], description: 'Aircraft hull, passenger and third-party liability cover for airlines, private jets and aviation operations.' },
]

// Headquarters floor plan, top floor first.
export const floors = [
  { floor: 4, name: 'Executive & HR', teams: ['Executive Office', 'People & Culture', 'Legal & Compliance', 'Finance'] },
  { floor: 3, name: 'Claims', teams: ['Claims', 'Actuarial'] },
  { floor: 2, name: 'Underwriting', teams: ['Underwriting', 'Brand & Communications'] },
  { floor: 1, name: 'IT & Customer Care', teams: ['Technology', 'Customer Care', 'Reception'] },
]

export const performance = [
  { title: 'Quarterly OKRs', text: 'Objectives and key results are set at the start of every quarter.' },
  { title: 'Weekly 1:1s', text: 'Dedicated time with your manager to unblock work and discuss progress.' },
  { title: '360 reviews', text: 'Run once a year for feedback from peers, managers and direct reports.' },
  { title: 'First check-in', text: 'Your first performance check-in is at the end of your 30-day onboarding period.' },
]

export const itSetup = [
  { id: 'mfa', title: 'Set up multi-factor authentication', text: 'Install the authenticator app and register your phone. Required for every system.' },
  { id: 'email', title: 'Sign in to Outlook email', text: 'Use your single sign-on account. Your address is firstname.lastname@rexinsurance.com.' },
  { id: 'teams', title: 'Join Microsoft Teams', text: 'Join your department channel and the Rex All-Staff channel.' },
]

export const feedbackSlots = ['10:00', '11:30', '14:00', '15:30']

// Also powers the Departments pages. `dept` matches the people directory's department name.
export const departmentTour = [
  { id: 'claims', dept: 'Claims', name: 'Claims', head: 'Arthur Pendelton', headcount: 120, location: 'HQ, floor 3', services: ['Register a claim', 'Claim status updates', 'Fraud referrals'], contact: 'claims@rexinsurance.com', what: 'Registers, assesses and settles claims, and the moment customers judge us by.', video: { src: null, duration: '3:10' } },
  { id: 'underwriting', dept: 'Underwriting', name: 'Underwriting', head: 'Rebecca Sterling', headcount: 85, location: 'HQ, floor 2', services: ['Quotes and referrals', 'Authority limits', 'Renewal pricing'], contact: 'underwriting@rexinsurance.com', what: 'Prices and accepts risk so we can keep our promises sustainably.', video: { src: null, duration: '2:55' } },
  { id: 'care', dept: 'Customer Care', name: 'Customer Care', head: 'Marcus Vance', headcount: 140, location: 'HQ, floor 1', services: ['Customer callbacks', 'Complaints', 'Customer feedback'], contact: 'care@rexinsurance.com', what: 'The voice of Rex: calls, chat, complaints and customer feedback.', video: { src: null, duration: '2:20' } },
  { id: 'actuarial', dept: 'Actuarial', name: 'Actuarial', head: 'Ibrahim Musa', headcount: 18, location: 'HQ, floor 3', services: ['Pricing models', 'Reserving', 'Data requests'], contact: 'actuarial@rexinsurance.com', what: 'Models reserves, pricing and capital using data.', video: { src: null, duration: '2:45' } },
  { id: 'finance', dept: 'Finance', name: 'Finance', head: 'Amanda Lin', headcount: 46, location: 'HQ, floor 4', services: ['Payments and approvals', 'Expenses', 'Management reports'], contact: 'finance@rexinsurance.com', what: 'Keeps the business solvent, paid and compliant.', video: { src: null, duration: '2:30' } },
  { id: 'hr', dept: 'HR', name: 'People & Culture', head: 'Thomas Mueller', headcount: 22, location: 'HQ, floor 4', services: ['Leave and benefits', 'Recruitment', 'Learning'], contact: 'people@rexinsurance.com', what: 'Hiring, growth, wellbeing and everything that makes Rex a great place to work.', video: { src: null, duration: '2:15' } },
  { id: 'it', dept: 'IT', name: 'Technology', head: 'David Kojo', headcount: 64, location: 'HQ, floor 1', services: ['Service desk', 'Access requests', 'Security incidents'], contact: 'servicedesk@rexinsurance.com', what: 'Runs the systems, security and tools everyone depends on.', video: { src: null, duration: '2:40' } },
  { id: 'comms', dept: 'Brand & Communications', name: 'Brand & Communications', head: 'Elena Rostova', headcount: 12, location: 'HQ, floor 2', services: ['Announcements', 'Brand assets', 'Event support'], contact: 'comms@rexinsurance.com', what: 'Tells the Rex story inside and out, and looks after our brand.', video: { src: null, duration: '2:10' } },
  { id: 'compliance', dept: 'Legal & Compliance', name: 'Legal & Compliance', head: 'David Okon', headcount: 15, location: 'HQ, floor 4', services: ['Contract reviews', 'Regulatory questions', 'Gifts register'], contact: 'compliance@rexinsurance.com', what: 'Keeps us on the right side of the regulator and the law.', video: { src: null, duration: '2:05' } },
]

// Sample policy text — replace with the approved policy documents.
export const policies = [
  { id: 'conduct', title: 'Code of Conduct', version: 'v4.2', pages: 'approx. 6 min read', sections: [
    ['Purpose', 'This Code sets out the standards of behaviour expected of everyone who works for or on behalf of Rex Insurance.'],
    ['Respect', 'Treat colleagues, customers and partners with courtesy and respect. Harassment and discrimination of any kind are not tolerated.'],
    ['Conflicts of interest', 'Declare any personal interest that could influence, or appear to influence, your decisions at work.'],
    ['Speaking up', 'Report concerns through your manager, HR, or the confidential whistleblowing line. Retaliation is prohibited.'],
  ] },
  { id: 'aml', title: 'Anti-Money Laundering & KYC Policy', version: 'v3.0', pages: 'approx. 8 min read', sections: [
    ['Scope', 'Applies to all staff who onboard customers, process premiums, or pay claims.'],
    ['Customer due diligence', 'Verify the identity of customers and beneficial owners before binding cover or paying claims.'],
    ['Red flags', 'Unusual overpayments, refunds to third parties, and reluctance to provide ID must be escalated to Compliance.'],
    ['Reporting', 'Suspicious transactions are reported to the Money Laundering Reporting Officer. Do not alert the customer.'],
  ] },
  { id: 'data', title: 'Data Privacy & Protection Policy (NDPA)', version: 'v2.1', pages: 'approx. 5 min read', sections: [
    ['Principles', 'Collect only the personal data you need, use it only for the stated purpose, and keep it secure.'],
    ['Access', 'Access customer records only when your role requires it. All access is logged.'],
    ['Breaches', 'Report any suspected data breach to IT Security within one hour of discovery.'],
  ] },
  { id: 'safety', title: 'Workplace Health & Safety Policy', version: 'v1.3', pages: 'approx. 4 min read', sections: [
    ['Your responsibility', 'Take reasonable care of your own safety and that of others affected by your work.'],
    ['Emergencies', 'Learn the fire exits and assembly point on your floor. Follow fire wardens during drills and alarms.'],
    ['Reporting', 'Report accidents, near misses and hazards to Facilities on the same day.'],
  ] },
  { id: 'it', title: 'IT Acceptable Use Policy', version: 'v5.0', pages: 'approx. 4 min read', sections: [
    ['Devices', 'Company devices are for business use. Keep them locked and up to date.'],
    ['Passwords & MFA', 'Never share passwords. Multi-factor authentication is mandatory on all systems.'],
    ['Phishing', 'Report suspicious emails using the Report Phish button. Do not click unknown links.'],
  ] },
]
