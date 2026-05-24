interface Props {
  day?: string;
  month?: string;
  year?: string;
  weekday?: string;
  time?: string;
  rotate?: number;
  label?: string;
}

const MONTHS_PL = [
  "STY", "LUT", "MAR", "KWI", "MAJ", "CZE",
  "LIP", "SIE", "WRZ", "PAŹ", "LIS", "GRU",
];

const WEEKDAYS_PL = [
  "NIEDZIELA", "PONIEDZIAŁEK", "WTOREK", "ŚRODA",
  "CZWARTEK", "PIĄTEK", "SOBOTA",
];

function defaults() {
  const d = new Date();
  return {
    day: String(d.getDate()).padStart(2, "0"),
    month: MONTHS_PL[d.getMonth()],
    year: String(d.getFullYear()),
    weekday: WEEKDAYS_PL[d.getDay()],
    time: `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`,
  };
}

export function DateStamp({
  day,
  month,
  year,
  weekday,
  time,
  rotate = -3,
  label = "Czytelnia",
}: Props) {
  const def = defaults();
  return (
    <div
      className="inline-flex items-center"
      style={{
        transform: `rotate(${rotate}deg)`,
        color: "#8B2E1F",
        opacity: 0.88,
      }}
      aria-hidden
    >
      <div
        className="flex flex-col items-center justify-center"
        style={{
          border: "2.5px solid #8B2E1F",
          padding: "6px 14px 4px",
          fontFamily:
            '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
          textTransform: "uppercase",
        }}
      >
        <div style={{ fontSize: 9, letterSpacing: "0.28em", marginBottom: 2 }}>
          {label}
        </div>
        <div className="flex items-baseline gap-2">
          <span
            style={{ fontSize: 22, fontWeight: 700, letterSpacing: "0.04em" }}
          >
            {day ?? def.day}
          </span>
          <span
            style={{ fontSize: 11, letterSpacing: "0.2em", fontWeight: 600 }}
          >
            {month ?? def.month}
          </span>
          <span style={{ fontSize: 11, letterSpacing: "0.16em" }}>
            {year ?? def.year}
          </span>
        </div>
        <div style={{ fontSize: 8, letterSpacing: "0.32em", marginTop: 3 }}>
          {weekday ?? def.weekday} · {time ?? def.time}
        </div>
      </div>
    </div>
  );
}
