/* Small, original keepsakes drawn in the journal's existing ink and paper. */
export function TravelDoodle({ kind }) {
  return (
    <svg viewBox="0 0 88 88" fill="none" aria-hidden="true" focusable="false">
      <g
        stroke="var(--journal-ink)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {kind === "suitcase" ? (
          <>
            <path d="M32 21v-8q12-7 24 0v8" />
            <rect
              x="18"
              y="21"
              width="52"
              height="52"
              rx="12"
              fill="var(--journal-pink)"
            />
            <path d="M29 23v48m30-48v48M18 39h52" />
            <rect
              x="35"
              y="42"
              width="18"
              height="16"
              rx="3"
              fill="var(--journal-yellow)"
              transform="rotate(-9 44 50)"
            />
            <path d="m39 53 5-6 5 5M27 74v4m34-4v4" />
          </>
        ) : kind === "camera" ? (
          <>
            <path d="M24 29 30 19h23l6 10" fill="var(--journal-yellow)" />
            <rect
              x="12"
              y="29"
              width="64"
              height="43"
              rx="12"
              fill="var(--journal-blue)"
            />
            <circle cx="43" cy="50" r="15" fill="var(--travel-surface)" />
            <circle cx="43" cy="50" r="9" fill="var(--journal-green)" />
            <path d="M39 45q4-4 8 0M63 38h5M19 24l-3-5m52 3 4-5" />
          </>
        ) : kind === "mug" ? (
          <>
            <path d="M25 27q-7-7 0-14m16 14q-7-7 0-14m16 14q-7-7 0-14" />
            <path d="M63 38h7q18 12-7 22" fill="var(--journal-yellow)" />
            <path d="M18 34h46v29q-23 19-46 0Z" fill="var(--journal-yellow)" />
            <ellipse
              cx="41"
              cy="34"
              rx="23"
              ry="5"
              fill="var(--travel-surface)"
            />
            <path d="m34 53 6 6 10-13M15 77h55" />
          </>
        ) : kind === "boots" ? (
          <>
            <path
              d="M20 18h25v33l20 6q9 5 8 17H17V51Z"
              fill="var(--journal-green)"
            />
            <path
              d="M17 67h55v9H17ZM18 17h29v10H18Z"
              fill="var(--travel-surface)"
            />
            <path d="m31 34 14 4m-14 5 14 4m-14 5 14 4M61 14v13m-6-10 12 7m-12 0 12-7" />
          </>
        ) : kind === "bag" ? (
          <>
            <path d="M29 30V21q15-21 30 0v9" />
            <path d="M19 29h50l5 47H14Z" fill="var(--journal-green)" />
            <path d="M28 35v7m32-7v7M20 69l7 7h39" />
            <path
              d="m44 43 4 9 10 1-8 7 2 10-8-5-9 5 2-10-8-7 11-1Z"
              fill="var(--journal-yellow)"
            />
          </>
        ) : (
          <>
            <path
              d="M12 22h64v15q-13 7 0 14v15H12V51q13-7 0-14Z"
              fill="var(--journal-yellow)"
              transform="rotate(-8 44 44)"
            />
            <path d="M56 23v42" strokeDasharray="3 5" />
            <path
              d="m24 45 9-3 2-11 4-1 1 10 9-2 2 4-11 5-2 9-4 1-1-8-7 2Z"
              fill="var(--journal-pink)"
            />
            <path d="M17 77h34m14-65h10m-5-5v10" strokeWidth="1.4" />
          </>
        )}
      </g>
    </svg>
  );
}

export function DayDoodles({ title = "", season = "summer" }) {
  const kinds = /樹冰|阿仁|纜車/.test(title)
    ? ["boots", "mug"]
    : /銀山|角館|古民家/.test(title)
      ? ["camera", "ticket"]
      : /草莓|採果/.test(title)
        ? ["camera", "mug"]
        : /松島|海雲台|廣安|購物/.test(title)
          ? ["bag", "ticket"]
          : season === "winter"
            ? ["suitcase", "mug"]
            : ["camera", "ticket"];
  return (
    <div className="journal-doodle-pair" aria-hidden="true">
      {kinds.map((kind) => (
        <TravelDoodle key={kind} kind={kind} />
      ))}
    </div>
  );
}
