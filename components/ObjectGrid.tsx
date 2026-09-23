import Link from "next/link";
import ObjectCard from "./ObjectCard";
import { objSection, OBJ_ANCHOR, type SiteObject } from "@/lib/content";

/**
 * v35: единая сетка кейсов — 4 колонки на десктопе, 2 на планшете, 1 на телефоне.
 * Список готовит pickObjects(): ровно 4, без пустых мест и «хвостов» во втором ряду.
 * Если часть кейсов из смежных разделов — одна строка об этом под сеткой, честно.
 */
export default function ObjectGrid({ items, section }: { items: SiteObject[]; section: string }) {
  const mixed = items.some((o) => objSection(o) !== section);
  return (
    <>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">{items.map((o) => <ObjectCard key={o.slug} o={o} />)}</div>
      <div className="mt-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 text-[14px]">
        <span className="text-muted">{mixed ? "Часть кейсов — из смежных работ: этот узел мы делали в составе инженерки дома." : ""}</span>
        <Link href={`/obekty/${OBJ_ANCHOR[section] || ""}`} className="text-brand underline underline-offset-2 whitespace-nowrap">Все объекты со сметой →</Link>
      </div>
    </>
  );
}
