/**
 * Разрез скважины — фирменный элемент раздела «Бурение».
 * Параметры в метрах: depth — забой, steel — низ стальной колонны (0 = одна колонна), water — статический уровень.
 * Рисуется чистым SVG в палитре сайта, масштабируется по ширине контейнера.
 */
export default function WellScheme({
  depth = 52, steel = 28, water, kesson = true, title, className = "",
  labels = { steel: "Сталь Ø159", plastic: "Пластик Ø125", h1: "1-й горизонт", h2: "2-й горизонт", h3: "рабочий горизонт" },
}: {
  depth?: number; steel?: number; water?: number; kesson?: boolean; title?: string; className?: string;
  labels?: { steel?: string; plastic?: string; h1?: string; h2?: string; h3?: string };
}) {
  const W = 420, TOP = 60, BOT = 560, H = BOT - TOP;
  const m = (d: number) => TOP + (d / depth) * H; // метры → y
  const cx = 150;
  const wl = water ?? Math.round(depth * 0.38);
  const steelBot = steel > 0 ? Math.min(steel, depth) : 0;
  const strata = [
    { from: 0, to: depth * 0.12, fill: "#E9E4DC", name: "почва, суглинок" },
    { from: depth * 0.12, to: depth * 0.34, fill: "#DCE6EE", name: labels.h1 },
    { from: depth * 0.34, to: depth * 0.52, fill: "#E3DFDF", name: "глина" },
    { from: depth * 0.52, to: depth * 0.72, fill: "#D5E2EC", name: labels.h2 },
    { from: depth * 0.72, to: depth * 0.84, fill: "#E3DFDF", name: "плотный суглинок" },
    { from: depth * 0.84, to: depth, fill: "#C9DBE8", name: labels.h3 },
  ];
  const ticks: number[] = [];
  const step = depth > 90 ? 20 : 10;
  for (let d = step; d < depth; d += step) ticks.push(d);
  return (
    <svg viewBox={`0 0 ${W} ${BOT + 40}`} className={`w-full h-auto ${className}`} role="img" aria-label={title || `Разрез скважины ${depth} м`} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="ws-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="6" stroke="#24262F" strokeWidth="1.2" /></pattern>
        <pattern id="ws-gravel" width="10" height="10" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="1.3" fill="#9AA9B8" /><circle cx="8" cy="7" r="1" fill="#9AA9B8" /></pattern>
      </defs>
      {/* грунты */}
      {strata.map((s, i) => (
        <g key={i}>
          <rect x="0" y={m(s.from)} width={W - 70} height={Math.max(0, m(s.to) - m(s.from))} fill={s.fill} />
          {/^(1|2|раб)/.test(String(s.name)) && <rect x="0" y={m(s.from)} width={W - 70} height={Math.max(0, m(s.to) - m(s.from))} fill="url(#ws-gravel)" opacity=".7" />}
          {s.name && m(s.to) - m(s.from) > 22 && <text x={W - 78} y={m(s.from) + (m(s.to) - m(s.from)) / 2 + 4} fontSize="11" fill="#6B6E78" textAnchor="end">{s.name}</text>}
        </g>
      ))}
      {/* поверхность земли */}
      <line x1="0" y1={TOP} x2={W - 70} y2={TOP} stroke="#24262F" strokeWidth="2" />
      <text x="8" y={TOP - 8} fontSize="11" fill="#6B6E78">поверхность</text>
      {/* кессон */}
      {kesson && (
        <g>
          <rect x={cx - 48} y={TOP - 4} width="96" height={Math.max(28, m(Math.min(2.2, depth)) - TOP + 4)} fill="#FFFFFF" stroke="#24262F" strokeWidth="2" rx="3" />
          <rect x={cx - 20} y={TOP - 14} width="40" height="10" fill="#24262F" rx="2" />
          <text x={cx + 56} y={TOP + 16} fontSize="11" fill="#24262F">кессон, −2 м</text>
        </g>
      )}
      {/* стальная колонна */}
      {steelBot > 0 && (
        <g>
          <rect x={cx - 16} y={TOP} width="32" height={m(steelBot) - TOP} fill="#FFFFFF" stroke="#24262F" strokeWidth="3" />
          <line x1={cx + 24} y1={m(steelBot)} x2={cx + 90} y2={m(steelBot)} stroke="#24262F" strokeWidth="1" strokeDasharray="3 3" />
          <text x={cx + 94} y={m(steelBot) + 4} fontSize="12" fontWeight="700" fill="#24262F">{labels.steel} — {steelBot} м</text>
        </g>
      )}
      {/* пластиковая (или единственная) колонна */}
      <rect x={cx - 9} y={TOP} width="18" height={m(depth) - TOP} fill="#FFFFFF" stroke="#D90406" strokeWidth="2.5" />
      {/* фильтр */}
      <rect x={cx - 9} y={m(Math.max(0, depth - depth * 0.1))} width="18" height={m(depth) - m(Math.max(0, depth - depth * 0.1))} fill="url(#ws-hatch)" stroke="#D90406" strokeWidth="2.5" />
      <text x={cx + 20} y={m(depth) - 2} fontSize="11" fill="#6B6E78">фильтр</text>
      <line x1={cx + 24} y1={m(depth)} x2={cx + 90} y2={m(depth)} stroke="#D90406" strokeWidth="1" strokeDasharray="3 3" />
      <text x={cx + 94} y={m(depth) + 4} fontSize="12" fontWeight="700" fill="#D90406">{steelBot > 0 ? labels.plastic : "Обсадная колонна"} — {depth} м</text>
      {/* статический уровень */}
      <line x1={cx - 40} y1={m(wl)} x2={cx + 40} y2={m(wl)} stroke="#2F6FA8" strokeWidth="1.5" strokeDasharray="5 3" />
      <text x={cx - 44} y={m(wl) + 4} fontSize="11" fill="#2F6FA8" textAnchor="end">вода {wl} м</text>
      <rect x={cx - 7} y={m(wl)} width="14" height={m(depth) - m(wl) - 2} fill="#2F6FA8" opacity=".18" />
      {/* насос */}
      <rect x={cx - 6} y={m(Math.max(0, depth - depth * 0.2)) - 14} width="12" height="26" rx="2" fill="#24262F" />
      <text x={cx - 12} y={m(Math.max(0, depth - depth * 0.2))} fontSize="11" fill="#24262F" textAnchor="end">насос</text>
      <line x1={cx} y1={TOP} x2={cx} y2={m(Math.max(0, depth - depth * 0.2)) - 14} stroke="#24262F" strokeWidth="1" />
      {/* шкала глубин */}
      <line x1={W - 40} y1={TOP} x2={W - 40} y2={m(depth)} stroke="#24262F" strokeWidth="1" />
      {ticks.map((d) => (
        <g key={d}><line x1={W - 44} y1={m(d)} x2={W - 36} y2={m(d)} stroke="#24262F" /><text x={W - 30} y={m(d) + 4} fontSize="11" fill="#6B6E78">{d}</text></g>
      ))}
      <text x={W - 44} y={TOP - 8} fontSize="11" fill="#6B6E78">м</text>
      {title && <text x="8" y={BOT + 28} fontSize="12" fill="#24262F" fontWeight="600">{title}</text>}
    </svg>
  );
}
