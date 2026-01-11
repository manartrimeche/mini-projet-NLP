# 🚀 Guide de Démarrage Rapide - Frontend

## ✅ Prérequis

- ✔️ Python 3.10+
- ✔️ Dépendances RAG installées
- ✔️ ChromaDB initialized
- ✔️ Navigateur moderne (Chrome, Firefox, Safari, Edge)

---

## 📦 Installation Rapide (5 minutes)

### 1. Installer FastAPI et dépendances

```powershell
# Activez l'env
cd C:\Users\RSCH\mini-projet-NLP
& .\.venv\Scripts\Activate.ps1

# Installer les dépendances du serveur
pip install fastapi uvicorn python-dotenv
```

### 2. Vérifier la Structure

Assurez-vous que vous avez:
```
mini-projet-NLP/
├── app.py                    ✅ Serveur principal
├── frontend/
│   ├── index.html           ✅ Interface
│   ├── css/style.css        ✅ Styles
│   ├── js/app.js            ✅ Logique
│   └── css/responsive.css   ✅ Responsive
└── mini-projet-NLP/
    └── src/rag/             ✅ Système RAG
```

### 3. Démarrer le Serveur

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

### 4. Ouvrir dans le Navigateur

👉 Allez à: **http://localhost:8000**

---

## 🎯 Utilisation Rapide

### Exemple 1: Poser une Question Simple

1. **Ouvrez le chat** (section par défaut)
2. **Tapez votre question:**
   ```
   Quelle est la durée légale du travail en France?
   ```
3. **Appuyez sur Enter** ou cliquez l'icône papier avion
4. **Attendez la réponse** ⏳

### Exemple 2: Utiliser les Boutons Rapides

Cliquez sur l'un des boutons suggérés:
- ⏱️ Durée du travail
- 🏖️ Congés payés
- 📋 Licenciement
- 💰 SMIC

### Exemple 3: Consulter l'Historique

1. **Cliquez sur "📚 Historique"** dans le menu
2. **Voir toutes vos conversations**
3. **Cliquez sur "Effacer" pour nettoyer** (optionnel)

---

## 🎨 Personnalisation Rapide

### Changer les Couleurs

Modifiez `frontend/css/style.css`:

```css
:root {
    --primary: #2c3e50;      /* Couleur principale */
    --secondary: #3498db;    /* Couleur accent */
    --accent: #e74c3c;       /* Couleur danger */
}
```

### Ajouter un Logo

Replacez le texte "Legal AI" dans `frontend/index.html`:

```html
<div class="logo">
    <img src="assets/logo.png" alt="Logo" style="width:40px;">
    <h1>Mon Assisant Juridique</h1>
</div>
```

### Modifier le Titre de la Page

Dans `frontend/index.html`:

```html
<title>Mon Titre Custom - Code du Travail Assistant</title>
```

---

## 🔧 Configuration

### Créer un Fichier `.env`

```env
# Mode
ENVIRONMENT=development
DEBUG=False

# LLM (Optionnel)
HUGGINGFACE_TOKEN=votre_token_ici

# RAG
CHUNK_SIZE=800
CHUNK_OVERLAP=100
RETRIEVAL_K=5
```

### Port Personnalisé

Dans `app.py`, changez:

```python
if __name__ == "__main__":
    init_rag_system()
    # Changer 5000 par votre port
    app.run(debug=True, host="0.0.0.0", port=8080)
```

Puis accédez: `http://localhost:8080`

---

## 📱 Responsive Design

L'interface s'adapte automatiquement à:
- 📺 Desktop (1920px+)
- 💻 Laptop (1200px)
- 📱 Tablet (768px)
- 📲 Mobile (480px)
- 📱 Mobile Mini (320px)

Testez avec F12 → Mode appareil mobile

---

## 🌙 Mode Sombre (Auto)

Le site détecte automatiquement:
```powershell
# Windows 10/11
Paramètres → Personnalisation → Couleurs → Mode sombre
```

L'interface s'adaptera automatiquement.

---

## ⌨️ Raccourcis Clavier

| Raccourci | Action |
|-----------|--------|
| `Ctrl+L` ou `Cmd+L` | Focus input question |
| `Escape` | Fermer menu mobile |
| `Enter` | Soumettre question |

---

## 🐛 Dépannage Rapide

### ❌ "Cannot access localhost"

```powershell
# Vérifiez que FastAPI est démarré
# Si port 8000 utilisé, utilisez 8001
python app.py  # Attendez le message ✅
```

### ❌ "Frontend charge mais chat ne marche pas"

```powershell
# Ouvrez F12 → Console et vérifiez les erreurs
# Si "404 /api/ask", assurez-vous app.py est à la racine
# Rechargez la page (Ctrl+F5)
```

