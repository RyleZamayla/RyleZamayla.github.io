import { Link } from "react-router";
import type { Project } from "../content/types.ts";
import { KindTag } from "./KindTag";
import { CountUp } from "./Reveal";
import { useReveal } from "../hooks/useReveal.ts";

/** The featured project gets a large panel; the rest read as a level-select list. */
export function FeaturedProject({ project }: { project: Project }) {
  const stat = project.stats[0];
  return (
    <article className="featured">
      <div className="featured__text">
        <KindTag kind={project.kind} />
        <h3>
          <Link viewTransition to={`/projects/${project.slug}`}>{project.title}</Link>
        </h3>
        <p>{project.tagline}</p>
        <p className="muted">{project.problem}</p>
        <p>
          <Link viewTransition className="btn" to={`/projects/${project.slug}`}>
            Read the case study
          </Link>
        </p>
      </div>
      {stat && (
        <div className="featured__stat">
          <p className="featured__value">
            <CountUp value={stat.value} />
          </p>
          <p>{stat.label}</p>
          <p className="muted small">{stat.source}</p>
        </div>
      )}
    </article>
  );
}

export function ProjectList({ projects }: { projects: Project[] }) {
  const { ref, revealClass } = useReveal<HTMLUListElement>();
  return (
    <ul ref={ref} className={`levels stagger ${revealClass}`}>
      {projects.map((p, i) => (
        <li key={p.slug} className="level" style={{ "--i": i } as React.CSSProperties}>
          <div className="level__head">
            <h3>
              <Link viewTransition to={`/projects/${p.slug}`}>{p.title}</Link>
            </h3>
            <KindTag kind={p.kind} />
          </div>
          <p>{p.tagline}</p>
          <p className="level__meta">
            <span>{p.period}</span>
            <span>{p.stack.join(", ")}</span>
          </p>
        </li>
      ))}
    </ul>
  );
}
