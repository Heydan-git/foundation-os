import { useState, useEffect } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// ARCHITECTURE : MD = source de vérité / JSX = contrôleur UI
// Base de données : FONDATION_CENTRE_DATA.md
// Règle : toujours mettre à jour FONDATION_CENTRE_DATA.md EN PREMIER,
//         puis syncer les sections correspondantes ici.
//
// Mapping sections :
//   GNODES/GEDGES   ←→  ## GRAPHE DE DÉPENDANCES
//   ARTIFACTS       ←→  ## ARTEFACTS JSX
//   DEFAULT_LOG     ←→  ## JOURNAL
//   SYNC_FILES      ←→  ## FICHIERS DE SYNC
//   Hub metrics     ←→  ## MÉTRIQUES
//   Next steps      ←→  ## PROCHAINES ÉTAPES
// ─────────────────────────────────────────────────────────────────────────────

// ─── GRAPH DATA ───────────────────────────────────────────────────────────────
const GW = 1000, GH = 600;

const GNODES = [
  // Row 0 — 9 conversations réelles (scannées)
  { id: "c01", label: "CONV-01", sub: "Fondations",           type: "conv", color: "#A78BFA", x: 60,  y: 50 },
  { id: "c02", label: "CONV-02", sub: "Instructions live",    type: "conv", color: "#52525B", x: 170, y: 50 },
  { id: "c03", label: "CONV-03", sub: "Monitoring",           type: "conv", color: "#EAB308", x: 280, y: 50 },
  { id: "c04", label: "CONV-04", sub: "DA Void Glass",        type: "conv", color: "#F97316", x: 390, y: 50 },
  { id: "c05", label: "CONV-05", sub: "Skills & Workflow",    type: "conv", color: "#5EEAD4", x: 500, y: 50 },
  { id: "c06", label: "CONV-06", sub: "Idéation",             type: "conv", color: "#94A3B8", x: 610, y: 50 },
  { id: "c07", label: "CONV-07", sub: "Frameworks",           type: "conv", color: "#3B82F6", x: 720, y: 50 },
  { id: "c08", label: "CONV-08", sub: "Index projet",         type: "conv", color: "#22C55E", x: 830, y: 50 },
  { id: "c09", label: "CONV-09", sub: "Centre Hub ★",         type: "conv", color: "#5EEAD4", x: 940, y: 50 },

  // Row 1 — Docs racines
  { id: "fondation-v0",    label: "FONDATION_v0.md",    sub: "Manifeste",       type: "root", color: "#A78BFA", x: 200, y: 175 },
  { id: "da-canonical",    label: "DA-CANONICAL.md",    sub: "Void Glass spec", type: "root", color: "#F97316", x: 500, y: 175 },
  { id: "frameworks-md",   label: "FRAMEWORKS.md",      sub: "4 layers",        type: "root", color: "#3B82F6", x: 780, y: 175 },

  // Row 2 — Knowledge base
  { id: "pipeline-md",   label: "PIPELINE.md",     sub: "8 phases",    type: "doc", color: "#5EEAD4", x: 100, y: 300 },
  { id: "monitoring-md", label: "MONITORING.md",   sub: "Métriques",   type: "doc", color: "#5EEAD4", x: 280, y: 300 },
  { id: "skills-md",     label: "SKILLS-MAP.md",   sub: "23+ skills",  type: "doc", color: "#5EEAD4", x: 460, y: 300 },
  { id: "da-boiler",     label: "DA-BOILERPLATE",  sub: "CSS tokens",  type: "doc", color: "#F97316", x: 640, y: 300 },
  { id: "index-md",      label: "INDEX.md",        sub: "9 convs",     type: "doc", color: "#22C55E", x: 820, y: 300 },

  // Row 3 — Artifacts JSX
  { id: "ios-jsx",     label: "ios-pipeline",     sub: "Pipeline",        type: "artifact", color: "#F97316", x: 100, y: 430 },
  { id: "monitor-jsx", label: "fondation-monitor", sub: "Monitoring",      type: "artifact", color: "#EAB308", x: 300, y: 430 },
  { id: "index-jsx",   label: "project-index",    sub: "Index convs",     type: "artifact", color: "#3B82F6", x: 500, y: 430 },
  { id: "ctrl-jsx",    label: "conv-control",     sub: "Control CONV-05", type: "artifact", color: "#EC4899", x: 700, y: 430 },
  { id: "viewer-jsx",  label: "fondation-viewer", sub: "Viewer DA",       type: "artifact", color: "#A78BFA", x: 880, y: 430 },

  // Row 4 — Centre
  { id: "centre", label: "CENTRE.jsx", sub: "Hub · ce dashboard", type: "centre", color: "#5EEAD4", x: 500, y: 545 },
];

const GEDGES = [
  // Conversations → docs racines
  ["c01", "fondation-v0"],
  ["c04", "da-canonical"],
  ["c07", "frameworks-md"],

  // Conversations → artifacts directs
  ["c03", "monitor-jsx"],
  ["c04", "viewer-jsx"],
  ["c05", "ios-jsx"],
  ["c05", "ctrl-jsx"],
  ["c08", "index-jsx"],
  ["c09", "centre"],

  // Docs racines → knowledge
  ["fondation-v0", "pipeline-md"],
  ["fondation-v0", "monitoring-md"],
  ["fondation-v0", "skills-md"],
  ["da-canonical",  "da-boiler"],
  ["c08", "index-md"],

  // Knowledge → artifacts
  ["pipeline-md",   "ios-jsx"],
  ["monitoring-md", "ios-jsx"],
  ["monitoring-md", "monitor-jsx"],
  ["da-boiler",     "viewer-jsx"],
  ["da-boiler",     "index-jsx"],
  ["index-md",      "index-jsx"],

  // Artifacts → centre
  ["ios-jsx",     "centre"],
  ["monitor-jsx", "centre"],
  ["index-jsx",   "centre"],
  ["ctrl-jsx",    "centre"],
  ["viewer-jsx",  "centre"],
  ["fondation-v0","centre"],
  ["da-canonical","centre"],
];

