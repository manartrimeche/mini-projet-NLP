# Legal AI Chatbot avec Llama 3.2

Ce projet implémente un système **Graph-RAG** (Retrieval-Augmented Generation) pour documents juridiques utilisant:

- 🦙 **Llama 3.2** comme modèle de langage
- 🔍 **Neo4j** pour le graphe de connaissances
- 🔗 **LangChain** pour l'orchestration RAG
- 📚 **HuggingFace** pour les embeddings

## 🚀 Démarrage rapide

### 1. Installation des dépendances

```bash
pip install langchain langchain-community langchain_neo4j sentence-transformers pypdf transformers accelerate torch neo4j bitsandbytes tiktoken huggingface-hub
```

### 2. Préparer vos données

Placez vos fichiers PDF juridiques dans le dossier `data/pdfs/`:

```
mini-projet-NLP/
├── data/
│   └── pdfs/
│       ├── contract1.pdf
│       ├── agreement2.pdf
│       └── ...
```

### 3. Configurer Neo4j

Vous aurez besoin d'une instance Neo4j (gratuite sur [neo4j.com/aura](https://neo4j.com/aura)):

1. Créez un compte Neo4j Aura
2. Créez une nouvelle base de données
3. Notez vos identifiants (URI, username, password)
4. Modifiez-les dans le notebook à la cellule "Configuration Neo4j"

### 4. Configurer HuggingFace

Pour accéder à Llama 3.2:

1. Créez un compte sur [huggingface.co](https://huggingface.co)
2. Acceptez les conditions d'utilisation de Meta Llama sur [cette page](https://huggingface.co/meta-llama/Llama-3.2-3B-Instruct)
3. Créez un token d'accès dans vos paramètres HuggingFace
4. Connectez-vous dans le notebook

### 5. Lancer le notebook

Ouvrez `legal_ai_llama32.ipynb` dans VS Code ou Jupyter et exécutez les cellules dans l'ordre.

## 📋 Prérequis

### Matériel recommandé:

- **GPU**: NVIDIA avec 8GB+ VRAM (pour Llama 3.2-3B)
- **RAM**: 16GB+ système
- **Disque**: 10GB+ espace libre

### Modèles Llama 3.2 disponibles:

| Modèle                    | VRAM     | Qualité    | Recommandation     |
| ------------------------- | -------- | ---------- | ------------------ |
| Llama-3.2-1B-Instruct     | ~2GB     | Correcte   | Pour GPU limités   |
| **Llama-3.2-3B-Instruct** | **~6GB** | **Bonne**  | **✅ Recommandé**  |
| Llama-3.2-7B-Instruct     | ~12GB    | Excellente | Pour GPU puissants |

## 🏗️ Architecture

```
┌─────────────┐
│   PDF Docs  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Chunking  │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────┐
│  HuggingFace Embeddings     │
│  (paraphrase-multilingual)  │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│     Neo4j Vector Store      │
│  + Knowledge Graph (NEXT)   │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│    Retrieval (Top-K)        │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│     Llama 3.2 (4-bit)       │
│   Text Generation           │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────┐
│   Answer    │
└─────────────┘
```

## 🔧 Fonctionnalités

- ✅ Chargement automatique de PDFs
- ✅ Découpage intelligent en chunks
- ✅ Embeddings multilingues
- ✅ Recherche sémantique via Neo4j
- ✅ Graphe de connaissances avec relations
- ✅ Génération avec Llama 3.2 quantifié (4-bit)
- ✅ Historique des conversations (SQLite)
- ✅ Sources avec citations
- ✅ Interface interactive

## 📖 Utilisation

### Mode Notebook

Exécutez les cellules une par une pour comprendre chaque étape.

### Mode Interactif

```python
# Dans le notebook, exécutez:
chat_loop()
```

Puis posez vos questions:

```
❓ Votre question: Quelles sont les obligations du fournisseur?
🤖 Réponse: Selon le contrat, le fournisseur doit...
```

### Questions programmatiques

```python
answer = ask_question("De quoi parle ce document?")
print(answer)
```

## 🔍 Exemples de questions

- "De quoi traite ce document juridique?"
- "Quelles sont les principales obligations mentionnées?"
- "Quels sont les droits des parties impliquées?"
- "Quelles sont les conditions de résiliation?"
- "Quelles sont les clauses de confidentialité?"
- "Quelle est la durée du contrat?"
- "Quelles sont les pénalités en cas de non-respect?"

## 🐛 Résolution de problèmes

### Erreur: "CUDA out of memory"

- Utilisez un modèle plus petit (Llama-3.2-1B)
- Réduisez `max_length` dans `load_llm_llama32()`
- Fermez les autres applications utilisant le GPU

### Erreur: "Access denied to meta-llama"

- Acceptez les conditions d'utilisation sur HuggingFace
- Vérifiez que vous êtes connecté avec `login()`
- Attendez quelques minutes après l'acceptation

### Erreur de connexion Neo4j

- Vérifiez vos identifiants
- Assurez-vous que l'URI contient `neo4j+s://` pour SSL
- Testez la connexion dans Neo4j Browser

### PDFs non chargés

- Vérifiez que les PDFs sont dans `data/pdfs/`
- Assurez-vous qu'ils ne sont pas corrompus
- Vérifiez les permissions de lecture

## 📊 Performance

| Opération                        | Temps (approx) |
| -------------------------------- | -------------- |
| Chargement Llama 3.2-3B          | 2-3 min        |
| Création embeddings (100 chunks) | 1-2 min        |
| Ingestion Neo4j (100 chunks)     | 30 sec         |
| Requête + Génération             | 5-15 sec       |

## 🔐 Sécurité

⚠️ **Important**:

- Ne commitez JAMAIS vos identifiants Neo4j dans Git
- Ne partagez JAMAIS votre token HuggingFace
- Créez un fichier `.env` pour les secrets

Exemple `.env`:

```
NEO4J_URI=neo4j+s://xxxxx.databases.neo4j.io
NEO4J_USER=neo4j
NEO4J_PASSWORD=your-password
HF_TOKEN=your-huggingface-token
```

## 📚 Ressources

- [Documentation Llama 3.2](https://huggingface.co/meta-llama/Llama-3.2-3B-Instruct)
- [LangChain Documentation](https://python.langchain.com/)
- [Neo4j Graph Database](https://neo4j.com/docs/)
- [HuggingFace Transformers](https://huggingface.co/docs/transformers/)

## 🤝 Contribution

N'hésitez pas à:

- Signaler des bugs
- Proposer des améliorations
- Ajouter des exemples

## 📝 License

MIT License - Libre d'utilisation pour vos projets.

---

**Créé avec ❤️ pour le traitement intelligent de documents juridiques**
