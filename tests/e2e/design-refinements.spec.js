import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.route("**/*", (route) =>
    new URL(route.request().url()).hostname === "127.0.0.1"
      ? route.continue()
      : route.abort(),
  );
  await page.goto("/?trip=2027_tohoku");
  await page.getByLabel("通關密碼").fill("trip-e2e-password");
  await page.getByRole("button", { name: "解鎖行程", exact: true }).click();
  await expect(page.locator(".travel-overview")).toBeVisible();
});

test("guide search filters content and links without losing expanded guide identity", async ({
  page,
}) => {
  await page.getByRole("button", { name: /^指南/ }).click();
  const search = page.getByLabel("搜尋指南與連結");
  await search.fill("Ｖｉｓｉｔ");
  const guide = page.getByRole("button", { name: /Visit Japan Web 入境申報/ });
  await expect(guide).toBeVisible();
  await expect(page.locator("#panel-guides article")).toHaveCount(1);
  await expect(
    page.getByRole("link", { name: /Visit Japan Web/ }),
  ).toBeVisible();
  await guide.click();
  await expect(guide).toHaveAttribute("aria-expanded", "true");
  await search.fill("保險");
  await expect(guide).toHaveCount(0);
  await expect(page.getByRole("link", { name: /富邦產險/ })).toBeVisible();
  await search.fill("[.*無此內容");
  await expect(page.getByRole("status")).toContainText("0 篇指南 · 0 個連結");
  await expect(
    page.getByText("沒有符合的指南，試試其他關鍵字。"),
  ).toBeVisible();
  await page.getByRole("button", { name: "清除指南搜尋" }).click();
  await expect(search).toBeFocused();
  await expect(guide).toHaveAttribute("aria-expanded", "true");
  await page.getByRole("button", { name: /^商店/ }).click();
  await page.getByRole("button", { name: /^指南/ }).click();
  await expect(guide).toHaveAttribute("aria-expanded", "true");
});

test("desktop navigation stays outside content and tools remain reachable", async ({
  page,
}) => {
  for (const width of [1280, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    const dock = await page.locator(".travel-dock").boundingBox();
    const content = await page.locator("#main-content").boundingBox();
    expect(dock.x + dock.width).toBeLessThanOrEqual(content.x);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBe(width);
  }
  await page.getByRole("button", { name: "開啟旅程工具" }).click();
  await expect(
    page.getByRole("button", { name: "開啟匯率計算機" }),
  ).toBeInViewport();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "開啟旅程工具" }),
  ).toBeFocused();
  await page.setViewportSize({ width: 390, height: 844 });
  const dock = await page.locator(".travel-dock").boundingBox();
  expect(dock.x).toBe(0);
  expect(dock.width).toBe(390);
  expect(dock.y + dock.height).toBe(844);
});

test("record setup starts with nickname and keeps default avatar optional", async ({
  page,
}) => {
  await page.getByRole("button", { name: /^記錄/ }).click();
  await expect(page.getByRole("button", { name: /選擇.*頭像/ })).toHaveCount(0);
  await page.getByLabel("暱稱", { exact: true }).fill("   ");
  await expect(page.getByRole("button", { name: "開始記錄" })).toBeDisabled();
  await page.getByLabel("暱稱", { exact: true }).fill("旅人");
  await page.getByRole("button", { name: "開始記錄" }).click();
  await expect(page.getByLabel(/^金額（/)).toBeVisible();
});

