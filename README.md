# Replylane

Replylane is a small AI SaaS for support teams. A workspace stores help articles, a customer message comes in, and Replylane drafts a reply from the articles that actually match. Nothing is sent to an outside model in this repository: the draft engine retrieves passages and writes the reply locally, so it can be tested and run without an API key.

## Run

```bash
npm test
npm start
```

Open http://localhost:8787

## Plans

| Plan | Seats | Drafts per day |
| --- | --- | --- |
| Starter | 2 | 40 |
| Team | 10 | 300 |

A draft counts against the workspace's daily allowance. The sample workspace under Settings on the page loads the bundled help articles so you can try a message immediately.
