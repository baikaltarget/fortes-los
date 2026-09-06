import { SITE } from "@/lib/content";
type Step = { title: string; text: string };
/** Этапы заказа. По умолчанию — канализация (site.json); для других разделов передать items/title */
export default function Steps({ items, title = "Как проходит заказ" }: { items?: Step[]; title?: string }) {
  const list = items || SITE.steps;
  return (
    <section className="py-12 md:py-16">
      <div className="container-site">
        <h2 className="mb-8">{title}</h2>
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((s, i) => (
            <li key={s.title} className="card p-5 md:p-6 flex gap-4">
              <span className="shrink-0 w-10 h-10 rounded-btn bg-ink text-white font-extrabold flex items-center justify-center">{i + 1}</span>
              <div>
                <h3 className="text-[18px]">{s.title}</h3>
                <p className="mt-1 text-[15px] text-ink/80 leading-relaxed">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
