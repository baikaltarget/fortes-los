import { notFound } from "next/navigation";
import Link from "next/link";
import { meta } from "@/lib/seo";
import { sections, getSection, company } from "@/lib/content";
import Breadcrumbs from "@/components/Breadcrumbs";
import LeadSection from "@/components/LeadSection";
import Reasons from "@/components/Reasons";
import Draft from "@/components/Draft";

export const dynamicParams = false;
export function generateStaticParams() { return sections.filter((s) => !s.live).map((s) => ({ section: s.slug })); }
export function generateMetadata({ params }: { params: { section: string } }) {
  const s = getSection(params.section); if (!s || s.live) return {};
  return meta({ title: s.title!, description: s.description!, path: `/${s.slug}/` });
}

export default function Page({ params }: { params: { section: string } }) {
  const s = getSection(params.section); if (!s || s.live) notFound();
  return (
    <>
      <div className="container-site">
        <Breadcrumbs items={[{ name: s.name, href: `/${s.slug}/` }]} />
        <Draft note="визитка направления — заменить полноценным разделом">
          <div className="card p-6 md:p-10 shadow-card max-w-[860px]">
            <h1>{s.h1}</h1>
            <p className="mt-5 text-[18px] leading-relaxed text-ink/85">{s.lead}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {s.menu[0].links.map(([t]) => <span key={t} className="chip">{t}</span>)}
            </div>
            <div className="mt-8 flex flex-wrap gap-3 items-center">
              {s.external && <a href={s.external} className="btn-primary" rel="noopener">Открыть сайт направления</a>}
              <a href={`tel:${company.phoneRaw}`} className="btn-outline">{company.phone}</a>
            </div>
          </div>
        </Draft>
      </div>
      <Reasons />
      <LeadSection source={`направление ${s.name}`} title={`Расчёт по направлению «${s.name}»`} text="Оставьте телефон — инженер по этому направлению перезвонит в рабочее время, сориентирует по цене и запишет на бесплатный выезд." />
      <section className="py-6"><div className="container-site"><Link href="/kanalizaciya/" className="text-brand underline">Смотрите также: автономная канализация и септики под ключ →</Link></div></section>
    </>
  );
}
