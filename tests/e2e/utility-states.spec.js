import { test, expect } from "@playwright/test";

async function mount(page, kind, options = {}) {
  await page.goto("/");
  await page.evaluate(
    async ({ kind, options }) => {
      const { mountTool } = await import("/tests/e2e/tool-style-fixture.jsx");
      mountTool(kind, false, options);
    },
    { kind, options },
  );
}

test("calculator retains an in-progress calculation across rate loading and recovery", async ({
  page,
}) => {
  await mount(page, "calculator");
  const card = page.locator(".calc-modal");
  for (const name of ["2", "+", "3"])
    await card.getByRole("button", { name, exact: true }).click();
  await page.evaluate(() =>
    window.updateToolFixture({ rateData: { loading: true } }),
  );
  await expect(card.getByText("正在更新匯率", { exact: true })).toBeVisible();
  await expect(card.getByRole("button", { name: "轉TWD" })).toBeDisabled();
  await expect(card.locator(".calc-display")).toHaveText("3");
  await page.evaluate(() =>
    window.updateToolFixture({ rateData: { loading: false, current: 0.3 } }),
  );
  await expect(card.locator(".calc-hint")).toHaveText("1 JPY = 0.3000 TWD");
  await card.getByRole("button", { name: "=", exact: true }).click();
  await expect(card.locator(".calc-display")).toHaveText("5");
  await card.getByRole("button", { name: "轉TWD" }).click();
  await expect(card.locator(".calc-display")).toHaveText("1.5");
  await page.evaluate(() =>
    window.updateToolFixture({ rateData: { error: "unavailable" } }),
  );
  await expect(
    card.getByText("匯率暫時無法取得", { exact: true }),
  ).toBeVisible();
  await expect(card.locator(".calc-display")).toHaveText("1.5");
  for (const name of ["AC", "2", "÷", "0", "="])
    await card.getByRole("button", { name, exact: true }).click();
  await expect(card.locator(".calc-display")).toHaveText("Error");
  await card.getByRole("button", { name: "AC", exact: true }).click();
  for (let i = 0; i < 16; i++)
    await card.getByRole("button", { name: "9", exact: true }).click();
  await expect(card.locator(".calc-display")).toHaveText("99999999999999");
});

test("empty weather offers recovery, loading is announced and cached data survives errors and offline", async ({
  page,
}) => {
  await mount(page, "weather", { weather: { locationName: "仙台" } });
  const card = page.locator(".weather-card");
  await expect(
    card.getByText("尚無天氣資料", { exact: true }).last(),
  ).toBeVisible();
  await expect(card.locator(".wc-grid")).toHaveCount(0);
  await page.evaluate(() =>
    window.updateToolFixture({
      onRefresh: () => window.updateToolFixture({ loading: true }),
    }),
  );
  await card
    .getByRole("button", { name: "重新整理天氣", exact: true })
    .last()
    .click();
  await expect(card.getByText("正在更新天氣", { exact: true })).toBeVisible();
  await expect(
    card.getByRole("button", { name: "正在更新天氣", exact: true }),
  ).toBeDisabled();
  await page.evaluate(() =>
    window.updateToolFixture({
      loading: false,
      weather: {
        temp: -3,
        locationName: "仙台",
        error: true,
        updatedAt: Date.now(),
      },
    }),
  );
  await expect(
    card.getByText("天氣暫時無法更新", { exact: true }),
  ).toBeVisible();
  await expect(card.locator(".wc-temp-big")).toHaveText("-3°");
  await expect(card.getByText("尚無逐時預報", { exact: true })).toBeVisible();
  await page.evaluate(() => {
    Object.defineProperty(navigator, "onLine", {
      configurable: true,
      get: () => false,
    });
    window.dispatchEvent(new Event("offline"));
  });
  await expect(card.getByText("目前離線", { exact: true })).toBeVisible();
  await expect(card.locator(".wc-temp-big")).toHaveText("-3°");
});

test("weather omits missing readings and equal temperatures produce finite chart positions", async ({
  page,
}) => {
  await mount(page, "weather", {
    weather: {
      temp: 0,
      locationName: "仙台",
      daily: {
        time: ["2027-01-22", "2027-01-23"],
        temperature_2m_max: [0, null],
        temperature_2m_min: [0, null],
      },
      hourly: {
        time: ["2027-01-22T08:00", "2027-01-22T09:00"],
        temperature_2m: [0, null],
      },
    },
  });
  await expect(page.locator(".wc-day-row")).toHaveCount(1);
  await expect(page.locator(".wc-hour-item")).toHaveCount(1);
  const styles = await page
    .locator(".wc-temp-bar-inner,.wc-temp-dot")
    .evaluateAll((nodes) => nodes.map((node) => node.getAttribute("style")));
  expect(styles.join(" ")).not.toMatch(/NaN|Infinity/);
  await expect(page.locator(".weather-card")).not.toContainText("NaN");
});
