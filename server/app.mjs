import { createServer } from "node:http";
import {
  randomBytes,
  scryptSync,
  timingSafeEqual,
  createHash,
} from "node:crypto";
import { pathToFileURL } from "node:url";

export function createApp(env = process.env, fetchImpl = fetch) {
  if (!env.APP_ORIGIN || !env.APP_PASSWORD_HASH)
    throw new Error("APP_ORIGIN and APP_PASSWORD_HASH required");
  const origin = new URL(env.APP_ORIGIN).origin;
  const secure = origin.startsWith("https:");
  const [salt, hash] = env.APP_PASSWORD_HASH.split(":");
  if (!salt || !/^[a-f0-9]{128}$/.test(hash || ""))
    throw new Error("Invalid password hash");
  if (
    env.GAS_URL &&
    !/^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/.test(
      env.GAS_URL,
    )
  )
    throw new Error("Invalid GAS_URL");
  const sessions = new Map();
  const limits = new Map();
  const digest = (value) => createHash("sha256").update(value).digest("hex");
  const cookie = (value, age) =>
    `trip_session=${value}; Path=/api; HttpOnly; SameSite=Strict${secure ? "; Secure" : ""}${age === undefined ? "" : `; Max-Age=${age}`}`;
  return createServer(async (req, res) => {
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("X-Content-Type-Options", "nosniff");
    const send = (status, data) => {
      res.writeHead(status, { "Content-Type": "application/json" });
      res.end(JSON.stringify(data));
    };
    try {
      const path = new URL(req.url, origin).pathname;
      if (!path.startsWith("/api/")) return send(404, { error: "Not found" });
      if (req.headers.origin && req.headers.origin !== origin)
        return send(403, { error: "Origin rejected" });
      if (req.method !== "GET" && req.headers.origin !== origin)
        return send(403, { error: "Origin required" });
      const now = Date.now();
      for (const [key, value] of sessions)
        if (value.expires <= now) sessions.delete(key);
      for (const [key, value] of limits)
        if (value.expires <= now) limits.delete(key);
      const rate = (key, max) => {
        const entry = limits.get(key) || { count: 0, expires: now + 60000 };
        entry.count++;
        limits.set(key, entry);
        return entry.count <= max;
      };
      // Use the socket address, never an untrusted X-Forwarded-For header.
      if (!rate(`ip:${req.socket.remoteAddress}`, 120) || !rate("global", 1000))
        return send(429, { error: "Too many requests" });
      const token = /(?:^|;\s*)trip_session=([a-f0-9]{64})(?:;|$)/.exec(
        req.headers.cookie || "",
      )?.[1];
      const session = token && sessions.get(digest(token));
      const config = () => ({
        apiKey: env.GEMINI_API_KEY ? "server" : "",
        mapsApiKey: env.GOOGLE_MAPS_API_KEY ? "server" : "",
        gasUrl: env.GAS_URL && env.GAS_TOKEN ? "/api/gas" : "",
        gasToken: env.GAS_URL && env.GAS_TOKEN ? "server" : "",
        maptilerKey: env.MAPTILER_PUBLIC_KEY || "",
      });
      if (path === "/api/session" && req.method === "GET")
        return send(
          session ? 200 : 401,
          session ? config() : { error: "Login required" },
        );
      if (path === "/api/logout" && req.method === "POST") {
        if (token) sessions.delete(digest(token));
        res.setHeader("Set-Cookie", cookie("", 0));
        return send(200, { ok: true });
      }
      if (req.method !== "POST") return send(405, { error: "Method rejected" });
      if (
        path === "/api/login" &&
        (!rate(`login:${req.socket.remoteAddress}`, 5) ||
          !rate("login-global", 30))
      )
        return send(429, { error: "Try again later" });
      if (path !== "/api/login" && !session)
        return send(401, { error: "Login required" });
      let raw = "";
      let size = 0;
      for await (const chunk of req) {
        size += chunk.length;
        if (size > 12 * 1024 * 1024)
          return send(413, { error: "Request too large" });
        raw += chunk;
      }
      let body;
      try {
        body = JSON.parse(raw);
      } catch {
        return send(400, { error: "Invalid JSON" });
      }
      if (!body || typeof body !== "object" || Array.isArray(body))
        return send(400, { error: "Invalid body" });
      if (path === "/api/login") {
        if (typeof body.password !== "string" || body.password.length > 1024)
          return send(400, { error: "Invalid password" });
        const actual = scryptSync(body.password, salt, 64);
        if (!timingSafeEqual(actual, Buffer.from(hash, "hex")))
          return send(401, { error: "Login failed" });
        if (sessions.size >= 1000)
          return send(503, { error: "Try again later" });
        const value = randomBytes(32).toString("hex");
        const lifetime = body.remember ? 7 * 86400 : 8 * 3600;
        sessions.set(digest(value), { expires: now + lifetime * 1000 });
        res.setHeader(
          "Set-Cookie",
          cookie(value, body.remember ? lifetime : undefined),
        );
        return send(200, config());
      }
      if (
        !rate(
          `session:${digest(token)}`,
          path.startsWith("/api/gemini/") ? 10 : 60,
        )
      )
        return send(429, { error: "Too many requests" });
      let url,
        headers = { "Content-Type": "application/json" },
        payload = body;
      if (path.startsWith("/api/gemini/")) {
        const model = path.slice("/api/gemini/".length);
        const models = [
          "gemini-3-flash-preview",
          "gemini-3.1-flash-lite-preview",
          "gemini-2.5-flash-lite-preview-09-2025",
        ];
        if (!models.includes(model))
          return send(400, { error: "Invalid model" });
        if (!env.GEMINI_API_KEY)
          return send(503, { error: "Service unavailable" });
        url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
        headers["x-goog-api-key"] = env.GEMINI_API_KEY;
        payload = {
          ...body,
          generationConfig: {
            ...body.generationConfig,
            candidateCount: 1,
            maxOutputTokens: Math.min(
              8192,
              Math.max(
                1,
                Number(body.generationConfig?.maxOutputTokens) || 8192,
              ),
            ),
          },
        };
      } else if (path === "/api/gas") {
        if (!env.GAS_URL || !env.GAS_TOKEN)
          return send(503, { error: "Service unavailable" });
        if (
          ![
            "add",
            "addBatch",
            "edit",
            "delete",
            "getAll",
            "getLocations",
          ].includes(body.action)
        )
          return send(400, { error: "Invalid action" });
        url = env.GAS_URL;
        headers["Content-Type"] = "text/plain;charset=utf-8";
        payload = { ...body, token: env.GAS_TOKEN };
      } else if (path === "/api/places") {
        if (!env.GOOGLE_MAPS_API_KEY)
          return send(503, { error: "Service unavailable" });
        url = "https://places.googleapis.com/v1/places:searchNearby";
        headers["X-Goog-Api-Key"] = env.GOOGLE_MAPS_API_KEY;
        headers["X-Goog-FieldMask"] =
          "places.displayName,places.addressDescriptor";
        payload = { ...body, maxResultCount: 1 };
      } else return send(404, { error: "Not found" });
      const upstream = await fetchImpl(url, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(55000),
      });
      if (!upstream.ok) return send(502, { error: "Upstream request failed" });
      const data = await upstream.json();
      // Never relay upstream error text or accidentally echoed credentials.
      if (
        path === "/api/gas" &&
        data.status === "error" &&
        data.code === "BUSY"
      )
        return send(200, { status: "error", code: "BUSY", message: "Busy" });
      if (data.error || data.status === "error")
        return send(502, { error: "Upstream request failed" });
      let output = JSON.stringify(data);
      for (const secret of [
        env.GEMINI_API_KEY,
        env.GOOGLE_MAPS_API_KEY,
        env.GAS_TOKEN,
        env.GAS_URL,
      ].filter(Boolean))
        output = output.split(secret).join("[redacted]");
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(output);
    } catch {
      if (!res.headersSent) send(502, { error: "Request failed" });
      else res.end();
    }
  });
}
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  createApp().listen(
    Number(process.env.PORT || 3001),
    process.env.HOST || "127.0.0.1",
  );
}
