// Milestones, celebrations, wellbeing and rewards. Content adapted from the AI Studio prototype;
// items marked "sample" are placeholders to replace with real HR data.

// Milestones are work anniversaries only (stakeholder decision). Years are counted from each person's joining date.
export const milestones = [
  { id: 'm1', person: 'Marcus Vance', years: 4, date: '2026-09-12', message: 'Marcus has transformed how our Customer Experience team works.', reactions: { '🎉': 15, '👏': 11, '❤️': 6 } },
  { id: 'm2', person: 'Thomas Mueller', years: 9, date: '2026-08-20', message: 'Nine years of welcoming and onboarding hundreds of colleagues.', reactions: { '🎉': 16, '👏': 9, '❤️': 8 } },
  { id: 'm3', person: 'David Kojo', years: 8, date: '2026-05-10', message: 'Eight years keeping our systems running and secure.', reactions: { '🎉': 21, '👏': 14, '❤️': 7 } },
  { id: 'm4', person: 'Amanda Lin', years: 5, date: '2026-04-18', message: 'Five years keeping our budgets and reimbursements in order.', reactions: { '🎉': 12, '👏': 10, '❤️': 5 } },
  { id: 'm5', person: 'Sarah Jenkins', years: 6, date: '2026-03-15', message: 'Six years in Claims, and buddy to many of our new joiners.', reactions: { '🎉': 18, '👏': 12, '❤️': 11 } },
  { id: 'm6', person: 'Elena Rostova', years: 5, date: '2026-02-14', message: 'Five years telling the Rex story inside and out.', reactions: { '🎉': 13, '👏': 9, '❤️': 6 } },
  { id: 'm7', person: 'Victoria Hawthorne', years: 11, date: '2026-01-10', message: '11 years leading Rex Insurance. Thank you for your continued leadership.', reactions: { '🎉': 41, '👏': 33, '❤️': 27 } },
]

// Birthdays as MM-DD. Sarah (06-08) and Amanda (06-09) come from the prototype; the rest are samples.
export const birthdays = {
  'Sarah Jenkins': '06-08', 'Amanda Lin': '06-09', 'Arthur Pendelton': '11-02', 'Chloe Chen': '11-05', 'David Kojo': '11-14',
  'Marcus Vance': '12-03', 'Fatima Bello': '10-30', 'John Davis': '01-21', 'Elena Rostova': '02-27', 'Michael Okoro': '11-22',
  'Rebecca Sterling': '04-11', 'Thomas Mueller': '09-02', 'Samuel Adebayo': '07-17', 'Victoria Hawthorne': '03-05',
}

export const wellbeingChecklist = [
  { id: 'breathe', text: 'Take a 5-minute deep-breathing break between tasks.' },
  { id: 'walk', text: 'Step away from your screen for a 10-minute walk.' },
  { id: 'gratitude', text: 'Note one personal win or one colleague who helped you today.' },
  { id: 'water', text: 'Drink at least 2.5 litres of water.' },
]

export const wellbeingTabs = [
  {
    id: 'hmo', label: 'HMO & medical', icon: 'Stethoscope',
    title: 'HMO medical cover and full-body screening',
    intro: 'Every Rex Insurance employee is registered on our premium medical tier.',
    points: [
      ['Specialist consultations', 'See paediatricians, cardiologists and ophthalmologists at 12 approved partner hospitals, fully covered.'],
      ['Annual full-body check-up', 'A yearly blood, screening and diagnostic profile, fully prepaid.'],
      ['Pharmacy cover', 'Prescribed chronic medication and therapeutic supplies are covered with your HMO card.'],
    ],
    contact: { label: 'HMO provider helpline', value: '+234-REX-HEALTH', note: 'Provider: Reliance HMO Premium Core' },
  },
  {
    id: 'mind', label: 'Mental health', icon: 'Brain',
    title: 'Free, confidential therapy support',
    intro: 'Your peace of mind matters. Sessions are private: no records are shared with HR or your manager.',
    points: [
      ['Speak with our corporate psychologist', 'Book a free, confidential session in person or by video.'],
      ['Counsellor hotline', 'Talk to someone the same day when work or life feels heavy.'],
      ['Self-guided support', 'Use the daily checklist on this page to build small habits that help.'],
    ],
    contact: { label: 'Counsellor hotline', value: 'Ext. 884-PEACE', note: 'Confidential, weekdays 8:00–18:00' },
  },
  {
    id: 'fitness', label: 'Fitness & run club', icon: 'Dumbbell',
    title: 'Gym discounts and the Rex run club',
    intro: 'We fund and match fitness costs to keep you healthy and energised.',
    points: [
      ['75% gym membership match', 'Rex pays 75% of your membership at partner gyms.'],
      ['Wednesday run club', 'A 5km group run every Wednesday morning. All paces welcome.'],
      ['Monthly hiking challenge', 'A guided hike at Lekki Conservation Centre once a month.'],
    ],
    contact: { label: 'Fitness coordinator', value: 'Ext. 201', note: 'People & Culture' },
  },
]

