// 브랜드 상수 — 실제 브랜드명이 정해지면 여기만 바꾸면 전체에 반영됨
export const SITE_NAME = 'Wine Club';
export const SITE_DOMAIN = 'yourbrand.com';

// GitHub Pages처럼 하위 경로(/wine_app/)에 배포될 때를 위한 링크 헬퍼.
// 내부 링크·이미지 경로는 반드시 url('/...')로 감쌀 것.
export function url(path: string): string {
  const base = import.meta.env.BASE_URL;
  return (base.endsWith('/') ? base.slice(0, -1) : base) + path;
}
