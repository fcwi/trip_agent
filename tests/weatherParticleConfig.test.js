import assert from "node:assert/strict";
import test from "node:test";
import {
  WEATHER_PARTICLE_COUNTS,
  getWeatherParticleCount,
} from "../src/utils/weatherParticleConfig.js";

test("uses the reduced weather particle budgets", () => {
  assert.deepEqual(WEATHER_PARTICLE_COUNTS, {
    rain: 60,
    snow: 40,
    fog: 16,
    stars: 50,
    lightning: 3,
  });
});

test("lowers particle counts on narrow viewports", () => {
  assert.equal(getWeatherParticleCount("rain"), 60);
  assert.equal(getWeatherParticleCount("rain", { isNarrowViewport: true }), 28);
  assert.ok(
    getWeatherParticleCount("rain", { isNarrowViewport: true }) <
      getWeatherParticleCount("rain"),
  );
});
