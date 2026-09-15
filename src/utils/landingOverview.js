const DATE_KEY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})/;
const EVENT_TIME_PATTERN = /(\d{1,2}):(\d{2})/;

const getDateKey = (value) =>
  String(value || "").match(DATE_KEY_PATTERN)?.[0] || "";

const dateKeyToUtcDay = (dateKey) => {
  const match = dateKey.match(DATE_KEY_PATTERN);
  if (!match) return Number.NaN;
  return Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
};

const getWallClockParts = (date, timeZone, treatAsLocal) => {
  if (treatAsLocal) {
    return {
      dateKey: [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, "0"),
        String(date.getDate()).padStart(2, "0"),
      ].join("-"),
      minutes: date.getHours() * 60 + date.getMinutes(),
    };
  }

  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(date)
      .filter(({ type }) => type !== "literal")
      .map(({ type, value }) => [type, value]),
  );

  return {
    dateKey: `${parts.year}-${parts.month}-${parts.day}`,
    minutes: Number(parts.hour) * 60 + Number(parts.minute),
  };
};

export const parseEventMinutes = (time) => {
  const match = String(time || "").match(EVENT_TIME_PATTERN);
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return null;
  return hours * 60 + minutes;
};

export const getTripTemporalContext = ({
  now = new Date(),
  timeZone,
  startDate,
  endDate,
  itineraryLength,
  treatAsLocal = false,
}) => {
  const startDateKey = getDateKey(startDate);
  const endDateKey = getDateKey(endDate);
  const wallClock = getWallClockParts(now, timeZone, treatAsLocal);
  const currentDayValue = dateKeyToUtcDay(wallClock.dateKey);
  const startDayValue = dateKeyToUtcDay(startDateKey);
  const endDayValue = dateKeyToUtcDay(endDateKey);

  if (currentDayValue < startDayValue) {
    return {
      ...wallClock,
      tripStatus: "before",
      daysUntilTrip: Math.ceil((startDayValue - currentDayValue) / 86_400_000),
      currentTripDayIndex: -1,
    };
  }

  if (currentDayValue <= endDayValue) {
    const rawIndex = Math.floor((currentDayValue - startDayValue) / 86_400_000);
    return {
      ...wallClock,
      tripStatus: "during",
      daysUntilTrip: 0,
      currentTripDayIndex: Math.min(rawIndex, Math.max(0, itineraryLength - 1)),
    };
  }

  return {
    ...wallClock,
    tripStatus: "after",
    daysUntilTrip: 0,
    currentTripDayIndex: -1,
  };
};

const firstStrings = (...values) =>
  values
    .flatMap((value) => (Array.isArray(value) ? value : value ? [value] : []))
    .filter((value) => typeof value === "string" && value.trim())
    .slice(0, 2);

const findUpcomingEvent = (itineraryData, dayIndex, minutes) => {
  const today = itineraryData[dayIndex];
  if (!today) return null;

  const eventIndex = today.events.findIndex((event) => {
    const eventMinutes = parseEventMinutes(event.time);
    return eventMinutes === null || eventMinutes >= minutes;
  });

  if (eventIndex >= 0) {
    return {
      event: today.events[eventIndex],
      day: today,
      dayIndex,
      timing: "接下來",
    };
  }

  const tomorrow = itineraryData[dayIndex + 1];
  if (!tomorrow?.events?.length) return null;
  return {
    event: tomorrow.events[0],
    day: tomorrow,
    dayIndex: dayIndex + 1,
    timing: "明天第一站",
  };
};

export const getLandingOverview = ({
  itineraryData,
  tripConfig,
  checklistData,
  temporalContext,
}) => {
  const { tripStatus, currentTripDayIndex, minutes } = temporalContext;
  const isBefore = tripStatus === "before";
  const isAfter = tripStatus === "after";
  const dayIndex = isBefore
    ? 0
    : isAfter
      ? Math.max(0, itineraryData.length - 1)
      : currentTripDayIndex;
  const day = itineraryData[dayIndex] || null;
  const location = tripConfig.locations.find(
    ({ key }) => key === day?.locationKey,
  );

  let next = null;
  if (isBefore && day?.events?.length) {
    next = { event: day.events[0], day, dayIndex, timing: "旅程第一站" };
  } else if (!isAfter) {
    next = findUpcomingEvent(itineraryData, dayIndex, minutes);
  }

  const neededNow = isBefore
    ? (checklistData || [])
        .filter((item) => !item.checked && item.text)
        .slice(0, 2)
        .map((item) => item.text)
    : next
      ? firstStrings(
          next.event.tips,
          next.event.highlights,
          next.event.transport?.note,
        )
      : [];

  return {
    status: tripStatus,
    day,
    dayIndex,
    eyebrow: isBefore ? "下一個行程日" : isAfter ? "旅程回顧" : "今天的計畫",
    locationName: location?.name || day?.stay || "地點待確認",
    nextEvent: next?.event || null,
    nextTiming: next?.timing || "今日行程已完成",
    nextLocation:
      next?.event?.mapQuery ||
      tripConfig.locations.find(({ key }) => key === next?.day?.locationKey)
        ?.name ||
      "地點待確認",
    neededNow,
  };
};
