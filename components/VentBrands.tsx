import { VENT } from "@/lib/content";
import Draft from "./Draft";
/** Оборудование раздела «Вентиляция» — из ventilyaciya.json (v32) */
export default function VentBrands() {
  return (
    <section className="py-6">
      <div className="container-site">
        <h2 className="mb-2">Из чего собираем вентиляцию</h2>
        <p className="text-muted max-w-[70ch] mb-6">Установки с рекуперацией под сибирскую зиму, тихие канальные вентиляторы, оцинкованные воздуховоды. Официальный дилер Turkov — цена завода и гарантия в Иркутске.</p>
        <Draft on={VENT.brandsDraft} note="бренды вентиляторов/автоматики — подтвердить у клиента">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {VENT.brands.map((b) => (
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
