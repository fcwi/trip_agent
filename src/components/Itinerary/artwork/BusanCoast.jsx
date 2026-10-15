import { SceneFrame } from "./ScenePrimitives.jsx";
import { House } from "./DailyScenePrimitives.jsx";

export default function BusanCoast() {
  return (
    <SceneFrame id="busan-coast">
      <circle cx="506" cy="46" r="25" fill="var(--journal-yellow)" />
      <path d="M506 10V3m-35 43h-8m86 0h-8m-60-27-5-5m60 60-5-5" />
      <path d="M0 181q74-99 158-15t170 8v45H0Z" fill="var(--journal-green)" />
      <House x={198} y={105} scale={0.65} color="var(--journal-yellow)" />
      <House x={43} y={144} scale={0.55} color="var(--journal-blue)" />
      <path
        d="M66 153v-47h35v47m8 5v-73h37v73m8 14v-50h37v50"
        fill="var(--journal-pink)"
      />
      <path
        d="m61 106 23-18 23 18m-3-21 23-19 24 19m-2 37 23-18 24 18"
        fill="var(--journal-yellow)"
      />
      <path
        d="M76 117h12v13H76m44-19h12v13h-12m45 27h12v13h-12"
        fill="var(--travel-surface)"
      />
      <path d="M0 201q148-15 320 0t320-1v104H0Z" fill="var(--journal-blue)" />
      <path d="M278 175h312M330 176V93m181 83V93m-192 0h22m159 0h22M289 148q42-83 130-5 54-71 122-12l42 25m-244-51v70m25-39v39m25-27v27m25-29v29m49-30v30m25-40v40m25-67v67m25-54v54m25-29v29" />
      <path
        d="M278 181h312m-302-6v6m17-6v6m17-6v6m17-6v6m17-6v6m17-6v6m17-6v6m17-6v6m17-6v6m17-6v6m17-6v6m17-6v6m17-6v6m17-6v6m17-6v6m17-6v6m17-6v6m17-6v6"
        strokeWidth=".7"
      />
      <path
        d="M70 137h28m12 7h35m12 15h31M82 117v13m43-19v13m46 27v13m-104-52h34m9-22h35m10 37h34"
        strokeWidth=".8"
      />
      <path d="M0 276q142-46 280-3t360-1v32H0Z" fill="var(--journal-yellow)" />
      <path d="M103 260v-45m-38 0q38-53 76 0Z" fill="var(--journal-pink)" />
      <path d="M103 179q-12 18-13 36m13-36q12 18 13 36M70 265h57" />
      <path d="m463 231 17 20h63l18-20Z" fill="var(--journal-pink)" />
      <path d="M509 223v-54l34 54Z" fill="var(--travel-surface)" />
      <path
        d="M205 208h153q17 0 17 17v27H195v-32q0-12 10-12Z"
        fill="var(--journal-green)"
      />
      <path
        d="M206 216h24v17h-24m33-17h24v17h-24m33-17h24v17h-24m33-17h24v17h-24"
        fill="var(--travel-surface)"
      />
      <circle cx="221" cy="254" r="7" fill="var(--travel-surface)" />
      <circle cx="349" cy="254" r="7" fill="var(--travel-surface)" />
      <path
        d="M193 264q88-8 187 2m-182 5q88-8 187 2m-174-8v5m23-6v5m24-6v5m25-5v5m25-4v5m25-4v5m25-4v5"
        strokeWidth=".9"
      />
      <path
        d="M484 242h57m-43-29h30m-38 36h46m-410 31 32-3m265-38h21m-47 22h26m135-47h28"
        strokeWidth=".8"
        opacity=".6"
      />
      <path
        d="M157 72q8-9 16 0 8-9 16 0m-16-23q7-8 14 0 7-8 14 0M26 239h27m348-24h22m155 49h24"
        strokeWidth="1.5"
      />
    </SceneFrame>
  );
}
