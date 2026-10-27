// Walkthrough content for new staff. Replace copy, video `src` URLs and policy text with the real material.
// A video with `src: null` renders as a placeholder player so the flow can still be tested.

export const walkthroughSteps = [
  { id: 'company', label: 'Company profile', blurb: 'Who we are and where we are going' },
  { id: 'md', label: "MD's message", blurb: 'A welcome from our Managing Director' },
  { id: 'values', label: 'Values & culture', blurb: 'What we stand for, every day' },
  { id: 'departments', label: 'Meet the departments', blurb: 'Culture videos from every team' },
  { id: 'policies', label: 'Policies to sign', blurb: 'Read and acknowledge key policies' },
]

export const company = {
  intro: 'Rex Insurance protects individuals, families and businesses with motor, health, property, marine and life cover. Our promise is simple: when life happens, we show up fast and pay fairly.',
  mission: 'To make protection simple, fair and fast for every customer we serve.',
  vision: 'To be the most trusted insurer in the markets we serve.',
  // Sample figures — replace with official numbers.
  stats: [
    { label: 'Years in business', value: '25+' },
    { label: 'Customers protected', value: '1.2M' },
    { label: 'Branches', value: '18' },
    { label: 'Colleagues', value: '850' },
  ],
  milestones: [
    { year: '2001', text: 'Rex Insurance founded with a motor and fire book.' },
    { year: '2010', text: 'Launched health and life business lines.' },
    { year: '2018', text: 'Opened regional hubs in Abuja and Port Harcourt.' },
    { year: '2024', text: 'Digital claims: most claims registered online.' },
    { year: '2026', text: 'Telematics motor cover and same-week settlement.' },
  ],
}

export const mdMessage = {
  name: 'Grace Eze',
  title: 'Managing Director / CEO',
  video: { src: null, poster: null, duration: '2:40' },
  letter: [
    'Welcome to Rex Insurance. You have joined a team that exists for one reason: to be there for our customers on their worst days.',
    'Over the next few weeks you will meet colleagues who care deeply about doing the right thing, quickly and fairly. Ask questions, challenge us, and bring your ideas.',
    'Our values are not posters on a wall. They are how we decide, how we treat each other, and how we earn trust. I am glad you are here.',
  ],
}

export const values = [
  { id: 'customer', name: 'Customer first', icon: 'HeartHandshake', short: 'We start with the customer and work backwards.', detail: 'We settle valid claims fast, explain decisions in plain language, and treat every customer like family.', example: 'A claims analyst calls a customer before the deadline to explain a delay, rather than waiting for them to chase.' },
  { id: 'ownership', name: 'Ownership', icon: 'Target', short: 'We act like owners and finish what we start.', detail: 'We take responsibility for outcomes, not just tasks, and we raise problems early.', example: 'An underwriter spots a pricing gap in a renewal and fixes the rating table for everyone.' },
  { id: 'integrity', name: 'Integrity', icon: 'ShieldCheck', short: 'We do the right thing, even when no one is watching.', detail: 'We follow the rules, protect customer data, and report anything that does not feel right.', example: 'A colleague declines a gift from a broker and logs it in the gifts register.' },
  { id: 'innovation', name: 'Innovation', icon: 'Lightbulb', short: 'We keep finding better ways.', detail: 'We experiment, learn fast, and use technology to remove friction for customers and colleagues.', example: 'Customer Care built a chat widget that halved average wait time.' },
]

export const departmentTour = [
  { id: 'claims', name: 'Claims', head: 'Tunde Bello', what: 'Registers, assesses and settles claims, and the moment customers judge us by.', video: { src: null, duration: '3:10' } },
  { id: 'underwriting', name: 'Underwriting', head: 'Funmi Adeyemi', what: 'Prices and accepts risk so we can keep our promises sustainably.', video: { src: null, duration: '2:55' } },
  { id: 'care', name: 'Customer Care', head: 'Zainab Lawal', what: 'The voice of Rex: calls, chat, complaints and customer feedback.', video: { src: null, duration: '2:20' } },
  { id: 'actuarial', name: 'Actuarial', head: 'Ibrahim Musa', what: 'Models reserves, pricing and capital using data.', video: { src: null, duration: '2:45' } },
  { id: 'finance', name: 'Finance', head: 'Bola Martins', what: 'Keeps the business solvent, paid and compliant.', video: { src: null, duration: '2:30' } },
  { id: 'hr', name: 'People & Culture', head: 'Sarah Johnson', what: 'Hiring, growth, wellbeing and everything that makes Rex a great place to work.', video: { src: null, duration: '2:15' } },
  { id: 'it', name: 'Technology', head: 'Emeka Nwosu', what: 'Runs the systems, security and tools everyone depends on.', video: { src: null, duration: '2:40' } },
  { id: 'compliance', name: 'Legal & Compliance', head: 'David Okon', what: 'Keeps us on the right side of the regulator and the law.', video: { src: null, duration: '2:05' } },
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
  { id: 'data', title: 'Data Protection & Privacy Policy', version: 'v2.1', pages: 'approx. 5 min read', sections: [
    ['Principles', 'Collect only the personal data you need, use it only for the stated purpose, and keep it secure.'],
    ['Access', 'Access customer records only when your role requires it. All access is logged.'],
    ['Breaches', 'Report any suspected data breach to IT Security within one hour of discovery.'],
  ] },
  { id: 'it', title: 'IT Acceptable Use Policy', version: 'v5.0', pages: 'approx. 4 min read', sections: [
    ['Devices', 'Company devices are for business use. Keep them locked and up to date.'],
    ['Passwords & MFA', 'Never share passwords. Multi-factor authentication is mandatory on all systems.'],
    ['Phishing', 'Report suspicious emails using the Report Phish button. Do not click unknown links.'],
  ] },
]
