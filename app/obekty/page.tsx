import Link from "next/link";
import { meta } from "@/lib/seo";
import { objects, heatObjects, burObjects, vodaObjects, HP, BP, P, VP } from "@/lib/content";
import Breadcrumbs from "@/components/Breadcrumbs";
import ObjectCard from "@/components/ObjectCard";
import LeadSection from "@/components/LeadSection";

export const metadata = meta({ title: "Наши объекты — отопление, водоснабжение, скважины и септики в Иркутске со сметой и ценой под ключ", description: "Реальные объекты Фортес с ценами: отопление домов 120–450 м² в Бурдаковке и Ново-Разводной, скважины и водоснабжение в Патронах, Маркова и Хайрюзовке, септики на Байкальском тракте, в Хомутово и Смоленщине. Сметы, фото с монтажей.", path: "/obekty/" });

export default function Page() {
  return (
    <>
      <div className="container-site">
        <Breadcrumbs items={[{ name: "Объекты", href: "/obekty/" }]} />
        <h1>Объекты со сметой</h1>
        <p className="mt-4 text-[18px] text-ink/85 max-w-[62ch]">Показываем, что было на объекте, что поставили и сколько это стоило под ключ. Так проще понять, во что обойдётся ваш дом — ещё до звонка.</p>
        <div className="mt-6 flex flex-wrap gap-2"><a href="#otoplenie" className="chip hover:border-ink">Отопление</a><a href="#burenie" className="chip hover:border-ink">Бурение</a><a href="#vodosnabzhenie" className="chip hover:border-ink">Водоснабжение</a><a href="#kanalizaciya" className="chip hover:border-ink">Канализация</a></div>

        <h2 id="otoplenie" className="mt-12 mb-2 scroll-mt-28">Отопление</h2>
        <p className="text-muted max-w-[70ch] mb-6">Тёплые полы, котельные, радиаторы — от бани до коттеджа 450 м² и коммерческого помещения. Подробнее о направлении — <Link href={HP.hub} className="text-brand underline">раздел «Отопление»</Link>.</p>
        <div className="grid gap-5 md:grid-cols-2">{heatObjects.map((o) => <ObjectCard key={o.slug} o={o} />)}</div>

        <h2 id="burenie" className="mt-14 mb-2 scroll-mt-28">Бурение и водоснабжение</h2>
        <p className="text-muted max-w-[70ch] mb-6">Скважины с обустройством, ввод воды в дом, кессоны. Подробнее — <Link href={BP.hub} className="text-brand underline">раздел «Бурение»</Link>.</p>
        <div className="grid gap-5 md:grid-cols-2">{burObjects.map((o) => <ObjectCard key={o.slug} o={o} />)}</div>

        <h2 id="vodosnabzhenie" className="mt-14 mb-2 scroll-mt-28">Водоснабжение и канализация в доме</h2>
        <p className="text-muted max-w-[70ch] mb-6">Ввод воды, разводка ХВС и ГВС, бойлеры с рециркуляцией, канализация до септика — в составе объектов отопления и бурения. Подробнее — <Link href={VP.hub} className="text-brand underline">раздел «Водоснабжение»</Link>.</p>
        <div className="grid gap-5 md:grid-cols-2">{vodaObjects.filter((o) => o.section === "otoplenie").map((o) => <ObjectCard key={"v-" + o.slug} o={o} />)}</div>

        <h2 id="kanalizaciya" className="mt-14 mb-2 scroll-mt-28">Канализация</h2>
        <p className="text-muted max-w-[70ch] mb-6">Станции биологической очистки Novo Eko, Zörde, Kolo Vesi под ключ. Подробнее — <Link href={P.hub} className="text-brand underline">раздел «Канализация»</Link>.</p>
        <div className="grid gap-5 md:grid-cols-2">{objects.map((o) => <ObjectCard key={o.slug} o={o} />)}</div>
      </div>
      <LeadSection source="объекты" title="Похожий объект? Посчитаем так же подробно" text="Инженер приедет бесплатно, посмотрит дом или проект и составит смету с теми же строками, что вы видите на этой странице. Смета фиксируется в договоре." />
    </>
  );
}
