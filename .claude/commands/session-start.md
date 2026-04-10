# /session-start — Demarrer une session Foundation OS

Produit le brief de debut de session au format v9 (11 sections, emojis couleur, barres, separateurs 32 chars, lignes courtes).
Ref format : memory `feedback_brief_format.md` + CLAUDE.md section "Briefs session".

## Phase 1 — Collecte automatique (parallele)

Lancer en parallele :

1. **CONTEXT.md** : lire les sections Modules, Dernieres sessions (ligne 1), Prochaine action, Decisions actives (3 dernieres), Actions manuelles Kevin, Cycle 3 progress (si actif)
2. **Git** : `git status --short` + `git log -1 --format="%cr · %h · %s"` + `git branch --show-current`
3. **Build modules** : pour chaque `modules/*/package.json` → `npm run build -w modules/[nom]`
4. **Health-check** : `bash scripts/health-check.sh`

Si CONTEXT.md absent → abort avec erreur explicite.
Si health-check BROKEN ou build failure → signaler les erreurs critiques, ne pas produire le brief (fixer d'abord).

## Phase 2 — Verification structure (rapide)

- Racine = seulement CLAUDE.md, CONTEXT.md, README.md, .gitignore, package.json (+ dossiers)
- Pas de fichiers orphelins a la racine (sinon signaler)
- Modules dans CONTEXT.md correspondent a `modules/` sur le filesystem

## Phase 3 — Produire le brief v9

Rendre les 9 sections ci-dessous dans cet ordre, avec separateurs `────────────────────────────────` entre chaque.

### 1. Entete + etat global
```
FOUNDATION OS · Brief · YYYY-MM-DD

🟢 Sante projet  ████████████ 100%
🟢 Build         ████████████ OK
🟢 Tests (N)     ████████████ N/N
```
Barres : 12 blocs max (`█` plein, `░` vide). Couleur selon etat reel : 🟢 OK / 🟡 warning / 🔴 casse.

### 2. Contexte strategique (3 lignes)
- 🎬 **Mission** : extraire de CONTEXT.md > Prochaine action (objectif long terme)
- 🎯 **Focus** : sujet du moment (cycle/plan en cours)
- ⏱ **Derniere session** : date relative ("il y a X") + titre commit — extraire de CONTEXT.md > Dernieres sessions ligne 1

### 3. Infrastructure
- 🗂 **Modules** : grouper Code (app, design-system) / Meta (Core OS, Cowork...) avec status + path
- 🔗 **Acces rapides** : URL prod + `npm run dev` + GitHub + Supabase
- 🌿 **Git** : branche + N fichiers non commites + N tracked modifies

### 4. Attention
- 🚨 **Alertes sante** : refs cassees (health-check) + vulns + warnings
- 📌 **Rappels** : choses a ne pas oublier (dette, concerns session precedente)
- ❓ **Questions en attente** : actions manuelles Kevin (CONTEXT.md section dediee)

### 5. Travail precedent
- 📅 Dernier commit : hash + titre + 3 bullets vulgarises (jargon glose 3-4 mots)

### 6. Statut projet
- ✅ **Termine** : barres 100% `████████████`
- 🔄 **En cours** : barres % + ratio + note
- ⏸ **En pause** : bullets courts

### 7. Reflexion
- 💭 Decisions en suspens (bullets questions)
- 🔮 Options gardees pour plus tard

### 8. Historique + futur
- 🧠 3 dernieres decisions cles (date + code + titre) — CONTEXT.md > Decisions actives
- 📆 Prochaine echeance OU "pas de date cible fixee"

### 9. Action
- 🎯 **Prochaine action** : 2-3 pistes A/B/C — extraire de CONTEXT.md > Prochaine action
- 📥 **Ton input** : questions groupees (toutes en debut, pas au fil de l'eau)

## Phase 4 — Attendre confirmation

Terminer par `On y va ?` et attendre l'input de Kevin avant de commencer.

## Regles de rendu (rappel)

- Emojis couleur : 🟢 OK / 🟡 warning / 🔴 casse / 🔵 pause / ⚪ vide / ⚫ prevu / 🔮 futur
- Barres : `████░░░░░░░░` 12 blocs, % aligne a droite
- Separateurs : `────────────────────────────────` 32 chars box-drawing
- Lignes courtes : ~60 chars max, indentation 2-4 espaces
- Vulgariser : glose 3-4 mots pour tout jargon. "build rapide OK" > "build 728ms bundle 457kB"
- Mise en garde : si simplification cache un risque → signaler avec `> ⚠`
