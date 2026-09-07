import type { Metadata } from "next";
import { SITE_URL, company, type Faq } from "./content";

export function meta(o: { title: string; description: string; path: string; type?: "website" | "article"; image?: string }): Metadata {
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
    name: `${company.name} — инженерные системы: отопление, электрика, водоснабжение, канализация, бурение скважин${multi ? ` (${a.label})` : ""}`,
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

export const ldArticle = (o: { title: string; description: string; path: string; date: string }) => ({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: o.title,
  description: o.description,
  url: `${SITE_URL}${o.path}`,
  datePublished: o.date,
  dateModified: o.date,
  author: { "@type": "Organization", name: company.name },
  publisher: { "@type": "Organization", name: company.name, logo: { "@type": "ImageObject", url: `${SITE_URL}/img/logo.webp` } },
  mainEntityOfPage: `${SITE_URL}${o.path}`,
});
