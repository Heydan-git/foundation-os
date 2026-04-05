# Memory System -- Documentation Foundation OS

> Architecture memoire multi-couche pour continuite de session
> Etat au 2026-04-05

---

## 1. Vue d'ensemble

Foundation OS utilise deux systemes de memoire distincts :

**A. Hooks shell** (`.fos/checkpoints/`, `.fos/transcripts/`, `.fos/sessions/`)
Scripts bash declenches par les hooks Claude Code. Ils gerent les backups
pre-compactage, les checkpoints silencieux toutes les 10 interactions,
et l'archivage de fin de session.

**B. Core Intelligence Python** (`.fos/memory/`)
Package Python avec memoire de session, detection de contradictions,
et protocole de communication. Documente separement dans CORE-INTELLIGENCE-DOCS.md.

Ce document couvre les deux systemes et leur integration.

---

## 2. Hooks shell -- Systeme de checkpoints

### 2.1 Scripts disponibles

| Script | Declencheur | Fonction |
|--------|-------------|----------|
| `scripts/hooks/pre-compactage-backup.sh` | PreToolUse (compact/clear) | Backup FOS-*.md avec MD5, copie des 3 fichiers critiques |
| `scripts/hooks/post-read-checkpoint.sh` | PostToolUse (Read) | Compteur interactions, checkpoint silencieux toutes les 10 |
| `scripts/hooks/session-end-archive.sh` | Stop | Archive session complete, metadonnees, reset compteur |
| `scripts/hooks/check-md-pair.sh` | Pre-commit | Verifie coherence MD/JSX |
| `scripts/hooks/conventional-commit.sh` | Pre-commit | Valide format commit message |
| `scripts/hooks/validate-void-glass.sh` | Pre-commit | Verifie design system Void Glass |

### 2.2 Pre-compactage backup

Declenche automatiquement quand Claude Code execute `/compact` ou `/clear`.

Ce qu'il fait :
1. Cree un fichier JSON checkpoint avec timestamp dans `.fos/checkpoints/`
2. Calcule le MD5 de chaque fichier FOS-*.md et CLAUDE.md
3. Copie physiquement FOS-JOURNAL.md, FOS-MONITORING.md, FOS-COMMANDER-DATA.md
4. Met a jour le symlink `latest.json`
5. Extrait les decisions recentes dans `.fos/knowledge/recent_decisions.md`
6. Genere un snapshot de l'etat projet dans `.fos/knowledge/current_state.md`

Format du checkpoint :
```json
{
  "timestamp": "2026-04-05T10:30:15Z",
  "type": "pre_compactage",
  "context_trigger": "compactage_immanent",
  "files_critical": {
    "FOS-JOURNAL.md": { "md5": "abc123...", "size": 12345 },
    "FOS-MONITORING.md": { "md5": "def456...", "size": 6789 }
  },
  "project_state": {
    "last_session": "CONV-LATEST",
    "artifacts_count": 0
  },
  "backup_files": [
    { "original": "FOS-JOURNAL.md", "backup": "backup-...-FOS-JOURNAL.md", "status": "backed_up" }
  ]
}
```

### 2.3 Checkpoint silencieux

Le script `post-read-checkpoint.sh` s'execute apres chaque appel a l'outil Read.
Il incremente un compteur dans `.fos/interaction_counter`.

Toutes les 10 interactions, il cree un checkpoint silencieux dans `.fos/checkpoints/`
contenant :
- Timestamp
- Nombre d'interactions
- Derniers fichiers accedes (lu depuis `.omc/project-memory.json`)
- Snapshot rapide : nombre de fichiers FOS-*.md, nombre de JSX artifacts, taille projet

Au-dela de 50 interactions, un warning est logue pour suggerer un compactage preventif.

### 2.4 Archive de session

Le script `session-end-archive.sh` s'execute a l'arret de Claude Code.

Ce qu'il fait :
1. Cree des metadonnees session dans `.fos/sessions/CONV-MMDD-metadata.json`
2. Cree un transcript dans `.fos/transcripts/session-YYYY-MM-DD-HH-mm-ss.md`
3. Reset le compteur d'interactions a 0
4. Nettoie les anciens checkpoints (garde les 50 derniers)

### 2.5 Configuration

Fichier : `.fos/config/anti_compactage.json`

```json
{
  "system_name": "Foundation OS Anti-Compactage System",
  "version": "1.0.0",
  "enabled": true,
  "thresholds": {
    "interaction_checkpoint": 10,
    "context_warning": 50,
    "context_alert": 70,
    "context_critical": 90
  },
  "backup_retention": {
    "checkpoints_keep": 50,
    "sessions_keep": 100,
    "transcripts_days": 30
  },
  "validation": {
    "md5_check": true,
    "integrity_check": true,
    "consistency_check": true
  }
}
```

### 2.6 Logs

Toutes les operations sont loguees dans `.fos/hooks.log`.
Format : `[YYYY-MM-DD HH:MM:SS] COMPOSANT: message`

Au 2026-04-05, le log contient 287 lignes, principalement des entries
POST-READ (checkpoints silencieux) et SESSION-END (archivages).

