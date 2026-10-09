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