// ─── ARTIFACTS META ──────────────────────────────────────────────────────────
const ARTIFACTS = [
  {
    id: "monitor-jsx",
    file: "fondation-monitor.jsx",
    title: "Fondation Monitor",
    desc: "Suivi persistant — phases checklist, journal sessions, ADR, risques, docs · barre mémoire",
    conv: "CONV-03",
    status: "done",
    color: "#EAB308",
    deps: ["FONDATION_v0.md", "FONDATION_MONITORING.md", "MONITORING.md"],
    loc: "~950 lignes",
  },
  {
    id: "ios-jsx",
    file: "ios-pipeline-dashboard.jsx",
    title: "iOS Pipeline Dashboard",
    desc: "Pipeline 8 phases × 3 budgets × outils × KPIs · Monitoring · Évolution roadmap",
    conv: "CONV-05",
    status: "done",
    color: "#F97316",
    deps: ["PIPELINE.md", "MONITORING.md", "BUDGET-SCENARIOS.md", "EVOLUTION-ROADMAP.md"],
    loc: "~800 lignes",
  },
  {
    id: "ctrl-jsx",
    file: "conversation-control.jsx",
    title: "Conversation Control",
    desc: "Suivi CONV-05 — timeline livrables, fichiers Cowork, sync chat↔cowork, next steps",
    conv: "CONV-05",
    status: "done",
    color: "#EC4899",
    deps: ["ios-pipeline-dashboard.jsx", "12 fichiers Cowork"],
    loc: "~500 lignes",
  },
  {
    id: "viewer-jsx",
    file: "fondation_viewer.jsx",
    title: "Fondation Viewer",
    desc: "Viewer DA interactif — scan projet API, barre mémoire, actions rapides, modal",
    conv: "CONV-04",
    status: "done",
    color: "#A78BFA",
    deps: ["DA-VOID-GLASS-CANONICAL.md", "DA-BOILERPLATE.md"],
    loc: "~550 lignes",
  },
  {
    id: "index-jsx",
    file: "project-index-dashboard.jsx",
    title: "Project Index",
    desc: "Index de toutes les conversations — 9 convs, thèmes, fichiers produits, décisions",
    conv: "CONV-08",
    status: "done",
    color: "#3B82F6",
    deps: ["INDEX.md", "CONV-01 → CONV-09"],
    loc: "~520 lignes",
  },
  {
    id: "centre",
    file: "centre-communication.jsx",
    title: "Centre Communication",
    desc: "Hub central — graphe dépendances, sync CTA, barre poids, journal persistant",
    conv: "CONV-09",
    status: "done",
    color: "#5EEAD4",
    deps: ["TOUS les artifacts", "FONDATION_v0.md", "FONDATION_CENTRE.md"],
    loc: "~750 lignes",
  },
];

// ─── LOG DEFAULTS ─────────────────────────────────────────────────────────────
const DEFAULT_LOG = [
  { id:1,  date:"2026-04-02", type:"init",     text:"CONV-01 — Fondations. Vision long terme fondation mondiale. Court terme : core + OS + workflow. Coopération déclarée.",                                     author:"humain",  color:"#A78BFA" },
  { id:2,  date:"2026-04-02", type:"décision", text:"Mode coopération > exploitation. Traçabilité totale exigée. Plan évolutif. FONDATION_v0.md créé.",                                                          author:"système", color:"#A78BFA" },
  { id:3,  date:"2026-04-02", type:"technique", text:"CONV-02 — Accès instructions live. Chaque message reconstruit le contexte complet. Memories = périodique, pas live.",                                      author:"système", color:"#52525B" },
  { id:4,  date:"2026-04-02", type:"livraison", text:"CONV-03 — Monitoring. fondation-monitor.jsx créé (~950 lignes). FONDATION_MONITORING.md. Barre mémoire tri-jauge.",                                        author:"claude",  color:"#EAB308" },
  { id:5,  date:"2026-04-03", type:"livraison", text:"CONV-04 — DA Void Glass. DA-PIPELINE-EXTRACT.md + DA-VOID-GLASS-CANONICAL.md + DA-BOILERPLATE.md. fondation_viewer.jsx.",                                  author:"claude",  color:"#F97316" },
  { id:6,  date:"2026-04-03", type:"décision", text:"CONV-04 — Void Glass = DA obligatoire tous artefacts. Fond #06070C, Figtree + JetBrains Mono, glassmorphism rgba, orbes blur 80px, accent teal #5EEAD4.", author:"humain",  color:"#F97316" },
  { id:7,  date:"2026-04-03", type:"livraison", text:"CONV-05 — Skills & Workflow. ios-pipeline-dashboard.jsx + conversation-control.jsx + 12 fichiers MD Cowork. 23+ skills cartographiés.",                    author:"claude",  color:"#5EEAD4" },
  { id:8,  date:"2026-04-03", type:"idéation",  text:"CONV-06 — Idéation Fondation. 3 layers identifiés : Projets / Méthode / Core OS. Layer 1 (Core) non formalisé — priorité.",                              author:"système", color:"#94A3B8" },
  { id:9,  date:"2026-04-03", type:"livraison", text:"CONV-07 — Frameworks. FONDATION_FRAMEWORKS.md. 4 couches : L1 Cowork, L2 Claude Code, L3 BMAD v6, L4 MCP/plugins. Étape 01 = aligner app iOS cible.",    author:"claude",  color:"#3B82F6" },
  { id:10, date:"2026-04-03", type:"livraison", text:"CONV-08 — Index projet. project-index-dashboard.jsx mis à jour (9 convs). INDEX.md créé. DA-FONDATION.md + DA-BOILERPLATE.md ajoutés.",                   author:"claude",  color:"#22C55E" },
  { id:11, date:"2026-04-03", type:"livraison", text:"CONV-09 — Centre Communication. centre-communication.jsx créé : hub, graphe dépendances SVG, sync CTA, barre poids artefact sticky.",                      author:"claude",  color:"#5EEAD4" },
  { id:12, date:"2026-04-03", type:"décision", text:"Data fakées détectées et corrigées. Scan réel : 9 conversations, 6 artifacts, ~20 fichiers MD. BASE_CODE_BYTES = 42KB après croissance.",                  author:"humain",  color:"#EF4444" },
];

const SK = "fondation-centre-v1";

// ─── SIZE CONSTANTS ───────────────────────────────────────────────────────────
// Base JSX source code estimate (static, measured once)
const BASE_CODE_BYTES = 42_000;
// Max safe artifact size before degradation risk
const MAX_BYTES = 150_000;

