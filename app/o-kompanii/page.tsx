import Link from "next/link";
import { meta } from "@/lib/seo";
import { company, BRAND, brandDirections } from "@/lib/content";
import Breadcrumbs from "@/components/Breadcrumbs";
import LeadSection from "@/components/LeadSection";
import Steps from "@/components/Steps";
import Certificates from "@/components/Certificates";
import Dealers from "@/components/Dealers";

export const metadata = meta({ title: "О компании Фортес — инженерные системы для дома в Иркутске с 2014", description: "Фортес — инженерная компания в Иркутске: с 2014 года, 1100+ объектов. Отопление, скважины, вода, канализация, электрика своей бригадой. Дилер Kolo Vesi и Экомир, два офиса.", path: "/o-kompanii/" });

/** Страница бренда (v29): до этого была написана под септики. Дипломы — components/Certificates, данные в brand.json → certs */
export default function Page() {
  const years = new Date().getFullYear() - company.foundedYear;
  return (
    <>
      <div className="container-site">
        <Breadcrumbs items={[{ name: "О компании", href: "/o-kompanii/" }]} />
        <h1>Фортес: инженерные системы для дома с {company.foundedYear} года</h1>
        <div className="mt-6 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div className="prose-site">
            <p>Мы делаем всё, что закопано в участке и спрятано в стенах загородного дома: бурение скважин, водоснабжение, канализацию, отопление, вентиляцию и электрику. За {years} лет — {company.objectsDone} объектов в Иркутске, Иркутском районе, Ангарске и Шелехове: от дачной бани до коттеджа 450 м² и коммерческих помещений.</p>
            <p>Начинали с отопления и водоснабжения, потом добавили бурение, канализацию, электрику и вентиляцию — так, чтобы <Link href="/inzhenernye-seti-pod-klyuch/">дом целиком</Link> можно было сделать одной бригадой, без стыков между подрядчиками. Каждое направление при этом работает и отдельно.</p>
            <h2>Что за этим стоит</h2>
            <p>Своя бригада и инженер, а не субподряд: один человек отвечает за замер, смету, монтаж и сервис. Официальное дилерство заводов Kolo Vesi (станции Kolo Vesi, Novo Eko, Zörde, Kolo Ilma), Alta Group (станции Alta Bio), Экомир (кессоны СОЮЗ), ZONT (автоматика отопления), Gidruss (котельное оборудование) и Turkov (вентиляция) — это цены завода и гарантийные вопросы, которые решаем мы в Иркутске. Монтажники проходят обучение у производителей, которых ставим: STOUT, VALTEC, Zota, Kospel, Turkov. Своё производство ЖБИ для кессонов и переливных септиков.</p>
            <h2>Направления</h2>
            <ul>
              {brandDirections.map((d) => <li key={d.slug}><Link href={`/${d.slug}/`}>{d.name}</Link> — {d.what}</li>)}
            </ul>
            <h2>Реквизиты</h2>
            <p>{company.legalName}<br />ИНН {company.inn}, ОГРН {company.ogrn}<br />{company.addresses.map((a) => `${a.city}, ${a.street}`).join(" · ")}<br /><Link href="/kontakty/">Контакты и карта</Link></p>
          </div>
          <div className="grid gap-4 content-start sm:grid-cols-2 lg:grid-cols-1">
            {[[String(company.foundedYear), "год основания"], [company.objectsDone, "выполненных объектов"], [String(brandDirections.length), "направлений одной бригадой"], [String(company.addresses.length), "офиса в Иркутске"]].map(([a, b]) => (
              <div key={b} className="card p-6"><div className="text-4xl font-extrabold tracking-tight">{a}</div><div className="text-muted">{b}</div></div>
            ))}
          </div>
        </div>
      </div>
      <Dealers />
      <Certificates />
      <Steps items={BRAND.steps} />
      <LeadSection source="о компании" />
    </>
  );
}
