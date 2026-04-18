#!/usr/bin/env bash
# wiki-graph-report.sh — Auto-genere wiki/meta/graph-report.md
# Role : scan graph wiki (god nodes / orphelins / surprising connections / communities)
# Usage :
#   bash scripts/wiki-graph-report.sh          # regenere wiki/meta/graph-report.md
#   bash scripts/wiki-graph-report.sh --check  # dry-run : exit 1 si file drift vs regen
#   bash scripts/wiki-graph-report.sh --quiet  # 1-ligne stats (pour chain health-check)
# Spec : docs/core/knowledge.md section 12.2 + [[Graph Report]]
# Seuils : scripts/thresholds.json section wiki.graph_report

set -uo pipefail

ROOT=$(git rev-parse --show-toplevel 2>/dev/null) || exit 0
cd "$ROOT" || exit 0

if [ ! -d wiki/ ]; then exit 0; fi

MODE="${1:-generate}"
OUTPUT="wiki/meta/graph-report.md"

python3 - "$MODE" "$OUTPUT" <<'PYEOF'
import os, re, sys, json, glob
from pathlib import Path
from collections import defaultdict
from datetime import date

mode = sys.argv[1] if len(sys.argv) > 1 else "generate"
output = sys.argv[2] if len(sys.argv) > 2 else "wiki/meta/graph-report.md"

# Load thresholds
try:
    with open("scripts/thresholds.json") as f:
        thresholds = json.load(f)
    god_min = thresholds["wiki"]["graph_report"]["god_nodes_min_wikilinks"]
    orphan_max = thresholds["wiki"]["graph_report"]["orphan_max_allowed"]
except Exception:
    god_min, orphan_max = 10, 2

# Collect pages (exclude .raw/, templates/, graph-report itself)
pages = []
for p in sorted(glob.glob("wiki/**/*.md", recursive=True)):
    if ".raw/" in p or "/templates/" in p or p.endswith("graph-report.md"):
        continue
    pages.append(p)

# Parse frontmatter
def parse_frontmatter(path):
    try:
        txt = Path(path).read_text(encoding="utf-8")
    except Exception:
        return {}, ""
    m = re.match(r'^---\n(.*?)\n---', txt, re.DOTALL)
    if not m:
        return {}, txt
    fm_raw = m.group(1)
    fm = {}
    for line in fm_raw.splitlines():
        if line and not line.startswith(" ") and ":" in line:
            key, _, val = line.partition(":")
            fm[key.strip()] = val.strip().strip('"')
    # Tags list
    tag_match = re.search(r'^tags:\s*\n((?:\s+-\s+.+\n?)+)', fm_raw, re.MULTILINE)
    if tag_match:
        tags = re.findall(r'^\s+-\s+(.+)$', tag_match.group(1), re.MULTILINE)
        fm['tags'] = [t.strip().strip('"') for t in tags]
    return fm, txt

page_info = {}
for p in pages:
    base = Path(p).stem
    fm, _ = parse_frontmatter(p)
    m = re.search(r'wiki/domains/([^/]+)/', p)
    if m:
        domain = m.group(1)
    else:
        domain = fm.get('domain', '') or 'meta'
    tags = fm.get('tags', [])
    ptag = tags[0] if tags else (fm.get('type', '') or 'untagged')
    page_info[base] = {
        'path': p,
        'domain': domain,
        'primary_tag': ptag,
    }

# Count inbound wikilinks
inbound_sources = defaultdict(set)
for src_path in pages:
    src_base = Path(src_path).stem
    try:
        content = Path(src_path).read_text(encoding="utf-8")
    except Exception:
        continue
    for m in re.finditer(r'\[\[([^\]\|#]+)', content):
        target = m.group(1).strip()
        if target in page_info and target != src_base:
            inbound_sources[target].add(src_base)

# God nodes
god_nodes = [(b, len(inbound_sources[b])) for b in page_info if len(inbound_sources[b]) >= god_min]
god_nodes.sort(key=lambda x: -x[1])

# Orphelins (exclude meta-root pages)
ROOT_META = {'hot', 'overview', 'index-wiki', 'counts', 'foundation-os-map'}
orphelins = [b for b in page_info if len(inbound_sources[b]) == 0 and b not in ROOT_META]
orphelins.sort()

# Surprising connections (cross-domain, hors meta)
surprising_set = set()
for src_path in pages:
    src_base = Path(src_path).stem
    src_domain = page_info[src_base]['domain']
    if src_domain == 'meta':
        continue
    try:
        content = Path(src_path).read_text(encoding="utf-8")
    except Exception:
        continue
    seen = set()
    for m in re.finditer(r'\[\[([^\]\|#]+)', content):
        target = m.group(1).strip()
        if target in seen or target == src_base:
            continue
        seen.add(target)
        if target not in page_info:
            continue
        tgt_domain = page_info[target]['domain']
        if tgt_domain == 'meta' or src_domain == tgt_domain:
            continue
        surprising_set.add((src_base, target, src_domain, tgt_domain))

# Communities par tag primaire
communities = defaultdict(list)
for base, info in page_info.items():
    communities[info['primary_tag']].append(base)

