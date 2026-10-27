// Department-specific dashboard config. Everyone gets the same Home layout;
// these blocks swap per department. `series` feeds the KPI sparkline (oldest → newest, 8 weeks).
// `good` says which direction is an improvement, so the delta is colored correctly.

const shared = {
  quickLinks: [
    { label: 'Payslips', icon: 'Wallet', href: '#' },
    { label: 'IT helpdesk', icon: 'LifeBuoy', href: '#' },
    { label: 'Learning', icon: 'GraduationCap', href: '#' },
  ],
}

export const deptDashboards = {
  Claims: {
    kpis: [
      { label: 'Open claims', value: 1284, delta: -4.2, hint: 'vs last week', good: 'down', series: [1410, 1388, 1362, 1371, 1340, 1322, 1340, 1284] },
      { label: 'Avg. settlement', value: 6.2, unit: ' days', decimals: 1, delta: -12.5, hint: 'vs last quarter', good: 'down', series: [7.4, 7.2, 7.1, 6.9, 6.8, 6.6, 6.4, 6.2] },
      { label: 'Within SLA', value: 94, unit: '%', delta: 2.1, hint: 'vs last week', good: 'up', series: [88, 89, 90, 91, 90, 92, 92, 94] },
      { label: 'Fraud referrals', value: 37, delta: 8.8, hint: 'vs last week', good: 'down', series: [31, 29, 33, 30, 35, 32, 34, 37] },
    ],
    quickLinks: [{ label: 'Claims portal', icon: 'ShieldCheck', href: '/claims' }, { label: 'Fraud analytics', icon: 'ScanSearch', href: '#' }, { label: 'Policy admin', icon: 'FileStack', href: '#' }],
    focus: { type: 'queue', title: 'My SLA queue', subtitle: 'Claims due soonest', cta: { label: 'Open claims hub', to: '/claims' } },
  },
  Underwriting: {
    kpis: [
      { label: 'Quotes issued (MTD)', value: 642, delta: 6.4, hint: 'vs last month', good: 'up', series: [480, 510, 530, 560, 575, 590, 610, 642] },
      { label: 'Referrals pending', value: 23, delta: -11.5, hint: 'vs last week', good: 'down', series: [31, 30, 28, 29, 27, 26, 26, 23] },
      { label: 'Renewals due (30d)', value: 418, delta: 3.0, hint: 'vs last month', good: 'up', series: [380, 385, 392, 395, 400, 404, 406, 418] },
      { label: 'Loss ratio', value: 58.4, unit: '%', decimals: 1, delta: -1.6, hint: 'vs last quarter', good: 'down', series: [61.2, 60.8, 60.1, 59.9, 59.5, 59.0, 58.8, 58.4] },
    ],
    quickLinks: [{ label: 'UW workbench', icon: 'Scale', href: '#' }, { label: 'Rating engine', icon: 'Calculator', href: '#' }, { label: 'Policy admin', icon: 'FileStack', href: '#' }],
    focus: { type: 'list', title: 'Referrals awaiting decision', subtitle: 'Above your authority limit', items: [
      { primary: 'Coastline Logistics — Marine cargo', secondary: 'Sum insured ₦850M · referred by Chinedu Obi', badge: 'Due today', tone: 'critical' },
      { primary: 'Unity Schools — Property', secondary: 'Sum insured ₦420M · flood zone B', badge: '2 days', tone: 'warning' },
      { primary: 'Apex Haulage — Fleet motor', secondary: '42 vehicles · telematics opt-in', badge: '4 days', tone: 'neutral' },
    ], cta: { label: 'Open workbench', to: '#' } },
  },
  'Customer Care': {
    kpis: [
      { label: 'Calls today', value: 612, delta: 4.1, hint: 'vs last Tuesday', good: 'up', series: [540, 560, 580, 575, 590, 600, 588, 612] },
      { label: 'Avg. wait', value: 48, unit: 's', delta: -21.3, hint: 'vs last week', good: 'down', series: [92, 85, 80, 74, 66, 61, 61, 48] },
      { label: 'CSAT', value: 4.7, unit: '/5', decimals: 1, delta: 2.2, hint: 'vs last month', good: 'up', series: [4.4, 4.5, 4.5, 4.6, 4.6, 4.6, 4.6, 4.7] },
      { label: 'Open complaints', value: 19, delta: -9.5, hint: 'vs last week', good: 'down', series: [28, 26, 25, 24, 22, 23, 21, 19] },
    ],
    quickLinks: [{ label: 'Contact centre', icon: 'Headphones', href: '#' }, { label: 'Complaints log', icon: 'MessageSquareWarning', href: '#' }, { label: 'Claims portal', icon: 'ShieldCheck', href: '/claims' }],
    focus: { type: 'list', title: 'Escalations', subtitle: 'Complaints needing a lead', items: [
      { primary: 'Bisi Akande — motor claim delay', secondary: 'Day 9 · promised callback 2pm', badge: 'Overdue', tone: 'critical' },
      { primary: 'Ngozi Peters — HMO pre-auth', secondary: 'Day 3 · awaiting hospital report', badge: 'Today', tone: 'warning' },
      { primary: 'Femi Ola — refund query', secondary: 'Day 1 · Finance confirming', badge: 'On track', tone: 'good' },
    ], cta: { label: 'Open complaints log', to: '#' } },
  },
  HR: {
    kpis: [
      { label: 'Headcount', value: 850, delta: 1.4, hint: 'vs last quarter', good: 'up', series: [826, 830, 832, 835, 838, 842, 846, 850] },
      { label: 'Open roles', value: 14, delta: -12.5, hint: 'vs last month', good: 'down', series: [19, 18, 18, 17, 16, 16, 16, 14] },
      { label: 'Onboarding', value: 9, delta: 28.6, hint: 'new starters this month', good: 'up', series: [4, 5, 5, 6, 7, 7, 7, 9] },
      { label: 'Training complete', value: 81, unit: '%', delta: 6.6, hint: 'compliance modules', good: 'up', series: [62, 66, 70, 72, 74, 76, 76, 81] },
    ],
    quickLinks: [{ label: 'HR system', icon: 'Users', href: '#' }, { label: 'Recruitment', icon: 'UserPlus', href: '#' }, { label: 'Learning admin', icon: 'GraduationCap', href: '#' }],
    focus: { type: 'approvals', title: 'Pending approvals', subtitle: 'Leave and training requests', items: [
      { id: 'a1', primary: 'Amaka Udeh — Annual leave', secondary: '11–15 Nov · 5 days' },
      { id: 'a2', primary: 'Kelvin Ade — React certification', secondary: '₦180,000 · online course' },
      { id: 'a3', primary: 'Ibrahim Musa — Study leave', secondary: '2–4 Dec · exam' },
    ] },
  },
  Finance: {
    kpis: [
      { label: 'Premium collected (MTD)', value: 4.82, unit: 'bn', prefix: '₦', decimals: 2, delta: 9.1, hint: 'vs last month', good: 'up', series: [3.9, 4.0, 4.1, 4.2, 4.4, 4.5, 4.6, 4.82] },
      { label: 'Claims paid (MTD)', value: 2.11, unit: 'bn', prefix: '₦', decimals: 2, delta: 3.4, hint: 'vs last month', good: 'down', series: [1.8, 1.9, 1.9, 2.0, 2.0, 2.05, 2.04, 2.11] },
      { label: 'Debtor days', value: 41, delta: -6.8, hint: 'vs last quarter', good: 'down', series: [49, 48, 47, 46, 45, 44, 44, 41] },
      { label: 'Payments to approve', value: 12, delta: 20, hint: 'vs yesterday', good: 'down', series: [6, 8, 7, 9, 8, 10, 10, 12] },
    ],
    quickLinks: [{ label: 'Expenses', icon: 'Receipt', href: '#' }, { label: 'Reinsurance ledger', icon: 'Landmark', href: '#' }, { label: 'Reports', icon: 'BarChart3', href: '#' }],
    focus: { type: 'approvals', title: 'Payments to approve', subtitle: 'Above ₦5M need two approvers', items: [
      { id: 'p1', primary: 'CLM-24-08790 settlement', secondary: '₦24,500,000 · Coastline Logistics' },
      { id: 'p2', primary: 'Reinsurance premium — Q4', secondary: '₦61,200,000 · Treaty A' },
      { id: 'p3', primary: 'Vendor — CloudSoft licences', secondary: '₦8,400,000 · IT' },
    ] },
  },
  IT: {
    kpis: [
      { label: 'Open tickets', value: 57, delta: -14.9, hint: 'vs last week', good: 'down', series: [81, 78, 74, 70, 66, 67, 67, 57] },
      { label: 'First-response time', value: 22, unit: ' min', delta: -18.5, hint: 'vs last week', good: 'down', series: [41, 38, 35, 32, 30, 28, 27, 22] },
      { label: 'Uptime (30d)', value: 99.94, unit: '%', decimals: 2, delta: 0.05, hint: 'vs last month', good: 'up', series: [99.7, 99.8, 99.82, 99.85, 99.88, 99.9, 99.89, 99.94] },
      { label: 'Phish reports', value: 31, delta: 24, hint: 'more staff reporting', good: 'up', series: [12, 15, 17, 19, 22, 24, 25, 31] },
    ],
    quickLinks: [{ label: 'Service desk', icon: 'LifeBuoy', href: '#' }, { label: 'Status page', icon: 'Activity', href: '#' }, { label: 'Security', icon: 'Lock', href: '#' }],
    focus: { type: 'list', title: 'Service health', subtitle: 'Core systems right now', items: [
      { primary: 'Policy administration', secondary: 'All regions', badge: 'Operational', tone: 'good' },
      { primary: 'Claims workbench', secondary: 'Document upload slow', badge: 'Degraded', tone: 'warning' },
      { primary: 'Email & Teams', secondary: 'All regions', badge: 'Operational', tone: 'good' },
      { primary: 'VPN', secondary: 'Port Harcourt office', badge: 'Outage', tone: 'critical' },
    ], cta: { label: 'Open service desk', to: '#' } },
  },
}

export function dashboardFor(dept) {
  const d = deptDashboards[dept] ?? deptDashboards.Claims
  return { ...d, quickLinks: [...d.quickLinks, ...shared.quickLinks] }
}
