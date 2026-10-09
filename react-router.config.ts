import type { Config } from "@react-router/dev/config";
import { projects } from "./app/content/projects.ts";

// Static site: no server at runtime. Every page below is rendered to its own
// HTML file at build time, so direct links and refreshes work on GitHub Pages.
export default {
  ssr: false,
  async prerender() {
    return ["/", "/projects", ...projects.map((p) => `/projects/${p.slug}`)];
  },
} satisfies Config;
