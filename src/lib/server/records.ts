/**
 * DECHY Admin data model and repository. The backend data layer is the single source of truth for
 * everything that arrives from the website (contact form, assistant, human support) and later from
 * business email. The admin web app and a future mobile app read the same records through
 * /api/admin. Server-only.
 *
 * Keys:  inquiry/<id>  support/<id>  conversation/<id>  contact/<emailHash>
 *        activity/<sortable time>-<id>  ref/<REFERENCE>  (reference index)
 */
import crypto from "node:crypto";
import { getStore, type Store } from "./store";

/* ---------------- identifiers ---------------- */

/** Unambiguous characters (no 0/O, 1/I/L, U). */
const REF_ALPHABET = "23456789ABCDEFGHJKMNPQRSTVWXYZ";

/** Human-readable reference, e.g. DECHY-7F42K9. */
export function newRef(): string {
  const bytes = crypto.randomBytes(6);
  let out = "";
  for (const b of bytes) out += REF_ALPHABET[b % REF_ALPHABET.length];
  return `DECHY-${out}`;
}

export const REF_PATTERN = /^DECHY-[23456789ABCDEFGHJKMNPQRSTVWXYZ]{6}$/;

export function newId(): string {
  return crypto.randomUUID();
}

const sortable = (iso: string) => iso.replace(/[^0-9]/g, "");

export function emailKey(email: string): string {
  return crypto.createHash("sha256").update(email.trim().toLowerCase()).digest("hex").slice(0, 32);
}

/* ---------------- types ---------------- */

export type Channel = "contact-form" | "assistant" | "human-support" | "email";
export type Status = "new" | "open" | "waiting" | "resolved" | "archived";
export const STATUSES: Status[] = ["new", "open", "waiting", "resolved", "archived"];
/**
 * How each status reads in DECHY Admin (owner, 24 October 2026: new, replied, closed). The stored
 * values stay the same, so older records and the API are unchanged.
 */
export const STATUS_LABEL: Record<Status, string> = {
  new: "New",
  open: "Open",
  waiting: "Replied",
  resolved: "Closed",
  archived: "Archived",
};

export type Contact = {
  id: string;
  name: string;
  email: string;
  organization: string;
  createdAt: string;
  updatedAt: string;
  refs: string[];
  conversationIds: string[];
};

/** Where a piece of information came from, so inferred details are never shown as confirmed. */
export type FieldSource = "visitor" | "conversation" | "page" | "system";

export type Note = { at: string; by: string; text: string };

/** Structured summary for the team: read in seconds, check against the transcript if needed. */
export type HandoffSummary = {
  need: string;
  context: string;
  suggested: string;
  openQuestions: string[];
};

/** Everything the team needs from an assistant conversation that led to a record. */
export type HandoffContext = {
  conversationId: string | null;
  summary: HandoffSummary;
  fieldSources: Partial<
    Record<"name" | "email" | "organization" | "need" | "service", FieldSource>
  >;
  startPage: string;
  handoffPage: string;
  reason: string;
  detectedNeed: string;
  recommendedService: string;
  recommendedSolution: string;
  /** Only when the visitor ticked it; never inferred. */
  urgency: "stated" | "not-stated";
  /** The visitor's own words that matter most (first message, the request for a person). */
  keyMessages: string[];
};

type RecordBase = {
  id: string;
  ref: string;
  channel: Channel;
  status: Status;
  read: boolean;
  createdAt: string;
  updatedAt: string;
  contactId: string | null;
  name: string;
  email: string;
  organization: string;
  /** Internal only. */
  notes: Note[];
  assignedTo: string;
  /** Present when the record came from an assistant conversation or a request for a person. */
  handoff: HandoffContext | null;
};

/** A potential client or business opportunity (contact form, or an inbound business email). */
export type Inquiry = RecordBase & {
  kind: "inquiry";
  service: string;
  timeline: string;
  budget: string;
  subject: string;
  message: string;
  /** Which website form sent it (contact, quote, estimator); absent on older records. */
  form?: "contact" | "quote" | "estimator";
  /** Where the visitor came from (UTM tags, landing page, referrer); absent on older records. */
  source?: {
    utm_source: string;
    utm_medium: string;
    utm_campaign: string;
    landing_page: string;
    referrer: string;
  };
};

