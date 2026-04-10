# /session-start — Demarrer une session Foundation OS

Produit le brief de debut de session au format v10 (11 sections, emojis couleur, barres, separateurs 32 chars, lignes courtes).
Ref spec : `docs/core/communication.md` section 6.1 + CLAUDE.md section "Briefs session".

## Phase 1 — Collecte automatique (parallele)

Lancer en parallele :

1. **CONTEXT.md** : lire ENTIER (< 150 lignes garanti). Sections : Modules, Sessions recentes, Cap, Idees & Parking, En attente Kevin, Decisions, Metriques, Chantier en cours (si actif)
2. **Git** : `git status --short` + `git log -1 --format="%cr · %h · %s"` + `git branch --show-current`
3. **Build modules** : pour chaque `modules/*/package.json` → `npm run build -w modules/[nom]`
4. **Health-check** : `bash scripts/health-check.sh`

Si CONTEXT.md absent → abort avec erreur explicite.
Si health-check BROKEN ou build failure → signaler les erreurs critiques, ne pas produire le brief (fixer d'abord).

## Phase 2 — Verification structure (rapide)

- Racine = seulement CLAUDE.md, CONTEXT.md, README.md, .gitignore, package.json, package-lock.json (+ dossiers)
- Pas de fichiers orphelins a la racine (sinon signaler)
- Modules dans CONTEXT.md correspondent a `modules/` sur le filesystem
- CONTEXT.md < 200 lignes (sinon warning "CONTEXT.md trop long, compresser les sessions/decisions anciennes")

## Phase 3 — Produire le brief v10

Rendre les 11 sections ci-dessous dans cet ordre, avec separateurs `────────────────────────────────` entre chaque.

### 1. Entete + etat global
```
FOUNDATION OS · Brief · YYYY-MM-DD

🟢 Sante projet  ████████████ 100%
🟢 Build         ████████████ OK
🟢 Tests (N)     ████████████ N/N
```
Barres : 12 blocs max (`█` plein, `░` vide). Couleur selon etat reel : 🟢 OK / 🟡 warning / 🔴 casse.

### 2. Trajectoire
- 🎬 **Mission** : objectif long terme (extrait de Cap)
- 🎯 **Focus** : sujet du moment (chantier en cours ou cap immediat)
- 📈 **Tendance** : evolution depuis derniere session (mieux / pareil / pire + pourquoi en ~5 mots)
- ⏱ **Derniere session** : date relative ("il y a X") + ce qui a ete **decide** (pas juste fait)

### 3. Infrastructure
- 🗂 **Modules** : grouper Code (app, design-system) / Meta (Core OS, Cowork...) avec status + path
- 🔗 **Acces rapides** : URL prod + `npm run dev` + GitHub + Supabase
- 🌿 **Git** : branche + N fichiers non commites + N tracked modifies

### 4. Attention
- 🚨 **Alertes** : health-check warnings/criticals
- 📌 **Rappels** : dette, concerns session precedente
- ❓ **En attente Kevin** : actions/questions humaines pending (CONTEXT.md section dediee)

### 5. Travail precedent
- 📅 Dernier commit : hash + titre + 3 bullets vulgarises (jargon glose 3-4 mots)
- 🧠 Decisions prises : decisions de la derniere session (ID + titre, pas juste les faits)

### 6. Statut projet
- ✅ **Termine** : barres 100% `████████████`
- 🔄 **En cours** : barres % + ratio + note
- ⏸ **En pause** : bullets courts

### 7. Idees & Parking
- 💡 Idees concretes en attente (extrait de CONTEXT.md > Idees & Parking)
- 🔮 Options futures
- ❓ Questions ouvertes a trancher

### 8. Reflexion
- 💭 Decisions en suspens (bullets questions)
- 🔗 Liens entre idees et travail en cours (contextualisation)

### 9. Historique
- 🧠 3 dernieres decisions cles (date + code + titre) — CONTEXT.md > Decisions
- 📆 Prochaine echeance OU "pas de date cible fixee"

### 10. Cap
- 🎯 **Direction** : ou on va a moyen terme et pourquoi (extrait de CONTEXT.md > Cap)
- 🛤 **Pistes** : 2-3 options A/B/C pour la prochaine action

### 11. Input
- 📥 **Questions pour Kevin** : toutes groupees (pas au fil de l'eau)
- Terminer par `On y va ?`

## Phase 4 — Attendre confirmation

Terminer par `On y va ?` et attendre l'input de Kevin avant de commencer.

## Regles de rendu

- Emojis couleur : 🟢 OK / 🟡 warning / 🔴 casse / 🔵 pause / ⚪ vide / ⚫ prevu / 🔮 futur
- Barres : `████░░░░░░░░` 12 blocs, % aligne a droite
- Separateurs : `────────────────────────────────` 32 chars box-drawing
- Lignes courtes : ~60 chars max, indentation 2-4 espaces
- Vulgariser : glose 3-4 mots pour tout jargon. "build rapide OK" > "build 728ms bundle 457kB"
- Mise en garde : si simplification cache un risque → signaler avec `> ⚠`
- Mots interdits : revolution, historique, accomplish, reference mondiale

## Sources de donnees

| Section brief | Source CONTEXT.md | Source live |
|---------------|-------------------|------------|
| Etat global | — | health-check + build |
| Trajectoire | Cap + Sessions recentes | git log -1 |
| Modules | Modules | — |
| Git | — | git status + branch |
| Alertes | — | health-check |
| En attente Kevin | En attente Kevin | — |
| Dernier commit | — | git log -1 + git show |
| Decisions recentes | Sessions recentes + Decisions | — |
| Statut projet | Modules + Chantier en cours | — |
| Idees | Idees & Parking | — |
| Historique | Decisions (3 recentes) | — |
| Cap | Cap | — |
