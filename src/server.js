import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { sampleArticles } from "./sample-articles.js";
import { createWorkspace, requestDraft } from "./workspace.js";
import { planById } from "./plans.js";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "public");
const workspace = createWorkspace({
  name: "Northwind Support",
  planId: "team",
  seats: 4,
  articles: sampleArticles,
});

const files = {
  "/": "index.html",
  "/app.css": "app.css",
};

function send(response, status, body, type) {
  response.writeHead(status, { "content-type": type });
  response.end(body);
}

async function readBody(request) {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  if (chunks.length === 0) return {};
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

export function createApp() {
  return createServer(async (request, response) => {
    const url = new URL(request.url || "/", "http://127.0.0.1");
    if (request.method === "GET" && url.pathname === "/api/workspace") {
      const plan = planById(workspace.planId);
      send(response, 200, JSON.stringify({
        name: workspace.name,
        plan: plan.label,
        seats: workspace.seats,
        articleCount: workspace.articles.length,
        dailyDrafts: plan.dailyDrafts,
        usedToday: workspace.usedToday,
      }), "application/json");
      return;
    }
    if (request.method === "POST" && url.pathname === "/api/drafts") {
      const body = await readBody(request);
      const result = requestDraft(workspace, body.message, body.agentName || "Replylane");
      send(response, result.ok ? 200 : 400, JSON.stringify(result), "application/json");
      return;
    }
    const file = files[url.pathname];
    if (request.method === "GET" && file) {
      const html = await readFile(path.join(root, file), "utf8");
      send(response, 200, html, file.endsWith(".css") ? "text/css" : "text/html; charset=utf-8");
      return;
    }
    send(response, 404, "Not found", "text/plain");
  });
}

const isDirect = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
if (isDirect) {
  const port = Number(process.env.PORT || 8787);
  createApp().listen(port, () => {
    console.log(`Replylane listening on http://localhost:${port}`);
  });
}
