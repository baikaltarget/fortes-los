import Link from "next/link";
import { geo, P } from "@/lib/content";
export default function GeoLinks({ current }: { current?: string }) {
  return (
    <section className="py-12 md:py-16">
      <div className="container-site">
        <h2 className="mb-2">Септик под ключ в Иркутском районе</h2>
        <p className="text-muted mb-6 max-w-[70ch]">Выезд инженера бесплатный по всем направлениям. Знаем грунты и воду в каждом посёлке — ставили не раз.</p>
        <div className="flex flex-wrap gap-2">
          {geo.map((g) => (
            <Link key={g.slug} href={P.geo(g.slug)} className={`chip hover:border-ink ${current === g.slug ? "border-ink bg-ink text-white" : ""}`}>{g.name}</Link>
          ))}
        </div>
      </div>
    </section>
  );
}
