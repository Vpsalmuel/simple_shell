// Department-specific Home config. Everyone gets the same Home layout;
// quick links and the department's tasks (`focus`) swap per department.

const shared = {
  quickLinks: [
    { label: 'Payslips', icon: 'Wallet', href: '#' },
    { label: 'Book meeting room', icon: 'DoorOpen', action: 'meetingRoom' },
    { label: 'Help Desk', icon: 'LifeBuoy', href: '/help' },
  ],
}

export const deptDashboards = {
  Claims: {
    quickLinks: [{ label: 'Claims portal', icon: 'ShieldCheck', href: '/claims' }, { label: 'Fraud analytics', icon: 'ScanSearch', href: '#' }, { label: 'Policy admin', icon: 'FileStack', href: '#' }],
    focus: { type: 'queue', title: 'My SLA queue', subtitle: 'Claims due soonest', cta: { label: 'Open claims hub', to: '/claims' } },
  },
  Underwriting: {
    quickLinks: [{ label: 'UW workbench', icon: 'Scale', href: '#' }, { label: 'Rating engine', icon: 'Calculator', href: '#' }, { label: 'Policy admin', icon: 'FileStack', href: '#' }],
    focus: { type: 'list', title: 'Referrals awaiting decision', subtitle: 'Above your authority limit', items: [
      { primary: 'Coastline Logistics: Marine cargo', secondary: 'Sum insured ₦850M · broker referral', badge: 'Due today', tone: 'critical' },
      { primary: 'Unity Schools: Property', secondary: 'Sum insured ₦420M · flood zone B', badge: '2 days', tone: 'warning' },
      { primary: 'Apex Haulage: Fleet motor', secondary: '42 vehicles · telematics opt-in', badge: '4 days', tone: 'neutral' },
    ], cta: { label: 'Open workbench', to: '#' } },
  },
  'Customer Care': {
    quickLinks: [{ label: 'Contact centre', icon: 'Headphones', href: '#' }, { label: 'Complaints log', icon: 'MessageSquareWarning', href: '#' }, { label: 'Policy lookup', icon: 'FileStack', href: '#' }],
    focus: { type: 'list', title: 'Escalations', subtitle: 'Complaints needing a lead', items: [
      { primary: 'Bisi Akande: motor claim delay', secondary: 'Day 9 · promised callback 2pm', badge: 'Overdue', tone: 'critical' },
      { primary: 'Ngozi Peters: HMO pre-auth', secondary: 'Day 3 · awaiting hospital report', badge: 'Today', tone: 'warning' },
      { primary: 'Femi Ola: refund query', secondary: 'Day 1 · Finance confirming', badge: 'On track', tone: 'good' },
    ], cta: { label: 'Open complaints log', to: '#' } },
  },
  HR: {
    quickLinks: [{ label: 'HR system', icon: 'Users', href: '#' }, { label: 'Recruitment', icon: 'UserPlus', href: '#' }, { label: 'Learning admin', icon: 'GraduationCap', href: '#' }],
    focus: { type: 'approvals', title: 'Pending approvals', subtitle: 'Leave and training requests', items: [
      { id: 'a1', primary: 'Chloe Chen: Annual leave', secondary: '11-15 Nov · 5 days' },
      { id: 'a2', primary: 'Michael Okoro: mediation certification', secondary: '₦180,000 · online course' },
      { id: 'a3', primary: 'Ibrahim Musa: Study leave', secondary: '2-4 Dec · exam' },
    ] },
  },
  Finance: {
    quickLinks: [{ label: 'Expenses', icon: 'Receipt', href: '#' }, { label: 'Reinsurance ledger', icon: 'Landmark', href: '#' }, { label: 'Reports', icon: 'BarChart3', href: '#' }],
    focus: { type: 'approvals', title: 'Payments to approve', subtitle: 'Above ₦5M need two approvers', items: [
      { id: 'p1', primary: 'CLM-24-08790 settlement', secondary: '₦24,500,000 · Coastline Logistics' },
      { id: 'p2', primary: 'Reinsurance premium: Q4', secondary: '₦61,200,000 · Treaty A' },
      { id: 'p3', primary: 'Vendor: CloudSoft licences', secondary: '₦8,400,000 · IT' },
    ] },
  },
  IT: {
    quickLinks: [{ label: 'Service desk', icon: 'LifeBuoy', href: '#' }, { label: 'Status page', icon: 'Activity', href: '#' }, { label: 'Security', icon: 'Lock', href: '#' }],
    focus: { type: 'list', title: 'Service health', subtitle: 'Core systems right now', items: [
      { primary: 'Policy administration', secondary: 'All regions', badge: 'Operational', tone: 'good' },
      { primary: 'Claims workbench', secondary: 'Document upload slow', badge: 'Degraded', tone: 'warning' },
      { primary: 'Email & Teams', secondary: 'All regions', badge: 'Operational', tone: 'good' },
      { primary: 'VPN', secondary: 'Port Harcourt office', badge: 'Outage', tone: 'critical' },
    ], cta: { label: 'Open service desk', to: '#' } },
  },
  'Brand & Communications': {
    quickLinks: [{ label: 'Publish news', icon: 'Megaphone', href: '/admin' }, { label: 'Brand assets', icon: 'Palette', href: '/knowledge' }, { label: 'Request Centre', icon: 'Inbox', href: '/requests' }],
    focus: { type: 'list', title: 'Content calendar', subtitle: 'Scheduled for the next two weeks', items: [
      { primary: 'Town hall recap and recording', secondary: 'News · Thu 29 Oct', badge: 'Drafting', tone: 'warning' },
      { primary: 'Health plan open enrolment reminder', secondary: 'Announcement · Mon 2 Nov', badge: 'Scheduled', tone: 'good' },
      { primary: 'Single sign-on go-live notice', secondary: 'Announcement · Tue 3 Nov', badge: 'Needs IT review', tone: 'critical' },
    ], cta: { label: 'Open Admin Workspace', to: '/admin' } },
  },
  'Executive Office': {
    quickLinks: [{ label: 'Board pack', icon: 'BarChart3', href: '#' }, { label: 'Admin Workspace', icon: 'LayoutGrid', href: '/admin' }, { label: 'Request Centre', icon: 'Inbox', href: '/requests' }],
    focus: { type: 'approvals', title: 'Awaiting your sign-off', subtitle: 'Escalated to the Managing Director', items: [
      { id: 'x1', primary: 'Reinsurance treaty renewal 2027', secondary: '₦61.2M · Finance' },
      { id: 'x2', primary: 'Telematics pilot: expand to 3 more states', secondary: 'Underwriting · business case' },
      { id: 'x3', primary: 'Q4 hiring plan: 14 roles', secondary: 'People & Culture' },
    ] },
  },
}

export function dashboardFor(dept) {
  const d = deptDashboards[dept] ?? deptDashboards.Claims
  return { ...d, quickLinks: [...d.quickLinks, ...shared.quickLinks] }
}
