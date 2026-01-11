# Guide Complet du Frontend

## 📋 Table des Matières
1. [Configuration](#configuration)
2. [Démarrage](#démarrage)
3. [Architecture](#architecture)
4. [Connexion Backend](#connexion-backend)
5. [Troubleshooting](#troubleshooting)

## 🔧 Configuration

### Prérequis
- Node.js 18+ 
- npm ou yarn

### Installation
```bash
cd frontend
npm install
```

### Variables d'environnement
Créez un fichier `.env.local` (optionnel):
```
VITE_API_BASE_URL=http://localhost:8000/api
```

## 🚀 Démarrage

### Mode développement
```bash
npm run dev
```
- Frontend: http://localhost:8080
- Le proxy Vite redirige `/api/*` vers http://localhost:8000

### Build production
```bash
npm run build
npm run preview
```

## 🏗️ Architecture

### Structure des dossiers
```
src/
├── components/
│   ├── layout/           # Layout principal
│   │   ├── AppLayout.tsx
│   │   ├── AppHeader.tsx
│   │   └── AppSidebar.tsx
│   ├── ui/               # Composants shadcn/ui
│   ├── dashboard/        # Composants du dashboard
│   └── ApiStatus.tsx     # Statut de connexion API
├── pages/
│   ├── Index.tsx         # Page d'accueil
│   ├── Chatbot.tsx       # Chatbot juridique
│   ├── Documents.tsx     # Gestion des documents
│   ├── LegalAnalysis.tsx # Analyse juridique
│   ├── History.tsx       # Historique
│   ├── Settings.tsx      # Paramètres
│   └── Diagnostics.tsx   # Page de diagnostic
├── lib/
│   ├── api.ts            # Service API centralisé
│   ├── diagnostics.ts    # Outil de diagnostic
│   └── utils.ts          # Utilitaires
├── hooks/
│   └── use-toast.ts
└── App.tsx               # Configuration des routes
```

### Pages principales

#### Dashboard (Index)
- Affiche les statistiques principales
- Accès rapide aux fonctionnalités

#### Chatbot Juridique
- Interface de chat avec le système RAG
- Affichage des sources des réponses
- Questions suggérées

#### Documents
- Liste des documents traités
- Upload de nouveaux documents
- Gestion et suppression

#### Analyse Juridique
- Analyse des clauses contractuelles
- Évaluation des risques
- Recommandations

#### Historique
- Historique des conversations
- Sauvegarde locale

#### Paramètres
- Configuration utilisateur
- Préférences de l'application

#### Diagnostics
- Vérification de la connexion API
- État du RAG et LLM
- Test de requête

## 🔌 Connexion Backend

### Service API (`src/lib/api.ts`)

Tous les appels API passent par ce service centralisé:

```typescript
import { askQuestion, getHistory, clearHistory, checkHealth } from '@/lib/api';

// Poser une question
const response = await askQuestion("Quelle est la durée légale du préavis?");

// Récupérer l'historique
const history = await getHistory(10);

// Effacer l'historique
await clearHistory();

// Vérifier la connexion
const health = await checkHealth();
```

### Endpoints API

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/health` | État du système |
| POST | `/api/ask` | Poser une question |
| GET | `/api/history?limit=10` | Historique |
| POST | `/api/clear-history` | Effacer l'historique |

### Gestion des erreurs

Les erreurs API sont automatiquement loggées et propagées:

```typescript
try {
  const data = await askQuestion(question);
} catch (error) {
  console.error('Erreur:', error.message);
}
```

### Composant ApiStatus

Affiche l'état de connexion en temps réel dans la barre d'en-tête:
- 🟢 Connecté au serveur
- 🔴 Déconnecté
- ⏳ Vérification en cours

## 🛠️ Troubleshooting

### Le frontend ne se connecte pas au backend

1. **Vérifiez que le backend est en cours d'exécution**
   ```bash
   # Vérifier http://localhost:8000/api/health
   curl http://localhost:8000/api/health
   ```

2. **Vérifiez le proxy Vite** (voir vite.config.ts)
   ```typescript
   proxy: {
     "/api": {
       target: "http://localhost:8000",
       changeOrigin: true,
     },
   }
   ```

3. **Testez les diagnostics**
   - Allez sur http://localhost:8080/diagnostics
   - Cliquez sur "Tester à nouveau"

### Erreurs CORS

Le backend doit accepter les requêtes du frontend:
```python
# Dans app.py
CORSMiddleware(
    allow_origins=["*"],  # Ou spécifier http://localhost:8080
)
```

### Le RAG n'est pas prêt

Attendez que le système RAG se charge complètement:
- Consultation de la base ChromaDB
- Chargement du modèle LLM
- Initialisation des embeddings

Vérifiez avec la page Diagnostics.

### Performance lente

1. Vérifiez la console du navigateur (F12)
2. Vérifiez les logs du backend
3. Testez avec une requête simple: "Bonjour"

## 📱 Responsive Design

L'application est optimisée pour:
- 📱 Mobile (< 640px)
- 📱 Tablet (640px - 1024px)
- 🖥️ Desktop (> 1024px)

## 🎨 Thème

L'application utilise Tailwind CSS avec un thème personnalisé:
- Couleurs primaires: Bleu professionnel
- Colorisation des risques: Rouge (danger), Orange (warning), Vert (safe)
- Mode clair/sombre: Implémenté via `next-themes`

## 📦 Dépendances principales

- **React 18.3** - Framework UI
- **TypeScript 5.8** - Typage statique
- **Vite 5.4** - Build tool
- **React Router 6.30** - Routing
- **TanStack Query 5.83** - Gestion d'état
- **shadcn/ui** - Composants réutilisables
- **Tailwind CSS 3.4** - Styling

## 🚀 Déploiement

### Build optimisé
```bash
npm run build
# Dossier dist/ prêt pour la production
```

### Servir avec un serveur web
```bash
npm run preview
```

## 📝 Notes importantes

1. Le frontend et backend doivent être exécutés simultanément
2. Le port 8080 doit être disponible pour le dev server
3. Le port 8000 doit être disponible pour le backend
4. En production, configurer un reverse proxy (nginx, Apache)

## ✨ Améliorations futures

- [ ] Authentification utilisateur
- [ ] Gestion des documents (upload, suppression)
- [ ] Export des résultats (PDF, Word)
- [ ] Personnalisation du thème
- [ ] Notifications en temps réel
- [ ] Collaboration multi-utilisateurs
