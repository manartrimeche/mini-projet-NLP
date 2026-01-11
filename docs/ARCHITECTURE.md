# 🏗️ Architecture du Projet - Guide Complet

## 📋 Vue d'ensemble

Le projet est organisé avec une architecture **Frontend-Backend séparé** pour une meilleure maintenabilité et scalabilité.

```
mini-projet-NLP/
├── 🎨 frontend/                    # Interface web HTML/CSS/JS
│   ├── index.html                 # Page principale
│   ├── css/
│   │   ├── style.css              # Styles principaux
│   │   └── responsive.css         # Styles responsive
│   ├── js/
│   │   └── app.js                 # Logique JavaScript
│   └── assets/                    # Images, fonts, etc.
│
├── 🐍 mini-projet-NLP/            # Backend Python (RAG)
│   ├── src/
│   │   └── rag/
│   │       ├── config.py          # Configuration
│   │       ├── document_processor.py
│   │       ├── vector_store.py
│   │       ├── llm_manager.py
│   │       ├── qa_system.py
│   │       ├── database.py
│   │       └── prompt.py
│   ├── data/                      # Données (PDF, textes)
│   ├── chroma_db/                 # Base de données vectorielle
│   ├── notebook/                  # Notebooks Jupyter
│   ├── requirements.txt
│   └── setup_check.py
│
├── ⚙️ config/                      # Fichiers de configuration
│
├── 📚 docs/                        # Documentation
│
├── 🚀 app.py                       # Serveur FastAPI principal
│
├── .env                            # Variables d'environnement
├── .env.example                    # Modèle d'env
├── .gitignore
├── README.md
└── setup.py

```

---

## 🎯 Architecture en Couches

### 1️⃣ **Frontend** (Couche Présentation)
**Localisation:** `frontend/`

Responsabilités:
- Interface utilisateur interactive
- Communication avec le backend via API REST
- Gestion de l'historique des conversations
- Affichage des réponses et sources

**Technologies:**
- HTML5 (structure)
- CSS3 (styling responsive)
- JavaScript vanilla (pas de dépendances)

**Fichiers clés:**
- `index.html` - Structure et mise en page
- `css/style.css` - Styles principaux
- `css/responsive.css` - Responsive design
- `js/app.js` - Logique frontend

---

### 2️⃣ **Backend API** (Couche Application)
**Localisation:** `mini-projet-NLP/`

Responsabilités:
- Servir le frontend (FastAPI)
- Exposer les endpoints REST
- Gestion du système RAG
- Orchestration entre composants

**Endpoints disponibles:**
```
GET  /                    → Page d'accueil
GET  /api/health          → État du système
POST /api/ask             → Poser une question
GET  /api/history         → Récupérer l'historique
POST /api/clear-history   → Effacer l'historique
```

**Technologie:** FastAPI + Uvicorn

---

### 3️⃣ **Système RAG** (Couche Métier)
**Localisation:** `mini-projet-NLP/src/rag/`

Composants:

| Module | Rôle |
|--------|------|
| `config.py` | Configuration centralisée du système |
| `document_processor.py` | Extraction et nettoyage des PDF |
| `vector_store.py` | Gestion de ChromaDB + chunking |
| `llm_manager.py` | Gestion du modèle LLama 3.2 |
| `qa_system.py` | Orchestration Q&A |
| `database.py` | Persistance historique |
| `prompt.py` | Templates de prompts |

---

### 4️⃣ **Data Layer** (Couche Données)
**Localisation:** `mini-projet-NLP/`

**Stockages:**
- `data/` - Documents texte/PDF
- `chroma_db/` - Vector store (embeddings)
- `chat_history.db` - SQLite (historique)

---

## 🔄 Flux de Données

```
┌─────────────────────────────────────────────────────────────┐
│                    USER INTERFACE                           │
│                   (Frontend HTML/CSS)                       │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ HTTP JSON
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              FASTAPI SERVER (app.py)                         │
│                                                             │
│  GET  /api/health      POST /api/ask                       │
│  GET  /api/history     POST /api/clear-history             │
└──────────────────────┬──────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
   ┌─────────┐  ┌──────────┐  ┌──────────┐
   │ Vector  │  │   LLM    │  │ Database │
   │ Store   │  │ Manager  │  │ Manager  │
   │ (Chroma)│  │(Llama3.2)│  │ (SQLite) │
   └────┬────┘  └────┬─────┘  └────┬─────┘
        │            │             │
        └────────────┼─────────────┘
                     │
            QA System (qa_system.py)
                     │
        ┌────────────┴────────────┐
        │                         │
        ▼                         ▼
   Retrieved Docs            Generated Answer
   + Sources                 + Metadata

```

---

## 🚀 Démarrage de l'Application

### Étape 1: Préparation

```powershell
# Activez l'environnement virtuel
cd C:\Users\RSCH\mini-projet-NLP
& .\.venv\Scripts\Activate.ps1
```

### Étape 2: Installation des dépendances

```powershell
# Installer FastAPI et dépendances
pip install fastapi uvicorn python-dotenv

# Vérifier que les dépendances RAG sont installées
pip install -r mini-projet-NLP/requirements.txt
```

### Étape 3: Démarrer le serveur

```powershell
# Depuis la racine du projet
python app.py
```

**Sortie attendue:**
```
🚀 Initialisation du système RAG...
✅ Système RAG prêt!
🌐 Serveur FastAPI démarré sur http://localhost:8000
```

### Étape 4: Accéder l'application

Ouvrez votre navigateur à `http://localhost:8000`

---

## 📡 API REST Endpoints

### 1. Health Check

