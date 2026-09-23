import Link from "next/link";
import { meta } from "@/lib/seo";
import { brandDirections, HP, BP, VP, EP, NP, P } from "@/lib/content";
import Breadcrumbs from "@/components/Breadcrumbs";

/** v35: выбор калькулятора по направлениям. Подбор септика переехал на /kanalizaciya/kalkulyator/ */
export const metadata = meta({
  title: "Калькуляторы стоимости инженерных систем дома | Фортес, Иркутск",
  description: "Посчитайте ориентир под ключ: скважина, водоснабжение, септик, отопление, вентиляция и электрика частного дома в Иркутске. Шесть калькуляторов, смета — по бесплатному выезду.",
  path: "/kalkulyator/",
});

const CALC: Record<string, { href: string; text: string }> = {
  burenie: { href: BP.calc, text: "Глубина, конструкция колонны, обустройство, ввод в дом и водоочистка." },
  vodosnabzhenie: { href: VP.calc, text: "Санузлы и точки, материал труб, ввод, бойлер и канализация в доме." },
  kanalizaciya: { href: P.calc, text: "Число жильцов, грунт и глубина трубы — модель станции и цена под ключ." },
  otoplenie: { href: HP.calc, text: "Площадь, этажи, стены, тёплый пол или радиаторы, котёл и автоматика." },
  ventilyaciya: { href: NP.calc, text: "Площадь, санузлы, клапаны, бризеры или установка с рекуперацией." },
  elektrika: { href: EP.calc, text: "Стены, площадь, ввод 220/380 В, электроотопление, заземление и резерв." },
};

export default function Page() {
  return (
    <div className="container-site pb-16">
      <Breadcrumbs items={[{ name: "Калькулятор", href: "/kalkulyator/" }]} />
      <h1>Калькуляторы стоимости</h1>
      <p className="mt-4 text-[18px] text-ink/85 max-w-[62ch]">Выберите систему — калькулятор задаст 5–6 вопросов и покажет ориентир под ключ по разделам сметы. Точную цену инженер называет после бесплатного выезда.</p>
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {brandDirections.map((d) => {
          const c = CALC[d.slug];
          if (!c) return null;
          return (
            <Link key={d.slug} href={c.href} className="card p-5 md:p-6 shadow-card hover:ring-2 hover:ring-brand/30 flex flex-col">
              <span className="text-[20px] font-bold">{d.name}</span>
              <span className="mt-2 text-[15px] text-ink/80">{c.text}</span>
              <span className="mt-auto pt-4 text-brand font-bold">Посчитать →</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
