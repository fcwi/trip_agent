import { MapPin } from "lucide-react";
import JournalIllustration from "./JournalIllustration.jsx";

export default function TripCover({
  tripConfig,
  itineraryData,
  tripStatus,
  daysUntilTrip,
  currentTripDayIndex,
}) {
  const cover = tripConfig.presentation?.cover;
  const status =
    tripStatus === "before"
      ? `距離出發 ${daysUntilTrip} 天`
      : tripStatus === "during"
        ? `旅程中 · Day ${currentTripDayIndex + 1}`
        : "旅程回顧";

  return (
    <section className="travel-cover" aria-labelledby="trip-cover-title">
      {cover?.src ? (
        <div className="travel-cover__image">
          <img
            src={cover.src}
            alt={cover.alt || ""}
            style={{ objectPosition: cover.position || "center" }}
            onError={(event) => {
              event.currentTarget.hidden = true;
            }}
          />
        </div>
      ) : (
        <div className="travel-cover__drawing">
          <JournalIllustration tripId={tripConfig.id} />
        </div>
      )}
      <div className="travel-cover__body">
        <div className="travel-cover__topline">
          <p className="travel-eyebrow">一起出發 · 旅行手帳</p>
          <span className="travel-badge">{status}</span>
        </div>
        <h2 id="trip-cover-title">{tripConfig.title}</h2>
        <p className="travel-cover__dates">
          {tripConfig.subTitle} <span aria-hidden="true">／</span>{" "}
          {itineraryData.length} 天旅程
        </p>
        <p className="travel-cover__places">
          <MapPin aria-hidden="true" className="h-4 w-4" />
          {tripConfig.presentation?.destinationLabel ||
            tripConfig.locations
              .slice(0, 3)
              .map((location) => location.name)
              .join(" · ")}
        </p>
      </div>
    </section>
  );
}
