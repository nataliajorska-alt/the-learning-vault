interface Props {
  label: string;
  value: string | number;
  hint?: string;
}

export function StatCard({ label, value, hint }: Props) {
  return (
    <div className="card">
      <div className="eyebrow">{label}</div>
      <div className="hero-italic text-4xl mt-3 text-ink">{value}</div>
      {hint && <div className="text-xs text-muted mt-2">{hint}</div>}
    </div>
  );
}
