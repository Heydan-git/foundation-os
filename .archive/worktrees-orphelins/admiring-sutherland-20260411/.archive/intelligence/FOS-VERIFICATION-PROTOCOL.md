# FOS-VERIFICATION-PROTOCOL.md
> Protocol pour éliminer le biais de vérification de Claude
> OBLIGATOIRE avant toute assertion ou conclusion

---

## PROBLÈME IDENTIFIÉ

**Pattern récurrent :**
1. Claude fait une assertion ("100% fonctionnel", "fichiers n'existent pas")
2. Claude utilise UNE méthode de vérification 
3. Si la méthode échoue → Claude blâme l'objet ("le système est cassé")
4. Claude ne questionne JAMAIS sa méthode de vérification

**Résultat :** Claims non supportées, validation défaillante, répétition des erreurs

---

## PROTOCOL DOUBLE VÉRIFICATION

### RÈGLE #1 : MINIMUM 2 MÉTHODES
Toute vérification DOIT utiliser AU MINIMUM 2 approches différentes.

**Exemple :**
```bash
# ❌ INTERDIT (méthode unique)
ls FOS-*INTELLIGENCE*

# ✅ OBLIGATOIRE (méthodes multiples)
# Méthode A : Pattern exact
ls -la FOS-CORE-INTELLIGENCE-*.md FOS-CORE-INTELLIGENCE-*.txt

# Méthode B : Recherche alternative  
find . -maxdepth 1 -name "*CORE-INTELLIGENCE*"

# Méthode C : Grep dans listing
ls -la | grep CORE-INTELLIGENCE
```

### RÈGLE #2 : RÉSULTATS CONTRADICTOIRES = QUESTIONNER LA MÉTHODE
Si méthode A ≠ méthode B, NE PAS conclure. INVESTIGUER.

**Decision Tree :**
```
Méthode A donne résultat X
Méthode B donne résultat Y

Si X = Y → Conclusion probable fiable
Si X ≠ Y → MES MÉTHODES SONT CASSÉES
         → Utiliser méthode C, D, E...  
         → Identifier pourquoi A ou B échoue
```

### RÈGLE #3 : VALIDATION DES TOOLS
Avant de blâmer l'objet, valider que l'outil fonctionne.

**Tests obligatoires :**
```bash
# Si "ls pattern" échoue, tester :
ls # Fonctionne ?
ls -la # Fonctionne ?
echo pattern* # Shell expansion OK ?
find . -name "pattern" # Alternative fonctionne ?
```

---

## EXEMPLES CONCRETS D'APPLICATION

### CAS 1 : Vérification existence fichiers
**Assertion :** "Les docs Core Intelligence existent"

**❌ Ancien pattern :**
```bash
ls FOS-*INTELLIGENCE*  # Échoue → "fichiers n'existent pas"
```

**✅ Nouveau protocol :**
```bash
# Méthode A : Pattern exact
ls -la FOS-CORE-INTELLIGENCE-*.md FOS-CORE-INTELLIGENCE-*.txt

# Méthode B : Find
find . -maxdepth 1 -name "*CORE-INTELLIGENCE*" 

# Méthode C : Grep listing
ls -la | grep CORE-INTELLIGENCE

# Si A échoue mais B réussit → MES PATTERNS SONT MAUVAIS, pas les fichiers
```

### CAS 2 : Vérification fonctionnalité code
**Assertion :** "Le système est thread-safe"

**❌ Ancien pattern :**
```python
# Test qui vérifie "pas d'exception" 
# Échoue pas → "système thread-safe"
```

**✅ Nouveau protocol :**
```python
# Méthode A : Pas d'exception
test_no_exceptions()

# Méthode B : Vérification valeur finale
test_final_counter_value()  

# Méthode C : Test concurrent réel
test_concurrent_processes()

# Si A passe mais B échoue → MON TEST A EST INSUFFISANT
```

### CAS 3 : Vérification import module
**Assertion :** "Le module fonctionne"

**❌ Ancien pattern :**
```python
import module  # Réussit dans test context
# → "module fonctionne"
```

**✅ Nouveau protocol :**
```python
# Méthode A : Import dans test context
sys.path.append(...); import module

# Méthode B : Import comme utilisateur le ferait
subprocess.run(["python3", "script_utilisateur.py"])

# Méthode C : Import avec différents working dirs
os.chdir(autre_dir); import module

# Si A passe mais B échoue → MON CONTEXT EST BIAISÉ
```

---

## IMPLEMENTATION IMMEDIATE

### CHECKPOINT 1 : Créer aide-mémoire
**Fichier :** `.fos/verification_checklist.txt`
```
□ Ai-je utilisé AU MINIMUM 2 méthodes ?
□ Si résultats contradictoires, ai-je questionné MES méthodes ?
□ Ai-je testé dans le contexte utilisateur réel ?
□ Mes tools de vérification fonctionnent-ils correctement ?
```

### CHECKPOINT 2 : Protocole assertion
AVANT toute conclusion de type "ça marche" ou "ça marche pas" :

1. **PAUSE** : Lister mes méthodes de vérification
2. **MULTIPLE** : Utiliser 2+ approches différentes  
3. **CROSS-CHECK** : Si contradiction, investiguer MES méthodes
4. **CONTEXT** : Tester dans conditions utilisateur réel

### CHECKPOINT 3 : Red flags personnelles
**Phrases interdites :**
- "Le test passe donc ça marche" (1 seule méthode)
- "Pas d'erreur donc c'est bon" (test insuffisant)
- "Mon outil dit non donc c'est faux" (blâmer l'objet)

**Phrases obligatoires :**
- "Testé avec X méthodes, Y résultats cohérents"
- "Résultats contradictoires, mes méthodes A/B à investiguer"
- "Validé dans contexte utilisateur réel"

---

## AUTO-VERIFICATION DE CE PROTOCOL

**Méthode A :** Kevin vérifie que j'applique ce protocol
**Méthode B :** Je documente chaque vérification avec 2+ méthodes
**Méthode C :** Résultats doivent être reproductibles par Kevin

**Test concret :** Prochaine fois que je dis "X fonctionne", Kevin peut demander "avec quelles méthodes ?" et je dois pouvoir lister 2+ approches.

---

## SUCCESS METRICS

- **0 assertions** basées sur méthode unique
- **0 conclusions** sans validation cross-method
- **0 "échecs mystères"** non-investigués
- **100% reproductibilité** des vérifications par Kevin

---

**COMMITMENT :** Je n'ai plus le droit de dire "ça marche" ou "ça marche pas" sans appliquer ce protocol.