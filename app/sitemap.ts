import type { MetadataRoute } from "next";
import { SITE_URL, products, brands, services, geo, objects } from "@/lib/content";
import { getPosts } from "@/lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const u = (p: string, priority = 0.7, changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = "monthly") => ({ url: `${SITE_URL}${p}`, lastModified: now, changeFrequency, priority });
  return [
    u("/", 1, "weekly"),
    u("/stancii/", 0.9, "weekly"), u("/ceny/", 0.9, "weekly"), u("/kalkulyator/", 0.8), u("/obekty/", 0.8), u("/septik/", 0.9),
    u("/blog/", 0.6, "weekly"), u("/o-kompanii/", 0.5), u("/kontakty/", 0.6), u("/otzyvy/", 0.5), u("/politika/", 0.1, "yearly"),
    ...brands.map((b) => u(`/${b.slug}/`, 0.8)),
    ...products.map((p) => u(`/stancii/${p.slug}/`, p.hit ? 0.9 : 0.7)),
    ...services.map((s) => u(`/${s.slug}/`, 0.8)),
    ...geo.map((g) => u(`/septik/${g.slug}/`, 0.7)),
    ...objects.map((o) => u(`/obekty/${o.slug}/`, 0.6)),
    ...getPosts().map((p) => u(`/blog/${p.slug}/`, 0.5)),
  ];
}
