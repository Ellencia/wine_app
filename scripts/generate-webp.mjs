// public/images/wines/*.png -> 같은 자리 *.webp (표시용) + src/data/wine-image-dims.json (width/height 속성용)
// PNG 원본은 OG 이미지·외부 호환용으로 유지하고, 페이지 <img>는 WebP를 쓴다.
// 실행: npm run images  (보틀 PNG를 추가·교체할 때마다)
import { readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const DIR = new URL('../public/images/wines/', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const OUT_DIMS = new URL('../src/data/wine-image-dims.json', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');

const files = (await readdir(DIR)).filter((f) => f.endsWith('.png')).sort();
const dims = {};
let bytesPng = 0;
let bytesWebp = 0;
for (const file of files) {
  const id = file.replace(/\.png$/, '');
  const src = path.join(DIR, file);
  const img = sharp(src);
  const meta = await img.metadata();
  dims[id] = { w: meta.width, h: meta.height };
  const out = await img.webp({ quality: 82, effort: 6 }).toFile(path.join(DIR, `${id}.webp`));
  bytesPng += meta.size ?? 0;
  bytesWebp += out.size;
}
await writeFile(OUT_DIMS, JSON.stringify(dims, null, 1) + '\n');
console.log(
  `OK: ${files.length}개 변환 — PNG ${(bytesPng / 1048576).toFixed(1)}MB -> WebP ${(bytesWebp / 1048576).toFixed(1)}MB, dims -> src/data/wine-image-dims.json`,
);
