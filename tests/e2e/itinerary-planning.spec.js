import { expect, test } from "@playwright/test";
import { authenticate } from "./auth-fixture.js";

test.beforeEach(async ({ page }) => {
  await page.route("**/*", (route) =>
    new URL(route.request().url()).hostname === "127.0.0.1"
      ? route.continue()
      : route.abort(),
  );
  await authenticate(page);
});

test("restores checklist progress and filters by unfinished items", async ({
  page,
}) => {
  await page.goto("/?trip=2027_tohoku");
  await page.evaluate(() => {
    localStorage.setItem(
      "trip_agent:2027_tohoku:checklist-v1",
      JSON.stringify([
        { id: 1, text: "護照", checked: true },
        { id: 13, text: "雪靴", checked: false },
        { id: "custom", text: "我的清單項目", checked: false },
      ]),
    );
  });
  await page.reload();
  const checklist = page.getByRole("region", { name: "出發前檢查清單" });
  await expect(
    checklist.getByRole("heading", { name: /證件與預訂.*1／1/ }),
  ).toBeVisible();
  await expect(checklist.getByRole("checkbox", { name: /護照/ })).toBeChecked();
  await expect(
    checklist.getByText("每人 1 雙 · 出門前確認防滑與防水"),
  ).toBeVisible();
  await checklist.getByRole("button", { name: "只看未完成" }).click();
  await expect(checklist.getByRole("checkbox", { name: /護照/ })).toHaveCount(
    0,
  );
  await expect(
    checklist.getByRole("checkbox", { name: "我的清單項目" }),
  ).toBeVisible();
  await checklist.getByRole("textbox", { name: "新增檢查項目" }).fill("手套");
  await checklist
    .getByRole("combobox", { name: "新項目分類" })
    .selectOption("winter");
  await checklist.getByRole("button", { name: "新增檢查項目" }).click();
  await expect(
    checklist.getByRole("heading", { name: /雪地裝備.*0／2/ }),
  ).toBeVisible();
  await expect(checklist.getByRole("checkbox", { name: "手套" })).toBeVisible();
  await page.getByRole("button", { name: /^查看Day 2/ }).click();
  await page.getByRole("button", { name: "總覽", exact: true }).click();
  await expect(
    checklist.getByRole("button", { name: "只看未完成" }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.reload();
  await expect(checklist.getByRole("checkbox", { name: /護照/ })).toHaveCount(
    0,
  );
  await checklist.getByRole("button", { name: "只看未完成" }).click();
  await checklist.getByRole("button", { name: "編輯「護照」" }).click();
  const editor = page.getByRole("dialog", { name: "編輯清單項目" });
  await editor.getByRole("textbox", { name: "品項名稱" }).fill("全家護照");
  await editor.getByRole("combobox", { name: "分類" }).selectOption("carry");
  await editor.getByRole("textbox", { name: "數量" }).fill("3 本");
  await editor
    .getByRole("textbox", { name: "收納位置或提醒" })
    .fill("隨身包內袋");
  await editor.getByRole("button", { name: "儲存" }).click();
  await expect(editor).toHaveCount(0);
  await page.reload();
  const carry = checklist
    .getByRole("heading", { name: /隨身用品.*1／1/ })
    .locator("..");
  await expect(carry.getByRole("checkbox", { name: /全家護照/ })).toBeChecked();
  await expect(carry.getByText("3 本 · 隨身包內袋")).toBeVisible();
  await carry.getByRole("button", { name: "編輯「全家護照」" }).click();
  await editor.getByRole("textbox", { name: "品項名稱" }).fill("不應儲存");
  await page.keyboard.press("Escape");
  await expect(editor).toHaveCount(0);
  await expect(carry.getByRole("checkbox", { name: /全家護照/ })).toBeChecked();
});

test("shows cross-day summaries without mobile horizontal overflow and opens a day link", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto("/?trip=2027_tohoku");
  const days = page.getByRole("region", { name: "每日行程" });
  await days.getByRole("button", { name: "跨日總覽" }).click();
  await expect(days.getByRole("button", { name: "跨日總覽" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(days.getByText(/首站.*桃園機場集合/)).toBeVisible();
  await expect(days.getByText(/住宿.*滝之湯.*暫定/)).toBeVisible();
  expect(await days.evaluate((el) => el.scrollWidth <= el.clientWidth)).toBe(
    true,
  );
  await days.getByRole("button", { name: /^開啟Day 3/ }).click();
  await expect(page).toHaveURL(/[?&]day=2(?:&|$)/);
  await expect(page.locator(".travel-day-heading")).toContainText("Day 3");
  await page.getByRole("button", { name: "總覽", exact: true }).click();
  await expect(days.getByRole("button", { name: "跨日總覽" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await page.reload();
  await expect(days.getByText(/首站.*桃園機場集合/)).toBeVisible();
  await page.goto("/?trip=2026_busan");
  await expect(page.getByRole("button", { name: "跨日總覽" })).toHaveAttribute(
    "aria-pressed",
    "false",
  );
});

test("previews the selected stop in the route map and returns to the full day", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.route("**/api/session", async (route) => {
    const response = await route.fetch();
    await route.fulfill({
      response,
      json: { ...(await response.json()), maptilerKey: "e2e-map-key" },
    });
  });
  await page.route("https://api.maptiler.com/**", (route) =>
    route.fulfill({
      json: {
        version: 8,
        sources: {},
        layers: [
          {
            id: "background",
            type: "background",
            paint: { "background-color": "#efefef" },
          },
        ],
      },
    }),
  );
  await page.goto("/?trip=2027_tohoku&day=0");
  await page.getByRole("button", { name: "在地圖查看抵達仙台空港" }).click();
  const route = page.getByRole("complementary", { name: "當日路線" });
  await expect(route.getByRole("heading", { name: "當日路線" })).toBeFocused();
  const selected = route.getByRole("group", { name: "目前選擇的地點" });
  await expect(selected).toContainText("第 3 站 · 抵達仙台空港");
  await expect(
    selected.getByRole("link", { name: "在 Google Maps 開啟此站" }),
  ).toHaveAttribute("href", /google/);
  await expect(route.locator(".journal-map-canvas")).toHaveAttribute(
    "data-map-status",
    "ready",
  );
  await route.getByRole("button", { name: "開啟互動地圖" }).click();
  const dialog = page.getByRole("dialog", { name: "當前路線導覽" });
  await expect(dialog.locator(".journal-map-popup")).toContainText(
    "抵達仙台空港",
  );
  await dialog.getByRole("button", { name: "關閉地圖" }).click();
  await selected.getByRole("button", { name: "看全天路線" }).click();
  await expect(selected).toHaveCount(0);
});
