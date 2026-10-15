import { paint as p } from "./artPalette.js";
import {
  Study,
  Wash,
  Pine,
  Windows,
  BareTree,
  Train,
  House,
  Ripples,
} from "./DailyScenePrimitives.jsx";

export function AsamaArrival() {
  return (
    <Study id="asama-arrival">
      <Wash />
      <path d="M10 128 82 42l17-4 83 91v53H10Z" fill={p.snow} />
      <path
        d="m63 65 19-23 17-4 30 33-18-6-15 8-14-9-12 6Z"
        fill={p.blue}
        strokeWidth=".9"
      />
      <Pine x={31} y={85} scale={0.7} />
      <Pine x={167} y={91} scale={0.6} />
      <House x={103} y={83} scale={0.75} snow />
      <Train x={25} y={135} express />
      <path d="M36 179h26m51 7h38M135 64h8m-4-4v8" strokeWidth=".8" />
    </Study>
  );
}

export function SnowPlay() {
  return (
    <Study id="karuizawa-snow-play">
      <Wash color={p.pink} />
      <path d="M10 129q48-61 101-18t79 5v68H10Z" fill={p.snow} />
      <Pine x={40} y={51} scale={0.85} />
      <Pine x={164} y={65} scale={0.65} />
      <House x={86} y={70} scale={0.75} snow color={p.gold} />
      <g transform="rotate(-13 74 159)">
        <path
          d="M44 158h63m-60 7h58q15 0 14-9m-67-12v20m44-20v20m-50-20h60"
          strokeWidth="2"
        />
        <path d="M51 148h48m-43-5v5m10-5v5m10-5v5m10-5v5" strokeWidth="1" />
      </g>
      <circle cx="145" cy="154" r="19" fill={p.snow} />
      <circle cx="145" cy="128" r="13" fill={p.snow} />
      <path d="M132 124h26m-21-1v-10h16v10m-16 18 17 3m-4-1v10" fill={p.pink} />
      <path d="m140 128 1 0m9 0h1m-7 5 6 2m-7 18h1m-1 7h1m-18-10-12-8m50 8 9-9" />
      <path d="M20 179q32-6 64 0m45 5h33" strokeWidth=".8" />
    </Study>
  );
}

export function UenoMarket() {
  return (
    <Study id="ueno-market">
      <Wash color={p.gold} />
      <path d="M15 73h55v94H15Zm118-17h51v111h-51Z" fill={p.pink} />
      <Windows x={22} y={81} columns={3} rows={2} size={7} step={14} />
      <Windows x={139} y={66} columns={3} rows={3} size={7} step={14} />
      <path d="M10 116h65v13H10Zm118 0h60v13h-60Z" fill={p.green} />
      <path
        d="M21 117v12m11-12v12m11-12v12m11-12v12m11-12v12m75-12v12m12-12v12m12-12v12m12-12v12"
        strokeWidth=".8"
      />
      <path
        d="M73 84h56v15H73Zm-1 0V65m58 19V65m-50 34v64m43-64v64"
        fill={p.gold}
      />
      <path d="M80 91h42m-34-4v8m12-8v8m12-8v8" strokeWidth=".9" />
      <path
        d="m83 182 17-74 18 74m-99-22h44v-24H19Zm119 0h39v-24h-39Z"
        fill={p.paper}
      />
      {[26, 40, 54, 145, 159, 171].map((x) => (
        <circle key={x} cx={x} cy="147" r="3" fill={p.gold} />
      ))}
      <path d="m86 164 22 1m-24 9h27M23 172h33m87 2h31" strokeWidth=".8" />
    </Study>
  );
}

export function RoppongiLights() {
  return (
    <Study id="roppongi-lights">
      <Wash color={p.blue} />
      <path
        d="M19 124V68h27v56m6 0V40h34v84m50 0V55h41v69"
        fill={p.green}
        opacity=".6"
      />
      <path
        d="m98 131 16-92 18 92m-28-27h22m-19-19h15m-12-18h8m-4-28V27m-14 104h32"
        fill={p.pink}
      />
      <path
        d="m105 119 20-16m-16 0 14-18m-13 0 10-17m-15 51 23 12m-21-28 16 16"
        strokeWidth=".8"
      />
      <Windows x={58} y={49} columns={2} rows={4} size={6} step={12} />
      <path d="M13 166q85-31 174 0v19H13Z" fill={p.paper} />
      <BareTree x={39} y={168} scale={0.8} lights />
      <BareTree x={166} y={165} scale={0.8} lights />
      {[
        [82, 143],
        [98, 154],
        [119, 146],
        [135, 167],
        [64, 176],
      ].map(([x, y]) => (
        <g key={x} fill={p.gold} strokeWidth=".6">
          <path d={`M${x} ${y - 5}q7 5 0 12-7-7 0-12Z`} />
          <path d={`M${x} ${y + 7}v6`} />
        </g>
      ))}
      <path
        d="m91 24 2-4 2 4 4 2-4 2-2 4-2-4-4-2Z"
        fill={p.gold}
        strokeWidth=".7"
      />
    </Study>
  );
}

export function OdaibaWaterfront() {
  return (
    <Study id="odaiba-waterfront">
      <Wash />
      <path d="M14 124h173v60H14Z" fill={p.blue} />
      <path
        d="M17 111h167m-139 0V65m105 46V65M40 65h10m95 0h10M20 96q30-45 77 0 30-45 83-3m-133-21v38m15-27v27m16-17v17m17-12v12m22-19v19m16-29v29m18-38v38m15-24v24"
        strokeWidth="1.1"
      />
      <path
        d="M31 168v-31h34v31Zm4-31 13-12 13 12m-22 13h18m-14 0v18m10-18v18"
        fill={p.gold}
      />
      <path d="M117 168v-34h57v34Zm8-34v-28h40v28" fill={p.pink} />
      <circle cx="145" cy="113" r="13" fill={p.paper} />
      <path d="M133 113h24m-12-12v24" strokeWidth=".9" />
      <Windows x={125} y={143} columns={3} rows={1} size={8} step={17} />
      <Ripples y={178} />
      <path
        d="M26 45q6-6 12 0 6-6 12 0m118-9q5-5 10 0 5-5 10 0"
        strokeWidth=".8"
      />
    </Study>
  );
}

export function NaritaDeparture() {
  return (
    <Study id="narita-departure">
      <Wash color={p.gold} />
      <path d="M17 111h167v65H17Z" fill={p.blue} />
      <path
        d="M14 111h173m-156 0v65m29-65v65m29-65v65m29-65v65m29-65v65m26-65v65M18 143h165"
        strokeWidth="1"
      />
      <path
        d="m43 63 42-7 12-28 8-1-1 28 43 6 5 6-48 1-2 17-6 1-9-18-38 1Z"
        fill={p.paper}
      />
      <path d="M154 105V81h9v24m-13-24h17V70h-17Zm-1-11h19" fill={p.pink} />
      <g transform="translate(41 132) rotate(-7)">
        <rect width="33" height="43" rx="6" fill={p.pink} />
        <path d="M10 0v-7h13v7M7 8v28m20-28v28M6 43v4m21-4v4" strokeWidth="1" />
        <rect x="11" y="12" width="11" height="10" rx="2" fill={p.gold} />
      </g>
      <path d="M94 177h64m-55 5h44" strokeWidth=".8" />
    </Study>
  );
}
