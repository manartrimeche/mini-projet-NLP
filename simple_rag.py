"""
Module Simple RAG - Wrapper autour du système RAG complet
Pour compatibilité avec app.py
"""
import sys
from pathlib import Path

# Configuration des chemins
BASE_DIR = Path(__file__).parent
BACKEND_DIR = BASE_DIR / "backend"
SRC_DIR = BACKEND_DIR / "src"

sys.path.insert(0, str(SRC_DIR))
sys.path.insert(0, str(BACKEND_DIR))

try:
    from rag.config import RAGConfig
    from rag.qa_system import QASystem
    from rag.vector_store import VectorStoreManager
    from rag.llm_manager import LLMManager
    from rag.database import DatabaseManager
except ImportError as e:
    print(f"[WARNING] Erreur import RAG complet: {e}")
    raise


class SimpleQASystem:
    """
    Système QA simplifié - Wrapper autour du système RAG complet
    """
    
    def __init__(self):
        """Initialiser le système RAG simplifié"""
        try:
            # Configuration
            self.config = RAGConfig()
            
            # Vector Store
            self.vector_store = VectorStoreManager(self.config)
            self.vector_store.initialize_embeddings()
            
            # Charger ou créer le vector store
            documents = self.vector_store.load_documents(self.config.CLEANED_DIR)
            if documents:
                chunks = self.vector_store.chunk_documents(documents)
                self.vector_store.create_vectorstore(chunks)
            else:
                print("[WARNING] Aucun document a traiter, continuant sans vector store")
                self.vector_store.vectorstore = None
            
            # LLM
            self.llm = LLMManager(self.config)
            self.llm.load_model()
            
            # Database
            self.db = DatabaseManager(self.config.DB_PATH)
            
            # QA System
            self.qa_system = QASystem(self.vector_store, self.llm, self.db)
            
            print("[OK] SimpleQASystem initialisé avec succès")
            
        except Exception as e:
            print(f"[ERROR] Erreur initialisation SimpleQASystem: {e}")
            raise
    
    def ask(self, question: str, verbose: bool = False, debug: bool = False, save: bool = True) -> str:
        """
        Répondre à une question - Compatible avec QASystem.ask()
        
        Args:
            question: La question posée
            verbose: Afficher les détails
            debug: Mode debug
            save: Sauvegarder dans l'historique
        
        Returns:
            La réponse générée
        """
        try:
            answer = self.qa_system.ask(question, verbose=verbose, debug=debug, save=save)
            return answer
        except Exception as e:
            print(f"[ERROR] Erreur lors de la réponse: {e}")
            raise
    
    def answer(self, question: str, verbose: bool = False) -> dict:
        """
        Répondre à une question avec sources
        
        Args:
            question: La question posée
            verbose: Afficher les détails
        
        Returns:
            Dict avec la réponse et les sources
        """
        try:
            answer = self.ask(question, verbose=verbose)
            
            # Récupérer les sources
            if self.vector_store.vectorstore:
                relevant_docs = self.vector_store.retrieve(question)
                sources = [doc.metadata.get('source', 'Unknown') for doc in relevant_docs]
            else:
                sources = []
            
            return {
                "success": True,
                "question": question,
                "answer": answer,
                "sources": sources,
                "source_count": len(sources)
            }
        except Exception as e:
            print(f"[ERROR] Erreur lors de la réponse: {e}")
            return {
                "success": False,
                "question": question,
                "answer": f"Erreur: {str(e)}",
                "sources": [],
                "source_count": 0
            }
    
    def get_health(self) -> dict:
        """Vérifier la santé du système"""
        return {
            "status": "ok",
            "rag_ready": self.qa_system is not None,
            "llm_available": self.llm.model is not None,
            "vectorstore": self.vector_store.vectorstore is not None
        }