/** A newsletter signup: the address, when, and where the visitor came from. */
export type Subscriber = {
  email: string;
  createdAt: string;
  source: NonNullable<Inquiry["source"]> | null;
};

/** An existing client asking for help with work already under way (support, not new business). */
export type SupportRequest = RecordBase & {
  kind: "support";
  origin: "visitor-request" | "assistant-escalation";
  message: string;
  conversationId: string | null;
  summary: string;
  detectedNeed: string;
  recommendedService: string;
  recommendedSolution: string;
  /** Only when the visitor said so explicitly; never inferred. */
  urgency: "stated" | "not-stated";
  escalationReason: string;
};

/** An assistant handoff: any record (inquiry or support request) created from a conversation. */
export type AIHandoff = InboxRecord & { handoff: HandoffContext };

export type ConversationMessage = {
  role: "visitor" | "assistant";
  text: string;
  at: string;
  /** Entity ids the assistant recommended with this reply. */
  recommendations?: string[];
  /** One-line reason per recommended id. */
  reasons?: Record<string, string>;
  /** Page ids the answer drew on. */
  sources?: string[];
  /** The page the visitor was on. */
  page?: string;
  /** Sent after the conversation was handed to the team; attached to that record. */
  afterHandoff?: boolean;
  /** System notes in the thread (handoff confirmation), shown to the visitor but not as AI text. */
  kind?: "message" | "handoff";
};

export type Extracted = { value: string; source: FieldSource };

export type Conversation = {
  id: string;
  createdAt: string;
  updatedAt: string;
  /** Deleted after this time unless it led to a support request (CONVERSATION_RETENTION_DAYS). */
  expiresAt: string;
  /** active, inactive (the visitor went quiet), closed (they started a new chat), or escalated
   *  (handed to the team; kept with its record, never expired or reopened by the idle states). */
  status: "active" | "inactive" | "closed" | "escalated";
  mode: "ai" | "guided";
  messages: ConversationMessage[];
  summary: string;
  detectedNeed: string;
  recommendedService: string;
  recommendedSolution: string;
  /** Reference of the record this conversation was handed to (inquiry or support request). */
  supportRef: string | null;
  /** Set the moment the visitor asks for a person, even if they never finish the handoff. */
  personRequestedAt: string | null;
  startPage: string;
  lastPage: string;
  handoffPage: string;
  /** Details the visitor gave during the conversation (shown for confirmation, never assumed). */
  extracted: { name?: Extracted; email?: Extracted; organization?: Extracted };
  /** New project, existing client, or not yet clear. */
  intent: "new" | "existing" | "unclear";
};

export type Activity = {
  id: string;
  at: string;
  type: string;
  ref: string | null;
  summary: string;
  actor: "system" | "visitor" | "admin";
};

export type InboxRecord = Inquiry | SupportRequest;

/** The conversation a record came from, for either record kind. */
export function conversationIdOf(r: InboxRecord): string | null {
  return r.handoff?.conversationId ?? (r.kind === "support" ? r.conversationId : null);
}

/* ---------------- repository ---------------- */

type Env = Record<string, string | undefined>;

export function retentionDays(env: Env = process.env): number {
  const n = Number(env.CONVERSATION_RETENTION_DAYS ?? "90");
  return Number.isFinite(n) && n >= 1 && n <= 730 ? Math.floor(n) : 90;
}

export class Repo {
  constructor(
    private store: Store = getStore(),
    private now: () => Date = () => new Date(),
  ) {}

  private iso() {
    return this.now().toISOString();
  }

  get storeKind() {
    return this.store.kind;
  }

  async logActivity(a: Omit<Activity, "id" | "at">): Promise<Activity> {
    const act: Activity = { id: newId(), at: this.iso(), ...a };
    await this.store.set(`activity/${sortable(act.at)}-${act.id.slice(0, 8)}`, act);
    return act;
  }

