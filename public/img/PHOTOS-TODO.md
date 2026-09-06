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

## Бурение (v23 → добавлено после v23)
Фото от клиента получены и расставлены:
- Hero хаба `/burenie/` — буровая установка на участке (`hero-burovaya.webp`)
- Hero `obustrojstvo-skvazhiny` и `obustrojstvo-skvazhiny-s-kessonom` — кессон СОЮЗ в котловане (`hero-obustrojstvo-kesson.webp`)
- Hero `vvod-vody-v-dom` и `vodosnabzhenie-doma-iz-skvazhiny` — разрез траншеи с вводом, насосом и гидроаккумулятором (`hero-vvod-v-dom.webp`)
- Объекты: Патроны Парк (5 фото), Маркова/Западный (3 фото), Хайрюзовка (5 фото) — обложки и галереи заменены на реальные, SVG-заглушки удалены

Ещё не хватает hero для остальных 17 страниц услуг бурения (сейчас там SVG-схема WellScheme — это нормально смотрится и как постоянное решение, но живое фото лучше): бурение на участке крупным планом, обсадные трубы, прокачка/промывка, насос ЭЦВ, водоочистка/фильтры, паспорт скважины на руках у инженера. Формат — квадрат 1254, WebP q84 → `public/img/burenie/<slug>.webp`, заполнить `heroImage` в `content/burenie.json`.
