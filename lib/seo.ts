import type { Metadata } from "next";
import { SITE_URL, company, type Faq } from "./content";

export function meta(o: { title: string; description: string; path: string; type?: "website" | "article" }): Metadata {
  const url = `${SITE_URL}${o.path}`;
  return {
    title: o.title,
    description: o.description,
    alternates: { canonical: url },
    openGraph: { title: o.title, description: o.description, url, siteName: company.name, locale: "ru_RU", type: o.type || "website" },
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

export const ldLocalBusiness = () => ({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${SITE_URL}/#business`,
  name: `${company.name} — септики и автономная канализация`,
  image: `${SITE_URL}/img/logo.webp`,
  url: SITE_URL,
  telephone: company.phoneRaw,
  email: company.email,
  priceRange: "₽₽",
  address: { "@type": "PostalAddress", streetAddress: company.addresses[0].street, addressLocality: "Иркутск", addressRegion: "Иркутская область", postalCode: company.addresses[0].postal, addressCountry: "RU" },
  geo: { "@type": "GeoCoordinates", latitude: company.addresses[0].lat, longitude: company.addresses[0].lng },
  openingHoursSpecification: [{ "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "09:00", closes: "18:00" }],
  areaServed: company.serviceArea.map((a) => ({ "@type": "Place", name: a })),
});

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
