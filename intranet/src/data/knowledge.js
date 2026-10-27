// Knowledge Center articles. Titles and categories come from the AI Studio prototype;
// the body text is sample copy to replace with the approved procedures.
export const articleCategories = ['HR Policies', 'Corporate Policies', 'SOPs', 'Process Guides', 'Brand Assets', 'Products', 'FAQs']

export const articles = [
  { id: 'leave', title: 'How to apply for leave', category: 'HR Policies', excerpt: 'Step-by-step guide to requesting annual, sick, maternity or paternity leave in Kissflow.', owner: 'People & Culture', updated: '2026-09-14', views: 1245,
    body: [['Before you apply', 'Check your balance on the Docs & HR page and agree dates with your line manager.'], ['Apply in Kissflow', 'Open Kissflow, choose Leave Request, pick the leave type and dates, and submit. Your manager is notified automatically.'], ['Sick leave', 'Tell your manager before 9:00 on the first day. A doctor’s note is needed after 2 consecutive days.'], ['Maternity and paternity leave', 'Speak to People & Culture at least 8 weeks before your expected leave date.']] },
  { id: 'travel', title: 'Travel policy', category: 'Corporate Policies', excerpt: 'Booking flights and hotels, and claiming expenses for business travel.', owner: 'Finance', updated: '2026-08-02', views: 890,
    body: [['Approval', 'All business travel must be approved by your line manager before booking.'], ['Booking', 'Use the approved travel agent. Economy class for flights under 6 hours.'], ['Expenses', 'Submit receipts within 14 days of returning using the expense claim form.']] },
  { id: 'claims-sop', title: 'Claims standard operating procedure', category: 'SOPs', excerpt: 'Core procedure for assessing and approving motor and commercial liability claims.', owner: 'Claims', updated: '2026-10-12', views: 3410,
    body: [['First notice of loss', 'Register the claim within 24 hours of first contact and send the customer an acknowledgement with the claim number.'], ['Triage', 'Claims under ₦500,000 with complete documents go to the fast-track queue. Others are assigned to an adjuster.'], ['Assessment', 'Verify cover, check fraud indicators and agree the loss amount. Refer anything unusual to Fraud Analytics.'], ['Settlement', 'Approve within your authority limit, or refer upwards. Pay within 48 hours of approval.']] },
  { id: 'sales', title: 'Sales process overview', category: 'Process Guides', excerpt: 'The 5-step process for winning and onboarding new business accounts.', owner: 'Business Development', updated: '2026-07-21', views: 2150,
    body: [['1. Lead qualification', 'Confirm the prospect’s need, budget and decision-maker.'], ['2. Discovery call', 'Understand their risks and current cover.'], ['3. Proposal', 'Work with Underwriting on pricing and send a written proposal.'], ['4. Negotiation and close', 'Agree terms and issue the policy.'], ['5. Onboarding', 'Hand over to Customer Care with a welcome call within 5 working days.']] },
  { id: 'brand', title: 'Brand assets and usage guide', category: 'Brand Assets', excerpt: 'Logos, letterheads and rules for external communications.', owner: 'Brand & Communications', updated: '2026-06-30', views: 450,
    body: [['Logo', 'Use the navy logo on light backgrounds and the white logo on navy or photos. Always use the vector (SVG) file for print.'], ['Colours', 'Primary navy #1E2D64 and secondary orange #EA580C.'], ['Approval', 'Anything going to customers or the press must be approved by Brand & Communications.']] },
  { id: 'products', title: 'Insurance products portfolio', category: 'Products', excerpt: 'Personal and commercial lines we underwrite, with their variants.', owner: 'Underwriting', updated: '2026-10-01', views: 5200,
    body: [['Main lines', 'Motor, Fire, Agric, Energy, Engineering, Travel and Aviation insurance.'], ['Where to learn more', 'Each product’s variants are listed in the new-staff walkthrough and the Underwriting workbench.']] },
  { id: 'office-faq', title: 'General office FAQs', category: 'FAQs', excerpt: 'Parking, the café, dress code and building access.', owner: 'People & Culture', updated: '2026-09-01', views: 1800,
    body: [['When does the café open?', 'From 7:30 on working days.'], ['Where can I park?', 'Staff parking is in the basement. Register your car plate with Facilities.'], ['What should I wear?', 'Business casual on office days (Tue–Thu). Client-facing roles wear full business attire in scheduled meetings.'], ['I lost my access card', 'Report it to reception straight away for a replacement.']] },
]

export const helpCategories = [
  { id: 'it', label: 'IT support', icon: 'LifeBuoy', dept: 'IT', text: 'Laptops, access, passwords, VPN and email.', contact: 'Ext. 999' },
  { id: 'hr', label: 'HR & people', icon: 'Users', dept: 'HR', text: 'Leave, payroll queries, benefits and wellbeing.', contact: 'Ext. 210' },
  { id: 'finance', label: 'Finance', icon: 'Wallet', dept: 'Finance', text: 'Expenses, reimbursements and vendor payments.', contact: 'Ext. 330' },
  { id: 'facilities', label: 'Facilities', icon: 'Building2', dept: 'Facilities', text: 'Desks, meeting rooms, parking and repairs.', contact: 'Ext. 120' },
]

// FAQs: the first four come from the AI Studio prototype.
export const faqs = [
  { q: 'How do I sign in to corporate email with single sign-on?', a: 'Open Outlook on the web and choose Sign in with SSO. If you are off-site, connect to the FortiClient VPN first.' },
  { q: 'When do vendor invoices get paid?', a: 'Finance processes vendor payments on the 10th and 25th of every month, once approved.' },
  { q: 'How do I claim the home broadband allowance?', a: 'Submit your receipts with the expense claim form in Docs & HR. People & Culture approves wellness allowances.' },
  { q: 'Where is the latest underwriting risk matrix?', a: 'In the Underwriting workbench, or download the Underwriting authority matrix from Docs & HR.' },
  { q: 'How fast are help tickets answered?', a: 'Standard tickets are picked up within 2 working hours. Urgent IT issues: call extension 999.' },
  { q: 'I forgot my password', a: 'Use Reset password on the sign-in page. You will need your authenticator app.' },
]
