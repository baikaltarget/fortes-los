import { meta } from "@/lib/seo";
import { HEAT, heatServices, HP } from "@/lib/content";
import Breadcrumbs from "@/components/Breadcrumbs";
import HeatingCalculator from "@/components/HeatingCalculator";
import Draft from "@/components/Draft";
import ServiceLinks from "@/components/ServiceLinks";

export const metadata = meta({ title: "Калькулятор стоимости отопления частного дома в Иркутске — онлайн-расчёт | Фортес", description: "Рассчитайте ориентировочную стоимость отопления дома под ключ в Иркутске: площадь, этажи, тёплый пол, радиаторы, тип котла — и вы видите смету по разделам. Точный расчёт с проектом — бесплатно после выезда инженера.", path: HP.calc });

export default function Page() {
  return (
    <>
      <div className="container-site">
        <Breadcrumbs items={[{ name: "Отопление", href: HP.hub }, { name: "Калькулятор", href: HP.calc }]} />
        <h1>{HEAT.calculator.title}</h1>
        <p className="mt-4 text-[18px] text-ink/85 max-w-[62ch]">{HEAT.calculator.lead}</p>
        <Draft on={HEAT.calculator.ratesDraft} note="ставки калькулятора — уточнить в otoplenie.json → calculator.rates" className="mt-8"><HeatingCalculator /></Draft>
      </div>
      <ServiceLinks items={heatServices.filter((s) => ["dom", "pol", "kotel"].includes(s.cluster)).slice(0, 9)} href={HP.page} title="Подберём под вашу задачу" />
    </>
  );
}
