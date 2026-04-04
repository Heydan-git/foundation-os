import { useState, useMemo, useCallback } from "react";

// ─────────── DATA (source: INDEX-DATA.md) ───────────
// Ce bloc est un miroir de INDEX-DATA.md
// Pour mettre à jour : modifier INDEX-DATA.md d'abord, puis syncer ici

const CONVERSATIONS = [
  {
    id: "CONV-01", title: "Fondations",
    url: "https://claude.ai/chat/1d8fa812-943c-429f-bd3c-b7de195075fd",
    date: "2-3 avril 2026",
    tags: ["fondation", "vision", "principes", "coopération", "BMAD", "Claudify", "viewer", "CTA", "API"],
    density: 5,
    items: [
      { subject: "Déclaration de coopération", type: "🧭 Principe" },
      { subject: "Vision long terme : fondation mondiale", type: "🔭 Vision" },
      { subject: "Vision court terme : core + OS + workflow", type: "⚙️ Objectif" },
      { subject: "Analyse Claudify + BMAD", type: "📖 Recherche" },
      { subject: "FONDATION_v0.md créé", type: "📄 Document" },
      { subject: "Plan déploiement Cowork", type: "🗺️ Plan" },
      { subject: "Viewer fondation (.jsx) — multiples itérations", type: "🎨 Artifact" },
      { subject: "CTA API + modal IA + indicateur mémoire", type: "🔧 Feature" },
    ],
    decisions: ["Mode coopération > exploitation", "Traçabilité totale exigée", "Plan évolutif + mémoire adaptative", "Claudify + BMAD = fondations workflow"],
  },
  {
    id: "CONV-02", title: "Skills et workflow",
    url: "https://claude.ai/chat/96289709-ecfe-483f-bc6b-b087130f6eab",
    date: "2-3 avril 2026",
    tags: ["skills", "pipeline", "iOS", "knowledge-base", "cowork-setup", "conversation-control", "scan"],
    density: 5,
    items: [
      { subject: "Cartographie 18+ skills par phase", type: "🧠 Mapping" },
      { subject: "Pipeline 8 phases complètes", type: "🔄 Framework" },
      { subject: "ios-pipeline-dashboard.jsx", type: "🎨 Artifact" },
      { subject: "12 fichiers MD pour Cowork", type: "📄 Documents" },
      { subject: "conversation-control.jsx + scan API + deep scan", type: "🎨 Artifact" },
    ],
    decisions: ["8 phases : Validation → Growth", "3 budgets : Bootstrap / Indie / Funded", "12 fichiers knowledge base définis"],
    files: ["FONDATION.md", "PIPELINE.md", "BUDGET-SCENARIOS.md", "MONITORING.md", "EVOLUTION-ROADMAP.md", "SKILLS-MAP.md", "TOOLS-STACK.md", "CHECKLIST-LAUNCH.md", "JOURNAL.md", "SYNC-CHAT.md", "PROJECT-INSTRUCTIONS.md", "README-SETUP.md"],
  },
  {
    id: "CONV-03", title: "Accès aux instructions en temps réel",
    url: "https://claude.ai/chat/d839bc9c-9de7-4646-b480-a200caaeb74b",
    date: "2 avril 2026",
    tags: ["technique", "contexte", "instructions", "mémoire", "fonctionnement-claude"],
    density: 2,
    items: [
      { subject: "Lecture instructions Claude (live vs périodique)", type: "🔧 Technique" },
      { subject: "Tableau sync éléments", type: "📊 Référence" },
      { subject: "Limites contexte 200K tokens", type: "⚠️ Contrainte" },
    ],
    decisions: ["Instructions = live reload par message", "Memories = màj périodique, pas live"],
  },
  {
    id: "CONV-04", title: "Réutiliser le design entre conversations",
    url: "https://claude.ai/chat/690cfa43-c26a-4e68-86ce-e800efc2768b",
    date: "2-3 avril 2026",
    tags: ["DA", "design-system", "void-glass", "cohérence", "diff", "canonical"],
    density: 4,
    items: [
      { subject: "Diff 4 artifacts — 13 divergences", type: "🔍 Audit" },
      { subject: "DA-PIPELINE-EXTRACT.md", type: "📄 Document" },
      { subject: "DA-VOID-GLASS-CANONICAL.md", type: "📄 Document" },
      { subject: "Diagnostic fond/typo/cards/animations", type: "🔧 Analyse" },
      { subject: "Règle persistance entre conversations", type: "🧭 Principe" },
    ],
    decisions: ["Figtree uniquement", "Cartes rgba, jamais solides", "Fond #06070C canonique", "CSS depuis boilerplate, jamais de mémoire"],
    files: ["DA-PIPELINE-EXTRACT.md", "DA-VOID-GLASS-CANONICAL.md"],
  },
  {
    id: "CONV-05", title: "Idéation de projet",
    url: "https://claude.ai/chat/b872a6dc-785f-42e3-95c3-62296ded57d0",
    date: "2-3 avril 2026",
    tags: ["idéation", "core", "OS", "méthode", "architecture", "layers", "taxonomie"],
    density: 3,
    items: [
      { subject: "Synthèse existant — construit vs flou", type: "📊 Analyse" },
      { subject: "Structure 3 couches (Core / Méthode / Projets)", type: "🏗️ Architecture" },
      { subject: "Questions fondatrices posées", type: "❓ Cadrage" },
      { subject: "Proposition : définir Core, OS, taxonomie", type: "🎯 Plan" },
    ],
    decisions: ["3 couches : Core → Méthode → Projets", "Layer 1 (Core) pas encore formalisé"],
  },
  {
    id: "CONV-06", title: "Monitoring",
    url: "https://claude.ai/chat/0c9239fd-60dd-42f0-b2d8-12a929d71a43",
    date: "2-3 avril 2026",
    tags: ["monitoring", "dashboard", "suivi", "risques", "sessions", "ADR", "API", "mémoire"],
    density: 5,
    items: [
      { subject: "FONDATION_MONITORING.md créé", type: "📄 Document" },
      { subject: "fondation-monitor.jsx (phases, journal, risques)", type: "🎨 Artifact" },
      { subject: "CTA auto-analyse Claude (API)", type: "🤖 Feature" },
      { subject: "Stockage persistant cross-session", type: "🔧 Technique" },
      { subject: "Triple jauge mémoire (storage/JSX/data items)", type: "📏 Feature" },
    ],
    decisions: ["Monitoring = priorité dès le début", "Risques trackés dès apparition", "Auto-analyse API ponctuellement"],
    files: ["FONDATION_MONITORING.md"],
  },
  {
    id: "CONV-07", title: "Communication",
    url: "https://claude.ai/chat/b988d394-53aa-4bcd-8961-92720537b506",
    date: "3 avril 2026",
    tags: ["hub", "dépendances", "graphe", "artefacts", "journal", "centre"],
    density: 5,
    items: [
      { subject: "centre-communication.jsx — hub central", type: "🎨 Artifact" },
      { subject: "Graphe SVG dépendances interactif", type: "📊 Feature" },
      { subject: "Tracker artefacts + statuts", type: "📋 Feature" },
      { subject: "Journal persistant cross-session", type: "📓 Feature" },
      { subject: "FONDATION_CENTRE.md", type: "📄 Document" },
    ],
    decisions: ["Centre Communication = hub d'entrée projet", "Graphe de dépendances = source de vérité relations"],
    files: ["centre-communication.jsx", "FONDATION_CENTRE.md"],
  },
  {
    id: "CONV-08", title: "Mise en place plugins & framework",
    url: "https://claude.ai/chat/7354b90b-5c76-4d93-bc42-8709956c38a7",
    date: "3 avril 2026",
    tags: ["BMAD", "Claude-Code", "hooks", "plugins", "MCP", "framework", "layers"],
    density: 4,
    items: [
      { subject: "Recherche BMAD v6 + Claudify", type: "📖 Recherche" },
      { subject: "Architecture 4 couches (Cowork/CC/BMAD/MCP)", type: "🏗️ Architecture" },
      { subject: "Plan 7 étapes setup", type: "🗺️ Plan" },
      { subject: "FONDATION_FRAMEWORKS.md créé", type: "📄 Document" },
    ],
    decisions: ["BMAD v6 + Claude Code = fondation workflow", "4 couches : L1 Cowork, L2 Claude Code, L3 BMAD, L4 MCP", "Étape 01 = aligner objectif app iOS avant exécution"],
    files: ["FONDATION_FRAMEWORKS.md"],
  },
  {
    id: "CONV-09", title: "Rangement, Index & DA",
    url: "",
    date: "3 avril 2026",
    tags: ["index", "rangement", "DA", "void-glass", "dashboard", "organisation", "mémoire", "CTA"],
    density: 5,
    items: [
      { subject: "Analyse faisabilité rangement chats", type: "🔧 Technique" },
      { subject: "Scan exhaustif 9 conversations", type: "🔍 Inventaire" },
      { subject: "INDEX-DATA.md — BDD projet (source de vérité)", type: "📄 Document" },
      { subject: "project-index-dashboard.jsx", type: "🎨 Artifact" },
      { subject: "DA 'Void Glass' formalisée", type: "🎨 DA" },
      { subject: "DA-FONDATION.md + DA-BOILERPLATE.md", type: "📄 Documents" },
      { subject: "CTA Analyser (API) + MAJ complète (clipboard)", type: "🔧 Feature" },
      { subject: "Jauge mémoire JSX", type: "📏 Feature" },
      { subject: "Séparation MD=données / JSX=contrôleur", type: "🏗️ Architecture" },
    ],
    decisions: ["DA Void Glass = norme tous artifacts", "INDEX-DATA.md = source de vérité unique (MD=BDD, JSX=UI)", "sendPrompt indisponible dans artifacts → clipboard"],
    files: ["INDEX-DATA.md", "project-index-dashboard.jsx", "DA-FONDATION.md", "DA-BOILERPLATE.md"],
  },
];

