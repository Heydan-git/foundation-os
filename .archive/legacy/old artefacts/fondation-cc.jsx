import { useState, useEffect } from "react";

// ═══════════════════════════════════════════════════════
// DATA — Source : FONDATION-CC-DATA.md v1.0.0 | 2026-04-03
// Mesures réelles : wc -c / wc -l / wc -w
// Tokens estimés : bytes ÷ 3.5 (ratio code JSX)
// ═══════════════════════════════════════════════════════

const DATA_VERSION = "1.0.0";
const LAST_SYNC = "2026-04-03";
const STORAGE_KEY = "fondation-cc-v1";
const MAX_TOKENS = 200000;
const ALERT_PCT = 0.5;
const CRITICAL_PCT = 0.8;

const ARTIFACTS = [
  {
    id: "A01", file: "ios-pipeline-dashboard.jsx",
    bytes: 40730, lines: 701, tokens: 11637,
    purpose: "Pipeline iOS Grade A — référence statique, 8 phases × 3 budgets × outils × KPIs",
    daScore: 0, daMax: 6,
    daIssues: ["Fond #0A0A0B", "Font Outfit", "Pas d'orbes", "Pas de glassmorphism", "JetBrains partiel", "Cards non-glass"],
    hasStorage: false, isStatic: true, status: "active",
    features: ["Pipeline 8 phases", "Budget 3 tiers", "Tableau outils", "KPIs phases", "Monitoring métriques", "Roadmap v1→v3", "Modularité"],
    overlaps: [],
    actions: ["ACT-02"],
  },
  {
    id: "A02", file: "fondation-monitor.jsx",
    bytes: 33468, lines: 683, tokens: 9562,
    purpose: "Monitoring Fondation — phases, journal, décisions, risques, docs",
    daScore: 0, daMax: 6,
    daIssues: ["Fond #08080A", "Fonts système", "Pas d'orbes", "Pas de glassmorphism", "JetBrains absent", "Cards non-glass"],
    hasStorage: true, isStatic: false, status: "active",
    features: ["Phases + tasks", "Journal sessions", "Registre décisions ADR", "Registre risques", "Docs tracker", "Quality gates", "Reset données"],
    overlaps: ["A04 — Journal", "A04 — Décisions ADR"],
    actions: ["ACT-03"],
  },
  {
    id: "A03", file: "project-index-dashboard.jsx",
    bytes: 23308, lines: 418, tokens: 6659,
    purpose: "Index conversations — navigation entre sessions du projet",
    daScore: 6, daMax: 6,
    daIssues: [],
    hasStorage: false, isStatic: true, status: "active",
    features: ["Index convs", "Vue thèmes", "Vue fichiers", "Détail conv", "Filtrage tags"],
    overlaps: [],
    actions: ["ACT-05"],
  },
  {
    id: "A04", file: "conversation-control.jsx",
    bytes: 27397, lines: 517, tokens: 7828,
    purpose: "Contrôle conv spécifique — livrables, fichiers Cowork, décisions, sync",
    daScore: 6, daMax: 6,
    daIssues: [],
    hasStorage: false, isStatic: true, status: "deprecated",
    features: ["Timeline livrables", "Fichiers Cowork", "Décisions", "Sync log", "Next steps", "Architecture mémoire"],
    overlaps: ["A02 — Journal", "A02 — Décisions ADR"],
    actions: ["ACT-04"],
  },
];

const SYS_TOKENS_EST = 12000;
const CONV_TOKENS_EST = 3000;

const ACTIONS = [
  { id: "ACT-01", type: "CREATE", target: "fondation-hub.jsx", priority: "P0",
    reason: "Hub central manquant — ossature du système, navigation entre outils", acColor: "#EF4444" },
  { id: "ACT-02", type: "MODIFY", target: "ios-pipeline-dashboard.jsx", priority: "P1",
    reason: "DA non conforme 0/6 — contenu OK, reskin Void Glass complet", acColor: "#F97316" },
  { id: "ACT-03", type: "MODIFY", target: "fondation-monitor.jsx", priority: "P1",
    reason: "DA non conforme 0/6 + absorber livrables / next-steps de A04", acColor: "#F97316" },
  { id: "ACT-04", type: "ARCHIVE", target: "conversation-control.jsx", priority: "P2",
    reason: "Doublon journal+décisions, statique, lié à 1 conv passée", acColor: "#EAB308" },
  { id: "ACT-05", type: "MODIFY", target: "project-index-dashboard.jsx", priority: "P2",
    reason: "100% statique — 3 convs hardcodées, non maintenable", acColor: "#EAB308" },
  { id: "ACT-06", type: "CREATE", target: "fondation-cc.jsx", priority: "P0",
    reason: "Control Center — analyse cohérence système ← ce fichier", acColor: "#22C55E" },
];

