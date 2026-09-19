import { readFile, readdir, stat } from 'node:fs/promises';
import assert from 'node:assert/strict';

const home = await readFile('out/index.html', 'utf8');
const sitemap = await readFile('out/sitemap.xml', 'utf8');
const robots = await readFile('out/robots.txt', 'utf8');
const paths = ['/'];
for (const entry of await readdir('out/projects', { withFileTypes: true })) {
  if (entry.isDirectory()) paths.push(`/projects/${entry.name}/`);
}
const titles = new Set();
for (const path of paths) {
  const html = await readFile(`out${path}index.html`, 'utf8');
  const title = html.match(/<title>(.*?)<\/title>/)?.[1];
  assert(title?.includes('Priyansh Dobariya'), `Missing identity: ${path}`);
  assert(!titles.has(title), `Duplicate title: ${path}`);
  titles.add(title);
  assert.equal((html.match(/<h1[ >]/g) || []).length, 1, `Heading count: ${path}`);
  assert(html.includes('name="description"'), `Missing description: ${path}`);
  const ogTitle = html.match(/<meta property="og:title" content="([^"]+)"/)?.[1];
  const ogDescription = html.match(/<meta property="og:description" content="([^"]+)"/)?.[1];
  const ogImage = html.match(/<meta property="og:image" content="([^"]+)"/)?.[1];
  assert(ogTitle && ogDescription, `Missing social copy: ${path}`);
  assert(ogImage?.startsWith(`${process.env.SITE_URL || new URL(ogImage).origin}/social/`) && ogImage.endsWith('.jpg'), `Social image URL: ${path}`);
  assert(html.includes('property="og:image:width" content="1200"') && html.includes('property="og:image:height" content="630"'), `Social image dimensions: ${path}`);
  assert((await stat(`out${new URL(ogImage).pathname}`)).size > 10000, `Missing social image file: ${path}`);
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/ )?.[1];
  assert(canonical && new URL(canonical).pathname === path, `Canonical: ${path}`);
  for (const match of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)) {
    assert(JSON.parse(match[1])['@graph']?.length, `Invalid structured data: ${path}`);
  }
  const indexable = /name="robots" content="index, follow"/.test(html);
  if (process.env.ALLOW_INDEXING === 'true') {
    assert(indexable && !html.includes('noindex'), `Blocked public page: ${path}`);
    assert(sitemap.includes(`<loc>${canonical}</loc>`), `Missing sitemap URL: ${path}`);
    assert.equal(new URL(canonical).origin, process.env.SITE_URL);
    assert(robots.includes('Allow: /') && !robots.includes('Disallow: /'));
  } else {
    assert(!indexable && html.includes('noindex'), `Indexable preview: ${path}`);
    assert(!sitemap.includes('<loc>') && robots.includes('Disallow: /'));
  }
  if (path !== '/') assert(home.includes(`href="${path}"`), `Orphan project: ${path}`);
}
assert(home.includes('href="/favicon.ico"') && home.includes('href="/favicon.png"'), 'Missing raster favicon links');
assert((await stat('out/favicon.ico')).size > 0 && (await stat('out/favicon.png')).size > 0, 'Missing raster favicon files');
assert.equal((sitemap.match(/<loc>/g) || []).length, process.env.ALLOW_INDEXING === 'true' ? paths.length : 0);
console.log(`SEO verified: ${paths.length} pages, unique titles, canonicals, social previews, raster favicons, structured data, internal links, robots and sitemap.`);
