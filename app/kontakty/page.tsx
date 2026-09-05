import { meta } from "@/lib/seo";
import { company } from "@/lib/content";
import Breadcrumbs from "@/components/Breadcrumbs";
import LeadForm from "@/components/LeadForm";

export const metadata = meta({ title: "Контакты Фортес — септики в Иркутске: телефон, адреса офисов, часы работы", description: `Фортес, Иркутск: ${company.phone}, ${company.hours}. Офисы: ${company.addresses.map((a) => a.street).join("; ")}. Выезд инженера по Иркутскому району бесплатно.`, path: "/kontakty/" });

export default function Page() {
  return (
    <div className="container-site">
      <Breadcrumbs items={[{ name: "Контакты", href: "/kontakty/" }]} />
      <h1>Контакты</h1>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="grid gap-4 content-start">
          <div className="card p-6">
            <a href={`tel:${company.phoneRaw}`} className="text-3xl font-extrabold tracking-tight">{company.phone}</a>
            <div className="text-muted mt-1">{company.hours}</div>
            <a href={`mailto:${company.email}`} className="block mt-3 text-brand underline">{company.email}</a>
          </div>
          {company.addresses.map((a) => (
            <div key={a.street} className="card p-6">
              <div className="text-muted text-[14px]">{a.label}</div>
              <div className="font-bold text-lg">{a.city}, {a.street}</div>
              {a.gis2Url && <a href={a.gis2Url} target="_blank" rel="noopener" className="mt-2 inline-block text-brand underline text-[14px]">Смотреть на 2ГИС →</a>}
            </div>
          ))}
          <div className="card p-6">
            <div className="font-bold text-ink mb-3">Написать</div>
            <div className="flex flex-wrap gap-2">
              <a href={company.telegramUrl} target="_blank" rel="noopener" className="btn-outline h-10 px-4">
                <img src="/img/icons/telegram.webp" width={16} height={16} alt="" className="rounded-[3px]" />Telegram
              </a>
              <a href={company.maxUrl} target="_blank" rel="noopener" className="btn-outline h-10 px-4">
                <img src="/img/icons/max.webp" width={16} height={16} alt="" className="rounded-[3px]" />MAX
              </a>
              <a href={company.yandexMapsUrl} target="_blank" rel="noopener" className="btn-outline h-10 px-4">Отзывы на Я.Картах</a>
            </div>
          </div>
          <div className="card overflow-hidden">
            <iframe
              src={`https://yandex.ru/map-widget/v1/?ll=104.270139%2C52.312492&z=11&l=map&pt=104.356757,52.276723,pm2rdm~104.183521,52.348261,pm2bdm`}
              width="100%"
              height="320"
              frameBorder="0"
              loading="lazy"
              title="Офисы Фортес на карте Иркутска"
              className="block"
            />
            <div className="p-3 text-[13px] text-muted flex flex-wrap gap-x-4 gap-y-1">
              <span><span className="inline-block w-2.5 h-2.5 rounded-full bg-brand mr-1.5 align-middle" />Офис 1 — ул. Ширямова, 7</span>
              <span><span className="inline-block w-2.5 h-2.5 rounded-full bg-[#3d7bf5] mr-1.5 align-middle" />Офис 2 — ул. Розы Люксембург, 164/1</span>
            </div>
          </div>
          <div className="card p-6 text-[15px] text-ink/80">
            <div className="font-bold text-ink">Зона выезда</div>
            <p className="mt-1">{company.serviceArea.join(", ")}. Инженер приезжает бесплатно.</p>
          </div>
        </div>
        <div id="lead" className="scroll-mt-24"><LeadForm source="контакты" /></div>
      </div>
    </div>
  );
}
