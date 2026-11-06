import { getItineraryChipLabel } from "../../utils/itineraryHelpers.js";
import { LayoutDashboard } from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { JourneyVehicle } from "./JournalIllustration.jsx";
import { getJourneyVehicle } from "../../utils/journeyVehicle.js";

export default function DaySelector({
  activeDay,
  changeDay,
  navContainerRef,
  navItemsRef,
  itineraryData,
  tripStatus,
  currentTripDayIndex,
  tripId,
}) {
  const reduceMotion = useReducedMotion();
  const vehicleDay = activeDay < 0 ? 0 : activeDay;
  const stopSwipe = (event) => event.stopPropagation();
  return (
    <LayoutGroup id={`journey-${tripId}`}>
      <nav
        aria-label="行程日期"
        data-overview={activeDay === -1 ? "true" : "false"}
        ref={navContainerRef}
        className="travel-date-selector journal-route-selector scrollbar-hide"
        onTouchStart={stopSwipe}
        onTouchMove={stopSwipe}
        onTouchEnd={stopSwipe}
      >
        <button
          className="journal-route-overview"
          type="button"
          ref={(element) => {
            navItemsRef.current[-1] = element;
          }}
          onClick={() => changeDay(-1)}
          aria-pressed={activeDay === -1}
        >
          <LayoutDashboard className="h-5 w-5" aria-hidden="true" />
          <span>總覽</span>
        </button>
        {itineraryData.map((day, index) => (
          <button
            type="button"
            className="journal-route-day"
            key={day.day}
            ref={(element) => {
              navItemsRef.current[index] = element;
            }}
            onClick={() => changeDay(index)}
            aria-pressed={activeDay === index}
            aria-label={`查看${day.day}，${day.date}，${day.title}${tripStatus === "during" && currentTripDayIndex === index ? "，今天" : ""}`}
          >
            {index < itineraryData.length - 1 && (
              <svg
                className="journal-route-track"
                viewBox="0 0 100 8"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  d="M0 4q25-1 50 0t50 0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              </svg>
            )}
            <span className="journal-route-node" aria-hidden="true" />
            {vehicleDay === index && (
              <motion.span
                className="journal-route-vehicle"
                data-vehicle={getJourneyVehicle(tripId, index)}
                layoutId={reduceMotion ? undefined : "active-vehicle"}
                transition={{
                  duration: reduceMotion ? 0 : 0.3,
                  ease: [0.22, 1, 0.36, 1],
                }}
                aria-hidden="true"
              >
                <JourneyVehicle kind={getJourneyVehicle(tripId, index)} />
              </motion.span>
            )}
            <span className="journal-date-label">
              {day.date.match(/\d{1,2}\/\d{1,2}/)?.[0] || day.date}
            </span>
            <small>{getItineraryChipLabel(day)}</small>
            {tripStatus === "during" && currentTripDayIndex === index && (
              <span
                aria-hidden="true"
                className="travel-date-selector__today"
              />
            )}
          </button>
        ))}
      </nav>
    </LayoutGroup>
  );
}
