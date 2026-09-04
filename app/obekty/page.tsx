import { meta } from "@/lib/seo";
import { objects } from "@/lib/content";
import Breadcrumbs from "@/components/Breadcrumbs";
import ObjectCard from "@/components/ObjectCard";
import LeadSection from "@/components/LeadSection";

export const metadata = meta({ title: "Наши объекты — установленные септики в Иркутске со сметой и ценой", description: "Реальные объекты Фортес: замена выгребной ямы на Байкальском тракте, Novo Eko в Хомутово и Пивоварихе, Zörde на глине в Смоленщине. Сметы и цены под ключ.", path: "/obekty/" });

export default function Page() {
  return (
    <>
      <div className="container-site">
        <Breadcrumbs items={[{ name: "Объекты", href: "/obekty/" }]} />
        <h1>Объекты со сметой</h1>
        <p className="mt-4 text-[18px] text-ink/85 max-w-[62ch]">Показываем, что было на участке, что поставили и сколько это стоило под ключ. Так проще понять, во что обойдётся ваш.</p>
        <div className="mt-8 grid gap-5 md:grid-cols-2">{objects.map((o) => <ObjectCard key={o.slug} o={o} />)}</div>
      </div>
      <LeadSection source="объекты" />
    </>
  );
}
