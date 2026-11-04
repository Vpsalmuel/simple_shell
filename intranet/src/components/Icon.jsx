import {
  PulseIcon, MedalIcon, ChartBarIcon, BrainIcon, BuildingsIcon, CalculatorIcon, CarIcon, CircleIcon, DesktopIcon, DoorOpenIcon,
  BarbellIcon, EnvelopeSimpleIcon, FilesIcon, FireIcon, GraduationCapIcon, HardHatIcon, HeadphonesIcon, HandHeartIcon, TrayIcon,
  KanbanIcon, BankIcon, GridFourIcon, LifebuoyIcon, LightbulbIcon, LockIcon, SuitcaseIcon, MegaphoneIcon, ChatCenteredTextIcon,
  PaletteIcon, AirplaneIcon, ReceiptIcon, ScalesIcon, ScanIcon, ScrollIcon, ShieldCheckIcon, BoatIcon, PlantIcon, StethoscopeIcon,
  TargetIcon, TrendUpIcon, TrophyIcon, UserPlusIcon, UsersIcon, WalletIcon, LightningIcon,
} from '@phosphor-icons/react'

// Lets data files reference icons by name (Phosphor icons). Add new icons here to keep the bundle small.
const icons = {
  Activity: PulseIcon, Award: MedalIcon, BarChart3: ChartBarIcon, Brain: BrainIcon, Building2: BuildingsIcon, Calculator: CalculatorIcon,
  Car: CarIcon, Desktop: DesktopIcon, DoorOpen: DoorOpenIcon, Dumbbell: BarbellIcon, FileStack: FilesIcon, Flame: FireIcon,
  GraduationCap: GraduationCapIcon, HardHat: HardHatIcon, Headphones: HeadphonesIcon, HeartHandshake: HandHeartIcon, Inbox: TrayIcon,
  Kanban: KanbanIcon, Landmark: BankIcon, LayoutGrid: GridFourIcon, LifeBuoy: LifebuoyIcon, Lightbulb: LightbulbIcon, Lock: LockIcon,
  Luggage: SuitcaseIcon, Mail: EnvelopeSimpleIcon, Megaphone: MegaphoneIcon, MessageSquareWarning: ChatCenteredTextIcon, Palette: PaletteIcon,
  Plane: AirplaneIcon, Receipt: ReceiptIcon, Scale: ScalesIcon, ScanSearch: ScanIcon, ScrollText: ScrollIcon, ShieldCheck: ShieldCheckIcon,
  Ship: BoatIcon, Sprout: PlantIcon, Stethoscope: StethoscopeIcon, Target: TargetIcon, TrendingUp: TrendUpIcon, Trophy: TrophyIcon,
  UserPlus: UserPlusIcon, Users: UsersIcon, Wallet: WalletIcon, Zap: LightningIcon,
}

export default function Icon({ name, ...props }) {
  const Cmp = icons[name] ?? CircleIcon
  return <Cmp {...props} />
}
