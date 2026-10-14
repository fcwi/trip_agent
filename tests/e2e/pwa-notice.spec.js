import { test, expect } from "@playwright/test";

test("update notice stays centered and fully visible outside transformed page containers", async ({
  page,
}) => {
  for (const [width, height] of [
    [320, 740],
    [402, 874],
    [412, 915],
    [874, 402],
    [915, 412],
  ]) {
    await page.setViewportSize({ width, height });
    await page.goto("/");
    await page.evaluate(async () => {
      const { mountNotice } = await import("/tests/e2e/pwa-notice-fixture.jsx");
      mountNotice();
    });
    const notice = page.locator(".pwa-notice");
    await expect(notice).toBeVisible();
    const box = await notice.boundingBox();
    expect(box.x).toBeGreaterThanOrEqual(15);
    expect(box.y).toBeGreaterThanOrEqual(15);
    expect(box.x + box.width).toBeLessThanOrEqual(width - 15);
    expect(box.y + box.height).toBeLessThanOrEqual(height - 15);
    expect(Math.abs(box.x + box.width / 2 - width / 2)).toBeLessThan(2);
    expect(Math.abs(box.y + box.height / 2 - height / 2)).toBeLessThan(2);
    await page.getByRole("button", { name: "立即更新網站" }).click();
    await expect(page.getByRole("button", { name: "更新中…" })).toBeDisabled();
    await page.getByRole("button", { name: "關閉更新通知" }).click();
    await expect(notice).toHaveCount(0);
  }
});

test("update dialog keeps keyboard focus inside, supports Escape and announces retry guidance", async ({
  page,
}) => {
  await page.goto("/");
  await page.evaluate(async () => {
    const { mountNotice } = await import("/tests/e2e/pwa-notice-fixture.jsx");
    mountNotice({ error: "更新暫未完成，請確認網路後再試一次。" });
  });
  const dialog = page.getByRole("dialog", { name: "網站有新版本" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("alert")).toContainText("請確認網路後再試一次");
  await expect(dialog).toBeFocused();
  for (let step = 0; step < 5; step++) {
    await page.keyboard.press("Tab");
    expect(
      await dialog.evaluate((el) => el.contains(document.activeElement)),
    ).toBe(true);
  }
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
});
