import {
  BarChart3,
  Briefcase,
  Building2,
  Cloud,
  Code2,
  Compass,
  Factory,
  Globe,
  GraduationCap,
  HeartPulse,
  Landmark,
  Megaphone,
  Palette,
  PenTool,
  Plug,
  Search,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Smartphone,
  Sparkles,
  Truck,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import type { IconName } from "@/lib/content/schema";

/** One icon set for the whole site: lucide, 1.75 stroke, sized by the surrounding type. */
const ICONS: Record<IconName, LucideIcon> = {
  code: Code2,
  globe: Globe,
  phone: Smartphone,
  sparkles: Sparkles,
  workflow: Workflow,
  plug: Plug,
  cloud: Cloud,
  shield: ShieldCheck,
  chart: BarChart3,
  cart: ShoppingCart,
  pen: PenTool,
  palette: Palette,
  search: Search,
  megaphone: Megaphone,
  compass: Compass,
  health: HeartPulse,
  finance: Landmark,
  building: Building2,
  truck: Truck,
  factory: Factory,
  bag: ShoppingBag,
  education: GraduationCap,
  briefcase: Briefcase,
};

export function Icon({ name, className = "" }: { name: IconName; className?: string }) {
  const Glyph = ICONS[name];
  return (
    <Glyph
      aria-hidden="true"
      focusable="false"
      strokeWidth={1.75}
      className={`icon ${className}`.trim()}
    />
  );
}
