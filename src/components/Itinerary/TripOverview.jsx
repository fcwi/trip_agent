import { ChevronRight } from "lucide-react";
import TripCover from "./TripCover.jsx";
import TripDayIndex from "./TripDayIndex.jsx";
import OverviewWeather from "./OverviewWeather.jsx";
import TodayOverviewCard from "../TodayOverviewCard.jsx";
import FlightInfoCard from "../FlightInfoCard.jsx";
import ChecklistCard from "../ChecklistCard.jsx";
import { getOverviewSectionOrder } from "../../utils/overviewLayout.js";
import { JournalStar } from "./JournalMarks.jsx";

function findHighlightDayIndex(spot, itineraryData = [], fallbackIndex = 0) {
  const tokens = String(spot)
    .split(/[\s・·、,/]+/)
    .map((t) => t.trim())
    .filter((t) => t.length >= 2);
  const found = itineraryData.findIndex((day) => {
    const haystack = [
      day.title,
      day.caption,
      ...(day.events || []).map((e) => e.title),
    ]
      .filter(Boolean)
      .join(" ");
    return tokens.some((token) => haystack.includes(token));
  });
  if (found >= 0) return found;
  return itineraryData.length
    ? Math.min(fallbackIndex, itineraryData.length - 1)
    : 0;
}

export default function TripOverview(props) {
  const {
    tripConfig,
    itineraryData,
    changeDay,
    tripStatus,
    checklist,
    setChecklist,
    resetChecklist,
    isDarkMode,
    theme,
    colors,
  } = props;
  const sections = {
    today: <TodayOverviewCard {...props} checklistData={checklist} />,
    days: <TripDayIndex {...props} />,
    weather: <OverviewWeather {...props} />,
    flights: <FlightInfoCard {...props} editorial />,
    checklist: (
      <ChecklistCard
        {...{
          isDarkMode,
          theme,
          colors,
          checklist,
          setChecklist,
          resetChecklist,
        }}
      />
    ),
    memories: tripConfig.tripHighlights?.length > 0 && (
      <section className="travel-panel" aria-labelledby="trip-memories-heading">
        <div className="travel-section-heading">
          <h2 id="trip-memories-heading">旅程足跡</h2>
        </div>
        <ul className="travel-highlights">
          {tripConfig.tripHighlights.map((spot, index) => {
            const targetDay = findHighlightDayIndex(
              spot,
              itineraryData,
              index,
            );
            return (
              <li key={index}>
                {typeof changeDay === "function" ? (
                  <button
                    type="button"
                    className="journal-highlight-link"
                    onClick={() => changeDay(targetDay)}
                    aria-label={`${spot}，查看 Day ${targetDay + 1} 行程`}
                  >
                    <JournalStar className="journal-footprint-star" />
                    <span>{spot}</span>
                    <ChevronRight
                      aria-hidden="true"
                      className="journal-highlight-arrow"
                    />
                  </button>
                ) : (
                  <>
                    <JournalStar className="journal-footprint-star" />
                    <span>{spot}</span>
                  </>
                )}
              </li>
            );
          })}
        </ul>
      </section>
    ),
  };
  return (
    <div
      className="travel-overview journal-overview"
      data-trip-phase={tripStatus}
    >
      {getOverviewSectionOrder(tripStatus)
        .flatMap((key) => (key === "today" ? [key, "cover"] : [key]))
        .filter((key) => key === "cover" || sections[key])
        .map((key) =>
          key === "cover" ? (
            <TripCover key={key} {...props} />
          ) : (
            <div
              key={key}
              className={`journal-overview-section journal-overview-section--${key}`}
              data-overview-section={key}
            >
              {sections[key]}
            </div>
          ),
        )}
    </div>
  );
}
