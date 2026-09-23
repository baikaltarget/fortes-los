import type { Metadata } from "next";
import { SITE_URL, company, type Faq } from "./content";

/** v37: title ≤75 — длинным снимаем хвост «| Фортес» (бренд и так в сниппете). */
export function clampTitle(s: string) {
  const t = s.replace(/\s+/g, " ").trim();
  return t.length > 75 ? t.replace(/\s*\|\s*Фортес$/, "") : t;
}
/** v37: description ≤175 — режем по границе предложения, иначе по слову с многоточием. */
export function clampDescription(s: string, max = 175) {
  const d = s.replace(/\s+/g, " ").trim();
  if (d.length <= max) return d;
  const cut = d.slice(0, max + 1);
  const end = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("! "), cut.lastIndexOf("? "));
  if (end >= 110) return cut.slice(0, end + 1);
  return cut.slice(0, max - 1).replace(/[\s,;:—–-]+\S*$/, "") + "…";
}

export function meta(o0: { title: string; description: string; path: string; type?: "website" | "article"; image?: string }): Metadata {
  const o = { ...o0, title: clampTitle(o0.title), description: clampDescription(o0.description) };
  const url = `${SITE_URL}${o.path}`;
  const img = o.image || "/img/og.jpg";
  return {
    title: o.title,
    description: o.description,
    alternates: { canonical: url },
    openGraph: { title: o.title, description: o.description, url, siteName: company.name, locale: "ru_RU", type: o.type || "website", images: [{ url: `${SITE_URL}${img}`, width: 1200, height: 630 }] },
    robots: { index: true, follow: true },
  };
}

export type Crumb = { name: string; href: string };

export const ldOrganization = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: company.name,
  legalName: company.legalName,
  url: SITE_URL,
  logo: `${SITE_URL}/img/logo.webp`,
  telephone: company.phoneRaw,
  email: company.email,
  address: { "@type": "PostalAddress", streetAddress: company.addresses[0].street, addressLocality: "Иркутск", addressRegion: "Иркутская область", postalCode: company.addresses[0].postal, addressCountry: "RU" },
  foundingDate: String(company.foundedYear),
});

export const ldLocalBusiness = (addressIndex: number = 0) => {
  const a = company.addresses[addressIndex];
  const multi = company.addresses.length > 1;
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#business${multi ? `-${addressIndex + 1}` : ""}`,
    name: `${company.name} — инженерные системы: отопление, вентиляция, электрика, водоснабжение, канализация, бурение скважин${multi ? ` (${a.label})` : ""}`,
    image: `${SITE_URL}/img/logo.webp`,
    url: SITE_URL,
    telephone: company.phoneRaw,
    email: company.email,
    priceRange: "₽₽",
    address: { "@type": "PostalAddress", streetAddress: a.street, addressLocality: a.city, addressRegion: "Иркутская область", postalCode: a.postal, addressCountry: "RU" },
    geo: { "@type": "GeoCoordinates", latitude: a.lat, longitude: a.lng },
    openingHoursSpecification: [{ "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "09:00", closes: "18:00" }],
    areaServed: company.serviceArea.map((ar) => ({ "@type": "Place", name: ar })),
  };
};

/** JSON-LD для всех офисов компании — использовать в layout вместо одиночного ldLocalBusiness() */
export const ldLocalBusinessAll = () => company.addresses.map((_, i) => ldLocalBusiness(i));

export const ldBreadcrumbs = (crumbs: Crumb[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: `${SITE_URL}${c.href}` })),
});

export const ldFaq = (faq: Faq[]) =>
  faq.length
    ? { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }
    : null;

export const ldService = (o: { name: string; description: string; path: string; priceFrom?: number; area?: string }) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  name: o.name,
  description: o.description,
  url: `${SITE_URL}${o.path}`,
  provider: { "@id": `${SITE_URL}/#business` },
  areaServed: o.area || "Иркутск и Иркутский район",
  ...(o.priceFrom ? { offers: { "@type": "Offer", priceCurrency: "RUB", price: o.priceFrom, availability: "https://schema.org/InStock" } } : {}),
});

export const ldProduct = (o: { name: string; description: string; path: string; price: number; brand: string; image?: string }) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  name: o.name,
  description: o.description,
  url: `${SITE_URL}${o.path}`,
  brand: { "@type": "Brand", name: o.brand },
  ...(o.image ? { image: `${SITE_URL}${o.image}` } : {}),
  offers: { "@type": "Offer", priceCurrency: "RUB", price: o.price, availability: "https://schema.org/InStock", url: `${SITE_URL}${o.path}`, seller: { "@id": `${SITE_URL}/#business` } },
});

export const ldPerson = (o: { name: string; role: string; path: string; bio?: string; image?: string }) => ({
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${SITE_URL}${o.path}#person`,
  name: o.name,
  jobTitle: o.role.replace(/ Фортес$/, ""),
  description: o.bio,
  ...(o.image ? { image: `${SITE_URL}${o.image}` } : {}),
  url: `${SITE_URL}${o.path}`,
  worksFor: { "@type": "Organization", name: company.name, url: SITE_URL },
});

export const ldArticle = (o: { title: string; description: string; path: string; date: string; updated?: string; image?: string; section?: string; words?: number; author?: { name: string; role: string; path: string; image?: string } }) => ({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: o.title,
  description: o.description,
  url: `${SITE_URL}${o.path}`,
  inLanguage: "ru-RU",
  datePublished: o.date,
  dateModified: o.updated || o.date,
  ...(o.image ? { image: { "@type": "ImageObject", url: `${SITE_URL}${o.image}`, width: 1200, height: 630 } } : {}),
  ...(o.section ? { articleSection: o.section } : {}),
  ...(o.words ? { wordCount: o.words } : {}),
  author: o.author
    ? { "@type": "Person", "@id": `${SITE_URL}${o.author.path}#person`, name: o.author.name, jobTitle: o.author.role.replace(/ Фортес$/, ""), url: `${SITE_URL}${o.author.path}`, ...(o.author.image ? { image: `${SITE_URL}${o.author.image}` } : {}), worksFor: { "@type": "Organization", name: company.name } }
    : { "@type": "Organization", name: company.name },
  publisher: { "@type": "Organization", name: company.name, logo: { "@type": "ImageObject", url: `${SITE_URL}/img/logo.webp` } },
  mainEntityOfPage: `${SITE_URL}${o.path}`,
  about: { "@type": "Place", name: "Иркутск и Иркутский район" },
});

export const ldBlogList = (o: { name: string; path: string; items: { name: string; path: string }[] }) => ({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: o.name,
  url: `${SITE_URL}${o.path}`,
  inLanguage: "ru-RU",
  mainEntity: { "@type": "ItemList", itemListElement: o.items.map((it, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE_URL}${it.path}`, name: it.name })) },
});
