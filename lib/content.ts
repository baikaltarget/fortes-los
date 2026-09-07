import site from "@/content/site.json";
import sectionsJson from "@/content/sections.json";
import otoplenieJson from "@/content/otoplenie.json";
import burenieJson from "@/content/burenie.json";
import vodaJson from "@/content/vodosnabzhenie.json";
import elekJson from "@/content/elektrika.json";

export type Faq = { q: string; a: string };
export type Variant = { name: string; price: number; note: string };
export type Product = {
  slug: string; brand: string; name: string; shortName: string; users: string; usersMin: number; usersMax: number;
  capacity: string; salvo: string; price: number; priceMidi: number; priceLong: number; installFrom: number; installFromDraft?: boolean; turnkeyFrom?: number; turnkeyDraft?: boolean;
  power: string; service: string; life: string; bestFor: string; hit: boolean; hitLabel?: string; summary: string; body: string[];
  specs: string[][]; variants: Variant[]; image: string; manufacturerUrl: string; manufacturerImg?: string; faq: Faq[];
};
export type Brand = { slug: string; name: string; title: string; description: string; h1: string; intro: string; points: string[] };
export type TextSection = { h2: string; p: string[] };
export type Extra = { name: string; d: string; price: number; priceLabel?: string; note: string; hit?: boolean; image?: string };
export type Service = {
  slug: string; name: string; title: string; description: string; h1: string; lead: string; products: string[]; sections: TextSection[]; faq: Faq[];
  heroImage?: string; heroImageAlt?: string; heroImageFit?: string; chips?: string[]; kessons?: Extra[]; servicePrices?: { name: string; price: string; draft?: boolean }[]; koloIlma?: { priceFrom: number; capacity: string; life: string; service: string };
  productsTitle?: string; productsSub?: string;
};
export type Geo = { slug: string; name: string; prep: string; distance: string; soil: string; note: string };
export type SiteObject = {
  slug: string; title: string; place: string; geo: string; type: string; product?: string; productName?: string; price: number;
  task: string; solution: string; result: string; estimate: string[][]; estimateDraft?: boolean; draft: boolean; images: string[];
  /** раздел: undefined = канализация (site.json), "otoplenie" = отопление (otoplenie.json), "burenie" = бурение (burenie.json). Водоснабжение своих объектов не имеет — ссылается на чужие через objectRefs */
  section?: string; cover?: string; system?: string;
};

export const SITE = site as unknown as typeof site & { products: Product[]; brands: Brand[]; services: Service[]; geo: Geo[]; objects: SiteObject[] };
export const company = site.company;

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://fortes-septik.vercel.app").replace(/\/$/, "");

export const products: Product[] = SITE.products;
export const brands: Brand[] = SITE.brands;
export const services: Service[] = SITE.services;
export const geo: Geo[] = SITE.geo;
export const objects: SiteObject[] = SITE.objects;

export const topPicks = site.topPicks.map((s) => products.find((p) => p.slug === s)!).filter(Boolean);

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const getBrand = (slug: string) => brands.find((b) => b.slug === slug);
export const getService = (slug: string) => services.find((s) => s.slug === slug);
export const getGeo = (slug: string) => geo.find((g) => g.slug === slug);
export const getObject = (slug: string) => objects.find((o) => o.slug === slug);

export const productsByBrand = (brand: string) => products.filter((p) => p.brand === brand);

export const rub = (n: number) => new Intl.NumberFormat("ru-RU").format(n) + " ₽";

/** Минимальная цена «под ключ» = станция + монтаж */
export const turnkeyFrom = (p: Product) => p.turnkeyFrom ?? p.price + p.installFrom;

/** Разделы сайта (шапка/подвал). Текущий живой раздел — канализация. */
export type Section = {
  slug: string; name: string; short: string; live: boolean; external?: string;
  menu: { title: string; links: string[][] }[]; footer: string[][];
  hit?: { label: string; name: string; sub: string; price: string; note: string; href: string };
  subnav?: string[][]; title?: string; description?: string; h1?: string; lead?: string;
};
export const sections = sectionsJson.sections as unknown as Section[];
export const companyLinks = sectionsJson.companyLinks as string[][];
export const getSection = (slug: string) => sections.find((s) => s.slug === slug);

/** Префикс раздела и построители ссылок — менять пути только здесь */
export const SEC = "/kanalizaciya";
export const P = {
  hub: `${SEC}/`,
  stancii: `${SEC}/stancii/`,
  product: (slug: string) => `${SEC}/stancii/${slug}/`,
  page: (slug: string) => `${SEC}/${slug}/`,   // услуги и бренды
  geo: (slug: string) => `${SEC}/${slug}/`,    // гео — тот же уровень
  object: (slug: string) => `/obekty/${slug}/`,
  post: (slug: string) => `/blog/${slug}/`,
};

