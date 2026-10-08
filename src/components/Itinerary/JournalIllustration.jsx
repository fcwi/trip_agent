/* Original, code-native drawings for the travel journal. */
export function JourneyCar({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 56 60"
      fill="none"
      aria-hidden="true"
    >
      <g
        stroke="var(--journal-ink)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M28 3v10" />
        <rect
          x="8"
          y="14"
          width="40"
          height="38"
          rx="12"
          fill="var(--journal-pink)"
        />
        <rect
          x="16"
          y="22"
          width="9"
          height="11"
          rx="3"
          fill="var(--journal-yellow)"
        />
        <rect
          x="31"
          y="22"
          width="9"
          height="11"
          rx="3"
          fill="var(--journal-yellow)"
        />
        <path d="M10 42h36" />
      </g>
    </svg>
  );
}

export default function JournalIllustration({
  tripId = "",
  miniature = false,
  variant = 0,
}) {
  const seaside = tripId.includes("busan");
  return (
    <svg
      className={`journal-illustration ${miniature ? "journal-illustration--mini" : ""}`}
      viewBox="0 0 640 240"
      fill="none"
      aria-hidden="true"
    >
      <g
        stroke="var(--journal-ink)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          d="M0 183Q70 163 143 182T282 185T428 181T640 183V240H0Z"
          fill="var(--journal-blue)"
        />
        <circle cx="544" cy="55" r="29" fill="var(--journal-yellow)" />
        <path d="M544 10V4m0 102v-6m-45-45h-7m104 0h-7m-77-32-5-5m74 74-5-5m0-64 5-5m-74 74 5-5" />
        {seaside ? (
          <>
            <path d="M18 180Q87 128 159 180Z" fill="var(--journal-green)" />
            <path d="M76 158V97h28v61" fill="var(--journal-pink)" />
            <path d="m70 98 20-29 21 29Z" fill="var(--journal-yellow)" />
            <path d="M77 119h25m-25 20h25" />
            <path d="m443 188 22 20h51l19-20Z" fill="var(--journal-pink)" />
            <path d="M479 181v-54l35 54Z" fill="var(--travel-surface)" />
            <path d="M461 181h51" />
          </>
        ) : (
          <>
            <path
              d="m12 180 100-125 81 125 79-151 113 153Z"
              fill="var(--journal-green)"
            />
            <path
              d="m75 101 37-46 30 47-29-10-17 14Z"
              fill="var(--travel-surface)"
            />
            <path
              d="m242 86 30-57 42 57-26-9-15 15-16-15Z"
              fill="var(--travel-surface)"
            />
            <path d="m426 167 51-37 51 37" fill="var(--journal-pink)" />
            <path d="M437 167v42h80v-42" fill="var(--journal-yellow)" />
            <path d="M468 209v-28h20v28" fill="var(--journal-pink)" />
            <path d="M454 117q-9-8 0-16t0-16m21 30q-9-8 0-16t0-16" />
            <path
              d="m361 154 12-34 12 34m-24-12h24m-29 26h34"
              fill="var(--journal-green)"
            />
          </>
        )}
        <path d="M-5 30Q270 125 650 25" />
        <path d="M321 80v26" />
        <rect
          x="296"
          y="107"
          width="50"
          height="49"
          rx="15"
          fill="var(--journal-pink)"
          transform={`rotate(${variant % 2 ? -4 : 3} 321 132)`}
        />
        <rect
          x="305"
          y="117"
          width="12"
          height="15"
          rx="3"
          fill="var(--journal-yellow)"
        />
        <rect
          x="325"
          y="117"
          width="12"
          height="15"
          rx="3"
          fill="var(--journal-yellow)"
        />
        <path d="M298 143h45M199 60q8-9 16 0 8-9 16 0m-48-19q7-8 14 0 7-8 14 0" />
        <path
          d="M49 217h22m129-8h22m193 16h18m169-14h18"
          stroke="var(--travel-surface)"
        />
      </g>
    </svg>
  );
}
