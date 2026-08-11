# 변경 이력

## 2026-08-12
- 부가기능 7종 추가: PWA 홈 화면 설치(manifest+아이콘), OG 공유 미리보기, 퀴즈 결과 URL 공유(Web Share), 테크시트 인쇄 CSS, 404 페이지, 사이트맵, 칵테일 wineId 빌드 검증, 와인 상세 이전/다음 네비
- GitHub Pages 배포 완료 — https://ellencia.github.io/wine_app/ (repo Ellencia/wine_app, MIT LICENSE, Actions 자동 배포)
- 하위 경로 배포 대응: astro.config에 site/base 설정, 내부 링크·이미지 전부 url() 헬퍼로 base 프리픽스 처리
- Astro 7 정적 웹앱 프로토타입 첫 구축 — 카탈로그·테크니컬 시트·칵테일 레시피·취향 퀴즈 4기능 완성, IGNEA풍 디자인 재현
- 목업의 와인 3종을 샘플 데이터로 입력, 보틀은 SVG 플레이스홀더 일러스트
- 빌드 8페이지 통과, 390px 모바일 뷰포트에서 전 페이지 스크린샷·퀴즈 클릭 구동 검증 (가로 오버플로 없음)
