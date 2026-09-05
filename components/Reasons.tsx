import { SITE } from "@/lib/content";
import Draft from "./Draft";
export default function Reasons() {
  return (
    <section className="py-12 md:py-16">
      <div className="container-site">
        <h2 className="mb-8">Почему септики заказывают у Фортес</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SITE.reasons.map((r) => (
            <Draft key={r.title} on={!!(r as { draft?: boolean }).draft} note="подтвердить условие">
              <div className="card p-5 md:p-6 h-full flex flex-col">
                <h3 className="text-[18px]">{r.title}</h3>
                <p className="mt-2 text-[15px] text-ink/80 leading-relaxed">{r.text}</p>
                {(r as { url?: string }).url && (
                  <a href={(r as { url?: string }).url} target="_blank" rel="noopener" className="mt-3 text-[14px] text-brand underline">Подробные условия →</a>
                )}
              </div>
            </Draft>
          ))}
        </div>
      </div>
    </section>
  );
}
