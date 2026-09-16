# resume-counter


Back end for my Cloud Resume project: a
visitor counter API running on **Cloudflare Workers** with **Workers KV** as the database,
tested and deployed automatically with **GitHub Actions**.

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
| `worker.js` | The API: reads/increments/stores the count and returns JSON (with CORS). |
| `wrangler.toml` | Infrastructure-as-Code: defines the Worker and its KV binding. |
| `package.json` | Declares the test tooling (Vitest) and the `npm test` command. |
| `test/counter.test.js` | Integration tests: verify the API returns a valid, incrementing count. |
| `.github/workflows/deploy.yml` | CI/CD: runs the tests, then deploys the Worker on every push to `main`. |

## Testing

Integration tests (using [Vitest](https://vitest.dev/)) call the live API and confirm it
returns HTTP 200, a positive whole-number count, and that the count increments on each visit.

Run them locally:

```bash
npm install
npm test
```

By default the tests target the deployed Worker. To point them somewhere else, set an
environment variable:

```bash
COUNTER_API="https://your-worker-url.workers.dev" npm test
```

## CI/CD

Deployment is fully automated. Every push to `main` triggers the GitHub Actions workflow,
which:

1. **Runs the tests** (`npm test`).
2. **Deploys the Worker** with `wrangler deploy` (but only if the tests pass).

Two repository secrets are required:

- `CLOUDFLARE_API_TOKEN`: a scoped token with the *Edit Cloudflare Workers* permission.
- `CLOUDFLARE_ACCOUNT_ID`: my Cloudflare account ID.

To deploy manually from a local machine instead:

```bash
npm install -g wrangler
wrangler login
wrangler deploy
```

## Tech

- **Cloudflare Workers**: serverless API
- **Cloudflare Workers KV**: key-value database
- **Vitest**: automated tests
- **GitHub Actions**: CI/CD (test + deploy)
