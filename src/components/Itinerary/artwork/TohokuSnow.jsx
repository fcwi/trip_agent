import {
  SceneFrame,
  SnowPine,
  Snowflakes,
  SceneCoach,
} from "./ScenePrimitives.jsx";

export default function TohokuSnow() {
  return (
    <SceneFrame id="tohoku-snow">
      <path
        d="M0 222 126 48l94 104L312 20l149 193 69-80 110 87v84H0Z"
        fill="var(--journal-snow, var(--travel-surface))"
      />
      <path
        d="m92 95 34-47 41 59-36-12-18 12Zm179-15 41-60 54 70-31-8-23 14-18-19Z"
        fill="var(--journal-blue)"
      />
      <path
        d="M0 228q136-48 272 4t368-3v75H0Z"
        fill="var(--journal-snow, var(--travel-surface))"
      />
      <SnowPine x={102} y={124} scale={1.05} />
      <SnowPine x={167} y={154} scale={0.75} />
      <SnowPine x={562} y={164} scale={0.7} />
      <path d="M351 60q109 46 240-22M481 64v28" />
      <rect
        x="456"
        y="93"
        width="52"
        height="47"
        rx="13"
        fill="var(--journal-pink)"
      />
      <path
        d="M464 103h13v17h-13Zm22 0h13v17h-13Z"
        fill="var(--journal-yellow)"
      />
      <path d="M425 222v-56h95v56" fill="var(--journal-yellow)" />
      <path
        d="m414 168 58-44 60 44Z"
        fill="var(--journal-snow, var(--travel-surface))"
      />
      <path
        d="M461 222v-32h22v32m-44-45h13v13h-13m53-13h13v13h-13"
        fill="var(--journal-pink)"
      />
      <path d="M454 116q-9-9 0-18m19 16q-9-9 0-18" />
      <path
        d="M0 267q171-22 340-2t300-1"
        strokeWidth="12"
        stroke="var(--journal-blue)"
        opacity="0.5"
      />
      <g transform="translate(251 173) scale(1.8)">
        <SceneCoach />
      </g>
      <Snowflakes />
    </SceneFrame>
  );
}
