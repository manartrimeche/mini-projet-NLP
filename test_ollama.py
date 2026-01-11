"""
Script de test pour vérifier l'intégration d'Ollama
"""
import sys
import os
os.environ["KMP_DUPLICATE_LIB_OK"] = "True"
from pathlib import Path

# Ajouter les chemins au path Python
BASE_DIR = Path(__file__).parent
BACKEND_DIR = BASE_DIR / "backend"
SRC_DIR = BACKEND_DIR / "src"
sys.path.insert(0, str(SRC_DIR))
sys.path.insert(0, str(BACKEND_DIR))

try:
    from rag.config import RAGConfig
    from rag.llm_manager import LLMManager
    from rag.vector_store import VectorStoreManager
    from rag.qa_system import QASystem
    from rag.database import DatabaseManager
    
    # 1. Config
    print("--- 1. Chargement de la config ---")
    config = RAGConfig()
    print(f"Modèle configuré: {config.LLM_MODEL}")
    
    # 2. LLM Manager
    print("\n--- 2. Initialisation d'Ollama ---")
    llm = LLMManager(config)
    if llm.load_model():
        print("✅ Ollama est prêt!")
    else:
        print("❌ Échec de la connexion à Ollama. Vérifiez qu'Ollama est lancé.")
        sys.exit(1)
    
    # 3. Test de génération simple
    print("\n--- 3. Test de génération simple ---")
    test_prompt = "Dis bonjour en une phrase."
    response = llm.generate(test_prompt)
    print(f"Prompt: {test_prompt}")
    print(f"Réponse: {response}")
    
    print("\n--- TEST RÉUSSI ---")

except Exception as e:
    print(f"\n❌ Erreur pendant le test: {e}")
    import traceback
    traceback.print_exc()
