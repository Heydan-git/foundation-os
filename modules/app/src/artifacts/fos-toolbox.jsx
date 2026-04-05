import { useState } from "react";
const C={bg:"#06070C",ac:"#5EEAD4",cd:"rgba(255,255,255,.025)",bd:"rgba(255,255,255,.055)",tx:"rgba(255,255,255,.88)",mt:"rgba(255,255,255,.42)",gn:"#22C55E",or:"#F97316",rd:"#EF4444",pu:"#A78BFA",bl:"#3B82F6",pk:"#EC4899",yl:"#EAB308"};

// ══════════════════════════════════════════════════════════════
// VOLET 1 — 🚀 CRÉER DES APPS (10 use cases)
// ══════════════════════════════════════════════════════════════
const OPS=[
  {i:"🤖",t:"Dis-moi ce que tu veux réaliser",
   w:"N'importe quel objectif — Claude compose un workflow sur mesure.",
   ex:"\"App de suivi sportif\" · \"Refonds l'architecture\" · \"Brainstorm monétisation\"",
   steps:[
     {a:"Décris ton objectif en langage naturel",tl:"Pas besoin de connaître les outils",d:"Claude identifie domaine, complexité, contraintes et outils pertinents parmi 250+."},
     {a:"Claude compose le workflow optimal",tl:"250+ outils · 28 skills · 15 MCP · 12 BMAD · 17 agents",d:"Sélection outils → séquencement → estimation effort → identification cascades (MD→JSX→Notion→Asana)."},
     {a:"Mode 6 — validation avant exécution",tl:"📍 Workflow → 🎯 Étapes → ❓ Tu valides ?",d:"Workflow complet présenté. RIEN ne démarre sans OK."},
     {a:"Exécution avec adaptation temps réel",tl:"Context7 · edge-case-hunter · FOS-ERROR-LOG",d:"Blocage → pivot outil. Erreur → log + leçon CLAUDE.md. Itération → RALPH Loop auto."},
   ]},
  {i:"🎯",t:"Je veux créer une nouvelle app",
   w:"Projet from scratch — app, feature, produit.",
   ex:"\"App de suivi santé\" · \"Nouveau projet e-commerce\"",
   steps:[
     {a:"Créer la structure projet",tl:"/new-project · @os-architect",d:"projects/[nom]/ → CONTEXT + JOURNAL + BACKLOG · sync Asana auto."},
     {a:"Clarifier le besoin",tl:"/deep-interview · bmad-advanced-elicitation",d:"Questioning socratique + scoring ambiguïté. 50 méthodes d'élicitation. Appliquer APRÈS un draft. Brief structuré anti-angle-mort."},
     {a:"Analyser marché et stakeholders",tl:"BMAD @analyst (Mary) · product-design-uxui",d:"PRD : personas, empathy map, journeys, besoins → project-context.md."},
     {a:"Décider la stack technique",tl:"@os-architect · specialiste-ai · Context7 MCP",d:"ADR documenté. Context7 : resolve-library-id → get-library-docs. 1000+ libs, cache 10ms."},
   ]},
  {i:"💡",t:"J'ai besoin d'explorer des idées",
   w:"Idéation, exploration, résolution de problème.",
   ex:"\"Comment monétiser ?\" · \"10 approches onboarding\"",
   steps:[
     {a:"Brainstorm structuré",tl:"bmad-brainstorming · 62 techniques · 9 catégories",d:"5 phases : clarify→rapid-fire→organize→prioritize→synthesize. Anti-biais shift/10. Output = session-doc réutilisable."},
     {a:"Table ronde multi-agents",tl:"bmad-party-mode · 5+ agents",d:"BMad Master sélectionne 2-3 agents/msg. Débat libre ou structuré → consensus documenté."},
     {a:"Challenge adversarial",tl:"bmad-review-adversarial · edge-case-hunter",d:"Adversarial : 10+ failles, posture cynique. Edge case : trace JSON exhaustive. Couverture orthogonale."},
     {a:"Distiller le résultat",tl:"bmad-distillator · compression lossless",d:"Analyze→Compress→Verify→Validate. ~90% économie tokens. --validate pour round-trip."},
   ]},
  {i:"🎨",t:"Je veux designer l'interface",
   w:"Maquettes, wireframes, UI/UX, tokens, design system.",
   ex:"\"Design le dashboard\" · \"Crée les composants DS\"",
   steps:[
     {a:"Recherche UX",tl:"ux-ergonome · product-design-uxui · hierarchie-information",d:"Heuristiques Nielsen, lois UX (Fitts, Hick, Jakob, Miller). Cognitive walkthrough, card sorting."},
     {a:"Direction artistique",tl:"da-direction-artistique · Void Glass DS",d:"#06070C / #5EEAD4, Figtree, JetBrains Mono. Cards .025, orbes blur(80px), radii 12/8/6px."},
     {a:"Maquettes et prototypage",tl:"Figma MCP (16 cmd) · Pencil (15 cmd) · ui-expert",d:"Figma : get_design_context → get_screenshot → get_metadata → assets → implémenter. Pencil : batch_design + snapshot_layout."},
     {a:"Design System et tokens",tl:"design-system-manager · Figma Code Connect",d:"Tokens → composants → documentation → CI/CD. Multi-plateforme. Storybook, Style Dictionary."},
     {a:"Microcopy",tl:"copywriter-ux · bmad-editorial-review-prose",d:"Tone of voice, labels, erreurs, CTA, tooltips, empty states. Microsoft Writing Style baseline."},
   ]},
  {i:"🏗️",t:"Quelle architecture choisir ?",
   w:"Décisions techniques : schéma DB, patterns, ADR.",
   ex:"\"SQL ou NoSQL ?\" · \"Structurer les tables Supabase ?\"",
   steps:[
     {a:"Évaluer les options",tl:"@os-architect · BMAD @architect · specialiste-ai",d:"Comparaison multi-critères. ADR formel : contexte, décision, rationale, alternatives rejetées."},
     {a:"Modéliser la BDD",tl:"database-architect · Supabase SDK direct",d:"Tables, relations, RLS, indexes, migrations, seed. Pas de backend custom."},
     {a:"Review adversarial",tl:"bmad-review-adversarial · edge-case-hunter",d:"10+ failles. Edge cases JSON. Couvre scaling, sécurité, maintenabilité."},
     {a:"Documenter",tl:"@doc-agent · FOS-COMMANDER · FOS-JOURNAL",d:"ADR numéroté → Commander → Journal → Notion."},
   ]},
  {i:"⚡",t:"Je code la feature",
   w:"Développer, coder React/Swift/API.",
   ex:"\"Code le login\" · \"Intègre Supabase\" · \"Scaffold le projet\"",
   steps:[
     {a:"Doc à jour (anti-hallucination)",tl:"Context7 MCP",d:"resolve-library-id → get-library-docs. 1000+ libs. Cache ~10ms. SYSTÉMATIQUE avant tout code externe."},
     {a:"Coder avec les bons agents",tl:"@dev-agent · fullstack-dev · ios-dev · Shinpr recipes",d:"@dev-agent (Void Glass obligatoire). Shinpr: implement, fullstack-implement, diagnose. OMC team pour multi-agent."},
     {a:"Mode autonome si simple",tl:"autopilot · smart routing Haiku/Sonnet/Opus",d:"Haiku ~60% tâches (économie 30-50%). Auto-resume sur rate limit. Checkpoints .omc/state/."},
     {a:"Outils natifs",tl:"Read · Write · Edit · Bash · Glob · Grep · Agent",d:"Read (texte/image/PDF). Bash (shell, git, npm). Agent (sous-agents Explore/Plan)."},
   ]},
  {i:"🧪",t:"C'est prêt ? Vérifie tout",
   w:"QA, tests, accessibilité, sécurité, audit.",
   ex:"\"Vérifie avant deploy\" · \"Audit accessibilité\"",
   steps:[
     {a:"Review R1-R8",tl:"@review-agent · /sync",d:"R1 taille, R2 régression, R3 DA, R4 MD pairs, R5 stack, R6 notations, R7 versions, R8 storage keys."},
     {a:"Tests et edge cases",tl:"qa-specialist · edge-case-hunter",d:"Pyramide unit→integration→E2E. Edge cases JSON : trigger + guard + consequence."},
     {a:"Accessibilité",tl:"a11y-specialist · audit-ux-complet",d:"WCAG 2.1/2.2, RGAA 4.1. Contraste, clavier, screen reader, ARIA."},
     {a:"Sécurité",tl:"security-engineer · bmad-review-adversarial",d:"OWASP Top 10, XSS, CSRF, injection. Auth, CORS, CSP, RLS, rate limiting."},
     {a:"Audit UX (10 axes)",tl:"audit-ux-complet · scoring RICE",d:"UX, UI, hiérarchie, a11y, DS, dark patterns, microcopy, motion, perf, trust. Score 0-10."},
   ]},
  {i:"✍️",t:"Le texte est pas clair, améliore",
   w:"Rédaction, editorial review, documentation.",
   ex:"\"Review la doc\" · \"Améliore les textes app\"",
   steps:[
     {a:"Review prose",tl:"bmad-editorial-review-prose",d:"Ambiguïtés, ton, communication. Tableau Original|Revised|Changes. Microsoft Writing Style."},
     {a:"Review structure",tl:"bmad-editorial-review-structure",d:"5 modèles (Tutorial, Reference, Explanation, Prompt, Pyramid). reader_type: humans ou llm."},
     {a:"Co-rédaction",tl:"doc-coauthoring · @doc-agent",d:"Transfert contexte → plan → rédaction → itérations → vérification."},
     {a:"Compression",tl:"bmad-distillator",d:"Lossless. Fan-out si >5K tokens (bmad-shard-doc). ~90% économie."},
   ]},
  {i:"🚀",t:"Mets en prod",
   w:"Déployer, publier, CI/CD.",
   ex:"\"Deploy Vercel\" · \"Publie App Store\"",
   steps:[
     {a:"Build et deploy web",tl:"devops-specialist · Vercel auto-deploy",d:"npm run build. Conventional commit. Push → preview → production."},
     {a:"Publier stores",tl:"app-store-publisher · Fastlane · TestFlight",d:"Signing, screenshots, metadata, ASO. Staged rollout. ATT, RGPD."},
     {a:"Infra et automation",tl:"devops-specialist · n8n-specialist",d:"Docker, CI/CD, GitHub Actions. Alertes, logs. Automatisations n8n."},
   ]},
  {i:"📊",t:"Comment ça performe ?",
   w:"Métriques, feedback, itérations.",
   ex:"\"Analyse KPIs\" · \"Update la roadmap\"",
   steps:[
     {a:"Analyser les données",tl:"data-analyst · Supabase queries",d:"SQL, pandas, plotly. KPIs, cohortes, funnels, rétention, LTV, segmentation RFM."},
     {a:"Audit UX terrain",tl:"audit-ux-complet · ux-ergonome",d:"Score 0-10 sur 10 axes. RICE. Before/after + sprint planning."},
     {a:"Sync suivi projet",tl:"Asana · Notion · Monday · ClickUp",d:"Tasks, statuts, roadmap, reporting via MCP."},
     {a:"Planifier itérations",tl:"product-design-uxui · @os-architect · FOS-MONITORING",d:"Prioriser → backlog → sprint → ADR si structurant."},
   ]},
];

