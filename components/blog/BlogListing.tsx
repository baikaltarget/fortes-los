import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import LeadSection from "@/components/LeadSection";
import PostCard from "./PostCard";
import Pagination from "./Pagination";
import TopicNav from "./TopicNav";
import { ldBlogList, type Crumb } from "@/lib/seo";
import type { CategoryKey, Post } from "@/lib/blog";

export default function BlogListing({ posts, h1, lead, crumbs, path, active, page = 1, total = 1, featured = false, children }: {
  posts: Post[]; h1: string; lead: string; crumbs: Crumb[]; path: string; active?: CategoryKey; page?: number; total?: number; featured?: boolean; children?: React.ReactNode;
}) {
  const [first, ...rest] = posts;
  return (
    <>
      <JsonLd data={ldBlogList({ name: h1, path, items: posts.map((p) => ({ name: p.h1, path: `/blog/${p.slug}/` })) })} />
      <div className="container-site pb-4">
        <Breadcrumbs items={crumbs} />
        <h1>{h1}</h1>
        <p className="mt-4 text-[18px] text-ink/85 max-w-[68ch]">{lead}</p>
        <TopicNav active={active} />
        {children}
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {featured && first ? <PostCard p={first} big eager /> : first ? <PostCard p={first} eager /> : null}
          {rest.map((p, i) => <PostCard key={p.slug} p={p} eager={i < 2} />)}
        </div>
        <Pagination page={page} total={total} />
      </div>
      <LeadSection source="блог" />
    </>
  );
}
