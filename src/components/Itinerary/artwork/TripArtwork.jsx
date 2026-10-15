import TohokuSnow from "./TohokuSnow.jsx";
import KaruizawaSnow from "./KaruizawaSnow.jsx";
import BusanCoast from "./BusanCoast.jsx";
import { getTripSummary } from "../../../config/tripCatalog.js";

const artworks = {
  "tohoku-snow": TohokuSnow,
  "karuizawa-snow": KaruizawaSnow,
  "busan-coast": BusanCoast,
};

export default function TripArtwork({ tripId }) {
  const id = getTripSummary(tripId)?.artwork.id || "tohoku-snow";
  const Artwork = artworks[id];
  return <Artwork />;
}
