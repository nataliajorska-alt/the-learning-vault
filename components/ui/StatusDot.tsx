import type { TopicStatus } from "@/lib/types";
import { Check } from "lucide-react";

interface Props {
  status: TopicStatus;
}

export function StatusDot({ status }: Props) {
  if (status === "mastered") {
    return <Check className="w-3.5 h-3.5 text-gold stroke-[2]" />;
  }
  const color =
    status === "due"
      ? "bg-gold"
      : status === "struggling"
      ? "bg-danger"
      : "bg-forest";
  return <span className={`dot ${color}`} aria-label={status} />;
}
