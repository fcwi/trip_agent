import { SceneFrame, SnowPine, Snowflakes } from "./ScenePrimitives.jsx";

export default function KaruizawaSnow() {
  return (
    <SceneFrame id="karuizawa-snow">
      <path
        d="M0 213 203 36l52 9L441 210l98-81 101 83v92H0Z"
        fill="var(--journal-snow, var(--travel-surface))"
      />
      <path
        d="m159 77 44-41 52 9 54 47-42-8-31 12-27-20-26 12Z"
        fill="var(--journal-blue)"
      />
      <path
        d="M0 231q132-25 276 1t364-11v83H0Z"
        fill="var(--journal-snow, var(--travel-surface))"
      />
      <SnowPine x={91} y={136} scale={0.9} />
      <SnowPine x={153} y={151} scale={0.7} />
      <SnowPine x={543} y={110} scale={1.2} />
      <SnowPine x={596} y={149} scale={0.8} />
      <path d="M354 214v-78h134v78Z" fill="var(--journal-pink)" />
      <path
        d="m340 141 80-61 82 61Z"
        fill="var(--journal-snow, var(--travel-surface))"
      />
      <path
        d="M409 214v-40h26v40m-65-57h23v23h-23m68-23h23v23h-23"
        fill="var(--journal-yellow)"
      />
      <path d="M384 96V72h17v11" />
      <path
        d="M170 257h335m-325 10h314m-300-10v10m35-10v10m35-10v10m35-10v10m35-10v10m35-10v10m35-10v10m35-10v10m35-10v10"
        strokeWidth="2"
      />
      <path
        d="M206 207q0-13 14-13h201l23 25v27H206Z"
        fill="var(--journal-blue)"
      />
      <path
        d="M218 203h25v20h-25m35-20h25v20h-25m35-20h25v20h-25m35-20h25v20h-25m35-20h25v20h-25m34-20 18 20h-18Z"
        fill="var(--journal-yellow)"
      />
      <path d="M208 232h232" />
      <circle cx="236" cy="247" r="8" fill="var(--travel-surface)" />
      <circle cx="401" cy="247" r="8" fill="var(--travel-surface)" />
      <circle
        cx="103"
        cy="261"
        r="19"
        fill="var(--journal-snow, var(--travel-surface))"
      />
      <circle
        cx="103"
        cy="234"
        r="13"
        fill="var(--journal-snow, var(--travel-surface))"
      />
      <path d="M90 233h26m-22 14 20 3m-14-18h1m8 0h1m-10 7 5-2m-21 21-12-9m50 9 11-9" />
      <path d="M94 224v-10h19v11" fill="var(--journal-pink)" />
      <Snowflakes />
    </SceneFrame>
  );
}
