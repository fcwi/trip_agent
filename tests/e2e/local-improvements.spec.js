import { expect, test } from "@playwright/test";
import { fileURLToPath } from "node:url";
import { authenticate } from "./auth-fixture.js";

test.beforeEach(async ({ page }) => {
  await page.route("**/*", (route) =>
    new URL(route.request().url()).hostname === "127.0.0.1"
      ? route.continue()
      : route.abort(),
  );
  await authenticate(page);
});

test("opens a linked date during the trip and restores it across tabs and reloads", async ({
  page,
}) => {
  await page.clock.setFixedTime(new Date("2027-01-22T04:00:00Z"));
  await page.goto("/?trip=2027_tohoku&tab=itinerary&day=2");
  const date = page.getByRole("navigation", { name: "行程日期" });
  await expect(date.getByRole("button", { name: /^查看Day 3/ })).toHaveAttribute(
    "aria-pressed", "true",
  );
  await date.getByRole("button", { name: /^查看Day 2/ }).click();
  await expect(page).toHaveURL(/[?&]day=1(?:&|$)/);
  await page.getByRole("button", { name: /^導遊/ }).click();
  await page.goBack();
  await expect(date.getByRole("button", { name: /^查看Day 2/ })).toHaveAttribute(
    "aria-pressed", "true",
  );
  await page.reload();
  await expect(date.getByRole("button", { name: /^查看Day 2/ })).toHaveAttribute(
    "aria-pressed", "true",
  );
});

test("retries the original AI question and image and focuses the input from a shortcut", async ({
  page,
}) => {
  let recover = false;
  const requests = [];
  await page.route("**/api/gemini/**", (route) => {
    requests.push(route.request().postDataJSON().contents);
    return recover
      ? route.fulfill({
          json: { candidates: [{ content: { parts: [{ text: "重試成功" }] } }] },
        })
      : route.fulfill({ status: 400, json: { error: "test failure" } });
  });
  await page.goto("/?trip=2027_tohoku&tab=ai");
  await page.getByRole("button", { name: /^翻譯「/ }).first().click();
  const input = page.locator("#chatMessageInput");
  await expect(input).toBeFocused();
  await input.fill("請翻譯這句話");
  await page.locator("#chatImageUpload").setInputFiles(
    fileURLToPath(new URL("../../public/icon-192.png", import.meta.url)),
  );
  await page.getByRole("dialog", { name: "確認上傳圖片" })
    .getByRole("button", { name: "確認使用" })
    .click();
  await expect(page.getByAltText("待傳送的圖片預覽")).toBeVisible();
  await page.getByRole("button", { name: "傳送訊息", exact: true }).click();
  const retry = page.getByRole("button", { name: "重試", exact: true });
  await expect(retry).toBeVisible();
  recover = true;
  await retry.click();
  await expect(page.getByText("重試成功", { exact: true })).toBeVisible();
  await expect(page.getByText("請翻譯這句話", { exact: true })).toHaveCount(1);
  await expect(retry).toHaveCount(0);
  expect(requests).toHaveLength(2);
  expect(requests[0][0].parts.some((part) => part.inlineData?.data)).toBe(true);
  expect(requests[1]).toEqual(requests[0]);
});

test("restores a saved exchange rate after reload and uses it offline", async ({
  page,
  context,
}) => {
  const latest = "https://latest.currency-api.pages.dev/**";
  await page.route(latest, (route) =>
    route.fulfill({ json: { jpy: { twd: 0.214 } } }),
  );
  await page.goto("/?trip=2027_tohoku&tab=itinerary");
  await expect(page.getByText("~ 0.214", { exact: true })).toBeVisible();
  await page.unroute(latest);
  await page.reload();
  await expect(page.getByText("上次匯率", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "開啟旅程工具" }).click();
  await page.getByRole("button", { name: "開啟匯率計算機" }).click();
  const calculator = page.getByRole("dialog", { name: "計算機" });
  await expect(calculator).toBeVisible();
  await context.setOffline(true);
  await expect(calculator.getByText(/上次匯率 ·/)).toBeVisible();
  await expect(calculator.getByRole("button", { name: /^轉/ })).toBeEnabled();
});

test("saves successful forecasts after one location fails and keeps its previous data", async ({
  page,
}) => {
  const key = "trip_agent:2027_tohoku:weather-forecast";
  await page.addInitScript(({ key }) => {
    localStorage.setItem(key, JSON.stringify({
      tendo: {
        time: ["2027-01-22"],
        temperature_2m_max: [6],
        temperature_2m_min: [1],
        weathercode: [3],
      },
      updatedAt: 1700000000000,
    }));
  }, { key });
  await page.route("https://api.open-meteo.com/**", (route) => {
    const latitude = new URL(route.request().url()).searchParams.get("latitude");
    return latitude === "38.3599694"
      ? route.fulfill({ status: 503 })
      : route.fulfill({
          json: {
            daily: {
              time: ["2027-01-22"],
              temperature_2m_max: [-1],
              temperature_2m_min: [-6],
              weathercode: [71],
            },
          },
        });
  });
  await page.goto("/?trip=2027_tohoku&day=0");
  await expect.poll(() => page.evaluate((key) => {
    const forecast = JSON.parse(localStorage.getItem(key));
    return {
      previous: forecast.tendo?.temperature_2m_max[0],
      updated: forecast.ginzan?.temperature_2m_max[0],
      timestamp: Number.isFinite(forecast.ginzan?.updatedAt),
    };
  }, key)).toEqual({ previous: 6, updated: -1, timestamp: true });
});
