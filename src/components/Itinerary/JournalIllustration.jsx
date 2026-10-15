import TripArtwork from "./artwork/TripArtwork.jsx";
/* Original, code-native drawings for the travel journal. */
export function DayStamp({ title = "", season = "summer" }) {
  const winter = season === "winter";
  const kind = /樹冰|阿仁|纜車|膠囊/.test(title)
    ? "cable"
    : /銀山|角館|古民家/.test(title)
      ? "town"
      : /草莓|採果/.test(title)
        ? "fruit"
        : /溫泉|SPA/.test(title)
          ? "bath"
          : /松島|海雲台|廣安|遊船/.test(title)
            ? "boat"
            : /空港|機場/.test(title)
              ? "plane"
              : "mountain";
  return (
    <svg
      className="journal-day-stamp"
      viewBox="0 0 80 80"
      fill="none"
      aria-hidden="true"
    >
      <g
        stroke="var(--journal-ink)"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {winter ? (
          <path
            d="M51 17q-2-8 6-9 7-10 13 0 10 0 8 9Z"
            fill="var(--journal-snow, var(--travel-surface))"
          />
        ) : (
          <circle cx="63" cy="16" r="7" fill="var(--journal-yellow)" />
        )}
        <path
          d="M0 66q20-8 40 0t40 0v14H0Z"
          fill={
            winter && !/boat|fruit|bath/.test(kind)
              ? "var(--journal-snow, var(--travel-surface))"
              : "var(--journal-blue)"
          }
        />
        {kind === "cable" ? (
          <>
            <path d="M3 16q35 19 74 1M40 27v9" />
            <rect
              x="22"
              y="36"
              width="37"
              height="29"
              rx="10"
              fill="var(--journal-pink)"
            />
            <path
              d="M30 44h7v8h-7zm14 0h7v8h-7z"
              fill="var(--journal-yellow)"
            />
          </>
        ) : kind === "town" ? (
          <>
            <path
              d="M9 61V33l18-12 18 12v28M44 61V39l15-10 14 10v22"
              fill="var(--journal-pink)"
            />
            <path
              d="m6 33 21-15 22 15m-6 6 16-13 17 13"
              fill="var(--journal-snow, var(--travel-surface))"
            />
            <path
              d="M17 38h8v9h-8zm14 0h8v9h-8zM22 61V52h10v9M52 44h12v9H52Z"
              fill="var(--journal-yellow)"
            />
          </>
        ) : kind === "fruit" ? (
          <>
            <path
              d="M21 30q19-8 38 0 3 17-19 32-22-15-19-32Z"
              fill="var(--journal-pink)"
            />
            <path
              d="m40 31-14-10 11 1 3-10 4 10 10-1Z"
              fill="var(--journal-green)"
            />
            <path d="m30 38 1 3m17-3 1 3m-10 7 1 3" />
          </>
        ) : kind === "bath" ? (
          <>
            <path
              d="M14 46h52q0 18-26 18T14 46Z"
              fill="var(--journal-yellow)"
            />
            <path d="M25 37q-8-6 0-12t0-12m15 24q-8-6 0-12t0-12m15 24q-8-6 0-12t0-12M20 47h40" />
          </>
        ) : kind === "plane" ? (
          <path
            d="m13 45 21-6 3-23 7-3 2 24 19-5 4 6-23 10-4 15-6 1-1-13-15 4Z"
            fill="var(--journal-pink)"
          />
        ) : kind === "boat" ? (
          <>
            <path d="m12 56 10 12h34l11-12Z" fill="var(--journal-pink)" />
            <path d="M38 51V24l21 27Z" fill="var(--travel-surface)" />
          </>
        ) : (
          <>
            <path
              d="m8 65 24-43 20 43 9-27 16 27Z"
              fill="var(--journal-green)"
            />
            <path d="m22 40 10-18 9 18-9-4Z" fill="var(--travel-surface)" />
          </>
        )}
        <path
          d="M8 73h64M6 9h9m-4-4v8"
          strokeWidth="1.2"
          strokeDasharray="2 4"
        />
        {winter && (
          <path d="M12 20h7m-3-3v6m47 22h6m-3-3v6" strokeWidth="1.2" />
        )}
      </g>
    </svg>
  );
}

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
