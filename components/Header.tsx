import Link from "next/link";
import Image from "next/image";
import { company, sections, companyLinks } from "@/lib/content";

/**
 * Шапка по макету header-footer.html: направления с раскрывашками (на hover/focus, без JS),
 * общие ссылки, телефон, кнопка. Мобильное меню — <details> с аккордеонами по направлениям.
 */
export default function Header({ current }: { current?: string }) {
  return (
    <header className="sticky top-0 z-40 bg-page/95 backdrop-blur border-b border-line">
      <div className="container-site h-16 md:h-[72px] flex items-center gap-1">
        <Link href="/" className="flex items-center shrink-0 mr-3" aria-label="Фортес — на главную">
          <Image src="/img/logo.webp" alt="Фортес" width={141} height={22} priority className="h-[22px] w-auto" />
        </Link>

        {/* десктоп: направления */}
        <nav className="hidden xl:flex items-center gap-0.5" aria-label="Направления">
          {sections.map((s) => (
            <div key={s.slug} className="group relative">
              <Link href={`/${s.slug}/`} className={`inline-flex items-center gap-1.5 px-2.5 py-2 rounded-btn text-[14px] font-medium whitespace-nowrap hover:bg-white ${current === s.slug ? "bg-white shadow-sm" : ""}`}>
                {s.name}
                <span className="w-1.5 h-1.5 border-r border-b border-ink/60 rotate-45 -translate-y-px" aria-hidden />
              </Link>
              <div className="absolute left-0 top-full pt-2 hidden group-hover:block group-focus-within:block z-50">
                <div className="card border border-line shadow-card overflow-hidden grid" style={{ gridTemplateColumns: s.hit ? `repeat(${s.menu.length}, 220px) 230px` : `repeat(${s.menu.length}, 220px)` }}>
                  {s.menu.map((col) => (
                    <div key={col.title} className="p-5">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-muted mb-2">{col.title}</div>
                      {col.links.map(([t, h]) => <Link key={t + h} href={h} className="block py-1.5 text-[14px] font-medium hover:text-brand">{t}</Link>)}
                      {!s.live && s.external && <a href={s.external} rel="noopener" className="block pt-3 text-[13px] text-brand underline">Сайт направления →</a>}
                    </div>
                  ))}
                  {s.hit && (
                    <div className="bg-page p-5 flex flex-col gap-1">
                      <span className="text-[12px] font-bold text-brand">{s.hit.label}</span>
                      <b className="text-[17px]">{s.hit.name}</b>
                      <span className="text-[13px] text-muted">{s.hit.sub}</span>
                      <span className="text-[21px] font-extrabold tracking-tight mt-1">{s.hit.price}</span>
                      <span className="text-[13px] text-muted">{s.hit.note}</span>
                      <Link href={s.hit.href} className="btn-primary h-9 px-4 text-[13px] mt-auto self-start">Подробнее</Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          <span className="w-px h-6 bg-line mx-2" aria-hidden />
          <Link href="/obekty/" className="px-2.5 py-2 rounded-btn text-[14px] font-medium hover:bg-white">Объекты</Link>
          <Link href="/kontakty/" className="px-2.5 py-2 rounded-btn text-[14px] font-medium hover:bg-white">Контакты</Link>
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <div className="text-right hidden md:block">
            <a href={`tel:${company.phoneRaw}`} className="block text-[17px] font-extrabold tracking-tight leading-tight whitespace-nowrap">{company.phone}</a>
            <span className="block text-[12px] text-muted whitespace-nowrap">{company.hours}</span>
          </div>
          <a href="#lead" className="btn-primary hidden md:inline-flex h-11 px-4">Расчёт</a>
          <a href={`tel:${company.phoneRaw}`} className="md:hidden btn-primary h-10 px-4">Позвонить</a>

          {/* мобильное / планшетное меню */}
          <details className="xl:hidden relative">
            <summary className="list-none cursor-pointer w-10 h-10 rounded-btn border border-line flex items-center justify-center bg-white" aria-label="Открыть меню">
              <span className="block w-4 border-t-2 border-ink relative before:absolute before:-top-1.5 before:left-0 before:w-4 before:border-t-2 before:border-ink after:absolute after:top-1 after:left-0 after:w-4 after:border-t-2 after:border-ink" />
            </summary>
            <nav className="absolute right-0 top-12 w-[320px] max-h-[80vh] overflow-auto card shadow-card border border-line p-2" aria-label="Мобильное меню">
              {sections.map((s) => (
                <details key={s.slug} className="border-b border-line last:border-0" open={s.live}>
                  <summary className={`list-none cursor-pointer flex items-center justify-between px-3 py-3 font-bold ${current === s.slug ? "text-brand" : ""}`}>
                    {s.name}<span className="w-2 h-2 border-r-2 border-b-2 border-ink/50 rotate-45" aria-hidden />
                  </summary>
                  <div className="grid grid-cols-2 gap-x-3 px-3 pb-3">
                    {s.menu.flatMap((c) => c.links).map(([t, h]) => <Link key={t + h} href={h} className="py-1.5 text-[14px]">{t}</Link>)}
                    {!s.live && s.external && <a href={s.external} rel="noopener" className="py-1.5 text-[13px] text-brand underline col-span-2">Сайт направления →</a>}
                  </div>
                </details>
              ))}
              <div className="flex flex-wrap gap-x-4 px-3 pt-3 pb-2 text-[14px] font-medium">
                {companyLinks.slice(0, 4).map(([t, h]) => <Link key={h} href={h}>{t}</Link>)}
                <Link href="/kontakty/">Контакты</Link>
              </div>
              <div className="px-3 pb-2 text-[13px] text-muted">{company.hours}</div>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
