/**
 * Conceptual diagram: modernizing a legacy system in stages (a "strangler" approach). Original
 * artwork describing method. Wide screens show four panels across; narrow screens stack them.
 */
const STAGES = [
  { n: "1", title: "Assess", body: ["Map the system,", "its data, and risks"] },
  { n: "2", title: "Wrap", body: ["Put a new front", "layer in place"] },
  { n: "3", title: "Replace", body: ["Move modules over", "one at a time"] },
  { n: "4", title: "Retire", body: ["Switch off what is", "no longer used"] },
];

function Legacy({
  w,
  y,
  h,
  opacity = 1,
  dashed = false,
}: {
  w: number;
  y: number;
  h: number;
  opacity?: number;
  dashed?: boolean;
}) {
  return (
    <rect
      x="0"
      y={y}
      width={w}
      height={h}
      rx="4"
      className="fill-white stroke-ink"
      strokeWidth="1.5"
      strokeDasharray={dashed ? "5 4" : undefined}
      opacity={opacity}
    />
  );
}

/** A small schematic for each stage, drawn in a 210 wide box at the origin. */
function Schematic({ stage }: { stage: number }) {
  return (
    <g>
      {stage === 0 && (
        <>
          <Legacy w={210} y={0} h={150} />
          {[0, 1, 2].map((r) =>
            [0, 1, 2].map((c) => (
              <rect
                key={`${r}${c}`}
                x={14 + c * 62}
                y={18 + r * 42}
                width="52"
                height="32"
                rx="3"
                className="fill-paper stroke-slate"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
            )),
          )}
        </>
      )}
      {stage === 1 && (
        <>
          <rect x="0" y="0" width="210" height="34" rx="4" className="fill-blue" />
          <text
            x="105"
            y="22"
            textAnchor="middle"
            fontSize="14"
            fontWeight="700"
            className="fig-text fill-white"
          >
            New front layer
          </text>
          <Legacy w={210} y={50} h={100} />
          <text
            x="105"
            y="106"
            textAnchor="middle"
            fontSize="15"
            fontWeight="700"
            className="fig-text fill-ink"
          >
            Legacy system
          </text>
        </>
      )}
      {stage === 2 && (
        <>
          <rect x="0" y="0" width="210" height="34" rx="4" className="fill-blue" />
          <text
            x="105"
            y="22"
            textAnchor="middle"
            fontSize="14"
            fontWeight="700"
            className="fig-text fill-white"
          >
            New front layer
          </text>
          <Legacy w={100} y={50} h={100} />
          <text
            x="50"
            y="106"
            textAnchor="middle"
            fontSize="14"
            fontWeight="700"
            className="fig-text fill-ink"
          >
            Legacy
          </text>
          {[0, 1].map((r) =>
            [0, 1].map((c) => (
              <rect
                key={`${r}${c}`}
                x={112 + c * 52}
                y={50 + r * 52}
                width="46"
                height="46"
                rx="3"
                className="fill-white stroke-blue"
                strokeWidth="1.8"
              />
            )),
          )}
        </>
      )}
      {stage === 3 && (
        <>
          <rect x="0" y="0" width="210" height="34" rx="4" className="fill-blue" />
          <text
            x="105"
            y="22"
            textAnchor="middle"
            fontSize="14"
            fontWeight="700"
            className="fig-text fill-white"
          >
            New front layer
          </text>
          <Legacy w={60} y={50} h={100} opacity={0.55} dashed />
          {[0, 1].map((r) =>
            [0, 1, 2].map((c) => (
              <rect
                key={`${r}${c}`}
                x={72 + c * 46}
                y={50 + r * 52}
                width="40"
                height="46"
                rx="3"
                className="fill-white stroke-blue"
                strokeWidth="1.8"
              />
            )),
          )}
          <text
            x="30"
            y="106"
            textAnchor="middle"
            fontSize="13"
            className="fig-body fill-slate-text"
          >
            retired
          </text>
        </>
      )}
    </g>
  );
}

export function ModernizationPath({ titleId }: { titleId: string }) {
  const desc = (
    <desc id={`${titleId}-d`}>
      Four stages of modernizing a legacy system without stopping the business. Assess: map the
      system, its data and its risks. Wrap: put a new front layer in place. Replace: move modules
      over one at a time while the legacy system shrinks. Retire: switch off what is no longer used.
    </desc>
  );
  return (
    <>
      <svg
        viewBox="0 0 960 250"
        role="img"
        aria-labelledby={`${titleId}-t ${titleId}-d`}
        className="hidden h-auto w-full min-[48rem]:block"
      >
        <title id={`${titleId}-t`}>Modernizing legacy software in four stages</title>
        {desc}
        {STAGES.map((s, i) => {
          const x = i * 250;
          return (
            <g key={s.n} transform={`translate(${x} 0)`}>
              <circle cx="14" cy="14" r="13" className="fill-ink" />
              <text
                x="14"
                y="19.5"
                textAnchor="middle"
                fontSize="15"
                fontWeight="700"
                className="fig-text fill-paper"
              >
                {s.n}
              </text>
              <text x="38" y="20" fontSize="18" fontWeight="700" className="fig-text fill-ink">
                {s.title}
              </text>
              <g transform="translate(0 36)">
                <Schematic stage={i} />
              </g>
              {s.body.map((line, k) => (
                <text
                  key={line}
                  x="0"
                  y={206 + k * 19}
                  fontSize="15"
                  className="fig-body fill-slate-text"
                >
                  {line}
                </text>
              ))}
              {i < 3 ? (
                <path
                  d="M222 111 h16 m-6 -6 l6 6 l-6 6"
                  className="fill-none stroke-ink"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ) : null}
            </g>
          );
        })}
      </svg>
      <svg
        viewBox="0 0 360 920"
        role="img"
        aria-labelledby={`${titleId}-t2 ${titleId}-d2`}
        className="block h-auto w-full min-[48rem]:hidden"
      >
        <title id={`${titleId}-t2`}>Modernizing legacy software in four stages</title>
        <desc id={`${titleId}-d2`}>
          Four stages: assess, wrap with a new front layer, replace modules one at a time, and
          retire what is no longer used.
        </desc>
        {STAGES.map((s, i) => (
          <g key={s.n} transform={`translate(2 ${i * 230})`}>
            <circle cx="14" cy="14" r="13" className="fill-ink" />
            <text
              x="14"
              y="19.5"
              textAnchor="middle"
              fontSize="15"
              fontWeight="700"
              className="fig-text fill-paper"
            >
              {s.n}
            </text>
            <text x="38" y="20" fontSize="18" fontWeight="700" className="fig-text fill-ink">
              {s.title}
            </text>
            <g transform="translate(0 36)">
              <Schematic stage={i} />
            </g>
            <text x="0" y="206" fontSize="15" className="fig-body fill-slate-text">
              {s.body[0]}
            </text>
            <text x="0" y="225" fontSize="15" className="fig-body fill-slate-text">
              {s.body[1]}
            </text>
          </g>
        ))}
      </svg>
    </>
  );
}
