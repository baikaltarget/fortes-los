import Link from "next/link";
import { meta } from "@/lib/seo";
import { products, objects, rub, turnkeyFrom, SITE } from "@/lib/content";
import Breadcrumbs from "@/components/Breadcrumbs";
import LeadSection from "@/components/LeadSection";
import FAQ from "@/components/FAQ";
import Draft from "@/components/Draft";

export const metadata = meta({
  title: "Септики в Иркутске — цены с установкой под ключ 2026 | Фортес",
  description: "Цены на септики и станции биологической очистки в Иркутске: Novo Eko от 149 900 ₽, Zörde от 164 900 ₽, Kolo Vesi от 187 900 ₽. Стоимость монтажа под ключ, кессоны, ёмкости, обслуживание. Реальные сметы с объектов.",
  path: "/ceny/",
});

const faq = [
  { q: "Почему цены на станции одинаковые у всех дилеров?", a: "Завод устанавливает рекомендованную розничную цену. Разница между дилерами — в качестве монтажа, сервисе и гарантии на месте." },
  { q: "Что может увеличить стоимость монтажа?", a: "Трасса от дома длиннее 10 м, глина или скала, принудительный отвод, мёрзлый грунт зимой, необходимость анкерных плит при высокой воде." },
  { q: "Действует ли рассрочка на монтаж?", a: "Да, в рассрочку 0-0-24 оформляется вся смета: станция и работы." },
];

export default function Page() {
  return (
    <>
      <div className="container-site">
        <Breadcrumbs items={[{ name: "Цены", href: "/ceny/" }]} />
        <h1>Цены на септики в Иркутске</h1>
        <p className="mt-4 text-[18px] text-ink/85 max-w-[62ch]">Станции — по рекомендованным ценам завода. Монтаж — от, потому что зависит от участка. Ниже реальные сметы с объектов, чтобы было с чем сравнить.</p>

        <h2 className="mt-12 mb-4">Станции биологической очистки</h2>
        <div className="card overflow-x-auto">
          <table className="w-full text-[15px] min-w-[640px]">
            <thead className="text-left text-muted"><tr><th className="p-4">Модель</th><th className="p-4">Пользователей</th><th className="p-4">Обслуживание</th><th className="p-4">Станция</th><th className="p-4">Под ключ от</th></tr></thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.slug} className="border-t border-line">
                  <td className="p-4 font-bold"><Link href={`/stancii/${p.slug}/`} className="hover:text-brand">{p.name}</Link>{p.hit && <span className="ml-2 text-[11px] text-brand font-bold">хит</span>}</td>
                  <td className="p-4">{p.users}</td>
                  <td className="p-4">{p.service}</td>
                  <td className="p-4 whitespace-nowrap font-medium">{rub(p.price)}</td>
                  <td className="p-4 whitespace-nowrap"><Draft on={p.installFromDraft} note="монтаж — уточнить">{rub(turnkeyFrom(p))}</Draft></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[14px] text-muted mt-3">Midi (+0,5 м горловина) — примерно +17 000 ₽, Long (+1 м) — +24 000 ₽ к цене станции. Точные цены комплектаций — на странице модели.</p>

        <h2 className="mt-12 mb-4">Другие решения</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { n: "Кессоны СОЮЗ для скважины", p: "66 500 – 160 900 ₽", h: "/kesson-dlya-skvazhiny/" },
            { n: "Септик «Дача» без электричества", p: "83 600 – 97 800 ₽", h: "/septik-dacha/" },
            { n: "Накопительные ёмкости 2,5–10 м³", p: "138 600 – 307 600 ₽", h: "/nakopitelnaya-emkost/" },
            { n: "Kolo Ilma для посёлка", p: "от 947 490 ₽", h: "/kanalizaciya-dlya-poselka/" },
            { n: "Монтаж станции", p: "от 55 000 ₽", h: "/montazh-septika/", d: true },
            { n: "Плановое обслуживание", p: "от 6 000 ₽", h: "/obsluzhivanie-septika/", d: true },
          ].map((r) => (
            <Draft key={r.n} on={!!r.d} note="цена — уточнить"><Link href={r.h} className="card p-5 block hover:shadow-card h-full"><div className="font-bold">{r.n}</div><div className="text-xl font-extrabold tracking-tight mt-1">{r.p}</div></Link></Draft>
          ))}
        </div>

        <h2 className="mt-12 mb-4">Реальные сметы с объектов</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {objects.map((o) => (
            <Draft key={o.slug} on={o.draft} note="объект-пример"><Link href={`/obekty/${o.slug}/`} className="card p-5 block hover:shadow-card h-full">
              <div className="text-[13px] text-muted">{o.place} · {o.type}</div>
              <div className="font-bold mt-1">{o.productName}</div>
              <div className="text-2xl font-extrabold tracking-tight mt-2">{rub(o.price)} под ключ</div>
            </Link></Draft>
          ))}
        </div>
      </div>
      <FAQ items={faq} />
      <LeadSection source="цены" title="Точная смета — после бесплатного замера" />
    </>
  );
}
