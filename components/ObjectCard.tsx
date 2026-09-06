import Link from "next/link";
import Draft from "./Draft";
import { rub, objectCover, type SiteObject } from "@/lib/content";

export default function ObjectCard({ o }: { o: SiteObject }) {
  return (
    <Draft on={o.draft} note="объект придуман — заменить на реальный" className="min-w-0">
      <article className="card overflow-hidden h-full flex flex-col shadow-card">
        <Link href={`/obekty/${o.slug}/`} className="block aspect-[16/10] bg-frost relative">
          <img src={objectCover(o)} alt={`${o.title}, ${o.place}`} className="w-full h-full object-cover max-w-full" loading="lazy" width="800" height="500" />
        </Link>
        <div className="p-5 md:p-6 flex flex-col flex-1">
          <div className="text-[13px] text-muted">{o.type}</div>
          <h3 className="mt-1"><Link href={`/obekty/${o.slug}/`} className="hover:text-brand">{o.title}</Link></h3>
          <div className="text-[15px] text-muted">{o.place}</div>
          <p className="mt-3 text-[15px] text-ink/80 leading-relaxed line-clamp-3">{o.task}</p>
          <div className="mt-auto pt-4 flex items-end justify-between gap-3">
            <div>
              <div className="text-[13px] text-muted">Под ключ</div>
              <div className="text-xl font-extrabold tracking-tight">{rub(o.price)}</div>
            </div>
            <Link href={`/obekty/${o.slug}/`} className="btn-outline h-10 px-4 text-[14px]">Смета</Link>
          </div>
        </div>
      </article>
    </Draft>
  );
}