---

## 3. Short Term Memory (Python)

### 3.1 Structure de donnees

La memoire de session est stockee dans `.fos/memory/working_memory.json`.

```json
{
  "session_id": "STM_20260405_103000",
  "created_at": "2026-04-05T10:30:00",
  "last_updated": "2026-04-05T11:15:00",
  "conversation_context": {
    "current_topic": "implementation",
    "user_intent": "implement_system",
    "session_goal": "zero_bullshit_perfect_communication",
    "progress": [
      {
        "timestamp": "2026-04-05T10:31:00",
        "user_query": "Montre-moi les tests (trunc 200 chars)",
        "claude_response": "39/39 passent (trunc 200 chars)",
        "action_taken": "run_tests",
        "files_involved": ["test_corrections.py"]
      }
    ]
  },
  "active_contradictions": [],
  "recent_decisions": [],
  "working_files": [],
  "next_actions": [],
  "user_preferences": {
    "communication_style": "direct_no_bullshit",
    "response_format": "results_first",
    "validation_required": true
  }
}
```

### 3.2 Limites de retention

| Donnee | Limite | Comportement quand depasse |
|--------|--------|---------------------------|
| progress (interactions) | 20 | Garde les 20 dernieres |
| active_contradictions | 10 | Garde les 10 dernieres |
| recent_decisions | 15 | Garde les 15 dernieres |
| working_files | 20 | Deduplique par path, garde les 20 derniers |
| next_actions | 10 | Trie par priorite, garde les 10 premiers |

### 3.3 Detection de fichiers mentionnes

La methode `extract_files_mentioned()` utilise 5 patterns regex pre-compiles
pour extraire les references a des fichiers dans le texte :

- `app/src/**/*.{tsx,ts,js}` (composants app)
- `fos-*.jsx` (artifacts)
- `FOS-*.md` (documentation)
- `*.{json,js,ts}` (config)
- `scripts/**/*.{sh,py,js}` (scripts)

### 3.4 Detection de topic et intent

Le topic et l'intent de l'utilisateur sont mis a jour a chaque interaction
via des dictionnaires de mots-cles :

Topics : communication, contradictions, memory, implementation, audit, artifacts
Intents : fix_communication, resolve_contradictions, implement_system, validate_status

### 3.5 Batch I/O

Par defaut, chaque modification declenche un `flush()` (ecriture disque).
Pour eviter les ecritures multiples, utiliser `batch_memory_operations()` :

```python
from .batch_operations import batch_memory_operations

with batch_memory_operations(memory):
    # N modifications -> 1 seule ecriture a la fin
    memory.add_recent_decision("A")
    memory.add_recent_decision("B")
```

Le flag `_auto_save` est desactive pendant le batch, puis `flush()` est
appele dans le `finally` du context manager.

---

## 4. Communication Protocol v2

### 4.1 Validation pre-reponse

La methode `validate_before_response()` produit un objet de validation :

```json
{
  "timestamp": "...",
  "user_query": "...",
  "my_understanding": {
    "main_intent": "implement",
    "specific_request": ["artifacts"],
    "scope": "comprehensive",
    "urgency": "normal"
  },
  "intended_action": ["create_file", "modify_code"],
  "contradiction_check": {
    "conflicts_found": false,
    "relevant_conflicts": [],
    "total_conflicts": 0
  },
  "sources_used": {
    "FOS_files": ["FOS-MONITORING.md"],
    "app_files": ["app/src/App.tsx"]
  },
  "confidence_level": 0.9,
  "requires_clarification": false
}
```

### 4.2 Score de confiance

Calcule a partir de 1.0, avec deductions :

| Condition | Deduction |
|-----------|-----------|
| Mots vagues dans la requete (ca, truc, chose, machin) | -0.2 par mot |
| Contradictions pertinentes detectees | -0.3 |
| Requete longue (>50 mots) | -0.1 |
| Mots precis (exactement, precisement) | +0.1 par mot |

Si le score tombe sous 0.8, ou si des contradictions sont pertinentes,
le champ `requires_clarification` passe a `true`.

### 4.3 Log de communication

Les validations sont loguees dans `.fos/memory/communication_log.json`.
Retention : 50 dernieres entries (FIFO).

---

## 5. Contradiction Detection

### 5.1 Fonctionnement

Le `FOSCommunicationEnhancer` (status_sync_detector.py) :

1. Scanne tous les fichiers `FOS-*.md` a la racine du repo
2. Extrait les statuts via 5 patterns regex :
   - Phases : `P1 check` `P2 hourglass`
   - Artifacts : `fos-commander.jsx ... check`
   - Setup : `e01 ... check`
   - Layers : `L0 ... check`
   - Lignes de statut generiques : `check description`
3. Compare les statuts entre fichiers
4. Genere un rapport avec les contradictions detectees

### 5.2 Types de contradictions

| Type | Severite | Exemple |
|------|----------|---------|
| phase_contradiction | high | P3 marque "check" dans MONITORING mais "hourglass" dans JOURNAL |
| artifact_contradiction | medium | fos-graph.jsx marque "livre" dans INDEX-DATA mais "planifie" dans COMMANDER-DATA |

