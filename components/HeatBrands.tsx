import { HEAT } from "@/lib/content";
/** Бренды оборудования раздела «Отопление» — из otoplenie.json */
export default function HeatBrands() {
  return (
    <section className="py-6">
      <div className="container-site">
        <h2 className="mb-2">Оборудование, которое ставим</h2>
        <p className="text-muted max-w-[70ch] mb-6">Только то, что сами обслуживаем годами и на что есть запчасти в Иркутске.</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {HEAT.brands.map((b) => (
            <div key={b.name} className="card p-5 flex flex-col">
              <div className="text-[19px] font-extrabold tracking-tight">{b.name}</div>
              <div className="mt-1 text-[15px] text-ink/85">{b.what}</div>
              <div className="mt-2 text-[13px] text-muted">{b.note}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
