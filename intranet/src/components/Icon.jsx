import { Activity, Award, BarChart3, Brain, Building2, Calculator, Car, Circle, DoorOpen, Dumbbell, FileStack, Flame, GraduationCap, HardHat, Headphones, HeartHandshake, Inbox, Landmark, LayoutGrid, LifeBuoy, Lightbulb, Lock, Luggage, Megaphone, MessageSquareWarning, Palette, Plane, Receipt, Scale, ScanSearch, ScrollText, ShieldCheck, Ship, Sprout, Stethoscope, Target, TrendingUp, Trophy, UserPlus, Users, Wallet, Zap } from 'lucide-react'

// Lets data files reference icons by name. Add new icons here to keep the bundle small.
const icons = { Activity, Award, BarChart3, Brain, Building2, Calculator, Car, DoorOpen, Dumbbell, FileStack, Flame, GraduationCap, HardHat, Headphones, HeartHandshake, Inbox, Landmark, LayoutGrid, LifeBuoy, Lightbulb, Lock, Luggage, Megaphone, MessageSquareWarning, Palette, Plane, Receipt, Scale, ScanSearch, ScrollText, ShieldCheck, Ship, Sprout, Stethoscope, Target, TrendingUp, Trophy, UserPlus, Users, Wallet, Zap }

export default function Icon({ name, ...props }) {
  const Cmp = icons[name] ?? Circle
  return <Cmp {...props} />
}