const DA_RULES = [
  { id: "R1", label: "Fond #06070C" },
  { id: "R2", label: "Font Figtree (UI)" },
  { id: "R3", label: "Font JetBrains Mono (labels)" },
  { id: "R4", label: "Glassmorphism rgba" },
  { id: "R5", label: "Orbes blur(80px) opacity .12" },
  { id: "R6", label: "Accent #5EEAD4 + fade-in staggeré" },
];

const DA_MATRIX = {
  A01: [false, false, false, false, false, false],
  A02: [false, false, false, false, false, false],
  A03: [true, true, true, true, true, true],
  A04: [true, true, true, true, true, true],
};

const GAPS = [
  { id: "G-01", label: "Hub central / OS de travail", priority: "high" },
  { id: "G-02", label: "Versioning artifacts", priority: "medium" },
  { id: "G-03", label: "Index conversations dynamique", priority: "medium" },
  { id: "G-04", label: "Navigation croisée entre artifacts", priority: "low" },
];

// ═══════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════

export default function FondationCC() {
  const [tab, setTab] = useState("systeme");
  const [actStatus, setActStatus] = useState({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage.get(STORAGE_KEY);
        if (r) { const d = JSON.parse(r.value); if (d.actStatus) setActStatus(d.actStatus); }
      } catch {}
      setLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    (async () => { try { await window.storage.set(STORAGE_KEY, JSON.stringify({ actStatus, savedAt: new Date().toISOString() })); } catch {} })();
  }, [actStatus, loaded]);

  const cycleStatus = (id) => {
    const order = ["todo", "in-progress", "done"];
    setActStatus(p => { const cur = p[id] || "todo"; return { ...p, [id]: order[(order.indexOf(cur) + 1) % 3] }; });
  };

  const totalArtifactTokens = ARTIFACTS.reduce((a, x) => a + x.tokens, 0);
  const totalEstTokens = totalArtifactTokens + SYS_TOKENS_EST + CONV_TOKENS_EST;
  const totalPct = totalEstTokens / MAX_TOKENS;

  const daOK = ARTIFACTS.filter(a => a.daScore === a.daMax).length;
  const hasStorage = ARTIFACTS.filter(a => a.hasStorage).length;
  const deprecated = ARTIFACTS.filter(a => a.status === "deprecated").length;
  const actDone = ACTIONS.filter(a => (actStatus[a.id] || "todo") === "done").length;
  const overlapCount = ARTIFACTS.reduce((a, x) => a + x.overlaps.length, 0) / 2;

  const barColor = (pct) => pct >= CRITICAL_PCT ? "#EF4444" : pct >= ALERT_PCT ? "#EAB308" : "#5EEAD4";
  const tokenColor = (t) => t >= 15000 ? "#EF4444" : t >= 10000 ? "#EAB308" : "#5EEAD4";
  const maxTokens = Math.max(...ARTIFACTS.map(a => a.tokens));
  const statusBadge = (s) => ({ todo: ["À FAIRE", "#52525B"], "in-progress": ["EN COURS", "#5EEAD4"], done: ["FAIT", "#22C55E"] }[s] || ["À FAIRE", "#52525B"]);
  const typeColor = (t) => ({ CREATE: "#22C55E", MODIFY: "#F97316", ARCHIVE: "#EAB308" }[t] || "#52525B");
  const pColor = (p) => ({ high: "#EF4444", medium: "#F97316", low: "#52525B" }[p] || "#52525B");

  const tabs = [
    { id: "systeme", label: "Système", icon: "◉" },
    { id: "artifacts", label: "Artifacts", icon: "▦" },
    { id: "coherence", label: "Cohérence", icon: "◈" },
    { id: "actions", label: "Actions", icon: "▲" },
  ];

  const S = {
    root: { fontFamily: "'Figtree', -apple-system, sans-serif", background: "#06070C", color: "#D4D4D8", minHeight: "100vh", position: "relative", overflow: "hidden" },
    orb: (w, h, bg, t, l, delay = "0s") => ({ position: "absolute", width: w, height: h, borderRadius: "50%", background: bg, filter: "blur(80px)", opacity: .12, top: t, left: l, pointerEvents: "none", animation: `orb 18s ease-in-out ${delay} infinite` }),
    header: { padding: "20px 22px 0", borderBottom: "1px solid rgba(255,255,255,.04)", position: "relative", zIndex: 2 },
    card: { background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.05)", borderRadius: 10 },
    label: { fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: "#3F3F46", letterSpacing: ".07em" },
    mono: { fontFamily: "'JetBrains Mono', monospace" },
    tag: (c) => ({ display: "inline-flex", alignItems: "center", padding: "2px 8px", borderRadius: 4, fontSize: 10, fontFamily: "'JetBrains Mono', monospace", background: c + "18", color: c, fontWeight: 600, letterSpacing: ".04em" }),
    bar: { height: 4, background: "rgba(255,255,255,.06)", borderRadius: 2, overflow: "hidden", position: "relative" },
    fill: (pct, c) => ({ position: "absolute", top: 0, left: 0, height: "100%", width: `${Math.min(pct * 100, 100)}%`, background: c, borderRadius: 2, transition: "width .5s ease" }),
    grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },
    grid4: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 },
  };

  return (
    <div style={S.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Figtree:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:rgba(94,234,212,.15);border-radius:4px}
        .fi{opacity:0;transform:translateY(6px);animation:fu .3s ease forwards}
        .d1{animation-delay:.05s}.d2{animation-delay:.1s}.d3{animation-delay:.15s}
        .d4{animation-delay:.2s}.d5{animation-delay:.25s}.d6{animation-delay:.3s}
        @keyframes fu{to{opacity:1;transform:translateY(0)}}
        @keyframes orb{0%,100%{transform:translate(0,0)}50%{transform:translate(20px,-15px)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
        .hvr:hover{background:rgba(255,255,255,.04)!important;border-color:rgba(255,255,255,.1)!important}
        .tab-b{background:none;border:none;border-bottom:2px solid transparent;padding:8px 14px 12px;cursor:pointer;font-family:'Figtree',sans-serif;font-size:13px;font-weight:500;color:#52525B;transition:all .15s;display:flex;align-items:center;gap:6px}
        .tab-b:hover{color:#A1A1AA}
        .tab-b.on{color:#5EEAD4;border-bottom-color:#5EEAD4}
        .act-btn{background:transparent;border:1px solid rgba(255,255,255,.08);border-radius:4px;padding:3px 10px;cursor:pointer;font-size:10px;font-family:'JetBrains Mono',monospace;transition:all .15s}
        .act-btn:hover{background:rgba(255,255,255,.06)}
      `}</style>

      {/* Orbs */}
      <div style={S.orb(280, 280, "#A78BFA", -80, -60, "0s")} />
      <div style={S.orb(200, 200, "#5EEAD4", "60%", -50, "6s")} />
      <div style={S.orb(160, 160, "#3B82F6", "20%", "85%", "12s")} />

      {/* Header */}
      <div style={S.header}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 2 }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#5EEAD4", display: "inline-block", animation: "pulse 3s ease infinite" }} />
          <span style={{ fontSize: 18, fontWeight: 700, color: "#FAFAFA", letterSpacing: "-.02em" }}>Fondation CC</span>
          <span style={{ ...S.tag("#5EEAD4"), marginLeft: 4 }}>v{DATA_VERSION}</span>
          <span style={{ marginLeft: "auto", fontSize: 10, ...S.mono, color: "#27272A" }}>{LAST_SYNC}</span>
        </div>
        <p style={{ fontSize: 12, color: "#52525B", marginBottom: 12 }}>Control Center — cohérence système, budget contexte, actions</p>

        {/* Global budget bar */}
        <div style={{ marginBottom: 14, padding: "10px 14px", background: "rgba(255,255,255,.015)", borderRadius: 8, border: "1px solid rgba(255,255,255,.04)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
            <span style={{ ...S.label }}>BUDGET CONTEXTE — {MAX_TOKENS.toLocaleString()} TOKENS MAX</span>
            <span style={{ fontSize: 11, ...S.mono, color: barColor(totalPct), fontWeight: 600 }}>
              ~{totalEstTokens.toLocaleString()} tokens ({(totalPct * 100).toFixed(1)}%)
            </span>
          </div>
          <div style={S.bar}>
            {/* Artifacts */}
            <div style={{ ...S.fill(totalArtifactTokens / MAX_TOKENS, "#5EEAD4") }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5, fontSize: 10, ...S.mono, color: "#3F3F46" }}>
            <span>Artifacts : {totalArtifactTokens.toLocaleString()} tok. ({(totalArtifactTokens / MAX_TOKENS * 100).toFixed(1)}%)</span>
            <span style={{ color: "#27272A" }}>Seuil alerte : 50% · Seuil critique : 80%</span>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 0 }}>
          {tabs.map(t => (
            <button key={t.id} className={`tab-b ${tab === t.id ? "on" : ""}`} onClick={() => setTab(t.id)}>
              <span style={{ fontSize: 10, opacity: .7 }}>{t.icon}</span>{t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: 22, position: "relative", zIndex: 2 }} key={tab}>

        {/* ═══ SYSTÈME ═══ */}
        {tab === "systeme" && (
          <div>
            <div style={{ ...S.grid4, marginBottom: 16 }}>
              {[
                { l: "ARTIFACTS", v: ARTIFACTS.length, c: "#5EEAD4", s: `${ARTIFACTS.filter(a => a.status === "active").length} actifs` },
                { l: "DA COMPLIANT", v: `${daOK}/${ARTIFACTS.length}`, c: daOK < ARTIFACTS.length ? "#EAB308" : "#22C55E", s: `${ARTIFACTS.length - daOK} non conformes` },
                { l: "OVERLAPS", v: overlapCount, c: overlapCount > 0 ? "#F97316" : "#22C55E", s: "fonctionnalités doublons" },
                { l: "ACTIONS", v: `${actDone}/${ACTIONS.length}`, c: "#A78BFA", s: `${ACTIONS.filter(a => (actStatus[a.id] || "todo") !== "done").length} en attente` },
              ].map((m, i) => (
                <div key={i} className={`fi d${i + 1}`} style={{ ...S.card, padding: "14px 16px" }}>
                  <div style={{ ...S.label, marginBottom: 8 }}>{m.l}</div>
                  <div style={{ fontSize: 26, fontWeight: 700, color: m.c, lineHeight: 1, ...S.mono }}>{m.v}</div>
                  <div style={{ fontSize: 10, color: "#52525B", marginTop: 5 }}>{m.s}</div>
                </div>
              ))}
            </div>

            {/* Artifact weight overview */}
            <div className="fi d2" style={{ ...S.card, padding: 16, marginBottom: 12 }}>
              <div style={{ ...S.label, marginBottom: 14 }}>POIDS PAR ARTIFACT — BUDGET CONTEXTE</div>
              {ARTIFACTS.map((a, i) => {
                const pct = a.tokens / maxTokens;
                const ctxPct = a.tokens / MAX_TOKENS;
                return (
                  <div key={a.id} style={{ display: "grid", gridTemplateColumns: "90px 1fr 80px 70px 60px", gap: 12, alignItems: "center", marginBottom: 10 }}>
                    <span style={{ fontSize: 10, ...S.mono, color: "#5EEAD4", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.id}</span>
                    <div>
                      <div style={S.bar}>
                        <div style={S.fill(pct, tokenColor(a.tokens))} />
                      </div>
                    </div>
                    <span style={{ fontSize: 10, ...S.mono, color: "#71717A", textAlign: "right" }}>{(a.bytes / 1024).toFixed(1)} KB</span>
                    <span style={{ fontSize: 10, ...S.mono, color: tokenColor(a.tokens), textAlign: "right" }}>{a.tokens.toLocaleString()} tok.</span>
                    <span style={{ ...S.tag(tokenColor(ctxPct * 10)), fontSize: 9 }}>{(ctxPct * 100).toFixed(1)}%</span>
                  </div>
                );
              })}
              <div style={{ marginTop: 6, paddingTop: 10, borderTop: "1px solid rgba(255,255,255,.04)", display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 10, ...S.mono, color: "#52525B" }}>TOTAL ARTIFACTS</span>
                <span style={{ fontSize: 11, ...S.mono, color: "#5EEAD4", fontWeight: 600 }}>{(124903 / 1024).toFixed(0)} KB · {totalArtifactTokens.toLocaleString()} tok. · {(totalArtifactTokens / MAX_TOKENS * 100).toFixed(1)}% fenêtre</span>
              </div>
            </div>

            {/* Health summary */}
            <div className="fi d3" style={{ ...S.card, padding: 16 }}>
              <div style={{ ...S.label, marginBottom: 12 }}>ÉTAT SYSTÈME</div>
              {[
                { check: daOK === ARTIFACTS.length, label: "DA Void Glass — tous conformes", ok: false, detail: `${ARTIFACTS.length - daOK} artifacts non conformes` },
                { check: overlapCount === 0, label: "Pas de doublons fonctionnels", ok: false, detail: "Journal + Décisions en doublon (A02 ↔ A04)" },
                { check: deprecated === 0, label: "Aucun artifact déprécié", ok: false, detail: "A04 conversation-control.jsx = deprecated" },
                { check: true, label: "Budget contexte sain (< 50%)", ok: true, detail: `${(totalEstTokens / MAX_TOKENS * 100).toFixed(1)}% utilisé — large marge` },
                { check: false, label: "Hub central présent", ok: false, detail: "fondation-hub.jsx manquant (ACT-01)" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", padding: "6px 0", borderBottom: i < 4 ? "1px solid rgba(255,255,255,.03)" : "none" }}>
                  <span style={{ fontSize: 14, flexShrink: 0 }}>{item.check ? "✅" : "⚠️"}</span>
                  <span style={{ fontSize: 12, color: item.check ? "#D4D4D8" : "#A1A1AA", flex: 1 }}>{item.label}</span>
                  <span style={{ fontSize: 11, color: item.check ? "#22C55E" : "#71717A", ...S.mono }}>{item.detail}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ ARTIFACTS ═══ */}
        {tab === "artifacts" && (
          <div style={{ display: "grid", gap: 12 }}>
            {ARTIFACTS.map((a, i) => {
              const ctxPct = a.tokens / MAX_TOKENS;
              const relPct = a.tokens / maxTokens;
              return (
                <div key={a.id} className={`fi d${i + 1} hvr`} style={{
                  ...S.card, padding: "16px 18px",
                  borderLeft: `3px solid ${a.status === "deprecated" ? "#3F3F46" : a.daScore === a.daMax ? "#22C55E20" : "#F9731620"}`,
                }}>
                  {/* Top row */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <span style={{ fontSize: 10, ...S.mono, color: "#5EEAD4" }}>{a.id}</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#FAFAFA", flex: 1 }}>{a.file}</span>
                    <span style={S.tag(a.status === "deprecated" ? "#52525B" : a.status === "active" ? "#22C55E" : "#5EEAD4")}>
                      {a.status.toUpperCase()}
                    </span>
                    <span style={S.tag(a.daScore === a.daMax ? "#22C55E" : "#EF4444")}>
                      DA {a.daScore}/{a.daMax}
                    </span>
                    <span style={S.tag(a.hasStorage ? "#5EEAD4" : "#3F3F46")}>
                      {a.hasStorage ? "storage ✓" : "statique"}
                    </span>
                  </div>

                  {/* Purpose */}
                  <p style={{ fontSize: 12, color: "#71717A", marginBottom: 12 }}>{a.purpose}</p>

                  {/* Weight bar */}
                  <div style={{ marginBottom: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                      <span style={{ fontSize: 10, ...S.mono, color: "#3F3F46" }}>POIDS CONTEXTE</span>
                      <span style={{ fontSize: 10, ...S.mono, color: tokenColor(a.tokens) }}>
                        {(a.bytes / 1024).toFixed(1)} KB · {a.tokens.toLocaleString()} tokens · {(ctxPct * 100).toFixed(1)}% / 200K
                      </span>
                    </div>
                    <div style={{ ...S.bar, height: 6 }}>
                      <div style={{ ...S.fill(relPct, tokenColor(a.tokens)), height: 6 }} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, fontSize: 9, ...S.mono, color: "#27272A" }}>
                      <span>0</span>
                      <span style={{ color: tokenColor(a.tokens) }}>{a.lines} lignes</span>
                      <span>MAX {(40730 / 1024).toFixed(1)} KB</span>
                    </div>
                  </div>

                  {/* Features + Issues */}
                  <div style={S.grid2}>
                    <div>
                      <div style={{ ...S.label, marginBottom: 6 }}>FEATURES ({a.features.length})</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                        {a.features.map(f => (
                          <span key={f} style={{ fontSize: 10, background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.06)", borderRadius: 4, padding: "2px 7px", color: "#A1A1AA" }}>{f}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      {a.daIssues.length > 0 && (
                        <>
                          <div style={{ ...S.label, marginBottom: 6 }}>DA ISSUES ({a.daIssues.length})</div>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                            {a.daIssues.map(d => (
                              <span key={d} style={{ fontSize: 10, background: "rgba(239,68,68,.08)", border: "1px solid rgba(239,68,68,.15)", borderRadius: 4, padding: "2px 7px", color: "#EF4444" }}>{d}</span>
                            ))}
                          </div>
                        </>
                      )}
                      {a.overlaps.length > 0 && (
                        <>
                          <div style={{ ...S.label, marginTop: 8, marginBottom: 6 }}>OVERLAPS</div>
                          {a.overlaps.map(o => (
                            <div key={o} style={{ fontSize: 11, color: "#F97316", display: "flex", alignItems: "center", gap: 6 }}>
                              <span style={{ opacity: .5 }}>⚠</span> {o}
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ═══ COHÉRENCE ═══ */}
        {tab === "coherence" && (
          <div>
            {/* DA Matrix */}
            <div className="fi d1" style={{ ...S.card, padding: 16, marginBottom: 14 }}>
              <div style={{ ...S.label, marginBottom: 14 }}>MATRICE DA COMPLIANCE — VOID GLASS</div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: "left", padding: "6px 10px", ...S.mono, color: "#3F3F46", fontSize: 10, fontWeight: 500, borderBottom: "1px solid rgba(255,255,255,.05)" }}>RÈGLE</th>
                      {ARTIFACTS.map(a => (
                        <th key={a.id} style={{ textAlign: "center", padding: "6px 10px", ...S.mono, color: "#5EEAD4", fontSize: 10, fontWeight: 500, borderBottom: "1px solid rgba(255,255,255,.05)" }}>{a.id}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {DA_RULES.map((rule, ri) => (
                      <tr key={rule.id} style={{ borderBottom: "1px solid rgba(255,255,255,.03)" }}>
                        <td style={{ padding: "7px 10px", color: "#A1A1AA" }}>{rule.id} — {rule.label}</td>
                        {ARTIFACTS.map(a => (
                          <td key={a.id} style={{ textAlign: "center", padding: "7px 10px" }}>
                            {DA_MATRIX[a.id][ri] ? "✅" : "❌"}
                          </td>
                        ))}
                      </tr>
                    ))}
                    <tr style={{ background: "rgba(255,255,255,.015)" }}>
                      <td style={{ padding: "8px 10px", ...S.mono, fontSize: 10, color: "#3F3F46", fontWeight: 600 }}>SCORE</td>
                      {ARTIFACTS.map(a => (
                        <td key={a.id} style={{ textAlign: "center", padding: "8px 10px" }}>
                          <span style={S.tag(a.daScore === a.daMax ? "#22C55E" : "#EF4444")}>{a.daScore}/{a.daMax}</span>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Overlaps */}
            <div className="fi d2" style={{ ...S.card, padding: 16, marginBottom: 14 }}>
              <div style={{ ...S.label, marginBottom: 12 }}>DOUBLONS FONCTIONNELS</div>
              {[
                { a: "A02 fondation-monitor", b: "A04 conversation-control", feature: "Journal / Sessions", action: "→ Garder A02, migrer dans ACT-03" },
                { a: "A02 fondation-monitor", b: "A04 conversation-control", feature: "Décisions ADR", action: "→ Garder A02, migrer dans ACT-03" },
              ].map((o, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 12, alignItems: "center", padding: "8px 0", borderBottom: i === 0 ? "1px solid rgba(255,255,255,.04)" : "none" }}>
                  <div>
                    <span style={{ fontSize: 11, ...S.mono, color: "#5EEAD4" }}>{o.a}</span>
                    <span style={{ fontSize: 11, color: "#52525B", margin: "0 6px" }}>↔</span>
                    <span style={{ fontSize: 11, ...S.mono, color: "#94A3B8" }}>{o.b}</span>
                  </div>
                  <span style={S.tag("#F97316")}>{o.feature}</span>
                  <span style={{ fontSize: 11, color: "#52525B" }}>{o.action}</span>
                </div>
              ))}
            </div>

            {/* Gaps */}
            <div className="fi d3" style={{ ...S.card, padding: 16 }}>
              <div style={{ ...S.label, marginBottom: 12 }}>GAPS — FONCTIONNALITÉS MANQUANTES</div>
              {GAPS.map((g, i) => (
                <div key={g.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "7px 0", borderBottom: i < GAPS.length - 1 ? "1px solid rgba(255,255,255,.03)" : "none" }}>
                  <span style={{ fontSize: 11, ...S.mono, color: "#3F3F46" }}>{g.id}</span>
                  <span style={{ fontSize: 13, color: "#D4D4D8", flex: 1 }}>{g.label}</span>
                  <span style={S.tag(pColor(g.priority))}>{g.priority.toUpperCase()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ ACTIONS ═══ */}
        {tab === "actions" && (
          <div>
            <div style={{ ...S.label, marginBottom: 12 }}>
              BACKLOG — {actDone}/{ACTIONS.length} COMPLÉTÉES
            </div>
            <div style={{ display: "grid", gap: 8 }}>
              {ACTIONS.map((a, i) => {
                const [statusLabel, statusColor] = statusBadge(actStatus[a.id] || "todo");
                const done = (actStatus[a.id] || "todo") === "done";
                return (
                  <div key={a.id} className={`fi d${Math.min(i + 1, 6)} hvr`} style={{
                    ...S.card, padding: "14px 18px",
                    borderLeft: `3px solid ${typeColor(a.type)}30`,
                    opacity: done ? .5 : 1,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                      <span style={{ ...S.mono, fontSize: 10, color: "#3F3F46" }}>{a.id}</span>
                      <span style={S.tag(typeColor(a.type))}>{a.type}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: done ? "#52525B" : "#FAFAFA", flex: 1, textDecoration: done ? "line-through" : "none" }}>
                        {a.target}
                      </span>
                      <span style={S.tag(a.priority === "P0" ? "#EF4444" : a.priority === "P1" ? "#F97316" : "#EAB308")}>{a.priority}</span>
                      <button
                        className="act-btn"
                        onClick={() => cycleStatus(a.id)}
                        style={{ color: statusColor, borderColor: statusColor + "30" }}
                      >
                        {statusLabel}
                      </button>
                    </div>
                    <p style={{ fontSize: 12, color: "#71717A", paddingLeft: 0 }}>{a.reason}</p>
                  </div>
                );
              })}
            </div>

            {/* MD sync reminder */}
            <div className="fi d6" style={{ ...S.card, padding: 14, marginTop: 16, borderColor: "rgba(94,234,212,.08)", background: "rgba(94,234,212,.02)" }}>
              <div style={{ ...S.label, color: "#5EEAD4", marginBottom: 6 }}>RÈGLE ARCHITECTURE</div>
              <p style={{ fontSize: 12, color: "#71717A" }}>
                Toute action complétée → bumper <span style={{ ...S.mono, color: "#5EEAD4" }}>DATA_VERSION</span> dans{" "}
                <span style={{ ...S.mono, color: "#5EEAD4" }}>FONDATION-CC-DATA.md</span> et mettre à jour <span style={{ ...S.mono, color: "#5EEAD4" }}>LAST_SYNC</span>.
                Le MD est la source de vérité — le JSX est le contrôleur.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
