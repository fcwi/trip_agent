import { test, expect } from "@playwright/test";

test("lock screen follows local time and honors a saved manual preference", async ({
  page,
}) => {
  await page.clock.setFixedTime(new Date(2026, 10, 13, 14));
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");
  const card = page.locator(".journal-auth-card");
  await expect(card).toHaveCSS("background-color", "rgb(255, 253, 246)");
  await page.clock.setFixedTime(new Date(2026, 10, 13, 18));
  await page.emulateMedia({ colorScheme: "light" });
  await page.reload();
  await expect(card).toHaveCSS(
    "background-color",
    "rgb(37, 32, 29)",
  );
  await page.getByLabel("通關密碼").fill("trip-e2e-password");
  await page.getByRole("button", { name: "解鎖行程" }).click();
  const shell = page.locator(".travel-shell");
  await expect(shell).toBeVisible();
  if ((await shell.getAttribute("data-theme")) !== "light")
    await page.getByRole("button", { name: "切換到亮色模式" }).click();
  await expect(shell).toHaveAttribute("data-theme", "light");
  expect(
    await page.evaluate(() =>
      document.documentElement.classList.contains("dark"),
    ),
  ).toBe(false);
  expect(
    await page.evaluate(() => document.documentElement.style.colorScheme),
  ).toBe("light");
  await page.getByRole("button", { name: /^記錄/ }).click();
  const nickname = page.getByLabel("暱稱", { exact: true });
  await expect(nickname).toBeVisible();
  const background = await nickname.evaluate(
    (el) => getComputedStyle(el).backgroundColor,
  );
  expect(Number(background.match(/[\d.]+/)[0])).toBeGreaterThan(128);
  await Promise.all([
    page.waitForResponse((response) => response.url().endsWith("/api/logout") && response.ok()),
    page.getByRole("button", { name: "鎖定行程" }).click(),
  ]);
  await page.reload();
  await expect(card).toHaveCSS("background-color", "rgb(255, 253, 246)");
});
