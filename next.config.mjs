import site from "./content/site.json" with { type: "json" };

/** 301 со старых адресов v1–v5 (корневые URL септиков) на /kanalizaciya/… */
const old = [
  ...site.services.map((s) => s.slug),
  ...site.brands.map((b) => b.slug),
];

/**
 * v41: старые адреса прежних сайтов на домене fortes-group.ru (WordPress до 2019, сайт 2021–2026).
 * Яндекс их помнит (Вебмастер → «Страницы в поиске» и «Статистика обхода»), сейчас они отдают 404.
 * Каждое правило — в двух вариантах, со слэшем и без. /akcii и /yuridicheskim-licam не редиректим —
 * страницы возвращены по тем же адресам. Мусор (/bez-rubriki/…, рекурсивные /otoplenie/elektrika/…) — пусть 404.
 */
const legacy = [
  ["/otoplenie/kotelnoe-otoplenie", "/otoplenie/montazh-kotelnoj/"],
  ["/otoplenie/radiatornoe-otoplenie", "/otoplenie/montazh-radiatorov/"],
  ["/otoplenie/tyoplye-poly", "/otoplenie/montazh-teplogo-pola/"],
  ["/otoplenie/tyoplye-poly/vodyanye-poly", "/otoplenie/vodyanoj-teplyj-pol-pod-klyuch/"],
  ["/otoplenie/tyoplye-poly/lyogkie-sistemy-tyoplogo-pola", "/otoplenie/suhoj-teplyj-pol/"],
  ["/otoplenie/schema-otoplenya", "/otoplenie/proektirovanie-otopleniya/"],
  ["/otoplenie/podbiraem-luchshee-otoplenie-dlya-chastnogo-doma", "/otoplenie/otoplenie-chastnogo-doma/"],
  ["/otoplenie/otoplenie-iz-polipropilena", "/otoplenie/luchevaya-razvodka/"],
  ["/otoplenye", "/otoplenie/"],
  ["/category/otoplenie", "/otoplenie/"],
  ["/category/vodyanoe-otoplenie", "/otoplenie/"],
  ["/teplyie-vodyanyie-polyi", "/otoplenie/montazh-teplogo-pola/"],
  ["/category/teplyj-pol", "/otoplenie/montazh-teplogo-pola/"],
  ["/vodootvedenie-i-kanalizaciya", "/kanalizaciya/"],
  ["/vodootvedenie-i-kanalizaciya/avtonomnaya-kanalizaciya", "/kanalizaciya/avtonomnaya-kanalizaciya/"],
  ["/vodootvedenie-i-kanalizaciya/septiki-zhbi", "/kanalizaciya/septik-iz-betonnyh-kolec/"],
  ["/vodootvedenie-i-kanalizaciya/vnutrennyaya-kanalizaciya", "/vodosnabzhenie/montazh-kanalizacii-v-dome/"],
  ["/vodootvedenie-i-kanalizaciya/podklyuchenie-k-setyam-kanalizacii", "/kanalizaciya/kanalizaciya-v-chastnom-dome/"],
  ["/kanalizatsiya", "/kanalizaciya/"],
  ["/septiki", "/kanalizaciya/"],
  ["/vyigrebnyie-yamyi", "/kanalizaciya/zamena-vygrebnoj-yamy/"],
  ["/vodosnabzhenie/vnutrennee-vodosnabzhenie", "/vodosnabzhenie/razvodka-vodosnabzheniya/"],
  ["/vodosnabzhenie/obustrojstvo-skvazhin-kessony-i-vodoprovod", "/burenie/obustrojstvo-skvazhiny/"],
  ["/blagoustroystvo-skvazhin", "/burenie/obustrojstvo-skvazhiny/"],
  ["/avtonomnoe-vodosnabzhenie-chastnogo-d", "/vodosnabzhenie/"],
  ["/vodoprovod", "/vodosnabzhenie/"],
  ["/burenie-skvazhin", "/burenie/"],
  ["/burenie-skvazhin-2", "/burenie/"],
  ["/elektrika/vnutrennyaya-elektroprovodka", "/elektrika/razvodka-elektriki-v-dome/"],
  ["/kompleksnyie-resheniya", "/inzhenernye-seti-pod-klyuch/"],
  ["/nashi-raboty", "/obekty/"],
  ["/kontaktyi", "/kontakty/"],
  ["/pravovaya-informaciya", "/politika/"],
  ["/link-to-policy", "/politika/"],
  ["/politika-konfidentsialnosti-fortesgroup", "/politika/"],
  ["/dogovor-oferta", "/politika/"],
].flatMap(([from, to]) => [
  { source: from, destination: to, statusCode: 301 },
  { source: `${from}/`, destination: to, statusCode: 301 },
]);

