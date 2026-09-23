import Link from "next/link";
import { AUTHORS, authorPath, type AuthorKey } from "@/lib/blog";

export function Avatar({ k, size = 44 }: { k: string; size?: number }) {
  const a = AUTHORS[k as AuthorKey] || AUTHORS["egor-zybarev"];
  return (
    <span className="inline-flex shrink-0 items-center justify-center rounded-full bg-brand text-white font-bold" style={{ width: size, height: size, fontSize: size * 0.36 }} aria-hidden>{a.initials}</span>
  );
}

/** Строка «автор» в шапке статьи. */
export default function AuthorBadge({ k }: { k: string }) {
  const a = AUTHORS[k as AuthorKey] || AUTHORS["egor-zybarev"];
  return (
    <Link href={authorPath(k)} className="inline-flex items-center gap-3 group" rel="author">
      <Avatar k={k} />
      <span className="leading-tight">
        <span className="block font-bold text-ink group-hover:text-brand">{a.name}</span>
        <span className="block text-[14px] text-muted">{a.role}</span>
      </span>
    </Link>
  );
}

/** Блок об авторе в конце статьи. */
export function AuthorBox({ k }: { k: string }) {
  const a = AUTHORS[k as AuthorKey] || AUTHORS["egor-zybarev"];
  return (
    <aside className="card p-5 md:p-7 flex gap-4 md:gap-5 items-start mt-10" aria-label="Об авторе">
      <Avatar k={k} size={64} />
      <div>
        <div className="text-[13px] uppercase tracking-wide text-muted font-bold">Автор статьи</div>
        <Link href={authorPath(k)} className="mt-1 block text-[19px] font-bold hover:text-brand" rel="author">{a.name}</Link>
        <div className="text-[15px] text-muted">{a.role}</div>
        <p className="mt-2 text-[15px] text-ink/85 leading-relaxed max-w-[62ch]">{a.bio}</p>
      </div>
    </aside>
  );
}
