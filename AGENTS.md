# 협업 규칙 (Claude Code · Codex · 사람 공통)

이 repo는 여러 에이전트와 사람이 번갈아 작업한다. 아래 규칙을 지키면 충돌 없이 이어 붙일 수 있다.

## 작업 시작

1. `git fetch` 후 `git status -sb` 로 origin/main 대비 ahead/behind 확인. behind 이면 `git pull --rebase` 먼저.
2. 파일을 전면 재작성하기 전에 `git log -p -3 -- <파일>` 로 최근 원격 변경을 확인하고 그 내용을 새 버전에 반영한다.

## 커밋·푸시

1. `git status` 로 변경 파일을 확인하고 **파일(또는 폴더)을 명시해서 add** 한다. `git add -A` 는 다른 작업자의 미완성 변경물이 섞일 수 있어 금지.
2. 커밋 메시지는 한국어 한 줄, 무엇을 왜 바꿨는지. 에이전트가 만든 커밋은 끝에 `(Claude)` 또는 `(Codex)` 를 붙인다.
3. push 후 GitHub Actions 에서 **내 커밋 SHA의 run** 이 success 인지 확인한다. 첫 폴링에 직전 run 을 잡는 실수 주의.
4. 작업을 끝낼 때 `astro dev stop` / `astro preview stop` 으로 백그라운드 서버를 종료한다. 남겨두면 다음 작업자가 4321 포트의 옛 코드를 보고 검증하게 된다 (실제로 발생했음).

## 데이터

1. 와인·생산자 데이터의 원본은 `data/wines.xlsx` 하나다. 수정 후 반드시 `python scripts/build_data.py` 를 실행해 `src/data/*.json` 을 갱신하고 함께 커밋한다. CI 가 엑셀에서 JSON 을 다시 만들어 비교하므로, 빠뜨리면 배포가 중단된다.
2. `src/data/*.json` 을 직접 편집하지 않는다.
3. **공급가·소비자가·재고·거래처 정보·직원 이름은 어떤 파일에도 넣지 않는다** (공개 repo). 카카오톡으로 받은 원본 PDF/xlsx 는 커밋하지 않는다.
4. 보틀 이미지는 `public/images/wines/<id>.png` (id 는 엑셀의 id 와 동일). 실제 제품 사진을 받으면 같은 파일명으로 덮어쓴다.
5. 스타일 프로필을 시음으로 검수했으면 엑셀의 `프로필 상태` 를 `verified` 로 바꾼다. 검수 전 와인은 `estimated` 로 둔다.

## 문서

1. 작업 후 `STATUS.md` 체크박스와 `update.md` 맨 위 날짜 블록(`## YYYY-MM-DD`, 첫 줄은 `-` 글머리표)을 갱신한다. 두 파일은 BOM 없는 UTF-8.
2. 답변·UI·문서에 이모지를 쓰지 않는다. 한국어로 답한다.

## Development

When starting the dev server, use background mode:

```sh
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: <https://docs.astro.build>

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