/* ======================= РАЗДЕЛ «ОТОПЛЕНИЕ» (content/otoplenie.json) ======================= */
export type HeatService = {
  slug: string; name: string; title: string; description: string; h1: string; lead: string; cluster: string;
  heroImage?: string; heroImageAlt?: string; priceFrom?: string; priceDraft?: boolean; sections: TextSection[]; faq: Faq[]; chips?: string[]; objects?: string[];
};
export type HeatGeo = { slug: string; name: string; prep: string; distance: string; tract: string; power: string; housing: string; about: string[]; objects?: string[] };
export type HeatCluster = { slug: string; title: string; sub: string };
export type HeatPrice = { name: string; price: string; note: string; draft: boolean; href: string };
export type HeatBrand = { name: string; what: string; note: string };
export type HeatStep = { title: string; text: string };
export type HeatReason = { title: string; text: string; url?: string; draft?: boolean };

export const HEAT = otoplenieJson as unknown as {
  hub: { title: string; description: string; h1: string; lead: string; chips: string[]; priceNote: string; heroImage: string; heroImageAlt: string; stats: string[][]; ogImage: string };
  clusters: HeatCluster[]; services: HeatService[]; geo: HeatGeo[]; objects: SiteObject[]; steps: HeatStep[]; reasons: HeatReason[]; brands: HeatBrand[]; faq: Faq[]; prices: HeatPrice[];
  calculator: { title: string; lead: string; rates: Record<string, number>; ratesDraft: boolean };
};
export const heatServices: HeatService[] = HEAT.services;
export const heatGeo: HeatGeo[] = HEAT.geo;
export const heatObjects: SiteObject[] = HEAT.objects.map((o) => ({ ...o, section: "otoplenie" }));
export const getHeatService = (slug: string) => heatServices.find((s) => s.slug === slug);
export const getHeatGeo = (slug: string) => heatGeo.find((g) => g.slug === slug);
export const heatServicesByCluster = (cluster: string) => heatServices.filter((s) => s.cluster === cluster);

/** Все объекты бренда для общих страниц /obekty/ — канализация + отопление */
export const allObjects: SiteObject[] = [...objects, ...heatObjects, ...burObjectsList()];
export const getAnyObject = (slug: string) => allObjects.find((o) => o.slug === slug);
export const objectCover = (o: SiteObject) => o.cover || o.images[0];

/** Ссылки раздела «Отопление» */
export const HSEC = "/otoplenie";
export const HP = {
  hub: `${HSEC}/`,
  page: (slug: string) => `${HSEC}/${slug}/`,   // услуги
  geo: (slug: string) => `${HSEC}/${slug}/`,    // гео — тот же уровень
  ceny: `${HSEC}/ceny/`,
  calc: `${HSEC}/kalkulyator/`,
  object: (slug: string) => `/obekty/${slug}/`,
};

/* ======================= РАЗДЕЛ «БУРЕНИЕ» (content/burenie.json) ======================= */
export type BurService = {
  slug: string; name: string; title: string; description: string; h1: string; lead: string; cluster: string;
  heroImage?: string; heroImageAlt?: string; priceFrom?: string; priceDraft?: boolean; confirmWithClient?: string; sections: TextSection[]; faq: Faq[]; chips?: string[]; objects?: string[];
};
export type BurGeo = {
  slug: string; name: string; prep: string; distance: string; tract: string;
  depth: string; depthMax: number; steelDepth: number; depthSource?: "wells" | "estimate"; depthNote?: string; water: string; soil: string; construction: string; about: string[]; objects?: string[];
};
export const BUR = burenieJson as unknown as {
  hub: { title: string; description: string; h1: string; lead: string; chips: string[]; priceNote: string; heroImage: string; heroImageAlt: string; stats: string[][]; ogImage: string };
  clusters: HeatCluster[]; services: BurService[]; geo: BurGeo[]; geoNote: { depthDraft: boolean; text: string }; objects: SiteObject[]; steps: HeatStep[]; reasons: HeatReason[]; brands: HeatBrand[]; brandsDraft: boolean; faq: Faq[]; prices: HeatPrice[];
  calculator: { title: string; lead: string; rates: Record<string, number>; ratesDraft: boolean };
  depthMap: { title: string; iframe: string; lead: string };
};
export const burServices: BurService[] = BUR.services;
export const burGeo: BurGeo[] = BUR.geo;
function burObjectsList(): SiteObject[] { return (burenieJson as unknown as { objects: SiteObject[] }).objects.map((o) => ({ ...o, section: "burenie" })); }
export const burObjects: SiteObject[] = burObjectsList();
export const getBurService = (slug: string) => burServices.find((s) => s.slug === slug);
export const getBurGeo = (slug: string) => burGeo.find((g) => g.slug === slug);
export const burServicesByCluster = (cluster: string) => burServices.filter((s) => s.cluster === cluster);

/** Ссылки раздела «Бурение» */
export const BSEC = "/burenie";
export const BP = {
  hub: `${BSEC}/`,
  page: (slug: string) => `${BSEC}/${slug}/`,   // услуги
  geo: (slug: string) => `${BSEC}/${slug}/`,    // гео — тот же уровень
  ceny: `${BSEC}/ceny/`,
  calc: `${BSEC}/kalkulyator/`,
  map: `${BSEC}/karta-glubin/`,
  object: (slug: string) => `/obekty/${slug}/`,
};