const THEMES = [
  { id: "fondation", label: "🧭 Vision & Principes", color: "#A78BFA", convs: ["CONV-01", "CONV-05"] },
  { id: "workflow", label: "⚙️ Workflow & Pipeline", color: "#5EEAD4", convs: ["CONV-01", "CONV-02", "CONV-08"] },
  { id: "skills", label: "🧠 Skills & Outils", color: "#3B82F6", convs: ["CONV-02"] },
  { id: "docs", label: "📄 Documents produits", color: "#22C55E", convs: ["CONV-02", "CONV-04", "CONV-07", "CONV-08", "CONV-09"] },
  { id: "artifacts", label: "🎨 Artifacts UI", color: "#F97316", convs: ["CONV-01", "CONV-02", "CONV-06", "CONV-07", "CONV-09"] },
  { id: "da", label: "🎨 Direction Artistique", color: "#EC4899", convs: ["CONV-04", "CONV-09"] },
  { id: "technique", label: "🔧 Technique Claude", color: "#94A3B8", convs: ["CONV-03"] },
  { id: "monitoring", label: "📊 Monitoring & Suivi", color: "#EAB308", convs: ["CONV-06"] },
  { id: "ideation", label: "💡 Idéation & Architecture", color: "#3B82F6", convs: ["CONV-05"] },
  { id: "hub", label: "🔗 Hub & Dépendances", color: "#22C55E", convs: ["CONV-07"] },
  { id: "framework", label: "🏗️ Frameworks & Plugins", color: "#F97316", convs: ["CONV-08"] },
  { id: "index", label: "📚 Organisation & Index", color: "#EAB308", convs: ["CONV-09"] },
];

