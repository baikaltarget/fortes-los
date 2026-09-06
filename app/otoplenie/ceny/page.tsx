import Link from "next/link";
import { meta } from "@/lib/seo";
import { HEAT, heatObjects, rub, HP } from "@/lib/content";
import Breadcrumbs from "@/components/Breadcrumbs";
import FAQ from "@/components/FAQ";
import Draft from "@/components/Draft";
import HeatLead from "@/components/HeatLead";
import ObjectCard from "@/components/ObjectCard";

export const metadata = meta({
  title: "Цены на монтаж отопления в Иркутске 2026 — тёплый пол, котельная, радиаторы | Фортес",
  description: "Стоимость отопления частного дома в Иркутске: дом 120 м² под ключ — 470 680 ₽, тёплый пол от 2 500 ₽/м², котельная на электрокотле от 150 000 ₽, радиаторы от 6 000 ₽ за точку. Шесть реальных смет с объектов.",
  path: HP.ceny,
});

const faq = [
  { q: "Почему нет точной цены за квадратный метр?", a: "Потому что два дома по 150 м² могут отличаться в два раза: один с тёплым полом на первом этаже и радиаторами наверху на электрокотле, другой — с полами везде, нержавейкой в котельной, тепловым насосом и автоматикой по комнатам. Ориентиры на этой странице — чтобы понимать порядок, точную смету инженер считает бесплатно после выезда." },
  { q: "Что может увеличить стоимость?", a: "Нержавейка вместо полипропилена в котельной, второй котёл или теплоаккумулятор при слабых сетях, внутрипольные конвекторы под панорамные окна, автоматика по комнатам, водоснабжение и канализация одним договором, удалённость объекта с проживанием бригады." },
  { q: "Действует ли рассрочка на всю смету?", a: "Да, в рассрочку или кредит через банки РФ оформляется вся смета: оборудование и работы, на условиях банка. Организациям — безнал с НДС." },
  { q: "Входит ли оборудование в цену объектов?", a: "Да, все цены объектов на этой странице — под ключ: котёл, насосы, трубы, радиаторы, коллекторы, работа, опрессовка и пусконаладка. Без скрытых доплат." },
];

export default function Page() {
  return (
    <>
      <div className="container-site">
        <Breadcrumbs items={[{ name: "Отопление", href: HP.hub }, { name: "Цены", href: HP.ceny }]} />
        <h1>Цены на отопление в Иркутске</h1>
        <p className="mt-4 text-[18px] text-ink/85 max-w-[62ch]">Главная цифра — под ключ с оборудованием. Дом 120 м² с тёплым полом и котельной — 470 680 ₽, около 3 900 ₽ за м². Ниже ориентиры по видам работ и шесть реальных смет, чтобы было с чем сравнить.</p>

        <h2 className="mt-12 mb-4">Ориентиры по видам работ</h2>
        <div className="card overflow-x-auto">
          <table className="w-full text-[15px] min-w-[640px]">
            <thead className="text-left text-muted"><tr><th className="p-4">Работа</th><th className="p-4">Цена</th><th className="p-4">Примечание</th></tr></thead>
            <tbody>
              {HEAT.prices.map((r) => (
                <tr key={r.name} className="border-t border-line">
                  <td className="p-4 font-bold"><Link href={r.href} className="hover:text-brand">{r.name}</Link></td>
                  <td className="p-4 whitespace-nowrap font-bold"><Draft on={r.draft} note="уточнить">{r.price}</Draft></td>
                  <td className="p-4 text-muted">{r.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[14px] text-muted mt-3">Цены ориентировочные для домов в Иркутске и Иркутском районе. Точная смета — после бесплатного выезда инженера, фиксируется в договоре. Быстрая прикидка — в <Link href={HP.calc} className="text-brand underline">калькуляторе</Link>.</p>

        <h2 className="mt-12 mb-4">Реальные объекты с ценой под ключ</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {heatObjects.map((o) => (
            <Link key={o.slug} href={HP.object(o.slug)} className="card p-5 block hover:shadow-card h-full">
              <div className="text-[13px] text-muted">{o.type}</div>
              <div className="font-bold mt-1">{o.title}</div>
              <div className="text-[14px] text-muted">{o.place}</div>
              <div className="text-xl font-extrabold tracking-tight mt-2">{rub(o.price)}</div>
            </Link>
          ))}
        </div>

        <h2 className="mt-12 mb-6">Подробнее — со сметами и фото</h2>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{heatObjects.slice(0, 3).map((o) => <ObjectCard key={o.slug} o={o} />)}</div>
      </div>
      <FAQ items={faq} title="Вопросы про цены" />
      <HeatLead source="цены отопление" />
    </>
  );
}
