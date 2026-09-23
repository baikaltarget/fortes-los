import Link from "next/link";
import { meta, ldService } from "@/lib/seo";
import { company, getAnyObject, pickObjects, HP, NP, BP, VP, EP, P, getHeatService, getVentService, getBurService, getVodaService, getElekService, getService } from "@/lib/content";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import FAQ from "@/components/FAQ";
import LeadSection from "@/components/LeadSection";
import ObjectGrid from "@/components/ObjectGrid";

/**
 * v41: /yuridicheskim-licam/ — адрес со старого сайта fortes-group.ru, Яндекс его помнит.
 * Страница возвращена по тому же адресу (без редиректа), чтобы сохранить историю.
 * Задача — одна точка входа для компаний: условия работы + все B2B-услуги шести разделов.
 * Условия — только то, что уже подтверждено на сайте (договор, счёт с НДС, акты, УПД, реквизиты).
 */
const PATH = "/yuridicheskim-licam/";

export const metadata = meta({
  title: "Инженерные системы для юридических лиц в Иркутске — работа с НДС",
  description: "Отопление, вентиляция, скважины, водоснабжение, электрика и очистные для складов, цехов, СТО, офисов, турбаз и посёлков. Договор, счёт с НДС, акты и УПД.",
  path: PATH,
});

/** Услуги для бизнеса по разделам. Адрес проверяется при сборке: если страницу удалят, сборка упадёт. */
function must<T>(v: T | undefined, what: string): T {
  if (!v) throw new Error(`/yuridicheskim-licam/: нет страницы ${what}`);
  return v;
}
const GROUPS: { title: string; items: { name: string; href: string }[] }[] = [
  {
    title: "Отопление",
    items: [
      ["promyshlennoe-otoplenie", "Коммерческие и промышленные объекты"],
      ["otoplenie-sklada-angara", "Склады и ангары, воздушное отопление"],
      ["otoplenie-proizvodstva-ceha", "Цеха и производства"],
      ["otoplenie-avtoservisa-garazha", "Автосервисы и гаражные боксы"],
      ["proektirovanie-otopleniya", "Проект отопления"],
    ].map(([s, name]) => (must(getHeatService(s), s), { name, href: HP.page(s) })),
  },
  {
    title: "Вентиляция",
    items: [
      ["promyshlennaya-ventilyaciya", "Промышленная вентиляция"],
      ["pritochno-vytyazhnaya-ventilyaciya-pomeshchenij", "Офисы, магазины, кафе"],
      ["ventilyaciya-proizvodstvennyh-pomeshchenij", "Производственные помещения и склады"],
      ["aspiraciya", "Аспирация от станков"],
      ["proektirovanie-ventilyacii", "Проект вентиляции"],
    ].map(([s, name]) => (must(getVentService(s), s), { name, href: NP.page(s) })),
  },
  {
    title: "Вода и стоки",
    items: [
      (must(getBurService("burenie-dlya-snt-i-predpriyatij"), "бурение для предприятий"), { name: "Скважины для СНТ, турбаз и предприятий", href: BP.page("burenie-dlya-snt-i-predpriyatij") }),
      (must(getService("kanalizaciya-dlya-poselka"), "канализация для посёлка"), { name: "Очистные для посёлка, турбазы, гостиницы", href: P.page("kanalizaciya-dlya-poselka") }),
      (must(getVodaService("vvod-vody-iz-centralnogo-vodoprovoda"), "центральный водопровод"), { name: "Подключение к центральному водопроводу", href: VP.page("vvod-vody-iz-centralnogo-vodoprovoda") }),
      (must(getVodaService("vodosnabzhenie-i-kanalizaciya-pod-klyuch"), "вода и канализация"), { name: "Вода и канализация в здании под ключ", href: VP.page("vodosnabzhenie-i-kanalizaciya-pod-klyuch") }),
    ],
  },
  {
    title: "Электрика",
    items: [
      (must(getElekService("vvod-elektrichestva-v-dom"), "ввод"), { name: "Ввод электричества, 380 В", href: EP.page("vvod-elektrichestva-v-dom") }),
      (must(getElekService("sborka-elektroshchita"), "щит"), { name: "Сборка и монтаж щитов", href: EP.page("sborka-elektroshchita") }),
      (must(getElekService("podklyuchenie-generatora-avr"), "АВР"), { name: "Резервное питание: генератор и АВР", href: EP.page("podklyuchenie-generatora-avr") }),
      (must(getElekService("proekt-elektriki"), "проект"), { name: "Проект электроснабжения", href: EP.page("proekt-elektriki") }),
    ],
  },
];

