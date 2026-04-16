# Travaux Cowork

> Dossier dedie aux initiatives/livrables produits cote Cowork Desktop (L1b).
> Cowork ne touche pas au code applicatif — il produit des specs, plans, audits, livrables documentaires, puis passe la main a Claude Code CLI pour execution.

## Convention

Chaque initiative = un sous-dossier dedie, prefixe par la date d'ouverture :

```
docs/travaux-cowork/
  YYYY-MM-DD-<nom-initiative>/
    00-INDEX.md        Index de l'initiative (ou 00-README.md selon tradition)
    01-<nom>.md        Spec / audit / probleme
    02-<nom>.md        Plan d'implementation pas a pas
    03-...             Suite eventuelle (ADR, retours, dogfood, tuto)
  cowork/              Docs transverses Cowork (anti-collision, project-instructions)
```

## Initiatives

| Date | Initiative | Dossier | Statut |
|------|------------|---------|--------|
| 2026-04-08 | Collaboration IA (audit + plan d'action + tuto) | `2026-04-08-collaboration-ia/` | actif |
| 2026-04-08 | Plan-Router (optimisation tokens par phase) | `2026-04-08-plan-router/` | PROPOSITION pending validation Kevin |
| 2026-04-08 | Instructions Cowork (cohabitation Cowork <-> CLI + lockfile) | `2026-04-08-instructions-cowork/` | actif — livrable + outil `scripts/session-lock.sh` |

## Regles

- Cote Cowork : ecriture autorisee dans ce dossier (c'est du livrable documentaire)
- Cote Claude Code CLI : lecture + execution des plans, mais pas d'ecriture dans `docs/travaux-cowork/` sauf si l'initiative le demande explicitement
- Toute initiative qui migre vers code → le livrable de code vit dans `scripts/`, `modules/`, `.claude/` (pas ici), l'initiative ici garde la trace docs
- Jamais de fichier a la racine de `travaux-cowork/` a part ce README et un eventuel INDEX global
