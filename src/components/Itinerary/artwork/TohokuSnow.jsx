import {
  SceneFrame,
  SnowPine,
  Snowflakes,
  SceneCoach,
} from "./ScenePrimitives.jsx";
import { Windows } from "./DailyScenePrimitives.jsx";

export default function TohokuSnow() {
  return (
    <SceneFrame id="tohoku-snow">
      <g className="journal-art-distance">
        <path
          d="M0 222 126 48l94 104L312 20l149 193 69-80 110 87v84H0Z"
          fill="var(--journal-snow, var(--travel-surface))"
        />
        <path
          d="m92 95 34-47 41 59-36-12-18 12Zm179-15 41-60 54 70-31-8-23 14-18-19Z"
          fill="var(--journal-blue)"
        />
      </g>
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
      <path
        d="m148 122 17 27m120-42-25 53m70-59 29 50m-135 34 23-22m117 41 21-18"
        strokeWidth=".9"
        opacity=".4"
      />
      <path d="M425 222v-65h95v65" fill="var(--journal-yellow)" />
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
        d="M424 170h97m-97 28h97m-90-36h82m-83 42h82m-86 13h88m-57-54v35m31-35v35"
        strokeWidth=".9"
      />
      <Windows x={434} y={173} columns={5} rows={1} size={10} step={16} />
      <path
        d="m416 170 56-38 54 38m-85-24 8 9m16-22 8 8m15-3 8 8"
        strokeWidth=".8"
        opacity=".6"
      />
      <path
        d="M426 225h96m-88 5h80m-68 5h55m-93-23v-30m-5 0h10v-12h-10Z"
        fill="var(--journal-pink)"
        strokeWidth="1"
      />
      <path
        d="M0 267q171-22 340-2t300-1"
        strokeWidth="12"
        stroke="var(--journal-blue)"
        opacity="0.5"
      />
      <ellipse
        cx="326"
        cy="267"
        rx="97"
        ry="6"
        fill="var(--journal-blue)"
        stroke="none"
        opacity=".18"
      />
      <g transform="translate(251 173) scale(1.8)">
        <SceneCoach />
      </g>
      <g strokeWidth=".9" opacity=".65">
        <path d="M65 284q18-8 38-2m66-14 24-3m211 18 33-1m54-29 36 1M191 93l7 9m-13-4 9-1M541 43l6 7m-8-3 9-1" />
      </g>
      <Snowflakes />
      <g className="journal-art-foreground">
        <path d="M42 298q13-27 8-51m1 28-12-13m12 1 13-15m-15 40-14-6m519 21q-10-21-4-43m-1 23 13-14m-13 3-9-10" />
        <path
          d="M36 299q17-7 38-2m467 4q18-8 41-2"
          strokeWidth=".8"
          opacity=".5"
        />
      </g>
    </SceneFrame>
  );
}
