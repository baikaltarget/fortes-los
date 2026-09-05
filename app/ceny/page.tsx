import Link from "next/link";
import { meta } from "@/lib/seo";
import { products, objects, rub, turnkeyFrom, SITE, P } from "@/lib/content";
import Breadcrumbs from "@/components/Breadcrumbs";
import LeadSection from "@/components/LeadSection";
import FAQ from "@/components/FAQ";
import Draft from "@/components/Draft";

export const metadata = meta({
  title: "Септики в Иркутске — цены с установкой под ключ 2026 | Фортес",
  description: "Цены на септики под ключ в Иркутске: Novo Eko 3 и Zörde 4 от 350 000 ₽, Novo Eko 5 от 450 000 ₽ с доставкой и монтажом. Kolo Vesi, кессоны, обслуживание. Реальные сметы с объектов.",
  path: "/ceny/",
});

const faq = [
  { q: "Почему цены на станции одинаковые у всех дилеров?", a: "Завод устанавливает рекомендованную розничную цену. Разница между дилерами — в качестве монтажа, сервисе и гарантии на месте." },
  { q: "Что может увеличить стоимость монтажа?", a: "Расстояние от дома до септика (стандартно считаем до 10 м), глина или скала, принудительный отвод, мёрзлый грунт зимой, анкерные плиты при высоком уровне грунтовых вод." },
  { q: "Действует ли рассрочка на монтаж?", a: "Да, в рассрочку или кредит оформляется вся смета: станция и работы. Условия — по выбранному банку." },
];

export default function Page() {
  return (
    <>
      <div className="container-site">
        <Breadcrumbs items={[{ name: "Цены", href: "/ceny/" }]} />
        <h1>Цены на септики в Иркутске</h1>
        <p className="mt-4 text-[18px] text-ink/85 max-w-[62ch]">Главная цифра — под ключ: станция, доставка в Иркутск, монтаж, трубы, электрика и отвод воды. Novo Eko 3 и Zörde 4 — от 350 000 ₽, Novo Eko 5 — от 450 000 ₽. Ниже реальные сметы с объектов, чтобы было с чем сравнить.</p>

        <h2 className="mt-12 mb-4">Станции биологической очистки</h2>
        <div className="card overflow-x-auto">
          <table className="w-full text-[15px] min-w-[640px]">
            <thead className="text-left text-muted"><tr><th className="p-4">Модель</th><th className="p-4">Пользователей</th><th className="p-4">Обслуживание</th><th className="p-4">Под ключ с монтажом</th></tr></thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.slug} className="border-t border-line">
                  <td className="p-4 font-bold"><Link href={P.product(p.slug)} className="hover:text-brand">{p.name}</Link>{p.hit && <span className="ml-2 text-[11px] text-brand font-bold">хит</span>}</td>
                  <td className="p-4">{p.users}</td>
                  <td className="p-4">{p.service}</td>
                  <td className="p-4 whitespace-nowrap font-bold"><Draft on={p.turnkeyDraft} note="уточнить">от {rub(turnkeyFrom(p))}</Draft></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[14px] text-muted mt-3">В цену под ключ входит станция, доставка в Иркутск, котлован, монтаж, засыпка, труба от дома до 10 м, электрика и отвод воды. Комплектации Midi и Long (удлинённая горловина) дороже базовой — считаем на замере.</p>

        <h2 className="mt-12 mb-4">Другие решения</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { n: "Кессоны СОЮЗ для скважины", p: "66 500 – 160 900 ₽", h: "/kanalizaciya/kesson-dlya-skvazhiny/" },
            { n: "Kolo Ilma 30/50/75 для посёлка", p: "по запросу", h: "/kanalizaciya/kanalizaciya-dlya-poselka/" },
            { n: "Станция под ключ", p: "от 350 000 ₽", h: "/kanalizaciya/montazh-septika/" },
            { n: "Плановое обслуживание", p: "от 10 000 ₽", h: "/kanalizaciya/obsluzhivanie-septika/" },
          ].map((r) => (
            <Link key={r.n} href={r.h} className="card p-5 block hover:shadow-card h-full"><div className="font-bold">{r.n}</div><div className="text-xl font-extrabold tracking-tight mt-1">{r.p}</div></Link>
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
