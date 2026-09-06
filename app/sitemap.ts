import type { MetadataRoute } from "next";
import { SITE_URL, products, brands, services, geo, objects, sections, P, heatServices, heatGeo, heatObjects, HP, burServices, burGeo, burObjects, BP, vodaServices, vodaGeo, VP } from "@/lib/content";
import { getPosts } from "@/lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const u = (p: string, priority = 0.7, changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = "monthly") => ({ url: `${SITE_URL}${p}`, lastModified: now, changeFrequency, priority });
  return [
    u("/", 1, "weekly"),
    // канализация
    u(P.hub, 0.9, "weekly"), u(P.stancii, 0.9, "weekly"),
    u("/ceny/", 0.9, "weekly"), u("/kalkulyator/", 0.8), u("/obekty/", 0.8),
    u("/blog/", 0.6, "weekly"), u("/o-kompanii/", 0.5), u("/kontakty/", 0.6), u("/otzyvy/", 0.5), u("/politika/", 0.1, "yearly"),
    ...sections.filter((s) => !s.live).map((s) => u(`/${s.slug}/`, 0.4)),
    ...brands.map((b) => u(P.page(b.slug), 0.8)),
    ...products.map((p) => u(P.product(p.slug), p.hit ? 0.9 : 0.7)),
    ...services.map((s) => u(P.page(s.slug), 0.8)),
    ...geo.map((g) => u(P.geo(g.slug), 0.7)),
    ...objects.map((o) => u(P.object(o.slug), 0.6)),
    ...getPosts().map((p) => u(P.post(p.slug), 0.5)),
    // отопление
    u(HP.hub, 0.9, "weekly"), u(HP.ceny, 0.9, "weekly"), u(HP.calc, 0.8),
    ...heatServices.map((s) => u(HP.page(s.slug), 0.8)),
    ...heatGeo.map((g) => u(HP.geo(g.slug), 0.7)),
    ...heatObjects.map((o) => u(HP.object(o.slug), 0.7)),
    // бурение
    u(BP.hub, 0.9, "weekly"), u(BP.ceny, 0.9, "weekly"), u(BP.calc, 0.8), u(BP.map, 0.8),
    ...burServices.map((s) => u(BP.page(s.slug), 0.8)),
    ...burGeo.map((g) => u(BP.geo(g.slug), 0.7)),
    ...burObjects.map((o) => u(BP.object(o.slug), 0.7)),
    // водоснабжение (объекты — общие с бурением/отоплением, в sitemap не дублируются)
    u(VP.hub, 0.9, "weekly"), u(VP.ceny, 0.9, "weekly"), u(VP.calc, 0.8),
    ...vodaServices.map((s) => u(VP.page(s.slug), 0.8)),
    ...vodaGeo.map((g) => u(VP.geo(g.slug), 0.7)),
  ];
}
