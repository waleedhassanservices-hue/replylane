import test from "node:test";
import assert from "node:assert/strict";
import { draftsRemaining, planById, withinSeatLimit } from "../src/plans.js";

test("starter allows two seats and forty drafts", () => {
  const plan = planById("starter");
  assert.equal(plan.seats, 2);
  assert.equal(plan.dailyDrafts, 40);
  assert.equal(withinSeatLimit("starter", 2), true);
  assert.equal(withinSeatLimit("starter", 3), false);
});

test("unknown plans fall back to starter", () => {
  assert.equal(planById("missing").id, "starter");
});

test("remaining drafts never go below zero", () => {
  assert.equal(draftsRemaining("team", 10), 290);
  assert.equal(draftsRemaining("starter", 80), 0);
});
