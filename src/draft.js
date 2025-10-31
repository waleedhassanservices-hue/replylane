import { retrieve } from "./retrieve.js";

function firstSentence(body) {
  const match = String(body || "").match(/^(.+?[.!?])(?:\s|$)/);
  return (match ? match[1] : String(body || "").trim()).trim();
}

export function draftReply({ message, articles, agentName = "Support" }) {
  const question = String(message || "").trim();
  if (!question) {
    return { ok: false, error: "Add the customer message first." };
  }
  const matches = retrieve(question, articles);
  if (matches.length === 0) {
    return {
      ok: true,
      grounded: false,
      sources: [],
      reply: `Hi,\n\nThanks for writing in. I don't have a help article that covers this yet, so a teammate will follow up.\n\n${agentName}`,
    };
  }
  const lines = matches.map((row) => firstSentence(row.article.body));
  const sources = matches.map((row) => row.article.title);
  return {
    ok: true,
    grounded: true,
    sources,
    reply: `Hi,\n\n${lines.join(" ")}\n\nIf that doesn't sort it out, reply here and we'll take another look.\n\n${agentName}`,
  };
}
