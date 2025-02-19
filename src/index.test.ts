// https://github.com/honojs/examples/tree/main/blog
// https://developers.cloudflare.com/workers/testing/
// https://developers.cloudflare.com/workers/testing/vitest-integration/get-started/write-your-first-test/

import app from "./index";
// import { env } from "cloudflare:test";
import { describe, expect, it } from "vitest";

describe("Test API", () => {
  it("Get /", async () => {
    const resp = await app.request("/");
    expect(resp.status).toBe(200);
  });

  it("GET /api", async () => {
    const resp = await app.request("/api", {});
    expect(resp.status).toBe(200);
    expect(await resp.json()).toEqual({
      ok: true,
      message: "json API!",
    });
  });

  it("GET /api/ping", async () => {
    const resp = await app.request("/api/ping");
    expect(resp.status).toBe(200);
    expect(await resp.json()).toEqual({ ok: true, message: "Pong replied!" });
  });
});
