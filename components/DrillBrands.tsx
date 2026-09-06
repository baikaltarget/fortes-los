import { BUR } from "@/lib/content";
import Draft from "./Draft";
/** Материалы и оборудование раздела «Бурение» — из burenie.json */
export default function DrillBrands() {
  return (
    <section className="py-6">
      <div className="container-site">
        <h2 className="mb-2">Из чего делаем скважину</h2>
        <p className="text-muted max-w-[70ch] mb-6">Трубы, насосы, кессоны и утепление — только то, что переживает иркутскую зиму и на что есть сервис в городе.</p>
        <Draft on={BUR.brandsDraft} note="список насосов/материалов — подтвердить у клиента">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {BUR.brands.map((b) => (
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
