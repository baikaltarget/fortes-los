import { meta, ldService } from "@/lib/seo";
import { geo, SITE } from "@/lib/content";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import ProductGrid from "@/components/ProductGrid";
import LeadSection from "@/components/LeadSection";
import GeoLinks from "@/components/GeoLinks";
import Steps from "@/components/Steps";
import FAQ from "@/components/FAQ";
import Link from "next/link";

export const metadata = meta({
  title: "Септик под ключ в Иркутском районе — установка в посёлках, цена с монтажом",
  description: "Установка септиков и станций биологической очистки под ключ в Иркутском районе: Хомутово, Маркова, Байкальский тракт, Смоленщина, Ангарск, Шелехов. Выезд инженера бесплатно, монтаж 1–2 дня.",
  path: "/septik/",
});

export default function Page() {
  return (
    <>
      <JsonLd data={ldService({ name: "Септик под ключ в Иркутском районе", description: "Установка септиков и станций в посёлках Иркутского района", path: "/septik/", priceFrom: 204900, area: "Иркутский район" })} />
      <div className="container-site">
        <Breadcrumbs items={[{ name: "Септик под ключ в районе", href: "/septik/" }]} />
        <h1>Септик под ключ в Иркутском районе</h1>
        <p className="mt-4 text-[18px] text-ink/85 max-w-[64ch]">Ставим станции во всех направлениях от Иркутска: Байкальский, Голоустненский, Качугский, Александровский тракты, Ангарск и Шелехов. Выезд инженера бесплатный, знаем грунты в каждом посёлке.</p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {geo.map((g) => (
            <Link key={g.slug} href={`/septik/${g.slug}/`} className="card p-5 hover:shadow-card block">
              <h2 className="text-xl">Септик {g.prep}</h2>
              <div className="text-[13px] text-muted mt-1">{g.distance} от Иркутска · {g.soil}</div>
              <p className="mt-2 text-[15px] text-ink/80">{g.note}</p>
            </Link>
          ))}
        </div>
      </div>
      <ProductGrid slugs={SITE.topPicks} title="Что ставим чаще всего" />
      <Steps />
      <FAQ items={SITE.homeFaq.slice(0, 4)} />
      <LeadSection source="хаб гео" />
    </>
  );
}
