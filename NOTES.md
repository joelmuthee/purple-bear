# Purple Bear · build notes

Kids' shoe shop, Revlon Plaza, Biashara Street. Live at https://www.purplebear.co.ke
(Cloudflare Pages project `purple-bear`). A push to `main` deploys the site through
`.github/workflows/deploy-site.yml`; `worker/` changes deploy the API through
`deploy-worker.yml`. Pushes that only touch `.md` files do not deploy. Catalog vertical:
`Website Designs/CATALOG-STANDARDS.md` applies.

## Hero redesign (2026-10-08)

Joel approved the Jirani Fashion hero and asked for it here too. The hero is now split:
copy on the left (same eyebrow, "Little feet, big steps." headline and subtitle as before),
and on the right four real pairs pulled live from the catalog by `buildHeroCollage()` in
`main.js`. Rule for the pick: priced, in stock, has a photo and a category, newest first,
round-robin over the three biggest categories (today Sneakers, Doll Shoes, Sandals, then a
second Sneaker). Each tile shows its real price (sale price when on sale) and tapping it
filters the shop to that category. Fewer qualifying pairs means fewer tiles; none hides the
collage.

- **Perks** under the buttons, all from the site's own copy (IG bio could not be read
  logged out): *Delivery countrywide* (About, footer, How to buy), *New stock every week*
  (hero subtitle, footer, meta description), *Shop on Biashara Street* (About and footer
  address). Change them only if that copy changes.
- **Shop by category** row (`buildCatRow()`): one real photo and the live pair count per
  category, biggest first, tap to filter and scroll to the shop. Two columns on a phone.
- **Phone:** the four pairs sit in one row above the headline, so stock is the first thing
  seen. Buttons stack at 380px and below.
- **Look kept:** own logo on its black plate, purple `#A338CC` and lilac `#c4b5fd`,
  Cormorant Garamond + Inter, light theme. Hero shapes are soft purple and lilac blobs;
  price pills use `--choco-deep`.
- **Motion fails safe:** the tile fade-up only runs while `#heroCollage` has `.hc-anim`, and
  `main.js` removes that class after 1.4s, so a frozen frame (background tab) cannot leave a
  tile invisible. Respects `prefers-reduced-motion`.
- Hero rules were edited in place (`.hero`, `.hero-inner`, `.hero-title`, `.hero-sub`,
  `.hero-cta` around line 121 of `styles.css`), not overridden from a new block, so nothing
  silently loses on specificity order. `styles.css?v=20261008hero` on index, admin and staff.
- Measured at 320, 375 and 1366 on the live site: no sideways scroll, nothing past the right
  edge except card carousel slides (by design, clipped), no input under 90px, all hero tiles
  and category tiles inside the viewport, nothing left under 0.9 opacity after a full scroll
  except the card carousel arrows and the disabled pager button (both by design).

## Short WhatsApp product links (2026-10-09)

Enquiry messages now end with `https://www.purplebear.co.ke/p/<id>` instead of
`purplebear-api.stawisystems.workers.dev/p/<id>`. The domain is on Purity's own Cloudflare, so a
Worker route is impossible; `functions/p/[id].js` (a Pages Function) passes `/p/*` to the
purplebear-api worker through the `API` service binding set on the Pages project. `main.js` builds
links from `SHARE_BASE`. Preview card unchanged.

## 2026-10-09 · Owner login link in the shop footer
Purity asked for a way into the admin from the shop itself instead of keeping a separate link. Added a quiet "Owner login" link to the footer bottom row, pointing at `/admin`, `rel="nofollow"` (robots.txt already disallows `/admin`). Underlined, inherits the footer colour, 10px vertical padding so it is a ~39px tap target. Verified at 375px: inside the screen, no sideways scroll, tap lands on the admin password screen. Purple Bear only; other shops not changed.


## 2026-10-23 · Credit sales count on the day the money comes in

Joel: a credit customer's payment (St. Joseph's) received today should show in today's sales.
Before this, the whole sale value counted on the day the item was taken and later payments
never moved any sales figure. Now:

- **Ksh and profit follow the money.** `saleReceipts(bag, s)` turns a sale into dated
  receipts: the deposit (`amountPaid`, or the full price when none was recorded) on
  `soldAt`, then each `payments[]` entry on its own `at`, capped at the sale total.
  Dashboard Today/Week/Month/All-time, the date-range report and the category totals all
  sum those. Profit is each receipt's share of the margin (`receiptProfit`).
- **Units still count on the day taken.** The stock left the shop that day.
- **The lists add up to the takings.** Today's sales (Sell screen) and the range report
  list a credit payment as its own row ("credit payment, taken 3 Oct"), and a credit sale
  shows the amount paid plus "Ksh X on credit", so the rows equal Cash + M-Pesa.
- **All time** now means money received; outstanding debt shows under it as
  "+ Ksh X still owed" (same figure as the Owed tab).
- Left alone on purpose: per-item revenue in Inventory and client "spent", which describe
  what was bought, not when it was paid.

Verified on a local copy with made-up zz sales (no live data touched): today = Ksh 4,500
from a Ksh 2,000 credit payment + Ksh 2,000 cash sale + Ksh 500 deposit, matching the
takings chips exactly. Bumped `admin.js?v=20261023creditpay`.
