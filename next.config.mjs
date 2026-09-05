import site from "./content/site.json" with { type: "json" };

/** 301 со старых адресов v1–v5 (корневые URL септиков) на /kanalizaciya/… */
const old = [
  ...site.services.map((s) => s.slug),
  ...site.brands.map((b) => b.slug),
];
const redirects = [
  { source: "/index.html", destination: "/", permanent: true },
  { source: "/stancii", destination: "/kanalizaciya/stancii/", permanent: true },
  { source: "/stancii/:slug", destination: "/kanalizaciya/stancii/:slug/", permanent: true },
  { source: "/septik", destination: "/kanalizaciya/", permanent: true },
  { source: "/septik/:geo", destination: "/kanalizaciya/:geo/", permanent: true },
  ...old.map((slug) => ({ source: `/${slug}`, destination: `/kanalizaciya/${slug}/`, permanent: true })),
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  images: { unoptimized: true },
  poweredByHeader: false,
  async redirects() { return redirects; },
};
export default nextConfig;
