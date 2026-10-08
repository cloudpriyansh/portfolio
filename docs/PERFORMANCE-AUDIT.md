# Performance audit — 8 October 2026

## Reference and measurements

The supplied [PageSpeed report](https://pagespeed.web.dev/analysis/https-www-priyanshbuilds-com/2rs0j6g7u4?form_factor=mobile)
reported mobile performance **87**, desktop **99**, accessibility **97**, and
best practices / SEO **100**. Mobile LCP was **3.9 s**. It had no CrUX field data.

Local before/after checks used the exported production site, Lighthouse 13.5.0,
Chrome 154, Lighthouse's default mobile simulation, and its desktop preset.
The local baseline was commit `fdb32b4`. These are lab results on this computer,
not updated scores for the deployed domain. They are not directly comparable
to Google's report or a guarantee of real-user performance.

| Metric | Mobile before | Mobile after | Desktop before | Desktop after |
| --- | ---: | ---: | ---: | ---: |
| Performance | 73 | 88 | 98 | 100 |
| First contentful paint | 2.0 s | 1.2 s | 0.4 s | 0.3 s |
| Largest contentful paint | 5.2 s | 3.8 s | 1.1 s | 0.8 s |
| Total blocking time | 293 ms | 73 ms | 0 ms | 0 ms |
| Cumulative layout shift | 0 | 0 | <0.001 | 0 |
| Speed index | 2.6 s | 3.0 s | 0.8 s | 0.6 s |

Both final device checks scored **100** for accessibility, best practices, and
SEO. The initial local build used preview indexing settings, so its SEO score
is intentionally excluded from the comparison. The public report already had
100 SEO. The production checks used the public domain and enabled indexing.

The mobile Speed Index varied and did not improve in this sample. LCP and
blocking time improved; mobile LCP still needs confirmation on the deployed
origin. Raw local reports are in the ignored `tmp/performance/` directory.

## Changes

- Replace the CSS background sprite with a responsive `<picture>`, preserving
  the four-frame animation and transparency. AVIF is preloaded with matching
  `srcset` / `sizes` and high fetch priority; WebP remains the fallback.
- The sprite was 334,308 bytes. The desktop 1x AVIF is 51,946 bytes (84% smaller);
  the mobile 1.75x variant is 79,232 bytes (76% smaller). Other pixel densities
  choose their own size. Both final image-delivery audits pass.
- Re-encode project artwork from its reviewed originals, add 640px variants,
  and provide responsive Zyberon wordmarks. All original artwork is retained.
- Load Tailwind workspace utilities only on project routes. Homepage CSS drops
  from 19.9 to 15.7 KiB gzip. Initialize Tailwind's gradient/shadow variables
  on those routes while keeping its reset and container utility disabled.
- Preload the three above-the-fold fonts from stable self-hosted URLs. The
  original static export did not emit their preload links. Preserve the
  existing font files, swap behavior, and metric-adjusted fallbacks.
- Render the main heading immediately; retain the other decorative animation.
- Batch reveal measurements before style changes, update the reading progress
  bar directly instead of changing an inherited root variable, and coalesce
  sticky-card measurements into animation frames. Mobile forced-reflow audit
  passes; small geometry reads remain on desktop for sticky scrolling.
- Fix prohibited ARIA labels with appropriate image/group semantics, including
  the ticker identified by the supplied report.
- Pin Next's file-tracing root to this portfolio rather than the parent user's
  unrelated lockfile.

Framework compatibility code and React/Next hydration are retained. Lighthouse
can still flag unused framework JavaScript, compatibility polyfills, blocking
stylesheets, and DOM-size information. Removing required runtime code or hiding
case-study content to silence those notices would harm the site.

## Verification

- Production build and TypeScript compilation passed.
- `npm run check:performance`: exported preload hints, homepage CSS budget,
  hero byte budgets, project stylesheet separation, and 92 responsive image
  paths across all 12 pages.
- `node scripts/check-seo.mjs`: all 12 pages, canonicals, social images,
  structured data, internal links, robots, and sitemap.
- Browser checks at 390px mobile and 1440px desktop: navigation, light/dark
  appearance, no horizontal overflow, project styles, Growstack question-to-filter
  behavior, uR Agent rendering, and completion of an n8n sample scenario.

Build with the deployment's existing production environment. For a local
production audit in PowerShell:

```powershell
$env:SITE_URL = 'https://www.priyanshbuilds.com'
$env:ALLOW_INDEXING = 'true'
npm run build
npm run check:performance
node scripts/check-seo.mjs
npx --yes serve out -l 4173 --no-clipboard
```

In another terminal, run each Lighthouse audit separately with no simultaneous
builds or image encoding. Use `--preset=desktop` for the desktop run:

```powershell
$env:CHROME_PATH = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
npx --yes lighthouse@13.5.0 http://localhost:4173/ --chrome-flags="--headless=new" --only-categories=performance,accessibility,best-practices,seo
```

Regenerate image sizes with `scripts/optimize-site-images.mjs` and
`scripts/optimize-project-images.mjs` (run the latter for both `manifest.json`
and `new-covers.json` in `output/imagegen/projects/`).

After deployment, run a fresh PageSpeed analysis of the public URL on both
devices. An existing saved report does not update when code changes. Field
Core Web Vitals require real traffic and a separate observation period.
