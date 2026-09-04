import Link from "next/link";
import { services } from "@/lib/content";
export default function ServiceLinks({ exclude, title = "Подберём под вашу задачу" }: { exclude?: string; title?: string }) {
  return (
    <section className="py-12 md:py-16">
      <div className="container-site">
        <h2 className="mb-6">{title}</h2>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {services.filter((s) => s.slug !== exclude).map((s) => (
            <Link key={s.slug} href={`/${s.slug}/`} className="card px-5 py-4 font-medium hover:shadow-card border border-transparent hover:border-line flex items-center justify-between gap-3">
              <span>{s.name}</span><span className="text-brand" aria-hidden>›</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
