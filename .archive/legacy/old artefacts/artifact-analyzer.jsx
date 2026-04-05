import { useState, useEffect } from "react";

// ─── SOURCE : ARTIFACT-ANALYZER-DATA.md (DATA_VERSION: 1.2) ───
// Ce JSX est un contrôleur pur. Toute modification de données → MD d'abord.

const STORAGE_KEY = "artifact-analyzer-v1";
const LIMIT_LINES = 800;
const LIMIT_KB = 50;

const INITIAL_DATA = {
  dataVersion: "1.2",
  lastSync: "2026-04-03",
  artifacts: [
    {
      id: "ios-pipeline",
      file: "ios-pipeline-dashboard.jsx",
      lines: 701,
      chars: 40321,
      kb: 39.4,
      storage: false,
      storageKey: null,
      mdPair: false,
      mdFile: null,
      tabs: 4,
      tabLabels: ["Pipeline", "Budget", "Monitoring", "Évolution"],
      consts: [
        { name: "PHASES", entries: 8, note: "8 phases × 6 steps × 3 budgets + 3 KPIs" },
        { name: "BUDGETS", entries: 3, note: "Bootstrap / Indie / Funded" },
        { name: "MONITORING", entries: 20, note: "4 catégories × 5 métriques" },
        { name: "COST_TABLE", entries: 24, note: "3 tiers × ~8 items coût" },
        { name: "EVOLUTION_ROADMAP", entries: 24, note: "6 versions × 4 items" },
      ],
      recommendation: "Externaliser COST_TABLE + EVOLUTION_ROADMAP → MD. Économie ~120 lignes.",
      targetWeight: 72,
    },
    {
      id: "fondation-monitor",
      file: "fondation-monitor.jsx",
      lines: 683,
      chars: 33036,
      kb: 32.3,
      storage: true,
      storageKey: "fondation-monitor-v1",
      mdPair: "partial",
      mdFile: "FONDATION_MONITORING.md",
      tabs: 6,
      tabLabels: ["Vue globale", "Phases", "Journal", "Décisions", "Risques", "Docs"],
      consts: [
        { name: "DEFAULT_PHASES", entries: 8, note: "8 phases × ~6 tâches = ~44 tâches" },
        { name: "DEFAULT_SESSIONS", entries: 1, note: "Entrée initiale" },
        { name: "DEFAULT_DECISIONS", entries: 3, note: "Décisions fondation" },
        { name: "DEFAULT_RISKS", entries: 0, note: "Vide au départ" },
        { name: "DEFAULT_DOCS", entries: 4, note: "Documents trackés" },
      ],
      recommendation: "Externaliser les DEFAULT_* dans FONDATION-MONITOR-DATA.md. Storage key conservée runtime.",
      targetWeight: 75,
    },
    {
      id: "conversation-control",
      file: "conversation-control.jsx",
      lines: 517,
      chars: 27050,
      kb: 26.4,
      storage: false,
      storageKey: null,
      mdPair: false,
      mdFile: null,
      tabs: 4,
      tabLabels: ["Vue d'ensemble", "Fichiers Cowork", "Décisions", "Sync & Next"],
      consts: [
        { name: "CONV_META", entries: 1, note: "Métadonnées conversation" },
        { name: "DELIVERABLES", entries: 6, note: "Livrables avec type, status, phase" },
        { name: "COWORK_FILES", entries: 12, note: "Fichiers prêts à uploader" },
        { name: "DECISIONS", entries: 4, note: "Décisions journalisées" },
        { name: "NEXT_STEPS", entries: 5, note: "Prochaines étapes priorisées" },
        { name: "SYNC_LOG", entries: 2, note: "Entrées de synchronisation" },
      ],
      recommendation: "Créer CONVERSATION-CONTROL-DATA.md. Externaliser les 6 constantes. Économie ~100 lignes.",
      targetWeight: 52,
    },
    {
      id: "project-index",
      file: "project-index-dashboard.jsx",
      lines: 418,
      chars: 23064,
      kb: 22.5,
      storage: false,
      storageKey: null,
      mdPair: "partial",
      mdFile: "INDEX-DATA.md",
      tabs: 4,
      tabLabels: ["Vue d'ensemble", "Conversations", "Thèmes", "Fichiers"],
      consts: [
        { name: "CONVERSATIONS", entries: 3, note: "3 conversations avec items, decisions, files" },
        { name: "THEMES", entries: 6, note: "Thèmes transversaux" },
        { name: "STATS", entries: 5, note: "Métriques statiques projet" },
      ],
      recommendation: "Externaliser CONVERSATIONS dans INDEX-DATA.md. Économie ~60 lignes.",
      targetWeight: 45,
    },
  ],
  rules: {
    mdFirst: "Modifier NOM-DATA.md AVANT le JSX",
    bumpVersion: "DATA_VERSION bump à chaque modif",
    storageRuntime: "window.storage = état runtime uniquement",
    noDataInJsx: "Zéro logique métier dans les données du JSX",
    rebuildable: "Si JSX perdu → MD suffit à reconstruire",
  },
};

