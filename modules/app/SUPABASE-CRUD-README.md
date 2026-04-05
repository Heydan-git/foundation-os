# Foundation OS - CRUD Supabase Implementation

## 🎯 Vue d'ensemble

Ce système implémente de **vraies opérations CRUD** sur Supabase, plus de simulations. Toutes les opérations interagissent directement avec la base de données.

## 📊 Tables Supabase

### 1. Sessions
- **CREATE**: Formulaire de création → `supabase.from('sessions').insert()`
- **READ**: Liste temps réel → `supabase.from('sessions').select()`
- **UPDATE**: Changement de statut → `supabase.from('sessions').update()`
- **DELETE**: Suppression définitive → `supabase.from('sessions').delete()`

### 2. Decisions
- **CREATE**: Formulaire ADR → `supabase.from('decisions').insert()`
- **READ**: Historique décisions → `supabase.from('decisions').select()`
- **UPDATE**: Statut (active/superseded/deprecated)
- **DELETE**: Suppression avec confirmation

## 🛠️ Configuration

### Variables d'environnement (.env.local)
```bash
VITE_SUPABASE_URL=https://bvpaiwijtgpfvzsztsiu.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Schema SQL
Le fichier `supabase-schema.sql` contient:
- Définitions des tables avec contraintes
- Policies RLS pour sécurité
- Données de test initiales
- Index pour performances

## 🧪 Test du système

### 1. Accéder à la page de test
```
http://localhost:5173/crud-test
```

### 2. Tests à effectuer

#### ✅ Test CREATE
1. Remplir formulaire "Nouvelle Session"
2. Cliquer "Créer Session"
3. **Vérifier**: Message de succès + session apparaît dans la liste
4. **Vérifier**: Données visibles dans Supabase Dashboard

#### ✅ Test READ
1. Cliquer "Recharger données"
2. **Vérifier**: Compteur sessions/décisions mis à jour
3. **Vérifier**: Liste affichée par ordre chronologique

#### ✅ Test UPDATE
1. Cliquer sur badge de statut d'une session
2. **Vérifier**: Statut change (active ↔ closed)
3. **Vérifier**: Message de confirmation
4. **Vérifier**: Changement persisté en DB

#### ✅ Test DELETE
1. Cliquer sur 🗑️ d'une session/décision
2. **Vérifier**: Popup de confirmation
3. Confirmer suppression
4. **Vérifier**: Élément disparaît de la liste
5. **Vérifier**: Suppression dans Supabase Dashboard

## 🔍 Monitoring des erreurs

### Console Browser
```javascript
// Toutes les opérations loggent dans la console
console.log('Session créée:', data)
console.error('Erreur création session:', err)
```

### Interface utilisateur
- Messages d'erreur: ❌ Rouge avec détails
- Messages de succès: ✅ Vert avec confirmation
- État de loading: Boutons désactivés pendant opérations

## 🔧 Débuggage

### Erreurs courantes

#### 1. "Row Level Security policy violation"
**Solution**: Vérifier les policies RLS dans Supabase
```sql
-- Voir les policies actuelles
SELECT * FROM pg_policies WHERE tablename = 'sessions';
```

#### 2. "Invalid API key"
**Solution**: Vérifier `.env.local` et redémarrer Vite
```bash
npm run dev
```

#### 3. "Network error"
**Solution**: Vérifier URL Supabase et connectivité

### Debug avancé
1. Ouvrir DevTools → Network
2. Filtrer par "supabase"
3. Examiner requêtes/réponses API

## 📈 Preuves de fonctionnement

### 1. Opérations visibles en temps réel
- Créer session → Apparaît immédiatement
- Modifier statut → Changement instantané
- Supprimer → Disparition immédiate

### 2. Persistance des données
- Fermer onglet → Réouvrir → Données toujours présentes
- Vérifier dans Supabase Dashboard → Tables peuplées

### 3. Gestion d'erreurs
- Champ requis vide → Validation HTML5
- Erreur réseau → Message d'erreur affiché
- Opération en cours → UI désactivée

## 🚀 Étapes suivantes

1. **Validation complète**: Tester toutes les opérations
2. **Monitoring**: Surveiller performances Supabase
3. **Sécurité**: Affiner les policies RLS selon besoins
4. **UX**: Ajouter loading states et optimistic updates
5. **Intégration**: Connecter avec les autres modules Foundation OS

---

**Status**: ✅ CRUD Supabase opérationnel
**Test URL**: `/crud-test`
**Database**: Supabase en ligne, opérations réelles