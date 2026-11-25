import { MapPin } from "lucide-react";
import JournalIllustration from "./JournalIllustration.jsx";
import { TripStudies } from "./artwork/DailyArtwork.jsx";
import { useState } from "react";
import { useArtworkNight } from "./artwork/artworkTheme.js";

const BASE =
  (typeof import.meta !== "undefined" && import.meta.env?.BASE_URL) || "/";

const TRIP_WATERCOLOR_COVERS = {
  "2026_busan": {
    src: `${BASE}artwork/covers/busan-day.jpg`,
    darkSrc: `${BASE}artwork/covers/busan-night.jpg`,
    alt: "釜山海岸、彩色街屋與廣安大橋水彩封面",
  },
  "2026_karuizawa": {
    src: `${BASE}artwork/covers/karuizawa-day.jpg`,
    darkSrc: `${BASE}artwork/covers/karuizawa-night.jpg`,
    alt: "輕井澤雪林、木屋與山間列車水彩封面",
  },
  "2027_tohoku": {
    src: `${BASE}artwork/covers/tohoku-day.jpg`,
    darkSrc: `${BASE}artwork/covers/tohoku-night.jpg`,
    alt: "東北雪山、樹冰與纜車水彩封面",
  },
};

export default function TripCover({
  tripConfig,
  itineraryData,
  tripStatus,
  daysUntilTrip,
  currentTripDayIndex,
}) {
  const cover =
    tripConfig.presentation?.cover || TRIP_WATERCOLOR_COVERS[tripConfig.id];
  const night = useArtworkNight();
  const [failedSource, setFailedSource] = useState(null);
  const coverSource = night ? cover?.darkSrc || cover?.src : cover?.src;
  const status =
    tripStatus === "before"
      ? `距離出發 ${daysUntilTrip} 天`
      : tripStatus === "during"
        ? `旅程中 · Day ${currentTripDayIndex + 1}`
        : "旅程回顧";

  return (
    <section className="travel-cover" aria-labelledby="trip-cover-title">
      {coverSource && failedSource !== coverSource ? (
        <div className="travel-cover__image">
          <img
            src={coverSource}
            data-artwork-theme={night ? "dark" : "light"}
            alt={cover.alt || ""}
            style={{ objectPosition: cover.position || "center" }}
            onError={() => setFailedSource(coverSource)}
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
        <TripStudies tripId={tripConfig.id} />
      </div>
    </section>
  );
}
