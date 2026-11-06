import TohokuSnow from "./TohokuSnow.jsx";
import KaruizawaSnow from "./KaruizawaSnow.jsx";
import BusanCoast from "./BusanCoast.jsx";
import { getTripSummary } from "../../../config/tripCatalog.js";
import { useState } from "react";
import { artworkImageSlots, useArtworkNight } from "./artworkTheme.js";

const artworks = {
  "tohoku-snow": TohokuSnow,
  "karuizawa-snow": KaruizawaSnow,
  "busan-coast": BusanCoast,
};

export default function TripArtwork({ tripId }) {
  const night = useArtworkNight();
  const [failedSource, setFailedSource] = useState(null);
  const source = artworkImageSlots[tripId]?.[night ? "dark" : "light"];
  const id = getTripSummary(tripId)?.artwork.id || "tohoku-snow";
  const Artwork = artworks[id];
  if (source && failedSource !== source) {
    return (
      <img
        className="journal-illustration"
        data-artwork-theme={night ? "dark" : "light"}
        src={`${import.meta.env.BASE_URL}${source}`}
        alt=""
        onError={() => setFailedSource(source)}
      />
    );
  }
  return <Artwork />;
}
