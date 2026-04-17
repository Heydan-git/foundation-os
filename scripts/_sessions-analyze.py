#!/usr/bin/env python3
"""
Sessions analyzer Foundation OS.
Read JSONL transcripts and extract patterns -> wiki/meta/session-patterns.md
Called by scripts/sessions-analyze.sh (bash wrapper).
"""
import json
import os
import re
import sys
from collections import Counter
from datetime import datetime, timedelta
from pathlib import Path

TRANSCRIPTS_DIR = Path.home() / ".claude/projects/-Users-kevinnoel-foundation-os"
OUTPUT = Path("wiki/meta/session-patterns.md")

LIMIT = None
PERIOD = None
for arg in sys.argv[1:]:
    if arg.startswith("--limit="):
        LIMIT = int(arg.split("=", 1)[1])
    elif arg.startswith("--period="):
        PERIOD = arg.split("=", 1)[1]

if not TRANSCRIPTS_DIR.exists():
    print(f"[ERROR] Transcripts dir not found: {TRANSCRIPTS_DIR}", file=sys.stderr)
    sys.exit(1)

transcripts = sorted(TRANSCRIPTS_DIR.glob("*.jsonl"),
                     key=lambda p: p.stat().st_mtime, reverse=True)

if LIMIT:
    transcripts = transcripts[:LIMIT]

if PERIOD and PERIOD.endswith("d"):
    days = int(PERIOD[:-1])
    cutoff = datetime.now() - timedelta(days=days)
    transcripts = [t for t in transcripts
                   if datetime.fromtimestamp(t.stat().st_mtime) > cutoff]

print(f"[INFO] Analyse {len(transcripts)} transcripts...", file=sys.stderr)

total_sessions = len(transcripts)
user_messages = []
slash_commands = Counter()
tool_uses = Counter()
agent_types = Counter()
session_stats = []
file_modifications = []

STOPWORDS = set("""
a le la les un une des de du et est en dans pour avec sur sans par ce ces cette cet
que qui quoi dont ou ne pas je tu il elle on nous vous ils elles me te se lui leur y
au aux si mais donc or car oui non plus moins tres bien peu tout tous toute toutes
the of and to in a for is on that with by an be this or are as at from it not have
has had be been was were will would can could should may might must do does did
me my your our their its his her them us we they he she i you
fait faire faites fais font ai as ont vais vas va allons allez vont etre etait etaient
peut peuvent doit doivent sait savent dire disent juste deja encore toujours
""".split())

CMD_RE = re.compile(
    r"/(cockpit|session-start|session-end|plan-os|wt|sync|new-project|wiki|save|autoresearch|canvas)\b"
)
WORD_RE = re.compile(r"\b[a-z]{4,}\b")

for transcript_path in transcripts:
    session_id = transcript_path.stem
    session_start = datetime.fromtimestamp(transcript_path.stat().st_mtime).isoformat()
    session_user_count = 0
    session_tool_count = 0
    session_files_touched = set()

    try:
        with open(transcript_path, encoding="utf-8", errors="ignore") as f:
            for line in f:
                try:
                    entry = json.loads(line)
                except json.JSONDecodeError:
                    continue

                entry_type = entry.get("type", "")

                if entry_type == "queue-operation" and entry.get("operation") == "enqueue":
                    content = entry.get("content", "")
                    if isinstance(content, str) and content:
                        user_messages.append(content)
                        session_user_count += 1
                        for cmd in CMD_RE.findall(content):
                            slash_commands[f"/{cmd}"] += 1

                msg = entry.get("message", {})
                content_blocks = msg.get("content", []) if isinstance(msg, dict) else []
                if isinstance(content_blocks, list):
                    for block in content_blocks:
                        if not isinstance(block, dict):
                            continue
                        if block.get("type") == "tool_use":
                            tool_name = block.get("name", "")
                            if tool_name:
                                tool_uses[tool_name] += 1
                                session_tool_count += 1
                            if tool_name == "Task":
                                subagent = block.get("input", {}).get("subagent_type", "unknown")
                                agent_types[subagent] += 1
                            if tool_name in ("Write", "Edit", "MultiEdit"):
                                fpath = block.get("input", {}).get("file_path", "")
                                if fpath:
                                    session_files_touched.add(fpath)
                                    file_modifications.append(fpath)
    except (OSError, UnicodeDecodeError) as e:
        print(f"[WARN] Skip {session_id}: {e}", file=sys.stderr)
        continue

    session_stats.append({
        "id": session_id,
        "date": session_start[:10],
        "user_msgs": session_user_count,
        "tool_calls": session_tool_count,
        "files_touched": len(session_files_touched),
    })