// ══════════════════════════════════════════════════════════════
// VOLET 2 — 🔧 PILOTER L'OS (12 use cases)
// ══════════════════════════════════════════════════════════════
const MNT=[
  {i:"🤖",t:"Dis-moi ce que tu veux faire sur l'OS",
   w:"N'importe quelle action sur Foundation OS — Claude compose le workflow.",
   ex:"\"Mets à jour le monitoring\" · \"Audite tout\" · \"Sync Notion\"",
   steps:[
     {a:"Décris l'action souhaitée",tl:"Langage naturel",d:"Claude sélectionne parmi 250+ outils : commandes, agents, MCP, BMAD, skills."},
     {a:"Claude compose le workflow",tl:"Toolbox · dépendances · cascades · MD first · R1-R8",d:"Séquence optimale respectant toutes les règles Foundation OS."},
     {a:"Mode 6 — validation",tl:"📍 Workflow → 🎯 Étapes → ❓ Tu valides ?",d:"Chaque outil, fichier impacté, cascade listés. Exécution après OK."},
     {a:"Exécution + RALPH si itératif",tl:"Étape par étape · RALPH Loop auto",d:"Si multi-cycles → RALPH (Read→Analyze→Learn→Propose→Harmonize)."},
   ]},
  {i:"📍",t:"On reprend, on en est où ?",
   w:"Ouvrir une session de travail.",
   ex:"\"On reprend\" · \"C'est quoi l'état ?\"",
   steps:[
     {a:"Charger le contexte",tl:"/session-start · foundation-os-orchestrator",d:"SCALE-ORCHESTRATOR (phase PX) → MONITORING (Readiness) → JOURNAL (dernière session)."},
     {a:"Mode 6 — alignement",tl:"📍 État → 🎯 Plan → ❓ Alignement",d:"Résumé + plan proposé. JAMAIS d'action sans OK."},
     {a:"Vérifier les systèmes",tl:".omc/state/ · FOS-MONITORING · HUD",d:"Missions actives, checkpoints, HotPaths, OS Readiness 0-100%."},
   ]},
  {i:"🔍",t:"Fais un audit complet du système",
   w:"Vérification exhaustive — zéro angle mort.",
   ex:"\"Vérifie tout\" · \"Audit deep-read\"",
   steps:[
     {a:"Lire CHAQUE fichier",tl:"Read · Glob · Grep · Bash",d:"22 MD + 7 JSX + _bmad/ + .claude/ + .omc/ + app/src/** + package.json."},
     {a:"Introspecter la BDD",tl:"Supabase introspect · SELECT * · RLS",d:"Tables, schéma, cohérence avec architecture documentée."},
     {a:"Vérifier références croisées",tl:"@review-agent · /sync · bmad-index-docs",d:"ADR, versions, tailles — tout doit correspondre."},
     {a:"Compliance Design System",tl:"Grep tokens Void Glass dans *.jsx",d:"#06070C (pas #0A0A0B). Figtree (pas Inter/Outfit). Radii 12/8/6px."},
     {a:"Cohérence BMAD et OMC",tl:"project-context.md · _bmad/core/ · .omc/state/",d:"Constitution BMAD vs réalité. 12 modules. Missions OMC. HotPaths."},
     {a:"Rapport scoré 11 critères",tl:"@review-agent · score 0-100",d:"✅ OK · ⚠️ Warning · ❌ Erreur → FOS-MONITORING + Notion."},
   ]},
  {i:"🧬",t:"Propose des améliorations de l'OS",
   w:"Évolution organique, AI-driven — Claude propose, Kévin valide.",
   ex:"\"Comment améliorer l'OS ?\" · \"Propose une évolution\"",
   steps:[
     {a:"Deep read complet",tl:"Read ALL .md .jsx .json .ts .yaml",d:"Structure, patterns, incohérences, gaps, dette technique."},
     {a:"Analyse cross-fichiers",tl:"Agent(Explore) · bmad-index-docs · review-adversarial",d:"Graphe dépendances, ADR contredits, DA violations, duplications."},
     {a:"Distiller les findings",tl:"bmad-distillator · editorial-review-structure",d:"✅ Sain · ⚠️ Améliorer · ❌ Corriger · 💡 Opportunités. Classé RICE."},
     {a:"Auto-critique",tl:"bmad-advanced-elicitation · edge-case-hunter",d:"Claude challenge SA PROPRE analyse. 50 techniques. Edge cases."},
     {a:"Mode 6 — proposer",tl:"💡 Proposition → 📊 Impact → ❓ Valides ?",d:"Fichiers impactés, cascade, risques, effort estimé."},
     {a:"Exécuter si validé",tl:"@doc-agent → @dev-agent → @review-agent → /sync",d:"MD first → JSX → R1-R8 → commit conventionnel."},
     {a:"Propager",tl:"Notion · Asana · MONITORING · SKILL.md · KB",d:"Tous systèmes synchronisés. Changelog. Version bumpée."},
     {a:"Vérifier zéro régression",tl:"@review-agent · /sync · Vercel preview",d:"Avant/après sur chaque fichier. 0 régression → git push."},
   ]},
  {i:"🔁",t:"Mets à jour X sans casser Y",
   w:"Itération sécurisée — modifier sans régression.",
   ex:"\"Update le commander\" · \"Refactorise sans casser\"",
   steps:[
     {a:"Snapshot état actuel",tl:"FOS-MONITORING · /sync · git status",d:"Versions MD, tailles JSX, storage keys, checkpoints."},
     {a:"Plan delta",tl:"Fichier source → impactés → cascade",d:"Mapper la cascade complète AVANT de toucher quoi que ce soit."},
     {a:"MD first",tl:"Modifier NOM-DATA.md AVANT tout JSX",d:"Bumper version, LAST_SYNC. Le MD = source de vérité."},
     {a:"Coder + review",tl:"@dev-agent · git diff · edge-case-hunter",d:"Void Glass obligatoire. Vérifier imports, storage keys, <700L."},
     {a:"Cascade check",tl:"JOURNAL → MONITORING → COMMANDER → SKILL.md",d:"Chaque fichier impacté mis à jour dans la même session."},
     {a:"Commit atomique",tl:"git add · type(scope): desc · git push",d:"UN commit par changement logique. Conventional commits."},
     {a:"Vérification post-deploy",tl:"Vercel preview · /sync · MONITORING",d:"Snapshot avant vs après → ZÉRO régression confirmé."},
   ]},
  {i:"📝",t:"Crée ou modifie un artifact fos-*",
   w:"Produire ou mettre à jour un artifact Foundation OS.",
   ex:"\"Crée fos-roadmap\" · \"Update le commander\"",
   steps:[
     {a:"Lire les sources",tl:"Read NOM-DATA.md + sources · bmad-index-docs",d:"Contenu existant, features à préserver, références croisées."},
     {a:"MD first",tl:"Write · Edit · DATA_VERSION · STORAGE_KEY",d:"Source de vérité complète. STORAGE_KEY unique. Toutes les données."},
     {a:"Coder le JSX",tl:"@dev-agent · Void Glass · ≤700L",d:"React + useState. #06070C. Figtree/JetBrains Mono. fadeIn 0.25s."},
     {a:"Livrer ensemble",tl:"@review-agent · /sync · commit · push",d:"MD + JSX même commit. Vercel auto-deploy. Update MONITORING."},
   ]},
  {i:"🔗",t:"Vérifie que tout est synchronisé",
   w:"Cohérence MD/JSX/Notion/Asana/monitoring.",
   ex:"\"Sync check\" · \"Propage vers Notion\"",
   steps:[
     {a:"Audit 7 pairs MD↔JSX",tl:"/sync · @review-agent",d:"Version, storage key, taille <700L, DA tokens, 0 désync."},
     {a:"Sync outils externes",tl:"Notion (14 cmd) · Asana (22 cmd)",d:"Notion : search→fetch→update. Asana : get_tasks→update→comment. V2 streamable HTTP."},
     {a:"Update monitoring",tl:"FOS-MONITORING.md · OS Readiness 0-100%",d:"Score global, état artifacts, risques actifs, next steps."},
     {a:"Journaliser",tl:"@doc-agent · FOS-JOURNAL · CONV-XX",d:"Résumé session, décisions, fichiers modifiés, ADR."},
   ]},
  {i:"🎭",t:"Superpower Mode — la totale multi-agents",
   w:"Brainstorm + party mode + adversarial + edge cases + distillation.",
   ex:"\"Superpower mode\" · \"Table ronde d'experts\"",
   steps:[
     {a:"Charger 5+ agents",tl:"bmad-party-mode",d:"BMad Master : 2-3 agents/msg. Analyst, Architect, UX, QA, Dev. *exit pour quitter."},
     {a:"Brainstorm collectif",tl:"bmad-brainstorming · 62 techniques",d:"5 phases. Mode user/AI/random/progressive. Objectif 100+ idées."},
     {a:"Débat structuré",tl:"Party mode · tour de parole · consensus",d:"Chaque agent challenge sous son angle. Convergence ou trade-offs explicites."},
     {a:"Review adversarial",tl:"bmad-review-adversarial",d:"Posture cynique, 10+ problèmes. 2 passes code critique, 1 sinon."},
     {a:"Chasse edge cases",tl:"bmad-review-edge-case-hunter",d:"Trace mécanique, JSON structuré. Couverture orthogonale avec adversarial."},
     {a:"Distillation finale",tl:"bmad-distillator · params: downstream_consumer, token_budget",d:"Compression lossless. --validate pour round-trip. Output actionnable."},
   ]},
  {i:"🔄",t:"RALPH Loop — amélioration continue",
   w:"Read → Analyze → Learn → Propose → Harmonize. Chaque cycle renforce le système.",
   ex:"\"Lance un RALPH\" · \"Boucle d'amélioration\"",
   steps:[
     {a:"R — Read tout le projet",tl:"Read ALL · Glob · Grep · Agent(Explore)",d:"22 MD + 7 JSX + _bmad/ + .omc/ + app/src/** + Supabase schema. bmad-index-docs."},
     {a:"A — Analyze cross-fichiers",tl:"review-adversarial · @review-agent · edge-case-hunter",d:"2 passes critiques. Dépendances brisées, DA violations, orphelins, dette technique."},
     {a:"L — Learn et améliorer",tl:"FOS-ERROR-LOG → CLAUDE.md · bmad-distillator",d:"Erreur → log → convention. Patterns récurrents → hooks. Le système s'améliore à chaque cycle."},
     {a:"P — Propose (Mode 6)",tl:"💡 Proposition → 📊 Impact RICE → ❓ Valides ?",d:"Fichiers impactés, cascade, risques, effort. RIEN modifié sans OK."},
     {a:"H — Harmonize tous les systèmes",tl:"/sync · Notion · Asana · MONITORING · SKILL.md",d:"MD↔JSX alignés. Externes à jour. Versions cohérentes. Puis → recommencer."},
   ]},
  {i:"🧠",t:"Mon contexte sature",
   w:"Gérer la mémoire de Claude — compact, clear, checkpoints.",
   ex:"\"On est à combien ?\" · \"Compact\" · \"Clear et résume\"",
   steps:[
     {a:"0-50% → travailler librement",tl:"Aucune action",d:"Full speed, pas de contrainte."},
     {a:"50-70% → surveiller",tl:"Compacter si session longue",d:"/compact préventif si session dense."},
     {a:"70-90% → /compact obligatoire",tl:"/compact",d:"Compresse l'historique. Ne pas ignorer."},
     {a:">90% → /clear + journaliser",tl:"/clear · FOS-JOURNAL.md AVANT",d:"Résumer AVANT le clear. Entrée CONV-XX."},
     {a:"Checkpoints OMC auto",tl:".omc/state/checkpoints/",d:"Snapshots automatiques. Agent replay récupérable."},
   ]},
  {i:"📋",t:"On arrête pour aujourd'hui",
   w:"Clôturer proprement — rien d'oublié.",
   ex:"\"Session end\" · \"On s'arrête\"",
   steps:[
     {a:"Lister les modifications",tl:"/session-end · git status",d:"Fichiers créés/modifiés. Rien en staging non commité."},
     {a:"Sync check final",tl:"/sync · @review-agent",d:"TOUS les MD/JSX alignés."},
     {a:"Journaliser",tl:"FOS-JOURNAL · CONV-XX · Notion",d:"Résumé structuré, décisions, fichiers modifiés."},
     {a:"Update monitoring + next step",tl:"FOS-MONITORING · Asana · 1 action claire",d:"OS Readiness à jour. UN next step actionnable."},
   ]},
  {i:"🆕",t:"J'ai perdu le fil, on recommence",
   w:"Onboarding rapide pour reprendre Foundation OS.",
   ex:"\"C'est quoi Foundation OS ?\" · \"On en est où ?\"",
   steps:[
     {a:"Lire 4 fichiers essentiels",tl:"SETUP-GUIDE → SCALE-ORCHESTRATOR → MONITORING → JOURNAL",d:"Le quoi, les 22 étapes P0→P6, l'état actuel, l'historique."},
     {a:"Identifier la phase active",tl:"SCALE-ORCHESTRATOR : phase PX · étape eXX",d:"7 phases, 22 étapes. Détail de l'étape courante."},
     {a:"Mode 6 — proposer et attendre",tl:"📍 État → 🎯 Plan → ❓ Alignement",d:"Résumé, plan proposé, validation avant toute action."},
   ]},
];

