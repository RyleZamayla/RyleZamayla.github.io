// Serves build/client the way GitHub Pages does: /path -> /path/index.html,
// missing files -> 404.html with status 404. For checking a build locally.
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const root = "build/client";
const port = Number(process.env.PORT ?? 4173);
const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".woff": "font/woff", ".json": "application/json" };

async function resolve(urlPath) {
  const safe = normalize(decodeURIComponent(urlPath)).replace(/^(\.\.[/\\])+/, "");
  const file = join(root, safe);
  try {
    const s = await stat(file);
    if (s.isFile()) return { file, redirect: null };
    if (s.isDirectory()) {
      if (!urlPath.endsWith("/")) return { file: null, redirect: `${urlPath}/` };
      await stat(join(file, "index.html"));
      return { file: join(file, "index.html"), redirect: null };
    }
  } catch {}
  return { file: null, redirect: null };
}

createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", "http://localhost");
  const { file, redirect } = await resolve(url.pathname);
  if (redirect) {
    res.writeHead(301, { Location: redirect + url.search });
    return res.end();
  }
  if (file) {
    res.writeHead(200, { "Content-Type": types[extname(file)] ?? "application/octet-stream" });
    return res.end(await readFile(file));
  }
  res.writeHead(404, { "Content-Type": types[".html"] });
  res.end(await readFile(join(root, "404.html")));
}).listen(port, () => console.log(`Serving ${root} at http://localhost:${port}`));
