import { notFound } from "next/navigation";
import { meta, ldPerson } from "@/lib/seo";
import { AUTHORS, authorPath, getPosts, type AuthorKey } from "@/lib/blog";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import LeadSection from "@/components/LeadSection";
import PostCard from "@/components/blog/PostCard";
import { Avatar } from "@/components/blog/AuthorBadge";

export const dynamicParams = false;
export function generateStaticParams() { return Object.keys(AUTHORS).map((author) => ({ author })); }
export function generateMetadata({ params }: { params: { author: string } }) {
  const a = AUTHORS[params.author as AuthorKey]; if (!a) return {};
  return meta({ title: `${a.name}, ${a.role.toLowerCase()} — статьи об инженерных системах дома`, description: `${a.name} — ${a.role.toLowerCase()} в Иркутске. Статьи о септиках, скважинах, отоплении, воде и электрике в частном доме — по опыту монтажа.`, path: authorPath(params.author) });
}

export default function Page({ params }: { params: { author: string } }) {
  const a = AUTHORS[params.author as AuthorKey]; if (!a) notFound();
  const posts = getPosts().filter((p) => p.author === params.author);
  const path = authorPath(params.author);
  return (
    <>
      <JsonLd data={ldPerson({ name: a.name, role: a.role, path, bio: a.bio })} />
      <div className="container-site">
        <Breadcrumbs items={[{ name: "Статьи", href: "/blog/" }, { name: a.name, href: path }]} />
        <div className="card p-6 md:p-10 flex flex-col md:flex-row gap-6 items-start">
          <Avatar k={params.author} size={96} />
          <div>
            <h1>{a.name}</h1>
            <div className="mt-1 text-[18px] text-muted">{a.role}</div>
            <p className="mt-4 text-[17px] text-ink/85 leading-relaxed max-w-[68ch]">{a.bio}</p>
            <div className="mt-3 text-[15px] text-muted">Статей в блоге: {posts.length}</div>
          </div>
        </div>
        <h2 className="mt-12 mb-6">Статьи автора</h2>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => <PostCard key={p.slug} p={p} />)}
        </div>
      </div>
      <LeadSection source={`автор ${params.author}`} />
    </>
  );
}
