import { paint as p } from "./artPalette.js";
import {
  Study,
  Wash,
  Pine,
  Windows,
  Ripples,
  BareTree,
  Train,
  House,
} from "./DailyScenePrimitives.jsx";

export function TendoEvening() {
  return (
    <Study id="tendo-evening">
      <Wash color={p.pink} />
      <path d="M12 128 53 62l29 35 35-51 68 81v51H12Z" fill={p.snow} />
      <path
        d="m43 77 10-15 13 17-11-4-5 5m52-10 15-24 24 29-16-5-8 6Z"
        fill={p.blue}
        strokeWidth=".8"
      />
      <Pine x={28} y={90} scale={0.55} />
      <House x={88} y={79} scale={1.3} snow color={p.gold} />
      <path d="M113 73q-8-8 0-15t0-15m14 27q-6-8 1-15" strokeWidth="1" />
      <path d="M15 158q37-18 83-1t87 1v27H15Z" fill={p.snow} />
      <ellipse cx="62" cy="165" rx="34" ry="12" fill={p.blue} />
      <path
        d="M31 165q30 11 61 0m-44-12q-7-7 0-14m13 12q-6-9 1-17m12 19q-5-6 1-12"
        strokeWidth=".9"
      />
      <path d="m164 45 5-3m-7 17 8 2m-11-32 3-6" strokeWidth=".8" />
    </Study>
  );
}

export function GinzanStreet() {
  return (
    <Study id="ginzan-street">
      <Wash />
      <path d="M79 107h42l22 79H57Z" fill={p.blue} />
      <path d="M17 76h58v85H17Zm109-19h57v103h-57Z" fill={p.pink} />
      <path d="m10 76 37-28 35 28Zm109-19 35-29 36 29Z" fill={p.snow} />
      <path
        d="M20 82h53m56-18h51M19 119h55m55-16h51M21 145h48m61-17h47"
        strokeWidth=".9"
      />
      <Windows x={25} y={89} columns={3} rows={2} size={8} step={15} />
      <Windows x={135} y={73} columns={3} rows={3} size={8} step={15} />
      <path
        d="M62 151q38-21 76 0v7H62Zm2-1v-11m72 11v-11m-72 0q36-20 72 0m-52-8v14m16-17v15m16-12v14"
        fill={p.gold}
      />
      <path
        d="M89 112v-34m-7 0h14l-2-11h-10Zm61 91v-32m-6-1h12l-2-10h-8Z"
        fill={p.gold}
      />
      <path d="M20 169h24m112 3h19m-83 0h16m-7 7h18" strokeWidth=".8" />
      <BareTree x={22} y={179} scale={0.44} />
    </Study>
  );
}

export function MoriyoshiRime() {
  return (
    <Study id="moriyoshi-rime">
      <Wash />
      <path d="m10 122 74-88 42 47 27-25 39 64v65H10Z" fill={p.snow} />
      <path
        d="m64 59 20-25 24 27-16-6-11 6-7-6Z"
        fill={p.blue}
        strokeWidth=".8"
      />
      <path d="M16 45q81 31 171 0m-42 13v16" />
      <rect x="125" y="74" width="39" height="33" rx="9" fill={p.pink} />
      <path d="M131 81h10v12h-10Zm16 0h10v12h-10Z" fill={p.gold} />
      <path d="M129 99h31m-24-25v-4h18v4" strokeWidth=".8" />
      {[
        [32, 96, 1],
        [71, 112, 0.75],
        [169, 117, 0.72],
      ].map(([x, y, s]) => (
        <g key={x} transform={`translate(${x} ${y}) scale(${s})`}>
          <path
            d="M0 0q-12 0-10 13-14 2-10 15-13 9-6 19-6 14 11 15h28q14-5 6-17 9-9-3-17 5-11-7-14Q11 1 0 0Z"
            fill={p.snow}
          />
          <path
            d="M0 14v51m-13-36 13 7 10-9m-25 22 15 5 15-7"
            strokeWidth=".7"
            opacity=".55"
          />
        </g>
      ))}
      <g transform="translate(23 146) scale(.8)">
        <Train x={0} y={0} color={p.pink} />
      </g>
      <path d="m22 72 2 2m91-50 2 2m63 9 2 2" strokeWidth="2" />
    </Study>
  );
}

export function GeibikeiBoat() {
  return (
    <Study id="geibikei-boat">
      <Wash color={p.green} />
      <path
        d="M12 150V49l31-22 14 29 12 82m64 4 9-88 23-23 23 19v102"
        fill={p.snow}
      />
      <path
        d="m26 50 5 67m14-64 4 42m110-47-8 65m23-53-4 62"
        strokeWidth=".8"
        opacity=".6"
      />
      <Pine x={40} y={25} scale={0.4} />
      <Pine x={167} y={22} scale={0.35} />
      <path d="M13 148q51-38 88-15t87 10v43H13Z" fill={p.blue} />
      <path d="m65 150 12 16h63l19-16Zm22-1v-15h39v15" fill={p.gold} />
      <path
        d="m81 134 12-12h32l11 12Zm55 2 12-31m-8 26h-7m-43 22h37m-38 5h43"
        fill={p.paper}
        strokeWidth="1"
      />
      <Ripples y={174} />
      <g transform="translate(21 120) rotate(-16)">
        <path d="M0 0q15-9 29 0 0 18-14 26Q1 18 0 0Z" fill={p.pink} />
        <path d="m15 1-11-9h9l3-8 4 9h8Z" fill={p.green} />
        <path d="m7 7 1 2m12-2 1 2m-7 7 1 2" strokeWidth=".9" />
      </g>
    </Study>
  );
}

export function MatsushimaBay() {
  return (
    <Study id="matsushima-bay">
      <Wash />
      <path d="M11 108q46-10 89 0t89 0v77H11Z" fill={p.blue} />
      <path
        d="M16 133q22-21 46 0l-4 12H20Zm112-29q21-16 40 1l-4 10h-30Z"
        fill={p.green}
      />
      <g strokeWidth="1">
        <path d="M39 129v-25m0 11-14-7m14 0 18-9" />
        <path
          d="M20 103q4-12 17-8 9-12 22-1 13 0 10 9Zm121-1v-17m-14 0q6-13 15-8 14-6 18 8Z"
          fill={p.green}
        />
      </g>
      <path
        d="M90 120V77h32v43M85 77l21-19 22 19Zm5 24h32M84 121h44"
        fill={p.gold}
      />
      <Windows x={95} y={83} columns={2} rows={1} size={7} step={14} />
      <path d="M69 145h51m-48 0v12m14-12v10m14-10v10m14-10v13" />
      <path
        d="m137 151 8 12h28l10-12Zm10-1v-14h23v14m-19-9h6m4 0h5"
        fill={p.paper}
      />
      <Ripples y={170} />
      <path
        d="M32 53q6-7 12 0 6-7 12 0m92-13q6-6 12 0 6-6 12 0"
        strokeWidth=".9"
      />
    </Study>
  );
}
