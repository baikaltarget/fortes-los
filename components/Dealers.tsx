import { BRAND } from "@/lib/content";

/**
 * v32: официальные дилерства бренда — карточки с логотипами (public/img/dealers/) или текстовым знаком.
 * Данные — content/brand.json → dealers. Используется на главной и /o-kompanii/.
 */
export default function Dealers({ compact = false }: { compact?: boolean }) {
  const D = BRAND.dealers;
  return (
    <section className={compact ? "py-6" : "py-12 md:py-16"} id="dealers">
      <div className="container-site">
        <h2 className="mb-2">{D.title}</h2>
        <p className="text-muted max-w-[70ch] mb-6">{D.text}</p>
        <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {D.items.map((b) => (
            <div key={b.name} className="card p-4 flex flex-col items-center text-center">
              <div className="h-14 w-full flex items-center justify-center">
                {b.logo ? (
                  <img src={b.logo} alt={`Логотип ${b.name}`} width={b.w} height={b.h} className="max-h-12 w-auto max-w-[150px] object-contain" loading="lazy" />
                ) : (
                  <span className="text-[20px] font-extrabold tracking-tight">{b.name}</span>
                )}
              </div>
              <div className="mt-3 text-[14px] font-bold leading-tight">{b.name}</div>
              <div className="mt-1 text-[12px] text-muted leading-snug">{b.what}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
