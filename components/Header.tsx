import Link from "next/link";
import Image from "next/image";
import { company } from "@/lib/content";

const nav = [
  { href: "/stancii/", label: "Станции" },
  { href: "/septik-dlya-chastnogo-doma/", label: "Для дома" },
  { href: "/ceny/", label: "Цены" },
  { href: "/obekty/", label: "Объекты" },
  { href: "/kalkulyator/", label: "Калькулятор" },
  { href: "/blog/", label: "Статьи" },
  { href: "/kontakty/", label: "Контакты" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-page/90 backdrop-blur border-b border-line">
      <div className="container-site h-16 md:h-[72px] flex items-center gap-4">
        <Link href="/" className="flex items-center gap-3 shrink-0" aria-label="Фортес — на главную">
          <Image src="/img/logo.webp" alt="Фортес" width={141} height={22} priority className="h-[22px] w-auto" />
          <span className="hidden sm:block text-[12px] font-bold leading-tight text-muted border-l border-line pl-3">Автономная<br />канализация</span>
        </Link>
        <nav className="hidden xl:flex items-center gap-0.5 ml-2" aria-label="Основное меню">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="px-2.5 py-2 rounded-btn text-[14px] font-medium hover:bg-ink/5 whitespace-nowrap">{n.label}</Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-3">
          <div className="text-right hidden md:block">
            <a href={`tel:${company.phoneRaw}`} className="block text-[17px] font-extrabold tracking-tight leading-tight whitespace-nowrap">{company.phone}</a>
            <span className="block text-[12px] text-muted whitespace-nowrap">{company.hours}</span>
          </div>
          <a href="#lead" className="btn-primary hidden md:inline-flex h-11 px-4">Расчёт</a>
          <a href={`tel:${company.phoneRaw}`} className="md:hidden btn-primary h-10 px-4">Позвонить</a>
          <details className="xl:hidden relative">
            <summary className="list-none cursor-pointer w-10 h-10 rounded-btn border border-line flex items-center justify-center" aria-label="Открыть меню">
              <span className="block w-5 border-t-2 border-ink relative before:absolute before:-top-2 before:left-0 before:w-5 before:border-t-2 before:border-ink after:absolute after:top-1 after:left-0 after:w-5 after:border-t-2 after:border-ink" />
            </summary>
            <nav className="absolute right-0 top-12 w-64 card shadow-card p-2 border border-line" aria-label="Мобильное меню">
              {nav.map((n) => (
                <Link key={n.href} href={n.href} className="block px-4 py-3 rounded-btn font-medium hover:bg-ink/5">{n.label}</Link>
              ))}
              <div className="px-4 pt-2 pb-3 text-[13px] text-muted">{company.hours}</div>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
