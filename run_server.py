#!/usr/bin/env python
"""
Script de démarrage propre du serveur FastAPI
Gère l'environnement et les logs proprement
"""
import os
import sys
import logging
from pathlib import Path

# Configuration des logs AVANT les imports
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

# Désactiver les logs verbeux
logging.getLogger("mlflow").setLevel(logging.WARNING)
logging.getLogger("transformers").setLevel(logging.WARNING)
logging.getLogger("huggingface_hub").setLevel(logging.WARNING)
logging.getLogger("urllib3").setLevel(logging.WARNING)

# Variables d'environnement
os.environ["KMP_DUPLICATE_LIB_OK"] = "True"
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"

def start_server(host: str = "0.0.0.0", port: int = 5000, reload: bool = False):
    """Démarrer le serveur FastAPI"""
    import uvicorn
    
    print("\n" + "="*80)
    print("Legal AI - Serveur RAG")
    print("="*80)
    print(f"Démarrage sur http://{host}:{port}")
    print(f"Documentation API: http://{host}:{port}/docs")
    print("Appuyez sur CTRL+C pour arrêter")
    print("="*80 + "\n")
    
    uvicorn.run(
        "app:app",
        host=host,
        port=port,
        reload=reload,
        log_level="info",
        access_log=True
    )

if __name__ == "__main__":
    # Vérifier que nous sommes dans le bon répertoire
    if not Path("app.py").exists():
        print("❌ Erreur: app.py non trouvé. Lancez le script depuis la racine du projet.")
        sys.exit(1)
    
    # Démarrer
    try:
        start_server()
    except KeyboardInterrupt:
        print("\n\nServeur arrêté.")
        sys.exit(0)
    except Exception as e:
        print(f"\n❌ Erreur: {e}")
        sys.exit(1)
