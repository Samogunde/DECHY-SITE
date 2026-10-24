import { describe, expect, it, vi } from "vitest";
import { alertText, notify, type DechyEvent } from "../../src/lib/server/events";

// Phone alerts for new leads and requests for a person (owner, 24 October 2026): name, page, and a
// link only; never the email address or the message.

const event: DechyEvent = {
  type: "inquiry.created",
  ref: "DCH-4821",
  title: "New quote request: Web Development",
  actor: "visitor",
  name: "Ada Lovelace",
  page: "/contact/",
};

describe("Telegram alerts", () => {
  it("shows what happened, the name, the page, and the reference only", () => {
    expect(alertText(event)).toBe(
      "New quote request: Web Development\nName: Ada Lovelace\nPage: /contact/\nReference: DCH-4821",
    );
    expect(alertText(event)).not.toMatch(/@/);
  });

  it("posts to the bot with a button that opens the record in DECHY Admin", async () => {
    const fetchImpl = vi.fn(async () => new Response("{}"));
    const env = {
      NOTIFICATION_PROVIDER: "telegram",
      TELEGRAM_BOT_TOKEN: "123:abc",
      TELEGRAM_CHAT_ID: "-100200",
      SITE_ORIGIN: "https://www.dechytech.com",
    };
    expect(await notify(event, env, fetchImpl)).toBe("sent");
    const [url, init] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://api.telegram.org/bot123:abc/sendMessage");
    const body = JSON.parse(String(init.body));
    expect(body.chat_id).toBe("-100200");
    expect(body.reply_markup.inline_keyboard[0][0].url).toBe(
      "https://www.dechytech.com/admin/inbox/DCH-4821/",
    );
  });

  it("links a person request to its conversation and skips other events", async () => {
    const fetchImpl = vi.fn(async () => new Response("{}"));
    const env = {
      NOTIFICATION_PROVIDER: "telegram",
      TELEGRAM_BOT_TOKEN: "t",
      TELEGRAM_CHAT_ID: "c",
      SITE_ORIGIN: "https://www.dechytech.com",
    };
    await notify(
      { ...event, type: "person.requested", ref: null, adminPath: "/admin/conversations/x1/" },
      env,
      fetchImpl,
    );
    const body = JSON.parse(
      String((fetchImpl.mock.calls[0] as unknown as [string, RequestInit])[1].body),
    );
    expect(body.reply_markup.inline_keyboard[0][0].url).toBe(
      "https://www.dechytech.com/admin/conversations/x1/",
    );
    expect(await notify({ ...event, type: "record.status_changed" }, env, fetchImpl)).toBe(
      "skipped",
    );
    expect(await notify(event, { NOTIFICATION_PROVIDER: "telegram" }, fetchImpl)).toBe("skipped");
  });
});
