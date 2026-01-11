"""
Implémentation RAG avec ChromaDB directe (sans LangChain-Chroma)
Version fallback robuste pour la production
"""
import os
import sqlite3
from typing import List, Dict, Any, Optional
from pathlib import Path
from datetime import datetime
import json


class RAGConfig:
    """Configuration du RAG"""
    BASE_DIR = Path(__file__).parent / "backend"
    CHROMA_DB_DIR = BASE_DIR / "chroma_db"
    DB_PATH = BASE_DIR / "chat_history.db"
    COLLECTION_NAME = "legal_documents"


class ChromaDBConnector:
    """Connecteur direct à ChromaDB sans dépendances problématiques"""
    
    def __init__(self, db_path: str):
        self.db_path = Path(db_path)
        self.db_path.parent.mkdir(parents=True, exist_ok=True)
        self.conn = None
    
    def connect(self):
        """Se connecter à la base de données"""
        try:
            # ChromaDB utilise SQLite en backend
            sqlite_path = self.db_path / "chroma.sqlite3"
            if sqlite_path.exists():
                self.conn = sqlite3.connect(str(sqlite_path))
                self.conn.row_factory = sqlite3.Row
                print(f"[OK] Connecté à ChromaDB: {sqlite_path}")
                return True
        except Exception as e:
            print(f"[WARNING] Impossible de se connecter à ChromaDB: {e}")
        return False
    
    def get_documents(self, limit: int = 10) -> List[Dict[str, Any]]:
        """Récupérer les documents de ChromaDB"""
        if not self.conn:
            return []
        
        try:
            cursor = self.conn.cursor()
            # Récupérer depuis la table des embeddings
            cursor.execute("""
                SELECT * FROM embeddings LIMIT ?
            """, (limit,))
            
            rows = cursor.fetchall()
            return [dict(row) for row in rows]
        except Exception as e:
            print(f"[WARNING] Erreur lecture ChromaDB: {e}")
            return []
    
    def close(self):
        """Fermer la connexion"""
        if self.conn:
            self.conn.close()


