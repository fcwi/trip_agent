import { test, expect } from "@playwright/test";

test("daily weather opens after a failed forecast and its retry recovers without leaving the dialog", async ({
  page,
}) => {
  let recover = false;
  await page.route("https://api.open-meteo.com/**", (route) => {
    if (!recover) return route.fulfill({ status: 503, body: "unavailable" });
    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        timezone: "Asia/Tokyo",
        hourly: { time: ["2027-01-22T09:00"], temperature_2m: [-3] },
        daily: {
          time: ["2027-01-22"],
          temperature_2m_max: [-1],
          temperature_2m_min: [-6],
          weathercode: [71],
        },
      }),
    });
  });
  await page.goto("/?trip=2027_tohoku");
  await page.getByLabel("通關密碼").fill("trip-e2e-password");
  await page.getByRole("button", { name: "解鎖行程" }).click();
  await page.locator('button[aria-label^="查看Day"]').first().click();
  await page.getByRole("button", { name: /查看.*詳細天氣資訊/ }).click();
  const dialog = page.getByRole("dialog", { name: "天氣詳情" });
  await expect(dialog).toBeVisible();
  await expect(
    dialog.getByText("天氣暫時無法更新", { exact: true }),
  ).toBeVisible();
  await expect(dialog.locator(".wc-grid")).toHaveCount(0);
  recover = true;
  await dialog
    .getByRole("button", { name: "重新整理天氣", exact: true })
    .last()
    .click();
  await expect(dialog.locator(".wc-temp-big")).toHaveText("-1°");
  await expect(
    dialog.getByText("天氣暫時無法更新", { exact: true }),
  ).toHaveCount(0);
  await dialog.getByRole("button", { name: "關閉天氣詳情" }).click();
  await expect(dialog).toBeHidden();
});
