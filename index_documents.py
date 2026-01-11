#!/usr/bin/env python3
"""
Script pour indexer les documents juridiques dans ChromaDB
"""
import os
import sys
from pathlib import Path

# Ajouter les chemins
sys.path.insert(0, str(Path(__file__).parent))
sys.path.insert(0, str(Path(__file__).parent / "backend"))

try:
    import chromadb
    from chromadb.config import Settings
except ImportError:
    print("[ERROR] chromadb non installé. Installez-le avec: pip install chromadb")
    sys.exit(1)

def load_documents(data_dir: str) -> dict:
    """Charger tous les documents texte"""
    documents = {}
    texts_dir = Path(data_dir) / "texts"
    
    if not texts_dir.exists():
        print(f"[WARNING] Répertoire {texts_dir} n'existe pas")
        return documents
    
    print(f"📂 Chargement des documents depuis {texts_dir}")
    
    for text_file in texts_dir.glob("*.txt"):
        try:
            with open(text_file, 'r', encoding='utf-8') as f:
                content = f.read()
                documents[text_file.stem] = {
                    'name': text_file.stem,
                    'content': content,
                    'path': str(text_file)
                }
                print(f"✓ Chargé: {text_file.stem} ({len(content)} caractères)")
        except Exception as e:
            print(f"✗ Erreur chargement {text_file.name}: {e}")
    
    return documents

def chunk_text(text: str, chunk_size: int = 500, overlap: int = 100) -> list:
    """Diviser le texte en chunks chevauchants"""
    chunks = []
    for i in range(0, len(text), chunk_size - overlap):
        chunk = text[i:i + chunk_size]
        if chunk.strip():
            chunks.append(chunk)
    return chunks

def index_documents(data_dir: str, db_dir: str):
    """Indexer les documents dans ChromaDB"""
    print("\n" + "="*80)
    print("[START] Indexation des documents dans ChromaDB")
    print("="*80 + "\n")
    
    # Charger les documents
    documents = load_documents(data_dir)
    
    if not documents:
        print("[ERROR] Aucun document trouvé!")
        return False
    
    print(f"\n📊 {len(documents)} document(s) chargé(s)")
    
    # Initialiser ChromaDB
    try:
        # Créer le répertoire s'il n'existe pas
        db_path = Path(db_dir)
        db_path.mkdir(parents=True, exist_ok=True)
        
        # Initialiser Chroma avec persistent client
        client = chromadb.PersistentClient(
            path=str(db_path),
            settings=Settings(
                anonymized_telemetry=False,
                allow_reset=True
            )
        )
        
        print(f"✓ ChromaDB initialisé à {db_dir}")
        
        # Créer ou obtenir la collection
        try:
            # Supprimer l'ancienne collection si elle existe
            client.delete_collection(name="legal_documents")
            print("🗑️  Ancienne collection supprimée")
        except:
            pass
        
        collection = client.get_or_create_collection(
            name="legal_documents",
            metadata={"hnsw:space": "cosine"}
        )
        
        print("✓ Collection 'legal_documents' créée\n")
        
        # Indexer les documents
        doc_count = 0
        chunk_count = 0
        
        for doc_name, doc_data in documents.items():
            content = doc_data['content']
            chunks = chunk_text(content, chunk_size=500, overlap=100)
            
            for i, chunk in enumerate(chunks):
                # ID unique pour chaque chunk
                chunk_id = f"{doc_name}_chunk_{i}"
                
                try:
                    collection.add(
                        ids=[chunk_id],
                        documents=[chunk],
                        metadatas=[{
                            "source": doc_name,
                            "chunk": i,
                            "doc_path": doc_data['path']
                        }]
                    )
                    chunk_count += 1
                except Exception as e:
                    print(f"✗ Erreur indexation chunk {chunk_id}: {e}")
            
            doc_count += 1
            print(f"✓ Indexé: {doc_name} ({len(chunks)} chunks)")
        
        print("\n" + "="*80)
        print(f"[SUCCESS] Indexation terminée!")
        print(f"  - Documents: {doc_count}")
        print(f"  - Chunks: {chunk_count}")
        print("="*80 + "\n")
        
        # Tester une recherche simple
        print("🧪 Test de recherche...")
        test_results = collection.query(
            query_texts=["Quelles sont les clauses obligatoires d'un contrat ?"],
            n_results=3
        )
        
        if test_results and test_results['documents']:
            print(f"✓ {len(test_results['documents'][0])} résultats trouvés")
            for i, doc in enumerate(test_results['documents'][0][:2], 1):
                print(f"  [{i}] {doc[:100]}...")
        else:
            print("✗ Aucun résultat trouvé")
        
        return True
        
    except Exception as e:
        print(f"[ERROR] Erreur lors de l'indexation: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    # Chemins
    project_root = Path(__file__).parent
    data_dir = project_root / "backend" / "data"
    db_dir = project_root / "backend" / "chroma_db"
    
    print(f"\n📍 Répertoire projet: {project_root}")
    print(f"📍 Répertoire données: {data_dir}")
    print(f"📍 Répertoire ChromaDB: {db_dir}\n")
    
    # Indexer
    success = index_documents(str(data_dir), str(db_dir))
    sys.exit(0 if success else 1)
