# 올빈와인 앱 (wine_app)

(주)올빈와인 브랜드 와인 카탈로그 앱. 모바일 우선 정적 웹앱이며 GitHub Pages에 배포됨.
여러 사람·에이전트가 번갈아 작업하므로 **협업 규칙은 [AGENTS.md](AGENTS.md)** 를 따른다.

- 라이브: <https://ellencia.github.io/wine_app/>
- 기능: 와인 컬렉션(국가별·타입 필터) / 와인별 테크니컬 시트 + 스타일 프로필 / 생산자 소개 /
  Vivino 점수·링크 / 내 와인 취향 찾기 퀴즈 / 칵테일 레시피(영상) / PWA 홈 화면 설치
- 프레임워크: Astro 7 (정적 빌드, 서버 없음). 가격은 어떤 것도 표시하지 않음.

## 실행 방법

```text
npm install                                  # Node 의존성 설치
python -m pip install -r requirements.txt    # 엑셀 변환 도구 설치
npm run dev                                  # 개발 서버 (http://localhost:4321)
npm run build                                # 정적 빌드 및 데이터 스키마 검증
npm run preview                              # 빌드 결과 미리보기
```

## 데이터 흐름 (핵심)

```text
data/wines.xlsx  (마스터 — 사람이 편집)
      │  python scripts/build_data.py   (검증 + 변환)
      ▼
src/data/wines.json, producers.json  (앱이 읽는 파일 — 커밋 대상)
      │  npm run build / git push
      ▼
GitHub Pages 자동 배포
```

- **`data/wines.xlsx`** 가 유일한 원본. `wines` 시트(와인 1행 = 앱 1개)와 `producers` 시트, `안내` 시트로 구성.
  공급가·소비자가 컬럼은 의도적으로 없음.
- **`scripts/build_data.py`** 는 엑셀을 읽기만 하고(절대 다시 저장하지 않음) JSON을 만든다.
  와인·생산자 id 중복, 생산자 id 불일치, 타입코드 오류, 정수가 아닌 값 또는 1~5 범위 밖 점수,
  이미지 파일 누락을 한국어 메시지로 잡아 중단함.
- **`src/content.config.ts`** 의 Zod 스키마가 JSON의 최종 검문소.
- **GitHub Actions** 는 배포 전에 엑셀에서 JSON을 다시 생성하고 커밋된 JSON과 비교한다.
  두 파일이 다르면 JSON 갱신 누락으로 보고 배포를 중단한다.
- `data/catalog-2026-n3.json` 은 카탈로그(와인리스트 2026 N°3) 전사 원본 기록(공급가 제외). 참고용.
- `templates/와인데이터_입력템플릿.xlsx` 는 초기 스키마(md 파일 시절) 기준의 입력 양식. 컬럼이 현재
  마스터와 다르므로 데이터 입력은 `data/wines.xlsx` 에 직접 할 것. 단, 이 파일의 `작성 가이드` 시트에 있는
  바디·당도·산도·타닌 1~5 점수 기준표는 그대로 유효함.
- `scripts/bootstrap_catalog.py` 는 전사 JSON에서 엑셀·이미지를 처음 만들 때 쓴 일회성 스크립트.

### 와인 추가·수정

1. `data/wines.xlsx` 의 `wines` 시트에 행 추가/수정 (id 는 영문 소문자·하이픈, 한 번 정하면 바꾸지 말 것)
2. 보틀 이미지를 `public/images/wines/<id>.png` 로 저장 (배경 투명 PNG 권장, 없어도 흰 배경 PNG 가능)
3. `python scripts/build_data.py` → 오류 없으면 `src/data/*.json` 갱신
4. `npm run build` 로 확인 후 `git add -A && git commit && git push`

### 타입코드

`red` 레드 / `white` 화이트 / `rose` 로제 / `sparkling` 스파클링 / `fortified` 주정강화 /
`sweet` 스위트(귀부·아이스바인·아우스레제 등) / `nonalcoholic` 논알코올

### 스타일 프로필 (바디·당도·산도·타닌 1~5)

취향 퀴즈의 근거 데이터. 초기값은 종류·품종·도수·산지 규칙으로 자동 산출한 것이므로
시음 판단으로 엑셀에서 조정하면 됨. 척도는 WSET 5단계와 같음.

