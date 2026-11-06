export default function NightSky({ compact = false }) {
  return (
    <g
      data-night-sky="true"
      stroke="var(--journal-art-ink)"
      strokeWidth={compact ? 1 : 1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <g
        transform={
          compact ? "translate(145 16) scale(.48)" : "translate(495 12)"
        }
      >
        <path
          d="M35 5C13 0 0 18 6 36c7 23 33 25 47 9C30 51 18 22 35 5Z"
          fill="var(--journal-window)"
        />
      </g>
      <g stroke="var(--journal-window)" fill="var(--journal-window)">
        {(compact
          ? [
              [30, 29],
              [116, 18],
              [181, 65],
            ]
          : [
              [80, 22],
              [207, 17],
              [383, 38],
              [573, 85],
              [451, 18],
            ]
        ).map(([x, y]) => (
          <path key={x} d={`M${x} ${y - 3}q0 3 3 3-3 0-3 3 0-3-3-3 3 0 3-3Z`} />
        ))}
      </g>
    </g>
  );
}
