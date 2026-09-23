/**
 * v41: IndexNow — после каждой продакшен-сборки на Vercel отправляет адреса из sitemap в Яндекс.
 * Яндекс сам проверяет ключ по файлу public/<KEY>.txt на сайте и ставит страницы в очередь на обход.
 *
 * Что отправляем: новые адреса (которых не было в прошлой отправке) — сразу; весь sitemap — не чаще раза в 7 дней.
 * Состояние хранится в .next/cache/indexnow.json — Vercel сохраняет этот кэш между сборками.
 * Так новые страницы попадают в Яндекс в день публикации, а частые коммиты не шлют одно и то же.
 *
 * Запускается как "postbuild" из package.json. Отправляет только если:
 *  - сборка на Vercel в Production (VERCEL_ENV=production) — превью и локальные сборки молчат;
 *  - не выставлена переменная INDEXNOW=off (выключатель на случай, если понадобится).
 * Любая ошибка сети только пишется в лог — сборку не валит.
 */
import fs from "node:fs";
import path from "node:path";

const KEY = "2fe4cee8214e07a4d91512c5271a89fa";
const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "https://fortes-group.ru").replace(/\/$/, "");
const log = (...a) => console.log("[indexnow]", ...a);

async function main() {
  if (process.env.VERCEL_ENV !== "production") return log("не продакшен — пропускаю");
  if (process.env.INDEXNOW === "off") return log("INDEXNOW=off — пропускаю");

  const file = path.join(process.cwd(), ".next/server/app/sitemap.xml.body");
  if (!fs.existsSync(file)) return log("sitemap не найден в сборке:", file);
  const urls = [...fs.readFileSync(file, "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]).filter((u) => u.startsWith(SITE));
  if (!urls.length) return log("в sitemap нет адресов", SITE);

  const stateFile = path.join(process.cwd(), ".next/cache/indexnow.json");
  let state = { sentAt: 0, urls: [] };
  try { state = JSON.parse(fs.readFileSync(stateFile, "utf8")); } catch {}
  const WEEK = 7 * 24 * 3600 * 1000;
  const full = Date.now() - (state.sentAt || 0) > WEEK;
  const known = new Set(state.urls || []);
  const list = full ? urls : urls.filter((u) => !known.has(u));
  if (!list.length) return log("новых адресов нет, полная отправка была", new Date(state.sentAt).toISOString());

  const host = new URL(SITE).host;
  const res = await fetch("https://yandex.com/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host, key: KEY, keyLocation: `${SITE}/${KEY}.txt`, urlList: list.slice(0, 10000) }),
    signal: AbortSignal.timeout(15000),
  });
  log(`${full ? "полная отправка" : "новые адреса"}: ${list.length}, ответ ${res.status}`);
  if (res.ok) {
    fs.mkdirSync(path.dirname(stateFile), { recursive: true });
    fs.writeFileSync(stateFile, JSON.stringify({ sentAt: full ? Date.now() : state.sentAt, urls }));
  }
}

main().catch((e) => log("ошибка (сборку не валим):", e?.message || e));
