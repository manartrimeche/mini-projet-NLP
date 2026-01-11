print("Importing sys, os, io, Path...")
import sys
import os
import io
from pathlib import Path
print("Importing contextlib, logging...")
from contextlib import asynccontextmanager
import logging

print("BOOTING SERVER...")

# Fix encoding sur Windows
# if sys.platform == 'win32':
#     sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

print("Configuring logs...")
# Configurer les logs AVANT les imports
logging.getLogger("mlflow").setLevel(logging.WARNING)
logging.getLogger("transformers").setLevel(logging.WARNING)
logging.getLogger("huggingface_hub").setLevel(logging.WARNING)
logging.getLogger("chromadb").setLevel(logging.WARNING)
logging.getLogger("opentelemetry").setLevel(logging.ERROR)
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"
os.environ["TOKENIZERS_PARALLELISM"] = "false"

print("Setting paths...")
# Configuration de base
BASE_DIR = Path(__file__).parent
BACKEND_DIR = BASE_DIR / "backend"
SRC_DIR = BACKEND_DIR / "src"

# Ajouter les chemins au path Python AVANT les imports
sys.path.insert(0, str(SRC_DIR))  # Pour que 'from rag import ...' fonctionne
sys.path.insert(0, str(BACKEND_DIR))
sys.path.insert(0, str(BASE_DIR))

print("Importing FastAPI components...")
# Imports FastAPI
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel
import uvicorn
from dotenv import load_dotenv
from opencensus.ext.azure.log_exporter import AzureLogHandler

print("Loading dotenv...")
load_dotenv()

# ============================================================
# LOGGING & APPLICATION INSIGHTS
# ============================================================
logger = logging.getLogger("legal-ai-api")
APPINSIGHTS_CONN = os.getenv("APPLICATIONINSIGHTS_CONNECTION_STRING")

if APPINSIGHTS_CONN:
    try:
        handler = AzureLogHandler(connection_string=APPINSIGHTS_CONN)
        logger.addHandler(handler)
        logger.info("app_startup", extra={
            "custom_dimensions": {
                "event_type": "startup",
                "status": "application_insights_connected"
            }
        })
    except Exception as e:
        print(f"[WARNING] Erreur connexion Application Insights: {e}")
else:
    logger.warning("app_startup", extra={
        "custom_dimensions": {
            "event_type": "startup",
            "status": "application_insights_not_configured"
        }
    })

# Variables globales pour le système RAG
qa_system = None
config = None

print("Importing RAG components...")
# Imports RAG


try:
    from rag.config import RAGConfig
    from rag.qa_system import QASystem
    from rag.vector_store import VectorStoreManager
    from rag.llm_manager import LLMManager
    from rag.database import DatabaseManager
    RAG_AVAILABLE = True
    print("[OK] Modules RAG importés avec succès")
except ImportError as e:
    print(f"[WARNING] Erreur import RAG: {e}")
    RAG_AVAILABLE = False
except Exception as e:
    print(f"[WARNING] Erreur initialisation RAG: {type(e).__name__}: {e}")
    RAG_AVAILABLE = False

# Fallback/Simple RAG always available
print("Initialisation RAG simple...")
try:
    from simple_rag import SimpleQASystem, RAGConfig as SimpleRAGConfig
    SIMPLE_RAG_AVAILABLE = True
    print("[OK] Modules RAG simples chargés")
except Exception as e:
    print(f"[WARNING] Modules RAG simples non disponibles: {e}")
    SIMPLE_RAG_AVAILABLE = False


# ============ MODÈLES PYDANTIC ============

class QuestionRequest(BaseModel):
    """Modèle pour une question"""
    question: str


class HealthResponse(BaseModel):
    """Réponse de santé du système"""
    status: str
    rag_ready: bool
    llm_available: bool


class AnswerResponse(BaseModel):
    """Réponse à une question"""
    success: bool
    question: str
    answer: str
    sources: list
    source_count: int


class HistoryItem(BaseModel):
    """Item d'historique"""
    id: int
    question: str
    answer: str
    timestamp: str


class HistoryResponse(BaseModel):
    """Réponse d'historique"""
    success: bool
    history: list[HistoryItem]


# ============ FONCTIONS INITIALES ============

# Mode de fonctionnement
FORCE_SIMPLE_RAG = True  # Toujours utiliser le mode simple pour la stabilité locale

