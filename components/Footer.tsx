import Link from "next/link";
import { company, services, geo, brands } from "@/lib/content";
import Draft from "./Draft";

export default function Footer() {
  const svc = services.slice(0, 12);
  return (
    <footer className="mt-16 md:mt-24 bg-ink text-white/85 pb-24 md:pb-0">
      <div className="container-site py-12 md:py-16 grid gap-10 md:grid-cols-4 text-[14px]">
        <div>
          <div className="text-white text-xl font-extrabold tracking-tight">ФОРТЕС</div>
          <p className="mt-2 text-white/70">Автономная канализация, септики, станции биологической очистки в Иркутске и районе с 2014 года.</p>
          <a href={`tel:${company.phoneRaw}`} className="block mt-4 text-white text-lg font-bold">{company.phone}</a>
          <div className="text-white/70">{company.hours}</div>
          <a href={`mailto:${company.email}`} className="block mt-1 text-white/85 hover:text-white">{company.email}</a>
          <div className="mt-4 space-y-1 text-white/70">
            {company.addresses.map((a) => <div key={a.street}>{a.city}, {a.street}</div>)}
          </div>
        </div>
        <div>
          <div className="text-white font-bold mb-3">Решения</div>
          <ul className="space-y-1.5">
            {svc.map((s) => <li key={s.slug}><Link href={`/${s.slug}/`} className="hover:text-white">{s.name}</Link></li>)}
          </ul>
        </div>
        <div>
          <div className="text-white font-bold mb-3">Станции</div>
          <ul className="space-y-1.5">
            <li><Link href="/stancii/" className="hover:text-white">Все станции</Link></li>
            {brands.map((b) => <li key={b.slug}><Link href={`/${b.slug}/`} className="hover:text-white">{b.name}</Link></li>)}
            <li><Link href="/ceny/" className="hover:text-white">Цены</Link></li>
            <li><Link href="/kalkulyator/" className="hover:text-white">Калькулятор</Link></li>
            <li><Link href="/obekty/" className="hover:text-white">Объекты</Link></li>
            <li><Link href="/otzyvy/" className="hover:text-white">Отзывы</Link></li>
            <li><Link href="/o-kompanii/" className="hover:text-white">О компании</Link></li>
            <li><Link href="/blog/" className="hover:text-white">Статьи</Link></li>
          </ul>
          <div className="text-white font-bold mt-6 mb-3">Другие направления</div>
          <ul className="space-y-1.5">
            {company.otherSites.map((o) => <li key={o.url}><a href={o.url} className="hover:text-white" rel="noopener">{o.label}</a></li>)}
          </ul>
        </div>
        <div>
          <div className="text-white font-bold mb-3">Септик под ключ</div>
          <ul className="space-y-1.5 columns-2 md:columns-1">
            <li><Link href="/septik/" className="hover:text-white">Иркутский район</Link></li>
            {geo.map((g) => <li key={g.slug}><Link href={`/septik/${g.slug}/`} className="hover:text-white">{g.name}</Link></li>)}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-site py-6 text-[13px] text-white/60 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <div>© {new Date().getFullYear()} {company.legalName} · ИНН {company.inn} · ОГРН {company.ogrn}</div>
          <div className="flex gap-4">
            <Link href="/politika/" className="hover:text-white">Политика конфиденциальности</Link>
            <Draft note="счётчики Метрики/GA"><span>Метрика: добавить в layout</span></Draft>
          </div>
        </div>
      </div>
    </footer>
  );
}
