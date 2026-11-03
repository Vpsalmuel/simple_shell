import { MedalIcon as Award, BookOpenIcon as BookOpen, BuildingsIcon as Building2, CalendarDotsIcon as CalendarDays, FileTextIcon as FileText, GiftIcon as Gift, GraduationCapIcon as GraduationCap, HeartbeatIcon as HeartPulse, TrayIcon as Inbox, SquaresFourIcon as LayoutDashboard, GridFourIcon as LayoutGrid, LifebuoyIcon as LifeBuoy, NewspaperIcon as Newspaper, ConfettiIcon as PartyPopper, ShieldCheckIcon as ShieldCheck, UsersIcon as Users } from '@phosphor-icons/react'

// Departments whose staff can open the Admin Workspace.
export const adminDepts = ['HR', 'IT', 'Brand & Communications', 'Executive Office']

// Single source for the sidebar, search and route access.
// `depts` limits an item to those departments; omit it for everyone.
export const navGroups = [
  { label: 'Workspace', items: [
    { to: '/', label: 'Home', icon: LayoutDashboard, end: true },
    { to: '/news', label: 'News', icon: Newspaper },
    { to: '/events', label: 'Events', icon: CalendarDays },
    { to: '/milestones', label: 'Milestones', icon: Award },
  ] },
  { label: 'Work', items: [
    { to: '/requests', label: 'Request Centre', icon: Inbox },
    { to: '/docs', label: 'Docs & HR', icon: FileText },
  ] },
  { label: 'Knowledge', items: [
    { to: '/knowledge', label: 'Knowledge Center', icon: BookOpen },
    { to: '/learning', label: 'Learning', icon: GraduationCap },
    { to: '/help', label: 'Help Desk', icon: LifeBuoy },
  ] },
  { label: 'Company', items: [
    { to: '/departments', label: 'Departments', icon: Building2 },
    { to: '/people', label: 'People', icon: Users },
    { to: '/celebrations', label: 'Celebrations', icon: PartyPopper },
  ] },
  { label: 'You', items: [
    { to: '/wellbeing', label: 'Health & Wellbeing', icon: HeartPulse },
    { to: '/rewards', label: 'Rewards & Benefits', icon: Gift },
  ] },
  { label: 'Management', items: [
    { to: '/admin', label: 'Admin Workspace', icon: LayoutGrid, depts: adminDepts },
  ] },
]

export const canAccess = (item, user) => !item.depts || item.depts.includes(user.dept)

export const navFor = (user) =>
  navGroups.map((g) => ({ ...g, items: g.items.filter((i) => canAccess(i, user)) })).filter((g) => g.items.length)

export const navItem = (to) => navGroups.flatMap((g) => g.items).find((i) => i.to === to)
