import { SITE } from "@/lib/content";
import Draft from "./Draft";
type Reason = { title: string; text: string; url?: string; draft?: boolean };
/** Блок «Почему у Фортес». По умолчанию — канализация; для других разделов передать items/title */
export default function Reasons({ items, title = "Почему септики заказывают у Фортес" }: { items?: Reason[]; title?: string }) {
  const list: Reason[] = items || (SITE.reasons as Reason[]);
  return (
    <section className="py-12 md:py-16">
      <div className="container-site">
        <h2 className="mb-8">{title}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((r) => (
            <Draft key={r.title} on={!!r.draft} note="подтвердить условие">
              <div className="card p-5 md:p-6 h-full flex flex-col">
                <h3 className="text-[18px]">{r.title}</h3>
                <p className="mt-2 text-[15px] text-ink/80 leading-relaxed">{r.text}</p>
                {r.url && (
                  <a href={r.url} target="_blank" rel="noopener" className="mt-3 text-[14px] text-brand underline">Подробные условия →</a>
                )}
              </div>
            </Draft>
          ))}
        </div>
      </div>
    </section>
  );
}
