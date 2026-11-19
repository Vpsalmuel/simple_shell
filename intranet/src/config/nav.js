import { BuildingsIcon as Building2, CalendarDotsIcon as CalendarDays, ConfettiIcon as PartyPopper, HeartbeatIcon as HeartPulse, HouseIcon as House, TrayIcon as Inbox, BooksIcon as Books, GridFourIcon as LayoutGrid, LifebuoyIcon as LifeBuoy, NewspaperIcon as Newspaper } from '@phosphor-icons/react'

// Departments whose staff can open the Admin Workspace.
export const adminDepts = ['HR', 'IT', 'Brand & Communications', 'Executive Office']

// Single source for the sidebar, search and route access.
// `depts` limits an item to those departments; omit it for everyone.
// Removed after the 17 Nov review: Docs & HR, Milestones (now part of Celebrations), Rewards & Benefits.
// People ("find employee") removed after the 20 Aug review. Knowledge Center and Learning are merged.
export const navGroups = [
  { label: 'Workspace', items: [
    { to: '/', label: 'Home', icon: House, end: true },
    { to: '/news', label: 'News', icon: Newspaper },
    { to: '/events', label: 'Events', icon: CalendarDays },
    { to: '/celebrations', label: 'Celebrations', icon: PartyPopper },
  ] },
  { label: 'Self-service', items: [
    { to: '/requests', label: 'Requests', icon: Inbox },
    { to: '/knowledge', label: 'Knowledge & Learning', icon: Books },
    { to: '/help', label: 'Help Desk', icon: LifeBuoy },
  ] },
  { label: 'Company', items: [
    { to: '/departments', label: 'Departments', icon: Building2 },
    { to: '/wellbeing', label: 'Health & Wellbeing', icon: HeartPulse },
  ] },
  { label: 'Management', items: [
    { to: '/admin', label: 'Admin Workspace', icon: LayoutGrid, depts: adminDepts },
  ] },
]

export const canAccess = (item, user) => !item.depts || item.depts.includes(user.dept)

export const navFor = (user) =>
  navGroups.map((g) => ({ ...g, items: g.items.filter((i) => canAccess(i, user)) })).filter((g) => g.items.length)

export const navItem = (to) => navGroups.flatMap((g) => g.items).find((i) => i.to === to)
