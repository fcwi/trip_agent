import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { webcrypto } from "node:crypto";
import { build, preview } from "vite";
import { chromium, expect } from "@playwright/test";

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
async function encrypt(value) {
  const bytes = new TextEncoder();
  const salt = webcrypto.getRandomValues(new Uint8Array(16));
  const iv = webcrypto.getRandomValues(new Uint8Array(12));
  const material = await webcrypto.subtle.importKey(
    "raw",
    bytes.encode(password),
    "PBKDF2",
    false,
    ["deriveKey"],
  );
  const key = await webcrypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
    material,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt"],
  );
  const encrypted = await webcrypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    bytes.encode(value),
  );
  return [salt, iv, encrypted]
    .map((part) => Buffer.from(part).toString("hex"))
    .join(":");
}
const results = [];
const browser = await chromium.launch({
  channel: process.env.PRODUCTION_TEST_BROWSER || undefined,
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
      if (url.pathname.includes("__e2e_gas__"))
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
  const toggle = page.getByRole("button", {
    name: dark ? "切換到深色模式" : "切換到亮色模式",
  });
  if (await toggle.count()) await toggle.click();
  await expect(page.locator(".travel-shell")).toHaveAttribute(
    "data-theme",
    dark ? "dark" : "light",
  );
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
      VITE_ENCODED_KEY: await encrypt("e2e-gemini-key"),
      VITE_ENCODED_MAPS_KEY: "",
      VITE_ENCODED_MAPTILER_KEY: await encrypt("e2e-map-key"),
      VITE_ENCODED_GAS_URL: await encrypt(`${root}/__e2e_gas__`),
      VITE_ENCODED_GAS_TOKEN: await encrypt("e2e-gas-token"),
    });
    console.log(`BUILD ${trip}: production bundle with test credentials`);
    if (!process.argv.includes("--reuse"))
      await build({
        mode: "e2e",
        logLevel: "warn",
        build: { outDir: output, emptyOutDir: true },
      });
    const server = await preview({
      mode: "e2e",
      logLevel: "warn",
      build: { outDir: output },
      preview: { host: "127.0.0.1", port: 5189, strictPort: true },
    });
    try {
      for (const dark of [false, true]) {
        const { context, page, errors } = await newPage(dark, false);
        try {
          await page.goto(root);
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
                  request.url.includes("Huninn-Regular"),
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
            await document.fonts.load('16px "Huninn"', "旅行手帳");
          });
          assert.equal(
            await page.evaluate(() =>
              [...document.fonts].some(
                (font) => font.family === "Huninn" && font.status === "loaded",
              ),
            ),
            true,
          );
          assert.deepEqual(errors, []);
          results.push({
            trip,
            scenario: "offline restart",
            theme: dark ? "dark" : "light",
            pages: 6,
            fontFromCache: true,
            offlineMapFallback: true,
            aiFailureDisplayed: true,
            expenseSurvivesReload: true,
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
          await slow.page.goto(root);
          await unlock(slow.page, dark);
          const loadingFont = await slow.page.evaluate(() =>
            [...document.fonts].some(
              (font) => font.family === "Huninn" && font.status !== "loaded",
            ),
          );
          assert.equal(
            loadingFont,
            true,
            "UI should become usable while font is still loading",
          );
          await auditPages(slow.page, trip, `slow-${dark ? "dark" : "light"}`);
          await slow.page.evaluate(async () => {
            await document.fonts.load('16px "Huninn"', "旅行手帳");
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
