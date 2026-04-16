Maintenance mémoire Foundation OS (neuroplasticité).

À chaque itération, dans cet ordre :

1. **Wiki health** : `bash scripts/wiki-health.sh` — vérifier hot.md age, wikilinks, pages count. Si problèmes → fixer.
2. **Consolidation** : scanner wiki/ pour pages seed > 7 jours sans enrichissement. Si trouvées → enrichir avec contexte connu ou flagger pour ingest.
3. **Sessions-recent.md** : vérifier que le fichier est à jour (dernière session = hot.md Last Updated). Si désync → mettre à jour.
4. **Thinking.md** : relire les questions ouvertes. Si une question a maintenant une réponse (grâce à du knowledge ajouté entre-temps) → répondre dans la page.
5. **Lessons-learned.md** : vérifier si des TODO sont restés ouverts. Si fix disponible → l'appliquer.
6. **Wikilinks orphelins** : scanner graph pour noeuds sans connexions entrantes. Si trouvés → les connecter via foundation-os-map ou page pertinente.
7. **Index.md stats** : vérifier que les compteurs (Total pages, Concepts, Entities, Sources) correspondent au filesystem réel. Si désync → corriger.

Ne pas démarrer de nouveaux chantiers. Ne pas push sur main sans validation. Ne pas supprimer de fichiers.
