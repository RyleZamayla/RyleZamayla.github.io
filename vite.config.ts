import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";

// Served from the root of https://rylezamayla.github.io/ (a GitHub user site),
// so no base path is needed. If this ever moves to a project repo, set
// `base: "/<repo>/"` here and `basename` in react-router.config.ts.
export default defineConfig({
  plugins: [reactRouter()],
  // Stamped into the footer so visitors can see how fresh the site is.
  define: {
    __BUILD_DATE__: JSON.stringify(new Date().toISOString().slice(0, 10)),
  },
});
