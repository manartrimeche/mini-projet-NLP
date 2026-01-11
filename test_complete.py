#!/usr/bin/env python
"""Test complet du système FastAPI + Frontend"""
import subprocess
import time
import requests
import sys
import os
import signal

def test_api():
    """Tester les endpoints API"""
    print("\n" + "="*80)
    print("TEST API FASTAPI")
    print("="*80)
    
    try:
        # Test 1: Health check
        print("\n[1] Test /api/health...")
        r = requests.get("http://localhost:8000/api/health", timeout=5)
        print(f"    Status: {r.status_code}")
        if r.status_code == 200:
            data = r.json()
            print(f"    RAG Ready: {data.get('rag_ready', False)}")
            print("    [OK] PASS")
        else:
            print(f"    [FAIL] {r.text}")
            return False
        
        # Test 2: POST /api/ask
        print("\n[2] Test /api/ask...")
        question = "Qu'est-ce qu'un contrat de travail?"
        r = requests.post(
            "http://localhost:8000/api/ask",
            json={"question": question},
            timeout=10
        )
        print(f"    Status: {r.status_code}")
        if r.status_code == 200:
            data = r.json()
            print(f"    Question: {data.get('question', 'N/A')[:50]}...")
            print(f"    Answer: {data.get('answer', 'N/A')[:100]}...")
            print(f"    Sources: {len(data.get('sources', []))} trouvés")
            print("    [OK] PASS")
        else:
            print(f"    [FAIL] {r.text}")
            return False
        
        # Test 3: GET /api/history
        print("\n[3] Test /api/history...")
        r = requests.get("http://localhost:8000/api/history?limit=5", timeout=5)
        print(f"    Status: {r.status_code}")
        if r.status_code == 200:
            data = r.json()
            print(f"    Historique: {len(data.get('history', []))} items")
            print("    [OK] PASS")
        else:
            print(f"    [FAIL] {r.text}")
            return False
        
        print("\n" + "="*80)
        print("[OK] TOUS LES TESTS PASSES!")
        print("="*80)
        return True
        
    except requests.exceptions.ConnectionError as e:
        print(f"[FAIL] Erreur de connexion: {e}")
        print("   Le serveur FastAPI n'est pas en cours d'exécution")
        return False
    except Exception as e:
        print(f"[FAIL] Erreur: {e}")
        return False


def start_server():
    """Démarrer le serveur FastAPI"""
    print("\n[START] Demarrage du serveur FastAPI...")
    print("        Port: 8000")
    print("        Frontend: http://localhost:8000")
    print("        Docs: http://localhost:8000/docs")
    
    try:
        # Lancer FastAPI en arrière-plan
        proc = subprocess.Popen(
            [sys.executable, "app.py"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        
        # Attendre que le serveur démarre
        time.sleep(5)
        
        # Vérifier que le processus est encore en cours
        if proc.poll() is not None:
            stdout, stderr = proc.communicate()
            print(f"[FAIL] Le serveur n'a pas demarré correctement:")
            print(f"   STDOUT: {stdout}")
            print(f"   STDERR: {stderr}")
            return None
        
        print("[OK] Serveur demarre (PID: {})".format(proc.pid))
        return proc
        
    except Exception as e:
        print(f"[FAIL] Erreur au demarrage: {e}")
        return None


def main():
    """Fonction principale"""
    print("\n" + "="*80)
    print("TEST COMPLET: FastAPI + ChromaDB RAG")
    print("="*80)
    
    # Démarrer le serveur
    proc = start_server()
    if not proc:
        print("[FAIL] Impossible de demarrer le serveur")
        sys.exit(1)
    
    try:
        # Tester l'API
        success = test_api()
        
        if success:
            print("\n[OK] Systeme operationnel!")
            print("   Frontend: http://localhost:8000")
            print("   API: http://localhost:8000/api/*")
            print("   Docs: http://localhost:8000/docs")
            sys.exit(0)
        else:
            print("\n[FAIL] Certains tests ont echoue")
            sys.exit(1)
            
    finally:
        # Arrêter le serveur
        print("\n[STOP] Arret du serveur...")
        proc.terminate()
        try:
            proc.wait(timeout=5)
        except subprocess.TimeoutExpired:
            proc.kill()
        print("[OK] Serveur arrete")


if __name__ == "__main__":
    main()
