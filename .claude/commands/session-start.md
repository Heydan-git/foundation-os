# /session-start — Demarrer une session Foundation OS

Produit le brief de debut de session au format v11 (TDAH-friendly : cadres box-drawing, colonnes alignees, zones visuelles).
Ref spec : `docs/core/communication.md` section 6.1 + CLAUDE.md section "Briefs session".

## Phase 1 — Collecte automatique (parallele)

Lancer en parallele :

1. **CONTEXT.md** : lire ENTIER (< 150 lignes garanti). Sections : Modules, Sessions recentes, Cap, Idees & Parking, En attente Kevin, Decisions, Metriques, Chantier en cours (si actif)
2. **Git** : `git status --short` + `git log -1 --format="%cr · %h · %s"` + `git branch --show-current`
3. **Build modules** : pour chaque `modules/*/package.json` → `npm run build -w modules/[nom]`
4. **Health-check** : `bash scripts/health-check.sh`
5. **Plans actifs** : lire CHAQUE `docs/plans/*.md` non archive. Extraire pour chaque plan :
   - titre + frontmatter (status, blocks_total)
   - section `## Execution log` : compter `[x]` vs `[ ]`, identifier le dernier `[x]` (= hier), le(s) prochain(s) `[ ]`
   - decoupage en sessions (S1/S2/...) pour afficher reste
   Un plan avec toutes ses cases `[x]` OU status `done`/`closed` est considere CLOS et exclu du brief.

