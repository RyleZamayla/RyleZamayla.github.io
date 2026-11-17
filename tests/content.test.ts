import { test } from "node:test";
import assert from "node:assert/strict";
import { projects, allMilestones } from "../app/content/projects.ts";
import { skills, skillGroups, secretSkills, MAX_LEVEL } from "../app/content/skills.ts";
import { achievements } from "../app/content/achievements.ts";
import { profile } from "../app/content/profile.ts";
import { existsSync } from "node:fs";
import { snapshots, thumbs } from "../app/content/snapshots.ts";
import { chapters } from "../app/lib/story.ts";
import { H, W, graphBranches, graphEdges, graphNodes, shortestPath } from "../app/lib/skillGraph.ts";
import { RARITY_XP, loot, rarityOf } from "../app/lib/loot.ts";

const milestoneIds = new Set<string>();
for (const { milestone } of allMilestones()) milestoneIds.add(milestone.id);

test("milestone ids are unique", () => {
  assert.equal(milestoneIds.size, allMilestones().length);
});

test("every skill is backed by at least one real milestone", () => {
  for (const skill of skills) {
    assert.ok(skill.evidence.length > 0, `${skill.id} has no evidence`);
    for (const id of skill.evidence) assert.ok(milestoneIds.has(id), `${skill.id} points at missing milestone ${id}`);
    assert.ok(skillGroups.includes(skill.group), `${skill.id} has unknown group`);
  }
});

test("achievement evidence points at real milestones", () => {
  for (const a of achievements) for (const id of a.evidence) assert.ok(milestoneIds.has(id), `${a.id} -> ${id}`);
});

test("project slugs are unique and URL-safe", () => {
  const slugs = projects.map((p) => p.slug);
  assert.equal(new Set(slugs).size, slugs.length);
  for (const s of slugs) assert.match(s, /^[a-z0-9-]+$/);
});

