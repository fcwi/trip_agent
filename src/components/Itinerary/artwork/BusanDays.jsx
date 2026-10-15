import { paint as p } from "./artPalette.js";
import {
  Study,
  Wash,
  Windows,
  Ripples,
  House,
} from "./DailyScenePrimitives.jsx";

export function SeomyeonKitchen() {
  return (
    <Study id="seomyeon-kitchen">
      <Wash color={p.gold} />
      <path d="M22 65h48v79H22Zm110-24h44v104h-44Z" fill={p.pink} />
      <Windows x={28} y={72} columns={3} rows={3} size={6} step={13} />
      <Windows x={139} y={50} columns={2} rows={5} size={7} step={16} />
      <path d="M78 87V56h43v31Zm-3 0h49v8H75Z" fill={p.green} />
      <path d="M85 65h29m-29 7h21m-20 6h27" strokeWidth=".8" />
      <ellipse cx="96" cy="150" rx="66" ry="25" fill={p.paper} />
      <path d="M48 137q48 20 96 0l-8 26q-40 19-80 0Z" fill={p.blue} />
      <ellipse cx="96" cy="137" rx="48" ry="13" fill={p.gold} />
      <path
        d="m66 134 9 3m7-8 7 5m13-3 9 5m9-6 6 5m-40-18q-7-7 0-14m15 13q-6-8 1-15m15 16q-6-7 0-13"
        strokeWidth="1"
      />
      <path d="m150 159 17-48m-10 50 17-48" strokeWidth="2" />
      <ellipse cx="35" cy="159" rx="10" ry="5" fill={p.pink} />
    </Study>
  );
}

export function CheongsapoCapsule() {
  return (
    <Study id="cheongsapo-capsule">
      <Wash />
      <path d="M11 118q44-16 86 0t91 0v68H11Z" fill={p.blue} />
      <path d="M11 140q45-10 99 21l24 25H11Z" fill={p.green} />
      <path
        d="m138 121 4-46h14l4 46Zm1-46V64h20v11Zm-4-11 14-15 15 15Z"
        fill={p.pink}
      />
      <path d="M142 86h15m-13 12h10m-12 15h15" strokeWidth=".9" />
      <path
        d="M15 96q71-20 113 36m-111-30q67-18 106 35m-86-32v30m47-18v29"
        strokeWidth="2"
      />
      <g transform="translate(43 64) rotate(9)">
        <rect width="47" height="34" rx="11" fill={p.pink} />
        <path d="M7 7h13v13H7Zm20 0h13v13H27Z" fill={p.gold} />
        <path d="M5 27h37m-30 7v4m24-4v4" strokeWidth="1" />
      </g>
      <path d="M25 163q22 1 49 12m-42-6 3 8m13-6 1 8m14-4v7" strokeWidth=".9" />
      <Ripples y={148} />
      <path
        d="M111 39q6-6 12 0 6-6 12 0m25-9q5-5 10 0 5-5 10 0"
        strokeWidth=".8"
      />
    </Study>
  );
}

export function GwangalliNight() {
  return (
    <Study id="gwangalli-night">
      <Wash />
      <path d="M12 122h176v63H12Z" fill={p.blue} />
      <path
        d="M16 115h169M52 114V73m94 41V73m-99 0h10m84 0h10M21 100q32-44 78 0 33-44 79 0m-124-20v34m14-23v23m14-15v15m18-13v13m20-18v18m13-28v28m14-34v34m14-24v24"
        strokeWidth="1.1"
      />
      <path d="M26 166q33-41 71-7t78-2v29H26Z" fill={p.paper} />
      <path
        d="M69 180q-29-12-23-31 10-18 29-3 20-15 30 3 6 19-23 31Z"
        fill={p.green}
      />
      <path
        d="M72 175q-16-10-10-21 10-7 16 0 8-7 16 0 7 10-14 21Z"
        fill={p.blue}
      />
      <circle cx="76" cy="154" r="2" fill={p.paper} />
      <path d="m58 161 9-1m19 0 9 1" strokeWidth=".8" />
      {[
        [71, 39],
        [100, 28],
        [130, 39],
        [86, 57],
        [114, 57],
      ].map(([x, y]) => (
        <g key={x} transform={`translate(${x} ${y})`} strokeWidth=".9">
          <path d="M-5 0H5m-5-4v8m-7-7h4m6 0h4" />
          <circle r="2" fill={p.gold} />
        </g>
      ))}
      <path d="M146 28a10 10 0 1 0 14 14 11 11 0 0 1-14-14Z" fill={p.gold} />
      <Ripples y={134} />
    </Study>
  );
}

export function GamcheonHillside() {
  return (
    <Study id="gamcheon-hillside">
      <Wash color={p.pink} />
      <path d="M11 139q45-86 95-69t83 35v79H11Z" fill={p.green} />
      <House x={81} y={28} scale={0.72} color={p.blue} />
      <House x={32} y={69} scale={0.75} color={p.pink} />
      <House x={119} y={74} scale={0.88} color={p.gold} />
      <House x={66} y={100} scale={1.03} color={p.blue} />
      <path d="M12 181q31-10 47-15l5-12 44 1 6 18 42 9" fill={p.paper} />
      <path
        d="M119 166h20v-6h-20v-6h20v-6h-20v-6h20m-108 8h17m-19 7h20"
        strokeWidth=".9"
      />
      <path d="M27 62q58-47 143 2" strokeWidth=".8" />
      {[40, 62, 86, 110, 134, 156].map((x, i) => (
        <path
          key={x}
          d={`m${x} ${i < 3 ? 50 - i * 5 : 40 + (i - 3) * 5} 3 8 5-9Z`}
          fill={i % 2 ? p.gold : p.pink}
          strokeWidth=".6"
        />
      ))}
      <path
        d="M151 175v-17q0-8 7-8 8 0 8 8v17m-15-17-5-5m20 5 6-7"
        fill={p.pink}
      />
    </Study>
  );
}

export function YeongdoWalk() {
  return (
    <Study id="yeongdo-walk">
      <Wash />
      <path d="M70 104q57-15 118 0v82H70Z" fill={p.blue} />
      <path d="M14 106h55l43 79H14Z" fill={p.paper} />
      <path d="M21 125h55l28 58H21Z" fill={p.gold} />
      <path d="m47 126 33 58m-57-44h61m-56 15h63m-55 15h63" strokeWidth=".8" />
      <House x={16} y={49} scale={0.9} color={p.paper} />
      <House x={69} y={60} scale={0.62} color={p.blue} />
      <path d="M70 123q36 24 48 61m-44-61q36 24 48 61m-38-53v14m15-3v16m12-3v16" />
      <path d="M34 95h20v24H34Zm-3 0 13-10 13 10" fill={p.pink} />
      <path d="M138 142v-23l16 23Zm-16 6h39l-7 10h-24Z" fill={p.paper} />
      <Ripples y={167} />
      <path
        d="M114 60q6-6 12 0 6-6 12 0m13-16q6-6 12 0 6-6 12 0"
        strokeWidth=".8"
      />
    </Study>
  );
}
