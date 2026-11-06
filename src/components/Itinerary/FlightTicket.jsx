import { Plane } from "lucide-react";
import { useId } from "react";

export default function FlightTicket({ flight, label, returnFlight = false }) {
  const clipId = useId();
  // Keep any qualification following the scheduled times visible.
  const schedule = flight.time.match(
    /^(\d{1,2}:\d{2})\s+([A-Z]{3})\s*[➝→]\s*(\d{1,2}:\d{2})\s+([A-Z]{3})(.*)$/, // taste-skill-ignore: Parses flight-data separators, never renders an emoji icon.
  );
  return (
    <article
      className="journal-flight-ticket"
      data-return={returnFlight}
      aria-label={`${label}航班`}
      style={{ clipPath: `url(#${clipId})` }}
    >
      <svg
        width="0"
        height="0"
        className="journal-ticket-clip"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <clipPath id={clipId} clipPathUnits="objectBoundingBox">
            <path d="M0 0H1V.36C.965 .36 .965 .52 1 .52V1H0V.52C.035 .52 .035 .36 0 .36Z" />
          </clipPath>
        </defs>
      </svg>
      <div className="journal-flight-ticket__heading">
        <strong>{label}</strong>
        <span>{flight.code}</span>
      </div>
      {schedule ? (
        <>
          <div className="journal-flight-ticket__route">
            <div>
              <strong>{schedule[1]}</strong>
              <span>{schedule[2]}</span>
            </div>
            <span className="journal-flight-ticket__airway" aria-hidden="true">
              <Plane className="h-5 w-5" />
              <svg
                className="journal-flight-thread"
                viewBox="0 0 60 16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M2 9q8-6 15-2t14 0 13 1 14-2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeDasharray="3 5 6 4"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <div>
              <strong>{schedule[3]}</strong>
              <span>{schedule[4]}</span>
            </div>
          </div>
          {schedule[5].trim() && (
            <p className="journal-flight-ticket__note">{schedule[5].trim()}</p>
          )}
        </>
      ) : (
        <p className="journal-flight-ticket__note">{flight.time}</p>
      )}
    </article>
  );
}
