import { meta } from "@/lib/seo";
import { SITE, company } from "@/lib/content";
import Breadcrumbs from "@/components/Breadcrumbs";
import Draft from "@/components/Draft";
import LeadSection from "@/components/LeadSection";

export const metadata = meta({ title: "Отзывы о Фортес — септики и канализация в Иркутске", description: "Отзывы клиентов Фортес об установке септиков Novo Eko, Zörde, Kolo Vesi в Иркутске и районе. Реальные объекты со сметами.", path: "/otzyvy/" });

export default function Page() {
  return (
    <>
      <div className="container-site">
        <Breadcrumbs items={[{ name: "Отзывы", href: "/otzyvy/" }]} />
        <h1>Отзывы клиентов</h1>
        <p className="mt-4 text-[18px] text-ink/85 max-w-[62ch]">Собираем отзывы с Яндекс.Карт, 2ГИС и из переписки после монтажа. Лучший отзыв — объект со сметой, они в разделе «Объекты».</p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {SITE.reviews.map((r) => (
            <Draft key={r.name} on={r.draft} note="отзыв-пример — заменить на реальный"><blockquote className="card p-6 h-full"><p className="text-[16px] leading-relaxed">«{r.text}»</p><footer className="mt-4 text-[14px] text-muted">{r.name}</footer></blockquote></Draft>
          ))}
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <a href={company.yandexMapsUrl} target="_blank" rel="noopener" className="card p-5 hover:shadow-card transition-shadow">
            <div className="font-bold text-ink">Яндекс.Карты</div>
            <div className="text-muted text-[14px] mt-1">Смотреть отзывы и оставить свой</div>
          </a>
          {company.addresses.filter((a) => a.gis2Url).map((a) => (
            <a key={a.street} href={a.gis2Url} target="_blank" rel="noopener" className="card p-5 hover:shadow-card transition-shadow">
              <div className="font-bold text-ink">2ГИС — {a.label}</div>
              <div className="text-muted text-[14px] mt-1">{a.city}, {a.street}</div>
            </a>
          ))}
        </div>
      </div>
      <LeadSection source="отзывы" />
    </>
  );
}
