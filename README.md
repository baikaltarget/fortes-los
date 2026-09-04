# Фортес — септики и автономная канализация в Иркутске

Сайт на Next.js 14 (App Router) + Tailwind. 89 страниц, статическая генерация, формы → Telegram.

## 1. Как опубликовать (≈10 минут)

1. **GitHub** → New repository (например `fortes-septik`, Private) → Create.
2. На странице репозитория → «uploading an existing file» → перетащить **содержимое этой папки** (не саму папку): в корне репозитория должен лежать `package.json`. Commit changes.
3. **vercel.com** → Sign up через GitHub → Add New → Project → Import `fortes-septik` → Deploy. Через 2–3 минуты сайт доступен на `https://fortes-septik-….vercel.app`.
4. Проверить сайт с телефона: кнопка «Позвонить» внизу открывает набор номера.
5. Vercel → Settings → Environment Variables → добавить (см. `.env.example`):
   - `TELEGRAM_BOT_TOKEN` — от @BotFather
   - `TELEGRAM_CHAT_ID` — id чата/группы, куда падают заявки
   - `NEXT_PUBLIC_SITE_URL` — адрес сайта (сначала `*.vercel.app`, после подключения домена — домен)
   После добавления → Deployments → Redeploy. Пока ключей нет, форма честно пишет «не настроено», показывает телефон и кнопку «Написать в Telegram», а заявка попадает в логи Vercel (Deployments → Functions → /api/lead).
6. Домен подключать только после проверки на `*.vercel.app`: Vercel → Settings → Domains.

Если после правки сайт «не обновился»: GitHub → счётчик коммитов вырос? → Vercel → Deployments: статус Building / Ready / Error → в браузере Ctrl+Shift+R.

## 2. Где что править (без кода)

Весь контент — в **`content/site.json`**. Дизайн — в `tailwind.config.ts`, `app/globals.css`, `components/`.

| Что | Где в `site.json` |
|---|---|
| Телефон, email, часы, адреса, реквизиты | `company` |
| Тексты и цены на главной | `home`, `homeFaq`, `reasons`, `steps` |
| Станции: цены, характеристики, FAQ | `products[]` — цена станции `price`, Midi/Long `priceMidi/priceLong`, монтаж от `installFrom` |
| Три хита на главной и в калькуляторе | `topPicks` |
| Страницы-услуги (`/septik-bez-otkachki/` и т.д.) | `services[]` |
| Гео-страницы (`/septik/khomutovo/`) | `geo[]` |
| Объекты со сметами | `objects[]` |
| Отзывы | `reviews[]` |
| Надбавки калькулятора | `calculator.extras` |
| Красные рамки-подсказки | `showDraftFrames: true` → поставить `false` перед сдачей |

Статьи — файлы `content/blog/*.md` (заголовок в шапке файла, текст в Markdown).

### Добавить гео-страницу
В `geo[]` скопировать любой блок, поменять `slug` (латиницей), `name`, `prep` («в Никольске»), `distance`, `soil`, `note`. Страница `/septik/<slug>/`, sitemap и ссылки в футере появятся сами.

### Добавить объект
В `objects[]` скопировать блок, заполнить, положить фото в `public/img/objects/`, указать путь в `images`, поставить `"draft": false`.

### Добавить статью
Создать `content/blog/moya-statya.md` по образцу соседних. Адрес — `/blog/moya-statya/`.

### Добавить станцию
В `products[]` скопировать блок, указать `brand` (`novo-eko` / `zorde` / `kolo-vesi`). Появится в каталоге, на странице бренда, в ценах.

## 3. Фото
Сейчас вместо фото — схемы и заглушки (обведены красным). Список, что и откуда взять: `public/img/PHOTOS-TODO.md`. Перед загрузкой: squoosh.app → WebP → ширина 1600 px. Загружать сразу в папку: `github.com/<user>/<repo>/upload/main/public/img/objects`.

## 4. Что помечено красной рамкой (проверить с заказчиком)
- Цены монтажа «от» (`installFrom`) и надбавки калькулятора
- Три объекта-примера (Хомутово, Пивовариха, Смоленщина) — заменить на реальные
- Отзывы-примеры
- Гарантия выгодной цены — подтвердить условие
- Telegram-аккаунт для кнопки «Написать в Telegram» (`company.telegramUser`)
- Координаты офисов (`company.addresses[].lat/lng`) — сейчас приблизительные
- Политика конфиденциальности — сверить
- Карта на странице контактов, виджет отзывов, сертификаты дилера
- Счётчики Яндекс.Метрики / GA — вставить в `app/layout.tsx` перед `</body>`

Когда всё проверено — `showDraftFrames: false` в `site.json`.

## 5. После публикации
- Яндекс.Вебмастер: добавить сайт, отправить `/sitemap.xml`
- Google Search Console: то же
- Яндекс.Бизнес и 2ГИС: телефон и адрес до символа как на сайте, категория «Септики / Автономная канализация»
- Попросить 3–5 довольных клиентов оставить отзыв на Яндекс.Картах

## 6. Структура адресов (89)
- `/` — септик под ключ в Иркутске
- `/stancii/` + 8 моделей `/stancii/<slug>/`
- `/novo-eko/`, `/zorde/`, `/kolo-vesi/` — брендовые
- 30 посадочных под кластеры запросов: `/septik-dlya-chastnogo-doma/`, `/septik-bez-otkachki/`, `/kanalizaciya-v-chastnom-dome/`, `/septik-iz-betonnyh-kolec/`, … (полный список — `services[]` в `site.json`)
- `/septik/` + 20 гео `/septik/<posyolok>/`
- `/obekty/` + 4 объекта
- `/ceny/`, `/kalkulyator/`, `/blog/` + 13 статей, `/o-kompanii/`, `/kontakty/`, `/otzyvy/`, `/politika/`
- `/sitemap.xml`, `/robots.txt`, `/api/lead`

## 7. Локальный запуск (не обязательно)
```
npm install
npm run dev      # http://localhost:3000
npm run build    # проверка сборки
```
