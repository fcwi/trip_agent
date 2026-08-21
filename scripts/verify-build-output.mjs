import fs from "node:fs";
import path from "node:path";
import { gzipSync } from "node:zlib";

const DIST_DIRECTORY = path.resolve("dist");
const ASSETS_DIRECTORY = path.join(DIST_DIRECTORY, "assets");
const ENTRY_GZIP_LIMIT = 80 * 1024;
const INITIAL_GZIP_LIMIT = 100 * 1024;
const FORBIDDEN_PRELOADS = [
  "AuthenticatedTripApp",
  "framer-motion",
  "motion-vendor",
  "maplibre-gl",
  "heic2any",
];

const errors = [];
const requireFile = (relativePath) => {
  const filePath = path.join(DIST_DIRECTORY, relativePath);
  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    errors.push(`缺少正式產物：dist/${relativePath}`);
    return null;
  }
  return filePath;
};

const readRequiredFile = (relativePath) => {
  const filePath = requireFile(relativePath);
  return filePath ? fs.readFileSync(filePath, "utf8") : "";
};

const getAssetPath = (assetUrl) => {
  const fileName = assetUrl.split("/").filter(Boolean).at(-1);
  return fileName ? path.join(ASSETS_DIRECTORY, fileName) : null;
};

const gzipSize = (filePath) =>
  gzipSync(fs.readFileSync(filePath), { level: 9 }).byteLength;
const formatKiB = (bytes) => `${(bytes / 1024).toFixed(2)} KiB`;

const indexHtml = readRequiredFile("index.html");
const manifestSource = readRequiredFile("manifest.webmanifest");
const serviceWorker = readRequiredFile("sw.js");
requireFile("robots.txt");

if (/%[A-Z][A-Z0-9_]*%/.test(indexHtml)) {
  errors.push("dist/index.html 仍包含尚未替換的 HTML 樣板變數");
}

const moduleScriptTag = indexHtml.match(
  /<script\b[^>]*type="module"[^>]*>/i,
)?.[0];
const entryUrl = moduleScriptTag?.match(/\bsrc="([^"]+)"/i)?.[1];
if (!entryUrl) errors.push("dist/index.html 缺少 module 入口程式");

const preloadUrls = [
  ...indexHtml.matchAll(/<link\b[^>]*rel="modulepreload"[^>]*>/gi),
]
  .map(([tag]) => tag.match(/\bhref="([^"]+)"/i)?.[1])
  .filter(Boolean);

for (const preloadUrl of preloadUrls) {
  const forbiddenName = FORBIDDEN_PRELOADS.find((name) =>
    preloadUrl.toLowerCase().includes(name.toLowerCase()),
  );
  if (forbiddenName) {
    errors.push(`鎖定入口不可預載 ${forbiddenName}：${preloadUrl}`);
  }
}

const initialAssetPaths = [entryUrl, ...preloadUrls]
  .map(getAssetPath)
  .filter(Boolean);
for (const filePath of initialAssetPaths) {
  if (!fs.existsSync(filePath)) {
    errors.push(`HTML 引用不存在的初始資源：${path.basename(filePath)}`);
  }
}

const entryPath = entryUrl ? getAssetPath(entryUrl) : null;
const entryGzipBytes =
  entryPath && fs.existsSync(entryPath) ? gzipSize(entryPath) : 0;
const initialGzipBytes = initialAssetPaths
  .filter((filePath) => fs.existsSync(filePath))
  .reduce((total, filePath) => total + gzipSize(filePath), 0);

if (entryGzipBytes > ENTRY_GZIP_LIMIT) {
  errors.push(
    `登入入口 gzip ${formatKiB(entryGzipBytes)} 超過 ${formatKiB(ENTRY_GZIP_LIMIT)}`,
  );
}
if (initialGzipBytes > INITIAL_GZIP_LIMIT) {
  errors.push(
    `初始 JS gzip ${formatKiB(initialGzipBytes)} 超過 ${formatKiB(INITIAL_GZIP_LIMIT)}`,
  );
}

const assetNames = fs.existsSync(ASSETS_DIRECTORY)
  ? fs.readdirSync(ASSETS_DIRECTORY)
  : [];
for (const requiredChunk of [
  "AuthenticatedTripApp-",
  "maplibre-gl-",
  "heic2any-",
]) {
  if (!assetNames.some((name) => name.startsWith(requiredChunk))) {
    errors.push(`缺少按需載入 chunk：${requiredChunk}*.js`);
  }
}

let manifest;
try {
  manifest = JSON.parse(manifestSource);
} catch {
  errors.push("dist/manifest.webmanifest 不是有效 JSON");
}

if (manifest) {
  if (!manifest.name || !manifest.short_name || !manifest.start_url) {
    errors.push("PWA manifest 缺少 name、short_name 或 start_url");
  }
  if (!Array.isArray(manifest.icons) || manifest.icons.length < 2) {
    errors.push("PWA manifest 至少需要一般與 maskable 圖示");
  }
  for (const icon of manifest.icons || []) {
    const iconPath = String(icon.src || "").replace(/^\//, "");
    if (iconPath && !requireFile(iconPath)) break;
  }
}

if (!serviceWorker.includes("AuthenticatedTripApp-")) {
  errors.push("PWA service worker 未預快取解鎖後的核心旅程模組");
}
if (!assetNames.some((name) => /^workbox-.*\.js$/.test(name))) {
  errors.push("缺少 Workbox runtime 檔案");
}

if (errors.length > 0) {
  console.error(`Build output verification failed:\n- ${errors.join("\n- ")}`);
  process.exitCode = 1;
} else {
  console.log(
    [
      "Build output verification passed.",
      `Entry gzip: ${formatKiB(entryGzipBytes)}`,
      `Initial JS gzip: ${formatKiB(initialGzipBytes)}`,
      `Module preloads: ${preloadUrls.length}`,
      "PWA precache includes authenticated app: yes",
    ].join("\n"),
  );
}
