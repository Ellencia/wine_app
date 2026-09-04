// 브랜드 상수
export const SITE_NAME = 'Allvin Wine';
export const COMPANY = '(주)올빈와인';
export const EDITION = '와인리스트 2026 N°3'; // PC 푸터 우측 표기 — 카탈로그 개정 시 갱신
export const SITE_DOMAIN = 'allvintage.co.kr';
export const SITE_URL = 'https://www.allvintage.co.kr';
export const SITE_DESCRIPTION = '올빈와인 브랜드 와인 카탈로그 — 테크니컬 시트, 생산자 소개, 내 와인 취향 찾기';

// 타입코드 -> 화면 표기
export const TYPE_LABELS: Record<string, string> = {
  red: '레드',
  white: '화이트',
  rose: '로제',
  sparkling: '스파클링',
  fortified: '주정강화',
  sweet: '스위트',
  nonalcoholic: '논알코올',
};

// 컬렉션 화면의 국가 정렬 순서 (카탈로그 순)
export const COUNTRY_ORDER = ['프랑스', '이탈리아', '포르투갈', '스페인', '독일', '우루과이', '칠레'];

// GitHub Pages처럼 하위 경로(/wine_app/)에 배포될 때를 위한 링크 헬퍼.
// 내부 링크·이미지 경로는 반드시 url('/...')로 감쌀 것.
export function url(path: string): string {
  const base = import.meta.env.BASE_URL;
  return (base.endsWith('/') ? base.slice(0, -1) : base) + path;
}

// 세부 산지가 국가와 같으면 국가만 표기 ("프랑스, 프랑스" 방지)
export function regionLabel(region: string, country: string): string {
  return region === country ? country : `${region}, ${country}`;
}

// 보틀 PNG 경로 -> 표시용 WebP 경로 (PNG 원본은 OG 이미지·외부 호환용으로 유지)
export function webp(image: string): string {
  return image.replace(/\.png$/, '.webp');
}
