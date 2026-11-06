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
          {kind === "suitcase" ? (
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
