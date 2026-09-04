import { meta } from "@/lib/seo";
import { company } from "@/lib/content";
import Breadcrumbs from "@/components/Breadcrumbs";
import LeadSection from "@/components/LeadSection";
import Draft from "@/components/Draft";
import Steps from "@/components/Steps";

export const metadata = meta({ title: "О компании Фортес — септики, отопление, водоснабжение в Иркутске с 2014 года", description: "Фортес — инженерная компания в Иркутске: с 2014 года, 1100+ объектов. Официальный дилер заводов Kolo Vesi и Экомир. Своя бригада, гарантия и сервис на месте.", path: "/o-kompanii/" });

export default function Page() {
  return (
    <>
      <div className="container-site">
        <Breadcrumbs items={[{ name: "О компании", href: "/o-kompanii/" }]} />
        <h1>Фортес: инженерные системы для дома с {company.foundedYear} года</h1>
        <div className="mt-6 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div className="prose-site">
            <p>Мы делаем всё, что закопано и спрятано в стенах загородного дома: отопление, водоснабжение, бурение скважин, электрику и канализацию. За {new Date().getFullYear() - company.foundedYear} лет — {company.objectsDone} объектов в Иркутске и области.</p>
            <p>Канализацию мы начинали как дополнение к водоснабжению, а сейчас это отдельное направление: официальное дилерство завода Kolo Vesi (станции Kolo Vesi, Novo Eko, Zörde, Kolo Ilma) и завода Экомир (кессоны СОЮЗ для скважин).</p>
            <h2>Почему это важно для вас</h2>
            <p>Дилерство означает цены завода, обучение монтажников на производстве и гарантийные вопросы, которые решаем мы в Иркутске, а не колл-центр в Петербурге. Своя бригада — значит один ответственный за замер, смету, монтаж и сервис.</p>
            <h2>Реквизиты</h2>
            <p>{company.legalName}<br />ИНН {company.inn}, ОГРН {company.ogrn}<br />{company.addresses.map((a) => `${a.city}, ${a.street}`).join(" · ")}</p>
          </div>
          <div className="grid gap-4 content-start">
            {[[String(company.foundedYear), "год основания"], [company.objectsDone, "выполненных объектов"], ["6", "способов оплаты"], ["1", "офис в Иркутске"]].map(([a, b]) => (
              <div key={b} className="card p-6"><div className="text-4xl font-extrabold tracking-tight">{a}</div><div className="text-muted">{b}</div></div>
            ))}
            <Draft note="сертификаты дилера — загрузить сканы в public/img/certs"><div className="card p-6"><h3>Сертификаты дилера</h3><p className="mt-2 text-[15px] text-muted">Сертификаты Kolo Vesi и Экомир, дипломы обучения монтажников.</p></div></Draft>
          </div>
        </div>
      </div>
      <Steps />
      <LeadSection source="о компании" />
    </>
  );
}
