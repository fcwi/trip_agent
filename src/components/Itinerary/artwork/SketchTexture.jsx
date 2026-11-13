/* Static pigment gaps: shared by the original SVG studies and cover drawings.
   No raster downloads, filters, random values or animation are needed. */
export default function SketchTexture({ id }) {
  const grainId = `${id}-grain`;
  return (
    <defs>
      <pattern
        id={grainId}
        width="24"
        height="24"
        patternUnits="userSpaceOnUse"
      >
        <rect width="24" height="24" fill="white" />
        <g fill="none" stroke="black" strokeLinecap="round">
          <path
            d="m2 4 4-.6m8 2 6-.8M7 12l8-1m-13 8 5-.5m10 2 5-1"
            strokeWidth=".7"
            opacity=".16"
          />
          <path
            d="m10 2 2-.2m8 11 3-.3M10 19l3-.4m-12-8 2-.3"
            strokeWidth=".45"
            opacity=".24"
          />
          <path
            d="M4 9l1.5 1.2M16 5l1.2 1.5M20 17l-1.5 1.2M6 21l1.2-1.4"
            strokeWidth=".4"
            opacity=".14"
          />
        </g>
      </pattern>
      <mask
        id={id}
        x="-32"
        y="-32"
        width="704"
        height="384"
        maskUnits="userSpaceOnUse"
        style={{ maskType: "luminance" }}
      >
        <rect
          x="-32"
          y="-32"
          width="704"
          height="384"
          fill={`url(#${grainId})`}
        />
      </mask>
    </defs>
  );
}
