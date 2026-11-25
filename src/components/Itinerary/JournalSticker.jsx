// Monochrome stationery stamps matched to each trip's accent ink.
export default function JournalSticker({ kind = "passport", className = "" }) {
  return (
    <span
      className={`journal-paper-sticker ${className}`}
      data-sticker={kind}
      aria-hidden="true"
    >
      <svg viewBox="0 0 64 64" fill="none" focusable="false">
        <g
          stroke="var(--travel-accent, var(--journal-art-ink))"
          strokeWidth="1.15"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle
            cx="32"
            cy="32"
            r="27"
            strokeDasharray="3 2.5"
            strokeOpacity="0.45"
          />
          {kind === "ticket" ? (
            <>
              <path
                d="m12 22 38-2 2 8q-5 2 .5 7l1 8-38 2-1-8q5-3-.5-6Z"
                fill="var(--travel-accent)"
                fillOpacity="0.06"
              />
              <path d="m37 21 1.5 22" strokeDasharray="2 3" />
              <path d="m18 28 13-.5m-13 8 10-.5" strokeWidth="0.9" />
            </>
          ) : kind === "meal" ? (
            <>
              <path
                d="M15 31q2 16 17 17 16-1 17-17Z"
                fill="var(--travel-accent)"
                fillOpacity="0.07"
              />
              <ellipse cx="32" cy="31" rx="17" ry="5" />
              <path d="m38 25 10-11m-6 13 11-11" />
              <path d="M23 23q-3-3 0-6m8 7q-3-4 0-8" strokeWidth="0.9" />
            </>
          ) : kind === "onsen" ? (
            <>
              <path
                d="M16 37q16-6 32 0l-1.5 10q-14 6-29 0Z"
                fill="var(--travel-accent)"
                fillOpacity="0.07"
              />
              <ellipse cx="32" cy="37" rx="16" ry="5" />
              <path
                d="M23 29q-4-4 0-8t0-7m9 14q-4-4 0-8t0-7m9 15q-4-4 0-8t0-7"
                strokeWidth="1"
              />
            </>
          ) : kind === "shopping" ? (
            <>
              <path
                d="m18 25 28-1 3 23q-17 2-34 0Z"
                fill="var(--travel-accent)"
                fillOpacity="0.07"
              />
              <path d="M25 28v-8q7-9 14 0v8" />
            </>
          ) : kind === "suitcase" ? (
            <>
              <rect
                x="17"
                y="22"
                width="30"
                height="23"
                rx="3"
                fill="var(--travel-accent)"
                fillOpacity="0.07"
              />
              <path d="M26 22v-5h12v5M25 22v23M39 22v23" strokeWidth="1" />
              <circle cx="23" cy="47" r="2" />
              <circle cx="41" cy="47" r="2" />
            </>
          ) : kind === "camera" ? (
            <>
              <rect
                x="15"
                y="23"
                width="34"
                height="22"
                rx="3"
                fill="var(--travel-accent)"
                fillOpacity="0.07"
              />
              <path d="M24 23l3-5h10l3 5" />
              <circle cx="32" cy="34" r="7" />
              <circle cx="32" cy="34" r="3" strokeWidth="0.9" />
            </>
          ) : kind === "notebook" ? (
            <>
              <rect
                x="18"
                y="17"
                width="28"
                height="30"
                rx="2"
                fill="var(--travel-accent)"
                fillOpacity="0.07"
              />
              <path d="M24 17v30M29 25h11M29 32h11M29 39h8" strokeWidth="1" />
            </>
          ) : (
            <>
              <rect
                x="19"
                y="16"
                width="26"
                height="32"
                rx="2.5"
                fill="var(--travel-accent)"
                fillOpacity="0.07"
              />
              <circle cx="32" cy="29" r="6" />
              <path d="M25 40h14" strokeWidth="1" />
            </>
          )}
        </g>
      </svg>
    </span>
  );
}