Si CONTEXT.md absent → abort avec erreur explicite.
Si health-check BROKEN ou build failure → signaler les erreurs critiques, ne pas produire le brief (fixer d'abord).

## Phase 2 — Verification structure (rapide)

- Racine = seulement CLAUDE.md, CONTEXT.md, README.md, .gitignore, package.json, package-lock.json (+ dossiers)
- Pas de fichiers orphelins a la racine (sinon signaler)
- Modules dans CONTEXT.md correspondent a `modules/` sur le filesystem
- CONTEXT.md < 200 lignes (sinon warning "CONTEXT.md trop long, compresser les sessions/decisions anciennes")

## Phase 3 — Produire le brief v11

Rendre les sections ci-dessous avec le format TDAH-friendly : cadres box-drawing, colonnes alignees, espacement genereux.

**Principe : chaque zone = un cadre `┌─ TITRE ─┐ ... └─┘`**. Blanc entre chaque cadre. Contenu indente 3 espaces apres le `│`.

### Template complet (copier la structure exacte)

```
╔══════════════════════════════════════════╗
║   FOUNDATION OS · Brief · YYYY-MM-DD    ║
╚══════════════════════════════════════════╝


┌─ SANTE ──────────────────────────────────┐
│                                          │
│   🟢 Projet   ████████████       100%    │
│   🟢 Build    ████████████        OK     │
│   🟢 Tests    ████████████     19/19     │
│   🟢 Health   SAIN                       │
│                                          │
└──────────────────────────────────────────┘


┌─ TRAJECTOIRE ────────────────────────────┐
│                                          │
│   🎬 Mission    [objectif long terme]    │
│   🎯 Focus      [sujet du moment]       │
│   📈 Tendance   ▲/▶/▼ [5 mots]         │
│   ⏱  Derniere   [il y a X] · [decide]   │
│                                          │
└──────────────────────────────────────────┘


┌─ PLANS ACTIFS ───────────────────────────┐
│                                          │
│   🟢 PLAN 1 — [titre court]              │
│      📄 docs/plans/[fichier].md          │
│      📊 [N/M blocs] · [status]           │
│                                          │
│      HIER : [bloc/phase] ✅              │
│             commit [hash] · [resume]     │
│                                          │
│      PROCHAIN : [bloc/phase]             │
│                 [detail + duree]         │
│                                          │
│      RESTE : [liste sessions/blocs]      │
│                                          │
├─ ────────────────────────────────────────┤
│                                          │
│   🟡 PLAN 2 — [titre court]              │
│      📄 docs/plans/[fichier].md          │
│      📊 [N/M blocs]                      │
│      HIER : [rien, ou bloc X ✅]         │
│      PROCHAIN : [bloc X]                 │
│      RESTE : [liste]                     │
│                                          │
└──────────────────────────────────────────┘


┌─ MODULES ────────────────────────────────┐
│                                          │
│   Code                                   │
│     🟢 App Builder      modules/app/     │
│     🟢 Design System    modules/ds/      │
│   Meta                                   │
│     🟢 Core OS (4/4)    docs/core/       │
│     🔵 Cowork           docs/travaux/    │
│   Prevu                                  │
│     ⚫ Finance   ⚫ Sante   ⚫ Trading   │
│                                          │
├─ ACCES ──────────────────────────────────┤
│   🔗 Prod   [URL]                        │
│   🔗 Dev    cd modules/app && npm dev    │
│   🌿 Git    [branche] · [N] modifies    │
│                                          │
└──────────────────────────────────────────┘


┌─ ⚠ ATTENTION ────────────────────────────┐
│                                          │
│   🚨 Alertes                             │
│     [health-check warnings/criticals]    │
│                                          │
│   📌 Rappels                             │
│     [dette, concerns precedentes]        │
│                                          │
│   ❓ En attente Kevin                    │
│     · [action 1]                         │
│     · [action 2]                         │
│                                          │
└──────────────────────────────────────────┘


┌─ DERNIER TRAVAIL ────────────────────────┐
│                                          │
│   📅 Commit  [hash] [titre]              │
│     · [bullet vulgarise 1]              │
│     · [bullet vulgarise 2]              │
│     · [bullet vulgarise 3]              │
│                                          │
│   🧠 Decisions                           │
│     · [D-XX-01] [titre]                 │
│     · [D-XX-02] [titre]                 │
│                                          │
└──────────────────────────────────────────┘


┌─ STATUT PROJET ──────────────────────────┐
│                                          │
│   ✅ [Nom]         ████████████   100%   │
│   ✅ [Nom]         ████████████   100%   │
│   🔄 [Nom]         ██████░░░░░░    50%   │
│   ⏸  [Nom]         en pause             │
│                                          │
└──────────────────────────────────────────┘


┌─ IDEES & PARKING ────────────────────────┐
│                                          │
│   💡 [idee concrete 1]                   │
│   💡 [idee concrete 2]                   │
│   🔮 [option future]                     │
│   ❓ [question ouverte]                  │
│                                          │
└──────────────────────────────────────────┘


┌─ REFLEXION ──────────────────────────────┐
│                                          │
│   💭 [decision en suspens]               │
│   💭 [question strategique]              │
│   🔗 [lien idee ↔ travail en cours]     │
│                                          │
└──────────────────────────────────────────┘


┌─ HISTORIQUE ─────────────────────────────┐
│                                          │
│   🧠 [date] [D-XX] [titre decision]     │
│   🧠 [date] [D-XX] [titre decision]     │
│   🧠 [date] [D-XX] [titre decision]     │
│                                          │
│   📆 Echeance  [date ou "pas fixee"]    │
│                                          │
└──────────────────────────────────────────┘


┌─ CAP ────────────────────────────────────┐
│                                          │
│   🎯 Direction                           │
│     [ou on va et pourquoi]              │
│                                          │
│   🛤  Pistes                             │
│     A. [option A]                       │
│     B. [option B]                       │
│     C. [option C]                       │
│                                          │
└──────────────────────────────────────────┘


╔═ INPUT ══════════════════════════════════╗
║                                          ║
║   📥 Questions pour Kevin                ║
║     1. [question 1]                      ║
║     2. [question 2]                      ║
║     3. [question 3]                      ║
║                                          ║
║   On y va ?                              ║
║                                          ║
╚══════════════════════════════════════════╝
```

## Phase 4 — Attendre confirmation

Terminer par `On y va ?` et attendre l'input de Kevin avant de commencer.

## Regles de rendu v11 (TDAH-friendly)

### Structure visuelle
- **Cadres** : chaque section dans un cadre `┌─ TITRE ─┐ ... └─┘` (42 chars largeur)
- **Entete et Input** : double trait `╔═══╗ ... ╚═══╝` (zones d'ancrage debut/fin)
- **Sous-sections** : separateur interne `├─ SOUS-TITRE ─┤`
- **Blanc** : 2 lignes vides entre chaque cadre (respiration visuelle)
- **Indentation** : 3 espaces apres `│` pour le contenu

### Alignement
- Labels : emoji + mot, padde a 12 chars (ex: `🎬 Mission  `)
- Valeurs : alignees a droite pour les chiffres (%, N/N)
- Barres : 12 blocs `████████████` toujours a la meme colonne
- Colonnes consistantes dans chaque cadre

### Couleurs et symboles
- Emojis couleur : 🟢 OK / 🟡 warning / 🔴 casse / 🔵 pause / ⚪ vide / ⚫ prevu / 🔮 futur
- Tendance : ▲ mieux / ▶ pareil / ▼ pire
- Barres : `█` plein, `░` vide

### Texte
- Lignes courtes : ~55 chars max (interieur cadre)
- Vulgariser : glose 3-4 mots pour tout jargon
- Mise en garde : si simplification cache un risque → `⚠ [risque]` en rouge
- Mots interdits : revolution, historique, accomplish, reference mondiale

## Sources de donnees

| Section brief | Source CONTEXT.md | Source live |
|---------------|-------------------|------------|
| Sante | — | health-check + build |
| Trajectoire | Cap + Sessions recentes | git log -1 |
| Modules | Modules | — |
| Acces/Git | — | git status + branch |
| Attention | En attente Kevin | health-check |
| Dernier travail | Sessions recentes + Decisions | git log -1 |
| Statut projet | Modules + Chantier en cours | — |
| Idees | Idees & Parking | — |
| Reflexion | Idees & Parking | — |
| Historique | Decisions (3 recentes) | — |
| Cap | Cap | — |
