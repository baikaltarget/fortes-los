import { meta } from "@/lib/seo";
import { ELEK, elekServices, EP } from "@/lib/content";
import Breadcrumbs from "@/components/Breadcrumbs";
import ElectroCalculator from "@/components/ElectroCalculator";
import Draft from "@/components/Draft";
import ServiceLinks from "@/components/ServiceLinks";

export const metadata = meta({ title: "Калькулятор электрики в частном доме — онлайн-расчёт, Иркутск | Фортес", description: "Ориентир стоимости электромонтажа в частном доме под Иркутском: материал стен, площадь, ввод, щит 220/380 В, электроотопление, заземление, генератор. Смета инженера бесплатно.", path: EP.calc });

export default function Page() {
  return (
    <>
      <div className="container-site">
        <Breadcrumbs items={[{ name: "Электрика", href: EP.hub }, { name: "Калькулятор", href: EP.calc }]} />
        <h1>{ELEK.calculator.title}</h1>
        <p className="mt-4 text-[18px] text-ink/85 max-w-[62ch]">{ELEK.calculator.lead}</p>
        <Draft on={ELEK.calculator.ratesDraft} note="ставки калькулятора — уточнить в elektrika.json → calculator.rates" className="mt-8"><ElectroCalculator /></Draft>
      </div>
      <ServiceLinks items={elekServices.filter((s) => ["dom", "raboty"].includes(s.cluster)).slice(0, 9)} href={EP.page} title="Подберём под вашу задачу" />
    </>
  );
}
