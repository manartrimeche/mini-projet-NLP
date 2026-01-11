#!/usr/bin/env python
"""Test rapide de l'API"""
import requests
import json
import sys

try:
    print("\n[TEST] Santé du système...")
    r = requests.get("http://localhost:8000/api/health", timeout=5)
    print(f"Status: {r.status_code}")
    print(f"Response: {r.text[:200]}\n")
    
    if r.status_code == 200:
        print("✅ API est opérationnel!")
    else:
        print(f"❌ Erreur API: {r.status_code}")
        sys.exit(1)
        
except Exception as e:
    print(f"❌ Erreur de connexion: {e}")
    sys.exit(1)
