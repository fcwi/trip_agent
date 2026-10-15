/* Small original travel studies: quiet washes, fine ink, destination details. */
import { paint } from "./artPalette.js";

export function Study({ id, children }) {
  return (
    <svg
      className="journal-day-stamp"
      data-scene={id}
      viewBox="0 0 200 200"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <g
        stroke="var(--journal-ink)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {children}
      </g>
    </svg>
  );
}

export function Wash({ color = paint.blue }) {
  return (
    <g stroke="none">
      <path
        d="M16 89C9 46 44 16 94 19c54-9 87 21 90 63 12 48-16 88-70 90-58 13-98-19-98-83Z"
        fill={color}
        stroke="none"
        opacity=".13"
      />
      <path
        d="M22 87C16 51 49 28 88 30c44-8 83 14 85 51 7 36-18 64-58 69-52 9-86-14-93-63Z"
        fill={color}
        opacity=".08"
      />
    </g>
  );
}

export function Pine({ x, y, scale = 1, frosted = true }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path
        d="M0 0 12 20H6l15 22H11l17 24h-56l17-24h-10L-6 20h-6Z"
        fill={paint.green}
      />
      {frosted && (
        <path
          d="m-7 13 7-13 7 13-7-3Zm-6 22 13-9 13 9-13-3Zm-8 22 21-10 21 10-21-4Z"
          fill={paint.snow}
          strokeWidth=".8"
        />
      )}
      <path d="M0 62v16m-8-26 8 4 8-4m-5-15-3 3-3-3" strokeWidth=".8" />
    </g>
  );
}

export function Windows({
  x,
  y,
  columns = 3,
  rows = 2,
  size = 9,
  step = 16,
  color = paint.gold,
}) {
  return (
    <g strokeWidth=".9">
      {Array.from({ length: rows * columns }, (_, i) => {
        const left = x + (i % columns) * step;
        const top = y + Math.floor(i / columns) * step;
        return (
          <g key={i}>
            <rect
              x={left}
              y={top}
              width={size}
              height={size + 2}
              fill={color}
            />
            <path
              d={`M${left + size / 2} ${top}v${size + 2}m${-size / 2} -5h${size}`}
            />
          </g>
        );
      })}
    </g>
  );
}

export function Ripples({ y = 161 }) {
  return (
    <g strokeWidth=".8" opacity=".6">
      <path
        d={`M24 ${y}h24m10 8h16m25-12h28m13 10h32M34 ${y + 22}h38m40-1h42`}
      />
    </g>
  );
}

export function BareTree({ x, y, scale = 1, lights = false }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path
        d="M0 0v-78m0 57-18-17-5-24m23 18 20-19 4-15m-24 30-9-21m-9 31-10-3m50-14 12-2"
        strokeWidth="1.3"
      />
      {lights &&
        [-65, -49, -33].map((n, i) => (
          <g key={n} fill={paint.gold} stroke="none">
            <circle cx={i % 2 ? 8 : -8} cy={n} r="2" />
            <circle cx={i % 2 ? -17 : 19} cy={n + 5} r="2" />
          </g>
        ))}
    </g>
  );
}

export function Train({
  x = 32,
  y = 105,
  color = paint.blue,
  express = false,
}) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path
        d={
          express
            ? "M0 0h91q20 2 39 31v7H0Z"
            : "M5 0h111q9 0 9 10v28H0V8q0-8 5-8Z"
        }
        fill={color}
      />
      <path d="M1 29h119m-116 5h113" strokeWidth=".8" />
      {[9, 28, 47, 66, 85].map((n) => (
        <rect
          key={n}
          x={n}
          y="8"
          width="12"
          height="12"
          rx="2"
          fill={paint.paper}
          strokeWidth="1"
        />
      ))}
      <path d="M104 9q9 7 12 14h-12Z" fill={paint.paper} />
      <path d="M21 38v5m78-5v5M-5 45h140m-140 5h140" />
      {[20, 100].map((n) => (
        <circle key={n} cx={n} cy="39" r="4" fill={paint.paper} />
      ))}
    </g>
  );
}

export function House({ x, y, scale = 1, color = paint.pink, snow = false }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <ellipse
        cx="28"
        cy="72"
        rx="31"
        ry="4"
        fill="var(--journal-ink)"
        stroke="none"
        opacity=".08"
      />
      <path d="M0 22h51v48H0Z" fill={color} />
      <path
        d="m-5 24Q10 10 25 0q17 11 31 24Z"
        fill={snow ? paint.snow : paint.gold}
      />
      <path d="M5 24h43m-41 7h37m-38 32h39" strokeWidth=".7" opacity=".65" />
      <Windows x={7} y={34} columns={2} rows={1} step={25} />
      <path d="M21 70V51h12v19m-3-8h1" fill={paint.paper} />
      <path d="M13 11V1h7v4" />
      <path
        d="M2 68q9 1 17 0m16 0 12-1M3 27l1 32m45-30-1 16"
        strokeWidth=".55"
        opacity=".35"
      />
    </g>
  );
}
