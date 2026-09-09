import site from "./content/site.json" with { type: "json" };

/** 301 со старых адресов v1–v5 (корневые URL септиков) на /kanalizaciya/… */
const old = [
  ...site.services.map((s) => s.slug),
  ...site.brands.map((b) => b.slug),
];
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
