import { authorizeRequest } from "@/lib/server/auth";
import { NO_STORE } from "@/lib/server/http";
import { Repo, type InboxRecord } from "@/lib/server/records";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * CSV exports for DECHY Admin (owner, 24 October 2026), so leads are never stuck in one dashboard:
 * GET /api/admin/export?type=leads        every inquiry and support request
 * GET /api/admin/export?type=subscribers  the newsletter list
 * Netlify Forms keeps a second copy of each lead with its own CSV export.
 */
export async function GET(request: Request) {
  if (!authorizeRequest(request.headers))
    return Response.json({ ok: false, code: "unauthorized" }, { status: 401, headers: NO_STORE });
  const type = new URL(request.url).searchParams.get("type");
  const repo = new Repo();
  const day = new Date().toISOString().slice(0, 10);
  if (type === "subscribers") {
    const rows = (await repo.listSubscribers()).map((s) => [
      s.email,
      s.createdAt,
      ...sourceCells(s.source),
    ]);
    return csv(`dechy-subscribers-${day}.csv`, ["email", "created", ...SOURCE_HEAD], rows);
  }
  if (type === "leads") {
    const rows = (await repo.listInbox()).map((r) => leadRow(r));
    return csv(`dechy-leads-${day}.csv`, LEAD_HEAD, rows);
  }
  return Response.json({ ok: false, code: "bad_request" }, { status: 400, headers: NO_STORE });
}

const SOURCE_HEAD = ["utm_source", "utm_medium", "utm_campaign", "landing_page", "referrer"];
const LEAD_HEAD = [
  "reference",
  "created",
  "kind",
  "form",
  "channel",
  "status",
  "name",
  "email",
  "organization",
  "service",
  "timeline",
  "budget",
  "message",
  ...SOURCE_HEAD,
];

type Source = Record<string, string> | null | undefined;

function sourceCells(s: Source): string[] {
  return SOURCE_HEAD.map((k) => s?.[k] ?? "");
}

function leadRow(r: InboxRecord): string[] {
  const inq = r.kind === "inquiry" ? r : null;
  return [
    r.ref,
    r.createdAt,
    r.kind,
    inq?.form ?? "",
    r.channel,
    r.status,
    r.name,
    r.email,
    r.organization,
    inq?.service ?? "",
    inq?.timeline ?? "",
    inq?.budget ?? "",
    r.message,
    ...sourceCells(inq?.source),
  ];
}

/** A cell safe to open in a spreadsheet: quoted, and never read as a formula. */
function cell(v: string): string {
  const safe = /^[=+\-@\t\r]/.test(v) ? `'${v}` : v;
  return `"${safe.replace(/"/g, '""')}"`;
}

function csv(filename: string, head: string[], rows: string[][]): Response {
  const body = [head, ...rows].map((r) => r.map(cell).join(",")).join("\r\n");
  return new Response(`﻿${body}\r\n`, {
    headers: {
      ...NO_STORE,
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
