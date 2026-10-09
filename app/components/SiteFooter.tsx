import { profile } from "../content/profile.ts";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap site-footer__inner">
        <p>
          {profile.name}, {profile.location}.
        </p>
        <p>Psst: the old cheat code from the 1980s still works here.</p>
        <p>
          Pixel art drawn by hand in SVG. Every project claim on this site links to the commit or build that backs it.{" "}
          <a href={`${profile.links.github}/RyleZamayla.github.io`}>Source for this site</a>
        </p>
      </div>
    </footer>
  );
}
