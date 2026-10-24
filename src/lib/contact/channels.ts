/**
 * Public contact channels (owner configuration, never invented): a booking link for calls and a
 * phone number, each shown only when set in the environment. The business email addresses are
 * fixed in ./emails.ts.
 */
export function publicChannels(): { booking?: string; phone?: string } {
  const clean = (v: string | undefined) => (v && v.trim() ? v.trim() : undefined);
  const booking = clean(process.env.PUBLIC_BOOKING_URL);
  return {
    booking: booking && /^https:\/\//.test(booking) ? booking : undefined,
    phone: clean(process.env.PUBLIC_CONTACT_PHONE),
  };
}

/** Where "Book a call" buttons go: the booking link when configured, otherwise the contact form. */
export function callHref(): string {
  return publicChannels().booking ?? "/contact/?intent=call";
}
