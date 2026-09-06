import LeadSection from "./LeadSection";
/** Блок заявки с текстами под водоснабжение и канализацию в доме */
export default function WaterLead({ source, title, text }: { source: string; title?: string; text?: string }) {
  return (
    <LeadSection
      source={source}
      title={title || "Инженер приедет бесплатно и посчитает по точкам"}
      text={text || "Посмотрим дом или проект: где ввод, куда вывод канализации, сколько санузлов и точек. Составим схему разводки и смету построчно — она фиксируется в договоре и не растёт в процессе."}
    />
  );
}
