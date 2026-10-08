import { LayoutDashboard } from "lucide-react";
import { getItineraryChipLabel } from "../../utils/itineraryHelpers.js";
import { JourneyCar } from "./JournalIllustration.jsx";

export default function DaySelector({
  activeDay,
  changeDay,
  navContainerRef,
  navItemsRef,
  itineraryData,
  tripStatus,
  currentTripDayIndex,
}) {
  const stopSwipe = (event) => event.stopPropagation();
  return (
    <nav
      aria-label="行程日期"
      data-overview={activeDay === -1 ? "true" : "false"}
      ref={navContainerRef}
      className="travel-date-selector horizontal-scroll-fade scrollbar-hide"
      onTouchStart={stopSwipe}
      onTouchMove={stopSwipe}
      onTouchEnd={stopSwipe}
    >
      <button
        type="button"
        ref={(element) => {
          navItemsRef.current[-1] = element;
        }}
        onClick={() => changeDay(-1)}
        aria-pressed={activeDay === -1}
      >
        <LayoutDashboard aria-hidden="true" className="h-4 w-4" />
        總覽
      </button>
      {itineraryData.map((day, index) => (
        <button
          type="button"
          key={day.day}
          ref={(element) => {
            navItemsRef.current[index] = element;
          }}
          onClick={() => changeDay(index)}
          aria-pressed={activeDay === index}
          aria-label={`查看${day.day}，${day.date}，${day.title}${tripStatus === "during" && currentTripDayIndex === index ? "，今天" : ""}`}
        >
          <span className="journal-date-node" aria-hidden="true">
            {activeDay === index && <JourneyCar className="journal-date-car" />}
          </span>
          <span className="journal-date-label">
            {day.date.match(/\d{1,2}\/\d{1,2}/)?.[0] || day.date}
          </span>
          <small>{getItineraryChipLabel(day)}</small>
          {tripStatus === "during" && currentTripDayIndex === index && (
            <span aria-hidden="true" className="travel-date-selector__today" />
          )}
        </button>
      ))}
    </nav>
  );
}
