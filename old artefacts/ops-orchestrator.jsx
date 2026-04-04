import { useState, useEffect } from "react";

// ─── CONSTANTS ─────────────────────────────────────────────────────────────────
// SOURCE: FONDATION_OPS.md — update both files together on every change

const ARTIFACT_VERSION    = "v1.2";
const MD_VERSION          = "v1.2";
const ARTIFACT_APPROX_CHARS = 40599; // updated after build
const ARTIFACT_MAX_CHARS    = 250000;

// ─── MD SOURCE ── JSX = contrôleur / MD = contenu ────────────────────────────
// Copier ce contenu dans FONDATION_OPS.md à chaque mise à jour
const MD_SOURCE = `# FONDATION_OPS
> Base de données — synchronisée avec \`ops-orchestrator.jsx\`
> Règle : toute modification du JSX met à jour ce fichier. Ce fichier permet de reconstruire le JSX.

---

## VERSION
- artifact : v1.2
- md       : v1.2
- sync     : 2026-04-03
- statut   : actif

---

## PROJET
- name    : Fondation — iOS Pipeline Grade A
- phase   : 00 — Fondation
- target  : App iOS Grade A (Swift 6 + SwiftUI + TCA + Supabase + RevenueCat)
- budget  : Indie (50–300€/mois) par défaut

---

## DESIGN SYSTEM
- theme       : Void Glass
- background  : #06070C
- accent      : #5EEAD4
- purple      : #A78BFA
- fonts       : Figtree + JetBrains Mono
- cards       : rgba(255,255,255,0.025) border rgba(255,255,255,0.055)
- orbes       : blur 80px, opacity 0.09
- animations  : fade-in staggeré 50ms par item

---

## ARTIFACTS
| id       | nom                            | rôle                                                    | complet |
|----------|--------------------------------|---------------------------------------------------------|---------|
| pipeline | ios-pipeline-dashboard.jsx     | Pipeline 8 phases × 3 budgets × KPIs × monitoring      | ✅      |
| monitor  | fondation-monitor.jsx          | Monitoring projet — phases, journal, décisions, risques | ✅      |
| index    | project-index-dashboard.jsx    | Index conversations, thèmes, fichiers                   | ✅      |
| control  | conversation-control.jsx       | Contrôle session, sync Cowork, architecture mémoire     | ✅      |
| ops      | ops-orchestrator.jsx           | Orchestrateur ops — analyse, plan, log, base MD         | 🟡      |

---

## PRINCIPES
- Coopération > exploitation
- Traçabilité totale
- Plan évolutif
- Mémoire adaptative
- Zéro nuisance (volontaire, involontaire, directe, indirecte)

---

## FRAMEWORKS
- BMAD v6 (Breakthrough Method for Agile AI-Driven Development)
- Claudify (resource/blog workflows Claude Code)

---

## SKILLS ACTIFS
- ios-dev
- fullstack-dev
- product-design-uxui
- lead-dev
- specialiste-ai
- design-system-manager
- app-store-publisher
- data-analyst

---

## COWORK — COUCHES MÉMOIRE
| couche | nom             | contenu                            |
|--------|-----------------|------------------------------------|
| L4     | Mémoire Claude  | Memories + journal MD              |
| L3     | Knowledge base  | 12 fichiers .md projet Cowork      |
| L2     | Contexte conv.  | Chat en cours (perdu à la fin)     |
| L1     | Contexte immédiat | Message + fichiers uploadés      |

---

## ARCHITECTURE TECHNIQUE
- frontend  : SwiftUI + TCA (The Composable Architecture)
- backend   : Supabase (auth + BDD + edge functions)
- paiements : RevenueCat (< 2.5K MRR gratuit)
- analytics : Mixpanel + TelemetryDeck
- erreurs   : Sentry
- CI/CD     : GitHub Actions + Fastlane
- cowork L1 : Claude.ai Cowork
- cowork L2 : Claude Code
- cowork L3 : BMAD v6
- cowork L4 : MCP/plugins

---

## DÉCISIONS
| date       | titre                              | contexte           | impact |
|------------|------------------------------------|--------------------|--------|
| 2026-04-02 | Coopération > exploitation         | Philosophie projet | high   |
| 2026-04-02 | Traçabilité totale                 | Mémoire + journal  | high   |
| 2026-04-02 | Plan évolutif                      | Itérations courtes | medium |
| 2026-04-02 | Claudify + BMAD = fondations       | Workflow global    | high   |
| 2026-04-02 | JSX = contrôleur, MD = contenu     | Architecture data  | high   |

---

## LIMITES CLAUDE (honnêteté)
- Pas de mémoire native entre sessions → MD + storage compensent
- max_tokens API = 1000 → JSON compact obligatoire, tryParse() en fallback
- Contexte limité 200K tokens → rechargement via MD
- Code non testé en prod → toujours vérifier
- Pas de jugement business → données fournies, décision humaine

---

## CHANGELOG
| version | date       | modifications                                        |
|---------|------------|------------------------------------------------------|
| v1.0    | 2026-04-03 | Création ops-orchestrator.jsx — Status, Analyse, Plan, Log |
| v1.1    | 2026-04-03 | Fix JSON parse (tryParse 4 passes, contexte compact) |
| v1.2    | 2026-04-03 | Ajout onglet Base MD — JSX contrôleur / MD contenu   |
`;

