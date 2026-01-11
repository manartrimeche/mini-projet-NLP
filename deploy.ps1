# Deployment script for Azure Container Apps
$UNIQUE_ID = Get-Random -Maximum 9999
$RESOURCE_GROUP = "rg-legal-ai"
$LOCATION = "westeurope"
$ACR_NAME = "acrlegalai$UNIQUE_ID"
$CONTAINERAPPS_ENVIRONMENT = "env-legal-ai"
$CONTAINERAPP_NAME = "app-legal-ai"

Write-Host "1. Creating Resource Group: $RESOURCE_GROUP" -ForegroundColor Cyan
az group create --name $RESOURCE_GROUP --location $LOCATION

Write-Host "2. Creating Azure Container Registry: $ACR_NAME" -ForegroundColor Cyan
az acr create --resource-group $RESOURCE_GROUP --name $ACR_NAME --sku Basic --admin-enabled true

$ACR_LOGIN_SERVER = az acr show --name $ACR_NAME --query loginServer --output tsv
$ACR_USERNAME = az acr credential show --name $ACR_NAME --query username --output tsv
$ACR_PASSWORD = az acr credential show --name $ACR_NAME --query passwords[0].value --output tsv

Write-Host "3. Building and Pushing Docker Image to $ACR_LOGIN_SERVER" -ForegroundColor Cyan
docker build -t "$ACR_LOGIN_SERVER/legal-ai:latest" .
echo "$ACR_PASSWORD" | docker login $ACR_LOGIN_SERVER -u $ACR_USERNAME --password-stdin
docker push "$ACR_LOGIN_SERVER/legal-ai:latest"

Write-Host "4. Creating Container Apps Environment" -ForegroundColor Cyan
az containerapp env create --name $CONTAINERAPPS_ENVIRONMENT --resource-group $RESOURCE_GROUP --location $LOCATION

Write-Host "5. Deploying Container App" -ForegroundColor Cyan
az containerapp create `
    --name $CONTAINERAPP_NAME `
    --resource-group $RESOURCE_GROUP `
    --environment $CONTAINERAPPS_ENVIRONMENT `
    --image "$ACR_LOGIN_SERVER/legal-ai:latest" `
    --target-port 5000 `
    --ingress external `
    --query properties.configuration.ingress.fqdn

