import { useEffect } from "react";
import { Link, useLocation } from "react-router";
import type { Route } from "./+types/project";
import { getProject, projects } from "../content/projects.ts";
import { KindTag } from "../components/KindTag";
import { Timeline } from "../components/Timeline";
import { CountUp, Reveal } from "../components/Reveal";
import { SnapshotGallery } from "../components/Snapshots";
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
    // Show and highlight it straight away; :target doesn't update on in-app navigation.
    document.querySelectorAll(".milestone.is-linked").forEach((m) => m.classList.remove("is-linked"));
    el.classList.add("is-linked");
    el.scrollIntoView({ block: "start", behavior: "instant" });
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
        <p className="case__meta">
          <span>{project.period}</span>
          <span>{project.role}</span>
        </p>
      </header>

      <section className="glance-card" aria-labelledby="glance">
        <h2 id="glance" className="sr-only">
          At a glance
        </h2>
        <dl>
          <div>
            <dt>The problem</dt>
            <dd>{project.problem}</dd>
          </div>
          <div>
            <dt>What I built</dt>
            <dd>{project.overview}</dd>
          </div>
          <div className="glance-card__proof">
            <dt>Proof</dt>
            <dd>{project.outcome}</dd>
          </div>
        </dl>
        <ul className="chips" aria-label="Stack and integrations">
          {[...project.stack, ...project.integrations].map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        {project.stats.length > 0 && (
          <dl className="stats">
            {project.stats.map((s) => (
              <div key={s.label} className="stat">
                <dt>{s.label}</dt>
                <dd>
                  <span className="stat__value">
                    <CountUp value={s.value} />
                  </span>
                  <span className="muted small">{s.source}</span>
                </dd>
              </div>
            ))}
          </dl>
        )}
      </section>

      <section aria-labelledby="snapshots">
        <Reveal>
          <h2 id="snapshots">Snapshots</h2>
        </Reveal>
        <SnapshotGallery project={project} />
      </section>

      <section aria-labelledby="timeline">
        <Reveal>
          <h2 id="timeline">How it was built</h2>
          <p className="muted">Each milestone links to the commit or build behind it.</p>
        </Reveal>
        <Timeline phases={project.phases} />
      </section>

      <p className="source-note muted small">{project.sourceNote}</p>

      <nav className="pager" aria-label="More projects">
        {prev ? <Link viewTransition to={`/projects/${prev.slug}`}>Previous: {prev.title}</Link> : <span />}
        {next ? <Link viewTransition to={`/projects/${next.slug}`}>Next: {next.title}</Link> : <span />}
      </nav>
    </article>
  );
}
