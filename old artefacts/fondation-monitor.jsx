import { useState, useEffect, useCallback } from "react";

// ══════════════════════════════════════════════════════════════════════════════
// SYNCED FROM: FONDATION-CC-DATA.md | DATA_VERSION: 5 | LAST_SYNC: 2026-04-03
// RULE: MD = source of truth. Update MD first, sync JSX second.
// STORAGE: fondation-cc-v5 = runtime user state only (checkboxes, analysis)
// ══════════════════════════════════════════════════════════════════════════════

const DV = 5;

const SETUP = [
  {id:1,label:"Aligner app iOS cible",layer:"-",who:"Toi",done:false,blocker:true,src:"-"},
  {id:2,label:"Uploader fichiers Cowork",layer:"L1",who:"Toi",done:false,blocker:false,src:"CONV-02"},
  {id:3,label:"Installer BMAD v6",layer:"L3",who:"Toi (terminal)",done:false,blocker:false,src:"CONV-08"},
  {id:4,label:"Creer CLAUDE.md",layer:"L2",who:"Claude prepare",done:false,blocker:false,src:"CONV-08"},
  {id:5,label:"Configurer hooks",layer:"L2",who:"Claude prepare",done:false,blocker:false,src:"CONV-08"},
  {id:6,label:"Creer agents + skills",layer:"L3",who:"Claude prepare",done:false,blocker:false,src:"CONV-08"},
  {id:7,label:"Installer plugins",layer:"L4",who:"Toi (Claude Code)",done:false,blocker:false,src:"CONV-08"},
];

const LAYERS = [
  {id:"L1",label:"Cowork",color:"#5EEAD4",status:"Partiel",detail:"Projet existe. KB non uploadee."},
  {id:"L2",label:"Claude Code",color:"#A78BFA",status:"Non demarre",detail:"CLAUDE.md, hooks, agents a creer."},
  {id:"L3",label:"BMAD v6",color:"#F97316",status:"Non demarre",detail:"npx bmad-method install (terminal)."},
  {id:"L4",label:"MCP/Plugins",color:"#3B82F6",status:"Partiel",detail:"Notion, Figma, Asana, Slack OK."},
];

const PHASES = [
  {num:"00",label:"Validation",color:"#A78BFA",tasks:[
    {name:"Choisir app iOS cible",done:false,note:"BLOQUEUR"},{name:"Definir le probleme",done:false},
    {name:"Benchmark concurrents",done:false},{name:"Valider la demande",done:false},
    {name:"Landing page test",done:false},{name:"Go / No-go scorecard",done:false}]},
  {num:"01",label:"Design",color:"#5EEAD4",tasks:[
    {name:"Research UX",done:false},{name:"Architecture info",done:false},{name:"Wireframes lo-fi",done:false},
    {name:"UI Hi-fi + DS",done:false},{name:"Prototype interactif",done:false},{name:"Tests utilisateurs",done:false}]},
  {num:"02",label:"Architecture",color:"#F97316",tasks:[
    {name:"Choix stack (Swift6+SwiftUI+TCA)",done:true,note:"CONV-02"},{name:"Backend+BDD",done:false},
    {name:"Auth strategy",done:false},{name:"Paiements",done:false},{name:"CI/CD",done:false},{name:"ADR docs",done:false}]},
  {num:"03",label:"Dev",color:"#3B82F6",tasks:[
    {name:"Setup projet+DS",done:false},{name:"Auth+onboarding",done:false},{name:"Core features",done:false},
    {name:"Ecrans secondaires",done:false},{name:"Push+deep links",done:false},{name:"Polish UI",done:false}]},
  {num:"04",label:"Qualite",color:"#EAB308",tasks:[
    {name:"Tests unitaires",done:false},{name:"Tests UI",done:false},{name:"Perf audit",done:false},
    {name:"Accessibilite",done:false},{name:"Securite",done:false},{name:"Beta test",done:false}]},
  {num:"05",label:"Launch",color:"#22C55E",tasks:[
    {name:"ASO",done:false},{name:"Screenshots",done:false},{name:"Landing page",done:false},
    {name:"PR+presse",done:false},{name:"ProductHunt",done:false},{name:"Day-1 monitoring",done:false}]},
  {num:"06",label:"Monetisation",color:"#EC4899",tasks:[
    {name:"Modele pricing",done:false},{name:"Paywall UI",done:false},{name:"Gestion abos",done:false},
    {name:"Experimentation prix",done:false},{name:"Structure legale",done:false},{name:"Fiscalite",done:false}]},
  {num:"07",label:"Growth",color:"#94A3B8",tasks:[
    {name:"Analytics",done:false},{name:"Retention",done:false},{name:"Feature flags",done:false},
    {name:"Reviews",done:false},{name:"Referral",done:false},{name:"Monitoring prod",done:false}]},
];