const redirects = [
  { source: "/index.html", destination: "/", permanent: true },
  { source: "/stancii", destination: "/kanalizaciya/stancii/", permanent: true },
  { source: "/stancii/:slug", destination: "/kanalizaciya/stancii/:slug/", permanent: true },
  { source: "/septik", destination: "/kanalizaciya/", permanent: true },
  { source: "/septik/:geo", destination: "/kanalizaciya/:geo/", permanent: true },
  { source: "/otoplenie/vozdushnoe-otoplenie-volcano", destination: "/otoplenie/otoplenie-sklada-angara/", permanent: true },
  { source: "/otoplenie/vozdushnoe-otoplenie-volcano/", destination: "/otoplenie/otoplenie-sklada-angara/", permanent: true },
  { source: "/vodosnabzhenie/burenie-skvazhin", destination: "/burenie/", permanent: true },
  // v25: ввод воды в дом переехал из бурения в водоснабжение
  { source: "/burenie/vvod-vody-v-dom", destination: "/vodosnabzhenie/vvod-vody-v-dom/", permanent: true },
  { source: "/burenie/vvod-vody-v-dom/", destination: "/vodosnabzhenie/vvod-vody-v-dom/", permanent: true },
  { source: "/vodosnabzhenie/burenie-skvazhin/", destination: "/burenie/", permanent: true },
  { source: "/burenie/remont-skvazhin", destination: "/burenie/doburivanie-skvazhiny/", permanent: true },
  { source: "/burenie/remont-skvazhin/", destination: "/burenie/doburivanie-skvazhiny/", permanent: true },
  { source: "/burenie/promyvka-skvazhiny", destination: "/burenie/doburivanie-skvazhiny/", permanent: true },
  { source: "/burenie/promyvka-skvazhiny/", destination: "/burenie/doburivanie-skvazhiny/", permanent: true },
  { source: "/burenie/zamena-nasosa-v-skvazhine", destination: "/burenie/montazh-nasosa-v-skvazhinu/", permanent: true },
  { source: "/burenie/zamena-nasosa-v-skvazhine/", destination: "/burenie/montazh-nasosa-v-skvazhinu/", permanent: true },
  { source: "/burenie/pasport-skvazhiny", destination: "/burenie/burenie-skvazhin-na-vodu/", permanent: true },
  { source: "/burenie/pasport-skvazhiny/", destination: "/burenie/burenie-skvazhin-na-vodu/", permanent: true },
  // v32: убраны страницы «Замена проводки» и «Подключение к Водоканалу»
  { source: "/elektrika/zamena-elektroprovodki", destination: "/elektrika/razvodka-elektriki-v-dome/", permanent: true },
  { source: "/elektrika/zamena-elektroprovodki/", destination: "/elektrika/razvodka-elektriki-v-dome/", permanent: true },
  { source: "/vodosnabzhenie/podklyuchenie-k-vodokanalu", destination: "/vodosnabzhenie/vvod-vody-iz-centralnogo-vodoprovoda/", permanent: true },
  { source: "/vodosnabzhenie/podklyuchenie-k-vodokanalu/", destination: "/vodosnabzhenie/vvod-vody-iz-centralnogo-vodoprovoda/", permanent: true },
  ...old.map((slug) => ({ source: `/${slug}`, destination: `/kanalizaciya/${slug}/`, permanent: true })),
  ...legacy,
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  images: { unoptimized: true },
  poweredByHeader: false,
  async redirects() { return redirects; },
};
export default nextConfig;