  async listActivity(limit = 30): Promise<Activity[]> {
    const keys = (await this.store.list("activity/")).slice(-limit).reverse();
    const out = await Promise.all(keys.map((k) => this.store.get<Activity>(k)));
    return out.filter((a): a is Activity => a !== null);
  }

  /** Create or update the contact for an email address; returns its id. */
  async upsertContact(c: {
    name: string;
    email: string;
    organization: string;
    ref?: string;
    conversationId?: string;
  }) {
    const key = `contact/${emailKey(c.email)}`;
    const existing = await this.store.get<Contact>(key);
    const t = this.iso();
    const contact: Contact = existing ?? {
      id: emailKey(c.email),
      name: c.name,
      email: c.email.trim(),
      organization: c.organization,
      createdAt: t,
      updatedAt: t,
      refs: [],
      conversationIds: [],
    };
    if (c.name) contact.name = c.name;
    if (c.organization) contact.organization = c.organization;
    if (c.ref && !contact.refs.includes(c.ref)) contact.refs.push(c.ref);
    if (c.conversationId && !contact.conversationIds.includes(c.conversationId))
      contact.conversationIds.push(c.conversationId);
    contact.updatedAt = t;
    await this.store.set(key, contact);
    return contact.id;
  }

  async listContacts(): Promise<Contact[]> {
    const keys = await this.store.list("contact/");
    const all = await Promise.all(keys.map((k) => this.store.get<Contact>(k)));
    return all
      .filter((c): c is Contact => c !== null)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }

  async getContact(id: string): Promise<Contact | null> {
    if (!/^[0-9a-f]{32}$/.test(id)) return null;
    return this.store.get<Contact>(`contact/${id}`);
  }

  private async uniqueRef(): Promise<string> {
    for (let i = 0; i < 8; i++) {
      const ref = newRef();
      if (!(await this.store.get(`ref/${ref}`))) return ref;
    }
    throw new Error("Could not allocate a reference");
  }

  async createInquiry(
    input: Omit<
      Inquiry,
      | "id"
      | "ref"
      | "kind"
      | "status"
      | "read"
      | "createdAt"
      | "updatedAt"
      | "contactId"
      | "notes"
      | "assignedTo"
      | "handoff"
    > & { handoff?: HandoffContext | null },
  ): Promise<Inquiry> {
    const t = this.iso();
    const ref = await this.uniqueRef();
    const id = newId();
    const contactId = input.email
      ? await this.upsertContact({
          name: input.name,
          email: input.email,
          organization: input.organization,
          ref,
        })
      : null;
    const inquiry: Inquiry = {
      ...input,
      id,
      ref,
      kind: "inquiry",
      status: "new",
      read: false,
      createdAt: t,
      updatedAt: t,
      contactId,
      notes: [],
      assignedTo: "",
      handoff: input.handoff ?? null,
    };
    await this.store.set(`inquiry/${id}`, inquiry);
    await this.store.set(`ref/${ref}`, { kind: "inquiry", id });
    return inquiry;
  }

  async createSupportRequest(
    input: Omit<
      SupportRequest,
      | "id"
      | "ref"
      | "kind"
      | "status"
      | "read"
      | "createdAt"
      | "updatedAt"
      | "contactId"
      | "notes"
      | "assignedTo"
      | "handoff"
    > & { handoff?: HandoffContext | null },
  ): Promise<SupportRequest> {
    const t = this.iso();
    const ref = await this.uniqueRef();
    const id = newId();
    const contactId = input.email
      ? await this.upsertContact({
          name: input.name,
          email: input.email,
          organization: input.organization,
          ref,
          conversationId: input.conversationId ?? undefined,
        })
      : null;
    const req: SupportRequest = {
      ...input,
      id,
      ref,
      kind: "support",
      status: "new",
      read: false,
      createdAt: t,
      updatedAt: t,
      contactId,
      notes: [],
      assignedTo: "",
      handoff: input.handoff ?? null,
    };
    await this.store.set(`support/${id}`, req);
    await this.store.set(`ref/${ref}`, { kind: "support", id });
    return req;
  }

