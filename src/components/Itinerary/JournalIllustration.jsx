/* Original, code-native drawings for the travel journal. */
export function DayStamp({ title = "" }) {
  const kind = /樹冰|阿仁|纜車|膠囊/.test(title)
    ? "cable"
    : /草莓|採果/.test(title)
      ? "fruit"
      : /溫泉|SPA/.test(title)
        ? "bath"
        : /空港|機場/.test(title)
          ? "plane"
          : /松島|海雲台|廣安|遊船/.test(title)
            ? "boat"
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
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="63" cy="16" r="7" fill="var(--journal-yellow)" />
        <path d="M0 66q20-8 40 0t40 0v14H0Z" fill="var(--journal-blue)" />
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
      </g>
    </svg>
  );
}

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
