import {
  Globe,
  Brain,
  Palette,
  Landmark,
  TrendingUp,
  Wine,
  Music,
  Spade,
  Crown,
  Plane,
  FileSpreadsheet,
  Languages,
  BookOpen,
} from "lucide-react";

const map: Record<string, React.ComponentType<{ className?: string }>> = {
  Globe,
  Brain,
  Palette,
  Landmark,
  TrendingUp,
  Wine,
  Music,
  Spade,
  Crown,
  Plane,
  FileSpreadsheet,
  Languages,
};

export function VaultIcon({
  name,
  className = "w-5 h-5 stroke-[1.5]",
}: {
  name: string;
  className?: string;
}) {
  const Icon = map[name] ?? BookOpen;
  return <Icon className={className} />;
}