const PROJECT_CONTEXT = {
  name:       "Fondation — iOS Pipeline Grade A",
  phase:      "00 — Fondation",
  target:     "App iOS Grade A (Swift 6 + SwiftUI + TCA + Supabase + RevenueCat)",
  principles: ["Coopération > exploitation", "Traçabilité totale", "Plan évolutif", "Mémoire adaptative"],
  artifacts: [
    { id: "pipeline", name: "ios-pipeline-dashboard.jsx",  role: "Pipeline 8 phases × 3 budgets × KPIs × monitoring × évolution", complete: true  },
    { id: "monitor",  name: "fondation-monitor.jsx",        role: "Monitoring projet — phases, journal, décisions, risques, docs",   complete: true  },
    { id: "index",    name: "project-index-dashboard.jsx",  role: "Index conversations, thèmes, fichiers",                           complete: true  },
    { id: "control",  name: "conversation-control.jsx",     role: "Contrôle session, sync Cowork, architecture mémoire",             complete: true  },
    { id: "ops",      name: "ops-orchestrator.jsx",         role: "Orchestrateur ops — analyse, plan, log, base MD",                 complete: false },
  ],
  designSystem: "Void Glass — #06070C, Figtree + JetBrains Mono, glassmorphism, orbes #5EEAD4/#A78BFA",
  stack:       "React + Anthropic API + window.storage",
  skills:      ["ios-dev", "fullstack-dev", "product-design-uxui", "lead-dev", "specialiste-ai", "design-system-manager"],
  frameworks:  ["BMAD v6", "Claudify"],
  cowork:      ["L1 Cowork", "L2 Claude Code", "L3 BMAD", "L4 MCP/plugins"],
  decisions:   ["Coopération > exploitation", "Traçabilité totale", "Plan évolutif", "Déploiement Cowork après chat"],
};

const CATS = {
  architecture: { label: "Architecture",  color: "#F97316", icon: "⬡" },
  features:     { label: "Features",      color: "#3B82F6", icon: "⬢" },
  design:       { label: "Design",        color: "#A78BFA", icon: "◇" },
  integration:  { label: "Intégration",   color: "#5EEAD4", icon: "◉" },
  nextsteps:    { label: "Next steps",    color: "#22C55E", icon: "▲" },
};

const STORAGE_KEY = "ops-orchestrator-v1";

// ─── STORAGE ─────────────────────────────────────────────────────────────────

async function loadState() {
  try {
    const r = await window.storage.get(STORAGE_KEY);
    return r ? JSON.parse(r.value) : null;
  } catch { return null; }
}

async function saveState(s) {
  try { await window.storage.set(STORAGE_KEY, JSON.stringify(s)); }
  catch (e) { console.error("storage:", e); }
}

// ─── WEIGHT BAR ──────────────────────────────────────────────────────────────

