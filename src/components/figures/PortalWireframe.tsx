/**
 * Conceptual interface visual: a wireframe of a customer portal on desktop and phone. Original
 * artwork. It contains no data, no brand of any client, and no figures; it is labeled conceptual by
 * its caption and is never a depiction of a delivered client interface.
 */
const NAV = ["Overview", "Orders", "Invoices", "Documents", "Support"];
const TILES = ["Open", "In progress", "Completed"];
const ROWS = [0, 1, 2, 3];

function Pill({ x, y, strong = false }: { x: number; y: number; strong?: boolean }) {
  return (
    <rect
      x={x}
      y={y}
      width="74"
      height="20"
      rx="10"
      className={strong ? "fill-blue" : "fill-line"}
    />
  );
}

export function PortalWireframe({ titleId }: { titleId: string }) {
  return (
    <>
      {/* Wide: desktop window with a phone alongside */}
      <svg
        viewBox="0 0 900 450"
        role="img"
        aria-labelledby={`${titleId}-t ${titleId}-d`}
        className="hidden h-auto w-full min-[48rem]:block"
      >
        <title id={`${titleId}-t`}>Conceptual wireframe of a customer portal</title>
        <desc id={`${titleId}-d`}>
          A desktop browser window showing a customer portal with a navigation sidebar (overview,
          orders, invoices, documents, support), summary tiles for open, in progress and completed
          items, and a table of records with status labels. A phone beside it shows the same portal
          reorganized for a narrow screen.
        </desc>

        {/* browser window */}
        <rect
          x="1"
          y="1"
          width="640"
          height="440"
          rx="8"
          className="fill-white stroke-ink"
          strokeWidth="1.5"
        />
        <path d="M1 36 H641" className="stroke-ink" strokeWidth="1.5" />
        {[0, 1, 2].map((i) => (
          <circle key={i} cx={22 + i * 18} cy="19" r="5" className="fill-line" />
        ))}
        <rect x="96" y="9" width="360" height="20" rx="10" className="fill-paper stroke-line" />

        {/* sidebar */}
        <rect x="2" y="37" width="150" height="403" className="fill-paper" />
        <path d="M152 37 V441" className="stroke-line" strokeWidth="1.5" />
        {NAV.map((n, i) => (
          <g key={n}>
            {i === 1 ? (
              <rect x="2" y={66 + i * 44} width="150" height="36" className="fill-white" />
            ) : null}
            {i === 1 ? (
              <rect x="2" y={66 + i * 44} width="4" height="36" className="fill-blue" />
            ) : null}
            <text
              x="24"
              y={89 + i * 44}
              fontSize="15"
              fontWeight={i === 1 ? 700 : 500}
              className={`fig-text ${i === 1 ? "fill-ink" : "fill-slate-text"}`}
            >
              {n}
            </text>
          </g>
        ))}

        {/* header row */}
        <text x="176" y="76" fontSize="22" fontWeight="700" className="fig-text fill-ink">
          Orders
        </text>
        <rect
          x="372"
          y="54"
          width="130"
          height="32"
          rx="6"
          className="fill-white stroke-input-border"
          strokeWidth="1.5"
        />
        <rect x="384" y="66" width="60" height="8" rx="4" className="fill-line" />
        <rect x="514" y="54" width="112" height="32" rx="6" className="fill-blue" />
        <text
          x="570"
          y="75"
          textAnchor="middle"
          fontSize="14"
          fontWeight="700"
          className="fig-text fill-white"
        >
          New request
        </text>

        {/* summary tiles */}
        {TILES.map((t, i) => (
          <g key={t}>
            <rect
              x={176 + i * 150}
              y="104"
              width="138"
              height="78"
              rx="6"
              className="fill-white stroke-line"
              strokeWidth="1.5"
            />
            <text
              x={190 + i * 150}
              y="130"
              fontSize="14"
              fontWeight="600"
              className="fig-text fill-slate-text"
            >
              {t}
            </text>
            <rect
              x={190 + i * 150}
              y="146"
              width={[44, 70, 56][i]}
              height="16"
              rx="3"
              className="fill-ink"
              opacity="0.85"
            />
          </g>
        ))}

        {/* table */}
        <rect x="176" y="202" width="450" height="30" className="fill-paper" />
        {["Reference", "Status", "Updated"].map((h, i) => (
          <text
            key={h}
            x={190 + [0, 190, 332][i]!}
            y="222"
            fontSize="13.5"
            fontWeight="700"
            className="fig-text fill-slate-text"
          >
            {h}
          </text>
        ))}
        {ROWS.map((r) => (
          <g key={r}>
            <path d={`M176 ${238 + r * 48 + 40} H626`} className="stroke-line" strokeWidth="1" />
            <rect
              x="190"
              y={254 + r * 48}
              width={[96, 80, 110, 88][r]}
              height="10"
              rx="3"
              className="fill-line"
            />
            <Pill x={380} y={248 + r * 48} strong={r === 0 || r === 2} />
            <rect x="522" y={254 + r * 48} width="70" height="10" rx="3" className="fill-line" />
          </g>
        ))}

        {/* phone */}
        <rect
          x="690"
          y="40"
          width="200"
          height="400"
          rx="26"
          className="fill-white stroke-ink"
          strokeWidth="1.5"
        />
        <rect x="770" y="52" width="40" height="6" rx="3" className="fill-line" />
        <text x="712" y="98" fontSize="18" fontWeight="700" className="fig-text fill-ink">
          Orders
        </text>
        <rect x="712" y="112" width="156" height="30" rx="6" className="fill-blue" />
        <text
          x="790"
          y="132"
          textAnchor="middle"
          fontSize="13.5"
          fontWeight="700"
          className="fig-text fill-white"
        >
          New request
        </text>
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <rect
              x="712"
              y={158 + i * 70}
              width="156"
              height="60"
              rx="6"
              className="fill-paper stroke-line"
            />
            <rect
              x="724"
              y={172 + i * 70}
              width={[80, 64, 92][i]}
              height="9"
              rx="3"
              className="fill-line"
            />
            <Pill x={724} y={190 + i * 70} strong={i !== 1} />
          </g>
        ))}
        <path d="M690 392 H890" className="stroke-line" strokeWidth="1.5" />
        {[0, 1, 2, 3].map((i) => (
          <circle
            key={i}
            cx={730 + i * 42}
            cy="416"
            r="7"
            className={i === 1 ? "fill-blue" : "fill-line"}
          />
        ))}
      </svg>

      {/* Narrow: the phone layout, full width */}
      <svg
        viewBox="0 0 320 470"
        role="img"
        aria-labelledby={`${titleId}-t2 ${titleId}-d2`}
        className="block h-auto w-full max-w-[24rem] min-[48rem]:hidden"
      >
        <title id={`${titleId}-t2`}>Conceptual wireframe of a customer portal on a phone</title>
        <desc id={`${titleId}-d2`}>
          A phone screen showing a customer portal: an orders heading, a new request button, and a
          list of records with status labels, with a navigation bar at the bottom.
        </desc>
        <rect
          x="1"
          y="1"
          width="318"
          height="468"
          rx="28"
          className="fill-white stroke-ink"
          strokeWidth="1.5"
        />
        <rect x="130" y="14" width="60" height="7" rx="3.5" className="fill-line" />
        <text x="24" y="66" fontSize="22" fontWeight="700" className="fig-text fill-ink">
          Orders
        </text>
        <rect x="24" y="82" width="272" height="40" rx="6" className="fill-blue" />
        <text
          x="160"
          y="108"
          textAnchor="middle"
          fontSize="15"
          fontWeight="700"
          className="fig-text fill-white"
        >
          New request
        </text>
        {TILES.map((t, i) => (
          <g key={t}>
            <rect
              x={24 + i * 93}
              y="140"
              width="86"
              height="54"
              rx="6"
              className="fill-paper stroke-line"
            />
            <text
              x={34 + i * 93}
              y="162"
              fontSize="12.5"
              fontWeight="600"
              className="fig-text fill-slate-text"
            >
              {t}
            </text>
            <rect
              x={34 + i * 93}
              y="172"
              width={[26, 40, 32][i]}
              height="10"
              rx="3"
              className="fill-ink"
              opacity="0.85"
            />
          </g>
        ))}
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <rect
              x="24"
              y={212 + i * 66}
              width="272"
              height="58"
              rx="6"
              className="fill-white stroke-line"
              strokeWidth="1.5"
            />
            <rect
              x="38"
              y={228 + i * 66}
              width={[110, 84, 124][i]}
              height="10"
              rx="3"
              className="fill-line"
            />
            <Pill x={38} y={246 + i * 66} strong={i !== 1} />
          </g>
        ))}
        <path d="M2 412 H318" className="stroke-line" strokeWidth="1.5" />
        {[0, 1, 2, 3].map((i) => (
          <circle
            key={i}
            cx={52 + i * 72}
            cy="440"
            r="8"
            className={i === 1 ? "fill-blue" : "fill-line"}
          />
        ))}
      </svg>
    </>
  );
}
