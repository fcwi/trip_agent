import { scryptSync } from "node:crypto";
import { createApp } from "../../server/app.mjs";

process.env.VITE_TRIP_ID = process.env.E2E_TRIP_ID || "2026_busan";
process.env.VITE_BASE_PATH = "/";
process.env.VITE_PUBLIC_SITE_URL = "http://127.0.0.1:4173";
// Only synthetic credentials. The real auth/session handler is exercised;
// upstream services are replaced, so browser tests cannot mutate cloud data.
let testTime = Date.now();
const api = createApp(
  {
    APP_ORIGIN: "http://127.0.0.1:4173",
    APP_PASSWORD_HASH: `e2e:${scryptSync("trip-e2e-password", "e2e", 64).toString("hex")}`,
    GEMINI_API_KEY: "e2e-server-only",
    GAS_URL: "https://script.google.com/macros/s/e2e/exec",
    GAS_TOKEN: "e2e-server-only-token",
  },
  async (url) =>
    new Response(
      JSON.stringify(
        url.includes("script.google.com")
          ? { status: "success", data: [] }
          : { candidates: [{ content: { parts: [{ text: "測試回覆" }] } }] },
      ),
    ),
  () => testTime,
);
const { createServer } = await import("vite");
const server = await createServer({
  mode: "e2e",
  server: { host: "127.0.0.1", port: 4173, strictPort: true },
  plugins: [
    {
      name: "local-e2e-api",
      configureServer(vite) {
        vite.middlewares.use((req, res, next) => {
          if (!req.url.startsWith("/api/")) return next();
          // Advance the injected clock only between logins to keep production limits
          // intact without making a long browser suite wait for rate-limit windows.
          if (req.url === "/api/login") testTime += 61000;
          api.emit("request", req, res);
        });
      },
    },
  ],
});
await server.listen();
server.printUrls();
