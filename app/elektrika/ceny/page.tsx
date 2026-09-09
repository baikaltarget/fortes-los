import Link from "next/link";
import { meta } from "@/lib/seo";
import { ELEK, elekObjects, rub, EP } from "@/lib/content";
import Breadcrumbs from "@/components/Breadcrumbs";
import FAQ from "@/components/FAQ";
import Draft from "@/components/Draft";
import ElectroLead from "@/components/ElectroLead";
import ObjectCard from "@/components/ObjectCard";

export const metadata = meta({
  title: "Цены на электрику в частном доме, Иркутск 2026 — за точку, щит, ввод",
  description: "Сколько стоит электромонтаж в частном доме в Иркутске: под ключ от 3 500 ₽/м², точка от 1 400 ₽, щит 380 В от 45 000 ₽, ввод от 30 000 ₽. Дом 120 м² — от 420 000 ₽.",
  path: EP.ceny,
});

const faq = [
  { q: "Почему цена за точку, а не за дом?", a: "В доме 120 м² может быть 35 точек, а может 70 — с подсветкой, лентами и розетками под каждый прибор. Точка — понятная единица: розетка, выключатель, вывод под светильник. Считаете точки по плану — умножаете, добавляете щит, ввод и заземление — получаете ориентир. Точную смету составит инженер после бесплатного выезда." },
  { q: "Что входит в цену точки?", a: "Кабель ВВГнг-LS от щита или коробки до точки, гофра или металлорукав, штроба или крепёж, подрозетник, работа чернового и чистового этапа. Отдельно — механизмы (розетки, выключатели), светильники, щит, ввод, заземление и силовые линии к оборудованию." },
  { q: "Что может увеличить стоимость?", a: "Дом из бруса или бревна (металлорукав, металлические подрозетники), ретро-проводка, длинный подземный ввод, генератор с АВР, молниезащита, дизайнерская фурнитура и встраиваемый свет с лентами, второй щит на этаже или в гараже, зимний монтаж наружных линий." },
  { q: "Действует ли рассрочка?", a: "Да, в рассрочку или кредит через банки РФ на условиях банка — на материалы и работы. Организациям — договор с НДС." },
];

export default function Page() {
  return (
    <>
      <div className="container-site">
        <Breadcrumbs items={[{ name: "Электрика", href: EP.hub }, { name: "Цены", href: EP.ceny }]} />
        <h1>Цены на электрику в частном доме, Иркутск</h1>
        <p className="mt-4 text-[18px] text-ink/85 max-w-[62ch]">Главные цифры — дом под ключ от 3 500 ₽/м² с котельной, всеми материалами и работой (120 м² — от 420 000 ₽); по точкам — от 1 400 ₽ в газобетоне и каркасе, от 2 000 ₽ в брусе. Ниже — ориентиры по всем видам работ.</p>
        <div className="mt-5 flex flex-wrap gap-2">{ELEK.hub.chips.map((c) => <span key={c} className="chip">{c}</span>)}</div>

        <h2 className="mt-12 mb-4">Ориентиры по видам работ</h2>
        <div className="card overflow-x-auto">
          <table className="w-full text-[15px] min-w-[640px]">
            <thead className="text-left text-muted"><tr><th className="p-4">Работа</th><th className="p-4">Цена</th><th className="p-4">Примечание</th></tr></thead>
            <tbody>
              {ELEK.prices.map((r) => (
                <tr key={r.name} className="border-t border-line">
                  <td className="p-4 font-bold"><Link href={r.href} className="hover:text-brand">{r.name}</Link></td>
                  <td className="p-4 whitespace-nowrap font-bold"><Draft on={r.draft} note="уточнить">{r.price}</Draft></td>
                  <td className="p-4 text-muted">{r.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[14px] text-muted mt-3">Цены ориентировочные для Иркутска и Иркутского района, с материалами без фурнитуры и светильников. Точная смета — после бесплатного выезда инженера, фиксируется в договоре. Быстрая прикидка по точкам — в <Link href={EP.calc} className="text-brand underline">калькуляторе</Link>.</p>

        {elekObjects.length > 0 && (
          <>
            <h2 className="mt-12 mb-4">Дома с электроотоплением, которые мы делали</h2>
            <Draft note="свои объекты по электрике с ценой — ждём от клиента"><p className="text-muted max-w-[70ch] mb-4">{ELEK.objectsNote}</p></Draft>
            <div className="grid gap-4 md:grid-cols-4">
              {elekObjects.map((o) => (
                <Link key={o.slug} href={EP.object(o.slug)} className="card p-5 block hover:shadow-card h-full">
                  <div className="text-[13px] text-muted">{o.type}</div>
                  <div className="font-bold mt-1">{o.title}</div>
                  <div className="text-[14px] text-muted">{o.place}</div>
                  <div className="text-xl font-extrabold tracking-tight mt-2">{rub(o.price)}</div>
                </Link>
              ))}
            </div>
            <h2 className="mt-12 mb-6">Подробнее — со сметами</h2>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">{elekObjects.map((o) => <ObjectCard key={o.slug} o={o} />)}</div>
          </>
        )}
      </div>
      <FAQ items={faq} title="Вопросы про цены" />
      <ElectroLead source="цены электрика" />
    </>
  );
}
