import { HubChapter, LootAct, QuestChapter, SaveAct, SkillsAct, TitleScreen } from "../components/Story";
import { projects } from "../content/projects.ts";
import { profile } from "../content/profile.ts";
import { pageMeta } from "../lib/meta.ts";
import { useStoryPinning } from "../lib/story.ts";

export function meta() {
  return pageMeta({
    title: `${profile.name}: developer portfolio`,
    description: `${profile.tagline}. Freelance for ${profile.freelanceYears} years. Case studies of Laravel, Flutter, Node and integration work, each backed by its commit or build history.`,
    path: "/",
  });
}

/** The home page is a story in chapters; on small screens or with animations off it reads as a normal page. */
export default function Home() {
  useStoryPinning();
  const personal = projects.filter((p) => p.kind === "personal").length;
  const company = projects.filter((p) => p.kind === "professional").length;
  return (
    <div className="story">
      <TitleScreen />
      <HubChapter />
      <QuestChapter
        id="side-quests"
        kind="side"
        numeral="II"
        title="Side quests worth the detour."
        lede={`${personal} projects I built because I wanted them to exist. Real screens on sample data: no smoke, no mirrors.`}
      />
      <QuestChapter
        id="main-quest"
        kind="main"
        numeral="III"
        title="The main quest, in production."
        lede={`${company} company systems, described from commit history. Their code and screens stay private, so they appear under generic names, as illustrations.`}
      />
      <SkillsAct />
      <LootAct />
      <SaveAct />
    </div>
  );
}
