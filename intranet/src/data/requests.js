// Cross-department requests (adapted from the AI Studio prototype's sample tickets).
export const requestTypes = ['Help ticket', 'System access', 'Device issue', 'Company resource', 'Payment approval', 'Facilities', 'Content & design']
export const requestDepts = ['IT', 'Brand & Communications', 'Finance', 'HR', 'Legal & Compliance', 'Facilities']
export const priorities = ['Low', 'Medium', 'High', 'Urgent']
export const statuses = ['Submitted', 'In progress', 'Awaiting approval', 'Completed', 'Rejected', 'Cancelled']
export const closedStatuses = ['Completed', 'Rejected', 'Cancelled']

export const initialRequests = [
  {
    id: 'REQ-1001', title: 'Welcome packs and branded items for the November cohort', type: 'Company resource',
    from: 'HR', to: 'Brand & Communications', requestedBy: 'Sarah Johnson', priority: 'High', due: '2026-11-10', status: 'Submitted', owner: null,
    description: 'We need 9 brand kits (notebook, metal water bottle and canvas tote) for new starters arriving on 12 November.',
    comments: [{ author: 'Ngozi Eke', text: 'Notebook templates are ready. Water bottles need 3 working days from the supplier.', at: '2026-10-26T10:15:00' }],
    history: [{ action: 'Submitted', by: 'Sarah Johnson', at: '2026-10-25T09:00:00' }],
  },
  {
    id: 'REQ-1002', title: 'Claims database access for motor liability modelling', type: 'System access',
    from: 'Claims', to: 'IT', requestedBy: 'Ada Okafor', priority: 'Medium', due: '2026-10-30', status: 'In progress', owner: 'Emeka Nwosu',
    description: 'Read-write SQL access for the claims analyst role so we can finish the motor liability data modelling exercise.',
    comments: [{ author: 'Emeka Nwosu', text: 'Profile created. Assigned to me and waiting for line manager approval.', at: '2026-10-24T11:00:00' }],
    history: [{ action: 'Submitted', by: 'Ada Okafor', at: '2026-10-23T14:40:00' }, { action: 'Assigned to Emeka Nwosu', by: 'Emeka Nwosu', at: '2026-10-24T11:00:00' }],
  },
  {
    id: 'REQ-1003', title: 'Budget sign-off for motor campaign flyers', type: 'Payment approval',
    from: 'Brand & Communications', to: 'Finance', requestedBy: 'Ngozi Eke', priority: 'Medium', due: '2026-10-28', status: 'Completed', owner: 'Bola Martins',
    description: 'Approval to pay a local printer for 500 gloss flyers for the new motor insurance package launch.',
    comments: [],
    history: [{ action: 'Submitted', by: 'Ngozi Eke', at: '2026-10-20T08:30:00' }, { action: 'Completed', by: 'Bola Martins', at: '2026-10-22T15:00:00' }],
  },
  {
    id: 'REQ-1004', title: 'Flickering monitor at desk 32', type: 'Device issue',
    from: 'Underwriting', to: 'IT', requestedBy: 'Chinedu Obi', priority: 'Low', due: '2026-11-06', status: 'Submitted', owner: null,
    description: 'The display flickers when using large spreadsheets. A replacement HDMI cable has already been tried.',
    comments: [],
    history: [{ action: 'Submitted', by: 'Chinedu Obi', at: '2026-10-26T13:10:00' }],
  },
  {
    id: 'REQ-1005', title: 'Review broker agreement template', type: 'Content & design',
    from: 'Underwriting', to: 'Legal & Compliance', requestedBy: 'Funmi Adeyemi', priority: 'High', due: '2026-11-03', status: 'Awaiting approval', owner: 'David Okon',
    description: 'Updated commission clauses for the 2027 broker agreement need legal review before renewal season.',
    comments: [{ author: 'David Okon', text: 'Redlines sent. Waiting for the Head of Underwriting to approve.', at: '2026-10-26T16:20:00' }],
    history: [{ action: 'Submitted', by: 'Funmi Adeyemi', at: '2026-10-21T10:00:00' }, { action: 'Assigned to David Okon', by: 'David Okon', at: '2026-10-22T09:00:00' }, { action: 'Awaiting approval', by: 'David Okon', at: '2026-10-26T16:20:00' }],
  },
]
