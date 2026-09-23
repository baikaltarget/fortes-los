import Link from "next/link";
import { meta, ldService } from "@/lib/seo";
import { brandDirections, COMPLEX_PATH, P } from "@/lib/content";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import FAQ from "@/components/FAQ";
import LeadSection from "@/components/LeadSection";

/**
 * v37: рассрочка и кредит — общая страница бренда. До v37 ссылка «Рассрочка и кредит» в подвале
 * вела на /kanalizaciya/septik-v-rassrochku/ (про септики). Та страница осталась в разделе канализации.
 * Условия — как везде на сайте: через банки РФ на условиях банка, без обещаний «0-0-24».
 */
export const metadata = meta({
  title: "Рассрочка и кредит на инженерные системы дома в Иркутске | Фортес",
  description: "Скважина, водоснабжение, септик, отопление, вентиляция и электрика в рассрочку или кредит через банки РФ. Вся смета — оборудование, материалы и работы. Работаем с НДС.",
  path: "/rassrochka/",
});

const WHAT: Record<string, string> = {
  burenie: "бурение, обсадная колонна, кессон или адаптер, насос и автоматика",
  vodosnabzhenie: "ввод воды, узел ввода, разводка по дому, бойлер, канализация в доме",
  kanalizaciya: "станция Novo Eko, Zörde или Kolo Vesi с монтажом, септик из колец",
  otoplenie: "котёл и котельная, тёплый пол или радиаторы, автоматика",
  ventilyaciya: "вытяжки, приточные клапаны, установка с рекуперацией Turkov",
  elektrika: "ввод, щит, разводка, заземление, генератор с АВР",
};

const faq = [
  { q: "Какие банки?", a: "Сбербанк, Т-Банк, Альфа-Банк, ВТБ, Почта Банк, ОТП, Хоум Банк и другие. Если у вас уже есть одобренный лимит или предложение своего банка — работаем и с ним." },
  { q: "Какой первый взнос, срок и ставка?", a: "По условиям выбранного банка и программы. Конкретные цифры видны при подаче заявки — программы у банков меняются, поэтому заранее их не обещаем." },
  { q: "Можно оформить не всё, а одну систему?", a: "Да. В рассрочку или кредит оформляется любая смета: одна скважина, только отопление или весь дом целиком. В сумму входят оборудование, материалы и работы." },
  { q: "Работаете с юрлицами и НДС?", a: "Да. Договор, счёт с НДС, акты и УПД — для компаний, ИП, турбаз и застройщиков посёлков." },
];

export default function Page() {
  return (
    <>
      <JsonLd data={ldService({ name: "Рассрочка и кредит на инженерные системы частного дома", description: "Оформление рассрочки и кредита через банки РФ на скважину, водоснабжение, септик, отопление, вентиляцию и электрику", path: "/rassrochka/" })} />
      <div className="container-site">
        <Breadcrumbs items={[{ name: "Рассрочка и кредит", href: "/rassrochka/" }]} />
        <h1>Рассрочка и кредит на инженерные системы дома</h1>
        <p className="mt-4 text-[18px] text-ink/85 max-w-[64ch]">Любую нашу смету можно оформить в рассрочку или кредит через банки РФ — оборудование, материалы и работы целиком. Условия, срок и ставку определяет банк, мы помогаем подать заявку и получить решение, обычно в день обращения.</p>

        <h2 className="mt-12 mb-4">Как оформить</h2>
        <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            ["Смета", "Инженер бесплатно приезжает на участок и считает смету, она фиксируется в договоре."],
            ["Банк и срок", "Выбираете банк и программу — подскажем, где условия лучше под вашу сумму."],
            ["Заявка", "Онлайн прямо на участке или в офисе. Решение обычно в тот же день."],
            ["Монтаж", "После одобрения заказываем оборудование и выходим на объект по графику."],
          ].map(([t, d], i) => (
            <li key={t} className="card p-5 shadow-card">
              <span className="w-9 h-9 rounded-btn bg-ink text-white font-extrabold flex items-center justify-center">{i + 1}</span>
              <div className="mt-3 font-bold text-[18px]">{t}</div>
              <p className="mt-1 text-[15px] text-ink/80">{d}</p>
            </li>
          ))}
        </ol>

        <h2 className="mt-12 mb-4">Что можно оформить</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {brandDirections.map((d) => (
            <Link key={d.slug} href={`/${d.slug}/`} className="card p-5 hover:shadow-card flex flex-col">
              <span className="text-[19px] font-bold">{d.name}</span>
              <span className="mt-1 text-[15px] text-ink/80">{WHAT[d.slug] || d.what}</span>
              <span className="mt-auto pt-3 text-[14px] text-brand">Цены и подробности →</span>
            </Link>
          ))}
          <Link href={COMPLEX_PATH} className="card p-5 hover:shadow-card flex flex-col md:col-span-2 lg:col-span-3 border-2 border-ink/80">
            <span className="text-[19px] font-bold">Дом целиком одной бригадой</span>
            <span className="mt-1 text-[15px] text-ink/80">Все системы одной сметой в рассрочку — от скважины до электрики, этапы увязаны между собой.</span>
          </Link>
        </div>

        <h2 className="mt-12 mb-4">Другие способы оплаты</h2>
        <p className="text-ink/85 max-w-[70ch]">Наличные, карта через терминал, онлайн-оплата по ссылке. Организациям и ИП — договор, счёт и закрывающие документы с НДС. Подробно про станции очистки в рассрочку — на странице <Link href={P.page("septik-v-rassrochku")} className="text-brand underline underline-offset-2">«Септик в рассрочку»</Link>.</p>
      </div>
      <FAQ items={faq} title="Вопросы про рассрочку" />
      <LeadSection source="рассрочка" title="Посчитаем смету и подберём банк" />
    </>
  );
}
