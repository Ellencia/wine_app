# wine_app — Claude Code 지침

협업 규칙·데이터 규칙은 [AGENTS.md](AGENTS.md) 가 단일 출처다. 작업 전에 읽고 그대로 따른다.

요약:

- 시작 전 `git fetch` → `git status -sb`, behind 이면 `git pull --rebase`
- 커밋은 파일 명시 add, `git add -A` 금지, 메시지 끝에 `(Claude)`
- 데이터 원본은 `data/wines.xlsx`, 수정 후 `python scripts/build_data.py` 실행해 JSON 함께 커밋
- 공급가·소비자가·재고·거래처 정보는 어떤 파일에도 넣지 않음
- push 후 내 커밋 SHA 의 Actions run 이 success 인지 확인
- STATUS.md / update.md 갱신, 이모지 금지, 한국어

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
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
