import Link from "next/link";
import { meta } from "@/lib/seo";
import { VENT, ventObjects, rub, NP } from "@/lib/content";
import Breadcrumbs from "@/components/Breadcrumbs";
import FAQ from "@/components/FAQ";
import Draft from "@/components/Draft";
import VentLead from "@/components/VentLead";
import ObjectCard from "@/components/ObjectCard";

export const metadata = meta({
  title: "Цены на вентиляцию в Иркутске 2026 — дом от 50 000 ₽, бизнес по запросу",
  description: "Сколько стоит вентиляция в Иркутске: дом под ключ от 50 000 ₽, установка с рекуперацией Turkov, вытяжка санузла, клапаны, бризеры. Офисы, кафе, цеха — по запросу.",
  path: NP.ceny,
});

const faq = [
  { q: "Почему для дома есть «от», а для бизнеса — по запросу?", a: "В частном доме набор типовой: санузлы, кухня, котельная, спальни — и минимальная схема укладывается в 50 000 ₽. В офисе, кафе или цехе цена зависит от расхода воздуха, вредностей, требований санитарных норм и высоты потолков — считаем по проекту после осмотра." },
  { q: "Что входит в 50 000 ₽?", a: "Канальные вытяжные вентиляторы санузлов и кухни, утеплённые воздуховоды на чердаке, проход кровли, решётки, обратные клапаны, приточные клапаны в спальнях, подключение и пусконаладка для дома до 120 м²." },
  { q: "Что может увеличить стоимость?", a: "Приточно-вытяжная установка с рекуперацией и воздуховоды в каждую комнату, готовые чистовые потолки (короба, разборка), бризеры вместо клапанов, автоматика по CO₂, вентиляция бассейна или сауны, длинные трассы на чердаке." },
  { q: "Действует ли рассрочка?", a: "Да, в рассрочку или кредит через банки РФ на условиях банка — на оборудование и работы. Организациям — договор с НДС." },
];

export default function Page() {
  return (
    <>
      <div className="container-site">
        <Breadcrumbs items={[{ name: "Вентиляция", href: NP.hub }, { name: "Цены", href: NP.ceny }]} />
        <h1>Цены на вентиляцию в Иркутске</h1>
        <p className="mt-4 text-[18px] text-ink/85 max-w-[62ch]">Главные цифры: вентиляция частного дома под ключ — от 50 000 ₽, приточно-вытяжная система с рекуперацией Turkov — по расчёту, коммерческие и промышленные объекты — по запросу. Ниже — ориентиры по позициям.</p>
        <div className="mt-5 flex flex-wrap gap-2">{VENT.hub.chips.map((c) => <span key={c} className="chip">{c}</span>)}</div>

        <h2 className="mt-12 mb-4">Ориентиры по видам работ</h2>
        <div className="card overflow-x-auto">
          <table className="w-full text-[15px] min-w-[640px]">
            <thead className="text-left text-muted"><tr><th className="p-4">Работа</th><th className="p-4">Цена</th><th className="p-4">Примечание</th></tr></thead>
            <tbody>
              {VENT.prices.map((r) => (
                <tr key={r.name} className="border-t border-line">
                  <td className="p-4 font-bold"><Link href={r.href} className="hover:text-brand">{r.name}</Link></td>
                  <td className="p-4 whitespace-nowrap font-bold"><Draft on={r.draft} note="уточнить">{r.price}</Draft></td>
                  <td className="p-4 text-muted">{r.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[14px] text-muted mt-3">Цены ориентировочные для Иркутска и Иркутского района, с материалами и оборудованием. Точная смета — после бесплатного выезда инженера, фиксируется в договоре. Быстрая прикидка — в <Link href={NP.calc} className="text-brand underline">калькуляторе</Link>.</p>

        {ventObjects.length > 0 && (
          <>
            <h2 className="mt-12 mb-4">Объекты, где делали инженерку целиком</h2>
            <Draft note="свои объекты по вентиляции с ценой — ждём от клиента"><p className="text-muted max-w-[70ch] mb-4">{VENT.objectsNote}</p></Draft>
            <div className="grid gap-4 md:grid-cols-4">
              {ventObjects.map((o) => (
                <Link key={o.slug} href={NP.object(o.slug)} className="card p-5 block hover:shadow-card h-full">
                  <div className="text-[13px] text-muted">{o.type}</div>
                  <div className="font-bold mt-1">{o.title}</div>
                  <div className="text-[14px] text-muted">{o.place}</div>
                  <div className="text-xl font-extrabold tracking-tight mt-2">{rub(o.price)}</div>
                </Link>
              ))}
            </div>
            <h2 className="mt-12 mb-6">Подробнее — со сметами</h2>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">{ventObjects.map((o) => <ObjectCard key={o.slug} o={o} />)}</div>
          </>
        )}
      </div>
      <FAQ items={faq} title="Вопросы про цены" />
      <VentLead source="цены вентиляция" />
    </>
  );
}
