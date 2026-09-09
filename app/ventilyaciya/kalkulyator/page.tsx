import { meta } from "@/lib/seo";
import { VENT, ventServices, NP } from "@/lib/content";
import Breadcrumbs from "@/components/Breadcrumbs";
import VentCalculator from "@/components/VentCalculator";
import Draft from "@/components/Draft";
import ServiceLinks from "@/components/ServiceLinks";

export const metadata = meta({ title: "Калькулятор вентиляции частного дома — онлайн-расчёт, Иркутск | Фортес", description: "Ориентир стоимости вентиляции частного дома под Иркутском: площадь, санузлы, схема (клапаны, бризеры, рекуператор), этап стройки, автоматика. Смета инженера бесплатно.", path: NP.calc });

export default function Page() {
  return (
    <>
      <div className="container-site">
        <Breadcrumbs items={[{ name: "Вентиляция", href: NP.hub }, { name: "Калькулятор", href: NP.calc }]} />
        <h1>{VENT.calculator.title}</h1>
        <p className="mt-4 text-[18px] text-ink/85 max-w-[62ch]">{VENT.calculator.lead}</p>
        <Draft on={VENT.calculator.ratesDraft} note="ставки калькулятора — уточнить в ventilyaciya.json → calculator.rates" className="mt-8"><VentCalculator /></Draft>
      </div>
      <ServiceLinks items={ventServices.filter((s) => s.cluster === "dom").slice(0, 9)} href={NP.page} title="Подберём под вашу задачу" />
    </>
  );
}
