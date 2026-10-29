import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { scryptSync } from "node:crypto";
import { createApp } from "../../server/app.mjs";
import { build, preview } from "vite";
import { chromium, expect } from "@playwright/test";
import { tripCatalog, getTripSummary } from "../../src/config/tripCatalog.js";

const requestedTrips = process.argv
  .slice(2)
  .filter((argument) => !argument.startsWith("--"));
const trips = requestedTrips.length
  ? requestedTrips
  : ["2026_busan", "2026_karuizawa", "2027_tohoku"];
const password = "trip-e2e-password";
const root = "http://127.0.0.1:5189";
const reportDirectory = path.resolve("test-run.local/production-audit");
await fs.mkdir(reportDirectory, { recursive: true });
const results = [];
const browser = await chromium.launch({
  channel: process.env.PRODUCTION_TEST_BROWSER || undefined,
  executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH || undefined,
});
async function newPage(dark, slow) {
  const context = await browser.newContext({
    viewport: { width: dark ? 390 : 320, height: 844 },
    serviceWorkers: slow ? "block" : "allow",
  });
  await context.addInitScript(() => {
    localStorage.setItem(
      "cached_user_weather",
      JSON.stringify({
        temp: 20,
        desc: "多雲",
        locationName: "測試位置",
        weatherCode: 3,
      }),
    );
    const original = window.fetch.bind(window);
    window.fetch = (input, options) => {
      const url = new URL(
        typeof input === "string" ? input : input.url,
        location.href,
      );
      if (
        url.pathname === "/api/gas" ||
        url.pathname.startsWith("/api/gemini/")
      )
        return Promise.reject(new TypeError("controlled finance unavailable"));
      if (url.origin !== location.origin)
        return Promise.reject(
          new TypeError("controlled external service unavailable"),
        );
      return original(input, options);
    };
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  return { context, page, errors };
}
async function unlock(page, dark) {
  await page.getByLabel("通關密碼").fill(password);
  await page.getByLabel("在此裝置保持登入").check();
  await page.getByRole("button", { name: "解鎖行程" }).click();
  await expect(
    page.getByRole("navigation", { name: "主要功能" }),
  ).toBeVisible();
  await setTheme(page, dark);
}
async function setTheme(page, dark) {
  // Acknowledge the first-install notice before operating the page header.
  const offlineNotice = page.locator(
    '.pwa-notice-positioner[data-kind="offline"]',
  );
  if (await offlineNotice.isVisible()) {
    await offlineNotice.getByRole("button", { name: "關閉更新通知" }).click();
  }
  const toggle = page.getByRole("button", {
    name: dark ? "切換到深色模式" : "切換到亮色模式",
  });
  if (await toggle.count()) await toggle.click();
  await expect(page.locator(".travel-shell")).toHaveAttribute(
    "data-theme",
    dark ? "dark" : "light",
  );
}

async function loadEvidence(page) {
  return page.evaluate(() => {
    const resources = performance
      .getEntriesByType("resource")
      .filter((entry) => {
        const url = new URL(entry.name);
        return (
          url.origin === location.origin &&
          /\.(js|css|woff2)$/.test(url.pathname)
        );
      });
    const optional = resources.filter((entry) =>
      /\/(maplibre-gl|heic2any|mapStyleDiagnostics)-[^/]+\.js$/.test(
        new URL(entry.name).pathname,
      ),
    );
    return {
      elapsedMs: Math.round(performance.now()),
      resourceCount: resources.length,
      transferredBytes: resources.reduce(
        (sum, entry) => sum + entry.transferSize,
        0,
      ),
      decodedBytes: resources.reduce(
        (sum, entry) => sum + entry.decodedBodySize,
        0,
      ),
      optionalEngines: optional.map((entry) =>
        new URL(entry.name).pathname.split("/").at(-1),
      ),
    };
  });
}
async function auditPages(page, trip, label) {
  // A new navigation uses the automatic time-based theme; select and verify
  // the requested appearance again before taking any screenshots.
  await setTheme(page, label.endsWith("dark"));
  const nav = page.getByRole("navigation", { name: "主要功能" });
  for (const [tab, button] of [
    ["guides", "指南"],
    ["shops", "商店"],
    ["ai", "導遊"],
    ["finance", "記錄"],
    ["home", "行程"],
  ]) {
    await nav.getByRole("button", { name: new RegExp(`^${button}`) }).click();
    if (tab === "home") {
      await page.getByRole("button", { name: /^總覽/ }).click();
      await page.waitForFunction(() => {
        const el = document.querySelector(".travel-overview");
        return el && getComputedStyle(el.parentElement).opacity === "1";
      });
      await expect(page.locator(".travel-cover")).toBeVisible();
    } else if (tab === "guides" || tab === "shops") {
      const entry = page.locator(`#panel-${tab} article`).first();
      const toggle = entry.getByRole("button");
      if ((await toggle.getAttribute("aria-expanded")) === "false")
        await toggle.click();
      await expect(toggle).toHaveAttribute("aria-expanded", "true");
      await expect(entry.getByRole("link").first()).toHaveAttribute(
        "href",
        /^https:/,
      );
    } else if (tab === "ai") {
      await expect(page.locator(".journal-chat-log")).toContainText("您好");
      await expect(page.getByLabel("詢問 AI 導遊")).toBeVisible();
      await expect(page.getByLabel("詢問 AI 導遊")).toBeEnabled();
      await page.getByLabel("詢問 AI 導遊").fill("載入完成");
      await page.getByLabel("詢問 AI 導遊").clear();
    } else {
      await expect(page.getByLabel("暱稱")).toBeVisible();
      await expect(page.getByLabel("暱稱")).toBeEnabled();
      await page.getByLabel("暱稱").fill("Ready");
      await page.getByLabel("暱稱").clear();
    }
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
      `${trip} ${tab} overflow`,
    );
    await page.screenshot({
      path: path.join(reportDirectory, `${trip}-${label}-${tab}.png`),
      fullPage: true,
      animations: "disabled",
      scale: "css",
    });
  }
  await page.locator('button[aria-label^="查看Day"]').first().click();
  await expect(page.locator(".travel-day-layout")).toBeVisible();
  await page.waitForFunction(
    () =>
      getComputedStyle(
        document.querySelector(".travel-day-layout").parentElement,
      ).opacity === "1",
  );
  await page
    .locator(".travel-timeline-event")
    .first()
    .getByRole("button")
    .click();
  await expect(page.locator(".travel-event-details").first()).toBeVisible();
  await page.locator(".travel-day-route").scrollIntoViewIfNeeded();
  await expect(page.locator(".journal-map-canvas")).toBeVisible();
  await expect(
    page.locator(".journal-map-place-links a").first(),
  ).toBeVisible();
  await page.screenshot({
    path: path.join(reportDirectory, `${trip}-${label}-daily.png`),
    fullPage: true,
    animations: "disabled",
    scale: "css",
  });
}
try {
  for (const trip of trips) {
    assert.match(trip, /^202[67]_[a-z]+$/);
    const output = path.join(reportDirectory, trip);
    Object.assign(process.env, {
      VITE_TRIP_ID: trip,
      VITE_BASE_PATH: "/",
      VITE_PUBLIC_SITE_URL: root,
    });
    console.log(`BUILD ${trip}: production bundle with test credentials`);
    if (!process.argv.includes("--reuse"))
      await build({
        mode: "e2e",
        logLevel: "warn",
        build: { outDir: output, emptyOutDir: true },
      });
    let testTime = Date.now();
    const api = createApp(
      {
        APP_ORIGIN: root,
        APP_PASSWORD_HASH: `production-test:${scryptSync(password, "production-test", 64).toString("hex")}`,
        GEMINI_API_KEY: "e2e-only",
        MAPTILER_PUBLIC_KEY: "e2e-map-key",
        GAS_URL: "https://script.google.com/macros/s/e2e/exec",
        GAS_TOKEN: "e2e-token",
      },
      async () => new Response(JSON.stringify({ status: "success", data: [] })),
      () => testTime,
    );
    const server = await preview({
      mode: "e2e",
      plugins: [
        {
          name: "production-test-api",
          configurePreviewServer(vite) {
            vite.middlewares.use((req, res, next) => {
              if (!req.url.startsWith("/api/")) return next();
              if (req.url === "/api/login") testTime += 61000;
              api.emit("request", req, res);
            });
          },
        },
      ],
      logLevel: "warn",
      build: { outDir: output },
      preview: { host: "127.0.0.1", port: 5189, strictPort: true },
    });
    try {
      if (process.argv.includes("--map-diagnostics")) {
        const diagnostic = await newPage(true, true);
        const reports = [];
        diagnostic.page.on("console", (message) => {
          if (
            message.type() === "info" &&
            message.text().startsWith("[TripAgent map diagnostic] {")
          )
            reports.push(JSON.parse(message.text().split("] ")[1]));
        });
        try {
          await diagnostic.context.addInitScript(() => {
            const original = window.fetch;
            window.fetch = (input, options) => {
              const url = new URL(
                typeof input === "string" ? input : input.url,
                location.href,
              );
              if (url.hostname === "api.maptiler.com")
                return Promise.resolve(
                  new Response(
                    JSON.stringify({
                      version: 8,
                      sources: {
                        probe: {
                          type: "geojson",
                          data: {
                            type: "FeatureCollection",
                            features: [
                              {
                                type: "Feature",
                                properties: { private: "DO_NOT_PRINT" },
                                geometry: {
                                  type: "Point",
                                  coordinates: [140.917, 38.139],
                                },
                              },
                            ],
                          },
                        },
                      },
                      layers: [
                        {
                          id: "probe-radius",
                          type: "circle",
                          source: "probe",
                          paint: {
                            "circle-radius": [
                              "interpolate",
                              ["linear"],
                              ["get", "rank"],
                              0,
                              4,
                              10,
                              12,
                            ],
                          },
                        },
                      ],
                    }),
                    { headers: { "content-type": "application/json" } },
                  ),
                );
              return original(input, options);
            };
          });
          await diagnostic.page.goto(`${root}/?trip=${trip}&mapDebug=1`);
          await unlock(diagnostic.page, true);
          await diagnostic.page
            .locator('button[aria-label^="查看Day"]')
            .first()
            .click();
          await diagnostic.page
            .locator(".travel-day-route")
            .scrollIntoViewIfNeeded();
          await expect
            .poll(
              () =>
                reports.some((report) =>
                  report.issues.some(
                    (issue) =>
                      issue.layer === "probe-radius" &&
                      issue.property === "circle-radius",
                  ),
                ),
              { timeout: 30000 },
            )
            .toBe(true);
          assert.equal(JSON.stringify(reports).includes("e2e-map-key"), false);
          assert.equal(JSON.stringify(reports).includes("DO_NOT_PRINT"), false);
          assert.equal(JSON.stringify(reports).includes("140.917"), false);
          assert.deepEqual(diagnostic.errors, []);
          results.push({
            trip,
            scenario: "opt-in production map diagnostics",
            passed: true,
          });
          console.log(
            `PASS ${trip}: production diagnostic output retained and sanitized`,
          );
        } finally {
          await diagnostic.context.close();
        }
      }
      for (const dark of [false, true]) {
        const { context, page, errors } = await newPage(dark, false);
        try {
          await page.goto(`${root}/?trip=${trip}`);
          await unlock(page, dark);
          await page.evaluate(() => navigator.serviceWorker.ready);
          // Prompt-based workers control the next navigation after installation.
          await page.reload();
          await page.waitForFunction(() =>
            Boolean(navigator.serviceWorker.controller),
          );
          const cachedFont = await page.evaluate(async () => {
            const names = await caches.keys();
            for (const name of names) {
              const cache = await caches.open(name);
              if (
                (await cache.keys()).some((request) =>
                  request.url.includes("TripJournal-Regular"),
                )
              )
                return true;
            }
            return false;
          });
          assert.equal(
            cachedFont,
            true,
            "font must be cached before offline restart",
          );
          const cdp = await context.newCDPSession(page);
          await cdp.send("Network.clearBrowserCache");
          await context.setOffline(true);
          await page.reload();
          const blockedNetwork = await page.evaluate(async () => {
            try {
              await fetch(`/uncached-offline-probe-${Date.now()}.json`);
              return false;
            } catch {
              return true;
            }
          });
          assert.equal(
            blockedNetwork,
            true,
            "uncached network request must fail",
          );
          // A cold offline start must remain locked: no local flag bypasses
          // server authentication. Restore connectivity, authenticate, then
          // test offline use of the already-open application.
          await expect(page.getByLabel("通關密碼")).toBeVisible();
          await context.setOffline(false);
          await unlock(page, dark);
          await context.setOffline(true);
          await expect(
            page.getByRole("navigation", { name: "主要功能" }),
          ).toBeVisible();
          const dismiss = page.getByRole("button", { name: "關閉更新通知" });
          if (await dismiss.count()) await dismiss.click();
          await auditPages(page, trip, `offline-${dark ? "dark" : "light"}`);
          await expect(page.locator(".journal-map-canvas")).toHaveAttribute(
            "data-map-status",
            /^(offline|error)$/,
            { timeout: 15000 },
          );
          await page.screenshot({
            path: path.join(
              reportDirectory,
              `${trip}-offline-${dark ? "dark" : "light"}-daily.png`,
            ),
            fullPage: true,
            animations: "disabled",
            scale: "css",
          });
          await context.setOffline(false);
          await page.evaluate((dark) => {
            const original = window.fetch.bind(window);
            window.fetch = (input, options) => {
              const url = new URL(
                typeof input === "string" ? input : input.url,
                location.href,
              );
              if (url.hostname === "api.maptiler.com")
                return Promise.resolve(
                  new Response(
                    JSON.stringify({
                      version: 8,
                      sources: {},
                      layers: [
                        {
                          id: "paper",
                          type: "background",
                          paint: {
                            "background-color": dark ? "#3c3831" : "#faf8f0",
                          },
                        },
                      ],
                    }),
                    { headers: { "Content-Type": "application/json" } },
                  ),
                );
              return original(input, options);
            };
            window.dispatchEvent(new Event("online"));
          }, dark);
          await page
            .getByRole("navigation", { name: "主要功能" })
            .getByRole("button", { name: /^行程/ })
            .click();
          await page.locator('button[aria-label^="查看Day"]').first().click();
          await page.locator(".travel-day-route").scrollIntoViewIfNeeded();
          const retry = page.getByRole("button", { name: "重新載入地圖" });
          if (await retry.count()) await retry.click();
          await expect(page.locator(".journal-map-canvas")).toHaveAttribute(
            "data-map-status",
            "ready",
            { timeout: 20000 },
          );
          await context.setOffline(true);
          await page
            .getByRole("navigation", { name: "主要功能" })
            .getByRole("button", { name: /^導遊/ })
            .click();
          await page.getByLabel("詢問 AI 導遊").fill("離線旅行提醒");
          await page.getByRole("button", { name: "傳送訊息" }).click();
          await expect(
            page.getByText("連線發生錯誤或是系統忙碌中，請稍後再試。", {
              exact: false,
            }),
          ).toBeVisible({ timeout: 20000 });
          await page
            .getByRole("navigation", { name: "主要功能" })
            .getByRole("button", { name: /^記錄/ })
            .click();
          await page.getByLabel("暱稱").fill("Offline audit");
          await page.getByRole("button", { name: "開始記錄" }).click();
          await page.getByPlaceholder("金額").fill("123");
          await page.getByPlaceholder("項目說明…").fill("離線保留測試");
          await page.getByRole("button", { name: "送出紀錄" }).click();
          await expect(page.locator(".journal-finance-record")).toContainText(
            "離線保留測試",
          );
          await page.reload();
          await expect(page.getByLabel("通關密碼")).toBeVisible();
          await context.setOffline(false);
          await unlock(page, dark);
          await context.setOffline(true);
          await expect(page.locator(".journal-finance-record")).toContainText(
            "離線保留測試",
          );
          await setTheme(page, dark);
          await page.screenshot({
            path: path.join(
              reportDirectory,
              `${trip}-offline-${dark ? "dark" : "light"}-ledger.png`,
            ),
            fullPage: true,
            animations: "disabled",
            scale: "css",
          });
          await page.evaluate(async () => {
            await document.fonts.load('16px "Trip Journal"', "旅行手帳");
          });
          assert.equal(
            await page.evaluate(() =>
              [...document.fonts].some(
                (font) =>
                  font.family === "Trip Journal" && font.status === "loaded",
              ),
            ),
            true,
          );
          assert.deepEqual(errors, []);
          // Each offline trip navigation must stay locked until online authentication.
          for (const destination of [
            ...tripCatalog.filter((item) => item.id !== trip),
            getTripSummary(trip),
          ]) {
            await page.getByRole("button", { name: /^切換行程，目前/ }).click();
            await page
              .getByRole("dialog", { name: "選擇旅程" })
              .getByRole("button", {
                name: `切換至${destination.title}`,
                exact: true,
              })
              .click();
            await expect(page.getByLabel("通關密碼")).toBeVisible();
            await context.setOffline(false);
            await unlock(page, dark);
            await context.setOffline(true);
            await expect(page.locator(".travel-shell")).toHaveAttribute(
              "data-artwork",
              destination.artwork.id,
            );
            await expect(page.getByLabel("通關密碼")).toHaveCount(0);
            await page
              .getByRole("navigation", { name: "主要功能" })
              .getByRole("button", { name: /^記錄/ })
              .click();
            if (destination.id !== trip) {
              await expect(
                page.getByText("離線保留測試", { exact: true }),
              ).toHaveCount(0);
            } else {
              await expect(
                page.locator(".journal-finance-record"),
              ).toContainText("離線保留測試");
            }
          }
          results.push({
            trip,
            scenario: "offline restart",
            theme: dark ? "dark" : "light",
            pages: 6,
            fontFromCache: true,
            offlineMapFallback: true,
            aiFailureDisplayed: true,
            expenseSurvivesReload: true,
            offlineTripSwitchRequiresReauthentication: true,
            offlineColdStartStaysLocked: true,
            mapEngineRecoversOnline: true,
            passed: true,
          });
          console.log(
            `PASS ${trip}: offline restart / ${dark ? "dark" : "light"} / 6 pages + font`,
          );
        } finally {
          await context.close();
        }
        const slow = await newPage(dark, true);
        try {
          const cdp = await slow.context.newCDPSession(slow.page);
          await cdp.send("Network.enable");
          await cdp.send("Network.emulateNetworkConditions", {
            offline: false,
            latency: 200,
            downloadThroughput: 256000,
            uploadThroughput: 128000,
          });
          await slow.page.route("**/*.woff2", async (route) => {
            await new Promise((resolve) => setTimeout(resolve, 6000));
            await route.continue();
          });
          await slow.page.goto(`${root}/?trip=${trip}`);
          const lockedLoad = await loadEvidence(slow.page);
          assert.deepEqual(
            lockedLoad.optionalEngines,
            [],
            "locked page must not download optional map or photo engines",
          );
          await unlock(slow.page, dark);
          const unlockedLoad = await loadEvidence(slow.page);
          assert.deepEqual(
            unlockedLoad.optionalEngines,
            [],
            "trip overview must stay usable without optional engines",
          );
          const loadingFont = await slow.page.evaluate(() =>
            [...document.fonts].some(
              (font) =>
                font.family === "Trip Journal" && font.status !== "loaded",
            ),
          );
          assert.equal(
            loadingFont,
            true,
            "UI should become usable while font is still loading",
          );
          await auditPages(slow.page, trip, `slow-${dark ? "dark" : "light"}`);
          await slow.page.evaluate(async () => {
            await document.fonts.load('16px "Trip Journal"', "旅行手帳");
          });
          assert.deepEqual(slow.errors, []);
          results.push({
            trip,
            scenario: "cold slow network",
            theme: dark ? "dark" : "light",
            pages: 6,
            latencyMs: 200,
            downloadBytesPerSecond: 256000,
            fontDelayMs: 6000,
            usableBeforeFont: true,
            loadEvidence: { locked: lockedLoad, unlocked: unlockedLoad },
            passed: true,
          });
          console.log(
            `PASS ${trip}: cold slow network / ${dark ? "dark" : "light"} / 6 pages`,
          );
        } finally {
          await slow.context.close();
        }
      }
    } finally {
      await new Promise((resolve) => server.httpServer.close(resolve));
    }
  }
} finally {
  await browser.close();
  await fs.writeFile(
    path.join(reportDirectory, `results-${trips.join("-")}.json`),
    JSON.stringify(results, null, 2),
  );
}
console.log(`Production runtime audit passed: ${results.length} scenarios.`);
