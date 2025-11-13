#!/bin/bash

# Script de publication pour aurora-module-generator
# Usage: ./scripts/publish.sh

set -e

echo "🚀 Publication du package aurora-module-generator"
echo ""

# Récupérer la version depuis package.json
VERSION=$(node -p "require('./package.json').version")
echo "📦 Version: v$VERSION"
echo ""

# Vérifier qu'on est sur main
BRANCH=$(git branch --show-current)
if [ "$BRANCH" != "main" ]; then
    echo "❌ Erreur: Vous devez être sur la branche main pour publier"
    exit 1
fi

# Vérifier qu'il n'y a pas de modifications non commitées
if [ -n "$(git status --porcelain)" ]; then
    echo "❌ Erreur: Il y a des modifications non commitées"
    git status --short
    exit 1
fi

# Vérifier que le tag n'existe pas déjà
if git rev-parse "v$VERSION" >/dev/null 2>&1; then
    echo "❌ Erreur: Le tag v$VERSION existe déjà"
    exit 1
fi

echo "✅ Tous les checks sont OK"
echo ""

# Créer le tag
echo "🏷️  Création du tag v$VERSION..."
git tag -a "v$VERSION" -m "Release v$VERSION"

# Push vers GitHub
echo "📤 Push vers GitHub..."
git push origin main
git push origin "v$VERSION"

# Publication sur npm
echo "📦 Publication sur npm..."
npm publish --access public

echo ""
echo "✅ Publication terminée avec succès !"
echo "🎉 Version v$VERSION publiée sur npm et GitHub"
