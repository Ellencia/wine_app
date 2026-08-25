# data/wines.xlsx (마스터) -> src/data/wines.json, src/data/producers.json
# 읽기 전용으로만 연다 (openpyxl로 기존 xlsx를 다시 저장하지 않음).
# 실행: python scripts/build_data.py
import json, os, sys, urllib.parse
from openpyxl import load_workbook

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
XLSX = os.path.join(ROOT, "data", "wines.xlsx")
OUT = os.path.join(ROOT, "src", "data")
TYPES = {"red", "white", "rose", "sparkling", "fortified", "sweet", "nonalcoholic"}
WINE_KEYS = ["id", "order", "catalogPage", "producer", "nameKo", "name", "vintage", "type", "typeLabel", "country", "region",
             "varieties", "volume", "abv", "vivino", "scores", "awards", "badges", "note", "body", "sweetness", "acidity", "tannin", "vivinoUrl"]
PROD_KEYS = ["id", "name", "nameKo", "country", "region", "story"]

wb = load_workbook(XLSX, read_only=True, data_only=True)
errors = []


def read_sheet(name, keys):
    ws = wb[name]
    out = []
    for i, row in enumerate(ws.iter_rows(min_row=2, values_only=True), start=2):
        if row[0] is None: continue
        rec = {k: (row[j] if j < len(row) else None) for j, k in enumerate(keys)}
        rec["_row"] = i
        out.append(rec)
    return out


producers = read_sheet("producers", PROD_KEYS)
wines = read_sheet("wines", WINE_KEYS)
pids = {p["id"] for p in producers}
seen = set()
for w in wines:
    r = w["_row"]
    if w["id"] in seen: errors.append(f"wines {r}행: id 중복 '{w['id']}'")
    seen.add(w["id"])
    if w["producer"] not in pids: errors.append(f"wines {r}행: 생산자 id '{w['producer']}' 가 producers 시트에 없음")
    if w["type"] not in TYPES: errors.append(f"wines {r}행: 타입코드 '{w['type']}' 는 {sorted(TYPES)} 중 하나여야 함")
    for k in ("body", "sweetness", "acidity", "tannin"):
        v = w[k]
        if not isinstance(v, (int, float)) or not 1 <= v <= 5: errors.append(f"wines {r}행: {k} 값 '{v}' 는 1~5 정수여야 함")
    for k in ("nameKo", "name", "vintage", "country", "region", "varieties"):
        if not w[k]: errors.append(f"wines {r}행: '{k}' 비어 있음")
    img = os.path.join(ROOT, "public", "images", "wines", f"{w['id']}.png")
    if not os.path.exists(img): errors.append(f"wines {r}행: 이미지 없음 public/images/wines/{w['id']}.png")
if errors:
    print("데이터 오류 — 수정 후 다시 실행:"); [print("  -", e) for e in errors]; sys.exit(1)


def split_lines(v): return [s.strip() for s in str(v).splitlines() if s.strip()] if v else []
def split_comma(v): return [s.strip() for s in str(v).split(",") if s.strip()] if v else []
def vivino_search(w):
    q = w["name"] + (f" {w['vintage']}" if str(w["vintage"]).isdigit() else "")
    return "https://www.vivino.com/search/wines?q=" + urllib.parse.quote(q)


out_w = []
for w in sorted(wines, key=lambda x: (x["order"] or 0)):
    out_w.append({
        "id": w["id"], "order": int(w["order"] or 0), "catalogPage": int(w["catalogPage"] or 0), "producer": w["producer"],
        "nameKo": w["nameKo"], "name": w["name"], "vintage": str(w["vintage"]), "type": w["type"], "typeLabel": w["typeLabel"] or "",
        "country": w["country"], "region": w["region"], "varieties": w["varieties"], "volume": w["volume"] or "750ml",
        "abv": float(w["abv"]) if w["abv"] not in (None, "") else None,
        "vivino": float(w["vivino"]) if w["vivino"] not in (None, "") else None,
        "scores": w["scores"] or "", "awards": split_lines(w["awards"]), "badges": split_comma(w["badges"]), "note": w["note"] or "",
        "body": int(w["body"]), "sweetness": int(w["sweetness"]), "acidity": int(w["acidity"]), "tannin": int(w["tannin"]),
        "image": f"/images/wines/{w['id']}.png", "vivinoUrl": w["vivinoUrl"] or vivino_search(w),
    })
out_p = [{k: (p[k] or "") for k in PROD_KEYS} for p in producers]
for p in out_p: p["wineCount"] = sum(1 for w in out_w if w["producer"] == p["id"])

os.makedirs(OUT, exist_ok=True)
json.dump(out_w, open(os.path.join(OUT, "wines.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
json.dump(out_p, open(os.path.join(OUT, "producers.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
wb.close()
print(f"OK: wines {len(out_w)}, producers {len(out_p)} -> src/data/wines.json, producers.json")
