import Link from "next/link";
import { getSection } from "@/lib/content";

/** Вторая липкая строка — навигация внутри раздела */
export default function SubNav({ section }: { section: string }) {
  const s = getSection(section);
  if (!s?.subnav) return null;
  return (
    <div className="sticky top-16 md:top-[72px] z-30 bg-[#EFEDED] border-b border-line">
      <div className="container-site h-11 flex items-center gap-1 overflow-x-auto text-[14px] [scrollbar-width:none]">
        <span className="font-extrabold pr-3 mr-1 border-r border-[#d8d4d4] whitespace-nowrap">{s.name}</span>
        {s.subnav.map(([t, h]) => <Link key={t + h} href={h} className="px-2.5 py-1.5 rounded-lg font-medium whitespace-nowrap hover:bg-white">{t}</Link>)}
      </div>
    </div>
  );
}
