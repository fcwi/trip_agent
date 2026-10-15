export function SceneFrame({ id, children }) {
  return (
    <svg
      className="journal-illustration"
      data-artwork={id}
      viewBox="32 -8 576 312"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <g
        stroke="var(--journal-ink)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {children}
      </g>
    </svg>
  );
}

export function SnowPine({ x, y, scale = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path
        d="M0 0 19 30h-8l17 26H14l20 26h-68l20-26h-14l17-26h-8Z"
        fill="var(--journal-green)"
      />
      <path
        d="m0 0 10 17-10-4-10 4Zm-12 34 12-5 12 5m-31 25 19-6 19 6"
        fill="var(--journal-snow, var(--travel-surface))"
      />
      <path d="M0 82v13" />
    </g>
  );
}

export function Snowflakes() {
  return (
    <g strokeWidth="1.5" opacity="0.75">
      {[
        [94, 45],
        [212, 22],
        [420, 40],
        [546, 78],
        [381, 110],
        [159, 121],
      ].map(([x, y]) => (
        <path key={`${x}-${y}`} d={`M${x - 4} ${y}h8m-4-4v8`} />
      ))}
      <path
        d="M96 269h48m44 14h25m204-16h36m64 15h24"
        stroke="var(--travel-surface)"
      />
    </g>
  );
}

export function SceneCoach() {
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
      <path
        d="M13 18h40v15H13ZM59 18h7l5 15H59Z"
        fill="var(--journal-yellow)"
      />
      <path d="M26 18v15m14-15v15M8 39h47m16-1h4" />
      <circle cx="21" cy="46" r="7" fill="var(--travel-surface)" />
      <circle cx="61" cy="46" r="7" fill="var(--travel-surface)" />
      <circle cx="21" cy="46" r="2" fill="var(--journal-ink)" stroke="none" />
      <circle cx="61" cy="46" r="2" fill="var(--journal-ink)" stroke="none" />
    </>
  );
}
