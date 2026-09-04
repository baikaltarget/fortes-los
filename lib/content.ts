import site from "@/content/site.json";

export type Faq = { q: string; a: string };
export type Variant = { name: string; price: number; note: string };
export type Product = {
  slug: string; brand: string; name: string; shortName: string; users: string; usersMin: number; usersMax: number;
  capacity: string; salvo: string; price: number; priceMidi: number; priceLong: number; installFrom: number; installFromDraft?: boolean;
  power: string; service: string; life: string; bestFor: string; hit: boolean; hitLabel?: string; summary: string; body: string[];
  specs: string[][]; variants: Variant[]; image: string; manufacturerUrl: string; manufacturerImg?: string; faq: Faq[];
};
export type Brand = { slug: string; name: string; title: string; description: string; h1: string; intro: string; points: string[] };
export type Section = { h2: string; p: string[] };
export type Extra = { name: string; d: string; price: number; note: string; hit?: boolean };
export type Service = {
  slug: string; name: string; title: string; description: string; h1: string; lead: string; products: string[]; sections: Section[]; faq: Faq[];
  kessons?: Extra[]; servicePrices?: { name: string; price: string; draft?: boolean }[]; koloIlma?: { priceFrom: number; capacity: string; life: string; service: string };
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
export const turnkeyFrom = (p: Product) => p.price + p.installFrom;