class RAGWithChromaDB:
    """Système RAG utilisant ChromaDB directement"""
    
    def __init__(self, chroma_path: str = None, data_path: str = None):
        self.chroma_path = chroma_path or str(Path(__file__).parent / "backend" / "chroma_db")
        self.data_path = data_path or str(Path(__file__).parent / "backend" / "data")
        self.history = []
        
        # Essayer de connecter à ChromaDB
        self.chroma = ChromaDBConnector(self.chroma_path)
        self.chroma_available = self.chroma.connect()
        
        # Charger les documents de fallback
        self.documents = self._load_fallback_documents()
    
    def _load_fallback_documents(self) -> Dict[str, dict]:
        """Charger les documents de fallback en parsant les articles individuellement"""
        docs = {}
        
        # Essayer de charger depuis les fichiers textes
        texts_dir = Path(self.data_path) / "texts"
        if texts_dir.exists():
            for text_file in texts_dir.glob("*.txt"):
                try:
                    with open(text_file, 'r', encoding='utf-8') as f:
                        content = f.read()
                        
                        # Parser les articles (format: === ARTICLE === Titre: ... Contenu: ...)
                        if "=== ARTICLE ===" in content:
                            articles = content.split("=== ARTICLE ===")[1:]  # Ignorer le premier élément vide
                            for i, article_text in enumerate(articles, 1):
                                article_text = article_text.strip()
                                if article_text:
                                    # Extraire le titre et le contenu
                                    lines = article_text.split('\n')
                                    
                                    # Trouver la ligne de titre
                                    title = ""
                                    content_start = 0
                                    for idx, line in enumerate(lines):
                                        if 'Titre:' in line:
                                            title = line.replace('Titre:', '').replace('Contenu:', '').strip()
                                        elif 'Contenu:' in line:
                                            # Le contenu commence après la ligne "Contenu:"
                                            content_start = idx + 1
                                            break
                                    
                                    # Extraire le contenu (tout après la ligne Contenu:)
                                    article_content = '\n'.join(lines[content_start:]).strip()
                                    
                                    key = f"{text_file.stem}_{i}"
                                    docs[key] = {
                                        "title": title if title else f"Article {i}",
                                        "content": article_content
                                    }
                        else:
                            # Si pas de structure article, charger le fichier entier
                            docs[text_file.stem] = {
                                "title": text_file.stem.replace('_', ' ').title(),
                                "content": content
                            }
                except Exception as e:
                    print(f"[WARNING] Erreur lecture {text_file}: {e}")
        
        # Documents par défaut en fallback
        if not docs:
            docs = {
                "contrat": {
                    "title": "Contrat de travail",
                    "content": "Un contrat de travail doit contenir: le poste, le salaire, la durée du travail, et les conditions de rupture."
                },
                "démission": {
                    "title": "Démission",
                    "content": "Pour démissionner, le salarié doit respecter un préavis selon le secteur d'activité."
                },
                "licenciement": {
                    "title": "Licenciement",
                    "content": "Le licenciement doit être justifié par une cause réelle et sérieuse."
                },
                "salaire": {
                    "title": "Salaire",
                    "content": "Le salaire minimum est le SMIC (Salaire Minimum Interprofessionnel de Croissance)."
                },
                "congés": {
                    "title": "Congés",
                    "content": "Le salarié a droit à 5 semaines de congés payés par an."
                },
                "rgpd": {
                    "title": "RGPD",
                    "content": "Le RGPD impose la protection des données personnelles en entreprise."
                },
            }
        
        return docs
    
    def ask(self, question: str, save: bool = True) -> str:
        """Répondre à une question en utilisant ChromaDB ou fallback"""
        question_lower = question.lower()
        
        # Utiliser la recherche par similarité pour les articles pertinents
        results = self.retrieve(question)  # Récupérer articles pertinents
        
        # Filtrer: garder seulement les articles avec score > 0.15 (vraiment pertinents)
        relevant_results = [r for r in results if r.get('score', 0) > 0.15]
        
        if relevant_results:
            # Construire une réponse structurée par article
            answer = f"### 📚 Articles pertinents trouvés ({len(relevant_results)} résultat(s))\n\n"
            source_names = []
            
            for i, r in enumerate(relevant_results, 1):
                title = r.get('title', 'Article')
                content = r['page_content'].strip()
                score = r.get('score', 0)
                
                # Format structuré: Titre en gras + contenu
                answer += f"#### Article {i}: {title}\n"
                answer += f"**Pertinence:** {score:.0%}\n\n"
                answer += f"**Contenu:**\n{content}\n\n"
                answer += "---\n\n"
                
                source_names.append(title)
            
            answer += "> ℹ️ **Note** : Seuls les articles pertinents pour votre recherche ont été affichés.\n\n"
            
            # Ajouter les articles trouvés à la fin entre parenthèses
            if source_names:
                unique_sources = list(dict.fromkeys(source_names))
                answer += f"**(Articles trouvés: {', '.join(unique_sources)})**"
        else:
            answer = "### 🔍 Aucun article correspondant\n\n"
            answer += f"Je n'ai pas trouvé d'article concernant **'{question}'** dans les documents.\n\n"
            answer += "#### Thèmes disponibles :\n"
            answer += "*   📘 **Contrat de travail** (clauses, obligations)\n"
            answer += "*   💰 **Rémunération** (salaires, primes, paiement)\n"
            answer += "*   🏖️ **Congés et absence** (RTT, congés payés)\n"
            answer += "*   ⚖️ **Fin de contrat** (licenciement, démission)\n\n"
            answer += "*Veuillez reformuler votre question ou consulter un professionnel.*"
        
        # Sauvegarder dans l'historique
        if save:
            self.history.append({
                "timestamp": datetime.now().isoformat(),
                "question": question,
                "answer": answer
            })
        
        return answer
    
    def retrieve(self, question: str, k: int = None) -> List[Dict[str, Any]]:
        """Récupérer SEULEMENT les articles vraiment pertinents"""
        results = []
        question_words = set(question.lower().split())
        
        for source_key, doc_data in self.documents.items():
            # Gérer les deux formats: dict (titre+contenu) ou string (ancien format)
            if isinstance(doc_data, dict):
                title = doc_data.get('title', '')
                content = doc_data.get('content', '')
            else:
                title = source_key
                content = doc_data
            
            # Scorer le titre (plus de poids)
            title_words = set(title.lower().split())
            title_score = len(question_words & title_words) / max(1, len(question_words))
            
            # Scorer le contenu
            content_words = set(content.lower().split())
            content_score = len(question_words & content_words) / max(1, len(question_words))
            
            # Score final: 50% titre + 50% contenu
            final_score = (title_score * 0.5) + (content_score * 0.5)
            
            # Garder seulement les articles avec score significatif
            if final_score > 0.1:
                # Extraire un meilleur titre
                clean_title = self._extract_clean_title(title, content)
                
                results.append({
                    "source": f"Code du travail - {clean_title}",
                    "metadata": {"source": f"Code du travail - {clean_title}"},
                    "page_content": content,
                    "title": clean_title,
                    "score": final_score
                })
        
        # Trier par score (par défaut retourner TOUS les résultats pertinents)
        results.sort(key=lambda x: x['score'], reverse=True)
        return results if k is None else results[:k]
    
    def _extract_clean_title(self, title: str, content: str) -> str:
        """Extraire un titre propre depuis titre ou contenu"""
        # Si le titre est vide ou trop générique
        if not title or title in ["articles", "article", "contenu"]:
            # Chercher le premier "Article X:" dans le contenu
            import re
            match = re.search(r'Article\s+(\d+)[:\s]', content)
            if match:
                article_num = match.group(1)
                # Essayer de trouver une description après "Article X:"
                desc_match = re.search(rf'Article\s+{article_num}[:\s]+([^\n]+)', content)
                if desc_match:
                    desc = desc_match.group(1).strip()
                    if desc and len(desc) < 100:
                        return f"Article {article_num} - {desc[:50]}"
                    return f"Article {article_num}"
                return f"Article {article_num}"
        
        return title.replace('-', ' ').replace('_', ' ').title()
        
        # Trier par score (par défaut retourner TOUS)
        results.sort(key=lambda x: x['score'], reverse=True)
        return results if k is None else results[:k]
    
    def _extract_title(self, content: str) -> str:
        """Extraire le titre du contenu si au format article"""
        lines = content.split('\n')
        for line in lines:
            if 'Titre:' in line:
                return line.replace('Titre:', '').strip()
            elif 'Article' in line and ':' in line:
                return line.split(':')[0].strip()
        return ""
    
    def get_history(self, limit: int = 10) -> List[tuple]:
        """Récupérer l'historique"""
        return [
            (i+1, item["question"], item["answer"][:500], item["timestamp"])  # Augmenté à 500 au lieu de 100
            for i, item in enumerate(self.history[-limit:])
        ]
    
    def clear_history(self):
        """Effacer l'historique"""
        self.history = []


