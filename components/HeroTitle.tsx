/**
 * v35: h1 в hero. Длинный заголовок вида «Главное: уточнение» делится внутри одного <h1>:
 * крупно — до двоеточия, ниже мельче — после. Для поисковика заголовок остаётся целым
 * (двоеточие в тексте, только визуально скрыто). Плюс кегль уменьшается по длине строки,
 * чтобы h1 не занимал весь первый экран.
 */
export default function HeroTitle({ text, className = "" }: { text: string; className?: string }) {
  const i = text.indexOf(": ");
  const split = i > 0 && text.length > 55;
  const main = split ? text.slice(0, i) : text;
  const sub = split ? text.slice(i + 2) : "";
  const size = main.length > 70 ? "text-[clamp(1.7rem,3.2vw,2.6rem)]" : main.length > 48 ? "text-[clamp(1.85rem,3.6vw,2.9rem)]" : "";
  return (
    <h1 className={`${size} ${className}`}>
      {main}
      {split && (
        <>
          <span className="sr-only">: </span>
          <span className="block mt-3 text-[clamp(1.15rem,1.9vw,1.6rem)] leading-snug font-bold tracking-tight text-ink/75 first-letter:uppercase">{sub}</span>
        </>
      )}
    </h1>
  );
}
