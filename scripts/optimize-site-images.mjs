import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

// Keep the reviewed source assets unchanged so generated sizes are reproducible.
await mkdir('public/hero', { recursive: true });
for (const width of [1200, 1380, 2016, 2172]) {
  const sprite = sharp('public/developer-sprites.webp').resize(width, width / 3);
  for (const format of ['avif', 'webp']) {
    const result = await sprite.clone()[format]({ quality: format === 'avif' ? 48 : 72, effort: 6 })
      .toFile(`public/hero/developer-${width}.${format}`);
    console.log(`Hero ${width} ${format}: ${result.size} bytes`);
  }
}
for (const width of [320, 480, 800]) {
  await sharp('public/projects/zyberon-brand.webp').resize({ width })
    .webp({ quality: 82, effort: 6 }).toFile(`public/projects/zyberon-brand-${width}.webp`);
}
// This cover has no lossless source in the repository. Only derive its missing size.
for (const format of ['avif', 'webp']) {
  await sharp('public/projects/voice-agent-1280.webp').resize(640, 400)
    [format]({ quality: format === 'avif' ? 48 : 76, effort: 5 })
    .toFile(`public/projects/voice-agent-640.${format}`);
}
