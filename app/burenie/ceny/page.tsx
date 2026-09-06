import Link from "next/link";
import { meta } from "@/lib/seo";
import { BUR, burObjects, rub, BP } from "@/lib/content";
import Breadcrumbs from "@/components/Breadcrumbs";
import FAQ from "@/components/FAQ";
import Draft from "@/components/Draft";
import DrillLead from "@/components/DrillLead";
import ObjectCard from "@/components/ObjectCard";

export const metadata = meta({
  title: "Цены на бурение скважин в Иркутске 2026 — за метр, кессон, насос | Фортес",
  description: "Стоимость скважины на воду в Иркутске: от 2 300 ₽ за метр сталью, металл + пластик от 2 900 ₽/м, кессон от 90 000 ₽, насос с монтажом от 25 000 ₽. Три реальные сметы с объектов.",
  path: BP.ceny,
});

const faq = [
  { q: "Почему цена за метр, а не за скважину целиком?", a: "Потому что глубина известна только после бурения: на одной улице у соседей может быть 38 и 52 метра. Честная схема — фиксировать в договоре цену метра и конструкцию, а итог считать по факту. Ориентир по глубине для вашего посёлка даём до выезда по карте глубин." },
  { q: "Что входит в цену метра?", a: "Проходка, обсадная труба, фильтр на водоносный горизонт, прокачка до чистой воды, замер глубины, уровней и дебита, паспорт и акт. Отдельно — обустройство: кессон или адаптер, насос, ввод в дом." },
  { q: "Что может увеличить стоимость?", a: "Глубина больше ожидаемой (платите по факту метров), двойная обсадка на глубоких скважинах, малогабаритная установка на застроенном участке, длинная трасса до дома, водоочистка по анализу, переезд техники дальше 60 км от Иркутска." },
  { q: "Действует ли рассрочка?", a: "Да, в рассрочку или кредит через банки РФ на условиях банка — на бурение и обустройство целиком. Организациям — договор с НДС." },
];

export default function Page() {
  return (
    <>
      <div className="container-site">
        <Breadcrumbs items={[{ name: "Бурение", href: BP.hub }, { name: "Цены", href: BP.ceny }]} />
        <h1>Цены на бурение скважин в Иркутске</h1>
        <p className="mt-4 text-[18px] text-ink/85 max-w-[62ch]">Главная цифра — от 2 300 ₽ за метр с обсадкой, прокачкой и паспортом. Ниже — ориентиры по конструкциям и обустройству и три реальные сметы, чтобы было с чем сравнить.</p>
        <div className="mt-5 flex flex-wrap gap-2">{BUR.hub.chips.map((c) => <span key={c} className="chip">{c}</span>)}</div>

        <h2 className="mt-12 mb-4">Ориентиры по видам работ</h2>
        <div className="card overflow-x-auto">
          <table className="w-full text-[15px] min-w-[640px]">
            <thead className="text-left text-muted"><tr><th className="p-4">Работа</th><th className="p-4">Цена</th><th className="p-4">Примечание</th></tr></thead>
            <tbody>
              {BUR.prices.map((r) => (
                <tr key={r.name} className="border-t border-line">
                  <td className="p-4 font-bold"><Link href={r.href} className="hover:text-brand">{r.name}</Link></td>
                  <td className="p-4 whitespace-nowrap font-bold"><Draft on={r.draft} note="уточнить">{r.price}</Draft></td>
                  <td className="p-4 text-muted">{r.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[14px] text-muted mt-3">Цены ориентировочные для Иркутска и Иркутского района. Точная смета — после бесплатного выезда инженера, фиксируется в договоре. Быстрая прикидка — в <Link href={BP.calc} className="text-brand underline">калькуляторе</Link>, глубина по посёлкам — на <Link href={BP.map} className="text-brand underline">карте глубин</Link>.</p>

        <h2 className="mt-12 mb-4">Реальные объекты с ценой под ключ</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {burObjects.map((o) => (
            <Link key={o.slug} href={BP.object(o.slug)} className="card p-5 block hover:shadow-card h-full">
              <div className="text-[13px] text-muted">{o.type}</div>
              <div className="font-bold mt-1">{o.title}</div>
              <div className="text-[14px] text-muted">{o.place}</div>
              <div className="text-xl font-extrabold tracking-tight mt-2">{rub(o.price)}</div>
            </Link>
          ))}
        </div>

        <h2 className="mt-12 mb-6">Подробнее — со сметами</h2>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{burObjects.map((o) => <ObjectCard key={o.slug} o={o} />)}</div>
      </div>
      <FAQ items={faq} title="Вопросы про цены" />
      <DrillLead source="цены бурение" />
    </>
  );
}
