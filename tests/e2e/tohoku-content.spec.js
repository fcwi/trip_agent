import { test, expect } from "@playwright/test";
import { authenticate } from "./auth-fixture.js";

test.beforeEach(async ({ page }) => {
  await authenticate(page);
  await page.route("**/*", (route) =>
    new URL(route.request().url()).hostname === "127.0.0.1"
      ? route.continue()
      : route.abort(),
  );
});

test("Tohoku shops name real branches with sources and readable addresses", async ({
  page,
}) => {
  await page.goto("/?trip=2027_tohoku&tab=shops");
  await expect(
    page.locator("#panel-shops .journal-entry > button").first(),
  ).toBeVisible();
  for (const toggle of await page
    .locator("#panel-shops .journal-entry > button")
    .all())
    await toggle.click();
  await expect(page.locator(".journal-place-card")).toHaveCount(16);
  for (const card of await page.locator(".journal-place-card").all()) {
    await expect(card.locator(".journal-shop-location")).not.toBeEmpty();
    const source = card.locator("a").first();
    expect(new URL(await source.getAttribute("href")).hostname).not.toMatch(
      /google/,
    );
    await expect(
      card.getByRole("link", { name: "Google Maps 搜尋", exact: true }),
    ).toHaveAttribute("href", /google\.com\/maps/);
  }
  const loft = page
    .locator(".journal-place-card")
    .filter({ hasText: "名取ロフト（LOFT）" });
  await expect(loft).toContainText("商場 2F｜224");
  const capsule = page
    .locator(".journal-place-card")
    .filter({ hasText: "ドリームカプセル イオンモール名取" });
  await expect(capsule).toContainText("商場 3F｜304");
  for (const dark of [false, true]) {
    const shell = page.locator(".travel-shell");
    if ((await shell.getAttribute("data-theme")) !== (dark ? "dark" : "light"))
      await page
        .getByRole("button", {
          name: dark ? "切換到深色模式" : "切換到亮色模式",
        })
        .click();
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBe(width);
      for (const card of await page.locator(".journal-place-card").all()) {
        const rect = await card.boundingBox();
        expect(rect.x + rect.width).toBeLessThanOrEqual(width);
        expect(
          await card.evaluate((el) => el.scrollWidth <= el.clientWidth),
        ).toBe(true);
      }
      expect(
        await loft
          .locator(".journal-shop-location")
          .evaluate((el) => parseFloat(getComputedStyle(el).fontSize)),
      ).toBeGreaterThanOrEqual(13);
    }
  }
});

test("Tohoku days distinguish unconfirmed suppliers and expose current destination sources", async ({
  page,
}) => {
  await page.goto("/?trip=2027_tohoku");
  await page.locator(".journal-route-day").nth(1).click();
  await expect(page.locator(".journal-timing-note")).toContainText(
    "非已預約入場時段",
  );
  await page
    .locator(".travel-timeline-event")
    .filter({ hasText: "角館武家屋敷" })
    .getByRole("button")
    .click();
  await expect(page.locator(".travel-timeline")).toContainText("2026/11/30");
  await expect(
    page.getByRole("link", {
      name: "觀光協會｜石黑家停止一般公開公告",
      exact: true,
    }),
  ).toHaveAttribute("href", "https://tazawako-kakunodate.com/news/19439/");
  await page.locator(".journal-route-day").nth(3).click();
  const fruit = page
    .locator(".travel-timeline-event")
    .filter({ hasText: "現採草莓吃到飽" });
  await expect(fruit).toContainText("地點待出發通知");
  await expect(fruit.locator(".journal-event-map-link")).toHaveCount(0);
  await page
    .locator(".travel-timeline-event")
    .filter({ hasText: "猊鼻溪輕舟" })
    .getByRole("button")
    .click();
  await expect(page.locator(".travel-timeline")).toContainText(
    "通常約九十分鐘",
  );
  await page.locator(".journal-route-day").nth(4).click();
  const fish = page
    .locator(".travel-timeline-event")
    .filter({ hasText: "烤笹蒲鉾／魚板體驗" });
  await expect(fish.locator(".journal-event-map-link")).toHaveCount(0);
  await expect(
    page
      .locator(".journal-map-place-links")
      .getByRole("link", { name: /烤笹蒲鉾/ }),
  ).toHaveCount(0);
  await expect(page.locator(".travel-timeline")).toContainText("暫定 17:25");
});

test("AI receives specialty branches, source dates and booking uncertainty", async ({
  page,
}) => {
  let payload;
  await page.route(
    "**/api/gemini/**",
    async (route) => {
      payload = route.request().postDataJSON();
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({
          candidates: [
            {
              content: {
                parts: [{ text: "名取 LOFT 在商場 2F，請參考官方資訊。" }],
              },
            },
          ],
        }),
      });
    },
  );
  await page.goto("/?trip=2027_tohoku&tab=ai");
  await page.locator('[data-journal-mode="guide"]').click();
  await page.getByLabel("詢問 AI 導遊").fill("名取 LOFT 和扭蛋店在哪裡？");
  await page.getByRole("button", { name: "傳送訊息", exact: true }).click();
  await expect(page.locator(".journal-chat-log")).toContainText(
    "名取 LOFT 在商場 2F",
  );
  const context = payload.systemInstruction.parts[0].text;
  for (const fact of [
    "名取ロフト（LOFT）",
    "商場 2F｜224",
    "ドリームカプセル",
    "商場 3F｜304",
    "2026-10-23",
    "地點尚未確認",
    "自由活動推薦不等於團費包含",
    "https://natori.aeonmall.jp/shop/",
  ])
    expect(context).toContain(fact);
});

test("existing trips keep explicitly labelled map searches without claiming official verification", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const trip of ["2026_busan", "2026_karuizawa"]) {
    await page.goto(`/?trip=${trip}&tab=shops`);
    await page.locator("#panel-shops .journal-entry > button").first().click();
    const first = page.locator(".journal-place-card").first();
    await expect(
      first.getByRole("link", { name: "Google Maps 搜尋", exact: true }),
    ).toHaveAttribute("href", /google\.com\/maps/);
    await expect(page.locator("#panel-shops")).toContainText(
      "請核對實際分店與位置",
    );
    const rect = await first.boundingBox();
    expect(rect.x + rect.width).toBeLessThanOrEqual(390);
  }
});
