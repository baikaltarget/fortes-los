import Link from "next/link";
import { meta } from "@/lib/seo";
import { BUR, burGeo, BP } from "@/lib/content";
import Breadcrumbs from "@/components/Breadcrumbs";
import Draft from "@/components/Draft";
import DrillLead from "@/components/DrillLead";
import FAQ from "@/components/FAQ";

export const metadata = meta({
  title: "Карта глубин скважин Иркутского района — на какой глубине вода по посёлкам | Фортес",
  description: "Глубина скважин на воду по посёлкам Иркутского района: Хомутово, Маркова, Пивовариха, Байкальский тракт, Мельничная Падь и ещё 20 населённых пунктов. Карта наших скважин, грунты, качество воды, конструкция обсадки.",
  path: BP.map,
});

const faq = [
  { q: "Откуда данные на карте?", a: "Это наши скважины с 2014 года и данные соседних скважин, которые мы замеряли при обустройстве и добуривании. Точки на карте — реальные объекты с глубиной и конструкцией." },
  { q: "Насколько точен ориентир по посёлку?", a: "В пределах улицы разброс обычно 5–15 м, между концами большого посёлка может быть и 30 м. Поэтому до выезда сверяем именно вашу улицу, а в договоре фиксируем цену метра, а не общую сумму." },
  { q: "Как пользоваться картой?", a: "Найдите свой посёлок или ближайшую точку, посмотрите глубину. Затем подставьте её в калькулятор — получите ориентир по цене. Точнее — после бесплатного выезда инженера." },
];

export default function Page() {
  return (
    <>
      <div className="container-site">
        <Breadcrumbs items={[{ name: "Бурение", href: BP.hub }, { name: "Карта глубин", href: BP.map }]} />
        <h1>{BUR.depthMap.title}</h1>
        <p className="mt-4 text-[18px] text-ink/85 max-w-[62ch]">{BUR.depthMap.lead}</p>
        <div className="card overflow-hidden mt-8">
          <iframe src={BUR.depthMap.iframe} title="Карта глубин скважин Фортес" width="100%" height="520" frameBorder="0" loading="lazy" allowFullScreen className="block w-full" />
        </div>

        <h2 className="mt-12 mb-4">Глубина воды по посёлкам</h2>
        <Draft on={BUR.geoNote.depthDraft} note="глубины по посёлкам — ориентир, уточнить у клиента">
          <div className="card overflow-x-auto">
            <table className="w-full text-[15px] min-w-[760px]">
              <thead className="text-left text-muted"><tr><th className="p-4">Посёлок</th><th className="p-4">Вода</th><th className="p-4">Грунт</th><th className="p-4">Качество воды</th><th className="p-4">Конструкция</th></tr></thead>
              <tbody>
                {burGeo.map((g) => (
                  <tr key={g.slug} className="border-t border-line">
                    <td className="p-4 font-bold"><Link href={BP.geo(g.slug)} className="hover:text-brand">{g.name}</Link><div className="text-[12px] text-muted font-normal">{g.distance}, {g.tract}</div></td>
                    <td className="p-4 whitespace-nowrap font-bold">{g.depth}</td>
                    <td className="p-4 text-muted">{g.soil}</td>
                    <td className="p-4 text-muted">{g.water}</td>
                    <td className="p-4 text-muted">{g.construction}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Draft>
        <p className="text-[14px] text-muted mt-3">{BUR.geoNote.text} Посчитать по своей глубине — в <Link href={BP.calc} className="text-brand underline">калькуляторе</Link>.</p>
      </div>
      <FAQ items={faq} title="Вопросы про карту глубин" />
      <DrillLead source="карта глубин" title="Скажем глубину по вашей улице" text="Оставьте телефон и посёлок — инженер посмотрит соседние скважины по базе, назовёт ориентир по глубине и цене метра и запишет на бесплатный выезд." />
    </>
  );
}