### 5.3 Output

Le rapport est sauvegarde dans `.fos/memory/enhanced_context.json` :

```json
{
  "communication_mode": "enhanced_v2",
  "contradiction_detection": true,
  "last_scan": "2026-04-05T11:00:00",
  "project_coherence": true,
  "status_validated": true,
  "critical_contradictions": [],
  "current_state_snapshot": {
    "phases": { "P0": { "check": 3 } },
    "artifacts": { "fos-commander.jsx": { "check": 2 } }
  }
}
```

---

## 6. Master Communication System

### 6.1 Activation

```python
from .master_communication_system import activate

result = activate()
```

Sequence :
1. `FOSCommunicationEnhancer.run_full_analysis()` -- scan + contradictions
2. Chargement des contradictions dans la memoire de session
3. Mise a jour du contexte dans le protocole de communication
4. Retour du statut systeme

### 6.2 Validation d'interaction

```python
from .master_communication_system import validate

result = validate("Question utilisateur", "Reponse prevue de Claude")
```

Sequence :
1. Protocole valide la comprehension + contradictions pertinentes
2. Memoire mise a jour avec l'interaction
3. Output formate pour affichage

### 6.3 Emergency resync

```python
from .master_communication_system import resync

report = resync()
```

Relance un scan complet, reinitialise les contradictions,
et met a jour le contexte.

---

## 7. Integration avec les hooks Claude Code

### 7.1 Hooks actifs dans .claude/settings.json

Les hooks Claude Code declenchent les scripts shell.
Le package Python n'est pas directement integre aux hooks.

Pour activer le Core Intelligence Python au demarrage d'une session,
il faudrait ajouter un hook qui execute :
```bash
python3 .fos/memory/auto_activate_on_startup.py
```

### 7.2 Etat actuel de l'integration

| Composant | Integre aux hooks | Execution automatique |
|-----------|-------------------|----------------------|
| pre-compactage-backup.sh | Oui (PreToolUse compact/clear) | Oui |
| post-read-checkpoint.sh | Oui (PostToolUse Read) | Oui |
| session-end-archive.sh | Oui (Stop) | Oui |
| Core Intelligence Python | Non | Non -- invocation manuelle |

---

## 8. Structure filesystem complete

```
.fos/
  config/
    anti_compactage.json         Config des seuils et retention
  checkpoints/
    checkpoint-YYYY-MM-DD-HH-mm-ss.json   Backups pre-compactage
    silent-YYYY-MM-DD-HH-mm-ss.json       Checkpoints silencieux
    backup-TIMESTAMP-FOS-JOURNAL.md        Copies de fichiers critiques
    latest.json -> symlink                 Dernier checkpoint
  knowledge/
    current_state.md             Snapshot etat projet (genere par hooks)
    recent_decisions.md          Decisions extraites de FOS-JOURNAL.md
  sessions/
    CONV-MMDD-metadata.json      Metadonnees de session
  transcripts/
    session-YYYY-MM-DD-HH-mm-ss.md  Transcripts de session
  memory/
    __init__.py                  Package marker
    config.py                    Configuration centralisee
    regex_patterns.py            Patterns regex pre-compiles
    atomic_utils.py              Ecriture JSON atomique
    file_lock.py                 File locking sidecar
    batch_operations.py          Context managers batch I/O
    short_term_memory.py         Memoire de session
    communication_protocol_v2.py Validation pre-reponse
    status_sync_detector.py      Scan contradictions
    master_communication_system.py  Orchestrateur
    enhanced_context.json        Contexte enrichi (output scan)
    communication_log.json       Log des validations
    current_session.json         Session active
    enhanced_context.json.lock   Sidecar lock
    semantic/                    Setup semantique (non actif)
    semantic_config.json         Config semantique
    contradiction_detector.json  Donnees detecteur
    working_memory.json          Memoire de travail courante
  hooks.log                      Log de toutes les operations hooks
  interaction_counter            Compteur interactions session (entier)
```

---

## 9. Maintenance

### Nettoyage des checkpoints

Les checkpoints s'accumulent dans `.fos/checkpoints/`.
Le script `session-end-archive.sh` garde les 50 derniers.
Pour nettoyer manuellement :

```bash
cd .fos/checkpoints
ls -1t | tail -n +51 | xargs rm -f
```

### Verification de l'integrite

```bash
# Verifier que les tests passent
python3 .fos/memory/test_corrections.py

# Verifier que les hooks sont executables
ls -la scripts/hooks/*.sh

# Verifier que le compteur est coherent
cat .fos/interaction_counter

# Verifier les logs recents
tail -20 .fos/hooks.log
```

### Reset complet de la memoire de session

```bash
rm .fos/memory/working_memory.json
rm .fos/memory/communication_log.json
rm .fos/memory/current_session.json
echo "0" > .fos/interaction_counter
```

---

## Changelog

| Date | Modification |
|------|-------------|
| 2026-04-05 | Creation -- Documentation factuelle basee sur le filesystem et le code source |
