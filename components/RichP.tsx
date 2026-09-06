import Link from "next/link";
/** Абзац из JSON с инлайновыми ссылками вида [текст](/путь/) — всё остальное выводится как есть */
export default function RichP({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  return (
    <p>
      {parts.map((part, i) => {
        const m = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        return m ? <Link key={i} href={m[2]} className="text-brand underline">{m[1]}</Link> : <span key={i}>{part}</span>;
      })}
    </p>
  );
}
