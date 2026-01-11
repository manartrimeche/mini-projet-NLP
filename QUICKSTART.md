# ⚡ QUICKSTART - 5 minutes

## 1️⃣ Terminal 1 - Backend

```bash
cd c:\Users\RSCH\mini-projet-NLP
python app.py
```

✅ Attendez: "Demarrage du serveur FastAPI"
✅ Vérifiez: http://localhost:8000/api/health

## 2️⃣ Terminal 2 - Frontend

```bash
cd c:\Users\RSCH\mini-projet-NLP\frontend
npm install  # si première fois
npm run dev
```

✅ Attendez: "VITE v5.4.19  ready in..."
✅ Accès: http://localhost:8080

## 3️⃣ Browser - Vérification

```
http://localhost:8080/diagnostics
```

✅ Cliquez: "Tester à nouveau"
✅ Vérifiez: Tous les statuts sont ✅

---

## 🎯 Si ça marche

Bravo! 🎉 

Le frontend et le backend sont connectés.

- Chatbot: http://localhost:8080/chatbot
- Documents: http://localhost:8080/documents
- Analyse: http://localhost:8080/analysis
- Historique: http://localhost:8080/history

---

## 🆘 Si ça ne marche pas

### Erreur 1: "Cannot GET /diagnostics"
- Attendez quelques secondes que Vite se charge
- Rechargez la page (F5)

### Erreur 2: "API not responding"
- Vérifiez que le backend s'exécute
- Vérifiez: http://localhost:8000/api/health

### Erreur 3: "RAG not ready"
- C'est normal, attendez 30-60 secondes au démarrage

### Erreur 4: "Module not found"
```bash
cd frontend
npm install
npm run dev
```

### Erreur 5: Autre
- Ouvrez F12 (console du navigateur)
- Consultez [RESUME_COURT.md](./RESUME_COURT.md)

---

## ✅ Checklist rapide

- [ ] Backend démarre sans erreurs
- [ ] Frontend démarre sans erreurs
- [ ] ApiStatus affiche "Connecté" (vert)
- [ ] Diagnostics affiche tous ✅
- [ ] Chatbot peut envoyer un message

Si tout est coché ✅, c'est bon!

---

**Prêt?** Consultez [RESUME_COURT.md](./RESUME_COURT.md) pour plus de détails.

**Besoin d'aide?** Voir [DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md)
