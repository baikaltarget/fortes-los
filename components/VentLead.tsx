import LeadSection from "./LeadSection";
/** Блок заявки с текстами под вентиляцию (v32) */
export default function VentLead({ source, title, text }: { source: string; title?: string; text?: string }) {
  return (
    <LeadSection
      source={source}
      title={title || "Инженер приедет бесплатно и посчитает воздухообмен"}
      text={text || "Посмотрим дом или план: чердак, кровлю, котельную, где пройдут воздуховоды. Дадим две-три схемы под бюджет — от вытяжек с клапанами до установки с рекуперацией — и смету по позициям, которая фиксируется в договоре."}
    />
  );
}
