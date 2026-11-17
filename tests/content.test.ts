import { test } from "node:test";
import assert from "node:assert/strict";
import { projects, allMilestones } from "../app/content/projects.ts";
import { skills, skillGroups } from "../app/content/skills.ts";
import { achievements } from "../app/content/achievements.ts";
import { profile } from "../app/content/profile.ts";
import { existsSync } from "node:fs";
import { snapshots } from "../app/content/snapshots.ts";

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
  const text = JSON.stringify({ projects, skills, achievements, profile, snapshots });
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

test("every screenshot a snapshot or tile points at exists", () => {
  for (const shots of Object.values(snapshots))
    for (const s of shots) if (s.image) assert.ok(existsSync(`public${s.image.src}`), `${s.id}: ${s.image.src} missing`);
});