const CONVS = [
  {id:"01",title:"Fondations",date:"04-02",items:["Regles","Vision","Claudify+BMAD","FONDATION_v0.md"],out:["FONDATION_v0.md"]},
  {id:"02",title:"Skills et workflow",date:"04-02",items:["18+ skills","Pipeline 8 phases","3 JSX","12 MD"],out:["ios-pipeline.jsx","project-index.jsx","conv-control.jsx"]},
  {id:"03",title:"Instructions",date:"04-02",items:["Live reload","Memories periodique","200K tokens"],out:[]},
  {id:"04",title:"DA Void Glass",date:"04-02",items:["13 divergences","Figtree+JBMono","Boilerplate"],out:["DA-VOID-GLASS.md","DA-EXTRACT.md"]},
  {id:"05",title:"Ideation",date:"04-03",items:["3 layers model","Questions fondatrices"],out:[]},
  {id:"06",title:"Monitoring",date:"04-03",items:["fondation-monitor.jsx","CTA API","Audit"],out:["fondation-monitor.jsx","CC-DATA.md"]},
  {id:"07",title:"Communication",date:"04-03",items:["centre-comm.jsx","Graphe SVG"],out:["centre-comm.jsx"]},
  {id:"08",title:"Plugins+framework",date:"04-03",items:["BMAD v6","4 couches","7 etapes"],out:["FRAMEWORKS.md"]},
  {id:"09",title:"Index projet",date:"04-03",items:["fondation_viewer.jsx","Audit inventions"],out:["fondation_viewer.jsx"]},
  {id:"10",title:"Orchestrateur",date:"04-03",items:["Etat des lieux","Blocage etape 01"],out:[]},
  {id:"11",title:"Ops",date:"04-03",items:["Scan artifacts","Question app cible"],out:[]},
];

const DECISIONS = [
  {id:1,title:"Cooperation > exploitation",src:"01",imp:"high"},
  {id:2,title:"Tracabilite totale",src:"01",imp:"high"},
  {id:3,title:"Plan evolutif",src:"01",imp:"medium"},
  {id:4,title:"Pipeline 8 phases",src:"02",imp:"high"},
  {id:5,title:"3 tiers budget",src:"02",imp:"medium"},
  {id:6,title:"12 fichiers KB",src:"02",imp:"medium"},
  {id:7,title:"Stack Swift6+Supabase",src:"02",imp:"high"},
  {id:8,title:"DA Void Glass",src:"04",imp:"medium"},
  {id:9,title:"Instructions live reload",src:"03",imp:"low"},
  {id:10,title:"Memories periodique",src:"03",imp:"low"},
  {id:11,title:"BMAD v6 + Claude Code",src:"08",imp:"high"},
  {id:12,title:"4 couches L1-L4",src:"08",imp:"high"},
  {id:13,title:"Etape 01 = app cible",src:"08",imp:"high"},
  {id:14,title:"CTA API auto-update",src:"06",imp:"medium"},
];

const INIT_RISKS = [
  {id:4,risk:"APP CIBLE NON DEFINIE",impact:"high",proba:"high",mit:"Choisir avant execution",status:"open"},
  {id:1,risk:"Dispersion infra avant app",impact:"medium",proba:"high",mit:"Limiter outillage",status:"open"},
  {id:3,risk:"Surengineering workflow",impact:"medium",proba:"medium",mit:"Phase 00 priorite",status:"open"},
  {id:2,risk:"Perte contexte sessions",impact:"medium",proba:"high",mit:"MD + storage + API",status:"mitigated"},
];

const DOCS = [
  {name:"ios-pipeline-dashboard.jsx",tp:"artifact",st:"complete",v:true,src:"02"},
  {name:"fondation-monitor.jsx",tp:"artifact",st:"active",v:true,src:"06"},
  {name:"project-index-dashboard.jsx",tp:"artifact",st:"complete",v:true,src:"02"},
  {name:"conversation-control.jsx",tp:"artifact",st:"complete",v:true,src:"02"},
  {name:"centre-communication.jsx",tp:"artifact",st:"complete",v:false,src:"07"},
  {name:"fondation_viewer.jsx",tp:"artifact",st:"complete",v:false,src:"09"},
  {name:"FONDATION_v0.md",tp:"doc",st:"draft",v:true,src:"01"},
  {name:"FONDATION-CC-DATA.md",tp:"doc",st:"active",v:true,src:"06"},
  {name:"FONDATION_FRAMEWORKS.md",tp:"doc",st:"complete",v:true,src:"08"},
  {name:"FONDATION_CENTRE.md",tp:"doc",st:"complete",v:true,src:"07"},
  {name:"DA-VOID-GLASS-CANONICAL.md",tp:"doc",st:"complete",v:true,src:"04"},
  {name:"DA-PIPELINE-EXTRACT.md",tp:"doc",st:"complete",v:true,src:"04"},
  {name:"PIPELINE.md",tp:"kb",st:"generated",v:false,src:"02"},
  {name:"BUDGET-SCENARIOS.md",tp:"kb",st:"generated",v:false,src:"02"},
  {name:"MONITORING.md",tp:"kb",st:"generated",v:false,src:"02"},
  {name:"EVOLUTION-ROADMAP.md",tp:"kb",st:"generated",v:false,src:"02"},
  {name:"SKILLS-MAP.md",tp:"kb",st:"generated",v:false,src:"02"},
  {name:"TOOLS-STACK.md",tp:"kb",st:"generated",v:false,src:"02"},
  {name:"CHECKLIST-LAUNCH.md",tp:"kb",st:"generated",v:false,src:"02"},
  {name:"JOURNAL.md",tp:"kb",st:"generated",v:false,src:"02"},
  {name:"SYNC-CHAT.md",tp:"kb",st:"generated",v:false,src:"02"},
  {name:"PROJECT-INSTRUCTIONS.md",tp:"kb",st:"generated",v:false,src:"02"},
  {name:"README-SETUP.md",tp:"kb",st:"generated",v:false,src:"02"},
];