const ALL_FILES = [
  { name: "ios-pipeline-dashboard.jsx", type: "🎨 Pipeline", source: "CONV-02", ext: "jsx", da: "⚠️" },
  { name: "fondation-monitor.jsx", type: "🎨 Monitoring", source: "CONV-06", ext: "jsx", da: "⚠️" },
  { name: "project-index-dashboard.jsx", type: "🎨 Index", source: "CONV-09", ext: "jsx", da: "✅" },
  { name: "conversation-control.jsx", type: "🎨 Contrôle", source: "CONV-02", ext: "jsx", da: "⚠️" },
  { name: "fondation_viewer.jsx", type: "🎨 Viewer", source: "CONV-01", ext: "jsx", da: "⚠️" },
  { name: "centre-communication.jsx", type: "🎨 Hub", source: "CONV-07", ext: "jsx", da: "⚠️" },
  { name: "FONDATION.md", type: "🧭 Manifeste", source: "CONV-02", ext: "md" },
  { name: "PIPELINE.md", type: "🔄 Pipeline", source: "CONV-02", ext: "md" },
  { name: "BUDGET-SCENARIOS.md", type: "💰 Budget", source: "CONV-02", ext: "md" },
  { name: "MONITORING.md", type: "📊 Monitoring", source: "CONV-02", ext: "md" },
  { name: "EVOLUTION-ROADMAP.md", type: "🚀 Roadmap", source: "CONV-02", ext: "md" },
  { name: "SKILLS-MAP.md", type: "🧠 Skills", source: "CONV-02", ext: "md" },
  { name: "TOOLS-STACK.md", type: "🛠️ Stack", source: "CONV-02", ext: "md" },
  { name: "CHECKLIST-LAUNCH.md", type: "✅ Checklist", source: "CONV-02", ext: "md" },
  { name: "JOURNAL.md", type: "📓 Journal", source: "CONV-02", ext: "md" },
  { name: "SYNC-CHAT.md", type: "🔄 Sync", source: "CONV-02", ext: "md" },
  { name: "PROJECT-INSTRUCTIONS.md", type: "⚙️ Instructions", source: "CONV-02", ext: "md" },
  { name: "README-SETUP.md", type: "📋 Guide", source: "CONV-02", ext: "md" },
  { name: "FONDATION_MONITORING.md", type: "📡 Monitoring", source: "CONV-06", ext: "md" },
  { name: "FONDATION_CENTRE.md", type: "🔗 Hub Centre", source: "CONV-07", ext: "md" },
  { name: "FONDATION_FRAMEWORKS.md", type: "🏗️ Frameworks", source: "CONV-08", ext: "md" },
  { name: "DA-FONDATION.md", type: "🎨 Spec DA", source: "CONV-09", ext: "md" },
  { name: "DA-BOILERPLATE.md", type: "🧱 Template", source: "CONV-09", ext: "md" },
  { name: "DA-PIPELINE-EXTRACT.md", type: "🎨 Extract DA", source: "CONV-04", ext: "md" },
  { name: "DA-VOID-GLASS-CANONICAL.md", type: "🎨 DA Canonique", source: "CONV-04", ext: "md" },
  { name: "INDEX-DATA.md", type: "📚 BDD Index", source: "CONV-09", ext: "md" },
];

const MAX_JSX_CHARS = 65000;
const WARN_THRESHOLD = 0.70;
const DANGER_THRESHOLD = 0.85;

// ─────────── COMPONENT ───────────

