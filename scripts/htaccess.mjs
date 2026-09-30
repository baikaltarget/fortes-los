/**
 * v44: собирает out/.htaccess для хостинга Бегет (Apache) после `next build`.
 *
 * - 301-редиректы берутся из того же списка, что и раньше (`redirects` в next.config.mjs),
 *   поэтому новые редиректы по-прежнему добавляются только туда.
 * - /api/lead (форма заявки) → api/lead.php.
 * - Своя страница 404, кэш картинок и шрифтов на год.
 * - HTTPS и «без www» включаются переменной FORCE_HTTPS=1 (в GitHub: Settings → Secrets and variables →
 *   Actions → Variables). Включать только после того, как в панели Бегета выпущен SSL-сертификат.
 */
import fs from "node:fs";
import path from "node:path";
import { redirects } from "../next.config.mjs";

const OUT = path.join(process.cwd(), "out");
const FORCE_HTTPS = process.env.FORCE_HTTPS === "1";
const log = (...a) => console.log("[htaccess]", ...a);

if (!fs.existsSync(OUT)) {
  log("папки out нет — пропускаю (это не статическая сборка)");
  process.exit(0);
}

const esc = (s) => s.replace(/[.+*?^$()[\]{}|\\]/g, "\\$&");

/** "/stancii/:slug" → { re: "^stancii/([^/]+)/?$", dest: "/kanalizaciya/stancii/$1/" } */
function toRule(source, destination) {
  const names = [];
  const parts = source.replace(/^\/+/, "").replace(/\/+$/, "").split("/");
  const re = parts
    .map((p) => {
      if (p.startsWith(":")) { names.push(p.slice(1)); return "([^/]+)"; }
      return esc(p);
    })
    .join("/");
  let dest = destination;
  names.forEach((n, i) => { dest = dest.replace(`:${n}`, `$${i + 1}`); });
  return { re: `^${re}/?$`, dest, path: "/" + parts.join("/") };
}

const seen = new Set();
const rules = [];
const shadowed = [];
for (const r of redirects) {
  const rule = toRule(r.source, r.destination);
  if (seen.has(rule.re)) continue;
  seen.add(rule.re);
  // Если по адресу-источнику лежит настоящая страница, веб-сервер отдаст её, а не редирект.
  if (!rule.path.includes(":") && (fs.existsSync(path.join(OUT, rule.path)) && rule.path !== "/")) shadowed.push(rule.path);
  // /index.html — только по прямому запросу, иначе Apache зациклится на внутреннем DirectoryIndex
  if (rule.path.endsWith("index.html")) rules.push("RewriteCond %{THE_REQUEST} \\s/+index\\.html[\\s?]");
  rules.push(`RewriteRule ${rule.re} ${rule.dest} [R=301,L]`);
}

const httpsBlock = FORCE_HTTPS
  ? `# Всё на https и без www
RewriteCond %{HTTP_HOST} ^www\\.(.+)$ [NC]
RewriteRule ^ https://%1%{REQUEST_URI} [R=301,L]
RewriteCond %{HTTPS} !=on
RewriteCond %{HTTP:X-Forwarded-Proto} !=https
RewriteCond %{SERVER_PORT} !=443
RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [R=301,L]
`
  : `# https-редирект выключен (включается переменной FORCE_HTTPS=1 после выпуска SSL)
RewriteCond %{HTTP_HOST} ^www\\.(.+)$ [NC]
RewriteRule ^ http://%1%{REQUEST_URI} [R=301,L]
`;

const body = `# Собрано автоматически scripts/htaccess.mjs — вручную не править, изменения пропадут при следующей сборке.
AddDefaultCharset UTF-8
DirectoryIndex index.html
Options -Indexes
ErrorDocument 404 /404.html

<IfModule mod_mime.c>
  AddType text/plain .txt
  AddType application/xml .xml
  AddType font/woff2 .woff2
  AddType image/webp .webp
</IfModule>

<IfModule mod_headers.c>
  <FilesMatch "\\.(webp|jpg|jpeg|png|svg|ico|woff2|woff)$">
    Header set Cache-Control "public, max-age=31536000, immutable"
  </FilesMatch>
  <If "%{REQUEST_URI} =~ m#^/_next/static/#">
    Header set Cache-Control "public, max-age=31536000, immutable"
  </If>
</IfModule>

RewriteEngine On
RewriteBase /

${httpsBlock}
# Служебные файлы не отдаём
RewriteRule ^api/lead-config\\.php$ - [F,L]
RewriteRule ^\\.ftp-deploy-sync-state\\.json$ - [F,L]

# Форма заявки
RewriteRule ^api/lead/?$ api/lead.php [L]

# 301 со старых адресов (${seen.size} правил, список — в next.config.mjs)
${rules.join("\n")}
`;

fs.writeFileSync(path.join(OUT, ".htaccess"), body);
log(`готово: ${seen.size} редиректов, https ${FORCE_HTTPS ? "включён" : "выключен"}`);
if (shadowed.length) log("внимание, эти редиректы перекрыты настоящими страницами:", shadowed.join(", "));
