# Core Intelligence System -- Documentation technique

> Foundation OS `.fos/memory/` Python package
> 39/39 tests passent au 2026-04-05
> Total : 13 fichiers Python, ~2,240 lignes

---

## 1. Vue d'ensemble

Le Core Intelligence est un package Python situe dans `.fos/memory/`.
Il fournit trois services :

1. **Contradiction detection** : scanne les fichiers FOS-*.md et detecte
   les statuts incoherents entre fichiers (par exemple, un artifact marque
   "termine" dans un fichier et "en cours" dans un autre).

2. **Communication protocol** : valide la comprehension d'une requete
   utilisateur avant d'y repondre, en evaluant la confiance, detectant
   les contradictions pertinentes, et generant des questions de clarification
   si necessaire.

3. **Short term memory** : maintient un contexte de session (dernieres 20
   interactions, contradictions actives, decisions recentes, fichiers en
   cours de modification, prochaines actions).

Ces trois services sont coordonnes par un `MasterCommunicationSystem`
qui orchestre activation, validation et resync.

---

## 2. Architecture fichiers

```
.fos/memory/
  __init__.py                    (4 lignes)    Package marker
  config.py                      (84 lignes)   Configuration centralisee, resolution dynamique FOS_ROOT
  regex_patterns.py              (128 lignes)  Patterns regex pre-compiles (6 collections)
  atomic_utils.py                (71 lignes)   Ecriture JSON atomique (temp + rename)
  file_lock.py                   (239 lignes)  File locking sidecar-based, cross-platform
  batch_operations.py            (56 lignes)   Context managers pour I/O batche
  short_term_memory.py           (351 lignes)  Memoire de session (FOSShortTermMemory)
  communication_protocol_v2.py   (276 lignes)  Validation pre-reponse (FOSCommunicationProtocol)
  status_sync_detector.py        (208 lignes)  Scan FOS-*.md + detection contradictions
  master_communication_system.py (158 lignes)  Orchestrateur principal
  enhanced_semantic_setup.py     (170 lignes)  Setup recherche semantique
  semantic_memory_setup.py       (252 lignes)  Configuration memoire semantique
  auto_activate_on_startup.py    (37 lignes)   Script d'activation au demarrage
  test_corrections.py            (206 lignes)  Suite de tests (39 assertions)
```

### Dependances entre modules

```
config.py (racine, aucune dependance interne)
    |
    +-- regex_patterns.py (import re uniquement)
    |
    +-- file_lock.py (utilise config pour les paths)
    |       |
    |       +-- atomic_utils.py (utilise file_lock pour ecriture securisee)
    |
    +-- short_term_memory.py (utilise config, regex_patterns, atomic_utils)
    |
    +-- communication_protocol_v2.py (utilise config, regex_patterns, atomic_utils)
    |
    +-- status_sync_detector.py (utilise config, regex_patterns, atomic_utils)
    |
    +-- master_communication_system.py (orchestre les 3 ci-dessus)
    |
    +-- batch_operations.py (context managers pour short_term_memory)
```

---

## 3. Installation et prerequis

### Prerequis systeme

- Python 3.10+ (teste avec 3.14)
- Aucune dependance pip externe obligatoire
- `fcntl` disponible sur macOS/Linux (utilise pour le file locking)
- `portalocker` optionnel (fallback automatique vers fcntl ou lockfile)

### Structure requise

Le package s'attend a trouver :
- `.fos/memory/` dans le repo Foundation OS
- `CLAUDE.md` a la racine du repo (utilise comme marqueur de detection)
- Les fichiers `FOS-*.md` a la racine (scannes par status_sync_detector)

### Configuration de FOS_ROOT

Le systeme resout le chemin racine dans cet ordre :

1. Variable d'environnement `FOS_ROOT` si definie
2. Resolution relative depuis `config.py` (`.fos/memory/config.py` -> 3 niveaux parent)
3. Scan ascendant depuis le repertoire courant

Si aucune methode ne fonctionne, une `RuntimeError` est levee avec
les chemins tentes.

---

## 4. API d'utilisation

### 4.1 Activation du systeme

```python
from .fos.memory.master_communication_system import activate, status, validate, resync

# Activer le systeme (scan + chargement contradictions)
result = activate()
# result = {
#   "system_active": True,
#   "contradictions_found": 2,
#   "communication_guaranteed": False,
#   "files_monitored": 15
# }
```

### 4.2 Validation d'une reponse