  async getByRef(ref: string): Promise<InboxRecord | null> {
    if (!REF_PATTERN.test(ref)) return null;
    const idx = await this.store.get<{ kind: "inquiry" | "support"; id: string }>(`ref/${ref}`);
    if (!idx) return null;
    return this.store.get<InboxRecord>(`${idx.kind}/${idx.id}`);
  }

  async updateRecord(
    ref: string,
    change: { status?: Status; read?: boolean; assignedTo?: string },
    actor: Activity["actor"] = "admin",
  ): Promise<InboxRecord | null> {
    const rec = await this.getByRef(ref);
    if (!rec) return null;
    const before = rec.status;
    if (change.status && STATUSES.includes(change.status)) rec.status = change.status;
    if (typeof change.read === "boolean") rec.read = change.read;
    if (typeof change.assignedTo === "string") rec.assignedTo = change.assignedTo.slice(0, 120);
    rec.updatedAt = this.iso();
    await this.store.set(`${rec.kind}/${rec.id}`, rec);
    if (change.status && change.status !== before)
      await this.logActivity({
        type: "record.status_changed",
        ref,
        summary: `${ref} moved from ${before} to ${rec.status}`,
        actor,
      });
    return rec;
  }

  /** Adds an internal note (never shown to the visitor). */
  async addNote(ref: string, text: string, by: string): Promise<InboxRecord | null> {
    const rec = await this.getByRef(ref);
    const clean = text.trim().slice(0, 4000);
    if (!rec || !clean) return rec;
    rec.notes = [...(rec.notes ?? []), { at: this.iso(), by: by.slice(0, 120), text: clean }];
    rec.updatedAt = this.iso();
    await this.store.set(`${rec.kind}/${rec.id}`, rec);
    return rec;
  }

  /** A visitor added to a conversation that was already handed over: surface it on the record. */
  async markFollowUp(ref: string): Promise<void> {
    const rec = await this.getByRef(ref);
    if (!rec) return;
    rec.read = false;
    rec.updatedAt = this.iso();
    await this.store.set(`${rec.kind}/${rec.id}`, rec);
    await this.logActivity({
      type: "conversation.followup",
      ref,
      summary: `The visitor added to ${ref} after the handoff`,
      actor: "visitor",
    });
  }

  /**
   * Permanently deletes a record, its reference, and its conversation, and removes it from the
   * contact. Used for deletion requests; the activity log keeps only the reference.
   */
  async deleteRecord(ref: string, actor: Activity["actor"] = "admin"): Promise<boolean> {
    const rec = await this.getByRef(ref);
    if (!rec) return false;
    await this.store.delete(`${rec.kind}/${rec.id}`);
    await this.store.delete(`ref/${ref}`);
    const cid = conversationIdOf(rec);
    if (cid) await this.store.delete(`conversation/${cid}`);
    if (rec.contactId) {
      const key = `contact/${rec.contactId}`;
      const c = await this.store.get<Contact>(key);
      if (c) {
        c.refs = c.refs.filter((r) => r !== ref);
        if (cid) c.conversationIds = c.conversationIds.filter((id) => id !== cid);
        await this.store.set(key, c);
      }
    }
    await this.logActivity({ type: "record.deleted", ref, summary: `${ref} was deleted`, actor });
    return true;
  }

  /** Deletes a contact and everything linked to them (inquiries, support requests, conversations). */
  async deleteContact(id: string, actor: Activity["actor"] = "admin"): Promise<boolean> {
    const c = await this.getContact(id);
    if (!c) return false;
    for (const ref of c.refs) await this.deleteRecord(ref, actor);
    for (const conv of c.conversationIds) await this.store.delete(`conversation/${conv}`);
    await this.store.delete(`contact/${id}`);
    await this.logActivity({
      type: "contact.deleted",
      ref: null,
      summary: "A contact and their records were deleted",
      actor,
    });
    return true;
  }

