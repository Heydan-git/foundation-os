# Briefing matinal — template

## Format de sortie

Fichier MD genere dans `foundation-os/docs/travaux-cowork/briefings-gmail/YYYY-MM-DD-briefing.md`

## Sections

### 1. En-tete

```
# Briefing Gmail — YYYY-MM-DD

Periode : dernieres 24h (ou depuis dernier briefing si > 24h)
Total mails recus : NN
Repartition origine : divers NN / pro NN / hexlander NN
```

### 2. Action requise (priorite 1)

Liste des mails taggues Action-requise recus dans la periode.

```
## Action requise (NN mails)

1. [Expediteur] — Sujet — HH:MM
   Extrait : premiere ligne du mail
   Lien : https://mail.google.com/mail/u/0/#inbox/MESSAGE_ID
```

### 3. Pro (priorite 2)

Liste compactee des mails Pro non-lus + resumes (max 10).

### 4. Perso / Sante / Finance / FoundationOS (priorite 2)

Groupes par label, max 5 par groupe, titre + expediteur.

### 5. A lire bientot (priorite 3)

Compteur uniquement, sans liste (eviter surcharge).

```
## A lire bientot

NN mails en attente (ouvrir label "A-lire-bientot" pour voir la liste)
```

### 6. Newsletters (priorite 4)

Compteur + top 3 sujets.

### 7. Promo (priorite 5)

Compteur uniquement, pas de detail.

### 8. Non classes

Mails que Claude n'a pas pu classer automatiquement. Kevin review et enseigne les regles.

## Exemple (fictif)

```
# Briefing Gmail — 2026-04-20

Periode : 24h
Total : 47 mails
Repartition : divers 23 / pro 18 / hexlander 6

## Action requise (3 mails)

1. slim.boukhris@delubac.fr — Validation doc contrat Noel — 07:12
   Extrait : Bonjour, peux-tu valider avant 18h le doc ci-joint...
   Lien : https://mail.google.com/mail/u/0/#inbox/XXXX

2. ...

## Pro (12 non-lus)

1. Camille LUBBERT — Documents fin de contrat — 06:44
2. ...

## Perso (4)

1. Maman — RDV dimanche — 22:30
2. ...

## Sante (1)

1. Doctolib — Rappel RDV dentiste 22/04 — 05:00

## Finance (2)

1. Qonto — Votre facture avril est disponible
2. ...

## FoundationOS (3)

1. GitHub — PR review request sur foundation-os
2. ...

## A lire bientot

NN mails en attente.

## Newsletters (8)

Top 3 : Stratechery, Ben Thompson, Not Boring

## Promo (9)

## Non classes (2)

1. expediteur-inconnu — sujet flou — Kevin, regle a definir
2. ...
```

## Declenchement

### Scheduled task Cowork (primary)

```
Cron : 0 7 * * *
Action : execute script briefing-gmail.sh
Output : fichier MD dans briefings-gmail/
Notification : dans Cowork si possible
```

### Fallback on-demand

`/briefing` → Claude execute le script immediatement et genere le brief.
