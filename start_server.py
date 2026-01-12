#!/usr/bin/env python3
"""
Script de démarrage simplifié pour le serveur
"""
import os
import sys

# Configuration des variables d'environnement
os.environ['KMP_DUPLICATE_LIB_OK'] = 'True'
os.environ['PYTHONUNBUFFERED'] = '1'

# Ajouter les chemins
sys.path.insert(0, 'backend/src')
sys.path.insert(0, 'backend')
sys.path.insert(0, '.')

print("=" * 80)
print("[STARTUP] Vérification des dépendances...")     
print("=" * 80)

try:
    print("[1/5] Vérification de FastAPI...", end=" ")
    from fastapi import FastAPI
    print("✅")
    
    print("[2/5] Vérification de Uvicorn...", end=" ")
    import uvicorn
    print("✅")
    
    print("[3/5] Vérification de ChromaDB...", end=" ")
    import chromadb
    print("✅")
    
    print("[4/5] Vérification du système RAG...", end=" ")
    from simple_rag import RAGWithChromaDB, SimpleQASystem
    print("✅")
    
    print("[5/5] Vérification de Pydantic...", end=" ")
    from pydantic import BaseModel
    print("✅")
    
    print("\n" + "=" * 80)
    print("[SUCCESS] Toutes les dépendances sont disponibles!")
    print("=" * 80)
    
    print("\n📡 Lancement du serveur FastAPI...")
    print(f"🌐 URL: http://localhost:8001")
    print(f"📚 Docs API: http://localhost:8001/docs")
    print(f"Appuyez sur CTRL+C pour arrêter\n")
    
    # Importer l'app
    from app import app
    
    # Lancer avec Uvicorn
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8001,
        log_level="info"
    )
    
except Exception as e:
    print(f"❌\n\n[ERROR] {str(e)}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
