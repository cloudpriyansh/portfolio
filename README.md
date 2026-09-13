# Priyansh Dobariya — Portfolio

A responsive Next.js App Router portfolio with pre-rendered content, local fonts, an original laptop character, day/night themes, and accessible motion.

## Run

Node.js 20.9+ is required (Node 24 was used here).

```sh
npm ci
npm run dev
```

Open http://localhost:3000. To create the production static export:

```sh
npm run build
```

Deploy the `out/` directory to a static host. On Vercel, select Next.js and use the default build command. There are no runtime APIs, databases, or server requirements. `next start` does not serve a static export; use a static HTTP server to inspect `out/` locally.

## Content

- `lib/content.ts`: profile, project descriptions, technologies, expanded details, and skill groups. Add future projects to the `projects` array.
- `app/page.tsx`: about text and experience timeline.
- `components/project-visual.tsx`: project covers and conceptual architecture visuals. Generated covers are conceptual artwork rather than product screenshots.
- `public/Priyansh_Resume.pdf`: original resume download.
- `public/llms.txt`: factual plain-text summary; update it with future content edits.
- `public/developer-sprites.webp`: optimized original character sprite (4 frames, 2172 × 724, ~334 KB). Generated with built-in imagegen. Source and prompt in `output/imagegen/`.

The resume includes four projects. No project URLs, GitHub profile, availability status, client testimonials, or unsupported business results have been invented.

## Search and launch

Copy `.env.example` to `.env.local` for local production testing, or add these environment variables on the hosting platform:

- `SITE_URL`: the real public HTTPS origin, without a path. A hosting subdomain works before purchasing a domain.
- `ALLOW_INDEXING=true`: enable indexing only on the final public production deployment.
- `GOOGLE_SITE_VERIFICATION`: optional Google Search Console HTML verification token.

Rebuild after changing these settings. Canonical URLs, sitemap entries, robots rules, structured data, and social URLs are generated at build time. The verified private review address is the fallback origin in `lib/site.ts`. The preview deliberately has `noindex` and disallows crawling. Set your final public `SITE_URL` and `ALLOW_INDEXING=true` together at launch.

After public deployment:

1. Add your domain/URL-prefix property to Google Search Console and verify ownership (DNS verification for a domain property; the optional token above works for URL-prefix HTML verification).
2. Submit `https://YOUR-ACTUAL-HOST/sitemap.xml`.
3. Inspect the homepage URL and request indexing. Confirm the served HTML contains `index, follow`, the correct canonical URL, and the right absolute social-image URL.
4. Check the public deployment with PageSpeed Insights on mobile and desktop, and test the social preview. Results depend on hosting, network and device conditions.

SEO uses metadata, a semantic heading hierarchy, ProfilePage/Person/CreativeWork JSON-LD, sitemap, robots.txt, and real HTML content. For generative engine optimization (GEO), descriptive content and consistent entities do the useful work. There is no special Google GEO meta tag and indexing or AI citations cannot be guaranteed. `llms.txt` is supplemental and is not required by Google.

