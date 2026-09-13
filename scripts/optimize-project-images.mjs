import sharp from 'sharp';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

// Re-encode the reviewed ImageGen originals for the static Next.js export.
// Usage: node scripts/optimize-project-images.mjs
const manifestPath = 'output/imagegen/projects/manifest.json';
const projects = JSON.parse(await readFile(manifestPath, 'utf8'));
const target = 'public/projects';
await mkdir(target, { recursive: true });
const report = [];
for (const project of projects) {
  for (const width of [480, 800, 1280]) {
    const height = Math.round(width * 5 / 8);
    const resized = sharp(project.source).rotate().resize(width, height, { fit: 'cover', position: 'centre' });
    const outputs = await Promise.all([
      resized.clone().avif({ quality: 55, effort: 5 }).toFile(path.join(target, `${project.id}-${width}.avif`)),
      resized.clone().webp({ quality: 82, effort: 5 }).toFile(path.join(target, `${project.id}-${width}.webp`)),
    ]);
    report.push({ project: project.id, width, avifBytes: outputs[0].size, webpBytes: outputs[1].size });
  }
}
await writeFile('output/imagegen/projects/optimization.json', JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
