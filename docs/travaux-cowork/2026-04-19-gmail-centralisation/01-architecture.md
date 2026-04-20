# Architecture — Gmail centralisation

## Flux global

```
[kevin.noel.pro@gmail.com]       ----forward-keep-copy---->  [kevin.noel.divers@gmail.com]
        |                                                              |
        +---filtre: skip inbox + mark read                              |
        (archive auto cote pro)                                         |
                                                                        |
[hexlander.night@gmail.com]      ----forward-keep-copy---->  [kevin.noel.divers@gmail.com]
        |                                                              |
        +---filtre: skip inbox + mark read                              |
        (archive auto cote hexlander)                                   |
                                                                        v
                                                         +--- Phase D : MCP Gmail branche ici ---+
                                                         |                                       |
                                                         v                                       |
                                                Tri auto via labels                              |
                                                Briefing matinal 7h00                            |
                                                                                                 |
                                                Send mail as (repondre                           |
                                                comme pro ou hexlander)  ---------outbound-------+
```

## Cote secondaires (pro, hexlander)

- Forwarding actif vers kevin.noel.divers@gmail.com
- Option : keep copy (pas delete auto) — backup court-terme
- Filtre "from:*" : Skip Inbox + Mark as read
- Resultat : la boite secondaire reste accessible mais vide visuellement (tout archive dans All Mail)

## Cote principale (divers)

- Recoit tous les mails des 3 origines
- Filtre "deliveredto:pro" → label 📬/pro
- Filtre "deliveredto:hexlander" → label 📬/hexlander
- Filtre "deliveredto:divers" → label 📬/divers
- Send mail as active pour pro et hexlander (repondre avec la bonne identite sans changer de compte)
- MCP Gmail branche dessus : gere taxonomie + tri auto + briefing

## Sync de suppression — workaround mensuel

Par defaut, une suppression cote principale ne se propage PAS aux secondaires. Workaround :

1. Une fois par mois, Kevin ouvre kevin.noel.pro et hexlander (1 clic chaque)
2. Dans All Mail, selectionne tout > Move to Trash
3. Equivalent : script qui le fait via Gmail web (guide en 3 clics)
4. Purge Trash auto apres 30j (Gmail natif)

Documentation complete : voir 04-runbook.md section "Purge mensuelle secondaires".

## Evolutions possibles (hors scope 2026-04-19)

- Si Kevin veut vraie sync de suppression : basculer vers option "forward + delete" — destructif pour les secondaires mais sync auto.
- Si Kevin ajoute un 4eme compte : meme procedure (forward + archive + filtre deliveredto).
- Si MCP Gmail devient multi-compte : possible de brancher directement sur les 3 et supprimer le forwarding. Pas dispo aujourd'hui.
