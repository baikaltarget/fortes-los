import LeadForm from "./LeadForm";
import { company } from "@/lib/content";

export default function LeadSection({ source, title, text }: { source: string; title?: string; text?: string }) {
  return (
    <section id="lead" className="py-12 md:py-16 scroll-mt-24">
      <div className="container-site grid gap-8 lg:grid-cols-[1fr_1.1fr] items-start">
        <div>
          <h2>{title || "Инженер приедет бесплатно и посчитает под ключ"}</h2>
          <p className="mt-4 text-ink/85 max-w-[60ch]">{text || "Замерим глубину выхода трубы, оценим грунт и воду, покажем два-три варианта станции с ценой. Смету фиксируем в договоре — она не растёт в процессе."}</p>
          <a href={`tel:${company.phoneRaw}`} className="mt-6 inline-block text-3xl font-extrabold tracking-tight">{company.phone}</a>
          <div className="text-muted">{company.hours}</div>
        </div>
        <LeadForm source={source} />
      </div>
    </section>
  );
}
