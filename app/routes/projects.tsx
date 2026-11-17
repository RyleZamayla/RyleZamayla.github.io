import { ProjectTabs } from "../components/ProjectTabs";
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
  return (
    <div className="wrap page-pad">
      <h1>Projects</h1>
      <ProjectTabs projects={projects} />
    </div>
  );
}
