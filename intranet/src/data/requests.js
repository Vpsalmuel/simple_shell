// Cross-department requests (adapted from the AI Studio prototype's sample tickets).
// Help Desk and Requests are one page: every ticket goes to one of these desks.
// Brand, IT and Admin come from the 17 Nov review; HR carries over from the old Help Desk.
export const requestDesks = [
  { dept: 'IT', short: 'IT', icon: 'Desktop', contact: 'Ext. 999', desc: 'Access, passwords, devices, email and VPN', types: ['System access', 'Password or sign-in', 'Device issue', 'Email or Teams', 'Network or VPN'] },
  { dept: 'HR', short: 'HR', icon: 'Users', contact: 'Ext. 210', desc: 'Leave, payroll queries, benefits and letters', types: ['Payroll query', 'Leave question', 'Benefits and HMO', 'Employment letter'] },
  { dept: 'Admin', short: 'Admin', icon: 'Building2', contact: 'Ext. 120', desc: 'Facilities, supplies, travel and courier', types: ['Facilities', 'Office supplies', 'Travel booking', 'Courier or dispatch'] },
  { dept: 'Brand & Communications', short: 'Brand', icon: 'Palette', contact: 'Ext. 150', desc: 'Branded items, design and announcements', types: ['Branded items', 'Design request', 'Announcement or newsletter', 'Event support'] },
]
export const requestDepts = requestDesks.map((d) => d.dept)
export const requestTypes = requestDesks.flatMap((d) => d.types)
export const priorities = ['Low', 'Medium', 'High', 'Urgent']
export const statuses = ['Submitted', 'In progress', 'Awaiting approval', 'Completed', 'Rejected', 'Cancelled']
export const closedStatuses = ['Completed', 'Rejected', 'Cancelled']

export const initialRequests = [
  {
    id: 'REQ-1001', title: 'Welcome packs and branded items for the November cohort', type: 'Branded items',
    from: 'HR', to: 'Brand & Communications', requestedBy: 'Thomas Mueller', priority: 'High', due: '2026-11-10', status: 'Submitted', owner: null,
    description: 'We need 9 brand kits (notebook, metal water bottle and canvas tote) for new starters arriving on 12 November.',
    comments: [{ author: 'Elena Rostova', text: 'Notebook templates are ready. Water bottles need 3 working days from the supplier.', at: '2026-10-26T10:15:00' }],
    history: [{ action: 'Submitted', by: 'Thomas Mueller', at: '2026-10-25T09:00:00' }],
  },
  {
    id: 'REQ-1002', title: 'Claims database access for motor liability modelling', type: 'System access',
    from: 'Claims', to: 'IT', requestedBy: 'Sarah Jenkins', priority: 'Medium', due: '2026-10-30', status: 'In progress', owner: 'David Kojo',
    description: 'Read-write SQL access for the claims analyst role so we can finish the motor liability data modelling exercise.',
    comments: [{ author: 'David Kojo', text: 'Profile created. Assigned to me and waiting for line manager approval.', at: '2026-10-24T11:00:00' }],
    history: [{ action: 'Submitted', by: 'Sarah Jenkins', at: '2026-10-23T14:40:00' }, { action: 'Assigned to David Kojo', by: 'David Kojo', at: '2026-10-24T11:00:00' }],
  },
  {
    id: 'REQ-1003', title: 'Courier 500 motor campaign flyers to the Abuja office', type: 'Courier or dispatch',
    from: 'Brand & Communications', to: 'Admin', requestedBy: 'Elena Rostova', priority: 'Medium', due: '2026-10-28', status: 'Completed', owner: 'Grace Nwosu',
    description: 'The printed flyers for the new motor insurance package need to reach the Abuja office before the launch.',
    comments: [],
    history: [{ action: 'Submitted', by: 'Elena Rostova', at: '2026-10-20T08:30:00' }, { action: 'Completed', by: 'Grace Nwosu', at: '2026-10-22T15:00:00' }],
  },
  {
    id: 'REQ-1004', title: 'Flickering monitor at desk 32', type: 'Device issue',
    from: 'Underwriting', to: 'IT', requestedBy: 'Rebecca Sterling', priority: 'Low', due: '2026-11-06', status: 'Submitted', owner: null,
    description: 'The display flickers when using large spreadsheets. A replacement HDMI cable has already been tried.',
    comments: [],
    history: [{ action: 'Submitted', by: 'Rebecca Sterling', at: '2026-10-26T13:10:00' }],
  },
  {
    id: 'REQ-1005', title: 'Cover design for the 2027 broker pack', type: 'Design request',
    from: 'Underwriting', to: 'Brand & Communications', requestedBy: 'Rebecca Sterling', priority: 'High', due: '2026-11-03', status: 'Awaiting approval', owner: 'Elena Rostova',
    description: 'The 2027 broker agreement pack needs a branded cover and divider pages before renewal season.',
    comments: [{ author: 'Elena Rostova', text: 'Two cover options sent. Waiting for the Head of Underwriting to choose.', at: '2026-10-26T16:20:00' }],
    history: [{ action: 'Submitted', by: 'Rebecca Sterling', at: '2026-10-21T10:00:00' }, { action: 'Assigned to Elena Rostova', by: 'Elena Rostova', at: '2026-10-22T09:00:00' }, { action: 'Awaiting approval', by: 'Elena Rostova', at: '2026-10-26T16:20:00' }],
  },
]