```python
validation = validate(
    user_query="Quel est l'etat du projet ?",
    claude_response="Le projet est en phase 00 avec 5 routes fonctionnelles."
)
# validation = {
#   "validation_passed": True,
#   "confidence_level": 0.9,
#   "contradictions_detected": False,
#   "formatted_output": "UNDERSTANDING:\n  Intent: status\n  ...",
#   "clarification_needed": None,
#   "raw_validation": { ... }
# }
```

### 4.3 Memoire de session

```python
from .fos.memory.short_term_memory import get_memory, get_context

memory = get_memory()

# Enregistrer une interaction
memory.update_conversation_context(
    user_query="Montre-moi les tests",
    claude_response="39/39 passent",
    action_taken="run_tests"
)

# Ajouter une contradiction detectee
memory.add_active_contradiction({
    "type": "phase_contradiction",
    "item": "P3",
    "severity": "high"
})

# Ajouter une decision
memory.add_recent_decision("Utiliser sidecar locking pour les fichiers JSON")

# Tracker un fichier en cours de modification
memory.add_working_file("app/src/App.tsx", "editing")

# Definir la prochaine action
memory.set_next_action("Ecrire la documentation", priority="high")

# Obtenir le resume du contexte
context = get_context()
```

### 4.4 Batch operations

```python
from .fos.memory.batch_operations import batch_memory_operations
from .fos.memory.short_term_memory import get_memory

memory = get_memory()

# Au lieu de 5 ecritures disque, une seule a la fin
with batch_memory_operations(memory):
    memory.add_active_contradiction({"type": "x", "item": "y", "severity": "low"})
    memory.add_recent_decision("Decision A")
    memory.add_recent_decision("Decision B")
    memory.set_next_action("Action 1")
    memory.set_next_action("Action 2")
# flush() appele automatiquement a la sortie du context manager
```

### 4.5 Lecture/ecriture JSON thread-safe

```python
from .fos.memory.file_lock import safe_json_write_with_lock, safe_json_read_with_lock
from pathlib import Path

path = Path("/tmp/data.json")

# Ecriture atomique avec sidecar lock
safe_json_write_with_lock(path, {"key": "value"})

# Lecture avec shared lock
data = safe_json_read_with_lock(path, default={"empty": True})
```

---

## 5. File locking : architecture sidecar

### Probleme resolu

L'ecriture atomique JSON utilise le pattern "write to temp + rename".
Le `rename` remplace l'inode du fichier de donnees. Si un lock est pose
directement sur le fichier de donnees, le rename cree un nouvel inode
et le lock est silencieusement relache.

### Solution

Le lock est toujours pose sur un fichier sidecar `.lock` adjacent :

```
data.json       <- le fichier de donnees (remplace par rename)
data.json.lock  <- le fichier de lock (stable, jamais remplace)
```

### Implementation multi-plateforme

Trois backends, testes dans cet ordre :

1. **portalocker** (si installe) : locking cross-platform robuste
2. **fcntl** (macOS/Linux natif) : `flock()` avec timeout et retry
3. **lockfile** (fallback) : creation atomique via `O_CREAT|O_EXCL` +
   detection PID stale

Le choix est automatique au runtime. Aucune configuration necessaire.

### Garanties

- Ecritures concurrentes : testees avec 8 threads x 15 ecritures (TEST 4)
- Timeout configurable (defaut 10 secondes)
- Shared lock pour les lectures, exclusive lock pour les ecritures
- Fallback gracieux : si le lock echoue, lecture sans lock plutot que crash

---

## 6. Regex : optimisation pre-compilation

### Probleme resolu

Les versions precedentes recompilaient les regex a chaque appel de scan.
Avec ~230 patterns et des scans frequents, cela generait un overhead
mesurable.

### Solution

Tous les patterns sont compiles une seule fois dans `regex_patterns.py`
au moment de l'import, puis importes par reference dans les modules
qui les utilisent.

### Collections disponibles

| Collection | Nombre de patterns | Utilise par |
|------------|-------------------|-------------|
| STATUS_PATTERNS | 5 | status_sync_detector.py |
| INTENT_PATTERNS | 6 | communication_protocol_v2.py |
| FOS_PATTERNS | 5 | communication_protocol_v2.py |
| ACTION_PATTERNS | 5 | communication_protocol_v2.py |
| SOURCE_PATTERNS | 5 | communication_protocol_v2.py |
| FILE_PATTERNS | 5 | short_term_memory.py |
| CHECKPOINT_PATTERNS | 4 | enhanced_semantic_setup.py |

Total : 35 patterns pre-compiles.

---

## 7. Configuration centralisee

