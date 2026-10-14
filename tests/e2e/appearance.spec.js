import { test, expect } from "@playwright/test";

test("lock screen follows device appearance and manual trip mode controls utility styles", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");
  await expect(page.locator(".journal-auth-card")).toHaveCSS(
    "background-color",
    "rgb(35, 40, 36)",
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
});
