#!/bin/bash
# Script de vérification du frontend

echo "================================================"
echo "Vérification du Frontend"
echo "================================================"

# Vérifier les dépendances
echo ""
echo "1. Vérification de Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé"
    exit 1
fi
echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"

# Vérifier les dépendances npm
echo ""
echo "2. Vérification des dépendances npm..."
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances..."
    npm install
else
    echo "✅ Dépendances déjà installées"
fi

# Vérifier les fichiers critiques
echo ""
echo "3. Vérification de la structure..."
files=(
    "src/App.tsx"
    "src/main.tsx"
    "src/lib/api.ts"
    "src/components/layout/AppLayout.tsx"
    "src/pages/Chatbot.tsx"
    "vite.config.ts"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file manquant"
    fi
done

# Vérifier la configuration de Vite
echo ""
echo "4. Vérification de la configuration Vite..."
if grep -q "proxy" vite.config.ts; then
    echo "✅ Proxy API configuré"
else
    echo "⚠️ Proxy API non trouvé dans vite.config.ts"
fi

# Lint check
echo ""
echo "5. Lint check..."
npm run lint 2>/dev/null || echo "⚠️ Lint check ignoré (optionnel)"

echo ""
echo "================================================"
echo "Vérification complète!"
echo "================================================"
echo ""
echo "Pour démarrer le frontend:"
echo "  npm run dev"
echo ""
echo "Pour compiler pour la production:"
echo "  npm run build"
echo ""
