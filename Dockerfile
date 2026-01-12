# Dockerfile pour le déploiement du système RAG Legal AI

FROM python:3.10-slim

# Définir le répertoire de travail
WORKDIR /app

# Variables d'environnement pour CPU-only et timeout étendu
ENV PYTHONUNBUFFERED=1 \
    KMP_DUPLICATE_LIB_OK=True \
    TF_CPP_MIN_LOG_LEVEL=3 \
    TORCH_HOME=/tmp/torch_cache \
    TRANSFORMERS_CACHE=/tmp/transformers_cache \
    PIP_DEFAULT_TIMEOUT=120

# Installer les dépendances système requises (minimal)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libssl-dev \
    libffi-dev \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

# Copier les requirements
COPY backend/requirements.txt .
COPY requirements-frontend.txt .

# Installer PyTorch CPU-only et autres dépendances avec timeout étendu
RUN pip install --upgrade pip setuptools wheel && \
    pip install --no-cache-dir --default-timeout=120 \
    torch==2.1.0 --index-url https://download.pytorch.org/whl/cpu && \
    pip install --no-cache-dir --default-timeout=120 -r requirements.txt && \
    pip install --no-cache-dir --default-timeout=120 -r requirements-frontend.txt

# Copier le code source
COPY . .

# Expose the port
EXPOSE 8001

# Healthcheck with extended timeouts for slow initialization
HEALTHCHECK --interval=60s --timeout=30s --start-period=180s --retries=3 \
    CMD python -c "import requests; requests.get('http://localhost:8001/api/health', timeout=10)" || exit 1

# Commande de démarrage
CMD ["python", "app.py"]