/* ======================= РАЗДЕЛ «ВОДОСНАБЖЕНИЕ» (content/vodosnabzhenie.json) ======================= */
export type VodaService = {
  slug: string; name: string; title: string; description: string; h1: string; lead: string; cluster: string;
  heroImage?: string; heroImageAlt?: string; priceFrom?: string; priceDraft?: boolean; sections: TextSection[]; faq: Faq[]; chips?: string[]; objects?: string[];
};
export type VodaGeo = { slug: string; name: string; prep: string; distance: string; tract: string; source: string; sewer: string; housing: string; about: string[]; objects?: string[] };
export const VODA = vodaJson as unknown as {
  hub: { title: string; description: string; h1: string; lead: string; chips: string[]; priceNote: string; heroImage: string; heroImageAlt: string; stats: string[][]; ogImage: string };
  clusters: HeatCluster[]; services: VodaService[]; geo: VodaGeo[]; geoNote: { text: string; draft: boolean }; objectRefs: string[]; steps: HeatStep[]; reasons: HeatReason[]; brands: HeatBrand[]; brandsDraft: boolean; faq: Faq[]; prices: HeatPrice[];
  calculator: { title: string; lead: string; rates: Record<string, number>; ratesDraft: boolean };
};
export const vodaServices: VodaService[] = VODA.services;
export const vodaGeo: VodaGeo[] = VODA.geo;
/** Объекты раздела — реальные объекты бурения и отопления, где были вода и канализация */
export const vodaObjects: SiteObject[] = VODA.objectRefs.map((s) => allObjects.find((o) => o.slug === s)).filter(Boolean) as SiteObject[];
export const getVodaService = (slug: string) => vodaServices.find((s) => s.slug === slug);
export const getVodaGeo = (slug: string) => vodaGeo.find((g) => g.slug === slug);
export const vodaServicesByCluster = (cluster: string) => vodaServices.filter((s) => s.cluster === cluster);

/** Ссылки раздела «Водоснабжение» */
export const VSEC = "/vodosnabzhenie";
export const VP = {
  hub: `${VSEC}/`,
  page: (slug: string) => `${VSEC}/${slug}/`,   // услуги
  geo: (slug: string) => `${VSEC}/${slug}/`,    // гео — тот же уровень
  ceny: `${VSEC}/ceny/`,
  calc: `${VSEC}/kalkulyator/`,
  object: (slug: string) => `/obekty/${slug}/`,
};

/* ======================= РАЗДЕЛ «ЭЛЕКТРИКА» (content/elektrika.json) ======================= */
export type ElekService = {
  slug: string; name: string; title: string; description: string; h1: string; lead: string; cluster: string;
  heroImage?: string; heroImageAlt?: string; photoWanted?: string; priceFrom?: string; priceDraft?: boolean; confirmWithClient?: string; sections: TextSection[]; faq: Faq[]; chips?: string[]; objects?: string[];
};
export type ElekGeo = { slug: string; name: string; prep: string; distance: string; tract: string; grid: string; housing: string; about: string[]; objects?: string[] };
export const ELEK = elekJson as unknown as {
  hub: { title: string; description: string; h1: string; lead: string; chips: string[]; priceNote: string; photoWanted?: string; stats: string[][]; ogImage: string };
  clusters: HeatCluster[]; services: ElekService[]; geo: ElekGeo[]; geoNote: { text: string; draft: boolean }; objectRefs: string[]; objectsNote: string; steps: HeatStep[]; reasons: HeatReason[]; brands: HeatBrand[]; brandsDraft: boolean; faq: Faq[]; prices: HeatPrice[];
  calculator: { title: string; lead: string; rates: Record<string, number>; ratesDraft: boolean };
};
export const elekServices: ElekService[] = ELEK.services;
export const elekGeo: ElekGeo[] = ELEK.geo;
/** Объекты раздела — реальные объекты отопления с электрокотлами (своих объектов по электрике пока нет) */
export const elekObjects: SiteObject[] = ELEK.objectRefs.map((s) => allObjects.find((o) => o.slug === s)).filter(Boolean) as SiteObject[];
export const getElekService = (slug: string) => elekServices.find((s) => s.slug === slug);
export const getElekGeo = (slug: string) => elekGeo.find((g) => g.slug === slug);
export const elekServicesByCluster = (cluster: string) => elekServices.filter((s) => s.cluster === cluster);

/** Ссылки раздела «Электрика» */
export const ESEC = "/elektrika";
export const EP = {
  hub: `${ESEC}/`,
  page: (slug: string) => `${ESEC}/${slug}/`,   // услуги
  geo: (slug: string) => `${ESEC}/${slug}/`,    // гео — тот же уровень
  ceny: `${ESEC}/ceny/`,
  calc: `${ESEC}/kalkulyator/`,
  object: (slug: string) => `/obekty/${slug}/`,
};
