# Gmail centralisation — 3 comptes vers 1 inbox unifiee

Date ouverture : 2026-04-19
Statut : en cours (Phase A)
Proprietaire : Cowork
Contexte : voir COWORK-CONTEXT.md section Travaux Cowork actifs

## Objectif

Centraliser les 3 boites Gmail de Kevin dans la principale (kevin.noel.divers@gmail.com), puis brancher le MCP Gmail sur cette principale pour tri automatique et briefing matinal.

## Mapping comptes

| Index Chrome | Adresse                      | Role        |
|--------------|------------------------------|-------------|
| u/0          | kevin.noel.divers@gmail.com  | Principale  |
| u/1          | kevin.noel.pro@gmail.com     | Secondaire  |
| u/2          | hexlander.night@gmail.com    | Secondaire  |

## Decisions Kevin (2026-04-19)

| Decision                                    | Choix                                                 |
|---------------------------------------------|-------------------------------------------------------|
| Strategie secondaires                       | Forward + archive auto (keep copy, skip inbox)        |
| Sync de suppression                         | Workaround semi-manuel (purge mensuelle guidee)       |
| Historique passe                            | Non rapatrie — nouveaux mails uniquement              |
| Format briefing                             | Scheduled task Cowork 7h00 + fallback /briefing       |

## Sommaire documents

- [00-INDEX.md](./00-INDEX.md) — ce fichier
- [01-architecture.md](./01-architecture.md) — schema technique + flux
- [02-labels-taxonomie.md](./02-labels-taxonomie.md) — labels Gmail + regles de tri
- [03-briefing-template.md](./03-briefing-template.md) — format briefing matinal
- [04-runbook.md](./04-runbook.md) — procedures courantes (purge, ajout compte, etc)

## Phases

- Phase A : Forwarding sur pro + hexlander vers divers (MCP Chrome)
- Phase A bis : Filtre archive auto cote secondaires (MCP Chrome)
- Phase B : Send mail as sur principale (MCP Chrome)
- Phase C : Filtres pre-tri origine sur principale (MCP Chrome)
- Phase D : Branchement MCP Gmail sur principale (Kevin manuel)
- Phase E : Creation labels taxonomie + filtres tri auto (MCP Gmail)
- Phase F : Script briefing + scheduled task Cowork 7h00

## Limites connues

- Pas de sync de suppression native Gmail-to-Gmail. Workaround mensuel obligatoire.
- MCP Gmail = 1 seul compte connecte (principale uniquement).
- Scheduled task Cowork = best-effort (depend de Cowork allume).
- MCP plugin_design_gmail deconnecte au moment de la Phase A — reactivation manuelle Kevin requise avant Phase D.
