/**
 * Однолинейная схема электрики частного дома — фирменный элемент раздела «Электрика».
 * Рисуется чистым SVG в палитре сайта: опора → ввод → щит учёта → распределительный щит → группы → заземление.
 * highlight — какой узел подсветить красным под тему страницы; groups — подписи групп; avr — добавить блок АВР с генератором.
 */
export type SchemeHighlight = "panel" | "entry" | "meter" | "ground" | "spd" | "relay" | "avr" | "groups" | "light" | "heating";

const DEFAULT_GROUPS = ["Электрокотёл 9 кВт", "Тёплый пол", "Бойлер", "Кухня", "Розетки 1 эт.", "Розетки 2 эт.", "Свет", "Улица, баня"];

export default function ElectroScheme({
  highlight = "panel", groups = DEFAULT_GROUPS, avr = false, phases = 3, title, className = "",
}: { highlight?: SchemeHighlight; groups?: string[]; avr?: boolean; phases?: 1 | 3; title?: string; className?: string }) {
  const W = 520, H = 580;
  const INK = "#24262F", MUTED = "#6B6E78", LINE = "#C9C5C5", BRAND = "#D90406", BG = "#F8F8F8";
  const hot = (k: SchemeHighlight) => (highlight === k ? BRAND : INK);
  const hotFill = (k: SchemeHighlight) => (highlight === k ? "#FDECEC" : "#FFFFFF");
  const g = groups.slice(0, 8);
  const cols = 4, rows = Math.ceil(g.length / cols);
  const gx0 = 40, gy0 = 380, gw = 88, gh = 64, ggap = 8;
  const busY = 350;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={`w-full h-auto ${className}`} role="img" aria-label={title || "Однолинейная схема электрики частного дома"} xmlns="http://www.w3.org/2000/svg" fontFamily="Inter Tight, Arial, sans-serif">
      <rect x="0" y="0" width={W} height={H} rx="16" fill={BG} />

      {/* опора и ввод */}
      <g stroke={hot("entry")} strokeWidth="3" fill="none" strokeLinecap="round">
        <line x1="48" y1="40" x2="48" y2="150" />
        <line x1="28" y1="52" x2="68" y2="52" />
        <line x1="36" y1="64" x2="60" y2="64" />
      </g>
      <circle cx="48" cy="150" r="5" fill={hot("entry")} />
      <text x="48" y="172" fontSize="11" fill={MUTED} textAnchor="middle">опора</text>
      <text x="48" y="186" fontSize="11" fill={MUTED} textAnchor="middle">сетевой</text>
      <path d="M 52 60 C 140 75, 200 70, 236 88" stroke={hot("entry")} strokeWidth="2.5" fill="none" />
      <text x="146" y="60" fontSize="12" fill={hot("entry")} fontWeight="700">СИП {phases === 3 ? "4×16" : "2×16"} · {phases === 3 ? "380 В, 15 кВт" : "220 В"}</text>

      {/* щит учёта */}
      <rect x="236" y="66" width="128" height="88" rx="8" fill={hotFill("meter")} stroke={hot("meter")} strokeWidth="2" />
      <text x="300" y="86" fontSize="11" fill={MUTED} textAnchor="middle">щит учёта</text>
      <rect x="250" y="96" width="42" height="24" rx="4" fill="#fff" stroke={INK} strokeWidth="1.5" />
      <text x="271" y="112" fontSize="10" fill={INK} textAnchor="middle" fontWeight="700">kWh</text>
      <rect x="302" y="96" width="24" height="24" rx="4" fill="#fff" stroke={INK} strokeWidth="1.5" />
      <text x="314" y="112" fontSize="10" fill={INK} textAnchor="middle" fontWeight="700">25</text>
      <rect x="332" y="96" width="20" height="24" rx="4" fill={hotFill("spd")} stroke={hot("spd")} strokeWidth="1.5" />
      <text x="342" y="112" fontSize="8" fill={hot("spd")} textAnchor="middle" fontWeight="700">SPD</text>
      <text x="300" y="140" fontSize="10" fill={MUTED} textAnchor="middle">счётчик · автомат · УЗИП</text>

      {/* дом и ввод в щит */}
      <path d="M 300 154 L 300 196" stroke={INK} strokeWidth="2.5" />
      <text x="308" y="180" fontSize="11" fill={MUTED}>ввод в дом, гильза</text>

      {/* распределительный щит */}
      <rect x="40" y="196" width="400" height="330" rx="14" fill="#fff" stroke={hot("panel")} strokeWidth="2.5" />
      <text x="56" y="220" fontSize="13" fill={hot("panel")} fontWeight="800">Распределительный щит {phases === 3 ? "380 В" : "220 В"}</text>

      {/* вводная цепочка: автомат → реле напряжения → (АВР) → шина */}
      <rect x="56" y="240" width="84" height="44" rx="8" fill="#fff" stroke={INK} strokeWidth="1.8" />
      <text x="98" y="258" fontSize="11" fill={INK} textAnchor="middle" fontWeight="700">вводной</text>
      <text x="98" y="273" fontSize="11" fill={INK} textAnchor="middle" fontWeight="700">автомат {phases === 3 ? "3P" : "1P"}</text>

      <rect x="150" y="240" width="108" height="44" rx="8" fill={hotFill("relay")} stroke={hot("relay")} strokeWidth="1.8" />
      <text x="204" y="258" fontSize="10.5" fill={hot("relay")} textAnchor="middle" fontWeight="700">реле напряжения</text>
      <text x="204" y="273" fontSize="10" fill={MUTED} textAnchor="middle">170–250 В{phases === 3 ? ", по фазам" : ""}</text>

      {avr ? (
        <>
          <rect x="268" y="240" width="70" height="44" rx="8" fill={hotFill("avr")} stroke={hot("avr")} strokeWidth="1.8" />
          <text x="303" y="258" fontSize="11" fill={hot("avr")} textAnchor="middle" fontWeight="700">АВР</text>
          <text x="303" y="273" fontSize="10" fill={MUTED} textAnchor="middle">автозапуск</text>
          <rect x="350" y="232" width="74" height="60" rx="8" fill="#fff" stroke={hot("avr")} strokeWidth="1.8" strokeDasharray="4 3" />
          <text x="387" y="256" fontSize="11" fill={hot("avr")} textAnchor="middle" fontWeight="700">генератор</text>
          <text x="387" y="271" fontSize="10" fill={MUTED} textAnchor="middle">6–8 кВт</text>
          <line x1="338" y1="262" x2="350" y2="262" stroke={hot("avr")} strokeWidth="1.8" />
        </>
      ) : (
        <>
          <rect x="268" y="240" width="72" height="44" rx="8" fill="#fff" stroke={INK} strokeWidth="1.8" />
          <text x="304" y="258" fontSize="11" fill={INK} textAnchor="middle" fontWeight="700">УЗО 30 мА</text>
          <text x="304" y="273" fontSize="9.5" fill={MUTED} textAnchor="middle">противопожарное</text>
          <rect x="350" y="240" width="74" height="44" rx="8" fill={hotFill("heating")} stroke={hot("heating")} strokeWidth="1.8" />
          <text x="387" y="258" fontSize="11" fill={hot("heating")} textAnchor="middle" fontWeight="700">контактор</text>
          <text x="387" y="273" fontSize="10" fill={MUTED} textAnchor="middle">котёл · Zont</text>
        </>
      )}
      <line x1="140" y1="262" x2="150" y2="262" stroke={INK} strokeWidth="1.8" />
      <line x1="258" y1="262" x2="268" y2="262" stroke={INK} strokeWidth="1.8" />
      <line x1="300" y1="196" x2="300" y2="232" stroke={INK} strokeWidth="2.5" />
      <line x1="98" y1="232" x2="300" y2="232" stroke={INK} strokeWidth="2.5" />
      <line x1="98" y1="232" x2="98" y2="240" stroke={INK} strokeWidth="2.5" />

      {/* шины фаз */}
      {(phases === 3 ? ["L1", "L2", "L3"] : ["L"]).map((l, i) => {
        const y = busY - 22 + i * 9;
        return (
          <g key={l}>
            <line x1="72" y1={y} x2="424" y2={y} stroke={hot("groups")} strokeWidth={i === 0 ? 2.5 : 1.5} opacity={i === 0 ? 1 : 0.55} />
            <text x="68" y={y + 3} fontSize="8" fill={MUTED} textAnchor="end">{l}</text>
          </g>
        );
      })}
      <line x1="98" y1="284" x2="98" y2={busY - 22} stroke={INK} strokeWidth="2" />

      {/* группы */}
      {g.map((name, i) => {
        const c = i % cols, r = Math.floor(i / cols);
        const x = gx0 + 16 + c * (gw + ggap), y = gy0 + r * (gh + ggap);
        const isLight = /свет|lamp|подсвет/i.test(name);
        const isHeat = /котёл|котел|пол|бойлер|обогрев|печь/i.test(name);
        const k: SchemeHighlight = isLight ? "light" : isHeat ? "heating" : "groups";
        const on = highlight === k || highlight === "groups";
        return (
          <g key={name + i}>
            <line x1={x + gw / 2} y1={busY - 22 + (phases === 3 ? 18 : 0)} x2={x + gw / 2} y2={y} stroke={on ? BRAND : LINE} strokeWidth="1.5" />
            <rect x={x} y={y} width={gw} height={gh} rx="8" fill={on ? "#FDECEC" : "#fff"} stroke={on ? BRAND : INK} strokeWidth="1.5" />
            <rect x={x + 8} y={y + 10} width="18" height="16" rx="3" fill="#fff" stroke={on ? BRAND : INK} strokeWidth="1.2" />
            <text x={x + 17} y={y + 22} fontSize="8" fill={on ? BRAND : INK} textAnchor="middle" fontWeight="700">{isHeat ? "C20" : isLight ? "B10" : "C16"}</text>
            <rect x={x + 30} y={y + 10} width="24" height="16" rx="3" fill="#fff" stroke={on ? BRAND : INK} strokeWidth="1.2" />
            <text x={x + 42} y={y + 22} fontSize="8" fill={on ? BRAND : INK} textAnchor="middle" fontWeight="700">УЗО</text>
            <text x={x + 8} y={y + 48} fontSize="9.5" fill={on ? BRAND : INK} fontWeight="600">{name.length > 15 ? name.slice(0, 14) + "…" : name}</text>
          </g>
        );
      })}

      {/* заземление */}
      <g stroke={hot("ground")} strokeWidth="2.2" strokeLinecap="round">
        <line x1="476" y1="522" x2="476" y2="546" />
        <line x1="462" y1="546" x2="490" y2="546" />
        <line x1="467" y1="554" x2="485" y2="554" />
        <line x1="472" y1="562" x2="480" y2="562" />
      </g>
      <text x="494" y="436" fontSize="9.5" fill={hot("ground")} fontWeight="700" transform="rotate(90 494 436)">контур ≤4 Ом</text>
      <line x1="440" y1="522" x2="476" y2="522" stroke={hot("ground")} strokeWidth="2.2" />
      <line x1="424" y1="522" x2="440" y2="522" stroke={hot("ground")} strokeWidth="2.2" strokeDasharray="3 2" />
      <text x="420" y="525" fontSize="8" fill={MUTED} textAnchor="end">ГЗШ</text>

      {/* подпись */}
      <text x="40" y="574" fontSize="10" fill={MUTED}>Схема условная: состав щита и группы — по вашему дому, после бесплатного выезда инженера.</text>
    </svg>
  );
}

