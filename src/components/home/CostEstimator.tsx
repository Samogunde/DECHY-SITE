"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { estimate, money, weeksText, type EstimatorData, type Selection } from "@/lib/estimate";

const STEPS = ["What you are building", "Type and size", "Features and setup", "Timeline"];

/**
 * The cost estimator: four short steps, then a price range, a timeline range, and what drives
 * them. The result shows first; name and email are asked only afterwards, to send the full
 * breakdown and book a call. Leads go to the same inbox as the contact form.
 */
export function CostEstimator({
  data,
  serviceBySlug,
}: {
  data: EstimatorData;
  /** Service page slug -> estimator service key, for links like ?service=mobile-app-development. */
  serviceBySlug: Record<string, string>;
}) {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [sel, setSel] = useState<Selection>({
    service: "",
    tier: 0,
    size: "medium",
    features: [],
    platform: data.platforms[0]?.key ?? "",
    web: false,
    design: "custom",
    integrations: 0,
    timeline: "standard",
  });
  const top = useRef<HTMLDivElement>(null);

  // Open on the service a page linked from (?service=...), once the page has loaded.
  useEffect(() => {
    const t = window.setTimeout(() => {
      const slug = new URLSearchParams(window.location.search).get("service") ?? "";
      const key = serviceBySlug[slug] ?? (data.services.some((s) => s.key === slug) ? slug : "");
      if (key) {
        setSel((s) => ({ ...s, service: key }));
        setStep(1);
      }
    }, 0);
    return () => window.clearTimeout(t);
  }, [data.services, serviceBySlug]);

  const svc = data.services.find((s) => s.key === sel.service);
  const result = useMemo(() => estimate(data, sel), [data, sel]);
  const set = (patch: Partial<Selection>) => setSel((s) => ({ ...s, ...patch }));
  const go = (n: number) => {
    setStep(n);
    top.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const canNext = step === 0 ? Boolean(svc) : true;

  return (
    <div className="est" ref={top}>
      <ol className="est-steps" aria-label="Estimator steps">
        {STEPS.map((label, i) => (
          <li
            key={label}
            data-state={done || i < step ? "done" : i === step ? "current" : "next"}
            aria-current={!done && i === step ? "step" : undefined}
          >
            <span className="est-step-n">{i + 1}</span>
            <span className="est-step-label">{label}</span>
          </li>
        ))}
      </ol>

      {done && result && svc ? (
        <Result
          data={data}
          sel={sel}
          result={result}
          interest={svc.interest}
          onEdit={() => {
            setDone(false);
            go(0);
          }}
        />
      ) : (
        <div className="est-panel">
          {step === 0 ? (
            <fieldset className="est-field">
              <legend>What are you building?</legend>
              <div className="est-cards">
                {data.services.map((s) => (
                  <label key={s.key} className="est-card" data-checked={sel.service === s.key}>
                    <input
                      type="radio"
                      name="service"
                      value={s.key}
                      checked={sel.service === s.key}
                      onChange={() => set({ service: s.key, tier: 0, features: [] })}
                    />
                    <span className="est-card-title">{s.label}</span>
                    <span className="est-card-hint">{s.hint}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          ) : null}

          {step === 1 && svc ? (
            <>
              <fieldset className="est-field">
                <legend>Which is closest to your project?</legend>
                <div className="est-list">
                  {svc.tiers.map((t, i) => (
                    <label key={t.name} className="est-option" data-checked={sel.tier === i}>
                      <input
                        type="radio"
                        name="tier"
                        checked={sel.tier === i}
                        onChange={() => set({ tier: i })}
                      />
                      <span className="est-option-main">
                        <span className="est-option-title">{t.name}</span>
                        <span className="est-option-hint">{t.summary}</span>
                      </span>
                      <span className="est-option-price">
                        {money(t.price[0])}
                        {t.price[1] > t.price[0] ? ` to ${money(t.price[1])}` : ""}
                        {t.open ? "+" : ""}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <fieldset className="est-field">
                <legend>How big is it?</legend>
                <div className="est-segment">
                  {data.sizes.map((z) => (
                    <label key={z.key} className="est-seg" data-checked={sel.size === z.key}>
                      <input
                        type="radio"
                        name="size"
                        checked={sel.size === z.key}
                        onChange={() => set({ size: z.key })}
                      />
                      <span className="est-seg-title">{z.label}</span>
                      <span className="est-seg-hint">{z.hint}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            </>
          ) : null}

          {step === 2 && svc ? (
            <>
              <fieldset className="est-field">
                <legend>Which features do you need?</legend>
                <div className="est-checks">
                  {svc.features.map((f) => (
                    <label
                      key={f.id}
                      className="est-check"
                      data-checked={sel.features.includes(f.id)}
                    >
                      <input
                        type="checkbox"
                        checked={sel.features.includes(f.id)}
                        onChange={(e) =>
                          set({
                            features: e.target.checked
                              ? [...sel.features, f.id]
                              : sel.features.filter((x) => x !== f.id),
                          })
                        }
                      />
                      <span>{f.label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
              {svc.platforms ? (
                <fieldset className="est-field">
                  <legend>Which platforms?</legend>
                  <div className="est-list">
                    {data.platforms.map((p) => (
                      <label
                        key={p.key}
                        className="est-option"
                        data-checked={sel.platform === p.key}
                      >
                        <input
                          type="radio"
                          name="platform"
                          checked={sel.platform === p.key}
                          onChange={() => set({ platform: p.key })}
                        />
                        <span className="est-option-main">
                          <span className="est-option-title">{p.label}</span>
                        </span>
                      </label>
                    ))}
                  </div>
                  <label className="est-check est-check-inline" data-checked={sel.web}>
                    <input
                      type="checkbox"
                      checked={sel.web}
                      onChange={(e) => set({ web: e.target.checked })}
                    />
                    <span>{data.webCompanion.label}</span>
                  </label>
                </fieldset>
              ) : null}
              <fieldset className="est-field">
                <legend>What level of design?</legend>
                <div className="est-segment">
                  {data.designs.map((d) => (
                    <label key={d.key} className="est-seg" data-checked={sel.design === d.key}>
                      <input
                        type="radio"
                        name="design"
                        checked={sel.design === d.key}
                        onChange={() => set({ design: d.key })}
                      />
                      <span className="est-seg-title">{d.label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <fieldset className="est-field">
                <legend>How many other systems should it connect to?</legend>
                <p className="est-legend-hint">
                  For example your CRM, accounting package, store, or payment provider.
                </p>
                <div className="est-segment est-segment-4">
                  {[0, 1, 2, 3].map((n) => (
                    <label key={n} className="est-seg" data-checked={sel.integrations === n}>
                      <input
                        type="radio"
                        name="integrations"
                        checked={sel.integrations === n}
                        onChange={() => set({ integrations: n })}
                      />
                      <span className="est-seg-title">
                        {n === 0 ? "None" : n === 3 ? "3 or more" : n}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
            </>
          ) : null}

          {step === 3 ? (
            <fieldset className="est-field">
              <legend>When do you need it?</legend>
              <div className="est-segment">
                {data.timelines.map((t) => (
                  <label key={t.key} className="est-seg" data-checked={sel.timeline === t.key}>
                    <input
                      type="radio"
                      name="timeline"
                      checked={sel.timeline === t.key}
                      onChange={() => set({ timeline: t.key })}
                    />
                    <span className="est-seg-title">{t.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          ) : null}

          <div className="est-nav">
            {step > 0 ? (
              <button type="button" className="btn btn-secondary" onClick={() => go(step - 1)}>
                Back
              </button>
            ) : (
              <span />
            )}
            {step < STEPS.length - 1 ? (
              <button
                type="button"
                className="btn btn-primary"
                disabled={!canNext}
                onClick={() => go(step + 1)}
              >
                Next: {STEPS[step + 1]?.toLowerCase()}
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  setDone(true);
                  top.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
              >
                See my estimate
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Result({
  data,
  sel,
  result,
  interest,
  onEdit,
}: {
  data: EstimatorData;
  sel: Selection;
  result: NonNullable<ReturnType<typeof estimate>>;
  interest: string;
  onEdit: () => void;
}) {
  const [asking, setAsking] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [ref, setRef] = useState("");
  const [error, setError] = useState("");
  const started = useRef(0);
  useEffect(() => {
    started.current = Date.now();
  }, []);
  const priceText = `${money(result.price[0])} to ${money(result.price[1])}${result.open ? "+" : ""}`;
  const timeText = weeksText(result.weeks);
  const summary = [
    `Cost estimator result: ${priceText}, ${timeText}.`,
    ...result.lines.map((l) => `- ${l.label}: ${l.detail}`),
    `Timeline preference: ${data.timelines.find((t) => t.key === sel.timeline)?.label ?? sel.timeline}.`,
  ].join("\n");

  async function send(form: HTMLFormElement) {
    const fd = new FormData(form);
    setState("sending");
    setError("");
    try {
      const res = await fetch("/api/contact/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(fd.get("name") ?? ""),
          email: String(fd.get("email") ?? ""),
          interest,
          message: `${summary}\n\nSent from the cost estimator. Please send the full breakdown and book a call.`,
          website: String(fd.get("website") ?? ""),
          startedAt: started.current,
        }),
      });
      const body = (await res.json()) as {
        ok: boolean;
        ref?: string;
        message?: string;
        errors?: Record<string, string>;
      };
      if (!res.ok || !body.ok)
        throw new Error(
          body.message ??
            Object.values(body.errors ?? {})[0] ??
            "Could not send. Please try again.",
        );
      setRef(body.ref ?? "");
      setState("sent");
    } catch (e) {
      setError((e as Error).message);
      setState("error");
    }
  }

  return (
    <div className="est-result" aria-live="polite">
      <div className="est-result-main">
        <p className="est-result-label">Your estimate</p>
        <p className="est-result-price">{priceText}</p>
        <p className="est-result-time">
          Typical timeline: <strong>{timeText}</strong>
        </p>
        <button type="button" className="est-edit" onClick={onEdit}>
          Change my answers
        </button>
      </div>
      <div className="est-result-side">
        <p className="est-result-label">What drives the number</p>
        <ul className="est-lines">
          {result.lines.map((l) => (
            <li key={l.label}>
              <span>{l.label}</span>
              <strong>{l.detail}</strong>
            </li>
          ))}
        </ul>
        <p className="est-excludes-title">Not included in the estimate</p>
        <ul className="est-excludes">
          {data.excludes.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      </div>
      <div className="est-result-cta">
        {state === "sent" ? (
          <p className="est-sent">
            Thank you. We will email your full breakdown within one business day and suggest times
            for a call{ref ? ` (reference ${ref})` : ""}.
          </p>
        ) : asking ? (
          <form
            className="est-lead"
            onSubmit={(e) => {
              e.preventDefault();
              void send(e.currentTarget);
            }}
          >
            <p className="est-lead-title">Where should we send the full breakdown?</p>
            <label>
              <span>Your name</span>
              <input name="name" required minLength={2} autoComplete="name" />
            </label>
            <label>
              <span>Work email</span>
              <input name="email" type="email" required autoComplete="email" />
            </label>
            <input
              name="website"
              tabIndex={-1}
              autoComplete="off"
              className="visually-hidden"
              aria-hidden="true"
            />
            <button type="submit" className="btn btn-primary" disabled={state === "sending"}>
              {state === "sending" ? "Sending..." : "Send my breakdown and book a call"}
            </button>
            {state === "error" ? <p className="est-error">{error}</p> : null}
          </form>
        ) : (
          <button
            type="button"
            className="btn btn-primary est-quote"
            onClick={() => setAsking(true)}
          >
            Get an exact quote
          </button>
        )}
      </div>
    </div>
  );
}
