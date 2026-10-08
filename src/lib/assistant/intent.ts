/**
 * What kind of message the visitor sent, decided from their own words before anything is matched
 * against DECHY's pages. Greetings, questions about the assistant, and "I'm not sure" are answered
 * as conversation; only a stated need is matched to a service. The page the visitor is on is
 * context, never intent: it is used only when the message refers to it ("how does this work?").
 */
export type Intent =
  | { kind: "starter"; id: StarterId }
  | { kind: "greeting" }
  | { kind: "thanks" }
  | { kind: "identity" }
  | { kind: "capability" }
  | { kind: "unsure" }
  | { kind: "page-question" }
  | { kind: "definition"; term: string }
  | { kind: "need"; text: string };

const GREETING =
  /^(hi|hello|hey|hiya|howdy|greetings|good\s+(morning|afternoon|evening|day)|morning|afternoon|evening)\b[\s,!.]*(there|team|dechy|everyone|all)?[\s,!.]*/i;
const THANKS =
  /^(thanks|thank\s+you|thx|cheers|great|perfect|ok(ay)?|got\s+it|sounds\s+good|nice|cool)\b[\s,!.]*(so\s+much|a\s+lot|again)?[\s,!.]*$/i;
const IDENTITY =
  /\b(who\s+(are|r)\s+(you|u)|what\s+are\s+you|are\s+you\s+(a\s+|an\s+)?(bot|robot|ai|human|person|real|chatbot)|your\s+name|who\s+am\s+i\s+(talking|speaking)\s+(to|with))\b/i;
const CAPABILITY =
  /\b(what\s+(can|could)\s+(you|u|dechy(\s+ai)?)\s+(do|help)|how\s+(can|could|do)\s+(you|u)\s+help|what\s+do\s+you\s+do|what\s+does\s+dechy\s+do|what\s+are\s+you\s+able|what\s+is\s+dechy|tell\s+me\s+about\s+dechy|what\s+(services|do\s+you\s+offer))\b/i;
const UNSURE =
  /\b(not\s+sure|unsure|don['’]?t\s+know|do\s+not\s+know|no\s+idea|where\s+to\s+(start|begin)|figur(e|ing)\s+(it|this|out)|help\s+me\s+(decide|choose|figure|think)|can\s+you\s+help(\s+me|\s+us)?\??$|^\s*(i|we)\s+need\s+(some\s+)?help[\s.!?]*$|^\s*help[\s.!?]*$)/i;
const PAGE_QUESTION =
  /\b(how\s+does\s+(this|it)\s+work|tell\s+me\s+(more\s+)?about\s+(this|it)|what\s+is\s+this|explain\s+this|can\s+you\s+help\s+(me\s+|us\s+)?with\s+(this|that)|is\s+(this|it)\s+(right|a\s+good\s+fit|for\s+us|for\s+me)|(does|would)\s+(this|it)\s+(fit|work|suit)|more\s+about\s+this\s+(page|service|technology|solution))\b/i;
const DEFINITION =
  /^\s*(what(?:['’]s|\s+is|\s+are)|explain|define|meaning\s+of)\s+(an?\s+|the\s+)?([a-z0-9][\w\s.+#&/-]{1,60}?)\s*\??\s*$/i;

export type StarterId = "build" | "ai" | "connect" | "improve";

/** The four starting points, as the visitor taps them. */
export const STARTER_LABELS: Record<StarterId, string> = {
  build: "Build something new",
  ai: "Add AI or automation",
  connect: "Connect our systems",
  improve: "Improve or modernize what we have",
};

const norm = (t: string) =>
  t
    .toLowerCase()
    .replace(/modernise/g, "modernize")
    .replace(/[^a-z ]+/g, "")
    .trim();

/** Classify one visitor message. A greeting followed by a request is treated as the request. */
export function classify(raw: string): Intent {
  const text = raw.trim();
  for (const [id, label] of Object.entries(STARTER_LABELS))
    if (norm(text) === norm(label)) return { kind: "starter", id: id as StarterId };
  const greeting = text.match(GREETING);
  if (greeting) {
    const rest = text.slice(greeting[0].length).trim();
    if (!rest) return { kind: "greeting" };
    return classify(rest);
  }
  if (THANKS.test(text)) return { kind: "thanks" };
  if (IDENTITY.test(text)) return { kind: "identity" };
  if (CAPABILITY.test(text)) return { kind: "capability" };
  if (PAGE_QUESTION.test(text)) return { kind: "page-question" };
  const def = text.match(DEFINITION);
  if (def && !/\b(you|we|our|us|i|my)\b/i.test(def[3] ?? ""))
    return { kind: "definition", term: def[3]!.trim() };
  if (UNSURE.test(text)) return { kind: "unsure" };
  return { kind: "need", text };
}

/** Sentences that only introduce the visitor (name, company, email) are not their need. */
const INTRO =
  /^\s*([Hh]i|[Hh]ello|[Hh]ey|[Gg]ood\s+[a-z]+|[Mm]y\s+name\s+is|[Ii]['\u2019]?m\s+[A-Z][a-z]+\s+(from|at|with)\b|[Tt]his\s+is\s+[A-Z]|[Ii]\s+work\s+(at|for)|[Mm]y\s+email|[Yy]ou\s+can\s+reach\s+me|[Tt]hanks)\b/;

/** The visitor's need in their own words: the first sentence that is not an introduction. */
export function needFrom(text: string): string {
  const sentences = text.match(/[^.!?]+[.!?]*/g) ?? [text];
  const pick = sentences.map((s) => s.trim()).find((s) => s && !INTRO.test(s)) ?? "";
  return pick.slice(0, 180);
}
