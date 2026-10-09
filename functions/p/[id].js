// Short product share links on Purple Bear's own domain (2026-10-09).
// WhatsApp enquiry messages carry www.purplebear.co.ke/p/<id>. The domain lives on
// Purity's own Cloudflare account, so our worker cannot be routed there; instead this
// Pages Function hands the request to the purplebear-api worker through the "API"
// service binding (set on the Pages project), which builds the OG preview page.
export async function onRequestGet({ params, env }) {
  const id = encodeURIComponent(params.id);
  return env.API.fetch(new Request(`https://purplebear-api/p/${id}`));
}