def init_rag_system():
    """Initialiser le système RAG au démarrage"""
    global qa_system, config
    
    if FORCE_SIMPLE_RAG or not RAG_AVAILABLE:
        print("[INFO] Utilisation du mode RAG simple (plus rapide et stable)")
        if SIMPLE_RAG_AVAILABLE:
            try:
                qa_system = SimpleQASystem()
                print("[OK] Systeme RAG (simple) pret!")
                return True
            except Exception as e:
                print(f"[ERROR] Impossible d'initialiser RAG simple: {e}")
                return False
        else:
            print("[ERROR] Aucun système RAG disponible")
            return False
    
    # Sinon, utiliser le vrai RAG
    try:
        print("[INIT] Initialisation du systeme RAG complet...")
        
        # Vérifier que tous les modules sont importés
        if not all([VectorStoreManager, LLMManager, DatabaseManager]):
            print("[ERROR] Modules RAG incomplètement importés")
            raise ImportError("Modules RAG manquants")
        
        # Config
        config = RAGConfig()
        
        # Vector Store
        vector_store = VectorStoreManager(config)
        vector_store.initialize_embeddings()
        
        # Charger ou créer le vector store
        documents = vector_store.load_documents(config.CLEANED_DIR)
        if documents:
            chunks = vector_store.chunk_documents(documents)
            vector_store.create_vectorstore(chunks)
        else:
            print("[WARNING] Aucun document a traiter, continuant sans vector store")
            vector_store.vectorstore = None
        
        # LLM
        llm = LLMManager(config)
        llm.load_model()
        
        # Database
        db = DatabaseManager(config.DB_PATH)
        
        # QA System
        qa_system = QASystem(vector_store, llm, db)
        
        print("[OK] Systeme RAG complet pret!")
        return True
    except Exception as e:
        print(f"[ERROR] Erreur initialisation RAG complet: {e}")
        if SIMPLE_RAG_AVAILABLE:
            print("[WARNING] Basculement vers mode fallback simple...")
            try:
                qa_system = SimpleQASystem()
                print("[OK] Mode fallback activé")
                return True
            except Exception as ex:
                print(f"[ERROR] Échec fatal du fallback: {ex}")
                return False
        else:
            return False


# ============ LIFESPAN (Startup/Shutdown) ============

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Gestion du cycle de vie de l'app"""
    # Startup
    print("=" * 80)
    print("[LEGAL AI] Serveur FastAPI")
    print("=" * 80)
    init_rag_system()
    print(f"Frontend: {BASE_DIR / 'frontend'}")
    print(f"Backend: {BACKEND_DIR}")
    print("=" * 80)
    yield
    # Shutdown
    print("\n[SHUTDOWN] Arret du serveur...")


# ============ CRÉATION APP ============

app = FastAPI(
    title="Legal AI API",
    description="API RAG pour le Code du Travail Français",
    version="1.0.0",
    lifespan=lifespan
)

# ============ MIDDLEWARE CORS ============

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============ ROUTES STATIQUES ============

# Les routes statiques sont définies à la FIN pour ne pas intercepter l'API
# Voir section "ROUTES STATIQUES (MOUNTED LAST)" ci-dessous


# ============ ROUTES API ============

@app.get("/api/health", response_model=HealthResponse)
async def health():
    """
    Vérifier l'état du système RAG
    
    Retourne:
    - status: État général du serveur
    - rag_ready: Si le système RAG est initialisé
    - llm_available: Si le modèle LLM est disponible
    """
    return HealthResponse(
        status="ok",
        rag_ready=qa_system is not None,
        llm_available=qa_system.llm.is_available() if qa_system else False
    )


@app.post("/api/ask", response_model=AnswerResponse)
async def ask_question(request: QuestionRequest):
    """
    Poser une question au système RAG
    
    Args:
        request: Objet contenant la question
        
    Returns:
        AnswerResponse avec la réponse et les sources
        
    Raises:
        HTTPException 503: Si le système RAG n'est pas initialisé
        HTTPException 400: Si la question est vide
    """
    if not qa_system:
        raise HTTPException(
            status_code=503,
            detail="Système RAG non initialisé"
        )
    
    question = request.question.strip()
    if not question:
        raise HTTPException(
            status_code=400,
            detail="Veuillez poser une question"
        )
    
    try:
        # Récupérer réponse
        answer = qa_system.ask(
            question=question,
            verbose=False,
            debug=False,
            save=True
        )
        
        # Debug: log la réponse
        print(f"[DEBUG] Question: {question}")
        print(f"[DEBUG] Answer type: {type(answer)}")
        print(f"[DEBUG] Answer value: '{answer}'")
        
        # Vérifier que la réponse n'est pas vide
        if not answer or answer is None:
            answer = f"Je n'ai pas pu générer une réponse pour: '{question}'. Veuillez reformuler votre question ou consulter un professionnel."
        
        # Récupérer les sources
        relevant_docs = qa_system.vector_store.retrieve(question)
        sources = []
        article_names = []
        
        for i, doc in enumerate(relevant_docs, 1):
            # Gérer les deux formats: objets Langchain et dictionnaires
            if isinstance(doc, dict):
                # Extraire le nom de la source depuis le dictionnaire
                source_name = doc.get('source') or doc.get('metadata', {}).get('source') or 'Code du travail'
                content = doc.get('page_content') or doc.get('content', '')
                sources.append({
                    "id": i,
                    "name": source_name,
                    "excerpt": content,  # Contenu COMPLET sans troncature
                    "relevance": "Haut"
                })
                article_names.append(source_name)
            else:
                # Format Langchain Document
                metadata = getattr(doc, 'metadata', {})
                source_name = metadata.get('source') or 'Code du travail'
                content = getattr(doc, 'page_content', '')
                sources.append({
                    "id": i,
                    "name": source_name,
                    "excerpt": content,  # Contenu COMPLET sans troncature
                    "relevance": "Haut"
                })
                article_names.append(source_name)
        
        # Ajouter le nom des articles entre parenthèses à la réponse
        if article_names:
            articles_str = ", ".join(set(article_names))  # Supprimer les doublons
            answer_with_articles = f"{answer}\n\n(Source: {articles_str})"
        else:
            answer_with_articles = answer
        
        return AnswerResponse(
            success=True,
            question=question,
            answer=answer_with_articles,
            sources=sources,
            source_count=len(sources)
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erreur lors du traitement: {str(e)}"
        )


