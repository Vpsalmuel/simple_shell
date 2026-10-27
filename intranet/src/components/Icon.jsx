import { Activity, BarChart3, Calculator, Circle, FileStack, GraduationCap, Headphones, HeartHandshake, Landmark, LifeBuoy, Lightbulb, Lock, MessageSquareWarning, Receipt, Scale, ScanSearch, ShieldCheck, Target, UserPlus, Users, Wallet } from 'lucide-react'

// Lets data files reference icons by name. Add new icons here to keep the bundle small.
const icons = { Activity, BarChart3, Calculator, FileStack, GraduationCap, Headphones, HeartHandshake, Landmark, LifeBuoy, Lightbulb, Lock, MessageSquareWarning, Receipt, Scale, ScanSearch, ShieldCheck, Target, UserPlus, Users, Wallet }

export default function Icon({ name, ...props }) {
  const Cmp = icons[name] ?? Circle
  return <Cmp {...props} />
}
