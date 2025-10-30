const stop = new Set(["the", "a", "an", "and", "or", "to", "for", "of", "in", "on", "is", "it", "my", "i", "we", "you", "our"]);

export function tokens(text) {
  return String(text || "")
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((word) => word.length > 2 && !stop.has(word));
}

export function scoreArticle(message, article) {
  const wanted = new Set(tokens(message));
  if (wanted.size === 0) return 0;
  const haystack = tokens(`${article.title} ${article.body}`);
  let hits = 0;
  for (const word of haystack) {
    if (wanted.has(word)) hits += 1;
  }
  return hits / wanted.size;
}

export function retrieve(message, articles, limit = 2) {
  return articles
    .map((article) => ({ article, score: scoreArticle(message, article) }))
    .filter((row) => row.score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, limit);
}
