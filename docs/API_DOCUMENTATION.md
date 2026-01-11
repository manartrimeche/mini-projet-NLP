# API Documentation

## Endpoints disponibles

### 1. Health Check
**GET** `/api/health`

Vérifie l'état du système RAG.

**Réponse:**
```json
{
  "status": "ok",
  "rag_ready": true,
  "llm_available": true
}
```

---

### 2. Poser une question
**POST** `/api/ask`

Pose une question au système RAG et obtient une réponse avec sources.

**Requête:**
```json
{
  "question": "Qu'est-ce que le code du travail?"
}
```

**Réponse:**
```json
{
  "success": true,
  "question": "Qu'est-ce que le code du travail?",
  "answer": "Le Code du travail est...",
  "sources": [
    {
      "name": "document.txt",
      "excerpt": "Extrait du document..."
    }
  ],
  "source_count": 3
}
```

**Codes d'erreur:**
- `400`: Question vide
- `503`: Système RAG non initialisé
- `500`: Erreur interne

---

### 3. Historique des conversations
**GET** `/api/history?limit=10`

Récupère l'historique des conversations.

**Paramètres:**
- `limit` (optionnel): Nombre maximum d'entrées (défaut: 10)

**Réponse:**
```json
{
  "success": true,
  "history": [
    {
      "id": 1,
      "question": "Question 1",
      "answer": "Réponse 1",
      "timestamp": "2026-01-10 10:00:00"
    }
  ]
}
```

---

### 4. Frontend
**GET** `/`

Charge la page d'accueil du frontend HTML.

---

### 5. Documentation Swagger
**GET** `/docs`

Accédez à la documentation interactive Swagger UI de l'API.

---

## CORS

La configuration CORS permet les requêtes de tous les domaines (développement).

Pour la production, modifiez `allow_origins` dans `app.py`:

```python
allow_origins=[
    "https://yourdomain.com",
    "https://www.yourdomain.com"
]
```

## Erreurs courantes

### Port déjà utilisé
```
ERROR: [Errno 10048] error while attempting to bind on address ('0.0.0.0', 5000)
```

Solution:
```powershell
Get-Process python | Stop-Process -Force
```

### Système RAG non initialisé
Assurez-vous que les documents sont dans `./mini-projet-NLP/data/cleaned/`

### Timeout sur les requêtes
Augmentez le timeout sur le client:
```python
requests.post(url, json=data, timeout=30)
```
