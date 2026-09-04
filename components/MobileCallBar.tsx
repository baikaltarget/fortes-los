import { company } from "@/lib/content";
export default function MobileCallBar() {
  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 p-3 bg-page/95 backdrop-blur border-t border-line grid grid-cols-2 gap-2">
      <a href={`tel:${company.phoneRaw}`} className="btn-primary h-12">Позвонить</a>
      <a href="#lead" className="btn-outline h-12 bg-white">Расчёт</a>
    </div>
  );
}
