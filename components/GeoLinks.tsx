import Link from "next/link";
import { geo, P } from "@/lib/content";
type Item = { slug: string; name: string };
/** Чипы посёлков. По умолчанию — канализация; для других разделов передать items/href/title/text */
export default function GeoLinks({ current, items, href, title = "Септик под ключ в Иркутском районе", text = "Выезд инженера бесплатный по всем направлениям. Знаем грунты и воду в каждом посёлке — ставили не раз." }: { current?: string; items?: Item[]; href?: (slug: string) => string; title?: string; text?: string }) {
  const list: Item[] = items || geo;
  const link = href || P.geo;
  return (
    <section className="py-12 md:py-16">
      <div className="container-site">
        <h2 className="mb-2">{title}</h2>
        <p className="text-muted mb-6 max-w-[70ch]">{text}</p>
        <div className="flex flex-wrap gap-2">
          {list.map((g) => (
            <Link key={g.slug} href={link(g.slug)} className={`chip hover:border-ink ${current === g.slug ? "border-ink bg-ink text-white" : ""}`}>{g.name}</Link>
          ))}
        </div>
      </div>
    </section>
  );
}
