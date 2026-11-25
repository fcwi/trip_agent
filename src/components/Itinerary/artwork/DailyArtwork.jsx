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

export function SceneArtwork({ sceneId }) {
  const Scene = scenes[sceneId];
  return Scene ? <Scene /> : null;
}

const BASE =
  (typeof import.meta !== "undefined" && import.meta.env?.BASE_URL) || "/";

const TRIP_WATERCOLOR_STUDIES = {
  "2026_busan": [
    { src: `${BASE}artwork/studies/busan-1.jpg`, position: "center" },
    { src: `${BASE}artwork/studies/busan-2.jpg`, position: "center" },
    { src: `${BASE}artwork/covers/busan-day.jpg`, position: "18% 58%" },
  ],
  "2026_karuizawa": [
    { src: `${BASE}artwork/covers/karuizawa-day.jpg`, position: "28% 60%" },
    { src: `${BASE}artwork/covers/karuizawa-day.jpg`, position: "72% 65%" },
    { src: `${BASE}artwork/covers/karuizawa-day.jpg`, position: "50% 30%" },
  ],
  "2027_tohoku": [
    { src: `${BASE}artwork/studies/tohoku-1.jpg`, position: "center" },
    { src: `${BASE}artwork/studies/tohoku-2.jpg`, position: "center" },
    { src: `${BASE}artwork/studies/tohoku-3.jpg`, position: "center" },
  ],
};

export default function DailyArtwork({ tripId, dayIndex = 0 }) {
  const studies = TRIP_WATERCOLOR_STUDIES[tripId];
  if (studies?.length) {
    const pick = studies[dayIndex % studies.length];
    return (
      <img
        src={pick.src}
        alt=""
        loading="lazy"
        className="journal-day-watercolor-img"
        style={{ objectPosition: pick.position || "center" }}
      />
    );
  }
  return <SceneArtwork sceneId={getDailySceneId(tripId, dayIndex)} />;
}

export function TripStudies({ tripId }) {
  const watercolorStudies = TRIP_WATERCOLOR_STUDIES[tripId];
  if (watercolorStudies?.length) {
    return (
      <div className="journal-cover-studies" aria-hidden="true">
        {watercolorStudies.map((study, index) => (
          <div className="journal-cover-study" key={index}>
            <img
              src={study.src}
              alt=""
              loading="lazy"
              style={{ objectPosition: study.position || "center" }}
            />
          </div>
        ))}
      </div>
    );
  }
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
