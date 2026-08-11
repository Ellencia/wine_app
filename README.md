# 와인 브랜드 앱 (wine_app)

IGNEA wine club 풍의 모바일 우선 정적 웹앱 프로토타입.
기능 4개: 와인 카탈로그 / 테크니컬 시트 / 칵테일 레시피(영상) / 내 와인 취향 찾기 퀴즈.

- 프레임워크: Astro 7 (정적 빌드, 서버 없음)
- 데이터: 마크다운 파일 (와인 1병 = 파일 1개), Zod 스키마로 빌드 시 검증
- 배포 목표: GitHub + Cloudflare Pages (무료)

## 실행 방법

```text
npm run dev       # 개발 서버 (http://localhost:4321) — 저장하면 즉시 반영
npm run build     # dist/ 에 정적 파일 생성. 데이터 오류가 있으면 여기서 에러로 잡힘
npm run preview   # 빌드 결과 미리보기
```

같은 와이파이의 휴대폰에서 보려면: `npm run dev -- --host` 실행 후
PC의 IP로 접속 (예: `http://192.168.x.x:4321`).

## 폴더 구조

```text
src/
  consts.ts               # 브랜드명·도메인 — 실제 브랜드 정해지면 여기만 수정
  content.config.ts       # 데이터 스키마 (필드 추가/수정은 여기부터)
  content/
    wines/*.md            # 와인 1병 = 파일 1개 (본문 = 테이스팅 노트)
    cocktails/*.md        # 칵테일 1개 = 파일 1개 (본문 = 만드는 법)
  layouts/Base.astro      # 공통 뼈대 (헤더·푸터·폰트)
  components/             # 헤더, 푸터, 점수 점, 유튜브 임베드
  pages/                  # 홈(컬렉션), wines/[slug], cocktails/, quiz
  styles/global.css       # 디자인 토큰 — 색·폰트·여백은 맨 위 :root 에서 조정
public/images/wines/      # 보틀 이미지 (현재 SVG 플레이스홀더)
```

## 와인 추가하는 법

`src/content/wines/` 에 새 md 파일을 만들면 끝. 목록·상세·퀴즈에 자동 반영됨.

```markdown
---
name: "와인 이름 (라벨 원어)"
producer: "생산자"
varieties: "Malbec 100%"
vintage: "2022"            # NV 도 가능
country: "Argentina"
region: "Mendoza"
abv: 13.5
pairing: "어울리는 음식"
servingTemp: "16-18°C"
type: "red"                # red | white | rose | orange | sparkling
body: 3                    # 아래 4개는 취향 퀴즈용 1~5 점수
sweetness: 1
acidity: 3
tannin: 3
image: "/images/wines/파일명.svg"
order: 4                   # 목록 정렬 순서
---

테이스팅 노트 본문. 상세 페이지 설명 문단으로 표시됨.
```

필수 필드가 빠지거나 점수가 1~5를 벗어나면 빌드가 에러로 멈춰서 알려줌.
선택 필드: nameKo, appellation, vinification, aging, rs, ta, ph.

## 칵테일 영상 연결

1. 제작해둔 영상을 YouTube에 "일부공개(unlisted)"로 업로드
2. 영상 주소의 ID (예: youtube.com/watch?v=`abc123`) 를
   `src/content/cocktails/*.md` 의 frontmatter에 추가:

```yaml
youtubeId: "abc123"
```

ID가 없으면 "Video Coming Soon" 자리표시가 뜨고, 넣으면 임베드로 바뀜.

## 취향 퀴즈

- 질문·가점 정의: `src/pages/quiz.astro` 상단의 `questions` 배열
- 로직: 답변으로 바디·당도·산도·타닌 4축 점수를 만들고,
  각 와인의 4축 점수와의 절대차 합(맨해튼 거리)이 가장 작은 와인을 추천
- 와인 쪽 점수는 각 md의 body/sweetness/acidity/tannin 값 — 와인을 추가하면
  퀴즈에도 자동 포함됨

## 부가 기능

- **홈 화면 설치(PWA)**: 폰 브라우저에서 "홈 화면에 추가"하면 주소창 없는
  독립 앱처럼 실행됨. 아이콘 원본은 `scripts/icon.svg` — 수정했으면
  `node scripts/generate-assets.mjs` 로 PNG 재생성 후 커밋
- **퀴즈 결과 공유**: 결과 화면의 "결과 공유하기" 버튼. 결과가 URL(`?r=...`)에
  실려 있어서 링크를 받은 사람도 같은 결과 화면을 봄
- **테크시트 인쇄**: 와인 상세 페이지에서 브라우저 인쇄(Ctrl+P)하면
  탐색 요소가 빠진 A4 테크니컬 시트로 나옴 — 거래처 배포용
- **공유 미리보기(OG)**: 지금은 기본 이미지(`public/images/og-default.png`).
  와인의 image를 실제 사진(jpg/png)으로 바꾸면 그 와인 페이지는 공유 시
  해당 사진이 미리보기로 자동 사용됨 (SVG는 SNS가 못 읽어 기본 이미지 사용)
- **데이터 검증**: 칵테일의 wineId가 존재하지 않는 와인을 가리키면 빌드가
  한국어 에러로 멈춤

## 지금 들어있는 샘플 데이터 (교체 필요)

- 와인 3종은 디자인 목업(IGNEA) 기준으로 전사한 것이고, 양조·숙성 등
  일부 값은 "(샘플 값)" 표시된 임의 데이터임. 실제 보유 와인으로 교체할 것
- 보틀 이미지는 SVG 일러스트 플레이스홀더. 실제 누끼(또는 균일 배경) 사진을
  `public/images/wines/` 에 넣고 image 경로만 바꾸면 됨 — 최종 인상의 절반은 사진임
- 브랜드명 "Wine Club" 과 도메인은 `src/consts.ts` 에서 수정

## 다음 단계 (배포)

1. GitHub에 새 repo 생성 (LICENSE 포함해서 만들기) 후 이 폴더 연결
2. Cloudflare Pages 에서 repo 연결 — 빌드 명령 `npm run build`, 출력 `dist`
3. 이후 push 할 때마다 1~2분 내 자동 재배포
