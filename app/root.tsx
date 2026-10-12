import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import type { Route } from "./+types/root";

import "@fontsource/jersey-10/latin-400.css";
import "@fontsource/jetbrains-mono/latin-400.css";
import "@fontsource/jetbrains-mono/latin-700.css";
import "./styles/global.css";

// Preloading the two main font files means headings and body text appear in
// their real fonts straight away, instead of flashing a wider fallback first
// (most noticeable on phones over mobile data, especially in Safari).
import jerseyWoff2 from "@fontsource/jersey-10/files/jersey-10-latin-400-normal.woff2?url";
import monoWoff2 from "@fontsource/jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff2?url";

import { SiteHeader } from "./components/SiteHeader";
import { SiteFooter } from "./components/SiteFooter";
import { CheatCode } from "./components/CheatCode";
import { ScrollProgress } from "./components/Reveal";
import { motionBootScript } from "./lib/motion.ts";

export const links: Route.LinksFunction = () => [
  { rel: "preload", href: jerseyWoff2, as: "font", type: "font/woff2", crossOrigin: "anonymous" },
  { rel: "preload", href: monoWoff2, as: "font", type: "font/woff2", crossOrigin: "anonymous" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        {/* Decide on animations before first paint so nothing flickers. */}
        <script dangerouslySetInnerHTML={{ __html: motionBootScript }} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#1e1b33" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <Meta />
        <Links />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <ScrollProgress />
        <SiteHeader />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <SiteFooter />
        <CheatCode />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let heading = "Something went wrong";
  let detail = "This page failed to load. Try reloading, or head back to the hub.";
  if (isRouteErrorResponse(error) && error.status === 404) {
    heading = "Page not found";
    detail = "There's nothing at this address. The project list has everything on the site.";
  }
  return (
    <div className="wrap page-pad">
      <h1>{heading}</h1>
      <p>{detail}</p>
      <p>
        <a className="btn" href="/">
          Back to the hub
        </a>
      </p>
    </div>
  );
}
