import LeadSection from "./LeadSection";
/** Блок заявки с текстами под электрику частного дома */
export default function ElectroLead({ source, title, text }: { source: string; title?: string; text?: string }) {
  return (
    <LeadSection
      source={source}
      title={title || "Инженер приедет бесплатно и посчитает по точкам"}
      text={text || "Посмотрим дом или план: где ввод и щит, сколько точек по комнатам, что из отопления и оборудования будет на электричестве. Составим схему групп и смету построчно — она фиксируется в договоре и не растёт в процессе."}
    />
  );
}
