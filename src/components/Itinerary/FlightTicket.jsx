import { Plane } from "lucide-react";

export default function FlightTicket({ flight, label, returnFlight = false }) {
  // Keep any qualification following the scheduled times visible.
  const schedule = flight.time.match(
    /^(\d{1,2}:\d{2})\s+([A-Z]{3})\s*[➝→]\s*(\d{1,2}:\d{2})\s+([A-Z]{3})(.*)$/,
  );
  return (
    <article
      className="journal-flight-ticket"
      data-return={returnFlight}
      aria-label={`${label}航班`}
    >
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
