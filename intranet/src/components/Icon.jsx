import { Calculator, Circle, FileStack, GraduationCap, Landmark, LifeBuoy, Receipt, Scale, ScanSearch, ShieldCheck, Wallet } from 'lucide-react'

// Lets data files reference icons by name. Add new icons here to keep the bundle small.
const icons = { Calculator, FileStack, GraduationCap, Landmark, LifeBuoy, Receipt, Scale, ScanSearch, ShieldCheck, Wallet }

export default function Icon({ name, ...props }) {
  const Cmp = icons[name] ?? Circle
  return <Cmp {...props} />
}