function WeightBar({ chars = ARTIFACT_APPROX_CHARS, max = ARTIFACT_MAX_CHARS }) {
  const pct   = Math.min((chars / max) * 100, 100);
  const color = pct < 60 ? "#22C55E" : pct < 80 ? "#EAB308" : pct < 92 ? "#F97316" : "#EF4444";
  const label = pct < 60 ? "Sain"    : pct < 80 ? "Attention" : pct < 92 ? "Lourd"   : "Critique";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ fontSize: 9, fontFamily: "'JetBrains Mono',monospace", color: "#3F3F46", letterSpacing: ".08em", whiteSpace: "nowrap" }}>
        ARTIFACT WEIGHT
      </span>
      <div style={{ flex: 1, minWidth: 70, height: 3, borderRadius: 2, background: "rgba(255,255,255,.06)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, width: `${pct}%`, background: color, borderRadius: 2, transition: "width .4s ease" }} />
      </div>
      <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono',monospace", color, whiteSpace: "nowrap" }}>
        {pct.toFixed(1)}% — {label}
      </span>
      <span style={{ fontSize: 9, fontFamily: "'JetBrains Mono',monospace", color: "#27272A", whiteSpace: "nowrap" }}>
        {(chars/1000).toFixed(1)}k/{(max/1000).toFixed(0)}k
      </span>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

export default function OpsOrchestrator() {
  const [loaded,     setLoaded]     = useState(false);
  const [tab,        setTab]        = useState("status");
  const [result,     setResult]     = useState(null);
  const [analyzing,  setAnalyzing]  = useState(false);
  const [apiError,   setApiError]   = useState(null);
  const [items,      setItems]      = useState([]);
  const [log,        setLog]        = useState([]);
  const [focus,      setFocus]      = useState("");
  const [copied,     setCopied]     = useState(null);
  const [mdCopied,   setMdCopied]   = useState(false);

  // ── Persist ────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      const s = await loadState();
      if (s) {
        if (s.result) setResult(s.result);
        if (s.items)  setItems(s.items);
        if (s.log)    setLog(s.log);
      }
      setLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (loaded) saveState({ result, items, log, ts: new Date().toISOString() });
  }, [result, items, log, loaded]);

  // ── JSON repair — handles max_tokens=1000 truncation ────────────
  const tryParse = (raw) => {
    const clean = raw.replace(/```json|```/g, "").trim();
    try { return JSON.parse(clean); } catch {}
    const closes = ['"}]}', '"]}', ']}', '}'];
    for (const s of closes) { try { return JSON.parse(clean + s); } catch {} }
    const lb = clean.lastIndexOf('}');
    if (lb > 0) {
      const t = clean.slice(0, lb + 1);
      for (const s of [']}', '],"immediate_actions":[],"risks":[]}']) {
        try { return JSON.parse(t + s); } catch {}
      }
    }
    return null;
  };

  // ── API call ────────────────────────────────────────────────────
  const runAnalysis = async () => {
    setAnalyzing(true);
    setApiError(null);

    // Compact context — no pretty-print, only essential fields
    const ctx = JSON.stringify({
      phase:      PROJECT_CONTEXT.phase,
      target:     PROJECT_CONTEXT.target,
      artifacts:  PROJECT_CONTEXT.artifacts.map(a => ({ name: a.name, role: a.role, done: a.complete })),
      frameworks: PROJECT_CONTEXT.frameworks,
      skills:     PROJECT_CONTEXT.skills,
      decisions:  PROJECT_CONTEXT.decisions,
    });

    const focusPart = focus.trim() ? ` Focus: ${focus}.` : "";
    const prompt =
`Analyse projet Fondation iOS.${focusPart} Contexte: ${ctx}
JSON strict sans markdown. Max 4 ameliorations, titres <6 mots, descriptions <12 mots:
{"health_score":N,"summary":"2 phrases","improvements":[{"id":"slug","category":"architecture|features|design|integration|nextsteps","priority":"high|medium|low","title":"court","description":"court","effort":"quick|medium|major"}],"immediate_actions":["court","court"],"risks":["court"]}`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model:      "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages:   [{ role: "user", content: prompt }],
        }),
      });
      const data = await res.json();
      const raw  = data.content?.find(b => b.type === "text")?.text || "";
      const parsed = tryParse(raw);

      if (!parsed) throw new Error(`Parse échoué. Réponse brute: ${raw.slice(0, 100)}…`);

      setResult(parsed);
      if (parsed.improvements?.length) setItems(parsed.improvements);

      setLog(prev => [{
        id:      Date.now(),
        date:    new Date().toLocaleDateString("fr-FR"),
        time:    new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
        health:  parsed.health_score,
        summary: parsed.summary,
        count:   parsed.improvements?.length || 0,
        focus:   focus || null,
      }, ...prev].slice(0, 20));

    } catch (e) {
      setApiError(e.message);
    } finally {
      setAnalyzing(false);
    }
  };

  const copyPrompt = (imp) => {
    const hint = `Améliorer "${imp.title}" dans le projet Fondation iOS.\nCatégorie: ${imp.category} | Effort: ${imp.effort}\nDescription: ${imp.description}\n\nContexte: ${PROJECT_CONTEXT.designSystem}\nPhase: ${PROJECT_CONTEXT.phase} — ${PROJECT_CONTEXT.target}`;
    navigator.clipboard.writeText(hint).then(() => {
      setCopied(imp.id);
      setTimeout(() => setCopied(null), 2200);
    });
  };

  const dismiss = (id) => setItems(prev => prev.filter(i => i.id !== id));

  const resetAll = async () => {
    if (!confirm("Réinitialiser toutes les données Ops Orchestrator ?")) return;
    setResult(null); setItems([]); setLog([]);
  };

  // ── Derived ────────────────────────────────────────────────────
  const hColor = !result ? "#52525B"
    : result.health_score >= 70 ? "#22C55E"
    : result.health_score >= 50 ? "#EAB308"
    : "#EF4444";

  const byPri = {
    high:   items.filter(i => i.priority === "high"),
    medium: items.filter(i => i.priority === "medium"),
    low:    items.filter(i => i.priority === "low"),
  };

  const TABS = [
    { id: "status",  label: "Status",  icon: "◉" },
    { id: "analyse", label: "Analyse", icon: "▦" },
    { id: "plan",    label: "Plan",    icon: "⬡", badge: items.length || null },
    { id: "log",     label: "Log",     icon: "◇", badge: log.length   || null },
    { id: "base",    label: "Base MD", icon: "▣" },
  ];

  if (!loaded) return (
    <div style={{ background: "#06070C", color: "#3F3F46", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'JetBrains Mono',monospace", fontSize: 12 }}>
      chargement…
    </div>
  );

  return (
    <div style={{ fontFamily: "'Figtree',-apple-system,sans-serif", background: "#06070C", color: "#D4D4D8", minHeight: "100vh", position: "relative", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Figtree:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:3px}
        ::-webkit-scrollbar-thumb{background:rgba(94,234,212,.12);border-radius:4px}
        .fi{opacity:0;transform:translateY(6px);animation:fu .32s ease forwards}
        .d1{animation-delay:.05s}.d2{animation-delay:.10s}.d3{animation-delay:.15s}
        .d4{animation-delay:.20s}.d5{animation-delay:.25s}.d6{animation-delay:.30s}
        @keyframes fu{to{opacity:1;transform:translateY(0)}}
        @keyframes drift{0%,100%{transform:translate(0,0)}50%{transform:translate(18px,-14px)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}
        @keyframes spin{to{transform:rotate(360deg)}}
        .orb{position:absolute;border-radius:50%;filter:blur(80px);opacity:.09;pointer-events:none}
        .card{background:rgba(255,255,255,.025);border:1px solid rgba(255,255,255,.055);border-radius:10px;transition:all .15s ease}
        .card:hover{background:rgba(255,255,255,.04);border-color:rgba(255,255,255,.09)}
        .nb{background:none;border:none;padding:6px 16px 12px;cursor:pointer;font-size:12px;font-family:'Figtree',sans-serif;font-weight:500;color:#52525B;border-bottom:2px solid transparent;transition:all .15s;white-space:nowrap;display:flex;align-items:center;gap:6px}
        .nb:hover{color:#A1A1AA}
        .nb.on{color:#5EEAD4;border-bottom-color:#5EEAD4}
        .mono{font-family:'JetBrains Mono',monospace}
        .chip{display:inline-flex;align-items:center;padding:2px 8px;border-radius:4px;font-size:10px;font-family:'JetBrains Mono',monospace;letter-spacing:.04em}
        .btn-t{background:rgba(94,234,212,.10);border:1px solid rgba(94,234,212,.22);color:#5EEAD4;border-radius:7px;padding:8px 20px;font-size:13px;font-family:'Figtree',sans-serif;font-weight:500;cursor:pointer;transition:all .15s;display:inline-flex;align-items:center;gap:8px}
        .btn-t:hover{background:rgba(94,234,212,.18)}
        .btn-t:disabled{opacity:.38;cursor:not-allowed}
        .btn-s{background:transparent;border:1px solid rgba(255,255,255,.09);border-radius:5px;padding:3px 10px;font-size:10px;font-family:'JetBrains Mono',monospace;color:#71717A;cursor:pointer;transition:all .12s}
        .btn-s:hover{border-color:rgba(255,255,255,.2);color:#A1A1AA}
        .btn-s.red{border-color:rgba(239,68,68,.18);color:#EF4444}
        .btn-s.red:hover{border-color:rgba(239,68,68,.4)}
        .icard{background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.05);border-radius:8px;padding:14px 16px;margin-bottom:8px;transition:all .15s}
        .icard:hover{background:rgba(255,255,255,.04)}
        .ta{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:7px;padding:10px 12px;color:#E4E4E7;font-size:12px;font-family:'Figtree',sans-serif;width:100%;outline:none;resize:vertical;min-height:58px}
        .ta:focus{border-color:rgba(94,234,212,.3)}
        .row{border-bottom:1px solid rgba(255,255,255,.03);transition:background .1s}
        .row:hover{background:rgba(255,255,255,.025)}
        .row:last-child{border-bottom:none}
        .spinner{width:14px;height:14px;border:2px solid rgba(94,234,212,.2);border-top-color:#5EEAD4;border-radius:50%;animation:spin .8s linear infinite;flex-shrink:0}
      `}</style>

      {/* Orbs */}
      <div className="orb" style={{ width:300, height:300, background:"#A78BFA", top:-70, right:-60, animation:"drift 22s ease-in-out infinite" }} />
      <div className="orb" style={{ width:220, height:220, background:"#5EEAD4", bottom:"35%", left:-55, animation:"drift 28s ease-in-out infinite reverse" }} />
      <div className="orb" style={{ width:160, height:160, background:"#3B82F6", bottom:-30, right:"25%", animation:"drift 18s ease-in-out infinite", animationDelay:"5s" }} />

      {/* ── Header ── */}
      <div style={{ position:"relative", zIndex:2, padding:"20px 24px 0", borderBottom:"1px solid rgba(255,255,255,.04)" }}>
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:6, gap:16 }}>

          {/* Title */}
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3 }}>
              <span style={{ width:7, height:7, borderRadius:"50%", background:"#5EEAD4", display:"inline-block", animation:"pulse 3s ease infinite" }} />
              <span style={{ fontSize:18, fontWeight:600, color:"#FAFAFA", letterSpacing:"-.02em" }}>Ops Orchestrator</span>
              <span className="mono" style={{ fontSize:9, color:"#3F3F46", letterSpacing:".08em" }}>FONDATION v1</span>
            </div>
            <div style={{ fontSize:12, color:"#52525B" }}>
              Analyse · Plan · Log — {PROJECT_CONTEXT.artifacts.length} artifacts trackés
            </div>
          </div>

          {/* Weight bar */}
          <div style={{ display:"flex", flexDirection:"column", gap:4, minWidth:230, paddingTop:2 }}>
            <WeightBar />
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display:"flex", gap:0, marginTop:6 }}>
          {TABS.map(t => (
            <button key={t.id} className={`nb ${tab === t.id ? "on" : ""}`} onClick={() => setTab(t.id)}>
              <span style={{ fontSize:10, opacity:.7 }}>{t.icon}</span>
              {t.label}
              {t.badge ? (
                <span className="chip" style={{ background:"rgba(94,234,212,.12)", color:"#5EEAD4", padding:"1px 6px", fontSize:9 }}>
                  {t.badge}
                </span>
              ) : null}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ position:"relative", zIndex:2, padding:24 }} key={tab}>

        {/* ═══ STATUS ═══ */}
        {tab === "status" && (
          <div>
            {/* Top stats */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:20 }}>
              {[
                { label:"HEALTH SCORE",     val: result ? `${result.health_score}` : "—",  unit: result ? "/100" : "",          color: hColor       },
                { label:"ARTIFACTS",        val: PROJECT_CONTEXT.artifacts.length.toString(), unit:" total",                    color:"#5EEAD4"     },
                { label:"AMÉLIORATIONS",    val: items.length.toString(),                   unit:" en attente",                  color: items.filter(i=>i.priority==="high").length ? "#EF4444" : "#52525B" },
                { label:"ANALYSES",         val: log.length.toString(),                     unit:" sessions",                    color:"#A78BFA"     },
              ].map((s,i) => (
                <div key={i} className={`card fi d${i+1}`} style={{ padding:"14px 16px", opacity:0 }}>
                  <div className="mono" style={{ fontSize:9, color:"#3F3F46", letterSpacing:".08em", marginBottom:6 }}>{s.label}</div>
                  <div style={{ display:"flex", alignItems:"baseline", gap:4 }}>
                    <span style={{ fontSize:26, fontWeight:600, color:s.color, lineHeight:1 }}>{s.val}</span>
                    {s.unit && <span style={{ fontSize:11, color:"#52525B" }}>{s.unit}</span>}
                  </div>
                </div>
              ))}
            </div>

            {/* Artifacts map */}
            <div className="mono" style={{ fontSize:9, color:"#3F3F46", letterSpacing:".08em", marginBottom:8 }}>ARTIFACTS PROJET</div>
            <div className="card" style={{ overflow:"hidden", marginBottom:20 }}>
              {PROJECT_CONTEXT.artifacts.map((a,i) => (
                <div key={a.id} className={`row fi d${i+1}`} style={{ display:"grid", gridTemplateColumns:"1fr auto", padding:"10px 16px", alignItems:"center", opacity:0, gap:12 }}>
                  <div>
                    <span className="mono" style={{ fontSize:12, color: a.complete ? "#5EEAD4" : "#F97316", fontWeight:500 }}>{a.name}</span>
                    <div style={{ fontSize:11, color:"#52525B", marginTop:2 }}>{a.role}</div>
                  </div>
                  <span style={{ fontSize:13 }}>{a.complete ? "✅" : "🟡"}</span>
                </div>
              ))}
            </div>

            {/* Last analysis summary */}
            {result ? (
              <div className="card fi d5" style={{ padding:16, opacity:0, borderColor:"rgba(94,234,212,.08)" }}>
                <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
                  <span style={{ fontSize:32, fontWeight:700, color:hColor, fontFamily:"JetBrains Mono,monospace", lineHeight:1 }}>{result.health_score}</span>
                  <div>
                    <div className="mono" style={{ fontSize:9, color:"#3F3F46", letterSpacing:".08em", marginBottom:4 }}>DERNIÈRE ANALYSE — {log[0]?.date}</div>
                    <p style={{ fontSize:12, color:"#A1A1AA", lineHeight:1.55 }}>{result.summary}</p>
                  </div>
                </div>
                {result.immediate_actions?.length > 0 && (
                  <div>
                    <div className="mono" style={{ fontSize:9, color:"#3F3F46", marginBottom:6, letterSpacing:".06em" }}>ACTIONS IMMÉDIATES</div>
                    {result.immediate_actions.map((a,i) => (
                      <div key={i} style={{ display:"flex", gap:8, padding:"3px 0", fontSize:12, color:"#D4D4D8" }}>
                        <span style={{ color:"#5EEAD4", flexShrink:0 }}>›</span>{a}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="card fi d5" style={{ padding:32, textAlign:"center", opacity:0 }}>
                <div style={{ fontSize:28, opacity:.25, marginBottom:8 }}>◉</div>
                <div style={{ fontSize:12, color:"#52525B", marginBottom:14 }}>Aucune analyse — lance l'onglet Analyse pour un diagnostic complet.</div>
                <button className="btn-t" onClick={() => setTab("analyse")}>→ Analyser le projet</button>
              </div>
            )}

            <div style={{ textAlign:"right", marginTop:12 }}>
              <button className="btn-s red" onClick={resetAll}>↺ Reset données</button>
            </div>
          </div>
        )}

        {/* ═══ ANALYSE ═══ */}
        {tab === "analyse" && (
          <div>
            <div className="card fi d1" style={{ padding:20, opacity:0, marginBottom:16, borderColor:"rgba(94,234,212,.08)" }}>
              <div className="mono" style={{ fontSize:9, color:"#3F3F46", letterSpacing:".08em", marginBottom:10 }}>FOCUS OPTIONNEL</div>
              <textarea
                className="ta"
                placeholder="Ex : concentre-toi sur l'intégration entre artifacts, ou les features manquantes pour la Phase 01 Design…"
                value={focus}
                onChange={e => setFocus(e.target.value)}
              />
              <div style={{ display:"flex", gap:10, alignItems:"center", marginTop:12 }}>
                <button className="btn-t" onClick={runAnalysis} disabled={analyzing}>
                  {analyzing ? <><span className="spinner" />"Analyse en cours…"</> : "▦  Analyser le projet"}
                </button>
                {apiError && <span className="mono" style={{ fontSize:11, color:"#EF4444" }}>{apiError}</span>}
              </div>
            </div>

            {/* Context preview */}
            <div className="card fi d2" style={{ padding:16, opacity:0 }}>
              <div className="mono" style={{ fontSize:9, color:"#3F3F46", letterSpacing:".08em", marginBottom:10 }}>CONTEXTE ENVOYÉ À L'API</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"6px 16px" }}>
                {[
                  ["Phase",            PROJECT_CONTEXT.phase],
                  ["Stack cible",      "Swift 6 + SwiftUI + TCA + Supabase"],
                  ["Artifacts",        `${PROJECT_CONTEXT.artifacts.length} fichiers JSX`],
                  ["Design system",    "Void Glass — #06070C"],
                  ["Frameworks",       PROJECT_CONTEXT.frameworks.join(" + ")],
                  ["Skills",           `${PROJECT_CONTEXT.skills.length} référencés`],
                  ["Décisions clés",   `${PROJECT_CONTEXT.decisions.length} enregistrées`],
                  ["Couches mémoire",  PROJECT_CONTEXT.cowork.length + " layers"],
                ].map(([k,v],i) => (
                  <div key={i} style={{ display:"flex", gap:8 }}>
                    <span className="mono" style={{ fontSize:10, color:"#3F3F46", flexShrink:0, minWidth:88 }}>{k}</span>
                    <span style={{ fontSize:11, color:"#A1A1AA" }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Result card */}
            {result && (
              <div className="card fi d3" style={{ padding:16, opacity:0, marginTop:16, borderColor:"rgba(94,234,212,.07)" }}>
                <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
                  <span style={{ fontSize:32, fontWeight:700, color:hColor, fontFamily:"JetBrains Mono,monospace", lineHeight:1 }}>{result.health_score}</span>
                  <div>
                    <div className="mono" style={{ fontSize:9, color:"#3F3F46", letterSpacing:".08em", marginBottom:3 }}>RÉSULTAT — {log[0]?.date} {log[0]?.time}</div>
                    <p style={{ fontSize:12, color:"#71717A", lineHeight:1.5 }}>{result.summary}</p>
                  </div>
                </div>
                {result.risks?.length > 0 && (
                  <div style={{ borderTop:"1px solid rgba(255,255,255,.04)", paddingTop:10 }}>
                    <div className="mono" style={{ fontSize:9, color:"#EF4444", marginBottom:6, letterSpacing:".06em" }}>RISQUES</div>
                    {result.risks.map((r,i) => (
                      <div key={i} style={{ fontSize:12, color:"#A1A1AA", padding:"2px 0", display:"flex", gap:6 }}>
                        <span style={{ color:"#EF4444", flexShrink:0 }}>›</span>{r}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ═══ PLAN ═══ */}
        {tab === "plan" && (
          <div>
            {items.length === 0 ? (
              <div className="card fi d1" style={{ padding:40, textAlign:"center", opacity:0 }}>
                <div style={{ fontSize:28, opacity:.25, marginBottom:8 }}>⬡</div>
                <div style={{ fontSize:12, color:"#52525B", marginBottom:14 }}>Aucune amélioration — lance d'abord une analyse.</div>
                <button className="btn-t" onClick={() => setTab("analyse")}>→ Analyser</button>
              </div>
            ) : (
              <div>
                {/* Summary chips */}
                <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:20 }}>
                  {[
                    { label:"HAUTE",  count:byPri.high.length,   color:"#EF4444" },
                    { label:"MOYENNE",count:byPri.medium.length, color:"#F97316" },
                    { label:"BASSE",  count:byPri.low.length,    color:"#52525B" },
                  ].map((s,i) => (
                    <div key={i} className={`card fi d${i+1}`} style={{ padding:"12px 14px", opacity:0 }}>
                      <div className="mono" style={{ fontSize:9, color:"#3F3F46", letterSpacing:".06em", marginBottom:4 }}>PRIORITÉ {s.label}</div>
                      <div style={{ fontSize:22, fontWeight:600, color:s.color }}>{s.count}</div>
                    </div>
                  ))}
                </div>

                {/* Items grouped by priority */}
                {["high","medium","low"].map(pri => {
                  const group = byPri[pri];
                  if (!group.length) return null;
                  const pLabel = pri === "high" ? "HAUTE" : pri === "medium" ? "MOYENNE" : "BASSE";
                  const pColor = pri === "high" ? "#EF4444" : pri === "medium" ? "#F97316" : "#52525B";
                  return (
                    <div key={pri} style={{ marginBottom:20 }}>
                      <div className="mono" style={{ fontSize:9, color:pColor, letterSpacing:".08em", marginBottom:8 }}>
                        PRIORITÉ {pLabel} — {group.length} items
                      </div>
                      {group.map((imp, i) => {
                        const cat     = CATS[imp.category] || CATS.features;
                        const eLabel  = imp.effort === "quick" ? "Rapide" : imp.effort === "medium" ? "Moyen" : "Majeur";
                        const isCopied = copied === imp.id;
                        return (
                          <div key={imp.id} className={`icard fi d${Math.min(i+1,5)}`} style={{ opacity:0 }}>
                            <div style={{ display:"flex", alignItems:"flex-start", gap:10 }}>
                              <span style={{ color:cat.color, fontSize:14, flexShrink:0, marginTop:2 }}>{cat.icon}</span>
                              <div style={{ flex:1, minWidth:0 }}>
                                <div style={{ fontSize:13, fontWeight:500, color:"#FAFAFA", marginBottom:4 }}>{imp.title}</div>
                                <div style={{ fontSize:12, color:"#71717A", lineHeight:1.5, marginBottom:8 }}>{imp.description}</div>
                                <div style={{ display:"flex", gap:6, flexWrap:"wrap", alignItems:"center" }}>
                                  <span className="chip" style={{ background:cat.color+"15", color:cat.color }}>{cat.label}</span>
                                  <span className="chip" style={{ background:"rgba(255,255,255,.04)", color:"#52525B" }}>{eLabel}</span>
                                  <div style={{ flex:1 }} />
                                  <button className="btn-s" onClick={() => copyPrompt(imp)}>
                                    {isCopied ? "✓ Copié" : "↗ Prompt"}
                                  </button>
                                  <button className="btn-s" onClick={() => dismiss(imp.id)}>✕</button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ═══ BASE MD ═══ */}
        {tab === "base" && (
          <div>
            {/* Sync header */}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <div className="mono" style={{ fontSize:9, color:"#3F3F46", letterSpacing:".08em" }}>SOURCE DE VÉRITÉ</div>
                <span className="chip" style={{ background:"rgba(94,234,212,.10)", color:"#5EEAD4" }}>
                  ARTIFACT {ARTIFACT_VERSION}
                </span>
                <span style={{ fontSize:10, color:"#3F3F46" }}>↔</span>
                <span className="chip" style={{ background:"rgba(167,139,250,.10)", color:"#A78BFA" }}>
                  MD {MD_VERSION}
                </span>
                {ARTIFACT_VERSION === MD_VERSION
                  ? <span style={{ fontSize:11, color:"#22C55E" }}>✓ sync</span>
                  : <span style={{ fontSize:11, color:"#EF4444" }}>⚠ désync</span>
                }
              </div>
              <button
                className="btn-t"
                onClick={() => {
                  navigator.clipboard.writeText(MD_SOURCE).then(() => {
                    setMdCopied(true);
                    setTimeout(() => setMdCopied(false), 2500);
                  });
                }}
              >
                {mdCopied ? "✓ Copié" : "↓ Copier MD"}
              </button>
            </div>

            {/* MD rendered */}
            <div className="card" style={{ padding:0, overflow:"hidden" }}>
              {MD_SOURCE.split("\n").map((line, i) => {
                const isH1     = line.startsWith("# ") && !line.startsWith("## ");
                const isH2     = line.startsWith("## ");
                const isHr     = line.trim() === "---";
                const isBullet = line.startsWith("- ");
                const isTable  = line.startsWith("|");
                const isEmpty  = line.trim() === "";
                if (isHr)     return <div key={i} style={{ height:1, background:"rgba(255,255,255,.04)", margin:"2px 0" }} />;
                if (isEmpty)  return <div key={i} style={{ height:6 }} />;
                if (isH1)     return (
                  <div key={i} style={{ padding:"14px 16px 6px", fontSize:14, fontWeight:600, color:"#FAFAFA", borderBottom:"1px solid rgba(255,255,255,.04)" }}>
                    {line.replace(/^# /, "")}
                  </div>
                );
                if (isH2)     return (
                  <div key={i} style={{ padding:"10px 16px 4px", fontSize:10, fontFamily:"JetBrains Mono,monospace", color:"#5EEAD4", letterSpacing:".08em" }}>
                    {line.replace(/^## /, "").toUpperCase()}
                  </div>
                );
                if (isBullet) return (
                  <div key={i} style={{ padding:"1px 16px 1px 24px", fontSize:12, color:"#A1A1AA", display:"flex", gap:6 }}>
                    <span style={{ color:"#3F3F46", flexShrink:0 }}>›</span>
                    <span style={{ fontFamily: line.includes(":") ? "JetBrains Mono,monospace" : "inherit", fontSize:11 }}>
                      {line.replace(/^- /, "")}
                    </span>
                  </div>
                );
                if (isTable)  return (
                  <div key={i} style={{ padding:"1px 16px", fontSize:10, fontFamily:"JetBrains Mono,monospace", color: line.startsWith("|--") ? "transparent" : "#71717A", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                    {line}
                  </div>
                );
                return (
                  <div key={i} style={{ padding:"1px 16px", fontSize:11, color:"#52525B", fontStyle:"italic" }}>
                    {line}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══ LOG ═══ */}
        {tab === "log" && (
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
              <div className="mono" style={{ fontSize:9, color:"#3F3F46", letterSpacing:".08em" }}>
                HISTORIQUE ANALYSES ({log.length})
              </div>
              {log.length > 0 && (
                <button className="btn-s red" onClick={resetAll}>Tout effacer</button>
              )}
            </div>
            {log.length === 0 ? (
              <div className="card" style={{ padding:40, textAlign:"center" }}>
                <div style={{ fontSize:12, color:"#52525B" }}>Aucune analyse enregistrée.</div>
              </div>
            ) : (
              log.map((entry, i) => {
                const hc = entry.health >= 70 ? "#22C55E" : entry.health >= 50 ? "#EAB308" : "#EF4444";
                return (
                  <div key={entry.id} className={`card fi d${Math.min(i+1,5)}`} style={{ padding:"14px 16px", marginBottom:8, opacity:0 }}>
                    <div style={{ display:"flex", alignItems:"flex-start", gap:12 }}>
                      <span style={{ fontSize:22, fontWeight:700, color:hc, fontFamily:"JetBrains Mono,monospace", lineHeight:1, flexShrink:0 }}>{entry.health}</span>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:12, color:"#A1A1AA", lineHeight:1.5, marginBottom:4 }}>{entry.summary}</div>
                        {entry.focus && (
                          <div className="mono" style={{ fontSize:10, color:"#3F3F46" }}>focus: {entry.focus}</div>
                        )}
                      </div>
                      <div style={{ textAlign:"right", flexShrink:0 }}>
                        <div className="mono" style={{ fontSize:10, color:"#52525B" }}>{entry.date} {entry.time}</div>
                        <span className="chip" style={{ background:"rgba(94,234,212,.08)", color:"#5EEAD4", marginTop:4, display:"inline-flex" }}>
                          {entry.count} items
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}
