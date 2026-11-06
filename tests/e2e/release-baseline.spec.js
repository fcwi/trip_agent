import { test, expect } from "@playwright/test";
import { authenticate } from "./auth-fixture.js";

test.beforeEach(async ({ page }) => {
  await authenticate(page);
  await page.route("**/*", (route) =>
    new URL(route.request().url()).hostname === "127.0.0.1"
      ? route.continue()
      : route.abort(),
  );
  await page.route("**/__e2e_gas__**", (route) =>
    route.fulfill({ json: { status: "success", data: [] } }),
  );
});

test("active navigation controls a real labelled region on every page", async ({
  page,
}) => {
  await page.goto("/?trip=2027_tohoku");
  for (const id of ["itinerary", "finance", "ai", "shops", "guides"]) {
    const tab = page.locator(`#tab-${id}`);
    await tab.click();
    const panel = page.locator(`#${await tab.getAttribute("aria-controls")}`);
    await expect(panel).toBeVisible();
    await expect(panel).toHaveCount(1);
    await expect(panel).toHaveAttribute("aria-labelledby", `tab-${id}`);
  }
});

test("record text stays readable and edit actions work on touch without hover", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto("/?trip=2027_tohoku&tab=finance");
  await page.getByLabel("暱稱", { exact: true }).fill("審查");
  await page.getByRole("button", { name: "開始記錄", exact: true }).click();
  await expect(page.locator(".journal-record-empty")).toHaveCSS("opacity", "1");
  const colors = await page.evaluate(() => ({
    text: getComputedStyle(document.querySelector(".journal-record-empty"))
      .color,
    bg: getComputedStyle(document.querySelector(".travel-shell"))
      .backgroundColor,
    toastText: getComputedStyle(document.querySelector(".journal-toast")).color,
    toastBg: getComputedStyle(document.querySelector(".journal-toast"))
      .backgroundColor,
  }));
  const luminance = (c) =>
    c
      .match(/[\d.]+/g)
      .slice(0, 3)
      .map(Number)
      .map((n) => {
        n /= 255;
        return n <= 0.04045 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4;
      })
      .reduce((sum, n, i) => sum + n * [0.2126, 0.7152, 0.0722][i], 0);
  const ratio = (a, b) => {
    a = luminance(a);
    b = luminance(b);
    return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
  };
  expect(ratio(colors.text, colors.bg)).toBeGreaterThanOrEqual(4.5);
  expect(ratio(colors.toastText, colors.toastBg)).toBeGreaterThanOrEqual(4.5);
  await page.getByLabel(/^金額（/).fill("120");
  await page.getByLabel("項目說明", { exact: true }).fill("版面檢查午餐");
  await page.getByRole("button", { name: "送出紀錄", exact: true }).click();
  await expect(page.locator(".journal-finance-record")).toBeVisible();
  for (const dark of [false, true]) {
    const switcher = page.getByRole("button", {
      name: dark ? "切換到深色模式" : "切換到亮色模式",
    });
    if (await switcher.count()) await switcher.click();
    await expect(page.locator(".journal-record-actions")).toHaveCSS(
      "opacity",
      "1",
    );
    for (const name of ["編輯紀錄", "刪除紀錄"]) {
      const box = await page
        .getByRole("button", { name, exact: true })
        .boundingBox();
      expect(box.width).toBeGreaterThanOrEqual(44);
      expect(box.height).toBeGreaterThanOrEqual(44);
    }
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBe(320);
  }
  await page.getByRole("button", { name: "編輯紀錄", exact: true }).click();
  await expect(page.locator("#editContent")).toHaveValue("版面檢查午餐");
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "編輯紀錄", exact: true }),
  ).toBeFocused();
});

