// test/counter.test.js
// Cloud Resume Challenge — automated tests for the visitor counter API.
// These are integration tests: they call the live Cloudflare Worker and
// verify it behaves correctly (returns a valid, incrementing count).

import { describe, it, expect } from "vitest";

// The deployed Worker endpoint. CI can override this with a COUNTER_API env var.
const COUNTER_API =
  process.env.COUNTER_API || "https://resume-counter.callisto-e7f.workers.dev";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function hitCounter() {
  const response = await fetch(COUNTER_API);
  const body = await response.json();
  return { status: response.status, body };
}

describe("visitor counter API", () => {
  it("responds with HTTP 200", async () => {
    const { status } = await hitCounter();
    expect(status).toBe(200);
  });

  it("returns a positive whole number as JSON", async () => {
    const { body } = await hitCounter();
    expect(typeof body.count).toBe("number");
    expect(Number.isInteger(body.count)).toBe(true);
    expect(body.count).toBeGreaterThan(0);
  });

  it("increments the count on each visit", async () => {
    const first = await hitCounter();
    await sleep(1000); // give the KV write a moment to propagate
    const second = await hitCounter();
    expect(second.body.count).toBeGreaterThanOrEqual(first.body.count + 1);
  });
});
