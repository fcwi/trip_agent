// Explicit itinerary order, independent of translated place names.
export function getJourneyVehicle(tripId, dayIndex) {
  if (tripId === "2027_tohoku" && dayIndex === 2) return "cable";
  if (tripId === "2026_busan" && dayIndex === 1) return "train";
  if (tripId === "2026_karuizawa" && [0, 5].includes(dayIndex)) return "train";
  return "coach";
}
