import { test } from "node:test";
import assert from "node:assert/strict";
import { projects, allMilestones } from "../app/content/projects.ts";
import { skills, skillGroups } from "../app/content/skills.ts";
import { achievements } from "../app/content/achievements.ts";
import { profile } from "../app/content/profile.ts";

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
    assert.ok(milestone.date >= "2025-10-01" && milestone.date <= "2026-10-31", `${milestone.id} date out of audited range`);
  }
});

test("per-project commit counts add up to the 2,455 in the quest log", () => {
  const total = projects
    .flatMap((p) => p.stats.filter((s) => s.label === "commits"))
    .reduce((sum, s) => sum + Number(s.value.replace(/,/g, "")), 0);
  assert.equal(total, 2455);
});

test("no private names leak into public content", () => {
  // Internal repository, product and client names that must never be published.
  const banned = /taskusgirls|flixio|floorline|procuremate|engagis|luxottica|whistleblow|support-engagis/i;
  const text = JSON.stringify({ projects, skills, achievements, profile });
  const hit = text.match(banned);
  assert.equal(hit, null, `found "${hit?.[0]}" in content`);
});

test("the email address is never stored as one string", () => {
  assert.equal(JSON.stringify(profile).includes("@"), false);
});