// ══════════ STORAGE ══════════
const SK = "fondation-cc-v5";
async function sLoad() {
  try { const r = await window.storage.get(SK); return r ? JSON.parse(r.value) : null; }
  catch { try { await window.storage.delete(SK); } catch(_){} return null; }
}
async function sSave(d) {
  try { await window.storage.set(SK, JSON.stringify(d)); } catch(e) { console.error(e); }
}

// ══════════ API ══════════
async function apiAnalyze(st) {
  const parts = [];
  parts.push("Phases: " + st.phases.map(function(x) {
    const d = x.tasks.filter(function(t){ return t.done; }).length;
    return x.num + " " + x.label + ": " + Math.round(d / x.tasks.length * 100) + "%";
  }).join(", "));
  parts.push("Setup: " + st.setup.filter(function(s){ return s.done; }).length + "/" + st.setup.length);
  parts.push("Risques ouverts: " + st.risks.filter(function(r){ return r.status === "open"; }).length);
  parts.push("Decisions: " + DECISIONS.length + ", Conv: " + CONVS.length + ", Docs: " + DOCS.length);
  parts.push("Risques: " + st.risks.map(function(r){ return "[" + r.status + "] " + r.risk; }).join("; "));

  const sys = "Auditeur projet. JSON uniquement. Cles: health(sain|vigilance|attention|critique), healthNote(string), score(0-100), strengths(3 strings), warnings(array), suggestions(3 strings), nextPriority(string), phaseAdvice({current,next}), velocity(string).";
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, system: sys, messages: [{ role: "user", content: "Analyse: " + parts.join(". ") }] }),
  });
  if (!res.ok) throw new Error("API " + res.status);
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  const txt = (data.content || []).filter(function(b) { return b.type === "text"; }).map(function(b) { return b.text || ""; }).join("");
  const m = txt.match(/\{[\s\S]*\}/);
  if (!m) throw new Error("No JSON");
  return JSON.parse(m[0]);
}

// ══════════ STYLES ══════════
const S = {
  card: { background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.05)", borderRadius: 10, padding: 14, marginBottom: 10 },
  lbl: { fontSize: 10, fontFamily: "'JetBrains Mono',monospace", color: "#3F3F46", letterSpacing: ".08em", marginBottom: 8 },
  tag: function(c) { return { display: "inline-block", padding: "2px 8px", borderRadius: 4, fontSize: 10, fontFamily: "'JetBrains Mono',monospace", background: c + "15", color: c, fontWeight: 600 }; },
  bar: { height: 4, borderRadius: 2, background: "rgba(255,255,255,.04)", position: "relative", overflow: "hidden" },
  fill: function(w, c) { return { position: "absolute", top: 0, left: 0, height: "100%", width: w + "%", background: c, borderRadius: 2, transition: "width .4s" }; },
  chk: function(d) { return { width: 15, height: 15, borderRadius: 4, border: d ? "none" : "1.5px solid #3F3F46", background: d ? "#22C55E" : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }; },
};
const ic = function(i) { return i === "high" ? "#EF4444" : i === "medium" ? "#F97316" : "#22C55E"; };
const sc = function(s) { return s === "complete" || s === "mitigated" ? "#22C55E" : s === "active" ? "#5EEAD4" : s === "draft" ? "#EAB308" : s === "generated" ? "#F97316" : "#52525B"; };
const hcM = { sain: "#22C55E", vigilance: "#EAB308", attention: "#F97316", critique: "#EF4444" };

