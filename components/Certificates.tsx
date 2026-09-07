"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { BRAND, type Cert } from "@/lib/content";

/**
 * Дипломы и благодарности (content/brand.json → certs). Файлы — public/img/certs/<slug>.webp (до 1400 px)
 * и <slug>-thumb.webp (до 520 px). По клику — просмотр в полный размер (без внешних библиотек).
 * compact — узкая строка миниатюр для главной со ссылкой на /o-kompanii/#certs.
 */
export default function Certificates({ compact = false }: { compact?: boolean }) {
  const [open, setOpen] = useState<Cert | null>(null);
  const C = BRAND.certs;
  const list = C.items;
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);
  return (
    <section id="certs" className={compact ? "py-6" : "py-12 md:py-16 scroll-mt-28"}>
      <div className="container-site">
        {compact ? (
          <div className="card p-5 md:p-6 flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
            <div className="md:max-w-[300px] shrink-0">
              <h2 className="text-[22px]">{C.title}</h2>
              <p className="mt-1 text-[14px] text-ink/75 leading-snug">Обучение у STOUT и VALTEC, диплом «Байкальской строительной недели», письма поставщиков.</p>
              <Link href="/o-kompanii/#certs" className="mt-2 inline-block text-[14px] text-brand underline underline-offset-2">Все на странице о компании</Link>
            </div>
            <ul className="flex gap-3 overflow-x-auto [scrollbar-width:none] -mx-1 px-1 py-1">
              {list.map((c) => (
                <li key={c.slug} className="shrink-0">
                  <button type="button" onClick={() => setOpen(c)} className="block h-24 md:h-28 rounded-btn overflow-hidden border border-line bg-white hover:border-ink focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/30" aria-label={`Открыть: ${c.title}`}>
                    <img src={`/img/certs/${c.slug}-thumb.webp`} alt={c.alt} className="h-full w-auto max-w-none" width={c.w > c.h ? 154 : 85} height={112} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <>
            <h2 className="mb-2">{C.title}</h2>
            <p className="text-muted max-w-[70ch] mb-6">{C.text}</p>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((c) => (
                <li key={c.slug} className="card p-4 flex flex-col">
                  <button type="button" onClick={() => setOpen(c)} className="block aspect-[4/3] rounded-btn overflow-hidden bg-page border border-line hover:border-ink focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/30" aria-label={`Открыть: ${c.title}`}>
                    <img src={`/img/certs/${c.slug}-thumb.webp`} alt={c.alt} className="w-full h-full object-contain" loading="lazy" width={c.w > c.h ? 520 : 378} height={c.w > c.h ? 378 : 520} />
                  </button>
                  <h3 className="mt-3 text-[17px]">{c.title}</h3>
                  <p className="mt-1 text-[14px] text-ink/75 leading-snug">{c.sub}</p>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      {open && (
        <div className="fixed inset-0 z-[60] bg-ink/85 p-4 md:p-8 flex items-center justify-center" onClick={() => setOpen(null)} role="dialog" aria-modal="true" aria-label={open.title}>
          <button type="button" onClick={() => setOpen(null)} className="absolute top-4 right-4 w-11 h-11 rounded-btn bg-white text-ink text-2xl leading-none font-bold" aria-label="Закрыть">×</button>
          <figure className="max-w-[1100px] max-h-full flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <img src={`/img/certs/${open.slug}.webp`} alt={open.alt} className="max-h-[82vh] w-auto max-w-full rounded-btn bg-white" width={open.w} height={open.h} />
            <figcaption className="mt-3 text-white/90 text-[14px] text-center">{open.title} — {open.sub}</figcaption>
          </figure>
        </div>
      )}
    </section>
  );
}
