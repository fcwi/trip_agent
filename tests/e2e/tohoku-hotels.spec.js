import { test, expect } from "@playwright/test";
import { authenticate } from "./auth-fixture.js";

test("provisional hotels have exact map locations while unspecified suppliers remain pending", async ({
  page,
}) => {
  test.setTimeout(90_000);
  await page.route("**/*", (route) => {
    const host = new URL(route.request().url()).hostname;
    if (host === "127.0.0.1") return route.continue();
    if (host === "api.maptiler.com")
      return route.fulfill({
        json: {
          version: 8,
          sources: {},
          layers: [
            {
              id: "paper",
              type: "background",
              paint: { "background-color": "#faf8f0" },
            },
          ],
        },
      });
    return route.abort();
  });
  await authenticate(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/?trip=2027_tohoku");
  await expect(page.locator(".travel-cover")).toBeVisible();
  for (const [index, name] of [
    "天童溫泉 滝之湯",
    "田澤湖 Lake Resort",
    "繫溫泉紫苑",
    "京阪仙台飯店",
  ].entries()) {
    await page
      .locator(".travel-date-selector > button")
      .nth(index + 1)
      .click();
    const stay = page.locator(".journal-day-title a");
    await expect(stay).toContainText(`${name}（暫定）`);
    const query = new URL(await stay.getAttribute("href")).searchParams.get(
      "query",
    );
    expect(query).not.toContain("暫定");
    await expect(page.locator(".travel-day-main")).toContainText(
      "暫定飯店，依出發通知調整",
    );
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBe(390);
  }

  // Use actual trip events in the production map, with only the basemap controlled.
  const supplier = await page.evaluate(async () => {
    const { itineraryData } = await import("/src/trip/tripdata_2027_tohoku.jsx");
    return itineraryData[3].events.find((event) => event.locationPending);
  });
  expect(supplier.locationPending).toBe(true);
  expect(supplier.lat).toBeUndefined();
  expect(supplier.lon).toBeUndefined();
  await page.evaluate(async () => {
    const { itineraryData } =
      await import("/src/trip/tripdata_2027_tohoku.jsx");
    const { mountMap } = await import("/tests/e2e/map-fixture.jsx");
    mountMap({ events: itineraryData[1].events });
  });
  await expect(page.locator(".journal-map-canvas")).toHaveAttribute(
    "data-map-status",
    "ready",
  );
  await page.getByRole("button", { name: "開啟互動地圖" }).click();
  const dialog = page.getByRole("dialog");
  const kakunodate = dialog.getByRole("button", {
    name: "定位第4站：角館武家屋敷",
    exact: true,
  });
  await expect(kakunodate).toBeEnabled();
  await kakunodate.click();
  await expect(kakunodate).toHaveAttribute("aria-pressed", "true");
  const hotel = dialog.getByRole("button", {
    name: "定位第5站：入住田澤湖 Lake Resort（暫定）",
    exact: true,
  });
  await expect(hotel).toBeEnabled();
  await hotel.click();
  await expect(hotel).toHaveAttribute("aria-pressed", "true");
  await expect(dialog).toContainText("暫定飯店，依出發通知調整");
  await expect(
    dialog.getByRole("button", {
      name: "地點 5：入住田澤湖 Lake Resort（暫定）",
      exact: true,
    }),
  ).toBeVisible();
});
