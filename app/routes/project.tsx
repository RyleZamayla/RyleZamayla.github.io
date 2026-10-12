import { useEffect } from "react";
import { Link, useLocation } from "react-router";
import type { Route } from "./+types/project";
import { getProject, projects } from "../content/projects.ts";
import { KindTag } from "../components/KindTag";
import { Timeline } from "../components/Timeline";
import { pageMeta } from "../lib/meta.ts";
import NotFound from "./not-found";

export function meta({ params }: Route.MetaArgs) {
  const project = getProject(params.slug);
  if (!project) return [{ title: "Project not found" }, { name: "robots", content: "noindex" }];
  return pageMeta({
    title: `${project.title}: case study`,
    description: project.tagline,
    path: `/projects/${project.slug}/`,
  });
}

export default function ProjectPage({ params }: Route.ComponentProps) {
  const project = getProject(params.slug);
  const { hash } = useLocation();

  // Links from the skill tree point at a milestone (#id). Bring it into view
  // after client-side navigation, when the browser won't do it by itself.
  useEffect(() => {
    if (!hash) return;
    const el = document.getElementById(decodeURIComponent(hash.slice(1)));
    if (!el) return;
    el.closest("details")?.setAttribute("open", "");
    el.scrollIntoView({ block: "start" });
  }, [hash, params.slug]);

  if (!project) return <NotFound />;
  const i = projects.indexOf(project);
  const prev = projects[i - 1];
  const next = projects[i + 1];

  return (
    <article className="wrap page-pad case">
      <nav aria-label="Breadcrumb" className="crumbs">
        <Link viewTransition to="/projects">Projects</Link>
      </nav>
      <header className="case__head">
        <KindTag kind={project.kind} />
        <h1>{project.title}</h1>
        <p className="lede">{project.tagline}</p>
        <p className="muted">{project.period}</p>
      </header>

      {project.stats.length > 0 && (
        <dl className="stats">
          {project.stats.map((s) => (
            <div key={s.label} className="stat">
              <dt>{s.label}</dt>
              <dd>
                <span className="stat__value">{s.value}</span>
                <span className="muted small">{s.source}</span>
              </dd>
            </div>
          ))}
        </dl>
      )}

      <section aria-labelledby="problem">
        <h2 id="problem">The problem</h2>
        <p>{project.problem}</p>
      </section>
      <section aria-labelledby="what">
        <h2 id="what">What it does</h2>
        <p>{project.overview}</p>
      </section>
      <section aria-labelledby="role">
        <h2 id="role">My role</h2>
        <p>{project.role}</p>
      </section>
      <section aria-labelledby="stack">
        <h2 id="stack">Stack and integrations</h2>
        <ul className="chips">
          {[...project.stack, ...project.integrations].map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </section>
      <section aria-labelledby="timeline">
        <h2 id="timeline">How it was built</h2>
        <p className="muted">
          Milestones grouped into phases. Each one shows its date, the commit or build it comes from, and how it was
          checked.
        </p>
        <Timeline phases={project.phases} />
      </section>
      <section aria-labelledby="source">
        <h2 id="source">Source</h2>
        <p>{project.sourceNote}</p>
      </section>

      <nav className="pager" aria-label="More projects">
        {prev ? <Link viewTransition to={`/projects/${prev.slug}`}>Previous: {prev.title}</Link> : <span />}
        {next ? <Link viewTransition to={`/projects/${next.slug}`}>Next: {next.title}</Link> : <span />}
      </nav>
    </article>
  );
}
