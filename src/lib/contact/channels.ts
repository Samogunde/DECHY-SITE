/**
 * Public contact channels (owner configuration, never invented): a booking link for calls, a
 * business email, and a phone number. Each is shown only when set in the environment.
 */
export function publicChannels(): { booking?: string; email?: string; phone?: string } {
  const clean = (v: string | undefined) => (v && v.trim() ? v.trim() : undefined);
  const booking = clean(process.env.PUBLIC_BOOKING_URL);
  return {
    booking: booking && /^https:\/\//.test(booking) ? booking : undefined,
    email: clean(process.env.PUBLIC_CONTACT_EMAIL),
    phone: clean(process.env.PUBLIC_CONTACT_PHONE),
  };
}

/** Where "Book a call" buttons go: the booking link when configured, otherwise the contact form. */
export function callHref(): string {
  return publicChannels().booking ?? "/contact/?intent=call";
}