function weight(a) {
  return Math.round(Math.max(a.lines / LIMIT_LINES, a.kb / LIMIT_KB) * 100);
}

function weightColor(pct) {
  if (pct >= 87) return "#EF4444";
  if (pct >= 70) return "#F97316";
  if (pct >= 50) return "#EAB308";
  return "#22C55E";
}

function weightLabel(pct) {
  if (pct >= 87) return "Critique";
  if (pct >= 70) return "Lourd";
  if (pct >= 50) return "Surveillé";
  return "Sain";
}

function mdStatus(a) {
  if (a.mdPair === true) return { color: "#22C55E", label: "✓", title: a.mdFile };
  if (a.mdPair === "partial") return { color: "#EAB308", label: "~", title: a.mdFile + " (partiel)" };
  return { color: "#EF4444", label: "✗", title: "Aucun MD — perte totale si JSX perdu" };
}

export default function ArtifactAnalyzer() {
  const [data, setData] = useState(null);
  const [tab, setTab] = useState("overview");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage.get(STORAGE_KEY);
        setData(r ? JSON.parse(r.value) : INITIAL_DATA);
      } catch {
        setData(INITIAL_DATA);
      }
    })();
  }, []);

  useEffect(() => {
    if (data) window.storage.set(STORAGE_KEY, JSON.stringify(data)).catch(() => {});
  }, [data]);

  if (!data) return (
    <div style={{ background: "#06070C", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span style={{ fontFamily: "monospace", fontSize: 12, color: "#3F3F46" }}>Chargement…</span>
    </div>
  );

  const artifact = selected ? data.artifacts.find(a => a.id === selected) : null;
  const avgWeight = Math.round(data.artifacts.reduce((s, a) => s + weight(a), 0) / data.artifacts.length);
  const criticals = data.artifacts.filter(a => weight(a) >= 87).length;
  const noMd = data.artifacts.filter(a => a.mdPair === false).length;

  const tabs = [
    { id: "overview", label: "Vue globale", icon: "◉" },
    { id: "detail", label: "Détail", icon: "▦" },
    { id: "rules", label: "Règles", icon: "◆" },
  ];

  return (
    <div style={{ fontFamily: "'Figtree', -apple-system, sans-serif", background: "#06070C", color: "#D4D4D8", minHeight: "100vh", position: "relative", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:rgba(94,234,212,.15);border-radius:4px}
        @keyframes fu{to{opacity:1;transform:translateY(0)}}
        @keyframes drift{0%,100%{transform:translate(0,0)}50%{transform:translate(15px,-10px)}}
        .fi{opacity:0;transform:translateY(6px);animation:fu .3s ease forwards}
        .d1{animation-delay:.04s}.d2{animation-delay:.08s}.d3{animation-delay:.12s}.d4{animation-delay:.16s}
        .orb{position:absolute;border-radius:50%;filter:blur(80px);opacity:.08;pointer-events:none;animation:drift 20s ease-in-out infinite}
        .glass{background:rgba(255,255,255,.025);border:1px solid rgba(255,255,255,.055);border-radius:10px}
        .glass-hover{transition:all .15s}.glass-hover:hover{background:rgba(255,255,255,.04);border-color:rgba(94,234,212,.18);cursor:pointer}
        .nav{background:none;border:none;border-bottom:2px solid transparent;padding:8px 16px 12px;cursor:pointer;font-size:13px;font-family:'Figtree',sans-serif;font-weight:500;color:#52525B;transition:all .15s}
        .nav:hover{color:#A1A1AA}.nav.on{color:#5EEAD4;border-bottom-color:#5EEAD4}
        .tag{display:inline-block;padding:2px 8px;border-radius:4px;font-size:10px;font-family:'JetBrains Mono',monospace;letter-spacing:.04em}
        .back{background:none;border:1px solid #27272A;border-radius:6px;padding:4px 12px;cursor:pointer;color:#71717A;font-size:11px;font-family:'JetBrains Mono',monospace}
        .back:hover{border-color:#52525B;color:#A1A1AA}
        .bar-track{height:6px;background:#1A1A1E;border-radius:3px;overflow:hidden;position:relative}
        .bar-fill{height:100%;border-radius:3px;transition:width .5s ease}
      `}</style>

      <div className="orb" style={{ width: 250, height: 250, background: "#5EEAD4", top: -60, right: -40 }} />
      <div className="orb" style={{ width: 180, height: 180, background: "#A78BFA", bottom: "20%", left: -30, animationDelay: "7s" }} />

      {/* Header */}
      <div style={{ position: "relative", zIndex: 2, padding: "20px 24px 0", borderBottom: "1px solid rgba(255,255,255,.04)" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 2 }}>
          <span style={{ fontSize: 18, fontWeight: 700, color: "#FAFAFA", letterSpacing: "-.02em" }}>⚖ Artifact Analyzer</span>
          <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 10, color: "#3F3F46", letterSpacing: ".06em" }}>
            DATA v{data.dataVersion} · {data.lastSync}
          </span>
        </div>
        <p style={{ fontSize: 12, color: "#52525B", marginBottom: 12 }}>
          Analyse réelle · Zéro invention · Source : fichiers /mnt/project
        </p>
        <div style={{ display: "flex", gap: 0 }}>
          {tabs.map(t => (
            <button key={t.id} className={`nav ${tab === t.id ? "on" : ""}`}
              onClick={() => { setTab(t.id); setSelected(null); }}>
              <span style={{ fontSize: 10, marginRight: 5, opacity: .7 }}>{t.icon}</span>{t.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ position: "relative", zIndex: 2, padding: 24 }}>

        {/* ═══ OVERVIEW ═══ */}
        {tab === "overview" && (
          <div>
            {/* Headline stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 20 }}>
              {[
                { label: "Poids moyen", value: `${avgWeight}%`, color: weightColor(avgWeight) },
                { label: "Artifacts critiques", value: `${criticals}/4`, color: criticals > 0 ? "#EF4444" : "#22C55E" },
                { label: "Sans MD pair", value: `${noMd}/4`, color: noMd > 0 ? "#EF4444" : "#22C55E" },
                { label: "Avec storage", value: `${data.artifacts.filter(a => a.storage).length}/4`, color: "#A78BFA" },
              ].map((s, i) => (
                <div key={i} className={`glass fi d${i + 1}`} style={{ padding: "14px 16px", opacity: 0 }}>
                  <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono'", color: "#3F3F46", marginBottom: 6, letterSpacing: ".06em" }}>
                    {s.label.toUpperCase()}
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: s.color, fontFamily: "'JetBrains Mono'" }}>{s.value}</div>
                </div>
              ))}
            </div>

            {/* Artifacts list avec weight bars */}
            <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono'", color: "#3F3F46", marginBottom: 10, letterSpacing: ".06em" }}>
              ARTIFACTS — POIDS RÉEL (lignes + Ko vs limite pratique 800L / 50 Ko)
            </div>
            <div style={{ display: "grid", gap: 10 }}>
              {data.artifacts.map((a, i) => {
                const w = weight(a);
                const md = mdStatus(a);
                return (
                  <div key={a.id}
                    className={`glass glass-hover fi d${i + 1}`}
                    style={{ padding: "14px 18px", opacity: 0, borderLeft: `3px solid ${weightColor(w)}30` }}
                    onClick={() => { setSelected(a.id); setTab("detail"); }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                      <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 11, color: "#5EEAD4", fontWeight: 500 }}>{a.file}</span>
                      <span className="tag" style={{ background: weightColor(w) + "18", color: weightColor(w), marginLeft: "auto" }}>
                        {weightLabel(w)}
                      </span>
                      <span title={md.title} className="tag" style={{ background: md.color + "15", color: md.color }}>
                        MD {md.label}
                      </span>
                      <span className="tag" style={{ background: a.storage ? "#A78BFA15" : "rgba(255,255,255,.03)", color: a.storage ? "#A78BFA" : "#3F3F46" }}>
                        {a.storage ? "storage ✓" : "storage ✗"}
                      </span>
                    </div>

                    {/* Weight bar principal */}
                    <div style={{ marginBottom: 8 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono'", color: "#52525B" }}>
                          Poids global
                        </span>
                        <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono'", color: weightColor(w), fontWeight: 600 }}>
                          {w}%
                        </span>
                      </div>
                      <div className="bar-track">
                        <div className="bar-fill" style={{ width: `${w}%`, background: weightColor(w) }} />
                      </div>
                    </div>

                    {/* Bars secondaires */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 20px" }}>
                      {[
                        { label: "Lignes", value: a.lines, max: LIMIT_LINES, unit: "L" },
                        { label: "Taille", value: a.kb, max: LIMIT_KB, unit: " Ko" },
                      ].map((bar, j) => {
                        const pct = Math.round((bar.value / bar.max) * 100);
                        return (
                          <div key={j}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                              <span style={{ fontSize: 10, color: "#3F3F46", fontFamily: "'JetBrains Mono'" }}>{bar.label}</span>
                              <span style={{ fontSize: 10, color: "#52525B", fontFamily: "'JetBrains Mono'" }}>
                                {bar.value}{bar.unit} / {bar.max}{bar.unit}
                              </span>
                            </div>
                            <div className="bar-track" style={{ height: 4 }}>
                              <div className="bar-fill" style={{ width: `${pct}%`, background: weightColor(pct), height: 4 }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══ DETAIL ═══ */}
        {tab === "detail" && !selected && (
          <div>
            <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono'", color: "#3F3F46", marginBottom: 14, letterSpacing: ".06em" }}>
              SÉLECTIONNER UN ARTIFACT
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {data.artifacts.map((a, i) => {
                const w = weight(a);
                return (
                  <div key={a.id} className={`glass glass-hover fi d${i + 1}`} style={{ padding: 16, opacity: 0 }}
                    onClick={() => setSelected(a.id)}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#5EEAD4", fontFamily: "'JetBrains Mono'", marginBottom: 6 }}>{a.file}</div>
                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      <span style={{ fontSize: 10, color: "#52525B" }}>{a.lines}L · {a.kb} Ko · {a.consts.length} consts</span>
                      <span className="tag" style={{ background: weightColor(w) + "18", color: weightColor(w), marginLeft: "auto" }}>{w}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tab === "detail" && selected && artifact && (
          <div className="fi" style={{ opacity: 0 }}>
            <button className="back" onClick={() => setSelected(null)} style={{ marginBottom: 16 }}>← Retour</button>
            {(() => {
              const w = weight(artifact);
              const md = mdStatus(artifact);
              return (
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: "#FAFAFA", fontFamily: "'JetBrains Mono'" }}>{artifact.file}</span>
                    <span className="tag" style={{ background: weightColor(w) + "18", color: weightColor(w) }}>{weightLabel(w)} — {w}%</span>
                  </div>

                  {/* Bars */}
                  <div className="glass" style={{ padding: 16, marginBottom: 14 }}>
                    <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono'", color: "#3F3F46", marginBottom: 12, letterSpacing: ".06em" }}>POIDS</div>
                    {[
                      { label: "Global (max lignes/Ko)", value: w, max: 100, unit: "%", color: weightColor(w) },
                      { label: "Lignes de code", value: artifact.lines, max: LIMIT_LINES, unit: "L", color: weightColor(Math.round(artifact.lines / LIMIT_LINES * 100)) },
                      { label: "Taille fichier", value: artifact.kb, max: LIMIT_KB, unit: " Ko", color: weightColor(Math.round(artifact.kb / LIMIT_KB * 100)) },
                    ].map((bar, i) => {
                      const pct = bar.label === "Global (max lignes/Ko)" ? bar.value : Math.round((bar.value / bar.max) * 100);
                      return (
                        <div key={i} style={{ marginBottom: 10 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                            <span style={{ fontSize: 11, color: "#71717A", fontFamily: "'JetBrains Mono'" }}>{bar.label}</span>
                            <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono'", color: bar.color, fontWeight: 600 }}>
                              {bar.value}{bar.unit} / {bar.max}{bar.unit} ({pct}%)
                            </span>
                          </div>
                          <div className="bar-track">
                            <div className="bar-fill" style={{ width: `${pct}%`, background: bar.color }} />
                          </div>
                        </div>
                      );
                    })}

                    {/* Cible après refacto */}
                    <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid #1A1A1E", display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono'", color: "#3F3F46" }}>CIBLE APRÈS REFACTO</span>
                      <div style={{ flex: 1, height: 4, background: "#1A1A1E", borderRadius: 2, position: "relative" }}>
                        <div style={{ position: "absolute", top: 0, left: 0, height: "100%", width: `${artifact.targetWeight}%`, background: "#22C55E40", borderRadius: 2 }} />
                        <div style={{ position: "absolute", top: -4, left: `${artifact.targetWeight}%`, width: 2, height: 12, background: "#22C55E", borderRadius: 1, transform: "translateX(-1px)" }} />
                      </div>
                      <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono'", color: "#22C55E" }}>{artifact.targetWeight}%</span>
                    </div>
                  </div>

                  {/* Status MD + Storage */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
                    <div className="glass" style={{ padding: 14, borderColor: md.color + "25" }}>
                      <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono'", color: md.color, marginBottom: 6, letterSpacing: ".06em" }}>MD PAIR</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: md.color }}>{md.label === "✓" ? "Présent" : md.label === "~" ? "Partiel" : "ABSENT ⚠"}</div>
                      <div style={{ fontSize: 11, color: "#52525B", marginTop: 2 }}>{md.title}</div>
                    </div>
                    <div className="glass" style={{ padding: 14, borderColor: artifact.storage ? "#A78BFA25" : "rgba(255,255,255,.04)" }}>
                      <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono'", color: artifact.storage ? "#A78BFA" : "#3F3F46", marginBottom: 6, letterSpacing: ".06em" }}>STORAGE</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: artifact.storage ? "#A78BFA" : "#52525B" }}>
                        {artifact.storage ? "Persistant" : "Non persistant"}
                      </div>
                      <div style={{ fontSize: 11, color: "#52525B", marginTop: 2 }}>
                        {artifact.storageKey || "Pas de storage key"}
                      </div>
                    </div>
                  </div>

                  {/* Constantes */}
                  <div className="glass" style={{ padding: 14, marginBottom: 14 }}>
                    <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono'", color: "#3F3F46", marginBottom: 10, letterSpacing: ".06em" }}>
                      CONSTANTES DE DONNÉES ({artifact.consts.length})
                    </div>
                    {artifact.consts.map((c, i) => (
                      <div key={i} style={{ display: "grid", gridTemplateColumns: "160px 40px 1fr", gap: 8, alignItems: "center", padding: "5px 0", borderBottom: i < artifact.consts.length - 1 ? "1px solid #1A1A1E" : "none" }}>
                        <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 11, color: "#5EEAD4", fontWeight: 500 }}>{c.name}</span>
                        <span className="tag" style={{ background: "rgba(255,255,255,.04)", color: "#71717A", textAlign: "center" }}>{c.entries}</span>
                        <span style={{ fontSize: 11, color: "#71717A" }}>{c.note}</span>
                      </div>
                    ))}
                  </div>

                  {/* Tabs */}
                  <div className="glass" style={{ padding: 14, marginBottom: 14 }}>
                    <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono'", color: "#3F3F46", marginBottom: 8, letterSpacing: ".06em" }}>
                      ONGLETS ({artifact.tabs})
                    </div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {artifact.tabLabels.map((t, i) => (
                        <span key={i} className="tag" style={{ background: "rgba(255,255,255,.04)", color: "#A1A1AA" }}>{t}</span>
                      ))}
                    </div>
                  </div>

                  {/* Recommandation */}
                  <div className="glass" style={{ padding: 14, borderColor: "#5EEAD420" }}>
                    <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono'", color: "#5EEAD4", marginBottom: 6, letterSpacing: ".06em" }}>RECOMMANDATION</div>
                    <p style={{ fontSize: 12, color: "#A1A1AA", lineHeight: 1.6 }}>{artifact.recommendation}</p>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* ═══ RULES ═══ */}
        {tab === "rules" && (
          <div>
            <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono'", color: "#3F3F46", marginBottom: 14, letterSpacing: ".06em" }}>
              RÈGLES ARCHITECTURE MD + JSX
            </div>

            {/* Pattern cible */}
            <div className="glass fi d1" style={{ padding: 16, opacity: 0, marginBottom: 12, borderColor: "rgba(94,234,212,.12)", fontFamily: "'JetBrains Mono'" }}>
              <div style={{ fontSize: 10, color: "#5EEAD4", marginBottom: 10, letterSpacing: ".06em" }}>PATTERN OBLIGATOIRE</div>
              {[
                { key: "NOM-DATA.md", value: "source de vérité — tout le contenu + DATA_VERSION + LAST_SYNC", color: "#5EEAD4" },
                { key: "NOM.jsx", value: "contrôleur UI uniquement — lit storage, rendu, zéro logique métier", color: "#3B82F6" },
                { key: "window.storage", value: "état runtime uniquement — initialisé depuis les données du MD", color: "#A78BFA" },
              ].map((r, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 10, padding: "6px 0", borderBottom: i < 2 ? "1px solid #1A1A1E" : "none" }}>
                  <span style={{ fontSize: 11, color: r.color, fontWeight: 500 }}>{r.key}</span>
                  <span style={{ fontSize: 11, color: "#71717A" }}>{r.value}</span>
                </div>
              ))}
            </div>

            {/* Règles de mise à jour */}
            <div className="glass fi d2" style={{ padding: 16, opacity: 0, marginBottom: 12 }}>
              <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono'", color: "#3F3F46", marginBottom: 10, letterSpacing: ".06em" }}>RÈGLES DE MISE À JOUR</div>
              {Object.entries(data.rules).map(([k, v], i) => (
                <div key={k} style={{ display: "flex", gap: 8, padding: "4px 0", fontSize: 12, color: "#A1A1AA" }}>
                  <span style={{ color: "#5EEAD4", opacity: .6, flexShrink: 0, fontFamily: "'JetBrains Mono'", fontSize: 10 }}>›</span>
                  <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 10, color: "#71717A", minWidth: 140 }}>{k}</span>
                  <span>{v}</span>
                </div>
              ))}
            </div>

            {/* Actions prioritaires */}
            <div className="glass fi d3" style={{ padding: 16, opacity: 0, borderColor: "rgba(239,68,68,.1)" }}>
              <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono'", color: "#EF4444", marginBottom: 10, letterSpacing: ".06em" }}>
                GAPS — AUCUN ARTIFACT NE RESPECTE ENCORE LE PATTERN COMPLET
              </div>
              {[
                { prio: "P0", label: "Créer ios-pipeline-DATA.md", detail: "Sécurise 39.4 Ko de données", color: "#EF4444" },
                { prio: "P0", label: "Créer conversation-control-DATA.md", detail: "Sécurise 26.4 Ko de données", color: "#EF4444" },
                { prio: "P1", label: "Compléter fondation-monitor MD", detail: "Externaliser les DEFAULT_*", color: "#F97316" },
                { prio: "P1", label: "Ajouter storage à ios-pipeline", detail: "Rendre l'état persistant", color: "#F97316" },
                { prio: "P2", label: "Réduire ios-pipeline à < 75%", detail: "Séparer données / rendu", color: "#EAB308" },
                { prio: "P2", label: "Réduire fondation-monitor à < 75%", detail: "Séparer données / rendu", color: "#EAB308" },
              ].map((a, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0", borderBottom: i < 5 ? "1px solid #1A1A1E" : "none" }}>
                  <span className="tag" style={{ background: a.color + "15", color: a.color, minWidth: 28, textAlign: "center" }}>{a.prio}</span>
                  <span style={{ fontSize: 12, color: "#D4D4D8", fontWeight: 500 }}>{a.label}</span>
                  <span style={{ fontSize: 11, color: "#52525B", marginLeft: "auto" }}>{a.detail}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
