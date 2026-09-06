import { meta } from "@/lib/seo";
import { BUR, burServices, BP } from "@/lib/content";
import Breadcrumbs from "@/components/Breadcrumbs";
import DrillingCalculator from "@/components/DrillingCalculator";
import Draft from "@/components/Draft";
import ServiceLinks from "@/components/ServiceLinks";

export const metadata = meta({ title: "Калькулятор стоимости скважины на воду в Иркутске — онлайн-расчёт | Фортес", description: "Ориентировочная стоимость скважины под ключ в Иркутске: глубина, конструкция колонны, кессон или адаптер, насос, ввод в дом. Точную цену метра инженер назовёт после выезда.", path: BP.calc });

export default function Page() {
  return (
    <>
      <div className="container-site">
        <Breadcrumbs items={[{ name: "Бурение", href: BP.hub }, { name: "Калькулятор", href: BP.calc }]} />
        <h1>{BUR.calculator.title}</h1>
        <p className="mt-4 text-[18px] text-ink/85 max-w-[62ch]">{BUR.calculator.lead}</p>
        <Draft on={BUR.calculator.ratesDraft} note="ставки калькулятора — уточнить в burenie.json → calculator.rates" className="mt-8"><DrillingCalculator /></Draft>
      </div>
      <ServiceLinks items={burServices.filter((s) => ["burenie", "obustrojstvo"].includes(s.cluster)).slice(0, 9)} href={BP.page} title="Подберём под вашу задачу" />
    </>
  );
}