// ─── SYNC FILES (scannés réellement) ─────────────────────────────────────────
const SYNC_FILES = [
  // Project Instructions
  { name: "PROJECT-INSTRUCTIONS.md",      target: "Project Instructions", status: "pending" },
  // Knowledge base — Fondation core
  { name: "FONDATION_v0.md",              target: "Knowledge Cowork",     status: "pending" },
  { name: "FONDATION_MONITORING.md",      target: "Knowledge Cowork",     status: "pending" },
  { name: "FONDATION_FRAMEWORKS.md",      target: "Knowledge Cowork",     status: "pending" },
  { name: "FONDATION_CENTRE_DATA.md",     target: "Knowledge Cowork",     status: "pending" },
  // Knowledge base — iOS Pipeline
  { name: "PIPELINE.md",                  target: "Knowledge Cowork",     status: "pending" },
  { name: "BUDGET-SCENARIOS.md",          target: "Knowledge Cowork",     status: "pending" },
  { name: "MONITORING.md",                target: "Knowledge Cowork",     status: "pending" },
  { name: "EVOLUTION-ROADMAP.md",         target: "Knowledge Cowork",     status: "pending" },
  { name: "SKILLS-MAP.md",                target: "Knowledge Cowork",     status: "pending" },
  { name: "TOOLS-STACK.md",               target: "Knowledge Cowork",     status: "pending" },
  { name: "CHECKLIST-LAUNCH.md",          target: "Knowledge Cowork",     status: "pending" },
  { name: "JOURNAL.md",                   target: "Knowledge Cowork",     status: "pending" },
  { name: "SYNC-CHAT.md",                 target: "Knowledge Cowork",     status: "pending" },
  // Knowledge base — DA & Index
  { name: "DA-FONDATION.md",              target: "Knowledge Cowork",     status: "pending" },
  { name: "DA-BOILERPLATE.md",            target: "Knowledge Cowork",     status: "pending" },
  { name: "DA-VOID-GLASS-CANONICAL.md",   target: "Knowledge Cowork",     status: "pending" },
  { name: "INDEX.md",                     target: "Knowledge Cowork",     status: "pending" },
  // Artifacts JSX (produits, pas à uploader)
  { name: "fondation-monitor.jsx",        target: "Project Artifacts",    status: "done"    },
  { name: "ios-pipeline-dashboard.jsx",   target: "Project Artifacts",    status: "done"    },
  { name: "conversation-control.jsx",     target: "Project Artifacts",    status: "done"    },
  { name: "fondation_viewer.jsx",         target: "Project Artifacts",    status: "done"    },
  { name: "project-index-dashboard.jsx",  target: "Project Artifacts",    status: "done"    },
  { name: "centre-communication.jsx",     target: "Project Artifacts",    status: "done"    },
];