// ══════════════════════════════════════════════════════════════
// INVENTAIRE COMPLET — RÉFÉRENCE PAR CATÉGORIE
// ══════════════════════════════════════════════════════════════
const INV=[
  {cat:"🧠 Outils natifs Claude",ct:14,color:C.ac,items:[
    "Read · Write · Edit · Glob · Grep · Bash · Agent · WebSearch · WebFetch · TodoWrite · AskUserQuestion · NotebookEdit · ToolSearch · Skill"]},
  {cat:"🧱 Frameworks",ct:7,color:C.gn,items:[
    "Claudify (L2) — CLAUDE.md · hooks · agents · commands · Research→Plan→Execute→Review→Ship",
    "BMAD v6.2.2 (L3) — _bmad/ · 4 phases · project-context.md · 12 modules · agents sidecars",
    "OMC (L2) — team N workers · autopilot · /deep-interview · smart routing Haiku/Sonnet/Opus · auto-resume",
    "Void Glass DS (L0) — #06070C · #5EEAD4 · Figtree · JetBrains Mono · cards .025 · orbes blur(80px)",
    "Foundation OS App (L5) — Vite+React+TS+Tailwind+Supabase+Vercel · 6 artifacts · RLS",
    "Context7 MCP (L4) — resolve-library-id → get-library-docs · 1000+ libs · cache 10ms",
    "Shinpr Workflows (L2) — 5 recipes : implement · fullstack · front-design · reverse-engineer · diagnose"]},
  {cat:"🏗️ BMAD v6 Modules",ct:12,color:C.or,items:[
    "brainstorming — 62 techniques · 9 cat · 5 phases · anti-biais · session-doc",
    "party-mode — Master 2-3 agents/msg · Mary/John/Sally/Winston/Bob/Amelia/Quinn/Barry",
    "advanced-elicitation — 50 méthodes · 11 cat · post-draft · Pre-mortem, Six Hats, First Principles",
    "distillator — lossless · downstream_consumer · token_budget · fan-out · --validate · ~90%",
    "editorial-review-prose — Microsoft Writing Style · tableau Original|Revised|Changes",
    "editorial-review-structure — 5 modèles · reader_type humans/llm",
    "review-adversarial — cynique · 10+ problèmes · 2 passes critique",
    "edge-case-hunter — mécanique · JSON location/trigger/guard/consequence",
    "help — 12 entrées · routage par phase · complétion auto",
    "index-docs — indexation récursive _bmad/ · groupement par type",
    "init — fast/init path · config.yaml · core-module.yaml",
    "shard-doc — découpage gros docs · fan-out distillator"]},
  {cat:"🔌 MCP Connecteurs",ct:"15 · 228+ cmd",color:C.pk,sub:[
    {n:"Notion",ct:14,cmds:"search · fetch · create-pages · create-database · create-comment · create-view · duplicate-page · get-comments · get-teams · get-users · move-pages · update-page · update-view · update-data-source"},
    {n:"Asana",ct:22,cmds:"get_me · get_my_tasks · get_tasks · get_task · create_task · update_tasks · delete_task · add_comment · search_tasks · search_objects · get_projects · get_project · create_project · status_update · status_overview · get_teams · get_users · get_user · portfolios · get_attachments + 2"},
    {n:"Figma",ct:16,cmds:"get_design_context · get_screenshot · get_variable_defs · get_metadata · get_figjam · code_connect (×5) · search_design_system · create_design_system_rules · create_new_file · generate_diagram · use_figma · whoami"},
    {n:"Monday",ct:42,cmds:"boards (info/data/create/activity) · items (create/update) · docs (create/read/add) · forms · search · sprints · dashboards · widgets · workspaces · users · folders · notifications + 10"},
    {n:"ClickUp",ct:48,cmds:"tasks (CRUD/filter/search/move/deps/links/tags) · docs (create/update/pages) · time tracking · hierarchy (folders/lists) · chat (channels/messages) · reminders + 18"},
    {n:"Computer Use",ct:27,cmds:"screenshot · clicks (left/double/triple/right/middle) · type · key · hold_key · scroll · zoom · mouse · drag · clipboard · open_app · access · teach · batch"},
    {n:"Claude in Chrome",ct:19,cmds:"navigate · read_page · get_page_text · form_input · find · computer · javascript · file_upload · tabs · browser · shortcuts · console · network · gif"},
    {n:"Control Chrome",ct:10,cmds:"open_url · tabs (get/list/close/switch) · navigation (back/forward/reload) · execute_js · get_content"},
    {n:"Apple Notes",ct:4,cmds:"add · list · get_content · update"},
    {n:"Pencil",ct:15,cmds:"editor_state · screenshot · style_guide · variables · guidelines · batch_design · batch_get · export · find_space · open_doc · replace · search_props · snapshot"},
    {n:"Scheduled Tasks",ct:3,cmds:"create · list · update"},
    {n:"Cowork Internal",ct:3,cmds:"present_files · request_directory · allow_delete"},
    {n:"MCP Registry",ct:2,cmds:"search · suggest_connectors"},
    {n:"Plugins",ct:2,cmds:"search · suggest_install"},
    {n:"Session Info",ct:2,cmds:"list_sessions · read_transcript"},
  ]},
  {cat:"🤖 Agents",ct:17,color:C.bl,items:[
    "@os-architect → architecture · ADR numérotés · review structure · schéma DB",
    "@doc-agent → journal CONV-XX · traçabilité · cascade JOURNAL→MONITORING→NOTION",
    "@review-agent → 8 gardes-fous R1-R8 (taille, régression, DA, MD, stack, notations, versions, keys)",
    "@dev-agent → React + Void Glass · Supabase SDK · conventional commits · <700L",
    "BMAD Party — Mary (analyse) · John (PM) · Sally (UX) · Winston (archi) · Bob (SM) · Amelia (dev) · Quinn (QA) · Barry (fast-track)",
    "BMAD — distillate-compressor · round-trip-reconstructor",
    "OMC — team N workers parallèles · autopilot autonome · /deep-interview socratique"]},
  {cat:"⚡ Commandes & Hooks",ct:"9 cmd + 3 hooks",color:C.yl,items:[
    "/session-start → SCALE→MONITORING→JOURNAL→Mode 6",
    "/session-end → git status→/sync→JOURNAL→MONITORING→Notion→next step",
    "/new-project → projects/[nom]/ (CONTEXT+JOURNAL+BACKLOG) → sync Asana",
    "/sync → audit 7 pairs MD↔JSX (version, key, taille, DA, sync)",
    "/bmad-help → 12 modules · routage par phase · complétion auto",
    "/compact → compresser contexte (trigger >70%)",
    "/clear → journaliser AVANT → reset contexte (trigger >90%)",
    "/deep-interview → Socratic + scoring ambiguïté + anti-scope-creep",
    "/omc-setup → .omc/ + project-memory + techStack + HUD",
    "Hook PreToolUse(Bash) — bloque suppression · protège _bmad/",
    "Hook PostToolUse(Write|Edit) — log JOURNAL si décision importante",
    "Hook Stop — /session-end pour journaliser"]},
  {cat:"🎯 Skills Cowork",ct:28,color:C.gn,items:[
    "🔴 foundation-os-orchestrator · fullstack-dev · ios-dev · product-design-uxui · design-system-manager",
    "🟠 lead-dev · devops-specialist · database-architect · specialiste-ai · n8n-specialist",
    "🟡 ui-expert · ux-ergonome · audit-ux-complet · a11y-specialist · security-engineer · qa-specialist · app-store-publisher · data-analyst · copywriter-ux · da-direction-artistique · motion-designer · hierarchie-information · doc-coauthoring · lead-design",
    "⚪ skill-supervisor · project-skill-director · skill-creator · web-artifacts-builder · canvas-design · theme-factory",
    "🔴 critique · 🟠 fréquent · 🟡 spécialisé · ⚪ utilitaire"]},
  {cat:"🔮 MCP recommandés (non installés)",ct:"11 serveurs",color:C.rd,items:[
    "⬜ Supabase — DB introspection, SQL, RLS, migrations · claude mcp add supabase",
    "⬜ Vercel — Deployments, env vars, domains, logs · claude mcp add vercel",
    "⬜ GitHub — Issues, PRs, code search, actions · npm i @modelcontextprotocol/server-github",
    "⬜ Playwright — Browser E2E, a11y tree · npm i @microsoft/playwright-mcp",
    "⬜ Sentry — Error tracking, stack traces, Seer AI · mcp.sentry.dev/mcp",
    "⬜ PostHog — Analytics, HogQL, feature flags · PostHog Wizard",
    "⬜ Stripe — Customers, invoices, subscriptions · Stripe App Marketplace",
    "⬜ Resend — Email transactionnel, scheduling · npm i @resend/mcp",
    "⬜ Sequential Thinking — Raisonnement structuré multi-étapes · npm i @modelcontextprotocol/server-sequentialthinking",
    "⬜ ESLint — Lint, auto-fix, rules · npm i @eslint/mcp",
    "⬜ Knowledge Graph — Mémoire persistante cross-sessions · npm i mcp-knowledge-graph",
    "⬜ = non installé → changer en ✅ après installation"]},
  {cat:"🧩 Plugins & extensions Claude Code",ct:"6 ressources",color:C.bl,items:[
    "⬜ claude-flow — 60+ agents, swarms parallèles · npm i -g claude-flow",
    "⬜ claude-code-spec-workflow — Gates validation Requirements→Design→Tasks→Impl · npm i @pimzino/claude-code-spec-workflow",
    "⬜ Production slash commands (57) — 15 workflows + 42 tools · github.com/wshobson/commands",
    "✅ BMAD v6.2.2 — npx bmad-method install → _bmad/",
    "✅ OMC — npm i -g oh-my-claude-sisyphus@latest",
    "✅ Shinpr Workflows — 5 recipes",
    "⬜ = non installé · ✅ = installé"]},
];

