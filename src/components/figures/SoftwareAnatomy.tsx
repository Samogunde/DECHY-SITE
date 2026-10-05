/**
 * Conceptual diagram: anatomy of a custom business application. Original artwork. It shows the
 * parts a delivered system typically has; it is not a depiction of any client system.
 */
export function SoftwareAnatomy({ titleId }: { titleId: string }) {
  const rows = [
    { y: 0, h: 64, title: "People", body: "Customers, staff, partners" },
    { y: 82, h: 84, title: "Interfaces", body: "Web app, mobile app, admin" },
    { y: 184, h: 84, title: "Services and logic", body: "Rules, workflows, APIs" },
    { y: 286, h: 84, title: "Data", body: "Database, search, files, reports" },
  ];
  const modules = [
    { y: 82, lines: ["Identity", "and access"] },
    { y: 162, lines: ["Background", "jobs"] },
    { y: 242, lines: ["Integrations", "and events"] },
    { y: 322, lines: ["Logs, metrics,", "alerts"] },
  ];
  return (
    <svg
      viewBox="0 0 480 450"
      role="img"
      aria-labelledby={`${titleId}-t ${titleId}-d`}
      className="mx-auto w-full max-w-[30rem]"
    >
      <title id={`${titleId}-t`}>Anatomy of a custom business application</title>
      <desc id={`${titleId}-d`}>
        A layered diagram. People use interfaces (web app, mobile app, admin). Interfaces call
        services and business logic, which read and write data. Four supporting modules sit beside
        the stack: identity and access, background jobs, integrations and events, and logs, metrics
        and alerts. A delivery pipeline along the bottom builds, tests, releases and maintains the
        whole system.
      </desc>

      {rows.map((r, i) => (
        <g key={r.title}>
          <rect
            x="1"
            y={r.y + 1}
            width="298"
            height={r.h - 2}
            rx="4"
            className={i === 0 ? "fill-paper stroke-ink" : "fill-white stroke-ink"}
            strokeWidth="1.5"
            strokeDasharray={i === 0 ? "5 4" : undefined}
          />
          <text
            x="20"
            y={r.y + (r.h > 70 ? 34 : 28)}
            fontSize="18"
            fontWeight="700"
            className="fig-text fill-ink"
          >
            {r.title}
          </text>
          <text
            x="20"
            y={r.y + (r.h > 70 ? 58 : 51)}
            fontSize="15"
            className="fig-body fill-slate-text"
          >
            {r.body}
          </text>
          {i < rows.length - 1 ? (
            <g>
              <line
                x1="150"
                y1={r.y + r.h}
                x2="150"
                y2={(rows[i + 1]?.y ?? 0) - 5}
                className="stroke-ink"
                strokeWidth="1.5"
              />
              <path
                d={`M144 ${(rows[i + 1]?.y ?? 0) - 9} L150 ${(rows[i + 1]?.y ?? 0) - 2} L156 ${(rows[i + 1]?.y ?? 0) - 9}`}
                className="fill-none stroke-ink"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          ) : null}
        </g>
      ))}

      {modules.map((m) => (
        <g key={m.lines.join(" ")}>
          <line
            x1="299"
            y1={m.y + 34}
            x2="326"
            y2={m.y + 34}
            className="stroke-blue"
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />
          <rect
            x="327"
            y={m.y}
            width="152"
            height="68"
            rx="4"
            className="fill-white stroke-blue"
            strokeWidth="1.5"
          />
          {m.lines.map((line, i) => (
            <text
              key={line}
              x="341"
              y={m.y + 29 + i * 20}
              fontSize="16"
              fontWeight="700"
              className="fig-text fill-ink"
            >
              {line}
            </text>
          ))}
        </g>
      ))}

      <rect x="1" y="394" width="478" height="54" rx="4" className="fill-ink" />
      {["Build", "Test", "Release", "Maintain"].map((step, i) => (
        <g key={step}>
          <text
            x={20 + i * 118}
            y="427"
            fontSize="16"
            fontWeight="700"
            className="fig-text fill-paper"
          >
            {step}
          </text>
          {i < 3 ? (
            <path
              d={`M${96 + i * 118} 421 h16 m-5 -5 l5 5 l-5 5`}
              className="fill-none stroke-blue-on-dark"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : null}
        </g>
      ))}
    </svg>
  );
}
