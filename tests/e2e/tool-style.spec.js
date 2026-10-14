import { test, expect } from "@playwright/test";

test("journal tools fit small, target-phone and landscape screens in both themes", async ({
  page,
}) => {
  for (const [width, height] of [
    [320, 740],
    [402, 874],
    [412, 915],
    [874, 402],
  ]) {
    await page.setViewportSize({ width, height });
    for (const dark of [false, true]) {
      for (const kind of ["calculator", "weather"]) {
        await page.goto("/");
        await page.evaluate(
          async ({ kind, dark }) => {
            const { mountTool } =
              await import("/tests/e2e/tool-style-fixture.jsx");
            mountTool(kind, dark);
          },
          { kind, dark },
        );
        const card = page.locator(
          kind === "calculator" ? ".calc-modal" : ".weather-card",
        );
        await expect(card).toBeVisible();
        const box = await card.boundingBox();
        expect(box.x).toBeGreaterThanOrEqual(15);
        expect(box.y).toBeGreaterThanOrEqual(15);
        expect(box.x + box.width).toBeLessThanOrEqual(width - 15);
        expect(box.y + box.height).toBeLessThanOrEqual(height - 15);
        expect(
          await card.evaluate((el) => el.scrollWidth <= el.clientWidth),
        ).toBe(true);
        await expect(card).toHaveCSS("backdrop-filter", "none");
        if (kind === "calculator") {
          for (const name of ["2", "+", "3", "="])
            await card.getByRole("button", { name, exact: true }).click();
          await expect(card.locator(".calc-display")).toHaveText("5");
          await card.getByRole("button", { name: "轉TWD" }).click();
          await expect(card.locator(".calc-display")).toHaveText("1");
          const close = card.getByRole("button", { name: "關閉計算機" });
          const control = await close.boundingBox();
          expect(control.width).toBeGreaterThanOrEqual(44);
          expect(control.height).toBeGreaterThanOrEqual(44);
          if (width === 402)
            await page.screenshot({
              path: `test-run.local/tool-${kind}-${dark ? "dark" : "light"}.png`,
            });
          await close.click();
          await expect(card).toHaveCount(0);
        } else {
          await expect(card.locator(".wc-day-row")).toHaveCount(7);
          await expect(card.locator(".wc-hour-item")).toHaveCount(12);
          if (width === 402)
            await page.screenshot({
              path: `test-run.local/tool-${kind}-${dark ? "dark" : "light"}.png`,
            });
          await card.locator(".wc-footer").scrollIntoViewIfNeeded();
          await expect(card.locator(".wc-footer")).toBeVisible();
          await card.getByRole("button", { name: "關閉天氣詳情" }).click();
          await expect(card).toHaveCount(0);
        }
      }
    }
  }
});
