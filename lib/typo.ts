/**
 * Типографика контента (v35): неразрывные пробелы, чтобы цена, единица и число не разрывались
 * переносом строки — «80 000 ₽» больше не распадается на «80» / «000 ₽» или «80 000» / «₽».
 * Применяется один раз ко всем JSON в lib/content.ts, так что правило работает во всех заголовках,
 * меню, чипах и таблицах без правки компонентов. Слаги и адреса не затрагиваются —
 * в них не бывает пробела между цифрами.
 */
const NB = "\u00A0";
// \b в JS не работает с кириллицей — конец слова проверяем через (?![а-яё])
const E = "(?![а-яёa-z])";
const UNITS = `₽|%|м²|м³|м${E}|мм${E}|см${E}|км${E}|кВт|кг${E}|л${E}|дней${E}|дня${E}|день${E}|лет${E}|год${E}|года${E}|человек|°C|°С|В${E}|мА${E}|Ом${E}|шт`;

export function typoString(s: string): string {
  if (!/\d/.test(s)) return s;
  return s
    // разряды: 80 000, 1 200 375
    .replace(/(\d) (?=\d{3}(?!\d))/g, `$1${NB}`)
    // число и единица: 80 000 ₽, 15 кВт, 120 м², 2 года
    .replace(new RegExp(`(\\d) (?=(?:${UNITS}))`, "g"), `$1${NB}`)
    // «от 80 000», «до 5 лет», «−35 °C», «№ 5»
    .replace(/(^|[\s(«])(от|до|на|за|по|с|—|–|№) (?=[−-]?\d)/g, `$1$2${NB}`);
}

export function typo<T>(v: T): T {
  if (typeof v === "string") return typoString(v) as unknown as T;
  if (Array.isArray(v)) return v.map((x) => typo(x)) as unknown as T;
  if (v && typeof v === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, x] of Object.entries(v as Record<string, unknown>)) {
      // ссылки, пути к файлам и iframe не трогаем
      out[k] = /^(href|url|image|images|cover|heroImage|heroImageMobile|ogImage|iframe|slug|src|file|pdf|gis2Url|yandexMapsUrl|phone|email|inn|ogrn)$/i.test(k) ? x : typo(x);
    }
    return out as T;
  }
  return v;
}
