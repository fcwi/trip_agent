import { getDailySceneId, dailySceneCatalog } from "./dailySceneCatalog.js";
import {
  TendoEvening,
  GinzanStreet,
  MoriyoshiRime,
  GeibikeiBoat,
  MatsushimaBay,
} from "./TohokuDays.jsx";
import {
  AsamaArrival,
  SnowPlay,
  UenoMarket,
  RoppongiLights,
  OdaibaWaterfront,
  NaritaDeparture,
} from "./KaruizawaDays.jsx";
import {
  SeomyeonKitchen,
  CheongsapoCapsule,
  GwangalliNight,
  GamcheonHillside,
  YeongdoWalk,
} from "./BusanDays.jsx";

const scenes = {
  "tendo-evening": TendoEvening,
  "ginzan-street": GinzanStreet,
  "moriyoshi-rime": MoriyoshiRime,
  "geibikei-boat": GeibikeiBoat,
  "matsushima-bay": MatsushimaBay,
  "asama-arrival": AsamaArrival,
  "karuizawa-snow-play": SnowPlay,
  "ueno-market": UenoMarket,
  "roppongi-lights": RoppongiLights,
  "odaiba-waterfront": OdaibaWaterfront,
  "narita-departure": NaritaDeparture,
  "seomyeon-kitchen": SeomyeonKitchen,
  "cheongsapo-capsule": CheongsapoCapsule,
  "gwangalli-night": GwangalliNight,
  "gamcheon-hillside": GamcheonHillside,
  "yeongdo-walk": YeongdoWalk,
};

export default function DailyArtwork({ tripId, dayIndex = 0 }) {
  const Scene = scenes[getDailySceneId(tripId, dayIndex)];
  return Scene ? <Scene /> : null;
}

export function TripStudies({ tripId }) {
  const count = dailySceneCatalog[tripId]?.length || 0;
  if (!count) return null;
  return (
    <div className="journal-cover-studies" aria-hidden="true">
      {[0, Math.floor(count / 2), count - 1].map((index) => (
        <div className="journal-cover-study" key={index}>
          <DailyArtwork tripId={tripId} dayIndex={index} />
        </div>
      ))}
    </div>
  );
}
