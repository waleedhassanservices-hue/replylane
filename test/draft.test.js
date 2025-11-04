import test from "node:test";
import assert from "node:assert/strict";
import { createWorkspace, requestDraft } from "../src/workspace.js";

const articles = [
  {
    title: "Invoices",
    topic: "billing",
    body: "Invoices are sent on the first of the month and stay available from the billing page.",
  },
  {
    title: "Password reset",
    topic: "account",
    body: "Use Forgot password on the sign-in page. The reset link expires after one hour.",
  },
];

test("drafts a reply from the matching article", () => {
  const workspace = createWorkspace({ name: "Acme", articles });
  const result = requestDraft(workspace, "Where can I find last month's invoice?");
  assert.equal(result.ok, true);
  assert.equal(result.grounded, true);
  assert.deepEqual(result.sources, ["Invoices"]);
  assert.match(result.reply, /first of the month/);
  assert.equal(workspace.usedToday, 1);
});

test("says when no article matches", () => {
  const workspace = createWorkspace({ name: "Acme", articles });
  const result = requestDraft(workspace, "Do you ship to Mars?");
  assert.equal(result.grounded, false);
  assert.match(result.reply, /don't have a help article/);
});

test("stops when the daily allowance is used", () => {
  const workspace = createWorkspace({ name: "Acme", planId: "starter", articles });
  workspace.usedToday = 40;
  const result = requestDraft(workspace, "Where is my invoice?");
  assert.equal(result.ok, false);
  assert.match(result.error, /allowance/);
});
