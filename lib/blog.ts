import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";

export type Post = { slug: string; title: string; description: string; date: string; h1: string; excerpt: string; html: string };

const DIR = path.join(process.cwd(), "content", "blog");

export function getPosts(): Post[] {
  if (!fs.existsSync(DIR)) return [];
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const raw = fs.readFileSync(path.join(DIR, f), "utf8");
      const { data, content } = matter(raw);
      const html = marked.parse(content) as string;
      return {
        slug: f.replace(/\.md$/, ""),
        title: data.title,
        description: data.description,
        date: data.date,
        h1: data.h1 || data.title,
        excerpt: data.excerpt || data.description,
        html,
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export const getPost = (slug: string) => getPosts().find((p) => p.slug === slug);
