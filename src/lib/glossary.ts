// 용어사전 자동 링크: 텍스트 안의 용어 표기(aliases)를 /glossary#id 링크로 감싼다.
// 용어당 첫 등장 한 번만 링크하고, 영문 표기는 단어 경계를 지켜 "NV"가 "Convento" 안에서 잡히지 않게 한다.

export type TermIndexEntry = { id: string; alias: string };

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export function buildTermIndex(
  entries: { id: string; data: { term: string; aliases: string[] } }[],
): TermIndexEntry[] {
  const list: TermIndexEntry[] = [];
  for (const e of entries) {
    for (const alias of [e.data.term, ...e.data.aliases]) list.push({ id: e.id, alias });
  }
  // 긴 표기부터 매칭해야 "그랑 크뤼 클라세"가 "그랑 크뤼"보다 먼저 잡힘
  return list.sort((a, b) => b.alias.length - a.alias.length);
}

export function linkTerms(text: string, index: TermIndexEntry[], href: (id: string) => string): string {
  let html = escapeHtml(text);
  const used = new Set<string>();
  for (const { id, alias } of index) {
    if (used.has(id)) continue;
    const body = escapeRe(escapeHtml(alias));
    const latin = /^[A-Za-z]/.test(alias) || /[A-Za-z]$/.test(alias);
    const re = new RegExp(latin ? `(?<![A-Za-z])${body}(?![A-Za-z])` : body, 'i');
    const m = re.exec(html);
    if (!m) continue;
    const before = html.slice(0, m.index);
    // 이미 만든 링크 안쪽이면 건너뜀
    if ((before.match(/<a /g) || []).length > (before.match(/<\/a>/g) || []).length) continue;
    html = `${before}<a class="term" href="${href(id)}">${m[0]}</a>${html.slice(m.index + m[0].length)}`;
    used.add(id);
  }
  return html;
}
