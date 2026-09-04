import { SITE } from "@/lib/content";
/** Обёртка для мест, где нужны данные заказчика. Рамка видна, пока showDraftFrames=true в site.json */
export default function Draft({ on = true, note = "проверить данные", children, className = "" }: { on?: boolean; note?: string; children: React.ReactNode; className?: string }) {
  if (!on || !SITE.showDraftFrames) return <div className={className}>{children}</div>;
  return (
    <div className={`draft ${className}`} data-note={note}>
      {children}
    </div>
  );
}
