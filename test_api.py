"""
Script de test pour vérifier la connexion frontend-backend
"""
import requests
import json
import time

BASE_URL = "http://localhost:8000"

def test_health():
    """Tester l'endpoint /api/health"""
    print("\n" + "="*60)
    print("[TEST] Vérification santé du système")
    print("="*60)
    try:
        response = requests.get(f"{BASE_URL}/api/health")
        print(f"Status: {response.status_code}")
        data = response.json()
        print(f"Réponse: {json.dumps(data, indent=2)}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return False

def test_ask_question():
    """Tester l'endpoint /api/ask"""
    print("\n" + "="*60)
    print("[TEST] Poser une question")
    print("="*60)
    try:
        payload = {"question": "Qu'est-ce qu'un contrat de travail?"}
        response = requests.post(f"{BASE_URL}/api/ask", json=payload)
        print(f"Status: {response.status_code}")
        data = response.json()
        print(f"Réponse: {json.dumps(data, indent=2, ensure_ascii=False)}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return False

def test_history():
    """Tester l'endpoint /api/history"""
    print("\n" + "="*60)
    print("[TEST] Récupérer l'historique")
    print("="*60)
    try:
        response = requests.get(f"{BASE_URL}/api/history?limit=5")
        print(f"Status: {response.status_code}")
        data = response.json()
        print(f"Réponse: {json.dumps(data, indent=2, ensure_ascii=False)}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return False

def test_frontend():
    """Tester si le frontend est servi"""
    print("\n" + "="*60)
    print("[TEST] Vérifier le frontend")
    print("="*60)
    try:
        response = requests.get(f"{BASE_URL}/")
        print(f"Status: {response.status_code}")
        print(f"Content-Type: {response.headers.get('content-type', 'N/A')}")
        print(f"Frontend disponible: {response.status_code == 200}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return False

if __name__ == "__main__":
    print("\n")
    print("╔" + "="*58 + "╗")
    print("║" + " TESTS DE CONNEXION FRONTEND-BACKEND ".center(58) + "║")
    print("╚" + "="*58 + "╝")
    
    results = {
        "Frontend": test_frontend(),
        "Health": test_health(),
        "Question": test_ask_question(),
        "History": test_history(),
    }
    
    print("\n" + "="*60)
    print("[RÉSUMÉ]")
    print("="*60)
    for test_name, result in results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{test_name:20} {status}")
    
    all_passed = all(results.values())
    print("\n" + "="*60)
    if all_passed:
        print("✅ TOUS LES TESTS RÉUSSIS!")
        print("Le frontend et le backend sont correctement connectés.")
    else:
        print("❌ CERTAINS TESTS ONT ÉCHOUÉ")
        print("Vérifiez que le serveur est en cours d'exécution.")
    print("="*60)
