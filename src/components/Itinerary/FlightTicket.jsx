import { Check, Copy, Plane } from "lucide-react";
import { useId, useState } from "react";

export default function FlightTicket({ flight, label, returnFlight = false }) {
  const clipId = useId();
  const [copied, setCopied] = useState(false);
  const handleCopyCode = async () => {
    try {
      await navigator.clipboard?.writeText(flight.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Ignore clipboard failures in restricted environments
    }
  };
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
        <button
          type="button"
          className="journal-copy-chip"
          onClick={handleCopyCode}
          aria-label={`複製${label}班號 ${flight.code}`}
        >
          <span>{flight.code}</span>
          {copied ? (
            <Check aria-hidden="true" className="h-3 w-3" />
          ) : (
            <Copy aria-hidden="true" className="h-3 w-3" />
          )}
        </button>
      </div>
      <svg
        aria-hidden="true"
        className="journal-ticket-postmark"
        viewBox="0 0 64 40"
        fill="none"
      >
        <circle
          cx="44"
          cy="20"
          r="14"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeDasharray="3 2.5"
        />
        <circle cx="44" cy="20" r="9" stroke="currentColor" strokeWidth="1" />
        <path
          d="M4 15q10-4 20 0M4 20q10-4 20 0M4 25q10-4 20 0"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
      </svg>
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
