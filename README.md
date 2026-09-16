# resume-counter

Back end for my Cloud Resume project — a
visitor counter API running on **Cloudflare Workers** with **Workers KV** as the database.

The front-end resume lives in a separate repo and is hosted on GitHub Pages:
<https://callistorizzo.github.io/Resume/>

## How it works

1. The resume page runs a small piece of JavaScript that calls this Worker.
2. The Worker reads the current visit count from a KV namespace, adds 1, saves it back,
   and returns the number as JSON: `{ "count": 123 }`.
3. The page displays that number in the footer.

## Project structure

| File | Purpose |
|------|---------|
| `worker.js` | The API — reads/increments/stores the count and returns JSON (with CORS). |
| `wrangler.toml` | Infrastructure-as-Code — defines the Worker and its KV binding. |
| `.github/workflows/deploy.yml` | CI/CD — GitHub Actions redeploys the Worker on every push to `main`. |

## Deploying

Deployment is automatic: any push to `main` triggers the GitHub Actions workflow, which
runs `wrangler deploy`. Two repository secrets are required:

- `CLOUDFLARE_API_TOKEN` — a scoped token with the *Edit Cloudflare Workers* permission.
- `CLOUDFLARE_ACCOUNT_ID` — my Cloudflare account ID.

To deploy manually from a local machine instead:

```bash
npm install -g wrangler
wrangler login
wrangler deploy
```

## Tech

- Cloudflare Workers (serverless API)
- Cloudflare Workers KV (key-value database)
- GitHub Actions (CI/CD)
