// GitHub Pages serves 404.html for any path that has no file. React Router's
// SPA fallback page boots the app client-side and renders the matching route
// (our "*" not-found page), so unknown URLs get a proper styled 404.
import { copyFileSync, existsSync, readdirSync } from "node:fs";

const out = "build/client";
const fallback = `${out}/__spa-fallback.html`;
if (!existsSync(fallback)) {
  console.error(`postbuild: ${fallback} not found. Files:`, readdirSync(out));
  process.exit(1);
}
copyFileSync(fallback, `${out}/404.html`);
console.log("postbuild: wrote 404.html");
