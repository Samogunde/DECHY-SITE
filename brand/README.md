# brand

Approved brand assets, exactly as supplied by the owner. Never redraw, recolor, re-typeset, or crop the artwork. Delivery files are built from these masters by `scripts/brand-derivatives.ts` (scaling, padding, or a transparent surround only). SHA-256 of the masters is checked in `tests/unit/brand-governance.test.ts`.

| Master                                                                           | Role                                                                                                                                                                      |
| -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `logos/primary/dechy-logo.png` (supplied as "DECHY Geometric Logo on White.png") | The site logo: header, footer, Organization logo in structured data. The wordmark without the descriptor; the descriptor appears as text where needed.                    |
| `social/DECHY Technology Solutions Social Image.png`                             | The default social sharing image (Open Graph and X), served padded to 1200 x 630 as `public/og/dechy-share-image.png`. Never used as the site logo. |
| `monogram/DECHY_Monogram_On_Dark_Background.png`                                 | Browser icons (favicon.ico 16/32/48, icon.png 96), surround made transparent.                                                                                             |
| `monogram/Minimalist Navy D Emblem with Blue Accent.png`                         | Larger app icons (apple-icon 180, manifest 192 and 512), square crops on its own white.                                                                                   |
