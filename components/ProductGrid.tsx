import ProductCard from "./ProductCard";
import { getProduct } from "@/lib/content";

export default function ProductGrid({ slugs, title, sub }: { slugs: string[]; title?: string; sub?: string }) {
  const list = slugs.map(getProduct).filter(Boolean);
  if (!list.length) return null;
  return (
    <section className="py-12 md:py-16">
      <div className="container-site">
        {title && <h2 className="mb-2">{title}</h2>}
        {sub && <p className="text-muted max-w-[70ch] mb-8">{sub}</p>}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => <ProductCard key={p!.slug} p={p!} compact />)}
        </div>
      </div>
    </section>
  );
}
