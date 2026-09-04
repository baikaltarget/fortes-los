import { meta } from "@/lib/seo";
import { SITE } from "@/lib/content";
import Breadcrumbs from "@/components/Breadcrumbs";
import Calculator from "@/components/Calculator";
import Draft from "@/components/Draft";
import ServiceLinks from "@/components/ServiceLinks";

export const metadata = meta({ title: "Калькулятор септика — подобрать станцию и узнать цену под ключ | Иркутск", description: "Онлайн-подбор септика для частного дома в Иркутске: число жильцов, грунт, глубина трубы — и вы видите модель и ориентировочную стоимость под ключ. Novo Eko, Zörde, Kolo Vesi.", path: "/kalkulyator/" });

export default function Page() {
  return (
    <>
      <div className="container-site">
        <Breadcrumbs items={[{ name: "Калькулятор", href: "/kalkulyator/" }]} />
        <h1>{SITE.calculator.title}</h1>
        <p className="mt-4 text-[18px] text-ink/85 max-w-[62ch]">{SITE.calculator.lead}</p>
        <Draft on={SITE.calculator.extrasDraft} note="надбавки за монтаж — уточнить в site.json → calculator.extras" className="mt-8"><Calculator /></Draft>
      </div>
      <ServiceLinks />
    </>
  );
}
