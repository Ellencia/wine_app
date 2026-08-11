import { SITE_NAME, url } from '../consts';

// PWA 매니페스트 — base 경로가 바뀌어도 url() 헬퍼가 따라가도록 정적 파일 대신 엔드포인트로 생성
export function GET() {
  const manifest = {
    name: SITE_NAME,
    short_name: SITE_NAME,
    start_url: url('/'),
    scope: url('/'),
    display: 'standalone',
    background_color: '#fefdfb',
    theme_color: '#fefdfb',
    icons: [
      { src: url('/icons/icon-192.png'), sizes: '192x192', type: 'image/png' },
      { src: url('/icons/icon-512.png'), sizes: '512x512', type: 'image/png' },
      { src: url('/icons/icon-512-maskable.png'), sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
  return new Response(JSON.stringify(manifest), {
    headers: { 'Content-Type': 'application/manifest+json' },
  });
}
