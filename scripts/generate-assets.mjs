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

// OG 기본 이미지 (1200x630): 크림 배경에 보틀 3개
const bottles = ['tinto-de-los-sauces', 'kung-fu-pet-nat', 'malbec-primero'];
const composites = [];
for (let i = 0; i < bottles.length; i++) {
  const buf = await sharp(await readFile(p(`public/images/wines/${bottles[i]}.svg`)))
    .resize({ height: 420 })
    .png()
    .toBuffer();
  composites.push({ input: buf, left: 330 + i * 200, top: 105 });
}
await sharp({ create: { width: 1200, height: 630, channels: 4, background: CREAM } })
  .composite(composites)
  .png()
  .toFile(p('public/images/og-default.png'));

console.log('생성 완료: public/icons/*.png, public/images/og-default.png');
