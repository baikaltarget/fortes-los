import { meta } from "@/lib/seo";
import { VODA, vodaServices, VP } from "@/lib/content";
import Breadcrumbs from "@/components/Breadcrumbs";
import WaterCalculator from "@/components/WaterCalculator";
import Draft from "@/components/Draft";
import ServiceLinks from "@/components/ServiceLinks";

export const metadata = meta({ title: "Калькулятор стоимости водоснабжения и канализации в доме — Иркутск, онлайн-расчёт по точкам | Фортес", description: "Рассчитайте ориентировочную стоимость воды и канализации в частном доме под Иркутском: санузлы и точки, материал труб, ввод, канализация к септику, бойлер, гидроаккумулятор, сантехника. Точную смету инженер составит бесплатно.", path: VP.calc });

export default function Page() {
  return (
    <>
      <div className="container-site">
        <Breadcrumbs items={[{ name: "Водоснабжение", href: VP.hub }, { name: "Калькулятор", href: VP.calc }]} />
        <h1>{VODA.calculator.title}</h1>
        <p className="mt-4 text-[18px] text-ink/85 max-w-[62ch]">{VODA.calculator.lead}</p>
        <Draft on={VODA.calculator.ratesDraft} note="ставки калькулятора — уточнить в vodosnabzhenie.json → calculator.rates" className="mt-8"><WaterCalculator /></Draft>
      </div>
      <ServiceLinks items={vodaServices.filter((s) => ["voda", "kanal"].includes(s.cluster)).slice(0, 9)} href={VP.page} title="Подберём под вашу задачу" />
    </>
  );
}
