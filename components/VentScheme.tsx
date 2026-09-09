/**
 * Схема воздухообмена частного дома — фирменный элемент раздела «Вентиляция» (v32).
 * Чистый SVG в палитре сайта: разрез дома в два этажа, установка с рекуперацией на чердаке,
 * приток в спальни и гостиную (синий), вытяжка из санузлов, кухни и котельной (красный),
 * забор и выброс на кровле. highlight — какой узел подсветить под тему страницы.
 */
export type VentHighlight = "unit" | "supply" | "exhaust" | "valve" | "bath" | "kitchen" | "boiler" | "attic" | "all";

export default function VentScheme({ highlight = "all", title, className = "", recuperator = true }: { highlight?: VentHighlight; title?: string; className?: string; recuperator?: boolean }) {
  const W = 520, H = 580;
  const INK = "#24262F", MUTED = "#6B6E78", LINE = "#C9C5C5", BRAND = "#D90406", BG = "#F8F8F8", SUP = "#2F6FDB", EXH = "#D90406";
  const on = (k: VentHighlight) => highlight === "all" || highlight === k;
  const sup = (k: VentHighlight) => (on(k) ? SUP : LINE);
  const exh = (k: VentHighlight) => (on(k) ? EXH : LINE);
  const arrow = (x: number, y: number, dir: 1 | -1, color: string) => <path d={`M ${x - 6} ${y} l 12 0 l -6 ${7 * dir} z`} fill={color} />;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={`w-full h-auto ${className}`} role="img" aria-label={title || "Схема вентиляции частного дома с рекуперацией"} xmlns="http://www.w3.org/2000/svg" fontFamily="Inter Tight, Arial, sans-serif">
      <rect x="0" y="0" width={W} height={H} rx="16" fill={BG} />
      {/* контур дома */}
      <path d="M 40 210 L 260 70 L 480 210 L 480 520 L 40 520 Z" fill="#FFFFFF" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <line x1="40" y1="210" x2="480" y2="210" stroke={INK} strokeWidth="2" />
      <line x1="40" y1="365" x2="480" y2="365" stroke={INK} strokeWidth="2" />
      <line x1="260" y1="210" x2="260" y2="520" stroke={LINE} strokeWidth="2" strokeDasharray="6 6" />
      <line x1="150" y1="365" x2="150" y2="520" stroke={LINE} strokeWidth="2" strokeDasharray="6 6" />
      <line x1="370" y1="210" x2="370" y2="365" stroke={LINE} strokeWidth="2" strokeDasharray="6 6" />
      {/* подписи помещений */}
      <text x="150" y="240" fontSize="12" fill={MUTED} textAnchor="middle">спальня</text>
      <text x="315" y="240" fontSize="12" fill={MUTED} textAnchor="middle">спальня</text>
      <text x="425" y="240" fontSize="12" fill={on("bath") ? BRAND : MUTED} textAnchor="middle" fontWeight={on("bath") ? 700 : 400}>санузел</text>
      <text x="82" y="395" fontSize="12" fill={on("boiler") ? BRAND : MUTED} textAnchor="middle" fontWeight={on("boiler") ? 700 : 400}>котельная</text>
      <text x="205" y="395" fontSize="12" fill={on("kitchen") ? BRAND : MUTED} textAnchor="middle" fontWeight={on("kitchen") ? 700 : 400}>кухня</text>
      <text x="370" y="395" fontSize="12" fill={MUTED} textAnchor="middle">гостиная</text>
      {/* чердак: установка */}
      <rect x="196" y="124" width="128" height="64" rx="8" fill={on("unit") ? "#FDECEC" : "#FFFFFF"} stroke={on("unit") ? BRAND : INK} strokeWidth="2" />
      <text x="260" y="148" fontSize="11" fill={on("unit") ? BRAND : INK} textAnchor="middle" fontWeight="700">{recuperator ? "приточно-вытяжная" : "вытяжная"}</text>
      <text x="260" y="163" fontSize="11" fill={on("unit") ? BRAND : INK} textAnchor="middle" fontWeight="700">{recuperator ? "установка Turkov" : "установка"}</text>
      <text x="260" y="178" fontSize="10" fill={MUTED} textAnchor="middle">{recuperator ? "рекуперация до 80%" : "канальные вентиляторы"}</text>
      <text x="260" y="112" fontSize="11" fill={on("attic") ? BRAND : MUTED} textAnchor="middle">чердак</text>
      {/* забор и выброс на кровле */}
      <g stroke={sup("unit")} strokeWidth="3" fill="none"><path d="M 196 150 L 150 150 L 120 160" /></g>
      <circle cx="118" cy="161" r="6" fill="none" stroke={sup("unit")} strokeWidth="2.5" />
      <text x="112" y="180" fontSize="10" fill={MUTED} textAnchor="end">забор, фильтр F7</text>
      <g stroke={exh("unit")} strokeWidth="3" fill="none"><path d="M 324 150 L 372 150 L 400 160" /></g>
      <circle cx="402" cy="161" r="6" fill="none" stroke={exh("unit")} strokeWidth="2.5" />
      <text x="410" y="180" fontSize="10" fill={MUTED}>выброс</text>
      {/* приток: в спальни и гостиную */}
      <g stroke={sup("supply")} strokeWidth="3" fill="none" strokeLinecap="round">
        <path d="M 230 188 L 230 200 L 150 200 L 150 255" />
        <path d="M 230 200 L 315 200 L 315 255" />
        <path d="M 150 200 L 60 200 L 60 350 L 60 372 L 300 372 L 370 372 L 370 410" />
      </g>
      {[[150, 262], [315, 262], [370, 417]].map(([x, y]) => (
        <g key={x + "-" + y}>
          <rect x={x - 16} y={y - 6} width="32" height="10" rx="3" fill={sup("supply")} />
          {arrow(x, y + 14, 1, sup("supply"))}
          <text x={x} y={y + 42} fontSize="10" fill={sup("supply")} textAnchor="middle">приток</text>
        </g>
      ))}
      {/* вытяжка: санузел, кухня, котельная */}
      <g stroke={exh("exhaust")} strokeWidth="3" fill="none" strokeLinecap="round">
        <path d="M 290 188 L 290 196 L 425 196 L 425 255" />
        <path d="M 425 196 L 460 196 L 460 380 L 205 380 L 205 410" />
        <path d="M 205 380 L 128 380 L 128 410" />
      </g>
      {[[425, 262, "bath"], [205, 417, "kitchen"], [128, 417, "boiler"]].map(([x, y, k]) => (
        <g key={String(k)}>
          <rect x={Number(x) - 16} y={Number(y) - 6} width="32" height="10" rx="3" fill={exh(k as VentHighlight)} />
          {arrow(Number(x), Number(y) - 14, -1, exh(k as VentHighlight))}
          <text x={Number(x)} y={Number(y) + 22} fontSize="10" fill={exh(k as VentHighlight)} textAnchor="middle">вытяжка</text>
        </g>
      ))}
      {/* приточный клапан в стене спальни */}
      <rect x="36" y="290" width="10" height="26" rx="2" fill={on("valve") ? "#FDECEC" : "#fff"} stroke={on("valve") ? BRAND : INK} strokeWidth="2" />
      <text x="52" y="310" fontSize="10" fill={on("valve") ? BRAND : MUTED}>клапан / бризер</text>
      {/* легенда */}
      <g fontSize="11" fill={INK}>
        <rect x="40" y="540" width="18" height="6" rx="2" fill={SUP} /><text x="64" y="546">приток — свежий, подогретый</text>
        <text x="40" y="566" fontSize="10" fill={MUTED}>воздуховоды на чердаке — в утеплении 50 мм, шумоглушители на притоке и вытяжке</text>
        <rect x="280" y="540" width="18" height="6" rx="2" fill={EXH} /><text x="304" y="546">вытяжка — влага, запахи, CO₂</text>
      </g>
      <text x="260" y="40" fontSize="13" fill={INK} textAnchor="middle" fontWeight="700">Воздухообмен дома 120–180 м²: 250–350 м³/ч</text>
    </svg>
  );
}

/** Вариант схемы по slug услуги */
export const VENT_SCHEME_BY_SLUG: Record<string, { highlight: VentHighlight; recuperator?: boolean }> = {
  "ventilyaciya-v-chastnom-dome": { highlight: "all" },
  "pritochnaya-ventilyaciya": { highlight: "supply" },
  "vytyazhnaya-ventilyaciya": { highlight: "exhaust", recuperator: false },
  "prinuditelnaya-ventilyaciya": { highlight: "unit" },
  "pritochno-vytyazhnaya-ventilyaciya-s-rekuperaciej": { highlight: "unit" },
  "ventilyaciya-v-vannoj-i-sanuzle": { highlight: "bath", recuperator: false },
  "ventilyaciya-karkasnogo-doma": { highlight: "attic" },
  "montazh-ventilyacii": { highlight: "all" },
};
