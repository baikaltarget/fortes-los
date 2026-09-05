import site from "@/content/site.json";
import sectionsJson from "@/content/sections.json";

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
};
export type Geo = { slug: string; name: string; prep: string; distance: string; soil: string; note: string };
export type SiteObject = {
  slug: string; title: string; place: string; geo: string; type: string; product: string; productName: string; price: number;
  task: string; solution: string; result: string; estimate: string[][]; estimateDraft?: boolean; draft: boolean; images: string[];
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
