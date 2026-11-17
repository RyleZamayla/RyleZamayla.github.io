import type { CSSProperties, ReactNode } from "react";
import { Link } from "react-router";
import { profile } from "../content/profile.ts";
import { projects } from "../content/projects.ts";
import { useChapter } from "../lib/story.ts";
import type { Project } from "../content/types.ts";
import { PlayerCard } from "./AboutMe";
import { ContactTerminal } from "./ContactTerminal";
import { HubScene } from "./HubScene";
import { Loadout } from "./Loadout";
import { PixelArt, chestClosedRows, chestOpenRows, chestPalette, fireRows, firePalette } from "./PixelArt";
import { ProductThumb } from "./ProductThumb";
import { QuestLog } from "./QuestLog";
import { Reveal } from "./Reveal";
import { SkillTree } from "./SkillTree";
import { TitleScene } from "./TitleScene";
import { useReveal } from "../hooks/useReveal.ts";

const vars = (o: Record<string, string | number>) => o as CSSProperties;

/** A chapter that pins to the screen on big displays and reads as a normal section everywhere else. */
function PinnedChapter({
  id,
  steps,
  className = "",
  labelledBy,
  children,
}: {
  id: string;
  steps: number;
  className?: string;
  labelledBy: string;
  children: ReactNode;
}) {
  const ref = useChapter<HTMLElement>(steps);
  return (
    <section ref={ref} id={id} className={`chapter ${className}`} style={vars({ "--steps": steps })} aria-labelledby={labelledBy}>
      <div className="chapter__stage">{children}</div>
    </section>
  );
}

/* ---------------- Title screen ---------------- */
export function TitleScreen() {
  const first = profile.name.split(" ")[0];
  const company = projects.filter((p) => p.kind === "professional").length;
  return (
    <PinnedChapter id="start" steps={1} className="chapter--title" labelledBy="hero-heading">
      <div className="title">
        <TitleScene />
        <div className="title__fade" aria-hidden="true" />
        <div className="title__copy">
          <p className="title__kicker">
            Player 0 <span aria-hidden="true">·</span> {profile.location}
          </p>
          <h1 id="hero-heading" className="title__h1">
            <span className="sr-only">{profile.name}</span>
            <span className="title__name" aria-hidden="true">
              <span>Ryle</span>
              <span>Zamayla</span>
            </span>
          </h1>
          <p className="title__tag">Web. Mobile. Wired together.</p>
          <p className="title__roles">{profile.tagline}</p>
          <ul className="title__stats" aria-label="At a glance">
            <li className="hstat hstat--mint">
              <b>{profile.freelanceYears}</b>
              <span>years freelancing</span>
            </li>
            <li className="hstat hstat--ember">
              <b>{projects.length}</b>
              <span>projects</span>
            </li>
            <li className="hstat hstat--violet">
              <b>{company}</b>
              <span>company systems</span>
            </li>
          </ul>
          <p className="title__actions">
            <a className="hero-btn hero-btn--primary" href="#about">
              <span className="hero-btn__play" aria-hidden="true" />
              Press start
            </a>
            <a className="hero-btn hero-btn--ghost" href={profile.resume.href} download>
              <span className="hero-btn__doc" aria-hidden="true" />
              Resume
            </a>
          </p>
          <span className="sr-only">Hi, I&rsquo;m {first}. Scroll down to read the story.</span>
        </div>
        <p className="title__hint" aria-hidden="true">
          Scroll <span />
        </p>
      </div>
    </PinnedChapter>
  );
}

/* ---------------- Chapter I: the hub ---------------- */
function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="eyebrow">{children}</p>;
}

export function HubChapter() {
  return (
    <PinnedChapter id="about" steps={3} className="chapter--hub" labelledBy="about-heading">
      <ol className="slides">
        <li className="slide" data-step-i={0}>
          <div className="slide__text">
            <Eyebrow>Chapter I · The hub</Eyebrow>
            <h2 id="about-heading" className="big">
              Lazy by design.
            </h2>
            <p className="lede">
              Every tool I build is one less chore in my day. That&rsquo;s how a month of timesheets became an
              afternoon.
            </p>
          </div>
          <div className="slide__visual">
            <PlayerCard />
          </div>
        </li>

        <li className="slide" data-step-i={1}>
          <div className="slide__text">
            <Eyebrow>Proof of work</Eyebrow>
            <h3 className="big big--sm">Two builds I&rsquo;d stake my name on.</h3>
            <p>
              <Link to="/projects/sweltrack">SwelTrack</Link> is the most intricate system I&rsquo;ve built, where one
              payroll bug could cost real money. The other is the{" "}
              <Link to="/projects/field-operations-platform">operations platform</Link> I work on at my job, now used
              across the company&rsquo;s operations and making routine work run noticeably smoother.
            </p>
            <p>
              {profile.freelanceYears} years of freelancing taught me to build what I wish existed.{" "}
              <Link to="/projects/wais">WAIS</Link> keeps my money on my own phone, and{" "}
              <Link to="/projects/isbogi">ISBOGI</Link> is a live van-arrival pilot I built to test with real
              commuters.
            </p>
          </div>
          <div className="slide__visual">
            <HubScene />
          </div>
        </li>

        <li className="slide" data-step-i={2}>
          <div className="slide__text">
            <Eyebrow>Off the clock</Eyebrow>
            <h3 className="big big--sm">Pull requests out, pistons in.</h3>
            <p>
              Off duty I&rsquo;m tearing down motorcycles, building engines and tuning PCs until they purr. The rest of the
              time it&rsquo;s racquets and paddles: badminton and pickleball competitively, plus table tennis, and chess
              for the long game.
            </p>
          </div>
          <div className="slide__visual">
            <Loadout />
          </div>
        </li>
      </ol>
      <ol className="pips pips--side" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <li key={i} data-pip-i={i} />
        ))}
      </ol>
    </PinnedChapter>
  );
}

