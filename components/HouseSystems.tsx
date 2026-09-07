import Link from "next/link";
import Draft from "./Draft";
import { brandDirections, type BrandDirection } from "@/lib/content";

/**
 * Signature-элемент главной бренда: пять систем дома в порядке стройки
 * (скважина → вода → канализация → отопление → электрика), соединённые «трубой».
 * На десктопе — горизонтальная линия за иконками, на мобильном — вертикальная слева.
 * Данные — content/brand.json → directions (order задаёт порядок).
 */
const ICONS: Record<string, JSX.Element> = {
  burenie: (
    <svg viewBox="0 0 32 32" width="28" height="28" className="w-7 h-7 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M8 28h16M12 28V10l4-6 4 6v18" /><path d="M12 14h8M12 19h8M12 24h8" /><path d="M6 8l6 2M26 8l-6 2" />
    </svg>
  ),
  vodosnabzhenie: (
    <svg viewBox="0 0 32 32" width="28" height="28" className="w-7 h-7 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 10h16a4 4 0 0 1 4 4v3" /><path d="M8 6v8M4 6h8" /><path d="M24 20c0 3-2 5-4 5s-4-2-4-5c0-2.5 4-7 4-7s4 4.5 4 7Z" /><path d="M20 10v3" />
    </svg>
  ),
  kanalizaciya: (
    <svg viewBox="0 0 32 32" width="28" height="28" className="w-7 h-7 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="6" y="10" width="20" height="16" rx="3" /><path d="M13 10V6h6v4" /><path d="M6 17h20" /><path d="M11 22h4M18 22h3" />
    </svg>
  ),
  otoplenie: (
    <svg viewBox="0 0 32 32" width="28" height="28" className="w-7 h-7 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M6 24h20" /><path d="M9 24V12M14 24V12M19 24V12M24 24V12" /><path d="M6 12h20" /><path d="M6 8v4M26 8v4" />
    </svg>
  ),
  elektrika: (
    <svg viewBox="0 0 32 32" width="28" height="28" className="w-7 h-7 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M18 4 8 18h7l-1 10 10-14h-7l1-10Z" />
    </svg>
  ),
};

function Station({ d, i }: { d: BrandDirection; i: number }) {
  return (
    <li className="relative flex lg:flex-col gap-4 lg:gap-0">
      {/* узел на трубе */}
      <div className="relative z-10 shrink-0 w-14 h-14 rounded-btn bg-white border-2 border-ink text-ink flex items-center justify-center p-3 lg:mx-0">
        {ICONS[d.slug]}
        <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-brand text-white text-[12px] font-extrabold flex items-center justify-center">{i + 1}</span>
      </div>
      <div className="lg:mt-4 min-w-0 flex-1">
        <Link href={`/${d.slug}/`} className="block text-[19px] font-bold leading-tight hover:text-brand">{d.name}</Link>
        <p className="mt-1 text-[14px] text-ink/75 leading-snug lg:min-h-[3.9rem]">{d.what}</p>
        <Draft on={!!d.priceDraft} note="цена — ориентир" className="mt-3 inline-block">
          <div className="text-[21px] font-extrabold tracking-tight leading-none">{d.priceFrom}</div>
          <div className="text-[12px] text-muted mt-1 leading-snug lg:min-h-[2.3rem]">{d.priceNote}</div>
        </Draft>
        <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[14px]">
          {d.links.map(([t, h]) => (
            <li key={h}><Link href={h} className="underline underline-offset-2 decoration-line hover:decoration-brand hover:text-brand">{t}</Link></li>
          ))}
        </ul>
      </div>
    </li>
  );
}

export default function HouseSystems({ title, text, cta, href }: { title: string; text: string; cta: string; href: string }) {
  return (
    <section className="py-12 md:py-16">
      <div className="container-site">
        <div className="card p-6 md:p-10 shadow-card">
          <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr] lg:items-end mb-10">
            <div>
              <h2>{title}</h2>
              <p className="mt-3 text-ink/85 max-w-[62ch]">{text}</p>
            </div>
            <div className="lg:text-right"><Link href={href} className="btn-primary">{cta}</Link></div>
          </div>
          <div className="relative">
            {/* труба: вертикальная на мобильном, горизонтальная на десктопе */}
            <div className="absolute left-[27px] top-2 bottom-8 w-1 bg-brand rounded lg:hidden" aria-hidden />
            <div className="absolute left-7 right-7 top-[26px] h-1 bg-brand rounded hidden lg:block" aria-hidden />
            <ol className="grid gap-8 lg:grid-cols-5 lg:gap-6">
              {brandDirections.map((d, i) => <Station key={d.slug} d={d} i={i} />)}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
