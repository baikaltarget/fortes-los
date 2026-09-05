import Link from "next/link";
import { company, sections, companyLinks } from "@/lib/content";

function PinIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M12 22s7-7.58 7-12.5A7 7 0 0 0 5 9.5C5 14.42 12 22 12 22Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="12" cy="9.5" r="2.3" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="mt-16 md:mt-24 bg-ink text-white/85 pb-24 md:pb-0">
      {/* Верхний блок: бренд + контакты одной строкой на desktop, чтобы не тесниться в общей колоночной сетке */}
      <div className="container-site py-10 md:py-12 border-b border-white/10 flex flex-col lg:flex-row lg:items-start gap-8 lg:gap-14">
        <div className="lg:max-w-[240px] shrink-0">
          <div className="text-white text-xl font-extrabold tracking-tight">ФОРТЕС</div>
          <p className="mt-2 text-white/70 leading-relaxed text-[14px]">Инженерные системы для дома в Иркутске и области с {company.foundedYear} года.</p>
        </div>
        <div className="flex flex-wrap gap-x-12 gap-y-6 text-[14px]">
          <div>
            <a href={`tel:${company.phoneRaw}`} className="block text-white text-lg font-bold whitespace-nowrap">{company.phone}</a>
            <div className="text-white/70 mt-0.5">{company.hours}</div>
            <a href={`mailto:${company.email}`} className="block mt-1 text-white/85 hover:text-white">{company.email}</a>
          </div>
          <div>
            <div className="text-white/50 text-[12px] font-bold uppercase tracking-wider mb-2">Написать</div>
            <div className="flex items-center gap-4">
              <a href={company.telegramUrl} target="_blank" rel="noopener" className="flex items-center gap-1.5 text-white/85 hover:text-white">
                <img src="/img/icons/telegram.webp" width={18} height={18} alt="" className="rounded-[4px]" />Telegram
              </a>
              <a href={company.maxUrl} target="_blank" rel="noopener" className="flex items-center gap-1.5 text-white/85 hover:text-white">
                <img src="/img/icons/max.webp" width={18} height={18} alt="" className="rounded-[4px]" />MAX
              </a>
            </div>
          </div>
          <div>
            <div className="text-white/50 text-[12px] font-bold uppercase tracking-wider mb-2">Адреса</div>
            <div className="space-y-1.5">
              {company.addresses.map((a) => (
                <div key={a.street} className="flex items-start gap-1.5 text-white/70 max-w-[240px]">
                  <PinIcon className="mt-0.5 shrink-0 w-3.5 h-3.5 text-white/40" />
                  <span>{a.city}, {a.street}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Навигация по направлениям — 5 разделов + «Компания» = 6 колонок, без брендовой колонки (она вынесена выше) */}
      <div className="container-site py-12 md:py-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 text-[14px]">
        {sections.map((s) => (
          <div key={s.slug}>
            <Link href={`/${s.slug}/`} className="block text-white font-bold mb-3 hover:underline">{s.name}</Link>
            <ul className="space-y-1.5">{s.footer.map(([t, h]) => <li key={t + h}><Link href={h} className="hover:text-white">{t}</Link></li>)}</ul>
            {!s.live && s.external && <a href={s.external} rel="noopener" className="block mt-2 text-white/50 hover:text-white text-[13px]">Сайт направления →</a>}
          </div>
        ))}
        <div>
          <div className="text-white font-bold mb-3">Компания</div>
          <ul className="space-y-1.5">{companyLinks.map(([t, h]) => <li key={h}><Link href={h} className="hover:text-white">{t}</Link></li>)}</ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-site py-6 text-[13px] text-white/60 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4">
            <span>© {new Date().getFullYear()} {company.legalName} · ИНН {company.inn} · ОГРН {company.ogrn}</span>
            <Link href="/politika/" className="underline hover:text-white/90 whitespace-nowrap">Политика конфиденциальности</Link>
          </div>
          <a href="https://baikal-target.ru/" target="_blank" rel="noopener" className="hover:text-white/90 whitespace-nowrap">
            Разработка сайта — Байкал Таргет
          </a>
        </div>
      </div>
    </footer>
  );
}
