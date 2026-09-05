import Link from "next/link";
import StationScheme from "./StationScheme";
import { rub, turnkeyFrom, type Product, P } from "@/lib/content";

export default function ProductCard({ p, compact = false }: { p: Product; compact?: boolean }) {
  const chambers = p.brand === "kolo-vesi" ? 5 : 3;
  return (
    <article className="card p-5 md:p-6 flex flex-col relative shadow-card">
      {p.hit && (
        <span className="absolute top-4 right-4 rounded-btn bg-brand text-white text-[12px] font-bold px-2.5 py-1">{p.hitLabel || "Хит"}</span>
      )}
      <Link href={P.product(p.slug)} className="block -mx-2 -mt-2">
        {p.image.endsWith(".webp") ? (
          <img src={p.image} alt={`Станция ${p.name}`} className="w-full aspect-square object-contain rounded-card bg-page" width="800" height="800" loading="lazy" />
        ) : (
          <StationScheme chambers={chambers} compact label={p.shortName} className="w-full h-auto" />
        )}
      </Link>
      <h3 className="mt-2">
        <Link href={P.product(p.slug)} className="hover:text-brand">{p.name}</Link>
      </h3>
      <p className="text-muted text-[15px] mt-1">{p.users} · {p.capacity}</p>
      {!compact && <p className="mt-3 text-[15px] leading-relaxed text-ink/85">{p.bestFor}</p>}
      <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-1 text-[14px]">
        <dt className="text-muted">Обслуживание</dt><dd className="font-medium">{p.service}</dd>
        <dt className="text-muted">Залповый сброс</dt><dd className="font-medium">{p.salvo}</dd>
      </dl>
      <div className="mt-auto pt-5">
        <div className="text-[13px] text-muted">Под ключ с монтажом</div>
        <div className="text-2xl font-extrabold tracking-tight">от {rub(turnkeyFrom(p))}</div>
        <div className="mt-4 flex gap-2">
          <Link href={P.product(p.slug)} className="btn-primary flex-1">Подробнее</Link>
          <a href="#lead" className="btn-outline">Расчёт</a>
        </div>
      </div>
    </article>
  );
}