export default function ProjectIndex() {
  const [view, setView] = useState("overview");
  const [sel, setSel] = useState(null);
  const [filter, setFilter] = useState(null);
  const [apiStatus, setApiStatus] = useState("idle");
  const [apiMsg, setApiMsg] = useState("");

  const filtered = filter
    ? CONVERSATIONS.filter(c => c.tags.includes(filter) || THEMES.find(t => t.id === filter)?.convs.includes(c.id))
    : CONVERSATIONS;

  const mem = useMemo(() => {
    const d = JSON.stringify({ CONVERSATIONS, THEMES, ALL_FILES }).length;
    const t = d + 14000;
    const r = t / MAX_JSX_CHARS;
    const p = Math.min(Math.round(r * 100), 100);
    const s = r >= DANGER_THRESHOLD ? "danger" : r >= WARN_THRESHOLD ? "warn" : "ok";
    const c = s === "danger" ? "#EF4444" : s === "warn" ? "#EAB308" : "#22C55E";
    return { d, t, p, s, c, cap: Math.max(0, Math.floor((MAX_JSX_CHARS - t) / 500)) };
  }, []);

  const stats = [
    { label: "Conversations", value: String(CONVERSATIONS.length), icon: "💬" },
    { label: "Documents", value: String(ALL_FILES.length), sub: `${ALL_FILES.filter(f => f.ext === "md").length} MD + ${ALL_FILES.filter(f => f.ext === "jsx").length} JSX`, icon: "📄" },
    { label: "Décisions", value: String(CONVERSATIONS.reduce((a, c) => a + (c.decisions?.length || 0), 0)), icon: "⚡" },
    { label: "Items indexés", value: String(CONVERSATIONS.reduce((a, c) => a + c.items.length, 0)), icon: "🧠" },
    { label: "DA conformes", value: `${ALL_FILES.filter(f => f.da === "✅").length}/${ALL_FILES.filter(f => f.ext === "jsx").length}`, sub: "Void Glass", icon: "🎨" },
  ];

  const doApi = useCallback(async () => {
    setApiStatus("loading"); setApiMsg("Analyse…");
    try {
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 1000,
          system: "Tu analyses un index de projet. Retourne UNIQUEMENT du JSON : {\"summary\":\"...\",\"suggestions\":[\"...\"],\"health\":\"ok|warn|action\"}. Pas de backticks.",
          messages: [{ role: "user", content: `Index : ${CONVERSATIONS.length} conv, ${ALL_FILES.length} fichiers, ${ALL_FILES.filter(f=>f.da==="⚠️").length} artifacts non-conformes DA. Analyse.` }],
        }),
      });
      const data = await r.json();
      const txt = data.content?.map(i => i.text || "").join("") || "";
      try { const j = JSON.parse(txt.replace(/```json|```/g,"").trim()); setApiMsg(j.summary); } catch { setApiMsg(txt.slice(0, 200)); }
      setApiStatus("success");
    } catch (e) { setApiStatus("error"); setApiMsg("Erreur : " + (e.message || "connexion")); }
  }, []);

  const [copied, setCopied] = useState(false);
  const UPDATE_PROMPT = "Met à jour INDEX-DATA.md d'abord (source de vérité), puis synce le project-index-dashboard.jsx : scanne toutes les conversations du projet avec recent_chats (n=20), ajoute les nouvelles CONV, met à jour stats/thèmes/fichiers. Garde la DA Void Glass.";

  const doFull = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(UPDATE_PROMPT);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // fallback : prompt visible
      setApiStatus("success");
      setApiMsg("Copie impossible — colle manuellement : " + UPDATE_PROMPT);
    }
  }, []);

  // ─── Shared render helpers ───
  const Chip = ({ bg, color, children, onClick }) => (
    <span className="chip" onClick={onClick} style={{ background: bg || "rgba(255,255,255,.04)", color: color || "#71717A" }}>{children}</span>
  );
  const Label = ({ children }) => (
    <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono'", color: "#52525B", letterSpacing: ".06em", marginBottom: 8 }}>{children}</div>
  );
  const Density = ({ v }) => (
    <div className="density">{[1,2,3,4,5].map(n => <span key={n} style={{ background: n <= v ? "#5EEAD4" : "#1C1C1F" }} />)}</div>
  );

  return (
    <div style={{ fontFamily: "'Figtree', -apple-system, sans-serif", background: "#06070C", color: "#D4D4D8", minHeight: "100vh", position: "relative", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Figtree:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:#27272A;border-radius:4px}
        .fi{opacity:0;transform:translateY(6px);animation:fu .3s ease forwards}
        .d1{animation-delay:.04s}.d2{animation-delay:.08s}.d3{animation-delay:.12s}.d4{animation-delay:.16s}.d5{animation-delay:.2s}.d6{animation-delay:.24s}
        @keyframes fu{to{opacity:1;transform:translateY(0)}}
        @keyframes drift{0%,100%{transform:translate(0,0)}50%{transform:translate(30px,-20px)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        .orb{position:absolute;border-radius:50%;filter:blur(80px);opacity:.12;pointer-events:none}
        .o1{width:300px;height:300px;background:#A78BFA;top:-60px;right:-60px;animation:drift 20s ease-in-out infinite}
        .o2{width:200px;height:200px;background:#5EEAD4;bottom:40%;left:-40px;animation:drift 25s ease-in-out infinite reverse}
        .card{background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.05);border-radius:10px;transition:all .15s ease}
        .card:hover{background:rgba(255,255,255,.04);border-color:rgba(255,255,255,.08)}
        .chip{display:inline-flex;align-items:center;padding:2px 8px;border-radius:4px;font-size:10px;font-family:'JetBrains Mono',monospace;cursor:pointer;transition:all .12s;border:1px solid transparent}
        .chip:hover{border-color:rgba(255,255,255,.1)}
        .nav-btn{background:none;border:none;padding:6px 12px;cursor:pointer;font-size:12px;font-family:'Figtree',sans-serif;font-weight:500;color:#52525B;border-bottom:2px solid transparent;transition:all .15s}
        .nav-btn:hover{color:#A1A1AA}.nav-btn.on{color:#FAFAFA;border-bottom-color:#5EEAD4}
        .conv-row{padding:12px 16px;cursor:pointer;border-bottom:1px solid rgba(255,255,255,.03);transition:background .1s}
        .conv-row:hover{background:rgba(255,255,255,.03)}.conv-row:last-child{border-bottom:none}
        .back-btn{background:none;border:1px solid #27272A;border-radius:6px;padding:4px 12px;cursor:pointer;color:#71717A;font-size:11px;font-family:'JetBrains Mono',monospace;transition:all .12s}
        .back-btn:hover{border-color:#52525B;color:#A1A1AA}
        .density{display:flex;gap:2px}.density span{width:8px;height:8px;border-radius:2px}
        .cta{display:inline-flex;align-items:center;gap:5px;padding:5px 12px;border-radius:6px;font-size:10px;font-family:'JetBrains Mono',monospace;font-weight:500;cursor:pointer;transition:all .15s}
        .cta:hover{filter:brightness(1.2)}.cta:disabled{opacity:.4;cursor:not-allowed;filter:none}
      `}</style>

      <div className="o1 orb"/><div className="o2 orb"/>

      {/* ── HEADER ── */}
      <div style={{ position:"relative",zIndex:2,padding:"18px 24px 0",borderBottom:"1px solid rgba(255,255,255,.04)" }}>
        <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:2 }}>
          <span style={{ fontSize:18,fontWeight:700,color:"#FAFAFA",letterSpacing:"-.02em" }}>📚 INDEX PROJET</span>
          <span style={{ fontFamily:"'JetBrains Mono'",fontSize:10,color:"#3F3F46",letterSpacing:".06em" }}>
            FONDATION — {CONVERSATIONS.length} CONV — MÀJ 3 AVR 2026
          </span>
          {/* Memory mini */}
          <div style={{ marginLeft:"auto",display:"flex",alignItems:"center",gap:6 }}>
            <span style={{ fontSize:9,fontFamily:"'JetBrains Mono'",color:"#3F3F46" }}>MEM</span>
            <div style={{ width:50,height:5,background:"#1C1C1F",borderRadius:3,overflow:"hidden" }}>
              <div style={{ height:"100%",width:`${mem.p}%`,background:mem.c,borderRadius:3 }}/>
            </div>
            <span style={{ fontSize:9,fontFamily:"'JetBrains Mono'",color:mem.c,fontWeight:600 }}>{mem.p}%</span>
            <span style={{ fontSize:9,fontFamily:"'JetBrains Mono'",color:"#3F3F46" }}>~{mem.cap} conv restantes</span>
          </div>
        </div>
        <div style={{ display:"flex",alignItems:"center",marginTop:10 }}>
          {["overview","conversations","themes","files","memory"].map(id => (
            <button key={id} className={`nav-btn ${view===id?"on":""}`}
              onClick={() => { setView(id); setSel(null); setFilter(null); }}>
              {{overview:"Vue d'ensemble",conversations:"Conversations",themes:"Thèmes",files:"Fichiers",memory:"Mémoire"}[id]}
            </button>
          ))}
          <div style={{ marginLeft:"auto",display:"flex",gap:6 }}>
            <button className="cta" disabled={apiStatus==="loading"} onClick={doApi}
              style={{ background:"#5EEAD410",border:"1px solid #5EEAD430",color:"#5EEAD4" }}>
              {apiStatus==="loading" ? <><span style={{ display:"inline-block",width:8,height:8,border:"2px solid #5EEAD440",borderTopColor:"#5EEAD4",borderRadius:"50%",animation:"spin .6s linear infinite" }}/> Analyse…</> : "🔍 Analyser"}
            </button>
            <button className="cta" onClick={doFull}
              style={{ background: copied ? "#22C55E10" : "#A78BFA10", border: `1px solid ${copied ? "#22C55E30" : "#A78BFA30"}`, color: copied ? "#22C55E" : "#A78BFA" }}>
              {copied ? "✓ Copié — colle dans le chat" : "📋 MAJ complète"}</button>
          </div>
        </div>
      </div>

      {/* API bar */}
      {apiStatus !== "idle" && (
        <div style={{ position:"relative",zIndex:2,padding:"6px 24px",background:apiStatus==="error"?"#EF444410":apiStatus==="success"?"#22C55E10":"#5EEAD408",borderBottom:`1px solid ${apiStatus==="error"?"#EF444420":"#5EEAD415"}`,display:"flex",alignItems:"center",gap:8 }}>
          <span style={{ fontSize:10,fontFamily:"'JetBrains Mono'",color:apiStatus==="error"?"#EF4444":"#5EEAD4" }}>{apiStatus==="loading"?"⏳":"✓"}</span>
          <span style={{ fontSize:11,color:"#A1A1AA",flex:1 }}>{apiMsg}</span>
          <button onClick={()=>{setApiStatus("idle");setApiMsg("");}} style={{ background:"none",border:"none",color:"#52525B",cursor:"pointer",fontSize:11 }}>✕</button>
        </div>
      )}

      {/* ── CONTENT ── */}
      <div style={{ position:"relative",zIndex:2,padding:24 }}>

        {/* ═══ OVERVIEW ═══ */}
        {view==="overview" && !sel && (<div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:10,marginBottom:20 }}>
            {stats.map((s,i) => (
              <div key={i} className={`card fi d${i+1}`} style={{ padding:"12px 14px" }}>
                <div style={{ fontSize:10,fontFamily:"'JetBrains Mono'",color:"#52525B",marginBottom:4 }}>{s.icon} {s.label.toUpperCase()}</div>
                <div style={{ fontSize:20,fontWeight:700,color:"#FAFAFA" }}>{s.value}</div>
                {s.sub && <div style={{ fontSize:9,fontFamily:"'JetBrains Mono'",color:"#3F3F46",marginTop:2 }}>{s.sub}</div>}
              </div>
            ))}
          </div>
          <Label>CONVERSATIONS</Label>
          <div className="card" style={{ overflow:"hidden",marginBottom:20 }}>
            {CONVERSATIONS.map((c,i) => (
              <div key={c.id} className={`conv-row fi d${Math.min(i+1,6)}`} onClick={()=>setSel(c.id)}>
                <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:4 }}>
                  <span style={{ fontFamily:"'JetBrains Mono'",fontSize:10,color:"#5EEAD4" }}>{c.id}</span>
                  <span style={{ fontSize:13,fontWeight:600,color:"#FAFAFA" }}>{c.title}</span>
                  <span style={{ fontSize:10,fontFamily:"'JetBrains Mono'",color:"#3F3F46",marginLeft:"auto" }}>{c.items.length} items</span>
                  <Density v={c.density}/>
                </div>
                <div style={{ display:"flex",gap:4,flexWrap:"wrap" }}>
                  {c.tags.slice(0,5).map(t => <Chip key={t}>{t}</Chip>)}
                  {c.tags.length>5 && <Chip color="#3F3F46">+{c.tags.length-5}</Chip>}
                </div>
              </div>
            ))}
          </div>
          <Label>THÈMES</Label>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:8 }}>
            {THEMES.map((t,i) => (
              <div key={t.id} className={`card fi d${Math.min(i+1,6)}`} style={{ padding:"10px 12px",cursor:"pointer" }}
                onClick={()=>{setView("conversations");setFilter(t.id);}}>
                <div style={{ fontSize:11,fontWeight:500,color:"#FAFAFA",marginBottom:4 }}>{t.label}</div>
                <div style={{ display:"flex",gap:3,flexWrap:"wrap" }}>
                  {t.convs.map(c => <Chip key={c} bg={t.color+"15"} color={t.color}>{c}</Chip>)}
                </div>
              </div>
            ))}
          </div>
        </div>)}

        {/* ═══ CONV DETAIL ═══ */}
        {sel && (()=>{
          const c = CONVERSATIONS.find(x=>x.id===sel);
          if(!c) return null;
          return (<div className="fi">
            <button className="back-btn" onClick={()=>setSel(null)} style={{ marginBottom:14 }}>← Retour</button>
            <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:4 }}>
              <span style={{ fontFamily:"'JetBrains Mono'",fontSize:11,color:"#5EEAD4" }}>{c.id}</span>
              <span style={{ fontSize:17,fontWeight:700,color:"#FAFAFA" }}>{c.title}</span>
            </div>
            <div style={{ fontSize:11,color:"#52525B",marginBottom:4 }}>{c.date}</div>
            {c.url && <a href={c.url} target="_blank" rel="noopener" style={{ fontSize:10,fontFamily:"'JetBrains Mono'",color:"#3B82F6",textDecoration:"none",marginBottom:14,display:"inline-block" }}>🔗 Ouvrir →</a>}
            <div style={{ display:"flex",gap:4,flexWrap:"wrap",marginBottom:16 }}>{c.tags.map(t=><Chip key={t} color="#A1A1AA">{t}</Chip>)}</div>
            <Label>CONTENU ({c.items.length})</Label>
            <div className="card" style={{ overflow:"hidden",marginBottom:16 }}>
              {c.items.map((it,i)=>(
                <div key={i} style={{ display:"grid",gridTemplateColumns:"1fr auto auto",padding:"7px 14px",borderBottom:i<c.items.length-1?"1px solid rgba(255,255,255,.03)":"none",alignItems:"center" }}>
                  <span style={{ fontSize:12,color:"#D4D4D8" }}>{it.subject}</span>
                  <span style={{ fontSize:10,fontFamily:"'JetBrains Mono'",color:"#71717A" }}>{it.type}</span>
                  <span style={{ fontSize:10,color:"#22C55E",marginLeft:8 }}>✓</span>
                </div>
              ))}
            </div>
            {c.decisions && (<><Label>DÉCISIONS ({c.decisions.length})</Label>
              <div className="card" style={{ padding:12,marginBottom:16 }}>
                {c.decisions.map((d,i)=>(
                  <div key={i} style={{ display:"flex",alignItems:"center",gap:8,padding:"3px 0",fontSize:12,color:"#A1A1AA" }}>
                    <span style={{ width:4,height:4,borderRadius:"50%",background:"#A78BFA",flexShrink:0 }}/>{d}
                  </div>
                ))}
              </div>
            </>)}
            {c.files && (<><Label>FICHIERS ({c.files.length})</Label>
              <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6 }}>
                {c.files.map(f=><div key={f} className="card" style={{ padding:"6px 10px" }}><span style={{ fontSize:10,fontFamily:"'JetBrains Mono'",color:"#5EEAD4" }}>{f}</span></div>)}
              </div>
            </>)}
          </div>);
        })()}

        {/* ═══ CONVERSATIONS ═══ */}
        {view==="conversations" && !sel && (<div className="fi">
          {filter && <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:14 }}>
            <span style={{ fontSize:12,color:"#71717A" }}>Filtre :</span>
            <Chip bg="#5EEAD420" color="#5EEAD4">{filter}</Chip>
            <button className="back-btn" onClick={()=>setFilter(null)}>✕</button>
          </div>}
          <div className="card" style={{ overflow:"hidden" }}>
            {filtered.map((c,i) => (
              <div key={c.id} className={`conv-row fi d${Math.min(i+1,6)}`} onClick={()=>setSel(c.id)}>
                <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:4 }}>
                  <span style={{ fontFamily:"'JetBrains Mono'",fontSize:10,color:"#5EEAD4" }}>{c.id}</span>
                  <span style={{ fontSize:13,fontWeight:600,color:"#FAFAFA" }}>{c.title}</span>
                  <span style={{ fontSize:10,fontFamily:"'JetBrains Mono'",color:"#3F3F46",marginLeft:"auto" }}>{c.items.length}</span>
                </div>
                <div style={{ fontSize:11,color:"#52525B",marginBottom:4 }}>{c.date}</div>
                <div style={{ display:"flex",gap:4,flexWrap:"wrap" }}>
                  {c.tags.map(t=><Chip key={t} onClick={e=>{e.stopPropagation();setFilter(t);}}>{t}</Chip>)}
                </div>
              </div>
            ))}
          </div>
        </div>)}

        {/* ═══ THEMES ═══ */}
        {view==="themes" && !sel && (<div className="fi">
          <div style={{ display:"grid",gap:10 }}>
            {THEMES.map((t,i)=>(
              <div key={t.id} className={`card fi d${Math.min(i+1,6)}`} style={{ padding:14 }}>
                <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:8 }}>
                  <span style={{ fontSize:14,fontWeight:600,color:"#FAFAFA" }}>{t.label}</span>
                  <div style={{ marginLeft:"auto",display:"flex",gap:4 }}>
                    {t.convs.map(cid=><Chip key={cid} bg={t.color+"15"} color={t.color} onClick={()=>setSel(cid)}>{cid}</Chip>)}
                  </div>
                </div>
                <div style={{ height:3,background:"#1C1C1F",borderRadius:2,overflow:"hidden" }}>
                  <div style={{ height:"100%",width:`${t.convs.length/CONVERSATIONS.length*100}%`,background:t.color,borderRadius:2 }}/>
                </div>
              </div>
            ))}
          </div>
        </div>)}

        {/* ═══ FILES ═══ */}
        {view==="files" && !sel && (<div className="fi">
          {(()=>{
            const md=ALL_FILES.filter(f=>f.ext==="md"), jsx=ALL_FILES.filter(f=>f.ext==="jsx");
            return (<>
              <Label>ARTIFACTS ({jsx.length})</Label>
              <div style={{ display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:8,marginBottom:16 }}>
                {jsx.map((f,i)=>(
                  <div key={f.name} className={`card fi d${i+1}`} style={{ padding:12 }}>
                    <div style={{ display:"flex",alignItems:"center",gap:6,marginBottom:4 }}>
                      <span style={{ fontSize:11,fontWeight:600,color:"#F97316",fontFamily:"'JetBrains Mono'",flex:1 }}>{f.name}</span>
                      {f.da && <Chip bg={f.da==="✅"?"#22C55E15":"#EAB30815"} color={f.da==="✅"?"#22C55E":"#EAB308"}>{f.da} DA</Chip>}
                    </div>
                    <div style={{ fontSize:10,color:"#71717A" }}>{f.type}</div>
                    <Chip bg="#5EEAD415" color="#5EEAD4">{f.source}</Chip>
                  </div>
                ))}
              </div>
              <Label>DOCUMENTS ({md.length})</Label>
              <div className="card" style={{ overflow:"hidden" }}>
                {md.map((f,i)=>(
                  <div key={f.name} className={`fi d${Math.min(i+1,6)}`} style={{ display:"grid",gridTemplateColumns:"1fr auto auto",padding:"7px 14px",borderBottom:i<md.length-1?"1px solid rgba(255,255,255,.03)":"none",alignItems:"center" }}>
                    <span style={{ fontSize:11,fontFamily:"'JetBrains Mono'",color:"#5EEAD4" }}>{f.name}</span>
                    <span style={{ fontSize:10,color:"#71717A" }}>{f.type}</span>
                    <Chip bg="rgba(255,255,255,.04)" color="#52525B">{f.source}</Chip>
                  </div>
                ))}
              </div>
            </>);
          })()}
        </div>)}

        {/* ═══ MEMORY ═══ */}
        {view==="memory" && !sel && (<div className="fi">
          <Label>JAUGE MÉMOIRE JSX</Label>
          <div className="card fi d1" style={{ padding:18,marginBottom:14 }}>
            <div style={{ display:"flex",alignItems:"center",gap:16 }}>
              <div style={{ fontSize:38,fontWeight:700,color:mem.c,lineHeight:1,fontFamily:"'Figtree'" }}>{mem.p}%</div>
              <div style={{ flex:1 }}>
                <div style={{ height:8,background:"#1C1C1F",borderRadius:4,overflow:"hidden",marginBottom:6,position:"relative" }}>
                  <div style={{ position:"absolute",top:0,left:0,height:"100%",width:`${mem.p}%`,background:mem.c,borderRadius:4 }}/>
                  <div style={{ position:"absolute",top:0,left:`${WARN_THRESHOLD*100}%`,height:"100%",width:1,background:"#EAB30850" }}/>
                  <div style={{ position:"absolute",top:0,left:`${DANGER_THRESHOLD*100}%`,height:"100%",width:1,background:"#EF444450" }}/>
                </div>
                <div style={{ display:"flex",justifyContent:"space-between",fontSize:9,fontFamily:"'JetBrains Mono'",color:"#3F3F46" }}>
                  <span>0</span><span style={{ color:"#EAB308" }}>70%</span><span style={{ color:"#EF4444" }}>85%</span><span>100%</span>
                </div>
              </div>
            </div>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:14 }}>
            {[
              { l:"DONNÉES",v:`${(mem.d/1024).toFixed(1)}KB`,s:"Payload JSON",c:"#5EEAD4" },
              { l:"TOTAL ESTIMÉ",v:`${(mem.t/1024).toFixed(1)}KB`,s:`sur ${(MAX_JSX_CHARS/1024).toFixed(0)}KB max`,c:"#A78BFA" },
              { l:"CAPACITÉ",v:`~${mem.cap} conv`,s:"avant seuil critique",c:mem.cap<5?"#EF4444":mem.cap<10?"#EAB308":"#22C55E" },
            ].map((m,i)=>(
              <div key={i} className={`card fi d${i+1}`} style={{ padding:12 }}>
                <div style={{ fontSize:9,fontFamily:"'JetBrains Mono'",color:"#3F3F46",marginBottom:4,letterSpacing:".06em" }}>{m.l}</div>
                <div style={{ fontSize:20,fontWeight:700,color:m.c }}>{m.v}</div>
                <div style={{ fontSize:9,fontFamily:"'JetBrains Mono'",color:"#52525B",marginTop:2 }}>{m.s}</div>
              </div>
            ))}
          </div>
          <Label>RÉPARTITION PAR CONVERSATION</Label>
          <div className="card fi d2" style={{ overflow:"hidden" }}>
            {CONVERSATIONS.map((c,i)=>{
              const sz=JSON.stringify(c).length, pc=Math.round(sz/mem.d*100);
              return (
                <div key={c.id} style={{ display:"grid",gridTemplateColumns:"70px 1fr 50px 35px",padding:"8px 14px",borderBottom:i<CONVERSATIONS.length-1?"1px solid rgba(255,255,255,.03)":"none",alignItems:"center",gap:8 }}>
                  <span style={{ fontFamily:"'JetBrains Mono'",fontSize:10,color:"#5EEAD4" }}>{c.id}</span>
                  <div style={{ height:4,background:"#1C1C1F",borderRadius:2,overflow:"hidden" }}><div style={{ height:"100%",width:`${pc}%`,background:"#5EEAD4",borderRadius:2 }}/></div>
                  <span style={{ fontSize:9,fontFamily:"'JetBrains Mono'",color:"#71717A",textAlign:"right" }}>{(sz/1024).toFixed(1)}KB</span>
                  <span style={{ fontSize:9,fontFamily:"'JetBrains Mono'",color:"#3F3F46",textAlign:"right" }}>{pc}%</span>
                </div>
              );
            })}
          </div>
          <div className="card fi d3" style={{ padding:14,marginTop:14,borderColor:"rgba(234,179,8,.1)" }}>
            <div style={{ fontSize:10,fontFamily:"'JetBrains Mono'",color:"#EAB308",marginBottom:8,letterSpacing:".06em" }}>⚠️ STRATÉGIE SI SEUIL ATTEINT</div>
            {["Archiver anciennes CONV dans INDEX-DATA.md et retirer du JSX","Garder 5-8 conv les plus récentes dans le dashboard","Conversations archivées restent via INDEX-DATA.md","Demander à Claude de compacter les données"].map((s,i)=>(
              <div key={i} style={{ display:"flex",alignItems:"center",gap:6,padding:"2px 0",fontSize:11,color:"#A1A1AA" }}>
                <span style={{ width:4,height:4,borderRadius:"50%",background:"#EAB308",opacity:.5,flexShrink:0 }}/>{s}
              </div>
            ))}
          </div>
        </div>)}
      </div>
    </div>
  );
}
