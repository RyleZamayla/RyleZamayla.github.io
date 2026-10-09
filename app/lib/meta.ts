import { profile } from "../content/profile.ts";

/** Title, description, canonical URL and social preview tags for one page. */
export function pageMeta(opts: { title: string; description: string; path: string }) {
  const url = `${profile.siteUrl}${opts.path}`;
  return [
    { title: opts.title },
    { name: "description", content: opts.description },
    { tagName: "link", rel: "canonical", href: url },
    { property: "og:type", content: "website" },
    { property: "og:title", content: opts.title },
    { property: "og:description", content: opts.description },
    { property: "og:url", content: url },
    { name: "twitter:card", content: "summary" },
  ];
}
