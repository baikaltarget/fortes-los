import { meta } from "@/lib/seo";
import { SITE } from "@/lib/content";
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
        <Draft note="вставить виджет отзывов Яндекс.Карт / 2ГИС" className="mt-6"><div className="card p-6 text-muted">Виджет отзывов</div></Draft>
      </div>
      <LeadSection source="отзывы" />
    </>
  );
}