// Next monthly hike (the prototype's 07:40 start time, moved to the next upcoming Saturday).
export const nextHike = { date: '2026-11-14', time: '07:40', place: 'Lekki Conservation Centre', slots: 12 }

export const benefits = [
  { icon: 'Trophy', title: 'Annual performance bonus', text: 'A discretionary bonus of 5% to 20% of base salary, based on company results and your goals.' },
  { icon: 'TrendingUp', title: 'Fast-track promotions', text: 'Twice-yearly peer-reviewed appraisals put top performers forward for faster promotion.' },
  { icon: 'Stethoscope', title: 'Premium HMO cover', text: 'Specialist care, annual screening and pharmacy cover.', to: '/wellbeing' },
  { icon: 'Dumbbell', title: '75% gym match', text: 'Partner gym memberships, plus run club and monthly hikes.', to: '/wellbeing' },
  { icon: 'GraduationCap', title: 'Learning budget', text: 'Courses and certifications through the Learning hub.', to: '/learning' },
]

// Career tracks and promotion criteria (amounts from the prototype were in USD and have been left out).
export const careerTracks = {
  claims: { label: 'Claims', tiers: [
    { title: 'Junior Claims Analyst', criteria: 'Complete the onboarding walkthrough and 3 core Learning courses.' },
    { title: 'Claims Assessor / Specialist', criteria: 'Average processing time under 4 days with a 98% audit compliance score.' },
    { title: 'Senior Claims Underwriter', criteria: 'Lead large commercial property settlements and buddy junior analysts.' },
    { title: 'Claims Team Operations Lead', criteria: 'Set policyholder strategy and coordinate fast-track digital routing.' },
  ] },
  underwriting: { label: 'Underwriting', tiers: [
    { title: 'Underwriting Associate', criteria: 'Configure standard rating tools and pass basic compliance ratings.' },
    { title: 'Risk Analyst / Assessor', criteria: 'Structure liability risk weights with direct underwriting authority.' },
    { title: 'Director of Risk Placements', criteria: 'Set pricing direction and manage reinsurance broker relationships.' },
  ] },
  general: { label: 'All other teams', tiers: [
    { title: 'Support & Associates', criteria: 'Meet your initial role responsibilities and department compliance milestones.' },
    { title: 'Senior Officers / Specialists', criteria: 'Keep strong ratings while driving team projects and efficiency.' },
    { title: 'Principal Executive Lead', criteria: 'Lead cross-department work, budget reviews and leadership portfolios.' },
  ] },
}

// Where each demo persona sits on its track (track id, tier index).
export const currentTier = {
  'Samuel Adebayo': ['claims', 0], 'Sarah Jenkins': ['claims', 1], 'Rebecca Sterling': ['underwriting', 1],
  'Marcus Vance': ['general', 1], 'Thomas Mueller': ['general', 2], 'Amanda Lin': ['general', 1], 'David Kojo': ['general', 1],
  'Elena Rostova': ['general', 1], 'Victoria Hawthorne': ['general', 2],
}