### ❌ "RAG not initialized"

```powershell
# Vérifiez les logs du serveur
# Si ChromaDB error: reconstruisez l'index
python migrate_db.py  # Si le fichier existe
```

### ❌ "Questions trop lentes"

```python
# Réduisez RETRIEVAL_K dans config.py:
RETRIEVAL_K: int = 3  # Au lieu de 5

# Ou réduisez max_length:
LLM_MAX_LENGTH: int = 128  # Au lieu de 256
```

---

## 📊 Monitoring

### Vérifier le Status

```javascript
// Console navigateur (F12)
fetch('/api/health').then(r => r.json()).then(console.log)
```

**Réponse attendue:**
```json
{
  "status": "ok",
  "rag_ready": true,
  "llm_available": true
}
```

### Voir les Logs Serveur

Les logs FastAPI s'affichent dans le terminal:
```
127.0.0.1 - - [10/Jan/2026 14:30:00] "POST /api/ask HTTP/1.1" 200 -
```

---

## 🎓 Exemples de Questions

### Générales
- Qu'est-ce que le code du travail français?
- Résume les principales sections du code du travail
- Quels sont les principaux droits des salariés?

### Durée du Travail
- Quelle est la durée légale du travail en France?
- Comment sont calculées les heures supplémentaires?
- Qu'est-ce que le repos hebdomadaire?

### Congés
- Comment fonctionne le système de congés payés?
- Combien de jours de congés payés par an?
- Comment sont gérés les congés maladie?

### Contrats
- Quelle est la différence entre CDI et CDD?
- Comment fonctionne la période d'essai?

### Salaires
- Quel est le salaire minimum en France?
- Quelles sont les règles sur les primes?

### Licenciement
- Quels sont les différents types de licenciement?
- Quelles sont les indemnités de licenciement?

---

## 🚀 Opérations Avancées

### Ajouter un Endpoint Personnalisé

**Backend (app.py):**
```python
@app.route("/api/custom", methods=["POST"])
def custom_endpoint():
    data = request.json
    # Votre logique ici
    return jsonify({"result": "..."})
```

**Frontend (js/app.js):**
```javascript
async function callCustom() {
    const res = await fetch(`${API_BASE}/custom`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({key: "value"})
    });
    console.log(await res.json());
}
```

**HTML (index.html):**
```html
<button onclick="callCustom()">Mon Bouton</button>
```

### Ajouter une Section Personnalisée

1. **Ajouter le HTML:**
```html
<section id="custom" class="section">
    <div class="container">
        <h2>Ma Section Personnalisée</h2>
        <!-- Votre contenu -->
    </div>
</section>
```

2. **Ajouter au menu:**
```html
<a href="#" class="nav-link" data-section="custom">🔧 Custom</a>
```

3. **Ajouter la logique (optionnel):**
```javascript
if (sectionId === 'custom') {
    // Votre logique de chargement
}
```

---

## 📦 Déploiement Simple

### Sur Windows Localement

```powershell
# Créer un raccourci sur le bureau
# Cible: C:\Users\RSCH\mini-projet-NLP\.venv\Scripts\pythonw.exe C:\Users\RSCH\mini-projet-NLP\app.py
# Démarrage: C:\Users\RSCH\mini-projet-NLP
```

### Utiliser avec ngrok (partage public)

```powershell
# Installer ngrok
choco install ngrok

# Exposer votre serveur
ngrok http 8000

# URL publique: https://xxx-xxx-xxx.ngrok.io
```

---

## ✨ Tips & Tricks

### 💡 Développement Rapide

```powershell
# Mode développement FastAPI
$env:ENVIRONMENT = "development"
python app.py
```

### 🔄 Vider le Cache

```javascript
// Console navigateur
localStorage.clear()
location.reload()
```

### 📸 Capturer les Réponses

Chaque réponse est sauvegardée dans l'historique SQLite:
```powershell
# Consulter la DB
python -c "import sqlite3; db = sqlite3.connect('chat_history.db'); cursor = db.execute('SELECT * FROM conversations'); print(cursor.fetchall())"
```

---

## 🎯 Prochaines Étapes

1. **✅ Frontend lancé** - Continuez ici! 🎉
2. **[Optionnel] Ajouter authentification** - Voir ARCHITECTURE.md
3. **[Optionnel] Intégrer statistiques** - Google Analytics
4. **[Optionnel] Mobiliser comme app** - PWA

---

## 📞 Support

- 📖 Documentation: Voir `docs/ARCHITECTURE.md`
- 🐛 Erreurs: Consulter console (F12)
- 🔍 Logs serveur: Voir terminal Python

---

**Bon travail! 🎉 Votre frontend est prêt à l'emploi!**