// ══════════════════════════════════════════════════════════════
// FLOW AI — MOTEUR DE WORKFLOW INTERACTIF (scoring pondéré v2)
// ══════════════════════════════════════════════════════════════
const norm=s=>s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9\s]/g," ");
const STOP=new Set("je tu il le la les de du des un une et ou en au aux ce que qui pour par sur avec dans mon ton son mes tes ses est sont pas plus tout tous toute mais donc car veux veut faire fais fait moi toi cette comme etre avoir donner donne".split(" "));
const TAGS=[
  "workflow objectif intention realiser projet demande aide generer composer",
  "nouvelle app creer projet scratch feature produit demarrer lancer",
  "idee brainstorm explorer concept ideation creative innovation reflexion",
  "design interface ui ux maquette wireframe composant visuel ecran",
  "architecture schema bdd database technique adr stack decision choix",
  "code coder feature dev developper composant api implementation fonction",
  "test qa verification securite accessibilite audit check valider deploy",
  "texte redaction copy documentation ecrire prose style wording editorial grammaire",
  "deploy production publier store cicd mise ligne livrer",
  "metrics performance kpi analytics feedback iteration donnees mesurer",
  "action os maintenance workflow systeme gerer piloter",
  "reprend session etat contexte travail demarrer charger",
  "audit complet verification systeme coherence deep read tout verifier",
  "ameliore ameliorer amelioration evolution optimiser core skill skills fondation contexte capacite pouvoir renforcer upgrader",
  "mettre jour update modifier sans casser iteration securise",
  "artifact fos creer modifier produire nouveau",
  "synchronise sync notion asana monitoring coherence aligner",
  "superpower multi agents brainstorm party review totale puissant expert",
  "ralph loop amelioration ameliorer continue boucle cycle iteratif feedback apprendre evoluer renforcer",
  "contexte sature compact clear memoire checkpoint gestion",
  "session fin arreter stop resume cloturer",
  "perdu fil recommence onboarding resume zero nouveau depart",
];
const EXAMPLES=["Améliore le core de l'OS, skills et fondation","Fais un audit complet du système","Lance un brainstorm multi-agents","Mets à jour l'OS sans rien casser","Je veux créer une app de suivi sportif"];
const genFlow=(input)=>{
  if(!input||input.length<3)return null;
  const q=norm(input);
  const words=q.split(/\s+/).filter(w=>w.length>2&&!STOP.has(w));
  if(!words.length)return null;
  const all=[...OPS,...MNT];
  const pfx=(hay,w)=>hay.split(/\s+/).some(h=>h.startsWith(w)||w.startsWith(h));
  const scored=all.map((uc,idx)=>{
    const title=norm(uc.t);const when=norm(uc.w);
    const tags=norm(TAGS[idx]||"");
    const body=norm([uc.ex,...uc.steps.map(s=>s.a+" "+s.tl)].join(" "));
    let score=0;
    words.forEach(w=>{
      if(title.includes(w)||pfx(title,w))score+=5;
      if(tags.includes(w)||pfx(tags,w))score+=3;
      if(when.includes(w)||pfx(when,w))score+=2;
      if(body.includes(w))score+=1;
    });
    return{uc,score};
  }).filter(x=>x.score>0).sort((a,b)=>b.score-a.score);
  if(!scored.length)return null;
  const best=scored[0].score;const threshold=best*0.4;
  const top=scored.filter(x=>x.score>=threshold).slice(0,4);
  const steps=[];const seen=new Set();
  top.forEach(({uc})=>uc.steps.forEach(s=>{
    if(!seen.has(s.a)){seen.add(s.a);steps.push({...s,from:uc.i+" "+uc.t});}
  }));
  return{steps,sources:top.map(x=>x.uc.i+" "+x.uc.t+" ("+x.score+"pts)"),count:top.length};
};

