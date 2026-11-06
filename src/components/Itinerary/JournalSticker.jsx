// Original die-cut objects from the trip's real rituals, never UI controls.
export default function JournalSticker({ kind = "passport", className = "" }) {
  return (
    <span
      className={`journal-paper-sticker ${className}`}
      data-sticker={kind}
      aria-hidden="true"
    >
      <svg viewBox="0 0 64 64" fill="none" focusable="false">
        <g
          stroke="var(--journal-art-ink)"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {kind === "ticket" ? (
            <>
              <path
                d="m8 17 46-2 2 11q-7 3 .5 9L58 47 10 50 9 38q6-4-.5-8Z"
                fill="var(--journal-snow)"
              />
              <path d="m39 17 2 30" strokeDasharray="2 4" />
              <path d="m15 23 17-.7m-17 18 13-.5" strokeWidth="1" />
              <path
                d="m16 31 7 1 4-6 3 .5-2 7 5 3-1 2-6-1-4 4-2-1 2-5-6-2Z"
                fill="var(--journal-blue)"
              />
              <path d="m45 23 5-.3m-4 5 5-.2m-4 11 5-.3" strokeWidth="1" />
            </>
          ) : kind === "meal" ? (
            <>
              <ellipse
                cx="31"
                cy="51"
                rx="23"
                ry="3"
                fill="var(--journal-snow)"
                stroke="none"
              />
              <path
                d="M10 28q2 22 21 23 20-2 23-23Z"
                fill="var(--journal-blue)"
              />
              <ellipse
                cx="32"
                cy="28"
                rx="22"
                ry="7"
                fill="var(--journal-yellow)"
              />
              <path
                d="m17 29 8-2 8 3 10-3m-28 9q16 7 35 0m-28 14v4h20v-4"
                strokeWidth="1"
              />
              <path d="m39 22 14-16m-9 19L59 9" />
              <path d="M20 19q-4-4 0-8m9 9q-4-5 0-10" strokeWidth="1" />
            </>
          ) : kind === "onsen" ? (
            <>
              <path
                d="M12 37q20-9 41 0l-2 14q-18 9-37 0Z"
                fill="var(--journal-blue)"
              />
              <ellipse
                cx="32"
                cy="37"
                rx="20"
                ry="7"
                fill="var(--journal-snow)"
              />
              <path
                d="M21 28q-6-5 0-11t0-10m11 20q-6-5 0-11t0-10m11 22q-6-5 0-11t0-10"
                strokeWidth="1.3"
              />
              <path d="m8 47 17-3 4 12-18 3Z" fill="var(--journal-pink)" />
              <path d="m12 49 12-2m-11 6 12-2m8-6q8 2 14-1" strokeWidth=".8" />
            </>
          ) : kind === "shopping" ? (
            <>
              <path
                d="m13 22 36-1 5 34q-22 3-44 0Z"
                fill="var(--journal-pink)"
              />
              <path d="M23 26V15q9-13 18 0v11" />
              <path
                d="m16 25-2 27 35 1m-9-29 3 27"
                strokeWidth=".8"
                opacity=".5"
              />
              <path d="m25 38 6-5 7 5-3 8-8-1Z" fill="var(--journal-yellow)" />
            </>
          ) : kind === "suitcase" ? (
            <>
              <path d="M24 16v-5q8-6 16 0v5" />
              <path
                d="M16 17q-5 0-5 6v28q1 5 6 5h31q5-1 5-6V23q0-6-6-6Z"
                fill="var(--journal-yellow)"
              />
              <path d="m21 18-1 36m23-36 1 36M9 30h46m-39 27v3m31-3v3" />
              <path d="m28 33 12-3 3 12-12 3Z" fill="var(--journal-pink)" />
              <path d="m30 24 6-1 1 5-6 1Z" fill="var(--journal-blue)" />
            </>
          ) : kind === "camera" ? (
            <>
              <path
                d="m17 21 4-8h19l4 8m-31 1h38q6 0 6 6v22q0 5-6 5H12q-6 0-6-6V28q0-6 7-6Z"
                fill="var(--journal-blue)"
              />
              <circle cx="32" cy="38" r="13" fill="var(--journal-snow)" />
              <circle cx="32" cy="38" r="8" fill="var(--journal-pink)" />
              <path d="M47 28h5m-40 1h7m5 9q0-6 6-8M9 20q-4-7-5-10m54 11 4-8" />
            </>
          ) : kind === "notebook" ? (
            <>
              <path
                d="M15 8h35q4 0 4 5v43H14q-5 0-5-6V14q0-6 6-6Z"
                fill="var(--journal-pink)"
              />
              <path d="M18 8v48m-9-38h13m-13 10h13m-13 10h13m-13 10h13" />
              <path d="m29 20 15 1-1 17-15-1Z" fill="var(--journal-snow)" />
              <path d="m30 31 4-6 4 5 3-2m-13 19 18 1" />
            </>
          ) : (
            <>
              <path
                d="m14 7 34 3q5 0 4 6l-3 41-37-3q-5 0-4-6l3-36q0-5 3-5Z"
                fill="var(--journal-green)"
              />
              <ellipse
                cx="30"
                cy="29"
                rx="11"
                ry="12"
                fill="var(--journal-snow)"
              />
              <path d="m19 28 22 2m-11-13q-7 10-2 24m3-24q8 12 0 24m-13 7 25 2m-32-4 3-30" />
            </>
          )}
        </g>
      </svg>
    </span>
  );
}
