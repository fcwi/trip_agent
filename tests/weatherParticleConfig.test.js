import assert from "node:assert/strict";
import test from "node:test";
import { WEATHER_PARTICLE_COUNTS } from "../src/utils/weatherParticleConfig.js";

test("uses the reduced weather particle budgets", () => {
  assert.deepEqual(WEATHER_PARTICLE_COUNTS, {
    rain: 60,
    snow: 40,
    fog: 16,
    stars: 50,
    lightning: 3,
  });
});