/** Подсветка и группы схемы по slug услуги (для страниц без фото) */
export const SCHEME_BY_SLUG: Record<string, { highlight: SchemeHighlight; groups?: string[]; avr?: boolean; phases?: 1 | 3 }> = {
  "elektrika-v-derevyannom-dome": { highlight: "groups", groups: ["Электрокотёл", "Бойлер", "Кухня", "Розетки", "Свет", "Баня", "Улица", "Гараж"] },
  "retro-provodka": { highlight: "light", groups: ["Свет гостиная", "Свет спальни", "Розетки", "Веранда"], phases: 1 },
  "vvod-elektrichestva-v-dom": { highlight: "entry" },
  "sborka-elektroshchita": { highlight: "panel" },
  "montazh-zazemleniya": { highlight: "ground" },
  "razvodka-elektriki-v-dome": { highlight: "groups" },
  "montazh-osveshcheniya": { highlight: "light", groups: ["Свет 1 этаж", "Свет 2 этаж", "Лента, подсветка", "Улица, датчики", "Розетки", "Кухня", "Котёл", "Бойлер"] },
  "podklyuchenie-generatora-avr": { highlight: "avr", avr: true, groups: ["Котёл: автоматика", "Насосы, скважина", "Холодильник", "Свет", "Ворота, интернет", "Тёплый пол", "Кухня", "Розетки"] },
  "molniezashchita": { highlight: "spd" },
  "elektrika-pod-elektrootoplenie": { highlight: "heating" },
  "elektrika-v-chastnom-dome-pod-klyuch": { highlight: "panel" },
  "elektrika-na-dache": { highlight: "relay", phases: 1, groups: ["Обогреватели", "Бойлер", "Кухня", "Розетки", "Свет", "Насос"] },
};
