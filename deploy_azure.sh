#!/usr/bin/env bash
set -euo pipefail

#################################
# VARIABLES DÉFINITIVES
#################################
RESOURCE_GROUP="rg-legal-ai-nlp"  
LOCATION="westeurope"   
ACR_NAME="acrlegalai$(whoami | tr '[:upper:]' '[:lower:]' | tr -cd '[:alnum:]')"
CONTAINER_APP_NAME="legal-ai-api" 
CONTAINERAPPS_ENV="env-legal-ai"
IMAGE_NAME="legal-ai-api"
IMAGE_TAG="v1"
TARGET_PORT=8001

#################################
# 0) Contexte Azure + Vérification Extensions
#################################
echo "Vérification du contexte Azure..."
az account show --query "{name:name, cloudName:cloudName}" -o json >/dev/null

echo "Vérification/installation des extensions Azure CLI..."
if ! az extension show --name containerapp >/dev/null 2>&1; then
    az extension add --name containerapp --upgrade -y --only-show-errors
fi

#################################
# 1) Providers nécessaires
#################################
echo "Register providers..."
az provider register --namespace Microsoft.ContainerRegistry --wait
az provider register --namespace Microsoft.App --wait

#################################
# 2) Resource Group
#################################
echo "Création du groupe de ressources..."
az group create -n "$RESOURCE_GROUP" -l "$LOCATION" >/dev/null

#################################
# 3) Création ACR
#################################
echo "Création du Container Registry (ACR)..."
az acr create \
  --resource-group "$RESOURCE_GROUP" \
  --name "$ACR_NAME" \
  --sku Basic \
  --admin-enabled true \
  --location "$LOCATION" >/dev/null

#################################
# 4) Login ACR + Build + Push
#################################
echo "Connexion au registry et build de l'image..."
az acr login --name "$ACR_NAME"
ACR_LOGIN_SERVER=$(az acr show --name "$ACR_NAME" --query loginServer -o tsv | tr -d '\r')

docker build -t "$IMAGE_NAME:$IMAGE_TAG" .
docker tag "$IMAGE_NAME:$IMAGE_TAG" "$ACR_LOGIN_SERVER/$IMAGE_NAME:$IMAGE_TAG"
docker push "$ACR_LOGIN_SERVER/$IMAGE_NAME:$IMAGE_TAG"

#################################
# 5) Log Analytics
#################################
LAW_NAME="law-legal-ai-$(whoami | tr -cd '[:alnum:]')"
echo "Création Log Analytics..."
az monitor log-analytics workspace create -g "$RESOURCE_GROUP" -n "$LAW_NAME" -l "$LOCATION" >/dev/null

LAW_ID=$(az monitor log-analytics workspace show \
    --resource-group "$RESOURCE_GROUP" \
    --workspace-name "$LAW_NAME" \
    --query customerId -o tsv | tr -d '\r')

LAW_KEY=$(az monitor log-analytics workspace get-shared-keys \
    --resource-group "$RESOURCE_GROUP" \
    --workspace-name "$LAW_NAME" \
    --query primarySharedKey -o tsv | tr -d '\r')

#################################
# 6) Container Apps Environment
#################################
echo "Création Container Apps Environment..."
az containerapp env create \
  -n "$CONTAINERAPPS_ENV" \
  -g "$RESOURCE_GROUP" \
  -l "$LOCATION" \
  --logs-workspace-id "$LAW_ID" \
  --logs-workspace-key "$LAW_KEY" >/dev/null

#################################
# 7) Déploiement Container App
#################################
echo "Déploiement Container App..."
ACR_USER=$(az acr credential show -n "$ACR_NAME" --query username -o tsv | tr -d '\r')
ACR_PASS=$(az acr credential show -n "$ACR_NAME" --query "passwords[0].value" -o tsv | tr -d '\r')

az containerapp create \
  -n "$CONTAINER_APP_NAME" \
  -g "$RESOURCE_GROUP" \
  --environment "$CONTAINERAPPS_ENV" \
  --image "$ACR_LOGIN_SERVER/$IMAGE_NAME:$IMAGE_TAG" \
  --ingress external \
  --target-port "$TARGET_PORT" \
  --registry-server "$ACR_LOGIN_SERVER" \
  --registry-username "$ACR_USER" \
  --registry-password "$ACR_PASS" \
  --min-replicas 1 \
  --max-replicas 1 >/dev/null

#################################
# 8) URL API
#################################
APP_URL=$(az containerapp show -n "$CONTAINER_APP_NAME" -g "$RESOURCE_GROUP" --query properties.configuration.ingress.fqdn -o tsv | tr -d '\r')

echo ""
echo "=========================================="
echo "✅ DÉPLOIEMENT RÉUSSI"
echo "=========================================="
echo "URL API : https://$APP_URL"
echo "Health  : https://$APP_URL/api/health"
echo "Docs    : https://$APP_URL/docs"
echo "=========================================="