- **`프로필 상태` 컬럼**: `estimated`(기본, 상세 화면에 "추정치 · 검수 전" 표시) / `verified`(시음 검수 완료).
  검수한 와인만 verified 로 바꿀 것. 퀴즈는 거리가 같을 때 verified 와인을 먼저 보여줌.
- 검수 권장 절차: 주력 20종부터, 와인 경험자 3명이 개별 채점 → 중앙값 채택, 세미 블라인드, 온도·잔 통일.

### 품종 태그

- **`품종 태그` 컬럼**을 비워두면 `품종` 컬럼에서 자동 생성됨 (비율·괄호 제거, 표기 통일).
  통일 사전은 `scripts/wine_utils.py` 의 `SYNONYMS` — 예: 피노누아/피노네로 → 피노 누아,
  또우리가 나씨오날 → 토우리가 나시오날, 아라고네즈/틴타 로리즈 → 템프라니요(같은 품종).
- 직접 넣으면 그 값이 우선. 홈의 품종 칩(2종 이상 쓰인 품종만 노출)과 상세 페이지 태그 링크에 쓰임.
- 상황·페어링·대상 태그(occasion/pairing/audience)는 데이터에서 유도할 수 없어 아직 컬럼이 없음.
  클라이언트가 채울 준비가 되면 같은 방식으로 추가.

### 용어사전

- `src/content/glossary/*.md` — 용어 1개 = 파일 1개 (term, termEn, aliases, category, order + 본문).
- `aliases` 에 적은 표기가 와인 이름·테크시트(종류·빈티지·산지)·한 줄 소개에 나오면 자동으로
  `/glossary#id` 링크가 붙음 (점선 밑줄). 용어를 추가하면 링크도 자동.
- 카테고리: 기본 / 등급 / 산지 / 양조 / 당도 / 시음 / 재배

### Vivino

- `Vivino 점수` 컬럼 값이 상세 페이지에 표시됨 (카탈로그 기준)
- `Vivino URL` 컬럼을 비우면 와인명+빈티지 검색 링크가 자동 생성되고, 정확한 Vivino 페이지 주소를
  넣으면 그 주소로 연결됨. Vivino는 공개 API·임베드가 없어 링크가 최대치임

## 폴더 구조

```text
data/                   # 마스터 엑셀 + 카탈로그 전사 원본
scripts/                # build_data.py(엑셀→JSON), bootstrap_catalog.py(일회성), generate-assets.mjs(아이콘·OG)
src/
  consts.ts             # 브랜드명·도메인·타입 라벨·국가 순서·url() 헬퍼
  content.config.ts     # 데이터 스키마
  data/                 # 생성된 JSON (직접 편집 금지)
  content/cocktails/    # 칵테일 1개 = md 1개 (youtubeId 채우면 영상 임베드)
  content/glossary/     # 와인 용어 1개 = md 1개
  lib/glossary.ts       # 용어 자동 링크
  layouts/, components/ # 공통 뼈대, 헤더/푸터, 뱃지, 점수 점, 유튜브
  pages/                # 홈(컬렉션), wines/[slug], producers/, glossary, cocktails/, quiz, 404
  styles/global.css     # 디자인 토큰 — 색·폰트·여백은 :root 에서 조정
public/images/wines/    # 보틀 이미지 (<id>.png)
```

## 부가 기능

- **홈 화면 설치(PWA)**: 폰 브라우저에서 "홈 화면에 추가". 아이콘 원본 `scripts/icon.svg`,
  수정 후 `node scripts/generate-assets.mjs` 로 재생성
- **퀴즈 결과 공유**: 결과가 URL(`?r=...&p=...`)에 실려 링크 받은 사람도 같은 화면을 봄
- **테크시트 인쇄**: 와인 상세에서 Ctrl+P 하면 탐색 요소가 빠진 A4 시트로 출력
- **공유 미리보기(OG)**: 와인 페이지는 보틀 이미지, 그 외는 `public/images/og-default.png`

## 이미지 참고

현재 보틀 이미지는 카탈로그 PDF(스캔)에서 잘라낸 것이라 일부에 NEW/BEST 스티커가 남아 있음.
생산자 원본 제품 사진을 받으면 같은 파일명으로 덮어쓰면 됨.
