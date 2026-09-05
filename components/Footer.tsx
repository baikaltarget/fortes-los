import Link from "next/link";
import { company, sections, companyLinks } from "@/lib/content";

export default function Footer() {
  return (
    <footer className="mt-16 md:mt-24 bg-ink text-white/85 pb-24 md:pb-0">
      <div className="container-site py-12 md:py-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 text-[14px]">
        <div className="sm:col-span-2 lg:col-span-3 xl:col-span-1">
          <div className="text-white text-xl font-extrabold tracking-tight">ФОРТЕС</div>
          <p className="mt-2 text-white/70 leading-relaxed">Инженерные системы для дома в Иркутске и области с {company.foundedYear} года.</p>
          <a href={`tel:${company.phoneRaw}`} className="block mt-4 text-white text-lg font-bold whitespace-nowrap">{company.phone}</a>
          <div className="text-white/70">{company.hours}</div>
          <a href={`mailto:${company.email}`} className="block mt-1 text-white/85 hover:text-white">{company.email}</a>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
            <a href={company.telegramUrl} target="_blank" rel="noopener" className="text-white/85 hover:text-white underline underline-offset-2">Telegram</a>
            <a href={company.maxUrl} target="_blank" rel="noopener" className="text-white/85 hover:text-white underline underline-offset-2">MAX</a>
          </div>
          <div className="mt-3 text-white/70">{company.addresses.map((a) => <div key={a.street}>{a.city}, {a.street}</div>)}</div>
        </div>
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
          <div>© {new Date().getFullYear()} {company.legalName} · ИНН {company.inn} · ОГРН {company.ogrn}</div>
          <div className="flex flex-col md:flex-row gap-3 md:items-center md:gap-6">
            <a href="https://baikal-target.ru/" target="_blank" rel="noopener" className="hover:text-white/90">
              Разработка сайта — Байкал Таргет
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