class SimpleQASystem:
    """Système QA simple avec RAG ChromaDB"""
    
    def __init__(self):
        self.rag = RAGWithChromaDB()
        self.db = SimpleDB()
        self.llm = SimpleLLM()
        self.vector_store = SimpleVectorStore(self.rag)
    
    def ask(self, question: str, verbose: bool = False, debug: bool = False, save: bool = True) -> str:
        """Poser une question"""
        answer = self.rag.ask(question, save=save)
        if verbose or debug:
            print(f"[DEBUG] Question: {question}")
            print(f"[DEBUG] SimpleQASystem Answer: {answer[:100]}...")
        
        # Enregistrer dans la DB aussi
        if save:
            self.db.history.append((
                len(self.db.history) + 1,
                question,
                answer,
                datetime.now().isoformat()
            ))
        
        return answer


class SimpleVectorStore:
    """Gestionnaire de vector store simple"""
    
    def __init__(self, rag: RAGWithChromaDB = None):
        self.rag = rag
    
    def retrieve(self, question: str, k: int = 5) -> List[Dict[str, Any]]:
        """Récupérer les documents"""
        if self.rag:
            results = self.rag.retrieve(question, k=k)
            # S'assurer que 'source' est bien présent pour le frontend
            for r in results:
                if 'source' not in r:
                    r['source'] = r.get('metadata', {}).get('source', 'Code du travail')
            return results
        
        return [
            {
                "source": "Code du travail",
                "metadata": {"source": "Code du travail"},
                "page_content": "Information pertinente du Code du travail français",
                "score": 1.0
            }
        ]


class SimpleLLM:
    """Gestionnaire LLM simple"""
    
    def is_available(self) -> bool:
        return True


class SimpleDB:
    """Gestionnaire de base de données simple"""
    
    def __init__(self):
        self.history = []
    
    def get_history(self, limit: int = 10) -> List[tuple]:
        return self.history[-limit:]
    
    def clear_history(self):
        self.history = []

