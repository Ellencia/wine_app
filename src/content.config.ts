import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// 와인 1병 = src/content/wines/ 의 md 파일 1개.
// 필수 필드가 빠지거나 값 범위가 어긋나면 빌드가 에러로 멈춰서 실수를 즉시 잡아줌.
const wines = defineCollection({
  loader: glob({ base: './src/content/wines', pattern: '**/*.md' }),
  schema: z.object({
    name: z.string(),
    nameKo: z.string().optional(),
    producer: z.string(),
    varieties: z.string(),
    vintage: z.string(), // NV 스파클링 대응을 위해 문자열
    country: z.string(),
    region: z.string(),
    appellation: z.string().optional(),
    abv: z.number(),
    vinification: z.string().optional(),
    aging: z.string().optional(),
    rs: z.number().optional(), // 잔당 g/L
    ta: z.number().optional(), // 총산 g/L
    ph: z.number().optional(),
    pairing: z.string().optional(),
    servingTemp: z.string().optional(),
    type: z.enum(['red', 'white', 'rose', 'orange', 'sparkling']),
    // 취향 퀴즈 매칭용 4축 프로필 (1~5)
    body: z.number().int().min(1).max(5),
    sweetness: z.number().int().min(1).max(5),
    acidity: z.number().int().min(1).max(5),
    tannin: z.number().int().min(1).max(5),
    image: z.string(),
    order: z.number().default(99),
  }),
});

const cocktails = defineCollection({
  loader: glob({ base: './src/content/cocktails', pattern: '**/*.md' }),
  schema: z.object({
    name: z.string(),
    nameKo: z.string().optional(),
    wineId: z.string().optional(), // 연결할 와인 파일명(확장자 제외)
    youtubeId: z.string().optional(), // 채우면 상세 페이지에 영상 임베드
    ingredients: z.array(z.string()),
    order: z.number().default(99),
  }),
});

export const collections = { wines, cocktails };
