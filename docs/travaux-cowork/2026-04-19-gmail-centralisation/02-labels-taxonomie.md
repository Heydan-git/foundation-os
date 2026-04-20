# Taxonomie labels Gmail — principale

## Labels origine (pre-tri Phase C)

| Label          | Regle filtre                                    | Couleur suggeree |
|----------------|-------------------------------------------------|------------------|
| 📬/divers      | deliveredto:kevin.noel.divers@gmail.com         | gris             |
| 📬/pro         | deliveredto:kevin.noel.pro@gmail.com            | bleu             |
| 📬/hexlander   | deliveredto:hexlander.night@gmail.com           | violet           |

## Labels categorisation (Phase E — MCP Gmail)

| Label                  | Criteres                                                              | Priorite tri |
|------------------------|-----------------------------------------------------------------------|--------------|
| Action-requise         | Mots : urgent, reponse, deadline, a signer, a valider, RSVP            | 1 (rouge)    |
| A-lire-bientot         | Long form, articles, dossiers sans deadline                            | 2 (orange)   |
| FYI                    | Confirmations, accuses reception, notifications passives               | 3 (vert)     |
| Newsletter             | List-Id present + sender recurrent non perso                           | 4 (bleu)     |
| Pro                    | Domaines entreprise + clients + collegues                              | 2 (violet)   |
| Perso                  | Famille, amis, admin personnel                                         | 2 (blanc)    |
| Promo                  | Promotions commerciales, deals, soldes                                 | 5 (gris)     |
| Finance                | Factures, banque, impots, assurances, crypto                           | 2 (jaune)    |
| Sante                  | RDV medicaux, ordonnances, mutuelle, labo, pharmacie                   | 2 (rouge/blanc) |
| FoundationOS           | Tout ce qui touche FOS, dev, Claude, Anthropic, GitHub, Vercel         | 2 (vert fluo) |

## Regles d'arbitrage

- Un mail peut avoir plusieurs labels (ex : Action-requise + Pro + FoundationOS).
- Priorite tri = priorite de decision le matin (1 = lire en premier).
- Newsletter par defaut = Skip Inbox (archive auto, consultation hebdo).
- Promo par defaut = Skip Inbox + mark read (jamais dans l'inbox active).
- Action-requise JAMAIS skip inbox, meme si autres labels appliques.

## Heuristiques de detection (Phase E implementation)

### Newsletter
- Header `List-Id` ou `List-Unsubscribe` present
- Ou sender dans whitelist (ex : *@substack.com, *@mailchimp.com, newsletter@*)

### Action-requise
- Regex corps/sujet : `(?i)(urgent|asap|deadline|signer|valider|rsvp|reponse attendue|a traiter)`
- Ou mail direct (pas en copie) d'une personne connue

### Finance
- Whitelist domaines : banques connues, impots.gouv.fr, crypto exchanges, PayPal
- Sujets : facture, releve, virement, solde, transaction

### Sante
- Whitelist : doctolib, ameli, mutuelle, labo, pharmacie
- Ou keywords : rdv medical, ordonnance, resultats analyses

### FoundationOS
- Whitelist domaines : anthropic, github, vercel, supabase, notion
- Ou keywords : claude, foundation os, FOS

### Promo
- Sujets : -20%, -50%, promo, solde, black friday, code promo, remise
- Ou whitelist domaines e-commerce

## Mode apprentissage (semaine 1)

Le MCP Gmail scan l'inbox et classe. Sur 7 jours, Kevin review les mails mal classes, Claude ajoute des regles. But : 95%+ bien classe a J+7.
