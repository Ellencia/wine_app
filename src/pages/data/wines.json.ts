import wines from '../../data/wines.json';

// 와인 카탈로그를 사이트에 그대로 공개 (/data/wines.json).
// 내부 통계 도구(wine_stats)가 와인명 매칭에 쓰며, 가격 정보는 원래 들어있지 않음.
export function GET() {
  return new Response(JSON.stringify(wines), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
