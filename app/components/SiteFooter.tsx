import { Link } from "react-router";
import { profile } from "../content/profile.ts";
import { projects } from "../content/projects.ts";
import { formatDate } from "../lib/format.ts";

const explore = [
  { to: "/projects", label: "All projects" },
  { to: "/#skills", label: "Skill tree" },
  { to: "/#quests", label: "Quest log" },
  { to: "/#contact", label: "Contact" },
];

export function SiteFooter() {
  const year = __BUILD_DATE__.slice(0, 4);
  return (
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <div className="footer-about">
          <p className="footer-brand">
            <span className="brand__mark" aria-hidden="true">
              RZ
            </span>
            {profile.name}
          </p>
          <p>{profile.tagline}.</p>
          <p className="muted">Based in {profile.location}.</p>
        </div>

        <nav aria-labelledby="footer-explore" className="footer-col">
          <h2 id="footer-explore" className="footer-heading">
            Explore
          </h2>
          <ul>
            {explore.map((l) => (
              <li key={l.to}>
                <Link to={l.to}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-labelledby="footer-projects" className="footer-col">
          <h2 id="footer-projects" className="footer-heading">
            Projects
          </h2>
          <ul>
            {projects.map((p) => (
              <li key={p.slug}>
                <Link viewTransition to={`/projects/${p.slug}`}>
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <section aria-labelledby="footer-connect" className="footer-col">
          <h2 id="footer-connect" className="footer-heading">
            Connect
          </h2>
          <ul>
            <li>
              <a href={profile.links.github} rel="me">
                GitHub
              </a>
            </li>
            <li>
              <a href={profile.links.linkedin} rel="me">
                LinkedIn
              </a>
            </li>
            <li>
              <a href={profile.links.facebook} rel="me">
                Facebook
              </a>
            </li>
            <li>
              <a href={profile.links.instagram} rel="me">
                Instagram
              </a>
            </li>
            <li>
              <Link to="/#contact">Email me</Link>
            </li>
            <li>
              <a href={`${profile.links.github}/RyleZamayla.github.io`}>Source for this site</a>
            </li>
          </ul>
        </section>
      </div>

      <div className="footer-bar">
        <div className="wrap footer-bar__inner">
          <p>
            © {year} {profile.name}
          </p>
          <p className="muted">
            Last updated <time dateTime={__BUILD_DATE__}>{formatDate(__BUILD_DATE__)}</time>. Pixels drawn by hand in
            SVG.
          </p>
          <p className="muted footer-hint">Psst: the old 1980s cheat code still works.</p>
          <button
            type="button"
            className="to-top"
            onClick={() => {
              window.scrollTo({ top: 0 });
              document.getElementById("main")?.focus({ preventScroll: true });
            }}
          >
            <span className="to-top__arrow" aria-hidden="true" />
            Back to top
          </button>
        </div>
      </div>
    </footer>
  );
}