Toutes les constantes de chemin sont dans `config.py` :

| Constante | Valeur (relative a FOS_ROOT) |
|-----------|------------------------------|
| FOS_ROOT | `/Users/kevinnoel/foundation-os` (resolu dynamiquement) |
| MEMORY_DIR | `.fos/memory/` |
| CHECKPOINTS_DIR | `.fos/checkpoints/` |
| TRANSCRIPTS_DIR | `.fos/transcripts/` |
| SEMANTIC_DIR | `.fos/memory/semantic/` |
| WORKING_MEMORY_FILE | `.fos/memory/working_memory.json` |
| ENHANCED_CONTEXT_FILE | `.fos/memory/enhanced_context.json` |
| COMMUNICATION_LOG_FILE | `.fos/memory/communication_log.json` |
| CURRENT_SESSION_FILE | `.fos/memory/current_session.json` |
| CONTRADICTION_DETECTOR_FILE | `.fos/memory/contradiction_detector.json` |

Les repertoires sont crees automatiquement si absents (`_ensure_dir`).

---

## 8. Tests de validation

### Execution

```bash
cd /Users/kevinnoel/foundation-os
python3 .fos/memory/test_corrections.py
```

### Couverture des 39 tests

| Categorie | Tests | Ce qui est verifie |
|-----------|-------|-------------------|
| Import hygiene | 2 | Tous les 9 modules chargent, __init__.py existe |
| Config | 4 | FOS_ROOT resolu, MEMORY_DIR existe, _ensure_dir fonctionne |
| Sidecar locking | 7 | Lock est sidecar, yield Path, sidecar cree, roundtrip JSON, default pour manquant |
| Concurrence | 3 | 8 threads x 15 ecritures sans erreur, JSON valide apres, cle counter presente |
| Regex pre-compiles | 8 | 4 collections sont dict, 4 collections contiennent des re.Pattern |
| Modules utilisent pre-compiles | 5 | STM utilise FILE_PATTERNS, pas re.compile inline ; CommProto utilise SOURCE_PATTERNS ; StatusSync utilise STATUS_PATTERNS |
| Lazy singletons | 5 | get_memory retourne FOSShortTermMemory, est singleton ; idem get_protocol, get_master_system |
| Pas de bare except | 1 | AST parse de tous les .py, aucun except sans type |
| End-to-end | 3 | System active, retourne file count, retourne contradiction count |

### Resultat attendu

```
RESULTS: 39 passed, 0 failed out of 39 tests
```

---

## 9. Troubleshooting

### Erreur "Cannot locate Foundation OS root directory"

Cause : `config.py` ne trouve pas le repo.
Solution : `export FOS_ROOT=/chemin/vers/foundation-os`

### Erreur "Could not acquire lock within Xs"

Cause : un processus bloque le fichier .lock.
Solution : supprimer le fichier `.lock` concerne :
```bash
rm .fos/memory/enhanced_context.json.lock
```

### ImportError sur les imports relatifs

Cause : le script est execute hors du contexte package.
Solution : executer depuis la racine du repo :
```bash
cd /Users/kevinnoel/foundation-os
python3 .fos/memory/test_corrections.py
```

### Les contradictions detectees sont fausses

Cause : les fichiers FOS-*.md contiennent des statuts historiques
(phases passees marquees a la fois "termine" et "en cours" dans
differents fichiers).
Solution : nettoyer les fichiers FOS-*.md pour n'avoir qu'un seul
statut par phase/artifact.

---

## 10. Limitations connues

1. **Pas de persistance inter-session automatique** : la memoire de session
   (FOSShortTermMemory) est reinitialise a chaque nouvelle instanciation.
   Le fichier JSON sur disque persiste mais l'objet Python est recreee.

2. **Pas d'integration Claude Code native** : le package Python n'est pas
   appele automatiquement par Claude Code. Il necessite une invocation
   explicite ou un hook shell.

3. **Detection de contradictions limitee aux patterns regex** : seuls les
   statuts avec emojis (check, hourglass, cross) et les patterns
   "P0-P9", "fos-*.jsx", "eXX", "LX" sont detectes.

4. **Pas de semantic search fonctionnel** : les fichiers `semantic_memory_setup.py`
   et `enhanced_semantic_setup.py` existent mais ne sont pas utilises
   par le master system.

5. **Tests ne couvrent pas** : semantic search, auto_activate_on_startup,
   enhanced_semantic_setup.

---

## Changelog

| Date | Modification |
|------|-------------|
| 2026-04-05 | Creation -- Documentation technique factuelle basee sur lecture du code source |
