// Public trip summaries only. Full itineraries stay in the authenticated app.
export const tripCatalog = Object.freeze([
  {
    id: "2027_tohoku",
    label: "東北・森吉樹冰",
    title: "2027 東北雪國五日",
    startDate: "2027-01-22",
    endDate: "2027-01-26",
    timeZone: "Asia/Tokyo",
    artwork: { id: "tohoku-snow", season: "winter", label: "雪山・溫泉・樹冰" },
  },
  {
    id: "2026_karuizawa",
    label: "東京・輕井澤",
    title: "2026 東京輕井澤六日",
    startDate: "2026-01-24",
    endDate: "2026-01-29",
    timeZone: "Asia/Tokyo",
    artwork: {
      id: "karuizawa-snow",
      season: "winter",
      label: "雪林・列車・山間小屋",
    },
  },
  {
    id: "2026_busan",
    label: "韓國・釜山",
    title: "2026 釜山親子五日",
    startDate: "2026-07-02",
    endDate: "2026-07-06",
    timeZone: "Asia/Seoul",
    artwork: {
      id: "busan-coast",
      season: "summer",
      label: "海灣・彩色街屋・海岸列車",
    },
  },
]);

export const getTripSummary = (id) =>
  tripCatalog.find((trip) => trip.id === id);

const calendarDate = (now, timeZone) => {
  const parts = new Intl.DateTimeFormat("en", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const part = (type) => parts.find((item) => item.type === type).value;
  return `${part("year")}-${part("month")}-${part("day")}`;
};

export const getTripPhase = (trip, now = new Date()) => {
  const today = calendarDate(now, trip.timeZone);
  return today < trip.startDate
    ? "upcoming"
    : today > trip.endDate
      ? "past"
      : "during";
};

export function chooseDefaultTrip(trips = tripCatalog, now = new Date()) {
  const during = trips
    .filter((trip) => getTripPhase(trip, now) === "during")
    .sort((a, b) => b.startDate.localeCompare(a.startDate));
  if (during.length) return during[0].id;
  const future = trips
    .filter((trip) => getTripPhase(trip, now) === "upcoming")
    .sort((a, b) => a.startDate.localeCompare(b.startDate));
  if (future.length) return future[0].id;
  return (
    [...trips].sort((a, b) => b.endDate.localeCompare(a.endDate))[0]?.id || null
  );
}

export const resolveTripId = (search = "", now = new Date()) => {
  const requested = new URLSearchParams(search).get("trip");
  return getTripSummary(requested)?.id || chooseDefaultTrip(tripCatalog, now);
};

export const createTripUrl = (id, href) => {
  if (!getTripSummary(id)) throw new Error("無此旅程");
  const url = new URL(href);
  url.searchParams.set("trip", id);
  url.searchParams.set("tab", "itinerary");
  url.hash = "";
  return `${url.pathname}${url.search}`;
};
