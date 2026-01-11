import requests
import json

def test_api():
    base_url = "http://localhost:8001/api"
    
    print("\n--- Testing Ask (Improved) ---")
    try:
        # Question about clauses should now return actual document content
        ask_payload = {"question": "Quelles sont les clauses d'un contrat de travail ?"}
        ask_resp = requests.post(f"{base_url}/ask", json=ask_payload)
        print(f"Ask Status Code: {ask_resp.status_code}")
        data = ask_resp.json()
        print(f"Answer: {data.get('answer')[:200]}...")
        print("Sources:")
        for s in data.get('sources', []):
            print(f" - {s.get('name')}")
    except Exception as e:
        print(f"Ask request failed: {e}")

if __name__ == "__main__":
    test_api()
