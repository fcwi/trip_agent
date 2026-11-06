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

export function JourneyVehicle({ kind = "coach", className }) {
  if (kind === "coach") return <JourneyCar className={className} />;
  return (
    <svg
      className={className}
      viewBox="0 0 80 60"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <g
        stroke="var(--journal-art-ink, var(--journal-ink))"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {kind === "cable" ? (
          <>
            <path d="M2 6q36 8 76-1M40 10v10m-9 0h18" />
            <path
              d="M22 22h37q8 0 8 9v18q-2 7-10 7H22q-9 0-9-9V31q0-9 9-9Z"
              fill="var(--journal-pink)"
            />
            <path
              d="M21 29h15v13H21Zm23 0h15v13H44Z"
              fill="var(--journal-window)"
            />
            <path d="M19 48h43m-35 7v3m27-3v3" />
          </>
        ) : (
          <>
            <path
              d="M7 16h47q14 1 20 21v10H5V24q0-8 2-8Z"
              fill="var(--journal-blue)"
            />
            <path
              d="M12 23h11v12H12Zm18 0h11v12H30Zm18 0h10l7 12H48Z"
              fill="var(--journal-window)"
            />
            <path d="M6 40h65m-63 12h65m-59-5v5m43-5v5" />
            <circle cx="19" cy="47" r="4" fill="var(--journal-snow)" />
            <circle cx="59" cy="47" r="4" fill="var(--journal-snow)" />
          </>
        )}
      </g>
    </svg>
  );
}

export default function JournalIllustration({ tripId = "" }) {
  return <TripArtwork tripId={tripId} />;
}