// ══════════ COMPONENT ══════════
export default function FondationCC() {
  const [ok, setOk] = useState(false);
  const [tab, setTab] = useState("cockpit");
  const [phases, setPhases] = useState(PHASES);
  const [setup, setSetup] = useState(SETUP);
  const [risks, setRisks] = useState(INIT_RISKS);
  const [expP, setExpP] = useState(null);
  const [azing, setAzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [aErr, setAErr] = useState(null);
  const [lastA, setLastA] = useState(null);
  const [stB, setStB] = useState(0);

  useEffect(function() {
    (async function() {
      const s = await sLoad();
      if (s && s.dv === DV) {
        if (s.phases) setPhases(s.phases);
        if (s.setup) setSetup(s.setup);
        if (s.risks) setRisks(s.risks);
        if (s.analysis) setAnalysis(s.analysis);
        if (s.lastA) setLastA(s.lastA);
      }
      setOk(true);
    })();
  }, []);

  const save = useCallback(async function(ph, su, ri, an, la) {
    const j = JSON.stringify({ dv: DV, phases: ph, setup: su, risks: ri, analysis: an, lastA: la });
    setStB(new Blob([j]).size);
    await sSave({ dv: DV, phases: ph, setup: su, risks: ri, analysis: an, lastA: la });
  }, []);

  useEffect(function() {
    if (ok) save(phases, setup, risks, analysis, lastA);
  }, [phases, setup, risks, analysis, lastA, ok, save]);

  // Computed
  const pp = function(p) { const d = p.tasks.filter(function(t) { return t.done; }).length; return Math.round(d / p.tasks.length * 100); };
  const tp = Math.round(phases.reduce(function(a, p) { return a + pp(p); }, 0) / phases.length);
  const tt = phases.reduce(function(a, p) { return a + p.tasks.length; }, 0);
  const dt = phases.reduce(function(a, p) { return a + p.tasks.filter(function(t) { return t.done; }).length; }, 0);
  const sd = setup.filter(function(s) { return s.done; }).length;
  const or_ = risks.filter(function(r) { return r.status === "open"; }).length;
  const hb = risks.some(function(r) { return r.impact === "high" && r.status === "open"; });
  const hc = analysis ? analysis.health : (hb ? "attention" : or_ > 0 ? "vigilance" : "sain");

  const tgTask = function(pi, ti) { setPhases(function(pr) { return pr.map(function(p, i) { if (i !== pi) return p; return { ...p, tasks: p.tasks.map(function(t, j) { return j === ti ? { ...t, done: !t.done } : t; }) }; }); }); };
  const tgSetup = function(i) { setSetup(function(pr) { return pr.map(function(s, j) { return j === i ? { ...s, done: !s.done } : s; }); }); };
  const tgRisk = function(i) { setRisks(function(pr) { return pr.map(function(r, j) { return j === i ? { ...r, status: r.status === "open" ? "mitigated" : "open" } : r; }); }); };
  const doA = async function() { setAzing(true); setAErr(null); try { const r = await apiAnalyze({ phases, setup, risks }); setAnalysis(r); setLastA(new Date().toISOString()); } catch(e) { setAErr(e.message); } setAzing(false); };
  const rst = function() { if (!confirm("Reset?")) return; setPhases(PHASES); setSetup(SETUP); setRisks(INIT_RISKS); setAnalysis(null); setLastA(null); };

  if (!ok) {
    return <div style={{ background: "#06070C", color: "#52525B", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "monospace" }}>Chargement...</div>;
  }

  const tabList = [
    { id: "cockpit", l: "Cockpit" },
    { id: "setup", l: "Setup" },
    { id: "phases", l: "Phases" },
    { id: "timeline", l: "Timeline" },
    { id: "inventaire", l: "Inventaire" },
    { id: "analyse", l: "Analyse" },
  ];

  return (
    <div style={{ fontFamily: "'Figtree',system-ui,sans-serif", background: "#06070C", color: "#D4D4D8", minHeight: "100vh", position: "relative", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Figtree:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:3px}
        ::-webkit-scrollbar-thumb{background:rgba(94,234,212,.15);border-radius:4px}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
        @keyframes spin{to{transform:rotate(360deg)}}
        .orb{position:absolute;border-radius:50%;filter:blur(80px);opacity:.1;pointer-events:none}
        .hov:hover{border-color:rgba(94,234,212,.12)!important}
        .cta{box-shadow:0 0 0 1px rgba(94,234,212,.15),0 0 24px rgba(94,234,212,.08);transition:all .2s}
        .cta:hover{box-shadow:0 0 0 1px rgba(94,234,212,.3),0 0 32px rgba(94,234,212,.15)}
      `}</style>
      <div className="orb" style={{ width: 280, height: 280, background: "#A78BFA", top: -80, right: -60 }}></div>
      <div className="orb" style={{ width: 200, height: 200, background: "#5EEAD4", bottom: "30%", left: -50 }}></div>

      {/* HEADER */}
      <div style={{ position: "relative", zIndex: 2, padding: "16px 20px 0", borderBottom: "1px solid rgba(255,255,255,.04)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: hcM[hc] || "#52525B", animation: "pulse 3s infinite" }}></span>
          <span style={{ fontSize: 17, fontWeight: 700, color: "#FAFAFA", letterSpacing: "-.02em" }}>Fondation Control Center</span>
          <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 9, color: "#3F3F46" }}>DATA v{DV}</span>
        </div>
        <div style={{ fontSize: 10, color: "#52525B", marginBottom: 8 }}>
          {dt}/{tt} taches | {sd}/7 setup | {CONVS.length} conv | {DECISIONS.length} ADR | {or_} risques ouverts
        </div>
        <div style={{ display: "flex", gap: 0, overflowX: "auto" }}>
          {tabList.map(function(t) {
            return <button key={t.id} onClick={function() { setTab(t.id); }} style={{ background: "none", border: "none", borderBottom: tab === t.id ? "2px solid #5EEAD4" : "2px solid transparent", padding: "6px 12px 9px", cursor: "pointer", color: tab === t.id ? "#FAFAFA" : "#52525B", fontSize: 11, fontWeight: 500, fontFamily: "'Figtree'", whiteSpace: "nowrap" }}>{t.l}</button>;
          })}
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ position: "relative", zIndex: 2, padding: 18 }}>

        {/* ═══ COCKPIT ═══ */}
        {tab === "cockpit" && (
          <div>
            {/* Blocker */}
            {hb && (
              <div style={{ ...S.card, borderColor: "rgba(239,68,68,.2)", background: "rgba(239,68,68,.04)", display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 18 }}>🔴</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#EF4444" }}>BLOQUEUR : App iOS cible non definie</div>
                  <div style={{ fontSize: 10, color: "#71717A" }}>Aucune phase ne peut avancer. (CONV-08, 10, 11)</div>
                </div>
              </div>
            )}
            {/* Metrics */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 10 }}>
              {[
                { l: "PIPELINE", v: tp + "%", c: "#5EEAD4", s: dt + "/" + tt },
                { l: "SETUP", v: sd + "/7", c: "#A78BFA", s: Math.round(sd / 7 * 100) + "%" },
                { l: "SANTE", v: hc.toUpperCase(), c: hcM[hc], s: or_ + " risques ouverts" },
                { l: "ADR", v: "" + DECISIONS.length, c: "#F97316", s: DECISIONS.filter(function(d) { return d.imp === "high"; }).length + " high" },
              ].map(function(m, i) {
                return (
                  <div key={i} className="hov" style={S.card}>
                    <div style={S.lbl}>{m.l}</div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: m.c, fontFamily: "'JetBrains Mono'", lineHeight: 1 }}>{m.v}</div>
                    <div style={{ fontSize: 9, color: "#52525B", marginTop: 3 }}>{m.s}</div>
                  </div>
                );
              })}
            </div>
            {/* Phase strip */}
            <div className="hov" style={S.card}>
              <div style={S.lbl}>PHASES</div>
              <div style={{ display: "flex", gap: 5 }}>
                {phases.map(function(p) {
                  const pr = pp(p);
                  return (
                    <div key={p.num} style={{ flex: 1, textAlign: "center" }}>
                      <div style={{ fontSize: 8, color: "#3F3F46", fontFamily: "'JetBrains Mono'", marginBottom: 2 }}>{p.num}</div>
                      <div style={{ ...S.bar, height: 5, borderRadius: 3 }}><div style={{ ...S.fill(pr, p.color), borderRadius: 3, height: 5 }}></div></div>
                      <div style={{ fontSize: 7, color: pr > 0 ? p.color : "#1C1C1F", marginTop: 1, fontFamily: "'JetBrains Mono'" }}>{pr}%</div>
                    </div>
                  );
                })}
              </div>
            </div>
            {/* Setup progress */}
            <div className="hov" style={S.card}>
              <div style={S.lbl}>SETUP ({sd}/7)</div>
              <div style={{ ...S.bar, height: 6, borderRadius: 3, marginBottom: 8 }}><div style={{ ...S.fill(Math.round(sd / 7 * 100), "#A78BFA"), borderRadius: 3, height: 6 }}></div></div>
              {setup.map(function(s, i) {
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 7, padding: "3px 0", fontSize: 11 }}>
                    <span style={{ color: s.done ? "#22C55E" : s.blocker ? "#EF4444" : "#3F3F46", fontSize: 10 }}>{s.done ? "✓" : s.blocker ? "●" : "○"}</span>
                    <span style={{ color: s.done ? "#52525B" : "#D4D4D8", textDecoration: s.done ? "line-through" : "none", flex: 1 }}>{s.label}</span>
                    <span style={{ fontSize: 8, fontFamily: "'JetBrains Mono'", color: "#27272A" }}>{s.layer}</span>
                  </div>
                );
              })}
            </div>
            {/* Layers */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 6 }}>
              {LAYERS.map(function(l) {
                return (
                  <div key={l.id} className="hov" style={{ ...S.card, borderLeft: "3px solid " + l.color, marginBottom: 0 }}>
                    <div style={{ fontSize: 10, fontWeight: 600, color: l.color, fontFamily: "'JetBrains Mono'", marginBottom: 2 }}>{l.id}</div>
                    <div style={{ fontSize: 11, fontWeight: 500, color: "#FAFAFA" }}>{l.label}</div>
                    <div style={{ fontSize: 9, color: "#52525B", marginTop: 1 }}>{l.status}</div>
                  </div>
                );
              })}
            </div>
            <div style={{ textAlign: "right", marginTop: 6 }}>
              <button onClick={rst} style={{ background: "transparent", border: "1px solid rgba(239,68,68,.12)", borderRadius: 4, padding: "2px 8px", color: "#EF4444", fontSize: 9, cursor: "pointer" }}>Reset</button>
            </div>
          </div>
        )}

        {/* ═══ SETUP ═══ */}
        {tab === "setup" && (
          <div>
            <div style={S.lbl}>7 ETAPES — Source: FONDATION_FRAMEWORKS.md (CONV-08)</div>
            {setup.map(function(s, i) {
              return (
                <div key={i} className="hov" style={{ ...S.card, borderLeft: "3px solid " + (s.done ? "#22C55E" : s.blocker ? "#EF4444" : "rgba(255,255,255,.05)"), display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={function() { tgSetup(i); }}>
                  <div style={S.chk(s.done)}>{s.done && <span style={{ color: "#fff", fontSize: 8 }}>✓</span>}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 500, color: s.done ? "#52525B" : "#FAFAFA", textDecoration: s.done ? "line-through" : "none" }}>{s.label}</div>
                    <div style={{ fontSize: 9, color: "#3F3F46" }}>Qui: {s.who} | {s.src}</div>
                  </div>
                  <span style={S.tag(s.blocker ? "#EF4444" : s.done ? "#22C55E" : "#52525B")}>{s.blocker ? "BLOQUEUR" : s.done ? "FAIT" : "A FAIRE"}</span>
                </div>
              );
            })}
            <div style={{ marginTop: 14 }}>
              <div style={S.lbl}>4 COUCHES</div>
              {LAYERS.map(function(l) {
                return (
                  <div key={l.id} className="hov" style={{ ...S.card, borderLeft: "3px solid " + l.color }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 11, color: l.color, fontWeight: 600 }}>{l.id}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#FAFAFA" }}>{l.label}</span>
                      <span style={S.tag(l.status === "Partiel" ? "#EAB308" : "#52525B")}>{l.status}</span>
                    </div>
                    <div style={{ fontSize: 11, color: "#71717A", marginTop: 3 }}>{l.detail}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══ PHASES ═══ */}
        {tab === "phases" && (
          <div>
            {phases.map(function(p, pi) {
              const pr = pp(p);
              return (
                <div key={p.num} className="hov" style={{ ...S.card, borderLeft: "3px solid " + (pr === 100 ? "#22C55E" : pr > 0 ? p.color : "rgba(255,255,255,.03)") }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }} onClick={function() { setExpP(expP === pi ? null : pi); }}>
                    <span style={{ fontSize: 10 }}>{pr === 100 ? "🟢" : pr > 0 ? "🟡" : "⬜"}</span>
                    <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 10, color: p.color }}>{p.num}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#FAFAFA", flex: 1 }}>{p.label}</span>
                    <span style={S.tag(p.color)}>{pr}%</span>
                    <span style={{ fontSize: 10, color: "#3F3F46", transform: expP === pi ? "rotate(180deg)" : "none", transition: "transform .2s" }}>▼</span>
                  </div>
                  <div style={{ ...S.bar, marginTop: 6, height: 3 }}><div style={{ ...S.fill(pr, p.color), height: 3 }}></div></div>
                  {expP === pi && (
                    <div style={{ marginTop: 10, paddingTop: 8, borderTop: "1px solid rgba(255,255,255,.04)" }}>
                      {p.tasks.map(function(t, ti) {
                        return (
                          <div key={ti} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0", cursor: "pointer" }} onClick={function() { tgTask(pi, ti); }}>
                            <div style={S.chk(t.done)}>{t.done && <span style={{ color: "#fff", fontSize: 8 }}>✓</span>}</div>
                            <span style={{ fontSize: 11, color: t.done ? "#52525B" : "#D4D4D8", textDecoration: t.done ? "line-through" : "none", flex: 1 }}>{t.name}</span>
                            {t.note && <span style={{ fontSize: 8, fontFamily: "'JetBrains Mono'", color: t.note === "BLOQUEUR" ? "#EF4444" : "#3F3F46" }}>{t.note}</span>}
                          </div>
                        );
                      })}
                      <div style={{ fontSize: 9, color: "#3F3F46", marginTop: 4, fontFamily: "'JetBrains Mono'" }}>{p.tasks.filter(function(t) { return t.done; }).length}/{p.tasks.length}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ═══ TIMELINE ═══ */}
        {tab === "timeline" && (
          <div>
            <div style={S.lbl}>{CONVS.length} CONVERSATIONS</div>
            <div style={{ position: "relative", paddingLeft: 18 }}>
              <div style={{ position: "absolute", left: 5, top: 8, bottom: 8, width: 1, background: "rgba(94,234,212,.1)" }}></div>
              {CONVS.map(function(c) {
                return (
                  <div key={c.id} style={{ position: "relative", padding: "8px 0" }}>
                    <div style={{ position: "absolute", left: -15, top: 14, width: 6, height: 6, borderRadius: "50%", background: "#5EEAD4", border: "2px solid #06070C" }}></div>
                    <div className="hov" style={{ ...S.card, marginBottom: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                        <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 9, color: "#5EEAD4" }}>CONV-{c.id}</span>
                        <span style={{ fontSize: 12, fontWeight: 600, color: "#FAFAFA", flex: 1 }}>{c.title}</span>
                        <span style={{ fontSize: 9, fontFamily: "'JetBrains Mono'", color: "#27272A" }}>{c.date}</span>
                      </div>
                      {c.items.map(function(it, j) { return <div key={j} style={{ fontSize: 10, color: "#A1A1AA", paddingLeft: 14 }}>· {it}</div>; })}
                      {c.out.length > 0 && (
                        <div style={{ display: "flex", gap: 3, flexWrap: "wrap", marginTop: 4 }}>
                          {c.out.map(function(o, j) { return <span key={j} style={{ ...S.tag("#5EEAD4"), fontSize: 8 }}>{o}</span>; })}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══ INVENTAIRE ═══ */}
        {tab === "inventaire" && (
          <div>
            <div style={S.lbl}>{DOCS.length} FICHIERS ({DOCS.filter(function(d) { return d.v; }).length} verifies)</div>
            {[{ k: "artifact", l: "ARTIFACTS JSX" }, { k: "doc", l: "DOCUMENTS MD" }, { k: "kb", l: "KNOWLEDGE BASE (non verifies)" }].map(function(cat) {
              const items = DOCS.filter(function(d) { return d.tp === cat.k; });
              return (
                <div key={cat.k} style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 9, fontFamily: "'JetBrains Mono'", color: "#52525B", marginBottom: 4 }}>{cat.l} ({items.length})</div>
                  {items.map(function(d, i) {
                    return (
                      <div key={i} className="hov" style={{ ...S.card, display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", marginBottom: 2 }}>
                        <span style={{ fontSize: 9, color: d.v ? "#22C55E" : "#F97316", minWidth: 12 }}>{d.v ? "✓" : "?"}</span>
                        <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono'", color: "#FAFAFA", flex: 1 }}>{d.name}</span>
                        <span style={S.tag(sc(d.st))}>{d.st}</span>
                        <span style={{ fontSize: 8, fontFamily: "'JetBrains Mono'", color: "#5EEAD4" }}>CONV-{d.src}</span>
                      </div>
                    );
                  })}
                </div>
              );
            })}
            {/* Decisions */}
            <div style={S.lbl}>DECISIONS ({DECISIONS.length})</div>
            {DECISIONS.map(function(d) {
              return (
                <div key={d.id} className="hov" style={{ ...S.card, display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", marginBottom: 2 }}>
                  <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 8, color: "#3F3F46", minWidth: 20 }}>#{String(d.id).padStart(2, "0")}</span>
                  <span style={{ fontSize: 11, color: "#FAFAFA", flex: 1 }}>{d.title}</span>
                  <span style={S.tag(ic(d.imp))}>{d.imp}</span>
                  <span style={{ fontSize: 8, fontFamily: "'JetBrains Mono'", color: "#5EEAD4" }}>CONV-{d.src}</span>
                </div>
              );
            })}
            {/* Risks */}
            <div style={{ ...S.lbl, marginTop: 12 }}>RISQUES ({risks.length})</div>
            {risks.map(function(r, i) {
              return (
                <div key={i} className="hov" style={{ ...S.card, borderLeft: "3px solid " + ic(r.impact), display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", marginBottom: 2 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, fontWeight: 500, color: "#FAFAFA" }}>{r.risk}</div>
                    <div style={{ fontSize: 9, color: "#71717A" }}>{r.mit}</div>
                  </div>
                  <span style={S.tag(ic(r.impact))}>{r.impact}</span>
                  <button onClick={function() { tgRisk(i); }} style={{ background: "transparent", border: "1px solid " + (r.status === "open" ? "#EAB30820" : "#22C55E20"), borderRadius: 4, padding: "2px 6px", color: r.status === "open" ? "#EAB308" : "#22C55E", fontSize: 9, cursor: "pointer" }}>{r.status}</button>
                </div>
              );
            })}
          </div>
        )}

        {/* ═══ ANALYSE ═══ */}
        {tab === "analyse" && (
          <div>
            {/* CTA */}
            <div style={{ ...S.card, borderColor: "rgba(94,234,212,.1)", padding: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <button className="cta" disabled={azing} onClick={doA} style={{ background: azing ? "rgba(94,234,212,.05)" : "rgba(94,234,212,.08)", border: "1px solid rgba(94,234,212,.2)", borderRadius: 8, padding: "9px 20px", cursor: azing ? "wait" : "pointer", color: "#5EEAD4", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 6, opacity: azing ? 0.7 : 1 }}>
                  {azing ? <span style={{ width: 12, height: 12, border: "2px solid #5EEAD430", borderTopColor: "#5EEAD4", borderRadius: "50%", animation: "spin .8s linear infinite", display: "inline-block" }}></span> : <span>🤖</span>}
                  {azing ? "..." : "Auto-analyse"}
                </button>
                <div>
                  <div style={{ fontSize: 11, color: "#A1A1AA" }}>Envoie l etat a Claude API</div>
                  {lastA && <div style={{ fontSize: 9, fontFamily: "'JetBrains Mono'", color: "#3F3F46" }}>Derniere: {new Date(lastA).toLocaleString("fr-FR")}</div>}
                </div>
              </div>
              {aErr && <div style={{ marginTop: 8, padding: "5px 8px", background: "rgba(239,68,68,.06)", borderRadius: 6, fontSize: 10, color: "#EF4444" }}>{aErr}</div>}
              {analysis && (
                <div style={{ marginTop: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", background: (hcM[analysis.health] || "#52525B") + "08", border: "1px solid " + (hcM[analysis.health] || "#52525B") + "20", borderRadius: 8, marginBottom: 10 }}>
                    <div style={{ fontSize: 24, fontWeight: 700, color: hcM[analysis.health], fontFamily: "'JetBrains Mono'" }}>{analysis.score != null ? analysis.score : "-"}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "#FAFAFA" }}>{(analysis.health || "").toUpperCase()}</div>
                      <div style={{ fontSize: 10, color: "#71717A" }}>{analysis.healthNote}</div>
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 10 }}>
                    {[{ t: "FORCES", c: "#22C55E", d: analysis.strengths }, { t: "ALERTES", c: "#F97316", d: analysis.warnings }, { t: "ACTIONS", c: "#5EEAD4", d: analysis.suggestions }].map(function(col, ci) {
                      return (
                        <div key={ci} style={{ ...S.card, borderColor: col.c + "15", marginBottom: 0 }}>
                          <div style={{ fontSize: 9, fontFamily: "'JetBrains Mono'", color: col.c, marginBottom: 4 }}>{col.t}</div>
                          {(col.d || []).map(function(s, si) { return <div key={si} style={{ fontSize: 10, color: "#A1A1AA", padding: "1px 0" }}><span style={{ color: col.c }}>› </span>{s}</div>; })}
                          {(!col.d || !col.d.length) && <div style={{ fontSize: 9, color: "#3F3F46" }}>—</div>}
                        </div>
                      );
                    })}
                  </div>
                  {analysis.nextPriority && (
                    <div style={{ ...S.card, borderColor: "#EF444415" }}>
                      <div style={{ fontSize: 9, fontFamily: "'JetBrains Mono'", color: "#EF4444", marginBottom: 3 }}>PRIORITE #1</div>
                      <div style={{ fontSize: 12, color: "#FAFAFA", fontWeight: 500 }}>{analysis.nextPriority}</div>
                    </div>
                  )}
                </div>
              )}
            </div>
            {/* Memory */}
            <div className="hov" style={{ ...S.card, marginTop: 6 }}>
              <div style={S.lbl}>MEMOIRE</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                {[
                  { l: "STORAGE", v: (stB / 1024).toFixed(1) + "KB", p: Math.min(stB / (5 * 1024 * 1024) * 100, 100) },
                  { l: "JSX", v: "~480 lig.", p: 480 / 1500 * 100 },
                  { l: "DATA", v: (CONVS.length + DECISIONS.length + DOCS.length) + " items", p: Math.min((CONVS.length + DECISIONS.length + DOCS.length) / 200 * 100, 100) },
                ].map(function(g, i) {
                  const gc = g.p > 80 ? "#EF4444" : g.p > 50 ? "#F97316" : "#22C55E";
                  return (
                    <div key={i}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                        <span style={{ fontSize: 8, fontFamily: "'JetBrains Mono'", color: "#52525B" }}>{g.l}</span>
                        <span style={{ fontSize: 8, fontFamily: "'JetBrains Mono'", color: gc, fontWeight: 600 }}>{g.v}</span>
                      </div>
                      <div style={{ ...S.bar, height: 4, borderRadius: 2 }}><div style={{ ...S.fill(g.p, gc), borderRadius: 2, height: 4 }}></div></div>
                    </div>
                  );
                })}
              </div>
            </div>
            {/* Sync rule */}
            <div style={{ ...S.card, borderColor: "rgba(249,115,22,.08)" }}>
              <div style={S.lbl}>REGLE SYNC MD / JSX</div>
              {["FONDATION-CC-DATA.md = source de verite", "fondation-monitor.jsx = controleur UI", "MD d abord, JSX ensuite", "DATA_VERSION bump a chaque modif", "Storage = runtime uniquement (checkboxes, analyse)", "Si JSX perdu, MD reconstruit tout"].map(function(l, i) {
                return <div key={i} style={{ fontSize: 10, color: "#71717A", padding: "2px 0" }}><span style={{ color: "#5EEAD4" }}>› </span>{l}</div>;
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
