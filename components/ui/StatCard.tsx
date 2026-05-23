interface Props {
  label: string;
  value: string | number;
  hint?: string;
}

export function StatCard({ label, value, hint }: Props) {
  return (
    <div className="brass-plaque">
      <div className="brass-label">{label}</div>
      <div className="brass-value">{value}</div>
      {hint && <div className="brass-hint">{hint}</div>}
    </div>
  );
}
