import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';

// Check the exported artifact, not the source: preload hints and route CSS can
// be lost during bundling even when the components look correctly configured.
const home = await readFile('out/index.html', 'utf8');
const cssPaths = [...new Set([...home.matchAll(/<link[^>]+href="([^"]+\.css)"/g)].map(match => match[1]))];
let cssBytes = 0;
for (const path of cssPaths) cssBytes += gzipSync(await readFile(`out${path}`)).length;
assert(cssBytes < 17 * 1024, `Homepage CSS exceeds 17 KiB gzip: ${cssBytes}`);
assert(!home.includes('/developer-sprites.webp'), 'Homepage downloads the unoptimized sprite');
assert.match(home, /<link[^>]+as="image"[^>]+imageSrcSet="\/hero\/[^>]+fetchPriority="high"/);
assert.match(home, /<img[^>]+class="character-sprite"[^>]+fetchPriority="high"[^>]+loading="eager"/);

for (const font of ['manrope', 'dm-sans', 'instrument-serif-italic']) {
  const link = [...home.matchAll(/<link\b[^>]*>/g)].map(match => match[0])
    .find(tag => tag.includes(`href="/fonts/${font}.woff2"`) && tag.includes('rel="preload"'));
  assert(link && /as="font"/.test(link) && /crossorigin="anonymous"/i.test(link), `Missing ${font} preload`);
}
for (const width of [1200, 1380, 2016, 2172]) {
  assert((await stat(`out/hero/developer-${width}.avif`)).size < 100 * 1024, 'Hero exceeds 100 KiB');
}

const projectDirectories = (await readdir('out/projects', { withFileTypes: true })).filter(entry => entry.isDirectory());
const pages = ['out/index.html', ...projectDirectories.map(entry => `out/projects/${entry.name}/index.html`)];
const images = new Set();
for (const page of pages) {
  const html = await readFile(page, 'utf8');
  for (const match of html.matchAll(/(?:src|srcSet)="([^"]+)"/g)) {
    for (const candidate of match[1].split(',')) {
      const url = candidate.trim().split(/\s+/)[0];
      if (/^\/(?:projects|hero)\/.*\.(avif|webp)$/.test(url)) images.add(url);
    }
  }
  if (page !== pages[0]) {
    const projectCss = [...html.matchAll(/<link[^>]+href="([^"]+\.css)"/g)].map(match => match[1]);
    assert(projectCss.some(path => !cssPaths.includes(path)), `Missing project-only stylesheet: ${page}`);
  }
}
for (const url of images) assert((await stat(`out${url}`)).size > 0, `Missing responsive image: ${url}`);
console.log(`Performance assets verified: ${pages.length} pages, ${images.size} images, ${(cssBytes / 1024).toFixed(1)} KiB homepage CSS (gzip), early hero and font preloads.`);
