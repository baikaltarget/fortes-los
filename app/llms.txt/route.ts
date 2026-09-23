import { SITE_URL, company } from "@/lib/content";
import { getPosts, CATEGORIES } from "@/lib/blog";

/** v37: /llms.txt — краткая карта сайта для ИИ-поиска (Алиса, ChatGPT, Perplexity и др.). Собирается из контента при сборке. */
export const dynamic = "force-static";

export function GET() {
  const posts = getPosts();
  const lines = [
    `# ${company.name} — инженерные системы для частного дома в Иркутске`,
    "",
    `> Инженерная компания в Иркутске с ${company.foundedYear} года, 1100+ объектов. Монтаж под ключ в Иркутске и Иркутском районе: автономная канализация и септики, отопление, вентиляция, бурение скважин на воду, водоснабжение, электрика. Своё производство ЖБИ-колец. Телефон ${company.phone}, ${company.email}, Пн–Пт 9:00–18:00. Офисы: ${company.addresses.map((a) => a.street).join("; ")}.`,
    "",
    "## Направления и цены «от» (под ключ)",
    `- [Канализация и септики](${SITE_URL}/kanalizaciya/): станции Novo Eko 3 и Zörde 4 — от 350 000 ₽, Novo Eko 5 — от 450 000 ₽; септик из бетонных колец — от 80 000 ₽; обслуживание — от 10 000 ₽. Официальный дилер Kolo Vesi.`,
    `- [Отопление](${SITE_URL}/otoplenie/): с радиаторами — от 2 500 ₽/м², водяной тёплый пол — от 4 500 ₽/м², котельная на электрокотле — от 50 000 ₽.`,
    `- [Вентиляция](${SITE_URL}/ventilyaciya/): частный дом — от 50 000 ₽, коммерческие объекты — по запросу. Официальный дилер Turkov.`,
    `- [Бурение скважин](${SITE_URL}/burenie/): от 2 500 ₽/м, гарантия на скважину 5 лет, анализ воды в подарок. [Глубины по посёлкам](${SITE_URL}/burenie/karta-glubin/).`,
    `- [Водоснабжение](${SITE_URL}/vodosnabzhenie/): разводка воды и канализации в доме, ввод воды, бойлеры.`,
    `- [Электрика](${SITE_URL}/elektrika/): частный дом под ключ — от 3 500 ₽/м², ввод 380 В, щиты, заземление. Только дома целиком, без разовых вызовов.`,
    `- [Инженерные сети под ключ](${SITE_URL}/inzhenernye-seti-pod-klyuch/): все системы дома одной бригадой.`,
    "",
    "## Страницы",
    `- [Цены](${SITE_URL}/ceny/)`,
    `- [Калькуляторы](${SITE_URL}/kalkulyator/)`,
    `- [Объекты со сметами](${SITE_URL}/obekty/)`,
    `- [О компании](${SITE_URL}/o-kompanii/)`,
    `- [Юридическим лицам — работа с НДС](${SITE_URL}/yuridicheskim-licam/)`,
    `- [Акции и скидки](${SITE_URL}/akcii/)`,
    `- [Рассрочка и кредит](${SITE_URL}/rassrochka/)`,
    `- [Контакты](${SITE_URL}/kontakty/)`,
    "",
    "## Статьи",
    ...posts.map((p) => `- [${p.h1}](${SITE_URL}/blog/${p.slug}/) (${CATEGORIES[p.category].short}): ${p.answer || p.excerpt}`),
    "",
  ];
  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
