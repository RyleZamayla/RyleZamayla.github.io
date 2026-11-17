import { Link } from "react-router";
import { HubScene } from "../components/HubScene";
import { ProjectTabs } from "../components/ProjectTabs";
import { SkillTree } from "../components/SkillTree";
import { QuestLog } from "../components/QuestLog";
import { ContactTerminal } from "../components/ContactTerminal";
import { Band } from "../components/Reveal";
import { AboutMe } from "../components/AboutMe";
import { projects } from "../content/projects.ts";
import { profile } from "../content/profile.ts";
import { pageMeta } from "../lib/meta.ts";

export function meta() {
  return pageMeta({
    title: `${profile.name}: developer portfolio`,
    description: `${profile.tagline}. Freelance for 5+ years. Case studies of Laravel, Flutter, Node and integration work, each backed by its commit or build history.`,
    path: "/",
  });
}

export default function Home() {
  const count = (kind: string) => projects.filter((p) => p.kind === kind).length;
  return (
    <>
      <section className="hero wrap" aria-labelledby="hero-heading">
        <div className="hero__text">
          <h1 id="hero-heading">{profile.name}</h1>
          <p className="hero__tagline">{profile.tagline}</p>
          <p className="hero__intro">{profile.intro}</p>
          <ul className="glance" aria-label="At a glance">
            <li>
              <b>{projects.length}</b> projects
            </li>
            <li>
              <b>{count("professional")}</b> systems at work
            </li>
            <li>
              <b>{profile.freelanceYears} years</b> freelancing
            </li>
            <li>
              <b>Days → hours</b> on my own timesheets
            </li>
          </ul>
          <p className="hero__actions">
            <Link viewTransition className="btn" to="/projects">
              View projects
            </Link>
            <Link viewTransition className="btn btn--quiet" to="/#contact">
              Contact me
            </Link>
            <a className="btn btn--quiet" href={profile.resume.href} download>
              Resume
            </a>
          </p>
        </div>
        <HubScene />
      </section>

      <Band id="about" alt labelledBy="about-heading">
        <h2 id="about-heading">About me</h2>
        <AboutMe />
      </Band>

      <Band id="projects" labelledBy="projects-heading">
          <h2 id="projects-heading">Projects</h2>
          <p className="lede">
            {count("personal")} personal projects and {count("professional")} company systems. Company projects use generic names;
            their code is private.
          </p>
          <ProjectTabs projects={projects} featureFirst />
      </Band>

      <Band id="skills" alt labelledBy="skills-heading">
          <h2 id="skills-heading">Skill tree</h2>
          <p className="lede">Pick a skill to see the work behind it.</p>
          <SkillTree />
      </Band>

      <Band id="quests" labelledBy="quests-heading">
          <h2 id="quests-heading">Quest log</h2>
          <p className="lede">Highlights, each with its source.</p>
          <QuestLog />
      </Band>

      <Band id="contact" alt labelledBy="contact-heading">
          <h2 id="contact-heading">Contact</h2>
          <ContactTerminal />
      </Band>
    </>
  );
}