// ══════════════════════════════════════════════════════════════
// UI COMPONENTS
// ══════════════════════════════════════════════════════════════
const st={pill:{display:"inline-block",padding:"2px 8px",borderRadius:6,fontSize:9,fontFamily:"JetBrains Mono,monospace",fontWeight:600,whiteSpace:"nowrap"},card:{background:C.cd,border:`1px solid ${C.bd}`,borderRadius:12,overflow:"hidden"},mono:{fontFamily:"JetBrains Mono,monospace"}};

const UseCase=({uc,isOpen,toggle})=>(
  <div style={st.card}>
    <div onClick={toggle} style={{padding:"12px 14px",cursor:"pointer",display:"flex",alignItems:"center",gap:10,transition:"background .15s",background:isOpen?"rgba(94,234,212,.04)":"transparent"}}>
      <span style={{fontSize:20}}>{uc.i}</span>
      <div style={{flex:1}}>
        <div style={{fontSize:13,fontWeight:700,color:C.tx,fontFamily:"Figtree,sans-serif"}}>{uc.t}</div>
        <div style={{fontSize:10,color:C.mt,marginTop:1}}>{uc.w}</div>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:6}}>
        <span style={{...st.pill,background:C.ac+"18",color:C.ac}}>{uc.steps.length} étapes</span>
        <span style={{fontSize:14,color:C.mt,transition:"transform .2s",transform:isOpen?"rotate(90deg)":"rotate(0)"}}>▸</span>
      </div>
    </div>
    {isOpen&&<div style={{padding:"0 14px 14px",borderTop:`1px solid ${C.bd}`}}>
      <div style={{margin:"10px 0 12px",padding:"8px 10px",background:"rgba(94,234,212,.05)",borderRadius:8,border:`1px solid ${C.ac}20`}}>
        <div style={{fontSize:9,color:C.ac,...st.mono,letterSpacing:1,marginBottom:3}}>EXEMPLE CONCRET</div>
        <div style={{fontSize:11,color:C.tx,fontStyle:"italic"}}>{uc.ex}</div>
      </div>
      {uc.steps.map((s,i)=>(
        <div key={i} style={{display:"flex",gap:10,marginBottom:i<uc.steps.length-1?10:0}}>
          <div style={{width:22,height:22,borderRadius:11,background:C.ac+"20",color:C.ac,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:800,flexShrink:0,marginTop:1}}>{i+1}</div>
          <div style={{flex:1}}>
            <div style={{fontSize:11,fontWeight:700,color:C.tx,marginBottom:3}}>{s.a}</div>
            <div style={{fontSize:9,color:C.pu,...st.mono,lineHeight:1.5,marginBottom:3,padding:"3px 6px",background:C.cd,borderRadius:5,border:`1px solid ${C.bd}`}}>{s.tl}</div>
            <div style={{fontSize:10,color:C.mt,lineHeight:1.5}}>{s.d}</div>
          </div>
        </div>
      ))}
    </div>}
  </div>
);

