import TripCover from "./TripCover.jsx";
import TripDayIndex from "./TripDayIndex.jsx";
import OverviewWeather from "./OverviewWeather.jsx";
import TodayOverviewCard from "../TodayOverviewCard.jsx";
import FlightInfoCard from "../FlightInfoCard.jsx";
import ChecklistCard from "../ChecklistCard.jsx";

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
  return (
    <div className="travel-overview">
      <TripCover {...props} />
      <div className="travel-overview__main">
        <TodayOverviewCard {...props} checklistData={checklist} />
        <TripDayIndex {...props} />
        {tripStatus === "after" && tripConfig.tripHighlights?.length > 0 && (
          <section
            className="travel-panel"
            aria-labelledby="trip-memories-heading"
          >
            <div className="travel-section-heading">
              <h2 id="trip-memories-heading">旅程足跡</h2>
            </div>
            <ul className="travel-highlights">
              {tripConfig.tripHighlights.map((spot, index) => (
                <li key={index}>{spot}</li>
              ))}
            </ul>
          </section>
        )}
      </div>
      <div className="travel-overview__aside">
        <OverviewWeather {...props} />
        <FlightInfoCard {...props} editorial />
        {tripStatus === "before" && (
          <ChecklistCard
            isDarkMode={isDarkMode}
            theme={theme}
            colors={colors}
            checklist={checklist}
            setChecklist={setChecklist}
            resetChecklist={resetChecklist}
          />
        )}
      </div>
    </div>
  );
}
