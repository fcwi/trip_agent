// Explicit day order keeps drawings independent of translated or edited titles.
export const dailySceneCatalog = Object.freeze({
  "2027_tohoku": Object.freeze([
    "tendo-evening",
    "ginzan-street",
    "moriyoshi-rime",
    "geibikei-boat",
    "matsushima-bay",
  ]),
  "2026_karuizawa": Object.freeze([
    "asama-arrival",
    "karuizawa-snow-play",
    "ueno-market",
    "roppongi-lights",
    "odaiba-waterfront",
    "narita-departure",
  ]),
  "2026_busan": Object.freeze([
    "seomyeon-kitchen",
    "cheongsapo-capsule",
    "gwangalli-night",
    "gamcheon-hillside",
    "yeongdo-walk",
  ]),
});

export function getDailySceneId(tripId, dayIndex = 0) {
  return dailySceneCatalog[tripId]?.[dayIndex] || null;
}
