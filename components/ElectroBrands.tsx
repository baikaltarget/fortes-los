import { ELEK } from "@/lib/content";
import Draft from "./Draft";
/** Кабель, автоматика и фурнитура раздела «Электрика» — из elektrika.json */
export default function ElectroBrands() {
  return (
    <section className="py-6">
      <div className="container-site">
        <h2 className="mb-2">Из чего собираем электрику</h2>
        <p className="text-muted max-w-[70ch] mb-6">Кабель по ГОСТ, автоматика с сервисом в Иркутске, реле напряжения под наши сети. Выгода на материалах до 30% — закупаем напрямую у поставщиков.</p>
        <Draft on={ELEK.brandsDraft} note="список брендов кабеля/автоматики — подтвердить у клиента">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {ELEK.brands.map((b) => (
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
