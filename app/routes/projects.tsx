import { ProjectList } from "../components/ProjectList";
import { projects } from "../content/projects.ts";
import { pageMeta } from "../lib/meta.ts";

export function meta() {
  return pageMeta({
    title: "Projects: Joshua Ryle Zamayla Bracho",
    description: "Personal and professional projects in Laravel, Flutter and Python, with development timelines.",
    path: "/projects/",
  });
}

export default function Projects() {
  const personal = projects.filter((p) => p.kind === "personal");
  const professional = projects.filter((p) => p.kind === "professional");
  return (
    <div className="wrap page-pad">
      <h1>Projects</h1>
      <h2>Personal</h2>
      <ProjectList projects={personal} />
      <h2>Professional</h2>
      <p className="lede">
        Systems I work on in my job. Their code is private, so they appear under generic names and are described from
        commit history only.
      </p>
      <ProjectList projects={professional} />
    </div>
  );
}
