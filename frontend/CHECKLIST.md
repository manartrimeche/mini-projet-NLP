# ✅ Checklist de Vérification Frontend

## Avant le démarrage

- [ ] Node.js et npm sont installés
  ```bash
  node --version
  npm --version
  ```

- [ ] Les dépendances sont installées
  ```bash
  cd frontend
  npm install
  ```

- [ ] Les fichiers critiques existent
  - [ ] `src/App.tsx`
  - [ ] `src/main.tsx`
  - [ ] `src/lib/api.ts`
  - [ ] `vite.config.ts`
  - [ ] `package.json`

## Configuration

- [ ] Le proxy Vite est configuré pour `/api` -> `http://localhost:8000`
  ```bash
  grep -A 5 "proxy:" vite.config.ts
  ```

- [ ] Le service API existe avec les bonnes fonctions
  ```bash
  grep -E "askQuestion|checkHealth" src/lib/api.ts
  ```

- [ ] Les routes de l'App sont à jour
  ```bash
  grep "path=" src/App.tsx | grep diagnostics
  ```

## Démarrage

- [ ] Démarrer le backend sur le port 8000
  ```bash
  # Dans un terminal séparé
  python app.py
  ```

- [ ] Démarrer le frontend sur le port 8080
  ```bash
  npm run dev
  ```

## Vérification en navigateur

1. **Accédez à http://localhost:8080**
   - [ ] La page charge sans erreurs
   - [ ] La barre latérale est visible
   - [ ] Le titre "LegalAI" s'affiche

2. **Vérifiez la barre d'en-tête**
   - [ ] Le composant ApiStatus est visible
   - [ ] Le statut affiche "Connecté" (barre verte)

3. **Testez la page Diagnostics** (http://localhost:8080/diagnostics)
   - [ ] Le diagnostic se lance automatiquement
   - [ ] Statut API: ✅ Connecté
   - [ ] Statut RAG: ✅ Prêt
   - [ ] Les détails s'affichent

4. **Testez le Chatbot** (http://localhost:8080/chatbot)
   - [ ] L'interface de chat charge
   - [ ] Vous pouvez taper un message
   - [ ] Un clic sur "Envoyer" appelle l'API
   - [ ] Une réponse s'affiche après quelques secondes
   - [ ] Les sources s'affichent (si disponibles)

5. **Testez les autres pages**
   - [ ] Dashboard: http://localhost:8080
   - [ ] Documents: http://localhost:8080/documents
   - [ ] Analyse juridique: http://localhost:8080/analysis
   - [ ] Historique: http://localhost:8080/history
   - [ ] Paramètres: http://localhost:8080/settings

## Débogage

### Ouvrir la console du navigateur (F12)

**Onglet Console:**
- Cherchez des erreurs en rouge
- Cherchez des avertissements en jaune
- Les logs API sont préfixés avec `[API]`

**Onglet Network:**
- Vérifiez les requêtes `/api/*`
- Status 200 = OK
- Status 5xx = Erreur serveur
- Status 0 = Pas de connexion au serveur

**Onglet Application:**
- Vérifiez `localStorage`
- Vérifiez les cookies (si utilisés)

### Commandes console utiles

```javascript
// Importer le service API
import { checkHealth, askQuestion } from '/api.ts'

// Tester la connexion
await checkHealth()

// Poser une question
await askQuestion("Bonjour")
```

## Fichiers à vérifier

### `vite.config.ts`
- Proxy configuré correctement
- Port 8080 spécifié

### `src/lib/api.ts`
- Service API centralisé
- Gestion d'erreur
- Logging correct

### `src/components/ApiStatus.tsx`
- Affiche l'état de connexion
- Vérifie `/api/health` toutes les 30s

### `src/pages/Chatbot.tsx`
- Import du service API
- Utilise `askQuestion()`
- Affiche les réponses

### `src/pages/Diagnostics.tsx`
- Teste tous les endpoints
- Affiche les détails d'erreur

## Problèmes courants

### "API not responding" / "Erreur 0"
1. Vérifiez que le backend est en cours d'exécution
2. Vérifiez le port: `http://localhost:8000`
3. Vérifiez CORS dans le backend
4. Vérifiez le proxy Vite

### "RAG not ready"
1. Attendez quelques instants (initialisation du modèle)
2. Vérifiez les logs du backend
3. Utilisez la page Diagnostics pour plus de détails

### "Module not found: @/components/..."
1. Vérifiez que le chemin d'import est correct
2. Vérifiez la configuration tsconfig.json (alias `@/`)
3. Redémarrez le dev server

### Erreurs TypeScript
1. Vérifiez les fichiers `.tsx` vs `.ts`
2. Vérifiez les imports
3. Exécutez: `npm run lint`

## Performance

- [ ] Le site charge en moins de 3 secondes
- [ ] Les requêtes API répondent en moins de 5 secondes
- [ ] Pas d'erreurs dans la console
- [ ] Pas de warnings TypeScript

## Production

Avant de déployer:
- [ ] `npm run build` réussit sans erreurs
- [ ] `npm run preview` affiche l'app
- [ ] Tous les tests passent
- [ ] Les performances sont acceptables

## Contact / Support

En cas de problème:
1. Vérifiez la page Diagnostics
2. Regardez les logs du navigateur (F12)
3. Regardez les logs du backend
4. Vérifiez les fichiers de configuration
5. Consultez `GUIDE_COMPLET.md`