/* ---------------- Chapters II and III: the quests ---------------- */
function QuestStep({ project, index, kind }: { project: Project; index: number; kind: "side" | "main" }) {
  const to = `/projects/${project.slug}`;
  return (
    <li className="quest-step" data-step-i={index}>
      <div className="quest-step__text">
        <p className="eyebrow">
          <span className={`chip chip--${kind}`}>
            {kind === "side" ? "Side quest" : "Main quest"} {String(index + 1).padStart(2, "0")}
          </span>
          <span className="quest-step__when">{project.period}</span>
        </p>
        <h3 className="quest-step__title">
          <Link viewTransition to={to}>
            {project.title}
          </Link>
        </h3>
        <p className="quest-step__tag">{project.tagline}</p>
        <p className="quest-step__problem">{project.problem}</p>
        <p className="quest-step__proof">
          <span>Result</span> {project.outcome}
        </p>
        <ul className="stack" aria-label="Built with">
          {project.stack.slice(0, 4).map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
        <Link viewTransition className="btn" to={to}>
          Read the case study
        </Link>
      </div>
      <div className="quest-step__visual">
        <ProductThumb project={project} />
      </div>
    </li>
  );
}

export function QuestChapter({
  id,
  kind,
  numeral,
  title,
  lede,
}: {
  id: string;
  kind: "side" | "main";
  numeral: string;
  title: string;
  lede: string;
}) {
  const list = projects.filter((p) => p.kind === (kind === "side" ? "personal" : "professional"));
  const headingId = `${id}-heading`;
  return (
    <PinnedChapter id={id} steps={list.length} className={`chapter--quests chapter--${kind}`} labelledBy={headingId}>
      <div className="quests-hud">
        <div>
          <Eyebrow>
            Chapter {numeral} · {kind === "side" ? "Side quests" : "The main quest"}
          </Eyebrow>
          <h2 id={headingId} className="big big--sm">
            {title}
          </h2>
          <p className="lede">{lede}</p>
        </div>
        <div className="quests-hud__meter" aria-hidden="true">
          <p className="counter">
            Quest{" "}
            <span className="counter__n">
              {list.map((_, i) => (
                <b key={i} data-pip-i={i}>
                  {String(i + 1).padStart(2, "0")}
                </b>
              ))}
            </span>
            <span className="counter__of"> / {String(list.length).padStart(2, "0")}</span>
          </p>
          <ol className="pips">
            {list.map((_, i) => (
              <li key={i} data-pip-i={i} />
            ))}
          </ol>
        </div>
      </div>
      <ol className="quest-steps">
        {list.map((p, i) => (
          <QuestStep key={p.slug} project={p} index={i} kind={kind} />
        ))}
      </ol>
      <p className="quests-more">
        <Link to="/projects" viewTransition>
          See every project
        </Link>
      </p>
    </PinnedChapter>
  );
}

/* ---------------- Acts without pinning ---------------- */
function Act({ id, className = "", labelledBy, children }: { id: string; className?: string; labelledBy: string; children: ReactNode }) {
  const { ref, revealClass } = useReveal<HTMLElement>();
  return (
    <section ref={ref} id={id} className={`act ${className} ${revealClass}`} aria-labelledby={labelledBy}>
      <div className="wrap">{children}</div>
    </section>
  );
}

export function SkillsAct() {
  return (
    <Act id="skills" className="act--skills" labelledBy="skills-heading">
      <Eyebrow>Chapter IV · Skill tree</Eyebrow>
      <h2 id="skills-heading" className="big">
        Skills, with receipts.
      </h2>
      <p className="lede">No self-rated stars here: one level is one verified milestone from the case studies.</p>
      <SkillTree />
    </Act>
  );
}

export function LootAct() {
  const { ref, revealClass } = useReveal<HTMLDivElement>(0.4);
  return (
    <Act id="quests" className="act--loot" labelledBy="quests-heading">
      <div ref={ref} className={`act__head ${revealClass}`}>
        <div>
          <Eyebrow>Chapter V · Loot</Eyebrow>
          <h2 id="quests-heading" className="big">
            Loot from the grind.
          </h2>
          <p className="lede">The highlights, each with its source.</p>
        </div>
        <div className="chest" aria-hidden="true">
          <PixelArt className="chest__closed" rows={chestClosedRows} palette={chestPalette} />
          <PixelArt className="chest__open" rows={chestOpenRows} palette={chestPalette} />
        </div>
      </div>
      <QuestLog />
    </Act>
  );
}

export function SaveAct() {
  return (
    <Act id="contact" className="act--save" labelledBy="contact-heading">
      <div className="act__head">
        <div>
          <Eyebrow>Epilogue · Checkpoint</Eyebrow>
          <h2 id="contact-heading" className="big">
            Checkpoint reached. Ready for the next run?
          </h2>
          <p className="lede">
            If something here looks like what you need built, let&rsquo;s talk. The one-page resume is the short
            version.
          </p>
          <p className="act__actions">
            <a className="hero-btn hero-btn--primary" href={profile.resume.href} download>
              <span className="hero-btn__doc" aria-hidden="true" />
              Download my resume
            </a>
            <Link className="hero-btn hero-btn--ghost" viewTransition to="/projects">
              Browse all projects
            </Link>
          </p>
        </div>
        <div className="fire" aria-hidden="true">
          <PixelArt className="fire__a" rows={fireRows[0]} palette={firePalette} />
          <PixelArt className="fire__b" rows={fireRows[1]} palette={firePalette} />
        </div>
      </div>
      <Reveal>
        <ContactTerminal />
      </Reveal>
    </Act>
  );
}
