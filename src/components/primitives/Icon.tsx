import {
  Bank,
  AirplaneTilt,
  AppWindow,
  Barbell,
  Bed,
  Bus,
  Car,
  CellTower,
  Flag,
  ForkKnife,
  HandHeart,
  HardHat,
  Lightning,
  Microphone,
  Plant,
  Scales,
  Scissors,
  Storefront,
  Umbrella,
  UserPlus,
  Wallet,
  Wrench,
  BookOpenText,
  ChartLineUp,
  EnvelopeSimple,
  Handshake,
  Info,
  Path,
  Quotes,
  SquaresFour,
  UsersThree,
  Briefcase,
  Buildings,
  ChartBar,
  Cloud,
  Code,
  Compass,
  DeviceMobile,
  Factory,
  FlowArrow,
  Globe,
  GraduationCap,
  Heartbeat,
  MagnifyingGlass,
  Megaphone,
  Palette,
  PenNib,
  Plugs,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Sparkle,
  Truck,
} from "@phosphor-icons/react/dist/ssr";
import type { ComponentType } from "react";
import type { IconProps } from "@phosphor-icons/react";
import type { IconName } from "@/lib/content/schema";

type PhosphorIcon = ComponentType<IconProps>;

/**
 * One icon set for the whole site: Phosphor, drawn as fine line icons (light weight by default).
 * Server-rendered SVG, sized by the surrounding type unless a size is given.
 */
const ICONS: Record<IconName, PhosphorIcon> = {
  code: Code,
  globe: Globe,
  phone: DeviceMobile,
  sparkles: Sparkle,
  workflow: FlowArrow,
  plug: Plugs,
  cloud: Cloud,
  shield: ShieldCheck,
  chart: ChartBar,
  cart: ShoppingCart,
  pen: PenNib,
  palette: Palette,
  search: MagnifyingGlass,
  megaphone: Megaphone,
  compass: Compass,
  health: Heartbeat,
  finance: Bank,
  building: Buildings,
  truck: Truck,
  factory: Factory,
  bag: ShoppingBag,
  education: GraduationCap,
  briefcase: Briefcase,
  quote: Quotes,
  handshake: Handshake,
  users: UsersThree,
  book: BookOpenText,
  mail: EnvelopeSimple,
  info: Info,
  steps: Path,
  growth: ChartLineUp,
  grid: SquaresFour,
  fitness: Barbell,
  beauty: Scissors,
  wallet: Wallet,
  umbrella: Umbrella,
  hardhat: HardHat,
  energy: Lightning,
  wrench: Wrench,
  food: ForkKnife,
  hotel: Bed,
  travel: AirplaneTilt,
  store: Storefront,
  car: Car,
  bus: Bus,
  plant: Plant,
  legal: Scales,
  media: Microphone,
  charity: HandHeart,
  flag: Flag,
  app: AppWindow,
  tower: CellTower,
  hire: UserPlus,
};

export function Icon({
  name,
  className = "",
  weight = "light",
}: {
  name: IconName;
  className?: string;
  weight?: "thin" | "light" | "regular" | "duotone";
}) {
  const Glyph = ICONS[name];
  return (
    <Glyph
      aria-hidden="true"
      focusable="false"
      weight={weight}
      className={`icon ${className}`.trim()}
    />
  );
}
