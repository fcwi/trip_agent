import TripArtwork from "./artwork/TripArtwork.jsx";
export { default as DayStamp } from "./artwork/DailyArtwork.jsx";

function CoachDrawing() {
  return (
    <>
      <rect
        x="5"
        y="10"
        width="70"
        height="36"
        rx="9"
        fill="var(--journal-pink)"
      />
      <path d="M13 18h40v15H13Z" fill="var(--journal-yellow)" />
      <path d="M59 18h7l5 15H59Z" fill="var(--journal-yellow)" />
      <path d="M26 18v15m14-15v15M8 39h47m16-1h4" />
      <circle cx="21" cy="46" r="7" fill="var(--travel-surface)" />
      <circle cx="61" cy="46" r="7" fill="var(--travel-surface)" />
      <circle cx="21" cy="46" r="2" fill="var(--journal-ink)" stroke="none" />
      <circle cx="61" cy="46" r="2" fill="var(--journal-ink)" stroke="none" />
    </>
  );
}

export function JourneyCar({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 80 60"
      fill="none"
      aria-hidden="true"
    >
      <g
        stroke="var(--journal-ink)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <CoachDrawing />
      </g>
    </svg>
  );
}

export default function JournalIllustration({ tripId = "" }) {
  return <TripArtwork tripId={tripId} />;
}
