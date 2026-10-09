import { Link } from "react-router";
import { HubScene } from "../components/HubScene";
import { FeaturedProject, ProjectList } from "../components/ProjectList";
import { SkillTree } from "../components/SkillTree";
import { QuestLog } from "../components/QuestLog";
import { ContactTerminal } from "../components/ContactTerminal";
import { Band, Reveal } from "../components/Reveal";
import { projects } from "../content/projects.ts";
import { profile } from "../content/profile.ts";
import { pageMeta } from "../lib/meta.ts";

export function meta() {
  return pageMeta({
    title: `${profile.name}: developer portfolio`,
    description: `${profile.tagline}. Case studies of Laravel, Flutter and integration work, each backed by its commit history.`,
    path: "/",
  });
}

export default function Home() {
  const [featured, ...rest] = projects;
  return (
    <>
      <section className="hero wrap" aria-labelledby="hero-heading">
        <div className="hero__text">
          <h1 id="hero-heading">{profile.name}</h1>
          <p className="hero__tagline">{profile.tagline}</p>
          <p className="hero__intro">{profile.intro}</p>
          <p className="hero__actions">
            <Link viewTransition className="btn" to="/projects">
              View projects
            </Link>
            <Link viewTransition className="btn btn--quiet" to="/#contact">
              Contact me
            </Link>
          </p>
        </div>
        <HubScene />
      </section>

      <Band id="projects" labelledBy="projects-heading">
          <h2 id="projects-heading">Projects</h2>
          <p className="lede">
            Two personal projects and five systems I work on professionally. The professional ones use generic names
            because their code is private.
          </p>
          {featured && (
            <Reveal>
              <FeaturedProject project={featured} />
            </Reveal>
          )}
          <ProjectList projects={rest} />
      </Band>

      <Band id="skills" alt labelledBy="skills-heading">
          <h2 id="skills-heading">Skill tree</h2>
          <p className="lede">Choose a skill to see the work that shows it. Every entry links to a dated milestone.</p>
          <SkillTree />
      </Band>

      <Band id="quests" labelledBy="quests-heading">
          <h2 id="quests-heading">Quest log</h2>
          <p className="lede">Completed, with where each claim comes from.</p>
          <QuestLog />
      </Band>

      <Band id="contact" alt labelledBy="contact-heading">
          <h2 id="contact-heading">Contact</h2>
          <ContactTerminal />
      </Band>
    </>
  );
}
