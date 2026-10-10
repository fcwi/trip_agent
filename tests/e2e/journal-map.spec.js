import { test, expect } from "@playwright/test";

const style = {
  version: 8,
  sources: {},
  layers: [
    {
      id: "paper",
      type: "background",
      paint: { "background-color": "#faf8f0" },
    },
  ],
};
async function mount(page, options = {}) {
  await page.goto("/");
  await page.evaluate(async (options) => {
    const { mountMap } = await import("/tests/e2e/map-fixture.jsx");
    mountMap(options);
  }, options);
}
test.beforeEach(async ({ page }) => {
  await page.route("https://api.maptiler.com/**", (route) =>
    route.fulfill({
      json: route.request().url().includes("streets-v4-dark")
        ? {
            ...style,
            layers: [
              { ...style.layers[0], paint: { "background-color": "#3c3831" } },
            ],
          }
        : style,
    }),
  );
  await page.route("https://router.project-osrm.org/**", (route) =>
    route.fulfill({
      json: {
        routes: [
          {
            geometry: {
              coordinates: [
                [140.917, 38.139],
                [140.327, 38.248],
              ],
            },
          },
        ],
      },
    }),
  );
});

test("map markers retain itinerary numbers and selection/reset work", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.clock.install();
  await mount(page);
  await expect(page.locator(".journal-map-canvas")).toHaveAttribute(
    "data-map-status",
    "ready",
  );
  await page.getByRole("button", { name: "開啟互動地圖" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.locator(".journal-map-canvas")).toHaveAttribute(
    "data-map-status",
    "ready",
  );
  await expect(
    dialog.getByRole("button", { name: "地點 3：山形站", exact: true }),
  ).toBeVisible();
  await expect(
    dialog.getByRole("button", { name: "定位第2站：尚未確定的午餐地點" }),
  ).toBeDisabled();
  const select = dialog.getByRole("button", { name: "定位第3站：山形站" });
  await select.click();
  await expect(select).toHaveAttribute("aria-pressed", "true");
  await expect(dialog.locator(".journal-map-popup")).toContainText("山形站");
  await page.clock.fastForward(60000);
  await expect(dialog.locator(".journal-map-popup")).toContainText("山形站");
  await dialog.getByRole("button", { name: "重置地圖視野" }).click();
  await expect(select).toHaveAttribute("aria-pressed", "false");
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "開啟互動地圖" }),
  ).toBeFocused();
  expect(errors).toEqual([]);
});

test("map failure can retry and offline reconnect recovers", async ({
  page,
  context,
}) => {
  await page.route("https://api.maptiler.com/**", (route) =>
    route.fulfill({ status: 503, body: "unavailable" }),
  );
  await mount(page);
  const map = page.locator(".journal-map-canvas");
  await expect(map).toHaveAttribute("data-map-status", "error");
  await expect(page.locator(".journal-map-place-links a")).toHaveCount(3);
  await page.unroute("https://api.maptiler.com/**");
  await page.route("https://api.maptiler.com/**", (route) =>
    route.fulfill({ json: style }),
  );
  await page.getByRole("button", { name: "重新載入地圖" }).click();
  await expect(map).toHaveAttribute("data-map-status", "ready");
  await context.setOffline(true);
  await expect(map).toHaveAttribute("data-map-status", "offline");
  await context.setOffline(false);
  await expect(map).toHaveAttribute("data-map-status", "ready");
});

test("missing key and coordinates preserve external map alternatives", async ({
  page,
}) => {
  await mount(page, { MAPTILER_KEY: "" });
  await expect(page.locator(".journal-map-canvas")).toHaveAttribute(
    "data-map-status",
    "unconfigured",
  );
  await page.getByRole("button", { name: "開啟互動地圖" }).click();
  await expect(page.getByRole("dialog").getByRole("link")).toHaveCount(3);
  await page.keyboard.press("Escape");
  await mount(page, { events: [{ title: "待安排地點" }] });
  await expect(page.locator(".journal-map-canvas")).toHaveAttribute(
    "data-map-status",
    "empty",
  );
  await expect(page.locator(".journal-map-place-links a")).toHaveAttribute(
    "href",
    /query=%E5/,
  );
});

test("route service failure keeps markers and explains the alternative", async ({
  page,
}) => {
  await page.route("https://router.project-osrm.org/**", (route) =>
    route.fulfill({ status: 503, body: "unavailable" }),
  );
  await mount(page);
  await expect(page.locator(".journal-map-canvas")).toHaveAttribute(
    "data-map-status",
    "ready",
  );
  await expect(
    page.getByText("道路路線暫無法取得", { exact: false }),
  ).toBeVisible();
  await expect(page.locator(".journal-map-marker")).toHaveCount(2);
});

test("slow style request shows loading without hiding place links", async ({
  page,
}) => {
  let release;
  const gate = new Promise((resolve) => {
    release = resolve;
  });
  await page.route("https://api.maptiler.com/**", async (route) => {
    await gate;
    await route.fulfill({ json: style });
  });
  await mount(page);
  await expect(page.locator(".journal-map-canvas")).toHaveAttribute(
    "data-map-status",
    "loading",
  );
  await expect(page.locator(".journal-map-place-links a")).toHaveCount(3);
  release();
  await expect(page.locator(".journal-map-canvas")).toHaveAttribute(
    "data-map-status",
    "ready",
  );
});

test("map dialog fits narrow light/dark and desktop layouts", async ({
  page,
}) => {
  for (const [label, width, height, dark] of [
    ["light", 320, 780, false],
    ["dark", 390, 844, true],
    ["desktop", 1280, 900, false],
  ]) {
    await page.setViewportSize({ width, height });
    await mount(page, { isDarkMode: dark });
    await expect(page.locator(".journal-map-canvas")).toHaveAttribute(
      "data-map-status",
      "ready",
    );
    await page.getByRole("button", { name: "開啟互動地圖" }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog.locator(".journal-map-canvas")).toHaveAttribute(
      "data-map-status",
      "ready",
    );
    await expect(
      dialog.getByRole("button", { name: "放大地圖", exact: true }),
    ).toBeVisible();
    const surface = await dialog
      .locator(".journal-map-canvas__surface")
      .boundingBox();
    expect(surface.height).toBeGreaterThan(200);
    expect(surface.width).toBeGreaterThan(250);
    const overflow = await dialog.evaluate(
      (el) => el.scrollWidth > el.clientWidth,
    );
    expect(overflow).toBe(false);
    await dialog.screenshot({
      path: `test-run.local/map-${label}.png`,
      scale: "css",
    });
    await page.keyboard.press("Escape");
  }
});
