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
  | { kind: "ack" }
  | { kind: "how-are-you" }
  | { kind: "goodbye" }
  | { kind: "yes" }
  | { kind: "no" }
  | { kind: "compliment" }
  | { kind: "small-talk" }
  | { kind: "gibberish" }
  | { kind: "identity" }
  | { kind: "capability" }
  | { kind: "unsure" }
  | { kind: "page-question" }
  | { kind: "definition"; term: string }
  | { kind: "need"; text: string };

const GREETING =
  /^(hi|hello|hey|hiya|howdy|greetings|good\s+(morning|afternoon|evening|day)|morning|afternoon|evening)\b[\s,!.]*(there|team|dechy|everyone|all)?[\s,!.]*/i;
const THANKS = /^(thanks|thank\s+you|thx|ty|cheers)\b[\s,!.]*(so\s+much|a\s+lot|again)?[\s,!.]*$/i;
/** Acknowledgements and reactions: "ok", "got it", "lol". */
const ACK =
  /^(ok(ay)?|k|got\s+it|sounds\s+good|great|perfect|nice|cool|alright|fine|lol|haha+|hehe|hmm+|i\s+see|understood|noted)[\s,!.]*$/i;
const HOW_ARE_YOU =
  /^(how\s+(are|r)\s+(you|u|things)|how['’]?s\s+it\s+going|how\s+is\s+it\s+going|how\s+have\s+you\s+been|how\s+do\s+you\s+do|what['’]?s\s+up|sup|you\s+ok(ay)?)\b[\w\s,!.?]*$/i;
const GOODBYE =
  /^(bye|goodbye|good\s*bye|see\s+(you|ya)|later|cya|have\s+a\s+(good|nice|great)\s+\w+|that['’]?s\s+all|i['’]?m\s+done|good\s+night)[\s,!.]*$/i;
const YES = /^(yes|yeah|yep|yup|sure|of\s+course|yes\s+please|definitely|absolutely)[\s,!.]*$/i;
const NO = /^(no|nope|nah|no\s+thanks|not\s+now|no\s+thank\s+you)[\s,!.]*$/i;
const COMPLIMENT =
  /^((you['’]?re|you\s+are|that['’]?s|this\s+is)\s+(great|awesome|amazing|helpful|brilliant|excellent|very\s+helpful|so\s+helpful)|(great|good|nice)\s+(job|work|bot|answer)|love\s+it|well\s+done)/i;
/** Off-topic small talk: answered briefly, then back to what the assistant is for. */
const SMALL_TALK =
  /\b(joke|weather|raining|sunny|temperature|football|soccer|basketball|cricket|sports?|movie|film|music|song|recipe|hungry|bored|meaning\s+of\s+life|your\s+favou?rite|do\s+you\s+like|are\s+you\s+happy|tell\s+me\s+something\s+(fun|interesting)|horoscope)\b/i;
const KEYBOARD = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];
/** Keyboard mashing, or a single word with no vowels: "asdfgh", "qwerty", "xkcdq". */
function gibberish(text: string): boolean {
  const words = text.trim().split(/\s+/);
  if (words.length > 2) return false;
  const t = text.toLowerCase().replace(/[^a-z]/g, "");
  if (t.length < 4) return false;
  if (KEYBOARD.some((row) => row.includes(t.slice(0, 4)))) return true;
  // Five letters or more: short terms such as "html" or "crm" are real words here.
  return t.length >= 5 && !/[aeiouy]/.test(t);
}
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
  if (HOW_ARE_YOU.test(text)) return { kind: "how-are-you" };
  const greeting = text.match(GREETING);
  if (greeting) {
    const rest = text.slice(greeting[0].length).trim();
    if (!rest) return { kind: "greeting" };
    return classify(rest);
  }
  if (THANKS.test(text)) return { kind: "thanks" };
  if (ACK.test(text)) return { kind: "ack" };
  if (GOODBYE.test(text)) return { kind: "goodbye" };
  if (YES.test(text)) return { kind: "yes" };
  if (NO.test(text)) return { kind: "no" };
  if (COMPLIMENT.test(text)) return { kind: "compliment" };
  if (gibberish(text)) return { kind: "gibberish" };
  if (IDENTITY.test(text)) return { kind: "identity" };
  if (CAPABILITY.test(text)) return { kind: "capability" };
  if (SMALL_TALK.test(text)) return { kind: "small-talk" };
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
