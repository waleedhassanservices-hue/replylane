import { draftsRemaining, planById, withinSeatLimit } from "./plans.js";
import { draftReply } from "./draft.js";

export function createWorkspace({ name, planId = "starter", seats = 1, articles = [] }) {
  if (!withinSeatLimit(planId, seats)) {
    throw new Error(`${planById(planId).label} allows ${planById(planId).seats} seats.`);
  }
  return {
    name,
    planId,
    seats,
    articles: articles.slice(),
    usedToday: 0,
  };
}

export function addArticle(workspace, article) {
  if (!article.title || !article.body) {
    throw new Error("An article needs a title and a body.");
  }
  workspace.articles.push({ title: article.title.trim(), body: article.body.trim(), topic: article.topic || "general" });
  return workspace.articles.at(-1);
}

export function requestDraft(workspace, message, agentName) {
  const remaining = draftsRemaining(workspace.planId, workspace.usedToday);
  if (remaining === 0) {
    return { ok: false, error: "Daily draft allowance is used up. It resets tomorrow." };
  }
  const draft = draftReply({ message, articles: workspace.articles, agentName });
  if (!draft.ok) return draft;
  workspace.usedToday += 1;
  return { ...draft, remaining: remaining - 1 };
}
