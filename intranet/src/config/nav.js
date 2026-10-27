import { BookOpen, Building2, CalendarDays, FileText, LayoutDashboard, Newspaper, ShieldCheck, Users } from 'lucide-react'

// Single source for the sidebar, search and route access.
// `depts` limits an item to those departments; omit it for everyone.
export const navGroups = [
  { label: 'Workspace', items: [
    { to: '/', label: 'Home', icon: LayoutDashboard, end: true },
    { to: '/news', label: 'News', icon: Newspaper },
    { to: '/events', label: 'Events', icon: CalendarDays },
  ] },
  { label: 'Company', items: [
    { to: '/departments', label: 'Departments', icon: Building2 },
    { to: '/people', label: 'People', icon: Users },
    { to: '/learning', label: 'Learning', icon: BookOpen },
  ] },
  { label: 'Tools', items: [
    { to: '/docs', label: 'Docs & HR', icon: FileText },
    { to: '/claims', label: 'Claims & Policy', icon: ShieldCheck, depts: ['Claims', 'Underwriting'] },
  ] },
]

export const canAccess = (item, user) => !item.depts || item.depts.includes(user.dept)

export const navFor = (user) =>
  navGroups.map((g) => ({ ...g, items: g.items.filter((i) => canAccess(i, user)) })).filter((g) => g.items.length)

export const navItem = (to) => navGroups.flatMap((g) => g.items).find((i) => i.to === to)