test("weather uses high then low in summaries, headers and every forecast row", async ({
  page,
}) => {
  await page.clock.setFixedTime(new Date("2027-01-22T04:00:00Z"));
  await page.route("https://api.open-meteo.com/**", (route) =>
    route.fulfill({
      json: {
        timezone: "Asia/Tokyo",
        current_weather: { temperature: 16, weathercode: 2, is_day: 1 },
        daily: {
          time: ["2027-01-22", "2027-01-23", "2027-01-24"],
          temperature_2m_max: [18, 15, 20],
          temperature_2m_min: [7, 10, 5],
          weathercode: [2, 61, 2],
        },
        hourly: {
          time: ["2027-01-22T13:00"],
          temperature_2m: [16],
          weathercode: [2],
        },
      },
    }),
  );
  await page.goto("/?trip=2027_tohoku");
  await page.getByRole("button", { name: "總覽", exact: true }).click();
  await expect(page.locator(".travel-weather-summary")).toContainText(
    "高溫 18° · 低溫 7°",
  );
  await page.locator(".journal-route-day").first().click();
  await expect(page.locator(".travel-day-weather")).toContainText("18°C / 7°C");
  await page.getByRole("button", { name: /查看.*詳細天氣資訊/ }).click();
  const dialog = page.getByRole("dialog", { name: "天氣詳情" });
  await expect(dialog.locator(".wc-hl")).toContainText("高溫:18°");
  await expect(dialog.locator(".wc-hl")).toContainText("低溫:7°");
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const row of await dialog.locator(".wc-day-row").all()) {
      const high = await row.locator(".wc-temp-high").boundingBox(),
        low = await row.locator(".wc-temp-min").boundingBox();
      expect(high.x).toBeLessThan(low.x);
    }
  }
  await expect(
    dialog.locator(".wc-day-row").first().locator(".wc-temp-high"),
  ).toHaveAttribute("aria-label", "高溫 18 度");
  await expect(
    dialog.locator(".wc-day-row").first().locator(".wc-temp-min"),
  ).toHaveAttribute("aria-label", "低溫 7 度");
  const range = await dialog
    .locator(".wc-temp-bar-inner")
    .first()
    .getAttribute("style");
  expect(parseFloat(range.match(/left:\s*([\d.]+)/)[1])).toBeCloseTo(
    (100 * 2) / 15,
    1,
  );
  expect(range).not.toMatch(/NaN|Infinity/);
});

test("shared headers and record viewport keep a usable canvas at phone, tablet and desktop sizes", async ({
  page,
}) => {
  await page.goto("/?trip=2027_tohoku");
  const headers = [];
  for (const tab of ["itinerary", "finance", "ai", "shops", "guides"]) {
    await page.locator(`#tab-${tab}`).click();
    await expect(page.locator(`#panel-${tab}`)).toBeVisible();
    headers.push(
      await page.locator(".travel-header").evaluate((el) => {
        const title = el.querySelector("h1"),
          style = getComputedStyle(title);
        return {
          font: style.fontFamily,
          size: style.fontSize,
          spacing: style.letterSpacing,
          height: Math.round(el.getBoundingClientRect().height),
          dates: getComputedStyle(el.querySelector(".travel-header__dates"))
            .display,
        };
      }),
    );
  }
  for (const header of headers) expect(header).toEqual(headers[0]);
  await page.locator("#tab-finance").click();
  await page.getByLabel("暱稱", { exact: true }).fill("尺寸檢查");
  await page.getByRole("button", { name: "開始記錄", exact: true }).click();
  for (const [width, height] of [
    [320, 568],
    [390, 844],
    [768, 1024],
    [1440, 900],
  ]) {
    await page.setViewportSize({ width, height });
    const canvas = await page.locator(".journal-record-log").boundingBox();
    expect(canvas.height).toBeGreaterThan(height * 0.35);
    const input = await page
      .locator(".journal-finance .journal-chat-input")
      .boundingBox();
    const dock = await page.locator(".travel-dock").boundingBox();
    expect(input.y + input.height).toBeLessThanOrEqual(
      width >= 1280 ? height : dock.y + 1,
    );
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBe(width);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByLabel("項目說明", { exact: true }).focus();
  await page.evaluate(() => {
    Object.defineProperty(window.visualViewport, "height", {
      configurable: true,
      value: 500,
    });
    window.visualViewport.dispatchEvent(new Event("resize"));
  });
  await expect(page.locator(".travel-shell")).toHaveAttribute(
    "data-record-keyboard",
    "true",
  );
  await expect(page.locator(".travel-dock")).toBeHidden();
  const input = await page
    .locator(".journal-finance .journal-chat-input")
    .boundingBox();
  expect(input.y + input.height).toBeLessThanOrEqual(501);
  expect(
    (await page.locator(".journal-record-log").boundingBox()).height,
  ).toBeGreaterThan(180);
  await page.evaluate(() => {
    delete window.visualViewport.height;
    window.visualViewport.dispatchEvent(new Event("resize"));
  });
  await expect(page.locator(".travel-dock")).toBeVisible();
});
