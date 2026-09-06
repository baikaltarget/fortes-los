import LeadSection from "./LeadSection";
/** Блок заявки с текстами под бурение (LeadSection по умолчанию говорит про септики) */
export default function DrillLead({ source, title, text }: { source: string; title?: string; text?: string }) {
  return (
    <LeadSection
      source={source}
      title={title || "Инженер приедет бесплатно и назовёт цену метра"}
      text={text || "Посмотрим подъезд для буровой, выберем точку с учётом септиков и построек, сверимся с картой глубин по соседним скважинам. Конструкцию, цену метра и обустройство фиксируем в договоре — она не растёт в процессе."}
    />
  );
}