test("editorial day changes fade without moving content and navigation uses a single dot", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.setViewportSize({ width: 390, height: 844 });
  const panelStyle = await page.locator(".travel-today").evaluate((el) => {
    const style = getComputedStyle(el);
    return {
      border: style.borderTopWidth,
      radius: style.borderRadius,
      shadow: style.boxShadow,
    };
  });
  expect(panelStyle.border).toBe("0px");
  expect(panelStyle.radius).toBe("6px");
  const dock = await page
    .locator(".travel-dock")
    .evaluate((el) => getComputedStyle(el).backdropFilter);
  expect(dock).toContain("blur(16px)");
  const currentNav = page.locator('.travel-nav__item[aria-current="page"]');
  expect(await currentNav.locator("svg").getAttribute("stroke-width")).toBe(
    "1.5",
  );
  expect(
    await currentNav.evaluate((el) => getComputedStyle(el, "::after").width),
  ).toBe("4px");
  const days = page.locator(".travel-date-selector > button");
  const count = await days.count();
  expect(await days.nth(1).locator(".journal-date-label").innerText()).toBe(
    "1/22",
  );
  const frames = await page.evaluate(async () => {
    const wrapper =
      document.querySelector(".travel-overview").parentElement.parentElement;
    const samples = [];
    document.querySelectorAll(".travel-date-selector > button")[1].click();
    const started = performance.now();
    while (performance.now() - started < 650) {
      await new Promise(requestAnimationFrame);
      for (const child of wrapper.children) {
        const style = getComputedStyle(child);
        const matrix = new DOMMatrixReadOnly(style.transform);
        samples.push({ opacity: Number(style.opacity), x: matrix.m41 });
      }
    }
    return samples;
  });
  expect(frames.some(({ opacity }) => opacity > 0 && opacity < 1)).toBe(true);
  expect(frames.every(({ x }) => Math.abs(x) < 0.1)).toBe(true);
  await expect(page.locator(".travel-day-heading")).toBeVisible();
  await expect(days.nth(1)).toHaveAttribute("aria-pressed", "true");
  await days.nth(count - 1).click();
  await expect(days.nth(count - 1)).toBeInViewport();
  await expect(days.nth(count - 1)).toHaveAttribute("aria-pressed", "true");
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    390,
  );
});

test("all trip guides remain searchable and readable on phone, tablet and desktop", async ({
  page,
}) => {
  for (const trip of ["2027_tohoku", "2026_karuizawa", "2026_busan"]) {
    await page.goto(`/?trip=${trip}&tab=guides`);
    const search = page.getByLabel("搜尋指南與連結");
    await expect(search).toBeVisible();
    const title = await page
      .locator(".journal-guide-title")
      .first()
      .innerText();
    const count = await page.locator("#panel-guides article").count();
    await search.fill(title);
    await expect(page.locator(".journal-guide-title").first()).toHaveText(
      title,
    );
    await page.getByRole("button", { name: "清除指南搜尋" }).click();
    await expect(page.locator("#panel-guides article")).toHaveCount(count);
    await page.locator("#panel-guides article > button").first().click();
    for (const width of [320, 768, 1440]) {
      await page.setViewportSize({ width, height: 1024 });
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBe(width);
      const copy = await page
        .locator(".journal-guide-content p")
        .first()
        .evaluate((el) => ({
          font: parseFloat(getComputedStyle(el).fontSize),
          line: parseFloat(getComputedStyle(el).lineHeight),
        }));
      expect(copy.font).toBeGreaterThanOrEqual(16);
      expect(copy.line).toBeGreaterThanOrEqual(24);
      if (width === 768) {
        expect(
          (await page.locator("#main-content").boundingBox()).width,
        ).toBeGreaterThan(650);
      }
    }
    await page.getByRole("button", { name: "行程", exact: true }).click();
    await page.getByRole("button", { name: "總覽", exact: true }).click();
    const dayButtons = page.locator(".travel-day-index ol > li > button");
    expect(await dayButtons.count()).toBeGreaterThanOrEqual(5);
    const firstDay = await dayButtons.first().boundingBox();
    const lastDay = await dayButtons.last().boundingBox();
    expect(Math.abs(firstDay.y - lastDay.y)).toBeLessThan(2);
    const days = await page.locator(".travel-day-index").boundingBox();
    const weather = await page.locator(".travel-weather-summary").boundingBox();
    expect(weather.y).toBeGreaterThanOrEqual(days.y + days.height);
  }
});