word_freq = Counter()
for msg in user_messages:
    for word in WORD_RE.findall(msg.lower()):
        if word not in STOPWORDS:
            word_freq[word] += 1

file_mod_count = Counter(file_modifications)
rework_files = {f: c for f, c in file_mod_count.items() if c > 1}

total_user_msgs = sum(s["user_msgs"] for s in session_stats)
total_tool_calls = sum(s["tool_calls"] for s in session_stats)
avg_msgs = total_user_msgs / max(1, total_sessions)
avg_tools = total_tool_calls / max(1, total_sessions)

top_agents = agent_types.most_common(10)
top_tools = tool_uses.most_common(15)
top_commands = slash_commands.most_common(10)
top_words = word_freq.most_common(30)

today = datetime.now().strftime("%Y-%m-%d")
scope = f"{total_sessions} sessions"
if PERIOD:
    scope += f" (periode {PERIOD})"
if LIMIT:
    scope += f" (limit {LIMIT})"

total_cmds = sum(slash_commands.values())
total_t = sum(tool_uses.values())
transcripts_mb = sum(t.stat().st_size for t in transcripts) / (1024 * 1024)

lines = []
lines.append("---")
lines.append("type: meta")
lines.append('title: "Session Patterns — Analytics"')
lines.append(f"updated: {today}")
lines.append("tags:")
lines.append("  - meta")
lines.append("  - sessions")
lines.append("  - analytics")
lines.append("  - patterns")
lines.append("status: evergreen")
lines.append("related:")
lines.append('  - "[[sessions-recent]]"')
lines.append('  - "[[thinking]]"')
lines.append('  - "[[index-meta]]"')
lines.append("---")
lines.append("")
lines.append("# Session Patterns — Analytics")
lines.append("")
lines.append(f"> Auto-regenere par `scripts/sessions-analyze.sh`. Source : `~/.claude/projects/-Users-kevinnoel-foundation-os/*.jsonl` ({scope}).")
lines.append(">")
lines.append("> Objectif : observer comment Kevin travaille avec Claude pour detecter patterns, friction, opportunites d'amelioration.")
lines.append("")
lines.append("## Vue d'ensemble")
lines.append("")
lines.append("| Metrique | Valeur |")
lines.append("|----------|--------|")
lines.append(f"| Sessions analysees | {total_sessions} |")
lines.append(f"| Messages Kevin totaux | {total_user_msgs} |")
lines.append(f"| Tool calls totaux | {total_tool_calls} |")
lines.append(f"| Moyenne msgs/session | {avg_msgs:.1f} |")
lines.append(f"| Moyenne tools/session | {avg_tools:.1f} |")
lines.append(f"| Transcripts total | {transcripts_mb:.1f} MB |")
lines.append("")
lines.append("## Slash commands frequence (top 10)")
lines.append("")
lines.append("| Command | Count | Part |")
lines.append("|---------|-------|------|")
for cmd, count in top_commands:
    pct = 100 * count / max(1, total_cmds)
    lines.append(f"| `{cmd}` | {count} | {pct:.1f}% |")
if not top_commands:
    lines.append("| (aucune slash command detectee) | 0 | — |")
lines.append("")
lines.append("## Tools utilises (top 15)")
lines.append("")
lines.append("| Tool | Count | Part |")
lines.append("|------|-------|------|")
for tool, count in top_tools:
    pct = 100 * count / max(1, total_t)
    lines.append(f"| `{tool}` | {count} | {pct:.1f}% |")