# Render
today = date.today().isoformat()
lines = []
lines.append("---")
lines.append("type: meta")
lines.append('title: "Graph Report — wiki analyse auto"')
lines.append(f"updated: {today}")
lines.append("tags:")
lines.append("  - meta")
lines.append("  - graph")
lines.append("  - neuroplasticity")
lines.append("  - auto-generated")
lines.append("status: evergreen")
lines.append("confidence: high")
lines.append("related:")
lines.append('  - "[[index-meta]]"')
lines.append('  - "[[Graph Report]]"')
lines.append('  - "[[foundation-os-map]]"')
lines.append('  - "[[counts]]"')
lines.append("---")
lines.append("")
lines.append("# Graph Report — wiki analyse auto")
lines.append("")
lines.append("> **Auto-regenere** par `scripts/wiki-graph-report.sh`. Source unique pattern counts.md. Ne pas editer manuellement.")
lines.append(">")
lines.append(f"> Last run: {today} · {len(pages)} pages scannees · seuils `scripts/thresholds.json` section `wiki.graph_report`.")
lines.append("")
lines.append("## God Nodes")
lines.append("")
lines.append(f"Pages avec >= {god_min} wikilinks entrants (hubs structurants).")
lines.append("")
if god_nodes:
    lines.append("| Page | Inbound | Domaine |")
    lines.append("|------|---------|---------|")
    for base, count in god_nodes:
        lines.append(f"| `{base}` | {count} | {page_info[base]['domain']} |")
else:
    lines.append(f"_Aucun god node (seuil {god_min}). Wiki jeune — pattern normal < 500 pages._")
lines.append("")
lines.append("## Orphelins")
lines.append("")
lines.append(f"Pages avec 0 wikilink entrant (hors roots meta: hot, overview, index-wiki, counts, foundation-os-map). Seuil max : {orphan_max}.")
lines.append("")
if orphelins:
    status = "WARN" if len(orphelins) > orphan_max else "OK"
    lines.append(f"**{len(orphelins)} orphelins** (`{status}`)")
    lines.append("")
    for base in orphelins:
        lines.append(f"- `{base}` — `{page_info[base]['path']}`")
else:
    lines.append("_0 orphelin. Tout le wiki est connecte._")
lines.append("")
lines.append("## Surprising Connections (cross-domain)")
lines.append("")
lines.append("Wikilinks qui relient des domaines differents (hors meta). Revele insights cross-domain emergents.")
lines.append("")
if surprising_set:
    lines.append("| Source | Target | Source domain | Target domain |")
    lines.append("|--------|--------|---------------|---------------|")
    for src, tgt, sd, td in sorted(surprising_set):
        lines.append(f"| `{src}` | `{tgt}` | {sd} | {td} |")
else:
    lines.append("_Aucune surprise cross-domain. Les domaines sont encore isoles (wiki jeune, domaines Phase 5 placeholder)._")
lines.append("")
lines.append("## Communities (par tag primaire)")
lines.append("")
lines.append("Groupement des pages par premier tag frontmatter (fallback `type:` ou `untagged`).")
lines.append("")
for tag, members in sorted(communities.items(), key=lambda x: (-len(x[1]), x[0])):
    lines.append(f"### `#{tag}` ({len(members)} pages)")
    lines.append("")
    for base in sorted(members):
        lines.append(f"- `{base}`")
    lines.append("")

lines.append("---")
lines.append("")
lines.append("## Comment regenerer")
lines.append("")
lines.append("```bash")
lines.append("bash scripts/wiki-graph-report.sh          # regenere graph-report.md")
lines.append("bash scripts/wiki-graph-report.sh --check  # compare existing vs regen, exit 0/1")
lines.append("bash scripts/wiki-graph-report.sh --quiet  # 1-ligne stats (pour chain health-check)")
lines.append("```")
lines.append("")

content = "\n".join(lines)

def normalize_for_diff(s):
    return re.sub(r'(updated|Last run):\s*[\d-]+', r'\1: DATE', s)

if mode == "--check":
    try:
        existing = Path(output).read_text(encoding="utf-8")
    except FileNotFoundError:
        print(f"[DRIFT] {output} absent. Regenerer : bash scripts/wiki-graph-report.sh")
        sys.exit(1)
    if normalize_for_diff(existing) == normalize_for_diff(content):
        print(f"[OK] {output} sync ({len(pages)} pages)")
        sys.exit(0)
    else:
        print(f"[DRIFT] {output} stale. Regenerer : bash scripts/wiki-graph-report.sh")
        sys.exit(1)
elif mode == "--quiet":
    g = len(god_nodes)
    o = len(orphelins)
    s = len(surprising_set)
    drift = 1 if o > orphan_max else 0
    print(f"wiki-graph: {len(pages)} pages, {g} god-nodes, {o} orphelins, {s} cross-domain")
    sys.exit(drift)
else:
    Path(output).write_text(content, encoding="utf-8")
    print(f"[OK] {output} regenere ({len(pages)} pages, {len(god_nodes)} god-nodes, {len(orphelins)} orphelins, {len(surprising_set)} surprising)")
    sys.exit(0)
PYEOF
