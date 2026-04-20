# Runbook — Gmail centralisation

## Procedure 1 : Purge mensuelle secondaires

Objectif : vider All Mail sur kevin.noel.pro et hexlander.night pour eviter l'accumulation infinie de backups.

Frequence : 1er de chaque mois.

Etapes cote pro (u/1) :
1. Ouvrir https://mail.google.com/mail/u/1/#all
2. Cliquer case a cocher master (selectionne la page visible)
3. Cliquer "Select all conversations that match this search" (banner en haut)
4. Cliquer icone Delete (Poubelle)
5. Confirmer "OK" sur le popup "Confirm bulk action"
6. Verifier dans Trash que tous les mails y sont
7. Ne pas vider Trash — Gmail purge auto apres 30j

Idem cote hexlander (u/2) : meme procedure sur https://mail.google.com/mail/u/2/#all

## Procedure 2 : Desactiver le forwarding

En cas de besoin (arret centralisation, changement de principale) :

1. Ouvrir https://mail.google.com/mail/u/N/#settings/fwdandpop (N = 1 ou 2)
2. Section "Forwarding" : clic "Disable forwarding"
3. Sauver en bas de page
4. Repeter pour l'autre secondaire

## Procedure 3 : Ajouter un 4eme compte (evolution)

1. Connecter le nouveau compte dans Chrome (index u/N)
2. Setup forwarding (meme procedure que Phase A)
3. Ajouter filtre archive auto cote nouveau compte
4. Ajouter Send mail as sur principale
5. Ajouter filtre deliveredto:nouveau-compte sur principale → nouveau label origine
6. Mettre a jour ce runbook + 01-architecture.md

## Procedure 4 : Lancer briefing on-demand

Prompt Kevin : `/briefing`

Claude execute :
1. Via MCP Gmail : liste messages recus depuis dernier briefing (ou 24h par defaut)
2. Parse par label
3. Genere fichier MD selon 03-briefing-template.md
4. Retourne lien computer://

## Procedure 5 : Corriger une regle de tri mal calibree

Kevin identifie un mail mal classe dans le brief (section "Non classes" ou mauvais label).

1. Kevin ouvre le mail, identifie le bon label
2. Prompt Kevin : `/mail-rule "exemple: tout mail de X vers label Y"`
3. Claude propose la regle (sender, list-id, keyword, etc)
4. Kevin valide
5. Claude applique via MCP Gmail : cree le filtre + applique retroactivement sur les mails matchant
6. Ajoute la regle dans 02-labels-taxonomie.md section heuristiques

## Procedure 6 : Troubleshoot forwarding qui ne marche plus

Symptomes : mails recus sur secondaire n'arrivent pas sur principale.

Checks :
1. https://mail.google.com/mail/u/N/#settings/fwdandpop : le forward est-il toujours "Enabled" ?
2. Section Pop/IMAP : rien d'active qui pourrait interferer
3. Filtres cote secondaire : aucun filtre "delete" ou "never forward" ?
4. Sur principale : verifier dossier Spam — forward legitime parfois flagge
5. Si tout OK : desactiver et reactiver forwarding (recevra nouveau code verif)

## Procedure 7 : Retirer le MCP Gmail

Si Kevin veut decouper / changer de MCP :

1. Cowork Settings > MCPs > plugin_design_gmail > Disconnect
2. Les filtres Gmail cote web restent (pas supprimes)
3. La taxonomie labels reste (pas supprimee)
4. Les briefings s'arretent
5. Tout reste consultable manuellement cote Gmail web

## Procedure 8 : Export complet taxonomie + filtres

En cas de migration ou backup :

1. Gmail Settings > Filters and Blocked Addresses > Export
2. Download XML filters file
3. Placer dans foundation-os/docs/travaux-cowork/2026-04-19-gmail-centralisation/backups/filters-YYYY-MM-DD.xml
