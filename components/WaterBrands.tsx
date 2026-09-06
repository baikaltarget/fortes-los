import { VODA } from "@/lib/content";
import Draft from "./Draft";
/** Материалы и оборудование раздела «Водоснабжение» — из vodosnabzhenie.json */
export default function WaterBrands() {
  return (
    <section className="py-6">
      <div className="container-site">
        <h2 className="mb-2">Из чего делаем воду и канализацию</h2>
        <p className="text-muted max-w-[70ch] mb-6">Трубы, фитинги, бойлеры и насосы — те, на которые есть гарантия производителя и сервис в Иркутске. Скидка на материалы до 40% — закупаем напрямую у поставщиков.</p>
        <Draft on={VODA.brandsDraft} note="список брендов труб/оборудования — подтвердить у клиента">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {VODA.brands.map((b) => (
              <div key={b.name} className="card p-5 flex flex-col">
                <div className="text-[19px] font-extrabold tracking-tight">{b.name}</div>
                <div className="mt-1 text-[15px] text-ink/85">{b.what}</div>
                <div className="mt-2 text-[13px] text-muted">{b.note}</div>
              </div>
            ))}
          </div>
        </Draft>
      </div>
    </section>
  );
}
