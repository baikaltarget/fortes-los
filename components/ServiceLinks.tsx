import Link from "next/link";
import { services, P } from "@/lib/content";
type Item = { slug: string; name: string };
/** Ссылки на услуги раздела. По умолчанию — канализация; для других разделов передать items и href-строитель */
export default function ServiceLinks({ exclude, title = "Подберём под вашу задачу", items, href }: { exclude?: string; title?: string; items?: Item[]; href?: (slug: string) => string }) {
  const list: Item[] = items || services;
  const link = href || P.page;
  return (
    <section className="py-12 md:py-16">
      <div className="container-site">
        <h2 className="mb-6">{title}</h2>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {list.filter((s) => s.slug !== exclude).map((s) => (
            <Link key={s.slug} href={link(s.slug)} className="card px-5 py-4 font-medium hover:shadow-card border border-transparent hover:border-line flex items-center justify-between gap-3">
              <span>{s.name}</span><span className="text-brand" aria-hidden>›</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