// ─── COMPONENT ───────────────────────────────────────────────────────────────
export default function CentreComm() {
  const [tab, setTab] = useState("hub");
  const [hovNode, setHovNode] = useState(null);
  const [selNode, setSelNode] = useState(null);
  const [log, setLog] = useState(DEFAULT_LOG);
  const [loaded, setLoaded] = useState(false);
  const [newMsg, setNewMsg] = useState("");
  const [newType, setNewType] = useState("note");
  const [syncCopied, setSyncCopied] = useState(false);
  const [syncFiles, setSyncFiles] = useState(SYNC_FILES);
  const [artifactBytes, setArtifactBytes] = useState(BASE_CODE_BYTES);

  // ── Storage ──
  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage.get(SK);
        if (r) {
          const s = JSON.parse(r.value);
          if (s.log) setLog(s.log);
          if (s.syncFiles) setSyncFiles(s.syncFiles);
        }
      } catch {}
      setLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const payload = { log, syncFiles, at: new Date().toISOString() };
    const bytes = BASE_CODE_BYTES + new Blob([JSON.stringify(payload)]).size;
    setArtifactBytes(bytes);
    window.storage.set(SK, JSON.stringify(payload)).catch(() => {});
  }, [log, syncFiles, loaded]);

  // ── Graph helpers ──
  const activeNode = selNode || hovNode;

  const edgeHighlit = (a, b) =>
    activeNode && (a === activeNode || b === activeNode);

  const nodeOpacity = (id) => {
    if (!activeNode) return 1;
    if (id === activeNode) return 1;
    return GEDGES.some(([a, b]) => (a === activeNode && b === id) || (b === activeNode && a === id)) ? 1 : 0.15;
  };

  const path = (fid, tid) => {
    const a = GNODES.find(n => n.id === fid);
    const b = GNODES.find(n => n.id === tid);
    if (!a || !b) return "";
    const my = (a.y + b.y) / 2;
    return `M${a.x},${a.y} C${a.x},${my} ${b.x},${my} ${b.x},${b.y}`;
  };

  const selData = activeNode ? GNODES.find(n => n.id === activeNode) : null;
  const selProvides = activeNode ? GEDGES.filter(([a]) => a === activeNode).map(([, b]) => b) : [];
  const selNeeds = activeNode ? GEDGES.filter(([, b]) => b === activeNode).map(([a]) => a) : [];

  // ── Log ──
  const addEntry = () => {
    if (!newMsg.trim()) return;
    const tc = { note: "#5EEAD4", décision: "#A78BFA", alerte: "#EF4444", action: "#F97316" };
    setLog(p => [...p, {
      id: p.length + 1,
      date: new Date().toISOString().split("T")[0],
      type: newType,
      text: newMsg.trim(),
      author: "humain",
      color: tc[newType] || "#5EEAD4",
    }]);
    setNewMsg("");
  };

  // ── Sync ──
  const toggleSyncFile = (name) => {
    setSyncFiles(p => p.map(f =>
      f.name === name ? { ...f, status: f.status === "done" ? "pending" : "done" } : f
    ));
  };

  const generateSyncReport = () => {
    const now = new Date().toISOString();
    const pending = syncFiles.filter(f => f.status === "pending");
    const done    = syncFiles.filter(f => f.status === "done");
    const lines = [
      `# SYNC REPORT — ${now.split("T")[0]}`,
      `*Généré depuis Centre Communication · Fondation CONV-04*`,
      ``,
      `## ✅ Synchronisés (${done.length})`,
      ...done.map(f => `- [x] \`${f.name}\` → ${f.target}`),
      ``,
      `## ⏳ En attente (${pending.length})`,
      ...pending.map(f => `- [ ] \`${f.name}\` → ${f.target}`),
      ``,
      `## 📓 Journal (${log.length} entrées)`,
      ...log.slice(-5).map(e => `- [${e.date}] **${e.type}** — ${e.text}`),
      ``,
      `---`,
      `*Artifact weight : ${(artifactBytes/1024).toFixed(1)} KB / ${(MAX_BYTES/1024).toFixed(0)} KB max*`,
    ];
    return lines.join("\n");
  };

  const handleCopySync = () => {
    const text = generateSyncReport();
    navigator.clipboard.writeText(text).then(() => {
      setSyncCopied(true);
      setTimeout(() => setSyncCopied(false), 2500);
    }).catch(() => {
      const el = document.createElement("textarea");
      el.value = text; document.body.appendChild(el);
      el.select(); document.execCommand("copy");
      document.body.removeChild(el);
      setSyncCopied(true);
      setTimeout(() => setSyncCopied(false), 2500);
    });
  };

  // ── Size helpers ──
  const sizePct  = Math.min((artifactBytes / MAX_BYTES) * 100, 100);
  const sizeKB   = (artifactBytes / 1024).toFixed(1);
  const maxKB    = (MAX_BYTES / 1024).toFixed(0);
  const sizeColor = sizePct < 50 ? "#22C55E"
                  : sizePct < 70 ? "#5EEAD4"
                  : sizePct < 85 ? "#EAB308"
                  : sizePct < 95 ? "#F97316"
                  : "#EF4444";
  const sizeLabel = sizePct < 70 ? "Sain"
                  : sizePct < 85 ? "Attention"
                  : sizePct < 95 ? "Critique"
                  : "⚠ LIMITE";

  const tabs = [
    { id: "hub", icon: "◉", label: "Hub" },
    { id: "deps", icon: "◈", label: "Dépendances" },
    { id: "artifacts", icon: "▦", label: "Artefacts" },
    { id: "journal", icon: "◇", label: "Journal" },
  ];

  const statusColor = (s) => ({ done: "#22C55E", active: "#5EEAD4", pending: "#52525B" }[s] || "#52525B");
  const statusLabel = (s) => ({ done: "FAIT", active: "ACTIF", pending: "EN ATTENTE" }[s] || s);

  return (
    <div style={{ fontFamily: "'Figtree', -apple-system, sans-serif", background: "#06070C", color: "#D4D4D8", minHeight: "100vh", position: "relative", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Figtree:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: rgba(94,234,212,0.15); border-radius: 3px; }
        .fi { opacity: 0; transform: translateY(6px); animation: fu .35s cubic-bezier(.22,1,.36,1) forwards; }
        .d1{animation-delay:.05s}.d2{animation-delay:.1s}.d3{animation-delay:.15s}
        .d4{animation-delay:.2s}.d5{animation-delay:.25s}.d6{animation-delay:.3s}
        @keyframes fu { to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
        @keyframes drift { 0%,100%{transform:translate(0,0)} 50%{transform:translate(20px,-15px)} }
        .orb { position:absolute; border-radius:50%; filter:blur(80px); opacity:.1; pointer-events:none; }
        .orb1 { width:360px;height:360px;background:#A78BFA;top:-80px;right:-80px;animation:drift 22s ease-in-out infinite; }
        .orb2 { width:240px;height:240px;background:#5EEAD4;bottom:30%;left:-60px;animation:drift 28s ease-in-out infinite reverse; }
        .orb3 { width:180px;height:180px;background:#3B82F6;bottom:-40px;right:20%;animation:drift 18s ease-in-out infinite 4s; }
        .glass { background:rgba(255,255,255,.025); border:1px solid rgba(255,255,255,.06); border-radius:10px; transition:all .18s ease; }
        .glass:hover { background:rgba(255,255,255,.04); border-color:rgba(94,234,212,.12); }
        .tab-b { background:none; border:none; border-bottom:2px solid transparent; padding:8px 18px 12px; cursor:pointer; font-family:'Figtree',sans-serif; font-size:13px; font-weight:500; color:#52525B; transition:all .15s; display:flex; align-items:center; gap:6px; }
        .tab-b:hover { color:#A1A1AA; }
        .tab-b.on { color:#5EEAD4; border-bottom-color:#5EEAD4; }
        .chip { display:inline-flex;align-items:center;padding:2px 8px;border-radius:4px;font-size:10px;font-family:'JetBrains Mono',monospace; }
        .node-hit { cursor:pointer; transition:all .15s; }
        .ipt { background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.08); border-radius:6px; padding:8px 12px; color:#E4E4E7; font-size:12px; font-family:'Figtree',sans-serif; outline:none; width:100%; }
        .ipt:focus { border-color:rgba(94,234,212,.3); }
        .sel { background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.08); border-radius:6px; padding:6px 10px; color:#E4E4E7; font-size:12px; outline:none; cursor:pointer; }
        .btn-add { background:rgba(94,234,212,.1); border:1px solid rgba(94,234,212,.2); border-radius:6px; padding:7px 18px; color:#5EEAD4; font-size:12px; font-weight:600; cursor:pointer; font-family:'Figtree',sans-serif; transition:all .15s; }
        .btn-add:hover { background:rgba(94,234,212,.18); }
        .art-row { border-left:3px solid transparent; transition:all .15s; }
        .art-row:hover { background:rgba(255,255,255,.025)!important; }
        .sync-file { display:grid; grid-template-columns:16px 1fr auto auto; align-items:center; gap:10px; padding:7px 10px; border-radius:6px; cursor:pointer; transition:background .1s; }
        .sync-file:hover { background:rgba(255,255,255,.04); }
        .wbar-fill { height:100%; border-radius:3px; transition:width .6s cubic-bezier(.4,0,.2,1), background .4s ease; }
        @keyframes shimmer { 0%{opacity:.6} 50%{opacity:1} 100%{opacity:.6} }
        .weight-footer { position:sticky; bottom:0; left:0; right:0; z-index:50; backdrop-filter:blur(16px); background:rgba(6,7,12,.85); border-top:1px solid rgba(255,255,255,.06); padding:10px 28px; display:flex; align-items:center; gap:16px; }
        .btn-sync-main { background:linear-gradient(135deg,rgba(94,234,212,.15),rgba(94,234,212,.06)); border:1px solid rgba(94,234,212,.3); border-radius:8px; padding:8px 20px; color:#5EEAD4; font-size:12px; font-weight:700; cursor:pointer; font-family:'Figtree',sans-serif; letter-spacing:.02em; transition:all .2s; display:flex;align-items:center;gap:8px; }
        .btn-sync-main:hover { background:linear-gradient(135deg,rgba(94,234,212,.25),rgba(94,234,212,.12)); border-color:rgba(94,234,212,.5); transform:translateY(-1px); }
        .btn-sync-copied { background:rgba(34,197,94,.12)!important; border-color:rgba(34,197,94,.4)!important; color:#22C55E!important; }
      `}</style>

      <div className="orb orb1"/><div className="orb orb2"/><div className="orb orb3"/>

      {/* ── HEADER ── */}
      <div style={{ position:"relative", zIndex:2, padding:"24px 28px 0", borderBottom:"1px solid rgba(255,255,255,.05)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:4 }}>
          <span style={{ width:8, height:8, borderRadius:"50%", background:"#5EEAD4", display:"inline-block", animation:"pulse 3s ease infinite" }}/>
          <span style={{ fontSize:20, fontWeight:700, color:"#FAFAFA", letterSpacing:"-.02em" }}>Centre Communication</span>
          <span style={{ fontFamily:"'JetBrains Mono'", fontSize:10, color:"#3F3F46", letterSpacing:".08em" }}>FONDATION · CONV-04 · 2026-04-03</span>
        </div>
        <p style={{ fontSize:12, color:"#52525B", marginBottom:16, paddingLeft:20 }}>
          Hub central — dépendances · artefacts · coordination · journal projet
        </p>

        <div style={{ display:"flex", gap:0 }}>
          {tabs.map(t => (
            <button key={t.id} className={`tab-b ${tab===t.id?"on":""}`} onClick={() => setTab(t.id)}>
              <span style={{ fontSize:10, opacity:.7 }}>{t.icon}</span>{t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div style={{ position:"relative", zIndex:2, padding:28, paddingBottom:90 }}>

        {/* ════ HUB ════ */}
        {tab === "hub" && (
          <div>
            {/* Metrics */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:24 }}>
              {[
                { label:"CONVERSATIONS", value:"9", sub:"dans ce projet", color:"#5EEAD4" },
                { label:"ARTEFACTS JSX", value:"6", sub:"6 done · 0 actif", color:"#F97316" },
                { label:"FICHIERS MD", value:"~20", sub:"Knowledge base Cowork", color:"#A78BFA" },
                { label:"RÈGLES ACTIVES", value:"9", sub:"Coopération totale", color:"#22C55E" },
              ].map((m,i) => (
                <div key={i} className={`glass fi d${i+1}`} style={{ padding:"16px 18px" }}>
                  <div style={{ fontSize:10, fontFamily:"'JetBrains Mono'", color:"#3F3F46", letterSpacing:".08em", marginBottom:8 }}>{m.label}</div>
                  <div style={{ fontSize:30, fontWeight:700, color:m.color, lineHeight:1, fontFamily:"'JetBrains Mono'" }}>{m.value}</div>
                  <div style={{ fontSize:11, color:"#52525B", marginTop:6 }}>{m.sub}</div>
                </div>
              ))}
            </div>

            {/* Current state */}
            <div style={{ display:"grid", gridTemplateColumns:"1.4fr 1fr", gap:16 }}>
              {/* Artifacts quick view */}
              <div className="glass fi d2" style={{ padding:18 }}>
                <div style={{ fontSize:10, fontFamily:"'JetBrains Mono'", color:"#3F3F46", letterSpacing:".08em", marginBottom:14 }}>ARTEFACTS — ÉTAT ACTUEL</div>
                {ARTIFACTS.map((a,i) => (
                  <div key={a.id} className={`fi d${i+1}`} style={{
                    display:"flex", alignItems:"center", gap:10,
                    padding:"9px 12px", marginBottom:4,
                    background:"rgba(255,255,255,.02)", borderRadius:7,
                    borderLeft:`3px solid ${a.color}`,
                  }}>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:12, fontWeight:600, color:"#E4E4E7", fontFamily:"'JetBrains Mono'" }}>{a.file}</div>
                      <div style={{ fontSize:11, color:"#52525B", marginTop:2 }}>{a.desc.substring(0,60)}…</div>
                    </div>
                    <span className="chip" style={{ background:statusColor(a.status)+"18", color:statusColor(a.status) }}>
                      {statusLabel(a.status)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Rules + next */}
              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                <div className="glass fi d3" style={{ padding:18 }}>
                  <div style={{ fontSize:10, fontFamily:"'JetBrains Mono'", color:"#3F3F46", letterSpacing:".08em", marginBottom:12 }}>RÈGLES PROJET</div>
                  {[
                    ["◉","Innover en proposant d'abord","#5EEAD4"],
                    ["◈","Exhaustif & méthodique","#5EEAD4"],
                    ["▦","Jamais de mensonge","#EF4444"],
                    ["◇","Plans + MD à chaque tâche","#A78BFA"],
                    ["▸","Bonnes pratiques web avant code","#F97316"],
                    ["△","Limites annoncées honnêtement","#EAB308"],
                    ["○","Zéro nuisance — absolu","#EF4444"],
                  ].map(([ic,r,c],i) => (
                    <div key={i} style={{ display:"flex", alignItems:"center", gap:8, padding:"4px 0", fontSize:12 }}>
                      <span style={{ color:c, fontSize:10, width:12 }}>{ic}</span>
                      <span style={{ color:"#A1A1AA" }}>{r}</span>
                    </div>
                  ))}
                </div>

                <div className="glass fi d4" style={{ padding:18, borderColor:"rgba(94,234,212,.1)" }}>
                  <div style={{ fontSize:10, fontFamily:"'JetBrains Mono'", color:"#3F3F46", letterSpacing:".08em", marginBottom:12 }}>PROCHAINES ÉTAPES</div>
                  {[
                    ["🟢","9 conversations scannées ✓"],
                    ["🟢","6 artifacts JSX produits ✓"],
                    ["🟢","DA Void Glass défini ✓"],
                    ["🔴","Uploader ~20 MD sur Cowork"],
                    ["🔴","Aligner app iOS cible (CONV-07 bloquant)"],
                    ["🟡","Formaliser Core / OS (Layer 1)"],
                    ["🟡","Créer 5 skills manquants"],
                    ["⚪","Setup BMAD v6 + Claude Code"],
                  ].map(([dot,s],i) => (
                    <div key={i} style={{ display:"flex", alignItems:"center", gap:8, padding:"4px 0", fontSize:12, color:"#A1A1AA" }}>
                      <span style={{ fontSize:10 }}>{dot}</span>{s}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Limites honnêtes */}
            <div className="glass fi d5" style={{ padding:16, marginTop:16, borderColor:"rgba(249,115,22,.1)" }}>
              <div style={{ fontSize:10, fontFamily:"'JetBrains Mono'", color:"#F97316", letterSpacing:".08em", marginBottom:10 }}>⚠️ LIMITES CLAUDE — TRANSPARENCE</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"4px 24px" }}>
                {[
                  "Pas de mémoire native → MD + storage compensent",
                  "Contexte fenêtre limité → les MD permettent de recharger",
                  "Pas de jugement business → données fournies, tu décides",
                  "Recherche web non exhaustive → doutes signalés",
                  "Code non testé en prod → toujours vérifier avant deploy",
                  "Storage local uniquement → pas de sync cross-device",
                ].map((l,i) => (
                  <div key={i} style={{ display:"flex", gap:8, fontSize:11, color:"#71717A", padding:"2px 0" }}>
                    <span style={{ color:"#F97316", flexShrink:0 }}>›</span>{l}
                  </div>
                ))}
              </div>
            </div>

            {/* ── SYNC CTA ── */}
            <div className="glass fi d6" style={{ padding:20, marginTop:16, borderColor:"rgba(94,234,212,.15)", background:"rgba(94,234,212,.03)" }}>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
                <div style={{ width:36, height:36, borderRadius:8, background:"rgba(94,234,212,.1)", border:"1px solid rgba(94,234,212,.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>⇅</div>
                <div>
                  <div style={{ fontSize:14, fontWeight:700, color:"#FAFAFA" }}>Synchronisation projet</div>
                  <div style={{ fontSize:11, color:"#52525B" }}>
                    {syncFiles.filter(f=>f.status==="done").length}/{syncFiles.length} fichiers synchronisés
                  </div>
                </div>
                <button
                  className={`btn-sync-main ${syncCopied?"btn-sync-copied":""}`}
                  onClick={handleCopySync}
                  style={{ marginLeft:"auto" }}
                >
                  {syncCopied ? "✓ Copié !" : "⇅ Générer rapport"}
                </button>
              </div>

              {/* Progress sync */}
              <div style={{ height:3, borderRadius:2, background:"rgba(255,255,255,.06)", marginBottom:14, overflow:"hidden" }}>
                <div style={{
                  height:"100%", borderRadius:2,
                  width:`${(syncFiles.filter(f=>f.status==="done").length / syncFiles.length)*100}%`,
                  background:"#5EEAD4", transition:"width .5s ease"
                }}/>
              </div>

              {/* Files list */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"2px 12px" }}>
                {syncFiles.map(f => (
                  <div key={f.name} className="sync-file" onClick={() => toggleSyncFile(f.name)}>
                    <div style={{
                      width:14, height:14, borderRadius:3, flexShrink:0,
                      border:`1.5px solid ${f.status==="done"?"#22C55E":"rgba(255,255,255,.15)"}`,
                      background: f.status==="done"?"#22C55E":"transparent",
                      display:"flex", alignItems:"center", justifyContent:"center",
                    }}>
                      {f.status==="done" && <span style={{ color:"#fff", fontSize:9, lineHeight:1 }}>✓</span>}
                    </div>
                    <span style={{ fontFamily:"'JetBrains Mono'", fontSize:10, color: f.status==="done"?"#52525B":"#A1A1AA", textDecoration:f.status==="done"?"line-through":"none" }}>
                      {f.name}
                    </span>
                    <span style={{ fontSize:9, fontFamily:"'JetBrains Mono'", color:"#3F3F46", textAlign:"right" }}>{f.target.replace("Knowledge Cowork","KB").replace("Project Instructions","PI").replace("Project Artifacts","ART")}</span>
                  </div>
                ))}
              </div>

              <div style={{ marginTop:12, padding:"8px 10px", background:"rgba(255,255,255,.02)", borderRadius:6, fontSize:11, color:"#52525B" }}>
                💡 Cliquer un fichier pour changer son statut · Cliquer <strong style={{ color:"#5EEAD4" }}>Générer rapport</strong> pour copier un MD de sync à coller dans JOURNAL.md ou Cowork
              </div>
            </div>
          </div>
        )}

        {/* ════ DÉPENDANCES ════ */}
        {tab === "deps" && (
          <div className="fi">
            <div style={{ display:"grid", gridTemplateColumns:"1fr 220px", gap:16 }}>
              {/* SVG Graph */}
              <div className="glass" style={{ padding:20, overflow:"hidden" }}>
                <div style={{ fontSize:10, fontFamily:"'JetBrains Mono'", color:"#3F3F46", letterSpacing:".08em", marginBottom:12 }}>
                  GRAPHE DE DÉPENDANCES — cliquer un nœud pour explorer
                </div>

                {/* Legend */}
                <div style={{ display:"flex", gap:14, marginBottom:16 }}>
                  {[
                    ["CONV","◆","#52525B"],
                    ["DOC RACINE","●","#A78BFA"],
                    ["KNOWLEDGE","●","#5EEAD4"],
                    ["ARTIFACT","⬢","#F97316"],
                    ["HUB","★","#5EEAD4"],
                  ].map(([l,ic,c]) => (
                    <span key={l} style={{ fontSize:10, fontFamily:"'JetBrains Mono'", color:"#3F3F46", display:"flex", alignItems:"center", gap:4 }}>
                      <span style={{ color:c }}>{ic}</span>{l}
                    </span>
                  ))}
                </div>

                <svg
                  viewBox={`0 0 ${GW} ${GH}`}
                  width="100%"
                  style={{ display:"block", cursor:"default" }}
                  onClick={e => { if (e.target.tagName === "svg") setSelNode(null); }}
                >
                  {/* Edges */}
                  {GEDGES.map(([a,b],i) => {
                    const hl = edgeHighlit(a,b);
                    const hasActive = !!activeNode;
                    return (
                      <path
                        key={i}
                        d={path(a,b)}
                        fill="none"
                        stroke={hl ? GNODES.find(n=>n.id===a)?.color || "#5EEAD4" : "rgba(255,255,255,.07)"}
                        strokeWidth={hl ? 1.8 : 1}
                        opacity={hasActive && !hl ? 0.15 : hl ? 0.7 : 0.4}
                        style={{ transition:"all .2s ease" }}
                      />
                    );
                  })}

                  {/* Nodes */}
                  {GNODES.map(n => {
                    const op = nodeOpacity(n.id);
                    const isActive = activeNode === n.id;
                    const r = n.type === "centre" ? 8 : n.type === "root" ? 7 : 5;
                    return (
                      <g
                        key={n.id}
                        className="node-hit"
                        transform={`translate(${n.x},${n.y})`}
                        opacity={op}
                        onClick={() => setSelNode(selNode === n.id ? null : n.id)}
                        onMouseEnter={() => setHovNode(n.id)}
                        onMouseLeave={() => setHovNode(null)}
                        style={{ transition:"opacity .2s ease" }}
                      >
                        {/* Glow ring on active */}
                        {isActive && (
                          <circle r={r+6} fill="none" stroke={n.color} strokeWidth={1} opacity={0.3}/>
                        )}
                        <circle
                          r={r}
                          fill={isActive ? n.color : n.color+"40"}
                          stroke={n.color}
                          strokeWidth={1.5}
                        />
                        {/* Label */}
                        <text
                          x={0} y={-r-5}
                          textAnchor="middle"
                          fill={n.color}
                          fontSize={n.type==="centre"?11:9.5}
                          fontFamily="'JetBrains Mono', monospace"
                          fontWeight={isActive?"600":"400"}
                        >{n.label}</text>
                        {/* Sub */}
                        <text
                          x={0} y={r+13}
                          textAnchor="middle"
                          fill="rgba(255,255,255,.3)"
                          fontSize={8}
                          fontFamily="'Figtree', sans-serif"
                        >{n.sub}</text>
                      </g>
                    );
                  })}

                  {/* Row labels */}
                  {[
                    [20, 52, "CONV"],
                    [20, 175, "ROOT"],
                    [20, 295, "DOCS"],
                    [20, 430, "JSX"],
                    [20, 540, "HUB"],
                  ].map(([x,y,l]) => (
                    <text key={l} x={x} y={y} fill="rgba(255,255,255,.12)" fontSize={8}
                      fontFamily="'JetBrains Mono'" letterSpacing="2">{l}</text>
                  ))}
                </svg>
              </div>

              {/* Detail panel */}
              <div>
                {selData ? (
                  <div className="glass" style={{ padding:18, borderColor:`${selData.color}30` }}>
                    <div style={{ fontSize:10, fontFamily:"'JetBrains Mono'", color:"#3F3F46", letterSpacing:".08em", marginBottom:10 }}>NŒUD SÉLECTIONNÉ</div>
                    <div style={{ fontSize:14, fontWeight:700, color:selData.color, marginBottom:4, fontFamily:"'JetBrains Mono'" }}>{selData.label}</div>
                    <div style={{ fontSize:12, color:"#71717A", marginBottom:16 }}>{selData.sub}</div>

                    {selNeeds.length > 0 && (
                      <>
                        <div style={{ fontSize:10, fontFamily:"'JetBrains Mono'", color:"#3F3F46", letterSpacing:".08em", marginBottom:8 }}>REÇOIT DE →</div>
                        {selNeeds.map(id => {
                          const n = GNODES.find(x=>x.id===id);
                          return n ? (
                            <div key={id} onClick={() => setSelNode(id)} style={{ display:"flex", alignItems:"center", gap:6, padding:"5px 8px", marginBottom:4, borderRadius:5, background:"rgba(255,255,255,.03)", cursor:"pointer" }}>
                              <span style={{ width:6, height:6, borderRadius:"50%", background:n.color, flexShrink:0 }}/>
                              <span style={{ fontSize:11, fontFamily:"'JetBrains Mono'", color:n.color }}>{n.label}</span>
                            </div>
                          ) : null;
                        })}
                        <div style={{ height:1, background:"rgba(255,255,255,.06)", margin:"12px 0" }}/>
                      </>
                    )}

                    {selProvides.length > 0 && (
                      <>
                        <div style={{ fontSize:10, fontFamily:"'JetBrains Mono'", color:"#3F3F46", letterSpacing:".08em", marginBottom:8 }}>FOURNIT À →</div>
                        {selProvides.map(id => {
                          const n = GNODES.find(x=>x.id===id);
                          return n ? (
                            <div key={id} onClick={() => setSelNode(id)} style={{ display:"flex", alignItems:"center", gap:6, padding:"5px 8px", marginBottom:4, borderRadius:5, background:"rgba(255,255,255,.03)", cursor:"pointer" }}>
                              <span style={{ width:6, height:6, borderRadius:"50%", background:n.color, flexShrink:0 }}/>
                              <span style={{ fontSize:11, fontFamily:"'JetBrains Mono'", color:n.color }}>{n.label}</span>
                            </div>
                          ) : null;
                        })}
                      </>
                    )}

                    <button onClick={() => setSelNode(null)} style={{ marginTop:16, background:"transparent", border:"1px solid rgba(255,255,255,.1)", borderRadius:5, padding:"4px 12px", color:"#52525B", fontSize:11, cursor:"pointer" }}>
                      ✕ Désélectionner
                    </button>
                  </div>
                ) : (
                  <div className="glass" style={{ padding:18, height:"100%" }}>
                    <div style={{ fontSize:10, fontFamily:"'JetBrains Mono'", color:"#3F3F46", letterSpacing:".08em", marginBottom:16 }}>LÉGENDE</div>
                    {[
                      ["CONV", "#52525B", "Conversation source"],
                      ["ROOT", "#A78BFA", "Document manifeste"],
                      ["DOCS", "#5EEAD4", "Knowledge base"],
                      ["JSX", "#F97316", "Artifact React"],
                      ["HUB", "#5EEAD4", "Ce dashboard"],
                    ].map(([t,c,d]) => (
                      <div key={t} style={{ display:"flex", alignItems:"center", gap:10, padding:"6px 0" }}>
                        <span style={{ width:8, height:8, borderRadius:"50%", background:c, flexShrink:0 }}/>
                        <div>
                          <div style={{ fontSize:10, fontFamily:"'JetBrains Mono'", color:c }}>{t}</div>
                          <div style={{ fontSize:10, color:"#3F3F46" }}>{d}</div>
                        </div>
                      </div>
                    ))}
                    <div style={{ marginTop:20, fontSize:11, color:"#3F3F46", lineHeight:1.6 }}>
                      Cliquer un nœud pour explorer ses connexions entrantes et sortantes.
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ════ ARTEFACTS ════ */}
        {tab === "artifacts" && (
          <div className="fi">
            <div style={{ fontSize:10, fontFamily:"'JetBrains Mono'", color:"#3F3F46", letterSpacing:".08em", marginBottom:16 }}>
              5 ARTEFACTS PRODUITS — FONDATION V0
            </div>

            {ARTIFACTS.map((a,i) => (
              <div key={a.id} className={`glass art-row fi d${i+1}`} style={{
                padding:20, marginBottom:12, borderLeft:`3px solid ${a.color}`,
                opacity:0,
              }}>
                <div style={{ display:"grid", gridTemplateColumns:"1fr auto auto", gap:10, alignItems:"start", marginBottom:12 }}>
                  <div>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                      <span style={{ fontFamily:"'JetBrains Mono'", fontSize:13, color:a.color, fontWeight:600 }}>{a.file}</span>
                      <span className="chip" style={{ background:statusColor(a.status)+"18", color:statusColor(a.status) }}>{statusLabel(a.status)}</span>
                    </div>
                    <div style={{ fontSize:14, fontWeight:600, color:"#FAFAFA", marginBottom:6 }}>{a.title}</div>
                    <div style={{ fontSize:12, color:"#71717A", lineHeight:1.5 }}>{a.desc}</div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ fontSize:10, fontFamily:"'JetBrains Mono'", color:"#3F3F46", marginBottom:4 }}>CONV</div>
                    <span className="chip" style={{ background:"rgba(94,234,212,.1)", color:"#5EEAD4" }}>{a.conv}</span>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ fontSize:10, fontFamily:"'JetBrains Mono'", color:"#3F3F46", marginBottom:4 }}>LOC</div>
                    <span style={{ fontFamily:"'JetBrains Mono'", fontSize:11, color:"#52525B" }}>{a.loc}</span>
                  </div>
                </div>

                <div style={{ borderTop:"1px solid rgba(255,255,255,.05)", paddingTop:10 }}>
                  <div style={{ fontSize:10, fontFamily:"'JetBrains Mono'", color:"#3F3F46", marginBottom:6, letterSpacing:".06em" }}>DÉPENDANCES</div>
                  <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                    {a.deps.map(d => (
                      <span key={d} className="chip" style={{ background:"rgba(255,255,255,.04)", color:"#71717A", border:"1px solid rgba(255,255,255,.06)" }}>{d}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ════ JOURNAL ════ */}
        {tab === "journal" && (
          <div className="fi">
            {/* Add entry */}
            <div className="glass" style={{ padding:16, marginBottom:20, borderColor:"rgba(94,234,212,.1)" }}>
              <div style={{ fontSize:10, fontFamily:"'JetBrains Mono'", color:"#3F3F46", letterSpacing:".08em", marginBottom:10 }}>NOUVELLE ENTRÉE</div>
              <div style={{ display:"flex", gap:8, marginBottom:8 }}>
                <select
                  className="sel"
                  value={newType}
                  onChange={e => setNewType(e.target.value)}
                >
                  <option value="note">note</option>
                  <option value="décision">décision</option>
                  <option value="action">action</option>
                  <option value="alerte">alerte</option>
                </select>
                <input
                  className="ipt"
                  placeholder="Contenu de l'entrée…"
                  value={newMsg}
                  onChange={e => setNewMsg(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && addEntry()}
                />
                <button className="btn-add" onClick={addEntry}>+ Ajouter</button>
              </div>
            </div>

            {/* Log entries */}
            <div style={{ fontSize:10, fontFamily:"'JetBrains Mono'", color:"#3F3F46", letterSpacing:".08em", marginBottom:12 }}>
              JOURNAL — {log.length} ENTRÉES
            </div>
            {[...log].reverse().map((e, i) => (
              <div key={e.id} className={`fi d${Math.min(i+1,6)}`} style={{
                display:"grid", gridTemplateColumns:"auto 1fr auto",
                gap:12, padding:"12px 16px", marginBottom:8,
                background:"rgba(255,255,255,.02)",
                border:"1px solid rgba(255,255,255,.05)",
                borderLeft:`3px solid ${e.color}`,
                borderRadius:"0 8px 8px 0",
                opacity:0,
              }}>
                <span style={{ fontFamily:"'JetBrains Mono'", fontSize:10, color:"#3F3F46", paddingTop:2 }}>{e.date}</span>
                <div>
                  <span className="chip" style={{ background:e.color+"18", color:e.color, marginBottom:4, marginRight:8 }}>{e.type}</span>
                  <span style={{ fontSize:12, color:"#D4D4D8" }}>{e.text}</span>
                </div>
                <span style={{ fontSize:10, fontFamily:"'JetBrains Mono'", color:"#3F3F46" }}>{e.author}</span>
              </div>
            ))}

            {loaded && (
              <div style={{ textAlign:"right", marginTop:12 }}>
                <button
                  onClick={() => { if(confirm("Réinitialiser le journal ?")) setLog(DEFAULT_LOG); }}
                  style={{ background:"transparent", border:"1px solid rgba(239,68,68,.2)", borderRadius:5, padding:"4px 12px", color:"rgba(239,68,68,.6)", fontSize:10, cursor:"pointer" }}
                >
                  🔄 Reset journal
                </button>
              </div>
            )}
          </div>
        )}

      </div>

      {/* ── WEIGHT BAR FOOTER (sticky) ── */}
      <div className="weight-footer">
        {/* Icon + label */}
        <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
          <span style={{ fontSize:14, opacity: sizePct > 84 ? 1 : 0.5, animation: sizePct > 84 ? "shimmer 2s infinite" : "none" }}>
            {sizePct > 94 ? "🔴" : sizePct > 84 ? "🟠" : sizePct > 69 ? "🟡" : "🟢"}
          </span>
          <span style={{ fontFamily:"'JetBrains Mono'", fontSize:10, color:"#3F3F46", letterSpacing:".06em", whiteSpace:"nowrap" }}>
            POIDS ARTEFACT
          </span>
        </div>

        {/* Bar */}
        <div style={{ flex:1, height:6, borderRadius:3, background:"rgba(255,255,255,.06)", overflow:"hidden", minWidth:80 }}>
          <div
            className="wbar-fill"
            style={{ width:`${sizePct}%`, background:sizeColor }}
          />
        </div>

        {/* Numbers */}
        <div style={{ display:"flex", alignItems:"baseline", gap:4, flexShrink:0 }}>
          <span style={{ fontFamily:"'JetBrains Mono'", fontSize:13, fontWeight:600, color:sizeColor }}>{sizeKB}</span>
          <span style={{ fontFamily:"'JetBrains Mono'", fontSize:10, color:"#3F3F46" }}>/ {maxKB} KB</span>
          <span style={{ fontFamily:"'JetBrains Mono'", fontSize:11, color:sizeColor, marginLeft:6 }}>
            {sizePct.toFixed(1)}%
          </span>
        </div>

        {/* Status badge */}
        <span style={{
          fontFamily:"'JetBrains Mono'", fontSize:10, fontWeight:600,
          background:sizeColor+"18", color:sizeColor,
          padding:"3px 10px", borderRadius:4, letterSpacing:".04em", flexShrink:0,
        }}>{sizeLabel}</span>

        {/* Warning message */}
        {sizePct > 69 && (
          <span style={{ fontSize:10, color:sizeColor, opacity:.8, flexShrink:0, fontFamily:"'Figtree'" }}>
            {sizePct > 94 ? "⚠ Scinder l'artefact maintenant"
             : sizePct > 84 ? "Prévoir un split prochainement"
             : "Surveiller la croissance"}
          </span>
        )}

        {/* Sync quick button */}
        <button
          className={`btn-sync-main ${syncCopied?"btn-sync-copied":""}`}
          onClick={handleCopySync}
          style={{ flexShrink:0, padding:"5px 14px", fontSize:11 }}
        >
          {syncCopied ? "✓" : "⇅"} Sync
        </button>
      </div>
    </div>
  );
}
