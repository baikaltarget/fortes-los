import LeadSection from "./LeadSection";
/** Блок заявки с текстами под отопление (LeadSection по умолчанию говорит про септики) */
export default function HeatLead({ source, title, text }: { source: string; title?: string; text?: string }) {
  return (
    <LeadSection
      source={source}
      title={title || "Инженер приедет бесплатно и посчитает отопление под ключ"}
      text={text || "Посмотрим дом или проект, посчитаем теплопотери, предложим схему: котёл, тёплый пол, радиаторы. Проект и смету вы получаете до договора — она не растёт в процессе."}
    />
  );
}