**Requête:**
```
GET /api/health
```

**Réponse:**
```json
{
  "status": "ok",
  "rag_ready": true,
  "llm_available": true
}
```

---

### 2. Poser une Question

**Requête:**
```
POST /api/ask
Content-Type: application/json

{
  "question": "Quelle est la durée légale du travail en France?"
}
```

**Réponse:**
```json
{
  "success": true,
  "question": "Quelle est la durée légale du travail?",
  "answer": "La durée légale du travail est...",
  "sources": [
    {
      "name": "code de travail.txt",
      "excerpt": "Article 1... la durée légale..."
    }
  ],
  "source_count": 3
}
```

---

### 3. Récupérer l'Historique

**Requête:**
```
GET /api/history?limit=10
```

**Réponse:**
```json
{
  "success": true,
  "history": [
    {
      "id": 1,
      "question": "...",
      "answer": "...",
      "timestamp": "2024-01-10 14:30:00"
    }
  ]
}
```

---

### 4. Effacer l'Historique

**Requête:**
```
POST /api/clear-history
```

**Réponse:**
```json
{
  "success": true,
  "message": "Historique effacé"
}
```

---

## 🎨 Structure Frontend

### Sections Principales

| Section | Route | Description |
|---------|-------|-------------|
| Chat | `#chat` | Interface de chat principal |
| History | `#history` | Historique des conversations |
| About | `#about` | Informations système |

### Événements JavaScript

```javascript
// Poser une question
askQuestion("Quelle est...?")

// Changer de section
switchSection("history")

// Afficher notification
showToast("Message", "success|error|info")
```

---

## ⚙️ Configuration

### Variables d'Environnement

Créez un fichier `.env`:

```env
# LLM
HUGGINGFACE_TOKEN=votre_token

# FastAPI
DEBUG=False
ENVIRONMENT=production

# RAG
CHUNK_SIZE=800
CHUNK_OVERLAP=100
RETRIEVAL_K=5
```

---

## 📊 Amélioration des Performances

### Frontend

| Optimisation | Bénéfice |
|-------------|----------|
| CSS minifié | -40% taille |
| JS lazy loading | Chargement plus rapide |
| Caching API | Moins de requêtes |
| Responsive design | Mobile optimisé |

### Backend

| Optimisation | Bénéfice |
|-------------|----------|
| Deduplication des sources | Moins de tokens |
| Chunking optimisé | Recherche plus rapide |
| Caching vectorstore | Démarrage rapide |
| Async/await | Non-bloquant |

---

## 🔐 Sécurité

### Frontend
- ✅ Pas d'exposition de secrets
- ✅ Validation inputs côté client
- ✅ Échappement HTML (XSS prevention)

### Backend
- ✅ CORS configuré
- ✅ Validation des inputs
- ✅ Gestion des erreurs
- ✅ Rate limiting (optionnel)

---

## 📝 Ajout de Nouvelles Fonctionnalités

### Ajouter un Endpoint API

**1. Backend (app.py):**
```python
@app.route("/api/new-feature", methods=["POST"])
def new_feature():
    data = request.json
    # Votre logique
    return jsonify({"success": True, "data": result})
```

**2. Frontend (js/app.js):**
```javascript
async function newFeature() {
    const response = await fetch(`${API_BASE}/new-feature`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });
    const result = await response.json();
    // Traiter le résultat
}
```

**3. HTML (index.html):**
```html
<button onclick="newFeature()">Nouvelle Fonctionnalité</button>
```

---

## 🧪 Tests

### Test Manuel Frontend

```javascript
// Console navigateur
askQuestion("Test question")
switchSection("history")
showToast("Test message", "success")
```

### Test API

```powershell
# Test health
curl http://localhost:5000/api/health

# Test question
$body = @{"question"="Test?"} | ConvertTo-Json
curl -X POST http://localhost:5000/api/ask `
     -ContentType "application/json" `
     -Body $body
```

---

## 📦 Déploiement

### Préparation

1. Installer dépendances: `pip install -r requirements.txt`
2. Configurer `.env` pour production
3. Tester localement
4. Vérifier les logs

### Deployment Options

| Plateforme | Guide |
|-----------|-------|
| Heroku | Ajouter `Procfile` |
| Docker | Ajouter `Dockerfile` |
| Windows Service | Task Scheduler |
| IIS | Créer virtual directory |

---

## 🐛 Troubleshooting

### "Module not found"
```powershell
pip install -r mini-projet-NLP/requirements.txt
```

### "Cannot find FastAPI"
```powershell
pip install fastapi uvicorn
```

### "Port already in use"
```powershell
# Changer port dans app.py
uvicorn.run(app, port=8001)  # Utiliser 8001 au lieu de 8000
```

### "Frontend ne charge pas"
```powershell
# Vérifier que app.py est à la racine
# Vérifier structure frontend/
# Rafraîchir navigateur (Ctrl+F5)
```

---

## 📚 Ressources Additionnelles

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [ChromaDB Docs](https://docs.trychroma.com/)
- [LLama Models](https://huggingface.co/meta-llama)
- [JavaScript Guide](https://developer.mozilla.org/fr/docs/Web/JavaScript)

---

## 🎯 Prochain Étapes

- [ ] Ajouter authentification utilisateur
- [ ] Implémenter pagination historique
- [ ] Ajouter filtres recherche avancée
- [ ] Créer dashboard statistiques
- [ ] Intégrer analytics
- [ ] Ajouter export PDF réponses
- [ ] Implémenter WebSocket temps réel

---

**Dernière mise à jour:** 10 Janvier 2026  
**Version:** 1.0.0
