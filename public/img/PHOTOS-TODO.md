# Фото для замены заглушек

## Станции (public/img/products/*.svg → .webp)
Скачать с сайта завода (kolo-vesi.ru), сжать через squoosh.app → WebP, ширина 1600:
- novo-eko-3 → https://kolo-vesi.ru/wp-content/uploads/2023/03/Novo-Eko-3-logo.1-1000-1.png
- novo-eko-5 → https://kolo-vesi.ru/wp-content/uploads/2023/03/Novo-Eko-5-logo.1-1000.png
- novo-eko-8 → https://kolo-vesi.ru/wp-content/uploads/2023/03/Novo-Eko-8-logo.1-1000.png
- zorde-4 → https://kolo-vesi.ru/wp-content/uploads/2018/08/Zorde_4-1.jpg
- zorde-7 → https://kolo-vesi.ru/wp-content/uploads/2018/08/Zorde-7.png
- kolo-vesi-3/5/8 → страницы моделей на kolo-vesi.ru
После замены поменять поле "image" в content/site.json на .webp (сейчас на страницах показана схема-SVG).

## Объекты (public/img/objects/*)
Живые фото с телефона: котлован, станция в котловане, засыпка, готовый вид, бригада. 3–5 фото на объект.

## Логотип
public/img/logo.webp — 282×43, мелкий. Запросить у клиента векторный (SVG/PDF) и заменить.

## Бурение (v23)
- Hero хаба и услуг: сейчас на всех страницах раздела фирменная SVG-схема разреза скважины (WellScheme). Прислать реальные фото: буровая установка на участке (УРБ/малогабаритная), обсадные трубы, прокачка, кессон изнутри, ввод в дом, насосная группа. Квадрат 1254, WebP q84 → `public/img/burenie/<slug>.webp`, потом заполнить `heroImage` в `content/burenie.json`.
- Объекты (`public/img/objects/burenie/*.svg` → `.webp`): фото есть на старом лендинге bur.fortes-dom.ru (Патроны Парк, Западный/Маркова, Хайрюзовка) — скачать оттуда или прислать оригиналы. Обложка 1200×750 (16:10) `<slug>-cover.webp`, галерея `<slug>-N.webp`. После замены поменять `cover`/`images` в burenie.json.
