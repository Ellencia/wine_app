import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

// 와인·생산자 데이터는 data/wines.xlsx(마스터) -> scripts/build_data.py -> src/data/*.json 으로 생성됨.
// 여기 스키마는 JSON의 최종 검문소: 필드가 빠지거나 값이 어긋나면 빌드가 멈춤.
export const WINE_TYPES = ['red', 'white', 'rose', 'sparkling', 'fortified', 'sweet', 'nonalcoholic'] as const;

const wines = defineCollection({
  loader: file('./src/data/wines.json'),
  schema: z.object({
    order: z.number(),
    catalogPage: z.number(),
    producer: z.string(),
    nameKo: z.string(),
    name: z.string(),
    vintage: z.string(),
    type: z.enum(WINE_TYPES),
    typeLabel: z.string(),
    country: z.string(),
    region: z.string(),
    varieties: z.string(),
    volume: z.string(),
    abv: z.number().nullable(),
    vivino: z.number().nullable(),
    scores: z.string(),
    awards: z.array(z.string()),
    badges: z.array(z.string()),
    note: z.string(),
    // 취향 퀴즈 4축 (1~5)
    body: z.number().int().min(1).max(5),
    sweetness: z.number().int().min(1).max(5),
    acidity: z.number().int().min(1).max(5),
    tannin: z.number().int().min(1).max(5),
    image: z.string(),
    vivinoUrl: z.string(),
  }),
});

const producers = defineCollection({
  loader: file('./src/data/producers.json'),
  schema: z.object({
    name: z.string(),
    nameKo: z.string(),
    country: z.string(),
    region: z.string(),
    story: z.string(),
    wineCount: z.number(),
  }),
});

const cocktails = defineCollection({
  loader: glob({ base: './src/content/cocktails', pattern: '**/*.md' }),
  schema: z.object({
    name: z.string(),
    nameKo: z.string().optional(),
    wineId: z.string().optional(), // 연결할 와인 id (src/data/wines.json 의 id)
    youtubeId: z.string().optional(), // 채우면 상세 페이지에 영상 임베드
    ingredients: z.array(z.string()),
    order: z.number().default(99),
  }),
});

export const collections = { wines, producers, cocktails };