const InvSection=({inv,openCat,toggle})=>(
  <div style={st.card}>
    <div onClick={()=>toggle(inv.cat)} style={{padding:"10px 14px",cursor:"pointer",display:"flex",alignItems:"center",gap:8}}>
      <span style={{fontSize:13,fontWeight:700,color:C.tx,flex:1}}>{inv.cat}</span>
      <span style={{...st.pill,background:inv.color+"20",color:inv.color}}>{inv.ct}</span>
      <span style={{fontSize:14,color:C.mt,transition:"transform .2s",transform:openCat===inv.cat?"rotate(90deg)":"rotate(0)"}}>▸</span>
    </div>
    {openCat===inv.cat&&<div style={{padding:"0 14px 12px",borderTop:`1px solid ${C.bd}`}}>
      {inv.items&&inv.items.map((it,i)=><div key={i} style={{fontSize:10,color:C.tx,padding:"4px 0 4px 10px",borderLeft:`2px solid ${inv.color}33`,marginTop:i?4:8,lineHeight:1.5}}>{it}</div>)}
      {inv.sub&&inv.sub.map((m,i)=><div key={i} style={{marginTop:i?6:8}}>
        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:3}}>
          <span style={{fontSize:11,fontWeight:700,color:C.tx}}>{m.n}</span>
          <span style={{...st.pill,background:C.pk+"20",color:C.pk}}>{m.ct} cmd</span>
        </div>
        <div style={{fontSize:9,color:C.ac,...st.mono,lineHeight:1.7,padding:"4px 8px",background:C.cd,borderRadius:6,border:`1px solid ${C.bd}`}}>{m.cmds}</div>
      </div>)}
    </div>}
  </div>
);

