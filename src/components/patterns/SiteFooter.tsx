import Link from "next/link";
import { getRegistry } from "@/lib/content/load";
import { publishedPath } from "@/lib/content/urls";
import { Logo } from "./Logo";
import { EmailLink } from "@/components/primitives/EmailLink";
import { mailto } from "@/lib/contact/emails";
import { NewsletterForm } from "@/components/patterns/NewsletterForm";
import { CookieSettingsButton } from "@/components/patterns/Analytics";

function FooterLink({ label, href }: { label: string; href: string | null }) {
  if (!href)
    return (
      <span className="inline-flex min-h-11 items-center text-slate-text lg:min-h-8">{label}</span>
    );
  return (
    <Link
      href={href}
      className="inline-flex min-h-11 items-center text-ink no-underline hover:underline lg:min-h-8"
    >
      {label}
    </Link>
  );
}

export function SiteFooter() {
  const registry = getRegistry();
  const year = new Date().getFullYear();
  const linkOrNull = (path: string) => (registry.pageByPath.has(path) ? path : null);
  return (
    <footer
      data-site-footer
      className="site-footer-dark rule-top tone-paper"
      aria-label="Site footer"
    >
      <div className="container-site py-14 min-[64rem]:py-20">
        <div className="grid gap-12 min-[64rem]:grid-cols-12 min-[64rem]:gap-10">
          <div className="min-[64rem]:col-span-4">
            <Link
              href="/"
              aria-label="DECHY home"
              className="flex min-h-11 w-[12rem] max-w-full items-center"
            >
              <Logo tone="dark" sizes="192px" className="h-9" />
            </Link>
            <p className="t-small mt-5 max-w-[34ch]">
              <span className="font-[family-name:var(--font-heading)] font-semibold">
                Technology, Software, AI &amp; Digital Solutions
              </span>
            </p>
            <p className="t-small mt-3 max-w-[38ch] text-slate-text">
              A global technology company working with organizations and clients worldwide.
            </p>
            <ul className="footer-emails m-0 mt-5 list-none p-0">
              <li className="t-small">
                <EmailLink kind="hello" className="footer-email" />
              </li>
              <li className="t-small">
                <span className="text-slate-text">Existing client? </span>
                <a href={mailto("support")} className="footer-email">
                  Get support
                </a>
              </li>
            </ul>
            <div className="footer-newsletter mt-6 max-w-[26rem]">
              <NewsletterForm variant="line" />
            </div>
          </div>

          <div className="min-[64rem]:col-span-5">
            <h2 className="t-eyebrow m-0">Services</h2>
            <ul className="m-0 mt-4 grid list-none grid-cols-1 gap-x-8 gap-y-0.5 p-0 min-[30rem]:grid-cols-2">
              {registry.services.map((s) => (
                <li key={s.id} className="t-small">
                  <FooterLink
                    label={s.name}
                    href={publishedPath(registry.nodes.get(s.id), registry)}
                  />
                </li>
              ))}
            </ul>
          </div>

          <div className="min-[64rem]:col-span-3">
            <h2 className="t-eyebrow m-0">Explore</h2>
            <ul className="m-0 mt-4 list-none p-0">
              {registry.nav.footer.explore.map((l) => (
                <li key={l.path} className="t-small">
                  <FooterLink label={l.label} href={linkOrNull(l.path)} />
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="rule-top mt-12 flex flex-col gap-4 pt-6 min-[48rem]:flex-row min-[48rem]:items-center min-[48rem]:justify-between">
          <p className="t-caption m-0">&copy; {year} DECHY Tech. All rights reserved.</p>
          <ul className="t-caption m-0 flex list-none flex-wrap gap-x-6 gap-y-1 p-0">
            {registry.nav.footer.legal.map((l) => (
              <li key={l.path}>
                <Link
                  href={l.path}
                  className="inline-flex min-h-11 items-center text-slate-text underline lg:min-h-8"
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <CookieSettingsButton className="footer-cookie-btn inline-flex min-h-11 items-center text-slate-text underline lg:min-h-8" />
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
