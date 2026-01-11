# Configuration du Frontend

## Variables d'environnement

```bash
VITE_API_URL=http://localhost:8000/api
```

## Scripts de démarrage

### Développement
```bash
npm install
npm run dev
```

Le frontend sera accessible à `http://localhost:8080`

### Build pour la production
```bash
npm run build
```

Les fichiers compilés seront dans le dossier `dist/`

## Proxy API en développement

Vite est configuré avec un proxy pour les appels `/api/*` vers `http://localhost:8000`

## Structure des composants

- `src/components/` - Composants réutilisables
  - `layout/` - Layout principal (Sidebar, Header)
  - `ui/` - Composants shadcn/ui
  - `dashboard/` - Composants du dashboard
- `src/pages/` - Pages principales
- `src/lib/` - Utilitaires (api.ts, utils.ts)
- `src/hooks/` - Hooks personnalisés

## Points de connexion avec le Backend

### API Endpoints utilisés
- `GET /api/health` - Vérifier l'état du serveur
- `POST /api/ask` - Poser une question
- `GET /api/history` - Récupérer l'historique
- `POST /api/clear-history` - Effacer l'historique

### Service API
Le fichier `src/lib/api.ts` contient tous les appels API avec gestion d'erreur centralisée.

## Composant ApiStatus

Affiche l'état de connexion au backend (connecté/déconnecté/LLM disponible)