const FlowAI=({q,setQ,result,setResult})=>{
  const run=(v)=>{const val=v||q;setQ(val);setResult(genFlow(val));};
  return(
    <div style={{display:"flex",flexDirection:"column",gap:10,animation:"fadeIn .2s ease"}}>
      <div style={{...st.card,padding:16}}>
        <div style={{fontSize:13,fontWeight:700,color:C.ac,marginBottom:8}}>🤖 Décris ce que tu veux réaliser</div>
        <div style={{fontSize:10,color:C.mt,marginBottom:10}}>Claude compose un workflow en puisant dans 250+ outils, 28 skills, 15 MCP, 12 BMAD, 17 agents et 7 frameworks.</div>
        <div style={{display:"flex",gap:6}}>
          <input value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")run();}} placeholder="Ex : Crée une app, audite l'OS, lance un brainstorm…" style={{flex:1,padding:"10px 12px",borderRadius:8,border:`1px solid ${C.bd}`,background:"rgba(255,255,255,.04)",color:C.tx,fontSize:12,fontFamily:"Figtree,sans-serif",outline:"none"}}/>
          <button onClick={()=>run()} style={{padding:"10px 16px",borderRadius:8,background:C.ac,color:C.bg,fontSize:12,fontWeight:700,border:"none",cursor:"pointer",fontFamily:"Figtree,sans-serif",whiteSpace:"nowrap"}}>Générer ▸</button>
        </div>
        <div style={{display:"flex",gap:4,flexWrap:"wrap",marginTop:8}}>
          {EXAMPLES.map((ex,i)=><button key={i} onClick={()=>run(ex)} style={{padding:"3px 8px",borderRadius:6,border:`1px solid ${C.bd}`,background:C.cd,color:C.mt,fontSize:9,cursor:"pointer",fontFamily:"Figtree,sans-serif",transition:"all .15s"}}>{ex}</button>)}
        </div>
      </div>
      {result&&<div style={{...st.card,padding:16}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
          <span style={{fontSize:14}}>⚡</span>
          <div style={{flex:1}}>
            <div style={{fontSize:13,fontWeight:700,color:C.ac}}>Workflow généré — {result.steps.length} étapes</div>
            <div style={{fontSize:9,color:C.mt}}>Basé sur {result.count} use case{result.count>1?"s":""}</div>
          </div>
        </div>
        <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:12}}>
          {result.sources.map((s,i)=><span key={i} style={{...st.pill,background:C.pu+"18",color:C.pu}}>{s}</span>)}
        </div>
        {result.steps.map((s,i)=>(
          <div key={i} style={{display:"flex",gap:10,marginBottom:i<result.steps.length-1?10:0}}>
            <div style={{width:22,height:22,borderRadius:11,background:C.ac+"20",color:C.ac,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:800,flexShrink:0,marginTop:1}}>{i+1}</div>
            <div style={{flex:1}}>
              <div style={{fontSize:11,fontWeight:700,color:C.tx,marginBottom:3}}>{s.a}</div>
              <div style={{fontSize:9,color:C.pu,...st.mono,lineHeight:1.5,marginBottom:3,padding:"3px 6px",background:C.cd,borderRadius:5,border:`1px solid ${C.bd}`}}>{s.tl}</div>
              <div style={{fontSize:10,color:C.mt,lineHeight:1.5}}>{s.d}</div>
              <div style={{fontSize:8,color:C.mt,marginTop:2,fontStyle:"italic"}}>↳ {s.from}</div>
            </div>
          </div>
        ))}
      </div>}
      {!result&&!q&&<div style={{...st.card,padding:16,textAlign:"center"}}>
        <div style={{fontSize:11,color:C.mt,marginBottom:8}}>Tape ta demande et le moteur compose un workflow sur mesure.</div>
        <div style={{display:"flex",gap:4,flexWrap:"wrap",justifyContent:"center"}}>
          {["BMAD","MCP","OMC","Context7","RALPH","Superpower","Shinpr","Void Glass"].map(t=><span key={t} style={{...st.pill,background:C.ac+"10",color:C.ac}}>{t}</span>)}
        </div>
      </div>}
      {result===null&&q.length>2&&<div style={{...st.card,padding:16,textAlign:"center"}}>
        <div style={{fontSize:11,color:C.mt}}>Aucun workflow trouvé. Essaie d'autres mots-clés.</div>
      </div>}
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// APP
// ══════════════════════════════════════════════════════════════
const TABS=[{id:"ai",i:"🤖",l:"Flow AI",c:C.ac},{id:"ops",i:"🚀",l:"Créer des apps",c:C.gn},{id:"mnt",i:"🔧",l:"Piloter l'OS",c:C.pu},{id:"inv",i:"📦",l:"Inventaire",c:C.or}];
const STATS=[["Outils","250+",C.ac],["MCP","26 srv",C.pk],["BMAD",12,C.or],["Skills",28,C.gn],["Agents",17,C.bl],["Use cases",22,C.yl],["Reco",11,C.rd]];

export default function App(){
  const[tab,setTab]=useState("ai");
  const[openUC,setOpenUC]=useState(null);
  const[openCat,setOpenCat]=useState(null);
  const[q,setQ]=useState("");
  const[result,setResult]=useState(undefined);
  const data=tab==="ops"?OPS:tab==="mnt"?MNT:null;
  return(
    <div style={{background:C.bg,minHeight:"100vh",color:C.tx,fontFamily:"Figtree,sans-serif",position:"relative",overflow:"hidden"}}>
      <div style={{position:"fixed",top:-120,right:-120,width:420,height:420,background:"rgba(94,234,212,.07)",borderRadius:"50%",filter:"blur(80px)",pointerEvents:"none"}}/>
      <div style={{position:"fixed",bottom:-120,left:-120,width:380,height:380,background:"rgba(167,139,250,.07)",borderRadius:"50%",filter:"blur(80px)",pointerEvents:"none"}}/>
      <div style={{maxWidth:820,margin:"0 auto",padding:"16px 14px",position:"relative",zIndex:1}}>
        <div style={{textAlign:"center",marginBottom:14}}>
          <div style={{fontSize:9,color:C.ac,...st.mono,letterSpacing:2}}>FOUNDATION OS</div>
          <h1 style={{fontSize:20,fontWeight:800,color:C.tx,margin:"4px 0 6px"}}>Toolbox v7</h1>
          <div style={{fontSize:10,color:C.mt}}>Tout l'écosystème, organisé par besoin — Claude = moteur de workflow</div>
        </div>
        <div style={{display:"flex",gap:4,justifyContent:"center",flexWrap:"wrap",marginBottom:14}}>
          {STATS.map(([l,v,c])=><div key={l} style={{background:c+"10",border:`1px solid ${c}25`,borderRadius:8,padding:"4px 10px",textAlign:"center"}}>
            <span style={{fontSize:14,fontWeight:800,color:c}}>{v}</span>
            <span style={{fontSize:8,color:C.mt,marginLeft:4}}>{l}</span>
          </div>)}
        </div>
        <div style={{display:"flex",gap:4,marginBottom:16}}>
          {TABS.map(t=><button key={t.id} onClick={()=>{setTab(t.id);setOpenUC(null);setOpenCat(null);}} style={{flex:1,padding:"10px 8px",borderRadius:10,border:`1px solid ${tab===t.id?t.c+"55":C.bd}`,background:tab===t.id?t.c+"12":"transparent",color:tab===t.id?t.c:C.mt,fontSize:12,fontWeight:tab===t.id?700:400,cursor:"pointer",fontFamily:"Figtree,sans-serif",transition:"all .15s"}}>
            <span style={{fontSize:16}}>{t.i}</span><br/><span>{t.l}</span>
          </button>)}
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {tab==="ai"&&<FlowAI q={q} setQ={setQ} result={result} setResult={setResult}/>}
          {data&&data.map((uc,i)=><UseCase key={i} uc={uc} isOpen={openUC===i} toggle={()=>setOpenUC(openUC===i?null:i)}/>)}
          {tab==="inv"&&INV.map((inv,i)=><InvSection key={i} inv={inv} openCat={openCat} toggle={c=>setOpenCat(openCat===c?null:c)}/>)}
        </div>
        <div style={{textAlign:"center",padding:"16px 0 8px",borderTop:`1px solid ${C.bd}`,marginTop:16,fontSize:8,color:C.mt}}>
          Foundation OS v0.1 · Toolbox v7.0.0 · SKILL.md v3.0.0 synced · {new Date().toLocaleDateString("fr-FR")}
        </div>
      </div>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}
