# Search and AI discovery

The portfolio is prepared for name, applied AI engineering, and project technology searches. Case studies describe actual contributions, technical decisions, problems, and benefits. The homepage links to every project in server-rendered HTML. Page metadata, social previews, Person/ProfilePage/WebSite and project structured data describe the same visible work.

## Public domain launch

The public canonical origin is `https://www.priyanshbuilds.com`. The apex domain redirects to `www`. Private previews should remain noindex with an empty sitemap; do not submit a preview to search engines.

After connecting the public domain to hosting, set these **build-time** variables and rebuild/redeploy:

```text
SITE_URL=https://www.priyanshbuilds.com
ALLOW_INDEXING=true
GOOGLE_SITE_VERIFICATION=your-search-console-verification-token
BING_SITE_VERIFICATION=your-bing-webmaster-verification-token
```

Use the real HTTPS origin without a trailing slash. Verification tokens are optional when ownership is verified through DNS. Public indexing requires an explicit SITE_URL so the private fallback cannot accidentally become canonical for a public build.

Run `npm run build` and `node scripts/check-seo.mjs` with the same environment. Confirm the live domain returns 200 without login, canonical URLs point to it, robots allows crawling, and `/sitemap.xml` contains the homepage and all 11 projects. Redirect alternate domains to the chosen origin through hosting. Check that the host adds no `X-Robots-Tag: noindex` header.

Verify ownership in Google Search Console and Bing Webmaster Tools and submit the sitemap URL. Inspect the homepage and representative project URLs. Monitor indexing and actual search queries before making further content changes; rankings and AI citations are not guaranteed. Keep LinkedIn's website link consistent with the public domain.

## Social sharing and search favicon

The homepage uses `/social/portfolio.jpg`; each project uses `/social/projects/<slug>.jpg`. All social preview images are public 1200×630 JPEGs referenced through absolute HTTPS Open Graph and Twitter metadata. After deployment, use Meta's Sharing Debugger to scrape the homepage and one project URL, then use **Scrape Again** if Meta still shows a cached older image. Facebook controls the final share layout, so verify the image and text in its preview.

Google Search supports PNG and ICO favicons, while the old site declared only SVG. The site now advertises `/favicon.ico` and `/favicon.png` as well as SVG. Check that both files return 200 on the public host and request homepage reindexing in Search Console. Google may take time to refresh the icon in search results.

## Generative engine optimization (GEO)

The useful foundation is public crawlability, clear identity, descriptive links, and original, evidence-backed project content. Preserve contribution boundaries and avoid invented metrics, reviews, keyword stuffing, or duplicate pages for keyword variants. The existing llms.txt is a convenience summary, not a ranking mechanism.

Google's official guidance says SEO fundamentals also apply to generative AI search and that special AI files do not improve Google rankings: https://developers.google.com/search/docs/fundamentals/ai-optimization-guide

After launch, use search-console reports and referral analytics to evaluate discoverability. A successful local audit verifies implementation, not that a search engine has indexed the site.
