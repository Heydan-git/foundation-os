# /sync — Verifier la coherence du projet

> **VULGARISATION INTEGRALE OBLIGATOIRE (TDAH-first, D-VULGARIZE-01 2026-04-20)** : tout rapport `/sync` rendu a Kevin est vulgarise. Chaque check explique ce qu'il verifie en langage naturel. Chaque verdict (SAIN / DEGRADED / BROKEN) accompagne d'une traduction simple. Chaque probleme detecte = (a) ce qui ne va pas, (b) pourquoi c'est un souci, (c) comment le corriger. Spec : `docs/core/communication.md` section 6.0.

Audit complet de coherence Foundation OS (verifier que tout le projet est dans un etat coherent : fichiers, dossiers, liens, references).

## Execution

Lancer le script : `bash scripts/sync-check.sh`

Le script execute 6 checks automatiques :

1. **Structure** : le dossier racine contient-il les bons fichiers/dossiers ?
2. **Modules** : les modules listes dans `CONTEXT.md` correspondent-ils aux dossiers reels dans `modules/` ?
3. **References** : les liens entre fichiers doc pointent-ils vers des fichiers qui existent vraiment ?
4. **Routes** : les pages listees sont-elles declarees dans le routeur de l'app ?
5. **Fonts Void Glass** : les polices attendues (Figtree, JetBrains Mono) sont-elles bien definies ?
6. **Core OS** : les 10 modules Core OS (Cortex, Communication, etc.) ont-ils tous leur spec ?

## Interpretation (a vulgariser dans le rapport a Kevin)

Exit codes techniques : 0 = SAIN, 1 = BROKEN, 2 = DEGRADED.

**Rapport a Kevin (format vulgarise)** :

- **SAIN (🟢)** : Tout est coherent. Le projet est dans l'etat attendu.
- **DEGRADED (🟡)** : Fonctionne mais il y a 1 ou plusieurs petits decalages a nettoyer plus tard (exemple : un fichier un peu trop long vs cible). Pas bloquant.
- **BROKEN (🔴)** : Un ou plusieurs problemes graves qui doivent etre corriges avant de continuer a bosser (exemple : un lien casse vers un fichier supprime).

Si DEGRADED ou BROKEN, afficher les details en langage naturel (pas juste le nom du script qui a detecte le souci).
