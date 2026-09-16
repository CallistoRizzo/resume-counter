/**
 * Cloud Resume Challenge — Visitor Counter API
 * Cloudflare Worker (Step 9: API) + Workers KV (Step 8: Database)
 *
 * On each request it:
 *   1. Reads the current count from the KV store
 *   2. Increments it by 1
 *   3. Writes the new value back to KV
 *   4. Returns it as JSON: { "count": 123 }
 *
 * Requires a KV namespace bound to this Worker with the
 * variable name:  COUNTER
 */

export default {
  async fetch(request, env, ctx) {
    // --- CORS: allow your GitHub Pages site to call this Worker ---
    // Set this to the ORIGIN of your site (scheme + host, no path).
    // Use "*" temporarily if you're debugging cross-origin issues.
    const ALLOWED_ORIGIN = "https://callistorizzo.github.io";

    const corsHeaders = {
      "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // Handle the browser's CORS preflight request (if any)
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // 1. Read current count (KV stores strings; default to 0)
      let count = parseInt(await env.COUNTER.get("count"), 10) || 0;

      // 2. Increment
      count += 1;

      // 3. Persist the new value
      await env.COUNTER.put("count", count.toString());

      // 4. Return it as JSON
      return new Response(JSON.stringify({ count }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch (err) {
      return new Response(
        JSON.stringify({ error: "Counter unavailable" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  },
};