const HOW = [
  ["Договор и документы", "Договор подряда, счёт с НДС, акты выполненных работ и УПД. Оборудование и материалы — в той же смете, отдельными строками."],
  ["Смета до договора", "Инженер бесплатно выезжает на объект, снимает размеры и нагрузки, готовит коммерческое предложение. Цена и сроки фиксируются в договоре."],
  ["Проект, если нужен", "Для отопления, вентиляции и электрики делаем проект сами — для согласований, экспертизы или просто чтобы монтаж шёл по чертежу."],
  ["Одна бригада на всё", "Отопление, вентиляция, вода, стоки и электрика — один подрядчик и один ответственный, без стыковки пяти организаций на объекте."],
];

const faq = [
  { q: "Работаете с НДС?", a: "Да. Договор, счёт с НДС, акты и УПД — для компаний, ИП, турбаз и застройщиков посёлков." },
  { q: "Можно заказать только проект?", a: "Да, проект отопления, вентиляции или электрики делаем отдельно. При монтаже под ключ проект входит в стоимость." },
  { q: "Сколько стоят работы на коммерческом объекте?", a: "Цена по запросу: она зависит от площади, высоты помещений, теплопотерь, воздухообмена и нагрузок. Инженер приезжает бесплатно, после выезда готовим коммерческое предложение с разбивкой по оборудованию, материалам и работам." },
  { q: "Где работаете?", a: `Иркутск, Иркутский район, Ангарск, Шелехов. Объекты в других районах Иркутской области — по согласованию.` },
];

export default function Page() {
  const voronezh = getAnyObject("irkutsk-voronezhskaya-kommercheskoe-350");
  const cases = pickObjects([voronezh, getAnyObject("patrony-park-skvazhina-52"), getAnyObject("novo-razvodnaya-kirpich-450"), getAnyObject("rusyj-dom-150-garazh-90")], "otoplenie");
  return (
    <>
      <JsonLd data={ldService({ name: "Инженерные системы для юридических лиц", description: "Отопление, вентиляция, скважины, водоснабжение, электрика и очистные сооружения для коммерческих и промышленных объектов, работа с НДС", path: PATH })} />
      <div className="container-site">
        <Breadcrumbs items={[{ name: "Юридическим лицам", href: PATH }]} />
        <h1>Инженерные системы для юридических лиц</h1>
        <p className="mt-4 text-[18px] text-ink/85 max-w-[66ch]">Склады, цеха, автосервисы, офисы, магазины, турбазы и коттеджные посёлки в Иркутске и Иркутском районе. Проект, оборудование и монтаж одной организацией — по договору, со счётом и закрывающими документами с НДС.</p>

        <h2 className="mt-12 mb-4">Как работаем с организациями</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {HOW.map(([t, d]) => (
            <div key={t} className="card p-5">
              <div className="font-bold text-[18px]">{t}</div>
              <p className="mt-2 text-[15px] text-ink/80">{d}</p>
            </div>
          ))}
        </div>

        <h2 className="mt-12 mb-4">Что делаем для бизнеса</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {GROUPS.map((g) => (
            <div key={g.title} className="card p-5 md:p-6">
              <div className="text-[20px] font-bold">{g.title}</div>
              <ul className="mt-3 divide-y divide-ink/10">
                {g.items.map((i) => (
                  <li key={i.href}>
                    <Link href={i.href} className="flex items-baseline justify-between gap-4 py-2.5 hover:text-brand">
                      <span>{i.name}</span>
                      <span className="text-brand text-[14px] whitespace-nowrap">по запросу</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <h2 className="mt-12 mb-2">Объекты</h2>
        <p className="mb-5 text-ink/80 max-w-[70ch]">Коммерческое здание 350 м² на Воронежской — отопление, вода и канализация под ключ за 1 303 000 ₽; скважина с двумя септиками на 4 точки в Патронах; большие дома, где в одной смете котельная, вода и стоки.</p>
        <ObjectGrid items={cases} section="otoplenie" />

        <h2 className="mt-12 mb-4">Реквизиты</h2>
        <div className="card p-5 md:p-6 max-w-[640px] text-[16px]">
          <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2">
            <dt className="text-muted">Исполнитель</dt><dd>{company.legalName}</dd>
            <dt className="text-muted">ИНН</dt><dd>{company.inn}</dd>
            <dt className="text-muted">ОГРНИП</dt><dd>{company.ogrn}</dd>
            <dt className="text-muted">Телефон</dt><dd><a href={`tel:${company.phoneRaw}`} className="underline underline-offset-2">{company.phone}</a></dd>
            <dt className="text-muted">Почта</dt><dd><a href={`mailto:${company.email}`} className="underline underline-offset-2">{company.email}</a></dd>
          </dl>
          <p className="mt-4 text-[14px] text-muted">Полные реквизиты для договора пришлём по запросу вместе с коммерческим предложением.</p>
        </div>
      </div>
      <FAQ items={faq} title="Вопросы организаций" />
      <LeadSection source="юрлица" title="Запросить коммерческое предложение" text="Опишите объект — площадь, назначение, что нужно сделать. Инженер перезвонит, согласует выезд и подготовит КП с разбивкой по оборудованию, материалам и работам." />
    </>
  );
}
