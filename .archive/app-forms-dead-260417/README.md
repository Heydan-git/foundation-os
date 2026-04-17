# modules/app/src/components/forms/ — Archive 2026-04-17

## Contexte

Dead code confirme par audit v2 Agent 5 F-06 : 3 composants forms (646L totales) jamais importes dans l'app — seulement leur propre definition + les tests associes. `Commander.tsx` (page reelle) n'utilise AUCUN CTA visible qui invoque ces forms.

## Motifs de l'archive

1. **Dead code confirme** : `grep "from.*components/forms"` dans `modules/app/src/` = 0 match.
2. **Violations Void Glass** : 3 fichiers utilisent l'ancien schema de tokens (`var(--color-bg-canvas)`, `var(--color-accent-brand-primary)`, `bg-[#4FD1C7]` hex hardcode). Incompatible avec Void Glass DS `ds-*`.
3. **TODO non-tenu** : `NextStepActions.tsx:53` contient `// TODO: implement updateStep for non-done transitions` — cycle incomplet.
4. **CONTEXT.md mensonger** : declarait "iso base DS — 0 legacy" alors que ces 646L utilisaient tokens legacy.

## Contenu

- `forms/AddSessionForm.tsx` (189L) — jamais importe (sauf test)
- `forms/EditDecisionModal.tsx` (224L) — jamais importe
- `forms/NextStepActions.tsx` (233L) — jamais importe (sauf test)
- `forms.test.tsx` (96L) — 4 tests qui testaient les composants dead

## Impact tests

Tests Vitest app : **19 → 15** (retrait des 4 tests forms). Le nombre `19/19` dans CONTEXT.md est mis a jour en consequence.

## Refs audit v2

- `docs/audits/2026-04-16-mega-audit-v2/raw/agent-5-modules-app.md` F-01 (tokens legacy), F-04 (TODO updateStep), F-06 (dead code confirme)

## Restauration (si besoin)

```bash
mv .archive/app-forms-dead-260417/forms modules/app/src/components/forms
mv .archive/app-forms-dead-260417/forms.test.tsx modules/app/src/test/forms.test.tsx
```

Puis : reecrire avec tokens `ds-*`, recabler vers Commander.tsx avec CTA visibles, completer TODO updateStep.
