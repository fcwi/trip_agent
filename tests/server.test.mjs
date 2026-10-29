import { test } from "node:test";
import assert from "node:assert/strict";
import { scryptSync } from "node:crypto";
import { Readable } from "node:stream";
import { createApp } from "../server/app.mjs";

test("authentication, cookie, fixed upstream, redaction, logout and throttling", async () => {
  const password = "test-password-only";
  const env = {
    APP_ORIGIN: "http://localhost:5173",
    APP_PASSWORD_HASH: `test:${scryptSync(password, "test", 64).toString("hex")}`,
    GEMINI_API_KEY: "private-gemini-value",
    GAS_URL: "https://script.google.com/macros/s/test/exec",
    GAS_TOKEN: "private-gas-token",
  };
  const calls = [];
  let rejectGrounding = false;
  let gasErrorCode = "";
  let testTime = Date.now();
  const app = createApp(
    env,
    async (url, options) => {
      calls.push({ url, ...options });
      if (gasErrorCode)
        return new Response(
          JSON.stringify({
            status: "error",
            code: gasErrorCode,
            message: env.GAS_TOKEN,
          }),
        );
      if (rejectGrounding)
        return new Response(JSON.stringify({ error: env.GEMINI_API_KEY }), {
          status: 403,
        });
      return new Response(
        JSON.stringify({ status: "success", data: [], echo: env.GAS_TOKEN }),
      );
    },
    () => testTime,
  );
  const request = (path, options = {}) =>
    new Promise((resolve) => {
      const req = Readable.from(
        options.body ? [Buffer.from(options.body)] : [],
      );
      Object.assign(req, {
        url: path,
        method: options.method || "GET",
        headers: Object.fromEntries(
          Object.entries(options.headers || {}).map(([key, value]) => [
            key.toLowerCase(),
            value,
          ]),
        ),
        socket: { remoteAddress: "127.0.0.1" },
      });
      const headers = new Headers();
      const res = {
        headersSent: false,
        setHeader(key, value) {
          headers.set(key, value);
        },
        writeHead(status, values) {
          this.status = status;
          this.headersSent = true;
          for (const [key, value] of Object.entries(values))
            headers.set(key, value);
        },
        end(body) {
          resolve(new Response(body, { status: this.status, headers }));
        },
      };
      app.emit("request", req, res);
    });
  const post = (path, body, cookie, origin = env.APP_ORIGIN) =>
    request(path, {
      method: "POST",
      headers: {
        Origin: origin,
        "Content-Type": "application/json",
        ...(cookie ? { Cookie: cookie.split(";")[0] } : {}),
      },
      body: JSON.stringify(body),
    });
  try {
    assert.equal((await request("/api/session")).status, 401);
    assert.equal((await post("/api/gas", { action: "getAll" })).status, 401);
    assert.equal(
      (await post("/api/login", { password }, null, "https://evil.example"))
        .status,
      403,
    );
    assert.equal((await post("/api/login", { password: "wrong" })).status, 401);
    const login = await post("/api/login", { password, remember: true });
    assert.equal(login.status, 200);
    const cookie = login.headers.get("set-cookie");
    assert.match(cookie, /HttpOnly/);
    assert.match(cookie, /SameSite=Strict/);
    assert.match(cookie, /Max-Age=604800/);
    const config = await login.text();
    assert.ok(!config.includes(env.GEMINI_API_KEY));
    assert.ok(!config.includes(env.GAS_TOKEN));
    assert.ok(!config.includes(env.GAS_URL));
    assert.equal((await post("/api/gemini/evil", {}, cookie)).status, 400);
    const gas = await post(
      "/api/gas",
      { action: "getAll", token: "attacker", url: "https://evil.example" },
      cookie,
    );
    assert.equal(gas.status, 200);
    assert.ok(!(await gas.text()).includes(env.GAS_TOKEN));
    assert.equal(calls[0].url, env.GAS_URL);
    assert.equal(JSON.parse(calls[0].body).token, env.GAS_TOKEN);
    const gemini = await post(
      "/api/gemini/gemini-3.5-flash-lite",
      {
        contents: [],
        tools: [{ google_search: {} }, { googleMaps: {} }],
        toolConfig: {
          retrievalConfig: { latLng: { latitude: 35.6, longitude: 139.7 } },
        },
      },
      cookie,
    );
    assert.equal(gemini.status, 200);
    assert.equal(calls[1].headers["x-goog-api-key"], env.GEMINI_API_KEY);
    const geminiPayload = JSON.parse(calls[1].body);
    assert.deepEqual(geminiPayload.tools, [
      { google_search: {} },
      { googleMaps: {} },
    ]);
    assert.equal(
      geminiPayload.toolConfig.retrievalConfig.latLng.latitude,
      35.6,
    );
    assert.equal(
      calls[1].url,
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent",
    );
    gasErrorCode = "SCHEMA_MISMATCH";
    const schemaError = await post("/api/gas", { action: "getAll" }, cookie);
    assert.deepEqual(await schemaError.json(), {
      status: "error",
      code: "SCHEMA_MISMATCH",
    });
    gasErrorCode = "";
    rejectGrounding = true;
    const rejected = await post(
      "/api/gemini/gemini-3.5-flash-lite",
      { contents: [], tools: [{ googleMaps: {} }] },
      cookie,
    );
    assert.equal(rejected.status, 502);
    const rejection = await rejected.json();
    assert.equal(rejection.code, "GROUNDING_REQUEST_FAILED");
    assert.ok(!JSON.stringify(rejection).includes(env.GEMINI_API_KEY));
    testTime += 8 * 86400 * 1000;
    assert.equal(
      (await post("/api/gas", { action: "getAll" }, cookie)).status,
      401,
    );
    assert.equal((await post("/api/logout", {}, cookie)).status, 200);
    assert.equal(
      (await post("/api/gas", { action: "getAll" }, cookie)).status,
      401,
    );
    for (let i = 0; i < 5; i++) await post("/api/login", { password: "wrong" });
    assert.equal((await post("/api/login", { password })).status, 429);
  } finally {
    app.close();
  }
});

test("production entry serves health check and refuses files outside dist", async () => {
  const { createProductionServer } = await import("../server/production.mjs");
  const app = createProductionServer({
    APP_ORIGIN: "https://travel.example.com",
    APP_PASSWORD_HASH: `salt:${scryptSync("test-password-only", "salt", 64).toString("hex")}`,
  });
  const request = (path) =>
    new Promise((resolve) => {
      const req = Readable.from([]);
      Object.assign(req, {
        url: path,
        method: "GET",
        headers: {},
        socket: { remoteAddress: "127.0.0.1" },
      });
      const res = {
        writeHead(status) {
          this.status = status;
        },
        end(body) {
          resolve({ status: this.status, body });
        },
      };
      app.emit("request", req, res);
    });
  assert.equal((await request("/healthz")).status, 200);
  for (const path of [
    "/.env.server",
    "/server/app.mjs",
    "/%2e%2e%2f.env.server",
    "/%00",
  ]) {
    assert.equal((await request(path)).status, 404);
  }
  app.close();
});
