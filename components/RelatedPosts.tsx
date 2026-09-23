import Link from "next/link";
import { getPosts, postsByCategory, type CategoryKey } from "@/lib/blog";
import PostCard from "@/components/blog/PostCard";

/** Какие статьи блога показывать на страницах канализации. Ключ — slug услуги/станции/бренда или "home"/"hub". */
export const RELATED_POSTS: Record<string, string[]> = {
  home: ["skolko-stoit-septik-pod-klyuch", "kakoj-septik-vybrat-dlya-doma-v-irkutske", "septik-ili-stanciya-biologicheskoj-ochistki"],
  hub: ["kakoj-septik-vybrat-dlya-doma-v-irkutske", "septik-ili-stanciya-biologicheskoj-ochistki", "rasstoyanie-ot-septika-do-doma-i-skvazhiny"],
  "septik-dlya-chastnogo-doma": ["kakoj-septik-vybrat-dlya-doma-v-irkutske", "skolko-stoit-septik-pod-klyuch", "rasstoyanie-ot-septika-do-doma-i-skvazhiny"],
  "septik-bez-otkachki": ["septik-bez-otkachki-pravda-ili-marketing", "septik-bez-otkachki-otzyvy-vladelcev", "kak-rabotaet-stanciya-biologicheskoj-ochistki"],
  "avtonomnaya-kanalizaciya": ["septik-ili-stanciya-biologicheskoj-ochistki", "kak-rabotaet-stanciya-biologicheskoj-ochistki", "kuda-slivat-vodu-iz-septika"],
  "stanciya-biologicheskoj-ochistki": ["kak-rabotaet-stanciya-biologicheskoj-ochistki", "septik-ili-stanciya-biologicheskoj-ochistki", "kak-stanciya-zimuet-v-sibiri"],
  "septik-dlya-dachi": ["nuzhno-li-konservirovat-septik-na-zimu", "kakoj-septik-vybrat-dlya-doma-v-irkutske", "kuda-slivat-vodu-iz-septika"],
  "septik-dlya-bani": ["kuda-slivat-vodu-iz-septika", "nuzhno-li-konservirovat-septik-na-zimu"],
  "septik-pri-vysokih-gruntovyh-vodah": ["septik-i-gruntovye-vody", "kuda-slivat-vodu-iz-septika", "skolko-stoit-septik-pod-klyuch"],
  "septik-dlya-zimy": ["kak-stanciya-zimuet-v-sibiri", "nuzhno-li-konservirovat-septik-na-zimu"],
  "plastikovye-septiki": ["septik-i-gruntovye-vody", "kakoj-septik-vybrat-dlya-doma-v-irkutske"],
  "montazh-septika": ["rasstoyanie-ot-septika-do-doma-i-skvazhiny", "septik-i-gruntovye-vody", "skolko-stoit-septik-pod-klyuch"],
  "obsluzhivanie-septika": ["nuzhno-li-konservirovat-septik-na-zimu", "kak-stanciya-zimuet-v-sibiri", "septik-bez-otkachki-otzyvy-vladelcev"],
  "zamena-vygrebnoj-yamy": ["septik-bez-otkachki-pravda-ili-marketing", "skolko-stoit-septik-pod-klyuch"],
  "septik-v-rassrochku": ["skolko-stoit-septik-pod-klyuch", "kakoj-septik-vybrat-dlya-doma-v-irkutske"],
  "kanalizaciya-v-chastnom-dome": ["kakoj-septik-vybrat-dlya-doma-v-irkutske", "rasstoyanie-ot-septika-do-doma-i-skvazhiny", "kuda-slivat-vodu-iz-septika"],
  "septik-iz-betonnyh-kolec": ["septik-ili-stanciya-biologicheskoj-ochistki", "septik-i-gruntovye-vody", "skolko-stoit-septik-pod-klyuch"],
  "perelivnoj-septik": ["septik-ili-stanciya-biologicheskoj-ochistki", "kuda-slivat-vodu-iz-septika"],
  "bioseptik-dlya-chastnogo-doma": ["kak-rabotaet-stanciya-biologicheskoj-ochistki", "septik-bez-otkachki-otzyvy-vladelcev"],
  "lokalnye-ochistnye-sooruzheniya": ["kak-rabotaet-stanciya-biologicheskoj-ochistki", "septik-ili-stanciya-biologicheskoj-ochistki"],
  "septik-s-prinuditelnym-sbrosom": ["kuda-slivat-vodu-iz-septika", "septik-i-gruntovye-vody"],
  "septik-dlya-glinistoj-pochvy": ["kuda-slivat-vodu-iz-septika", "septik-i-gruntovye-vody"],
  "septik-na-skalnom-grunte": ["kuda-slivat-vodu-iz-septika", "kakoj-septik-vybrat-dlya-doma-v-irkutske"],
  "septik-dlya-postoyannogo-prozhivaniya": ["kak-stanciya-zimuet-v-sibiri", "septik-bez-otkachki-otzyvy-vladelcev"],
  "septik-dlya-kottedzha": ["kakoj-septik-vybrat-dlya-doma-v-irkutske", "novo-eko-ili-topas"],
  "septik-na-3-cheloveka": ["kakoj-septik-vybrat-dlya-doma-v-irkutske", "skolko-stoit-septik-pod-klyuch"],
  "septik-na-5-chelovek": ["kakoj-septik-vybrat-dlya-doma-v-irkutske", "novo-eko-ili-evrolos"],
  "septik-na-2-semi": ["kakoj-septik-vybrat-dlya-doma-v-irkutske", "novo-eko-ili-topas"],
  "novo-eko": ["novo-eko-ili-evrolos", "novo-eko-ili-topas", "kak-stanciya-zimuet-v-sibiri"],
  "zorde": ["septik-ili-stanciya-biologicheskoj-ochistki", "kak-stanciya-zimuet-v-sibiri"],
  "kolo-vesi": ["kak-rabotaet-stanciya-biologicheskoj-ochistki", "kak-stanciya-zimuet-v-sibiri"],
  stancii: ["novo-eko-ili-evrolos", "novo-eko-ili-topas", "kak-rabotaet-stanciya-biologicheskoj-ochistki"],
};

/** v37: блоки статей на хабах других разделов — берутся по теме статьи + общая статья «Дом целиком». */
export const SECTION_POSTS = (cat: CategoryKey, n = 3) =>
  [...postsByCategory(cat), ...postsByCategory("dom")].slice(0, n).map((p) => p.slug);

export default function RelatedPosts({ slugs, title = "Статьи по теме" }: { slugs?: string[]; title?: string }) {
  if (!slugs || slugs.length === 0) return null;
  const all = getPosts();
  const posts = slugs.map((s) => all.find((p) => p.slug === s)).filter(Boolean) as ReturnType<typeof getPosts>;
  if (posts.length === 0) return null;
  return (
    <section className="py-10 md:py-12">
      <div className="container-site">
        <div className="flex flex-wrap items-baseline justify-between gap-3 mb-6"><h2>{title}</h2><Link href="/blog/" className="text-brand underline underline-offset-2 text-[15px]">Все статьи</Link></div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => <PostCard key={p.slug} p={p} headingLevel={3} />)}
        </div>
      </div>
    </section>
  );
}
