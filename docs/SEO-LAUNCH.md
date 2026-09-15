# Search and AI discovery

The portfolio is prepared for name, applied AI engineering, and project technology searches. Case studies describe actual contributions, technical decisions, problems, and benefits. The homepage links to every project in server-rendered HTML. Page metadata, social previews, Person/ProfilePage/WebSite and project structured data describe the same visible work.

## Public domain launch

The owner plans to buy a domain later. Until then, the private preview intentionally remains noindex with an empty sitemap. Do not submit the preview to search engines.

After connecting the public domain to hosting, set these **build-time** variables and rebuild/redeploy:

```text
SITE_URL=https://your-domain.com
ALLOW_INDEXING=true
GOOGLE_SITE_VERIFICATION=your-search-console-verification-token
BING_SITE_VERIFICATION=your-bing-webmaster-verification-token
```

Use the real HTTPS origin without a trailing slash. Verification tokens are optional when ownership is verified through DNS. Public indexing requires an explicit SITE_URL so the private fallback cannot accidentally become canonical for a public build.

Run `npm run build` and `node scripts/check-seo.mjs` with the same environment. Confirm the live domain returns 200 without login, canonical URLs point to it, robots allows crawling, and `/sitemap.xml` contains the homepage and all 11 projects. Redirect alternate domains to the chosen origin through hosting. Check that the host adds no `X-Robots-Tag: noindex` header.

Verify ownership in Google Search Console and Bing Webmaster Tools and submit the sitemap URL. Inspect the homepage and representative project URLs. Monitor indexing and actual search queries before making further content changes; rankings and AI citations are not guaranteed. Keep LinkedIn's website link consistent with the public domain.

## Generative engine optimization (GEO)

The useful foundation is public crawlability, clear identity, descriptive links, and original, evidence-backed project content. Preserve contribution boundaries and avoid invented metrics, reviews, keyword stuffing, or duplicate pages for keyword variants. The existing llms.txt is a convenience summary, not a ranking mechanism.

Google's official guidance says SEO fundamentals also apply to generative AI search and that special AI files do not improve Google rankings: https://developers.google.com/search/docs/fundamentals/ai-optimization-guide

After launch, use search-console reports and referral analytics to evaluate discoverability. A successful local audit verifies implementation, not that a search engine has indexed the site.