  async listInbox(
    filter: { kind?: "inquiry" | "support"; channel?: Channel; status?: Status } = {},
  ) {
    const kinds = filter.kind ? [filter.kind] : (["inquiry", "support"] as const);
    const out: InboxRecord[] = [];
    for (const k of kinds) {
      const keys = await this.store.list(`${k}/`);
      const recs = await Promise.all(keys.map((key) => this.store.get<InboxRecord>(key)));
      for (const r of recs) if (r) out.push(r);
    }
    return out
      .filter((r) => !filter.channel || r.channel === filter.channel)
      .filter((r) => !filter.status || r.status === filter.status)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  /* newsletter subscribers (owner, 24 October 2026) */

  /** Adds or refreshes a subscriber; returns false when the address was already on the list. */
  async addSubscriber(email: string, source: Subscriber["source"]): Promise<boolean> {
    const key = `subscriber/${emailKey(email)}`;
    const existing = await this.store.get<Subscriber>(key);
    if (existing) return false;
    await this.store.set(key, { email: email.trim().toLowerCase(), createdAt: this.iso(), source });
    return true;
  }

  async listSubscribers(): Promise<Subscriber[]> {
    const keys = await this.store.list("subscriber/");
    const all = await Promise.all(keys.map((k) => this.store.get<Subscriber>(k)));
    return all
      .filter((x): x is Subscriber => x !== null)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  /* conversations */

  async createConversation(mode: Conversation["mode"], page = ""): Promise<Conversation> {
    const t = this.now();
    const conv: Conversation = {
      id: newId(),
      createdAt: t.toISOString(),
      updatedAt: t.toISOString(),
      expiresAt: new Date(t.getTime() + retentionDays() * 86400000).toISOString(),
      status: "active",
      mode,
      messages: [],
      summary: "",
      detectedNeed: "",
      recommendedService: "",
      recommendedSolution: "",
      supportRef: null,
      personRequestedAt: null,
      startPage: page,
      lastPage: page,
      handoffPage: "",
      extracted: {},
      intent: "unclear",
    };
    await this.store.set(`conversation/${conv.id}`, conv);
    return conv;
  }

  async getConversation(id: string): Promise<Conversation | null> {
    if (!/^[0-9a-f-]{36}$/.test(id)) return null;
    const c = await this.store.get<Conversation>(`conversation/${id}`);
    if (!c) return null;
    if (c.status !== "escalated" && !c.supportRef && c.expiresAt < this.iso()) {
      await this.store.delete(`conversation/${id}`);
      return null;
    }
    return c;
  }

  async saveConversation(c: Conversation) {
    c.updatedAt = this.iso();
    await this.store.set(`conversation/${c.id}`, c);
  }

  /** Lists conversations and deletes the expired ones (retention is enforced on read). */
  async listConversations(): Promise<Conversation[]> {
    const keys = await this.store.list("conversation/");
    const all = await Promise.all(keys.map((k) => this.store.get<Conversation>(k)));
    const now = this.iso();
    const keep: Conversation[] = [];
    for (const c of all) {
      if (!c) continue;
      if (c.status !== "escalated" && !c.supportRef && c.expiresAt < now) {
        await this.store.delete(`conversation/${c.id}`);
        continue;
      }
      keep.push(c);
    }
    return keep.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }

  async overview() {
    const inbox = await this.listInbox();
    const conversations = await this.listConversations();
    return {
      newInquiries: inbox.filter((r) => r.kind === "inquiry" && r.status === "new").length,
      unread: inbox.filter((r) => !r.read).length,
      openSupport: inbox.filter(
        (r) => r.kind === "support" && r.status !== "resolved" && r.status !== "archived",
      ).length,
      escalations: inbox.filter(
        (r) => r.handoff && r.channel === "assistant" && r.status !== "archived",
      ).length,
      conversations: conversations.length,
      personRequests: conversations.filter((c) => c.personRequestedAt && !c.supportRef).length,
      activity: await this.listActivity(12),
    };
  }
}
