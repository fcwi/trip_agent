import TripCover from "./TripCover.jsx";
import TripDayIndex from "./TripDayIndex.jsx";
import OverviewWeather from "./OverviewWeather.jsx";
import TodayOverviewCard from "../TodayOverviewCard.jsx";
import FlightInfoCard from "../FlightInfoCard.jsx";
import ChecklistCard from "../ChecklistCard.jsx";
import { getOverviewSectionOrder } from "../../utils/overviewLayout.js";
import { JournalStar } from "./JournalMarks.jsx";

export default function TripOverview(props) {
  const {
    tripConfig,
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
          {tripConfig.tripHighlights.map((spot, index) => (
            <li key={index}>
              <JournalStar className="journal-footprint-star" />
              <span>{spot}</span>
            </li>
          ))}
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
