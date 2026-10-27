import { Activity, Building2, BarChart3, Calculator, Car, Circle, FileStack, Flame, GraduationCap, HardHat, Headphones, HeartHandshake, Inbox, Landmark, LayoutGrid, LifeBuoy, Lightbulb, Lock, Luggage, Megaphone, MessageSquareWarning, Palette, Plane, Receipt, Scale, ScanSearch, ShieldCheck, Sprout, Target, UserPlus, Users, Wallet, Zap } from 'lucide-react'

// Lets data files reference icons by name. Add new icons here to keep the bundle small.
const icons = { Activity, Building2, BarChart3, Calculator, Car, FileStack, Flame, GraduationCap, HardHat, Headphones, HeartHandshake, Inbox, Landmark, LayoutGrid, LifeBuoy, Lightbulb, Lock, Luggage, Megaphone, MessageSquareWarning, Palette, Plane, Receipt, Scale, ScanSearch, ShieldCheck, Sprout, Target, UserPlus, Users, Wallet, Zap }

export default function Icon({ name, ...props }) {
  const Cmp = icons[name] ?? Circle
  return <Cmp {...props} />
}