@app.get("/api/history", response_model=HistoryResponse)
async def get_history(limit: int = 10):
    """
    Récupérer l'historique des conversations
    
    Args:
        limit: Nombre maximum de résultats (défaut: 10)
        
    Returns:
        HistoryResponse avec l'historique des conversations
        
    Raises:
        HTTPException 503: Si le système RAG n'est pas initialisé
    """
    if not qa_system:
        raise HTTPException(
            status_code=503,
            detail="Système RAG non initialisé"
        )
    
    try:
        history = qa_system.db.get_history(limit=limit)
        
        return HistoryResponse(
            success=True,
            history=[
                HistoryItem(
                    id=row[0],
                    question=row[1],
                    answer=row[2],
                    timestamp=row[3]
                )
                for row in history
            ]
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erreur lors de la récupération: {str(e)}"
        )


@app.post("/api/clear-history")
async def clear_history():
    """
    Effacer l'historique des conversations
    
    Returns:
        Dictionnaire de confirmation
        
    Raises:
        HTTPException 503: Si le système RAG n'est pas initialisé
    """
    if not qa_system:
        raise HTTPException(
            status_code=503,
            detail="Système RAG non initialisé"
        )
    
    try:
        qa_system.db.clear_history()
        return {
            "success": True,
            "message": "Historique effacé"
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erreur lors de l'effacement: {str(e)}"
        )


# ============ DOCUMENTATION ============

@app.get("/docs", include_in_schema=False)
async def swagger_ui():
    """Redirection vers la documentation Swagger"""
    return FileResponse(str(BASE_DIR / "frontend" / "index.html"))


# ============ ROUTES STATIQUES (MOUNTED LAST) ============

# Servir le frontend statique
app.mount("/static", StaticFiles(directory=str(BASE_DIR / "frontend")), name="static")

# Routes pour servir index.html du frontend
@app.get("/", response_class=FileResponse)
async def root():
    """Page d'accueil - Servir index.html"""
    return FileResponse(str(BASE_DIR / "frontend" / "index.html"))


@app.get("/index.html", response_class=FileResponse)
async def index():
    """Redirection index.html"""
    return FileResponse(str(BASE_DIR / "frontend" / "index.html"))


# ============ ERROR HANDLERS ============

@app.exception_handler(404)
async def not_found_handler(request, exc):
    """Gestionnaire 404"""
    return JSONResponse(
        status_code=404,
        content={"error": "Endpoint non trouve", "success": False}
    )


@app.exception_handler(500)
async def server_error_handler(request, exc):
    """Gestionnaire 500"""
    return JSONResponse(
        status_code=500,
        content={"error": "Erreur serveur interne", "success": False}
    )


# ============ MAIN ============
if __name__ == "__main__":
    # Ne pas réassigner sys.stdout ici, c'est déjà fait au début
    
    print("\n" + "=" * 80)
    print("[START] Demarrage du serveur FastAPI")
    print("=" * 80)
    print(f"[INFO] Serveur: http://localhost:8001")
    print(f"[INFO] Documentation API: http://localhost:8001/docs")
    print(f"[INFO] Frontend: http://localhost:8080")
    print("=" * 80)
    print("[INFO] Appuyez sur CTRL+C pour arreter\n")
    
    # Lancer avec Uvicorn
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8001,
        log_level="info"
    )