References: [Next.js static exports](https://nextjs.org/docs/app/guides/static-exports), [Next.js metadata](https://nextjs.org/docs/app/getting-started/metadata-and-og-images), [Google AI search guidance](https://developers.google.com/search/docs/appearance/ai-features).

## Motion and performance

- Server components render all portfolio content; only header preferences and effects use client code.
- Native scrolling, IntersectionObserver reveals, word emphasis, hero parallax, and a scroll-reactive ticker. Scroll/pointer writes are batched with requestAnimationFrame, with no permanent animation loop.
- The character animates a single decoded WebP with transform-based sprite frames and pauses when the hero leaves the viewport.
- View Transitions provides the circular day/night reveal; unsupported browsers switch directly. Theme choice persists with system theme fallback and an early script to prevent a theme flash.
- Cursor halo runs only on fine pointers. Native cursor and keyboard focus remain available.
- Reduced-motion is respected. The header pause button stops decorative animations; the preference persists.
- No scroll hijacking, WebGL, autoplay video, tracking, external font requests, or heavyweight animation libraries.

## Validation

`npm run typecheck` checks TypeScript. `npm run build` verifies Next.js production generation. Inspect both desktop and mobile sizes, day/night switching, keyboard menu behavior, project links, email/LinkedIn links, and resume download after content changes.

## Current validation results

- Production static export and TypeScript pass.
- Browser checked at 1440 px desktop and 390/320 px mobile, in both themes; no page overflow in the mobile checks.
- Mobile menu moves focus to its first item; Escape closes it and returns focus. Project cards open dedicated pages; their return links and keyboard navigation are verified. Theme and animation pause survive reload.
- Export contains one H1, all four projects, valid JSON-LD, matching canonical/social URLs, local assets, and the downloadable resume.
- Current private review build correctly emits noindex and disallows crawling. Indexing remains a public-launch step.
- The character uses a 334 KB WebP. Responsive project image byte sizes are recorded in `output/imagegen/projects/optimization.json`. These are asset measurements, not live Core Web Vitals scores.
- Social card: `public/og.png`; generation prompt: `output/imagegen/social-card-prompt.txt`. Both image assets were generated using the built-in imagegen tool.

## Generated project artwork

Project covers are generated with built-in ImageGen. Full-resolution originals and the exact prompt set are in `output/imagegen/projects/`; `manifest.json` records each completed asset. Responsive AVIF and WebP exports at 480, 800, and 1280 pixels are in `public/projects/`. Homepage images load lazily; detail-page cover images use high priority. Dimensions are reserved to prevent layout shifts. Rebuild exports with `node scripts/optimize-project-images.mjs`.

## Project pages and scroll sequence

The homepage presents one full project card at a time. Native CSS sticky positioning handles the stack; a small requestAnimationFrame update scales the retiring card only while the section is in view. There is no wheel interception or scroll library. Pausing motion, reduced-motion preferences, or a viewport too short for a complete card switch the section to normal document flow. Keyboard focus brings the matching card into view.

Each `lib/content.ts` project ID is its stable slug: `/projects/growstack/`, `/projects/urecruits/`, `/projects/zyberon/`, and `/projects/voice-agent/`. The static detail pages reuse the existing summaries and verified technical points, with room for fuller case-study content later. Add or edit projects in the same data file. Each route has its own title, description, canonical, Open Graph/X fields, and structured data. Public-launch sitemap generation includes all project routes. Private indexing settings remain unchanged.

Implementation: `components/project-showcase.tsx`, `components/project-scroll.tsx`, and `app/projects/[slug]/page.tsx`. Next.js references: [static route generation](https://nextjs.org/docs/app/api-reference/functions/generate-static-params) and [route metadata](https://nextjs.org/docs/app/api-reference/functions/generate-metadata).

## Scroll animation sequence

The continuous SVG path has been removed. The homepage adapts text reveals, zoom/parallax, scroll rotation, 3D card entrances, and horizontal scrolling from [Framer University's reference](https://framer.university/blog/10-scroll-animations-to-make-your-website-stand-out) using native scrolling and small viewport-aware animation updates.

`components/toolkit-scroll.tsx` provides the desktop horizontal full-stack toolkit. React/Next.js, Node.js/NestJS, Applied AI, and databases/Redis/cloud each have a dedicated card. Narrow or short viewports and reduced-motion/pause preferences use a readable grid. The existing project stack and detail routes remain in place. `components/effects.tsx` handles text emphasis, the continuously looping ticker, hero depth, and the contact zoom. No continuous homepage SVG overlay remains.

The full-stack profile is reflected in the introduction, About copy, toolkit, metadata, structured data, and llms.txt. The documented job title and existing project claims are preserved.

## Navigation and ambient motion

The floating sticky navbar highlights the current homepage section and includes direct Work, About, Stack, and contact navigation. Its mobile menu supports Escape, outside clicks, focus return, and dismissal on navigation.

Both the specialty ticker and technology logo strip loop continuously using CSS transforms on two identical groups. Six CSS 3D technology tiles float around the existing laptop character. Visibility observers pause ambient movement off-screen; hidden tabs, the global pause control, and reduced-motion preferences also suspend it. Technology SVGs are served locally from `public/tech`, with provenance in `SOURCES.txt`; there is no external icon service or 3D runtime dependency.


## Contact email
The public pages remain Next.js static exports. `npm run build` adds a small Worker endpoint at `/api/contact` and stages public files in `dist/client`. `npm run dev` runs Next.js with a local contact API on 127.0.0.1:3001.

Set `SENDGRID_API_KEY`, `SENDGRID_FROM_EMAIL` (a verified SendGrid sender), and `CONTACT_TO_EMAIL` in the ignored `.env`. Set the same production secrets through Sites runtime environment settings; `.env` is never bundled. Without credentials the form returns an honest unavailable message and offers direct email. The form uses a fixed recipient, server validation, same-origin checks, a honeypot, and best-effort per-isolate rate limiting. No email delivery has been verified until credentials are configured. Run `node --test server/contact.test.mjs` for mocked delivery and validation tests.