test("commit references look like commit hashes and dates are real", () => {
  for (const { project, milestone } of allMilestones()) {
    if (milestone.refKind === "commit") assert.match(milestone.ref ?? "", /^[0-9a-f]{7,8}$/, `${project.slug}/${milestone.id}`);
    assert.match(milestone.date, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(!Number.isNaN(Date.parse(milestone.date)), milestone.date);
    assert.ok(milestone.date >= "2023-01-01" && milestone.date <= "2026-11-30", `${milestone.id} date out of audited range`);
  }
});

test("headline figures are in plain language, never commit counts", () => {
  // Recruiters don't read "commits"; stats, proof lines and quests must say what was achieved instead.
  for (const p of projects) {
    for (const s of p.stats) assert.doesNotMatch(`${s.value} ${s.label}`, /commit/i, `${p.slug} stat "${s.label}"`);
    assert.doesNotMatch(p.outcome, /commit/i, `${p.slug} outcome`);
  }
  for (const a of achievements) assert.doesNotMatch(`${a.title} ${a.detail}`, /commit/i, `quest ${a.id}`);
});

test("no private names leak into public content", () => {
  // Internal repository, product and client names that must never be published.
  const banned = /taskusgirls|flixio|floorline|procuremate|engagis|luxottica|whistleblow|support-engagis/i;
  const text = JSON.stringify({ projects, skills, achievements, profile, snapshots, thumbs });
  const hit = text.match(banned);
  assert.equal(hit, null, `found "${hit?.[0]}" in content`);
});

test("the email address is never stored as one string", () => {
  assert.equal(JSON.stringify(profile).includes("@"), false);
});

test("every project has illustrated snapshots, and none are orphaned", () => {
  const slugs = new Set(projects.map((p) => p.slug));
  for (const p of projects) assert.ok((snapshots[p.slug] ?? []).length > 0, `${p.slug} has no snapshots`);
  for (const key of Object.keys(snapshots)) assert.ok(slugs.has(key), `snapshots for unknown project ${key}`);
  const ids = Object.values(snapshots).flat().map((s) => s.id);
  assert.equal(new Set(ids).size, ids.length, "snapshot ids must be unique");
});

test("every project has a product tile whose devices exist", () => {
  for (const p of projects) {
    const t = thumbs[p.slug];
    assert.ok(t, `${p.slug} has no product tile`);
    const ids = new Set((snapshots[p.slug] ?? []).map((s) => s.id));
    assert.ok(ids.has(t.main), `${p.slug} tile main ${t.main} missing`);
    if (t.second) assert.ok(ids.has(t.second), `${p.slug} tile second ${t.second} missing`);
    if (t.layout !== "window") assert.ok(t.second, `${p.slug} layout ${t.layout} needs a second device`);
    assert.match(t.accent, /^#[0-9a-f]{6}$/i);
    assert.match(t.accent2, /^#[0-9a-f]{6}$/i);
  }
  for (const key of Object.keys(thumbs)) assert.ok(projects.some((p) => p.slug === key), `tile for unknown project ${key}`);
});

test("the resume is published and linked from the profile", () => {
  assert.match(profile.resume.href, /^\/[\w.-]+\.pdf$/);
  assert.ok(existsSync(`public${profile.resume.href}`), "resume PDF missing from public/");
});

test("the portrait is published and has alt text", () => {
  assert.ok(existsSync(`public${profile.avatar.src}`), "portrait missing from public/");
  assert.ok(profile.avatar.alt.length > 10);
});

test("every screenshot a snapshot or tile points at exists", () => {
  for (const shots of Object.values(snapshots))
    for (const s of shots) if (s.image) assert.ok(existsSync(`public${s.image.src}`), `${s.id}: ${s.image.src} missing`);
});

test("story chapters have unique ids and the header nav points at real places", () => {
  const ids = chapters.map((c) => c.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const c of chapters) if (c.nav) assert.match(c.nav, /^\/(#[a-z-]+)?[a-z/]*$/, `${c.id} nav`);
});

test("every milestone in the case studies backs at least one skill", () => {
  // Keeps the skill tree honest: new work can't be added without the tree noticing.
  const used = new Set(skills.flatMap((s) => s.evidence));
  const orphans = [...milestoneIds].filter((id) => !used.has(id));
  assert.deepEqual(orphans, [], `milestones that back no skill: ${orphans.join(", ")}`);
});

test("skill connections point at real skills, and the whole web is connected", () => {
  const ids = new Set([...skills.map((s) => s.id), ...secretSkills.map((s) => s.id)]);
  for (const s of [...skills, ...secretSkills]) {
    for (const other of s.links) {
      assert.ok(ids.has(other), `${s.id} links to unknown skill ${other}`);
      assert.notEqual(other, s.id, `${s.id} links to itself`);
    }
  }
  assert.ok(graphEdges.length >= skills.length, "the web should have at least one connection per skill");
  for (const n of graphNodes) assert.ok(shortestPath("laravel", n.id), `${n.id} isn't reachable from the rest of the web`);
  assert.ok(MAX_LEVEL >= 4);
});

test("skill web labels never overlap and stay on the canvas", () => {
  const boxes = [...graphNodes.map((n) => ({ id: n.id, x: n.x, y: n.y, w: n.w, h: n.h })), ...graphBranches.map((b) => ({ id: `branch:${b.name}`, x: b.x, y: b.y, w: b.w, h: b.h }))];
  for (const b of boxes) {
    assert.ok(b.x - b.w / 2 >= 0 && b.x + b.w / 2 <= W && b.y - b.h / 2 >= 0 && b.y + b.h / 2 <= H, `${b.id} is off the canvas`);
  }
  for (let i = 0; i < boxes.length; i++)
    for (let j = i + 1; j < boxes.length; j++) {
      const a = boxes[i]!;
      const b = boxes[j]!;
      const overlap = (a.w + b.w) / 2 - Math.abs(a.x - b.x) > 1 && (a.h + b.h) / 2 - Math.abs(a.y - b.y) > 1;
      assert.ok(!overlap, `${a.id} overlaps ${b.id}`);
    }
});

test("loot rarity comes from evidence, and every quest has what it needs", () => {
  assert.equal(loot.length, achievements.length);
  for (const l of loot) {
    assert.equal(l.rarity, rarityOf(l.achievement));
    assert.equal(l.xp, RARITY_XP[l.rarity]);
    assert.equal(l.proof.length, l.achievement.evidence.length, `${l.achievement.id} lost some proof`);
    if (l.rarity === "legendary") assert.ok(l.achievement.evidence.length >= 4);
    if (l.rarity === "common") assert.equal(l.achievement.evidence.length, 0);
  }
  const ids = achievements.map((a) => a.id);
  assert.equal(new Set(ids).size, ids.length, "achievement ids must be unique");
});
