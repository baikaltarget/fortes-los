import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";

export type BlogFaq = { q: string; a: string };
export type TocItem = { id: string; text: string };
export type Post = {
  slug: string; title: string; description: string; date: string; updated: string; h1: string; excerpt: string;
  html: string; image: string; imageAlt: string; category: CategoryKey; answer: string; faq: BlogFaq[];
  toc: TocItem[]; minutes: number; words: number; author: string;
};

/** Темы блога = направления сайта. Порядок — как в шапке. */
export const CATEGORIES = {
  kanalizaciya: { name: "Канализация и септики", short: "Канализация", hub: "/kanalizaciya/", calc: "/kanalizaciya/kalkulyator/", calcText: "Подобрать септик по числу жильцов и грунту" },
  otoplenie: { name: "Отопление", short: "Отопление", hub: "/otoplenie/", calc: "/otoplenie/kalkulyator/", calcText: "Посчитать отопление дома по площади" },
  ventilyaciya: { name: "Вентиляция", short: "Вентиляция", hub: "/ventilyaciya/", calc: "/ventilyaciya/kalkulyator/", calcText: "Посчитать вентиляцию дома" },
  burenie: { name: "Бурение скважин", short: "Бурение", hub: "/burenie/", calc: "/burenie/kalkulyator/", calcText: "Посчитать скважину под ключ" },
  vodosnabzhenie: { name: "Водоснабжение", short: "Водоснабжение", hub: "/vodosnabzhenie/", calc: "/vodosnabzhenie/kalkulyator/", calcText: "Посчитать воду и канализацию в доме" },
  elektrika: { name: "Электрика", short: "Электрика", hub: "/elektrika/", calc: "/elektrika/kalkulyator/", calcText: "Посчитать электрику дома" },
  dom: { name: "Дом целиком", short: "Дом целиком", hub: "/inzhenernye-seti-pod-klyuch/", calc: "/kalkulyator/", calcText: "Выбрать калькулятор по системе" },
} as const;
export type CategoryKey = keyof typeof CATEGORIES;

/** Авторы статей. Ключ — slug страницы автора. */
export const AUTHORS = {
  "egor-zybarev": {
    name: "Егор Зыбарев",
    role: "Прораб Фортес",
    initials: "ЕЗ",
    photo: "/img/blog/avtor/egor-zybarev.webp",
    bio: "Ведёт монтаж на объектах Фортес в Иркутске и Иркутском районе: септики, скважины, отопление, вода и электрика в частных домах. Пишет о том, что видит на участках и в котельных, — с цифрами из реальных смет.",
  },
} as const;
export type AuthorKey = keyof typeof AUTHORS;
export const DEFAULT_AUTHOR: AuthorKey = "egor-zybarev";
export const authorPath = (k: string) => `/blog/avtor/${k}/`;

export const PER_PAGE = 10; // первая страница: 1 большая + 9 = три полных ряда

const DIR = path.join(process.cwd(), "content", "blog");

const TR: Record<string, string> = { а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z", и: "i", й: "j", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "c", ч: "ch", ш: "sh", щ: "shch", ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya" };
const anchor = (s: string) =>
  s.toLowerCase().replace(/<[^>]+>/g, "").split("").map((c) => TR[c] ?? c).join("").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "razdel";

function enrich(html: string) {
  const toc: TocItem[] = [];
  const used = new Set<string>();
  const out = html
    .replace(/<h2>(.*?)<\/h2>/g, (_m, inner: string) => {
      let id = anchor(inner);
      while (used.has(id)) id += "-2";
      used.add(id);
      toc.push({ id, text: inner.replace(/<[^>]+>/g, "") });
      return `<h2 id="${id}">${inner}</h2>`;
    })
    .replace(/<table>/g, '<div class="table-wrap"><table>')
    .replace(/<\/table>/g, "</table></div>");
  return { html: out, toc };
}

let cache: Post[] | null = null;

/**
 * v42: отложенная публикация. Статья с датой `date` в будущем (по времени Иркутска, UTC+8) не попадает
 * никуда: ни в ленту, ни в sitemap, ни в /llms.txt, ни в «Статьи по теме»; её адрес отдаёт 404.
 * В день выхода GitHub Action (.github/workflows/publish-scheduled.yml) дёргает Deploy Hook Vercel,
 * сайт пересобирается — и статья появляется. Посмотреть все статьи локально: BLOG_SHOW_FUTURE=1 npm run build.
 */
export const todayIrkutsk = () => new Date(Date.now() + 8 * 3600 * 1000).toISOString().slice(0, 10);
const SHOW_FUTURE = process.env.BLOG_SHOW_FUTURE === "1";

export function getPosts(): Post[] {
  if (cache) return cache;
  if (!fs.existsSync(DIR)) return [];
  cache = fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const raw = fs.readFileSync(path.join(DIR, f), "utf8");
      const { data, content } = matter(raw);
      const { html, toc } = enrich(marked.parse(content) as string);
      const words = (content.match(/[\p{L}\d]+/gu) || []).length + String(data.answer || "").split(/\s+/).length + (data.faq || []).reduce((n: number, q: BlogFaq) => n + (q.q + " " + q.a).split(/\s+/).length, 0);
      const date = String(data.date);
      return {
        slug: f.replace(/\.md$/, ""),
        title: data.title,
        description: data.description,
        date,
        updated: String(data.updated || date),
        h1: data.h1 || data.title,
        excerpt: data.excerpt || data.description,
        html,
        toc,
        image: data.image || "/img/og.jpg",
        imageAlt: data.imageAlt || data.h1 || data.title,
        category: (data.category || "kanalizaciya") as CategoryKey,
        answer: data.answer || "",
        faq: (data.faq || []) as BlogFaq[],
        words,
        minutes: Math.max(2, Math.round(words / 180)),
        author: data.author || DEFAULT_AUTHOR,
      };
    })
    .filter((p) => SHOW_FUTURE || p.date.slice(0, 10) <= todayIrkutsk())
    .sort((a, b) => (a.date === b.date ? (a.slug < b.slug ? -1 : 1) : a.date < b.date ? 1 : -1));
  return cache;
}

export const getPost = (slug: string) => getPosts().find((p) => p.slug === slug);
export const postsByCategory = (c: CategoryKey) => getPosts().filter((p) => p.category === c);
export const pageCount = () => Math.max(1, Math.ceil(getPosts().length / PER_PAGE));
export const postsPage = (n: number) => getPosts().slice((n - 1) * PER_PAGE, n * PER_PAGE);
export const pagePath = (n: number) => (n <= 1 ? "/blog/" : `/blog/stranica/${n}/`);
export const categoryPath = (c: string) => `/blog/tema/${c}/`;
export const usedCategories = () => (Object.keys(CATEGORIES) as CategoryKey[]).filter((c) => postsByCategory(c).length > 0);

/** Похожие: сначала та же тема, потом свежие из других. */
export function relatedTo(p: Post, n = 3) {
  const all = getPosts().filter((x) => x.slug !== p.slug);
  return [...all.filter((x) => x.category === p.category), ...all.filter((x) => x.category !== p.category)].slice(0, n);
}

/** Соседи по ленте (лента отсортирована от новых к старым). */
export function neighbours(p: Post) {
  const all = getPosts();
  const i = all.findIndex((x) => x.slug === p.slug);
  return { newer: i > 0 ? all[i - 1] : null, older: i < all.length - 1 ? all[i + 1] : null };
}

export const fmtDate = (d: string) => new Date(d).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