lines.append("")
lines.append("## Agents delegues (top 10 via Task tool)")
lines.append("")
lines.append("| Agent | Count |")
lines.append("|-------|-------|")
if top_agents:
    for agent, count in top_agents:
        lines.append(f"| `{agent}` | {count} |")
else:
    lines.append("| (aucun agent delegue) | 0 |")
lines.append("")
lines.append("## Lexique Kevin — top 30 mots (hors stopwords, >= 4 chars)")
lines.append("")
lines.append("| Mot | Count |")
lines.append("|-----|-------|")
for word, count in top_words:
    lines.append(f"| {word} | {count} |")
lines.append("")
lines.append("## Rework ratio — fichiers modifies plusieurs fois")
lines.append("")
lines.append(f"**{len(rework_files)} fichiers** modifies > 1 fois (sur {len(file_mod_count)} fichiers distincts).")
lines.append("")
lines.append("| Fichier | Modifications |")
lines.append("|---------|---------------|")
top_rework = sorted(rework_files.items(), key=lambda x: x[1], reverse=True)[:10]
home_str = str(Path.home())
for fpath, count in top_rework:
    short = fpath.replace(home_str, "~")
    if len(short) > 80:
        short = "..." + short[-77:]
    lines.append(f"| `{short}` | {count} |")
lines.append("")
lines.append("## Sessions recentes (5 dernieres)")
lines.append("")
lines.append("| Session | Date | Msgs Kevin | Tool calls | Fichiers touches |")
lines.append("|---------|------|-----------|-----------|------------------|")
for s in session_stats[:5]:
    lines.append(f"| `{s['id'][:8]}...` | {s['date']} | {s['user_msgs']} | {s['tool_calls']} | {s['files_touched']} |")
lines.append("")
lines.append("## Insights")
lines.append("")
if top_commands:
    dom_cmd = top_commands[0]
    dom_cmd_pct = 100 * dom_cmd[1] / max(1, total_cmds)
    lines.append(f"- **Command dominant** : `{dom_cmd[0]}` ({dom_cmd[1]} invocations = {dom_cmd_pct:.0f}% du total)")
if top_tools:
    dom_tool = top_tools[0]
    dom_tool_pct = 100 * dom_tool[1] / max(1, total_t)
    lines.append(f"- **Tool dominant** : `{dom_tool[0]}` ({dom_tool[1]} calls = {dom_tool_pct:.0f}% du total)")
task_count = tool_uses.get("Task", 0)
task_pct = 100 * task_count / max(1, total_tool_calls)
lines.append(f"- **Ratio delegation agents** : Task = {task_count}/{total_tool_calls} tool calls ({task_pct:.1f}%). {'Forte delegation.' if task_pct > 5 else 'Faible delegation (Claude fait tout en direct).'}")
if top_rework:
    lines.append(f"- **Rework concentre** : top fichier modifie {top_rework[0][1]} fois sur {total_sessions} sessions")
lines.append("")
lines.append("## Regeneration")
lines.append("")
lines.append("```bash")
lines.append("bash scripts/sessions-analyze.sh                   # complet")
lines.append("bash scripts/sessions-analyze.sh --limit=10        # dev (10 sessions)")
lines.append("bash scripts/sessions-analyze.sh --period=7d       # derniers 7 jours")
lines.append("```")
lines.append("")
lines.append("## Refs")
lines.append("")
lines.append("- Audit v2 : `docs/audits/2026-04-16-mega-audit-v2/rapport-comportement.md` I-02 (C-17 transcripts inexploites)")
lines.append(f"- Decouverte : les vrais transcripts sont dans `~/.claude/projects/-Users-kevinnoel-foundation-os/*.jsonl` ({total_sessions} transcripts, {transcripts_mb:.1f} MB). `.omc/sessions/*.json` ne contient que metadata 189 bytes chacune.")

OUTPUT.parent.mkdir(parents=True, exist_ok=True)
OUTPUT.write_text("\n".join(lines) + "\n")
print(f"[OK] {OUTPUT} ecrit ({total_sessions} sessions, {total_user_msgs} msgs, {total_tool_calls} tool calls)", file=sys.stderr)
