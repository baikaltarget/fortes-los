import JsonLd from "./JsonLd";
import { ldFaq } from "@/lib/seo";
import type { Faq } from "@/lib/content";

export default function FAQ({ items, title = "Вопросы и ответы" }: { items: Faq[]; title?: string }) {
  if (!items?.length) return null;
  return (
    <section className="py-12 md:py-16">
      <JsonLd data={ldFaq(items)} />
      <div className="container-site">
        <h2 className="mb-6 md:mb-8">{title}</h2>
        <div className="grid gap-3 max-w-[860px]">
          {items.map((f) => (
            <details key={f.q} className="faq card px-5 md:px-7 py-4 group">
              <summary className="flex items-center justify-between gap-4 font-bold text-[17px] md:text-[18px]">
                <span>{f.q}</span>
                <span className="faq-icon shrink-0 w-8 h-8 rounded-full border-2 border-ink flex items-center justify-center text-xl leading-none transition-transform" aria-hidden>+</span>
              </summary>
              <p className="pt-3 text-ink/85 leading-relaxed max-w-[70ch]">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
