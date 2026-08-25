// PWA 아이콘 + OG 기본 이미지 생성 스크립트 (일회성, 결과물은 git에 커밋)
// 실행: node scripts/generate-assets.mjs
import sharp from 'sharp';
import { readFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const p = (rel) => root + rel;
const CREAM = '#f3eae4';

await mkdir(p('public/icons'), { recursive: true });

const icon = await readFile(p('scripts/icon.svg'));

await sharp(icon).resize(192, 192).png().toFile(p('public/icons/icon-192.png'));
await sharp(icon).resize(512, 512).png().toFile(p('public/icons/icon-512.png'));
await sharp(icon).resize(180, 180).png().toFile(p('public/icons/apple-touch-icon.png'));

// maskable: 안드로이드가 원형 등으로 잘라내므로 그림을 안전영역(중앙 78%)에 축소 배치
const inner = await sharp(icon).resize(400, 400).png().toBuffer();
await sharp({ create: { width: 512, height: 512, channels: 4, background: CREAM } })
  .composite([{ input: inner, gravity: 'centre' }])
  .png()
  .toFile(p('public/icons/icon-512-maskable.png'));

// OG 기본 이미지 (1200x630): 크림 배경에 대표 보틀 3개 (public/images/wines/*.png 크롭 사용)
const bottles = ['bernard-lonclas-blanc-de-blanc-grand-brut', 'gigino-grande-toscana-rosso-g80-black', 'alambre-20-years'];
const composites = [];
const H = 440;
for (let i = 0; i < bottles.length; i++) {
  const buf = await sharp(p(`public/images/wines/${bottles[i]}.png`)).resize({ height: H }).png().toBuffer();
  const meta = await sharp(buf).metadata();
  composites.push({ input: buf, left: Math.round(300 + i * 220 - (meta.width ?? 0) / 2 + 80), top: Math.round((630 - H) / 2) });
}
await sharp({ create: { width: 1200, height: 630, channels: 4, background: CREAM } })
  .composite(composites)
  .png()
  .toFile(p('public/images/og-default.png'));

console.log('생성 완료: public/icons/*.png, public/images/og-default.png');
