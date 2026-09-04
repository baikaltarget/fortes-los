/**
 * Signature-элемент сайта: схема станции в разрезе.
 * chambers: 3 (Novo Eko / Zörde) или 5 (Kolo Vesi). compact — для карточек.
 */
export default function StationScheme({ chambers = 3, label, compact = false, className = "" }: { chambers?: 3 | 5; label?: string; compact?: boolean; className?: string }) {
  const W = 320, H = compact ? 200 : 240;
  const bodyX = 40, bodyY = 70, bodyW = 240, bodyH = compact ? 110 : 140;
  const n = chambers;
  const cw = bodyW / n;
  const water = bodyY + bodyH * 0.35;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={className} role="img" aria-label={label ? `Схема станции ${label}` : "Схема станции очистки"}>
      {/* грунт */}
      <rect x="0" y="52" width={W} height={H - 52} fill="#F1EFEA" />
      <line x1="0" y1="52" x2={W} y2="52" stroke="#24262F" strokeWidth="1.5" />
      {/* трава */}
      {Array.from({ length: 24 }).map((_, i) => (
        <line key={i} x1={8 + i * 13} y1="52" x2={11 + i * 13} y2="45" stroke="#24262F" strokeWidth="1" />
      ))}
      {/* горловина + крышка */}
      <rect x={bodyX + bodyW / 2 - 28} y="36" width="56" height={bodyY - 36} fill="#fff" stroke="#24262F" strokeWidth="2" />
      <rect x={bodyX + bodyW / 2 - 34} y="30" width="68" height="8" rx="2" fill="#24262F" />
      {/* корпус */}
      <rect x={bodyX} y={bodyY} width={bodyW} height={bodyH} rx="14" fill="#fff" stroke="#24262F" strokeWidth="2.5" />
      {/* вода */}
      <clipPath id={`clip-${n}-${compact}`}><rect x={bodyX} y={bodyY} width={bodyW} height={bodyH} rx="14" /></clipPath>
      <rect x={bodyX} y={water} width={bodyW} height={bodyY + bodyH - water} fill="#EEF3F8" clipPath={`url(#clip-${n}-${compact})`} />
      {/* перегородки и переливы */}
      {Array.from({ length: n - 1 }).map((_, i) => {
        const x = bodyX + cw * (i + 1);
        return (
          <g key={i}>
            <line x1={x} y1={bodyY + 12} x2={x} y2={bodyY + bodyH - 6} stroke="#24262F" strokeWidth="2" />
            <path d={`M ${x - 10} ${water + 6 + i * 4} h 20`} stroke="#D90406" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        );
      })}
      {/* биофильтр в средней камере */}
      {(() => {
        const mid = Math.floor(n / 2);
        const x0 = bodyX + cw * mid + 8, x1 = bodyX + cw * (mid + 1) - 8;
        return Array.from({ length: 5 }).map((_, i) => (
          <line key={i} x1={x0} y1={water + 14 + i * 12} x2={x1} y2={water + 14 + i * 12} stroke="#24262F" strokeWidth="1" strokeDasharray="3 3" />
        ));
      })()}
      {/* пузырьки аэрации */}
      {(() => {
        const mid = Math.floor(n / 2);
        const cx = bodyX + cw * mid + cw / 2;
        return [0, 1, 2, 3].map((i) => <circle key={i} cx={cx + (i % 2 ? 6 : -6)} cy={bodyY + bodyH - 18 - i * 16} r="2.5" fill="none" stroke="#D90406" strokeWidth="1.5" />);
      })()}
      {/* вход и выход */}
      <path d={`M 4 ${bodyY + 22} h ${bodyX - 4}`} stroke="#24262F" strokeWidth="6" strokeLinecap="round" />
      <path d={`M ${bodyX + bodyW} ${bodyY + 30} h ${W - bodyX - bodyW - 4}`} stroke="#24262F" strokeWidth="6" strokeLinecap="round" />
      <path d={`M ${W - 22} ${bodyY + 30} l 10 -6 v 12 z`} fill="#D90406" />
      {/* грунтозацепы */}
      <path d={`M ${bodyX + 20} ${bodyY + bodyH} l -14 12 h 28 z`} fill="#24262F" />
      <path d={`M ${bodyX + bodyW - 20} ${bodyY + bodyH} l -14 12 h 28 z`} fill="#24262F" />
      {/* блок управления снаружи */}
      <rect x={bodyX + bodyW - 8} y="18" width="26" height="22" rx="3" fill="#D90406" />
      <line x1={bodyX + bodyW + 5} y1="40" x2={bodyX + bodyW + 5} y2="52" stroke="#24262F" strokeWidth="2" />
      {label && (
        <text x={bodyX + 10} y={bodyY + bodyH - 10} fontFamily="Inter Tight, Arial, sans-serif" fontWeight="800" fontSize="14" fill="#24262F">
          {label}
        </text>
      )}
    </svg>
  );
}
