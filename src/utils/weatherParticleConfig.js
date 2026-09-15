export const WEATHER_PARTICLE_COUNTS = Object.freeze({
  rain: 60,
  snow: 40,
  fog: 16,
  stars: 50,
  lightning: 3,
});

export const MOBILE_WEATHER_PARTICLE_COUNTS = Object.freeze({
  rain: 28,
  snow: 18,
  fog: 8,
  stars: 22,
  lightning: 2,
});

export const getWeatherParticleCount = (
  type,
  { isNarrowViewport = false } = {},
) => {
  const table = isNarrowViewport
    ? MOBILE_WEATHER_PARTICLE_COUNTS
    : WEATHER_PARTICLE_COUNTS;
  return table[type] ?? 0;
};
