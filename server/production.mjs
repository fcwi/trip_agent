import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createApp } from "./app.mjs";

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".webmanifest": "application/manifest+json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
};
export function createProductionServer(env = process.env, fetchImpl = fetch) {
  const api = createApp(env, fetchImpl);
  const root = fileURLToPath(new URL("../dist/", import.meta.url));
  return createServer(async (req, res) => {
    let pathname;
    try {
      pathname = decodeURIComponent(
        new URL(req.url, "http://localhost").pathname,
      );
    } catch {
      res.writeHead(400);
      res.end();
      return;
    }
    if (pathname.startsWith("/api/")) {
      api.emit("request", req, res);
      return;
    }
    if (pathname === "/healthz") {
      res.writeHead(200, {
        "Content-Type": "text/plain",
        "Cache-Control": "no-store",
      });
      res.end("ok");
      return;
    }
    if (!["GET", "HEAD"].includes(req.method)) {
      res.writeHead(405);
      res.end();
      return;
    }
    // Only files from dist can be served; source and secrets are outside this root.
    const file = resolve(
      root,
      `.${pathname === "/" ? "/index.html" : pathname}`,
    );
    if (
      !file.startsWith(root.endsWith(sep) ? root : root + sep) ||
      pathname.split("/").some((part) => part.startsWith("."))
    ) {
      res.writeHead(404);
      res.end();
      return;
    }
    try {
      const info = await stat(file);
      if (!info.isFile()) throw new Error("Not a file");
      res.writeHead(200, {
        "Content-Type": types[extname(file)] || "application/octet-stream",
        "Content-Length": info.size,
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": pathname.startsWith("/assets/")
          ? "public, max-age=31536000, immutable"
          : "no-cache",
      });
      if (req.method === "HEAD") {
        res.end();
        return;
      }
      const stream = createReadStream(file);
      stream.on("error", () => res.destroy());
      stream.pipe(res);
    } catch {
      res.writeHead(404);
      res.end();
    }
  });
}
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  createProductionServer().listen(
    Number(process.env.PORT || 3000),
    process.env.HOST || "0.0.0.0",
  );
}
