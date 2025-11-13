# 📦 Guide de Publication NPM

Guide complet pour publier `@aurora/generators` sur npm.

## 📋 Pré-requis

### 1. Compte npm

```bash
# Créer un compte sur https://www.npmjs.com/signup
# Ou se connecter
npm login
```

### 2. Organisation npm (pour @aurora scope)

Si c'est votre première publication avec le scope `@aurora` :

```bash
# Créer l'organisation sur npm
# Aller sur : https://www.npmjs.com/org/create
# Nom : aurora
```

## ✅ Checklist avant publication

- [ ] Version mise à jour dans `package.json`
- [ ] CHANGELOG.md à jour
- [ ] README.md professionnel et complet
- [ ] LICENSE présent (MIT)
- [ ] Tests passent : `npm test`
- [ ] Build réussi (si applicable)
- [ ] `.npmignore` configuré
- [ ] `files` dans package.json spécifié
- [ ] Repository Git à jour et poussé

## 🔍 Vérification locale

### 1. Tester l'installation locale

```bash
# Créer un package tarball
npm pack

# Cela créé un fichier : aurora-generators-2.1.0.tgz
# Tester l'installation dans un autre projet
cd /path/to/test-project
npm install /path/to/aurora-generators-2.1.0.tgz

# Tester les commandes
npx generate vue module --help
```

### 2. Vérifier le contenu du package

```bash
# Voir ce qui sera publié
npm pack --dry-run

# Ou extraire et inspecter
tar -xzf aurora-generators-2.1.0.tgz
cd package
ls -la
```

## 🚀 Publication

### Publication sur npm (publique)

#### Première publication

```bash
# S'assurer d'être connecté
npm whoami

# Publier avec accès public (obligatoire pour les scoped packages gratuits)
npm publish --access public
```

#### Publications suivantes (mise à jour)

```bash
# 1. Mettre à jour la version
npm version patch   # 2.1.0 -> 2.1.1 (bug fixes)
npm version minor   # 2.1.0 -> 2.2.0 (nouvelles features)
npm version major   # 2.1.0 -> 3.0.0 (breaking changes)

# 2. Pousser les tags
git push && git push --tags

# 3. Publier
npm publish --access public
```

### Publication sur GitHub Packages (alternative)

Si vous préférez GitHub Packages :

```bash
# 1. Créer un token GitHub avec scope "write:packages"
# Aller sur : https://github.com/settings/tokens

# 2. Configurer npm pour GitHub
echo "//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN" >> ~/.npmrc

# 3. Modifier package.json pour ajouter :
{
  "publishConfig": {
    "registry": "https://npm.pkg.github.com"
  }
}

# 4. Publier
npm publish
```

## 📊 Après publication

### 1. Vérifier la publication

```bash
# Vérifier sur npm
open https://www.npmjs.com/package/@aurora/generators

# Tester l'installation globale
npm install -g @aurora/generators
generate --version
```

### 2. Tester dans un projet réel

```bash
# Créer un nouveau projet test
mkdir test-aurora-gen && cd test-aurora-gen
npm init -y

# Installer depuis npm
npm install -g @aurora/generators

# Tester
generate vue module --interactive
```

### 3. Créer un GitHub Release

```bash
# Sur GitHub, créer une release avec :
# - Tag : v2.1.0
# - Title : Aurora Generator v2.1.0
# - Description : Copier depuis CHANGELOG.md
# - Assets : Attacher le .tgz si nécessaire
```

## 🔄 Workflow de version recommandé

### Semantic Versioning (SemVer)

Format : `MAJOR.MINOR.PATCH`

- **PATCH** (2.1.0 → 2.1.1) : Bug fixes, corrections mineures
- **MINOR** (2.1.0 → 2.2.0) : Nouvelles features, pas de breaking changes
- **MAJOR** (2.1.0 → 3.0.0) : Breaking changes

### Exemple de workflow

```bash
# 1. Développer une nouvelle feature
git checkout -b feature/add-react-support

# 2. Commiter les changements
git add .
git commit -m "feat: add React generator support"

# 3. Merger dans main
git checkout main
git merge feature/add-react-support

# 4. Mettre à jour version et changelog
npm version minor  # 2.1.0 -> 2.2.0
# Éditer CHANGELOG.md

# 5. Commiter les changements de version
git add .
git commit -m "chore: bump version to 2.2.0"

# 6. Pousser avec tags
git push && git push --tags

# 7. Publier
npm publish --access public

# 8. Créer GitHub release
gh release create v2.2.0 --title "v2.2.0" --notes "See CHANGELOG.md"
```

## 🛡️ Sécurité

### Activer 2FA sur npm

```bash
# Activer l'authentification à deux facteurs
npm profile enable-2fa auth-and-writes
```

### Utiliser npm tokens

Pour CI/CD :

```bash
# Créer un token automation sur : https://www.npmjs.com/settings/tokens
# Ajouter dans GitHub Secrets : NPM_TOKEN

# Dans .github/workflows/publish.yml
- run: npm publish --access public
  env:
    NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## 📈 Maintenance

### Surveiller les statistiques

- **npm stats** : https://npm-stat.com/charts.html?package=@aurora/generators
- **npm trends** : https://npmtrends.com/@aurora/generators

### Mise à jour des dépendances

```bash
# Vérifier les dépendances obsolètes
npm outdated

# Mettre à jour
npm update

# Ou avec ncu (npm-check-updates)
npx npm-check-updates -u
npm install
```

## ❌ Dépublication (en cas d'urgence)

```bash
# Dépublier une version spécifique (< 72h)
npm unpublish @aurora/generators@2.1.0

# Dépublier tout le package (< 72h, déconseillé)
npm unpublish @aurora/generators --force
```

⚠️ **Attention** : La dépublication est définitive après 72h et peut casser les projets existants.

## 📝 Checklist complète

### Avant chaque publication

- [ ] Tous les tests passent
- [ ] Documentation à jour
- [ ] CHANGELOG.md mis à jour
- [ ] Version incrémentée correctement
- [ ] Git repository à jour
- [ ] Tags Git créés
- [ ] `.npmignore` vérifié
- [ ] `npm pack --dry-run` inspecté
- [ ] Installation locale testée

### Après publication

- [ ] Package visible sur npmjs.com
- [ ] Installation globale testée
- [ ] GitHub Release créée
- [ ] Documentation déployée
- [ ] Annonce sur réseaux sociaux (optionnel)
- [ ] Changelog posté

## 🆘 Troubleshooting

### Erreur : 403 Forbidden

```bash
# Vérifier que vous êtes connecté
npm whoami

# Vérifier les permissions sur l'organisation
# Aller sur : https://www.npmjs.com/settings/aurora/members

# Publier avec --access public pour les scoped packages
npm publish --access public
```

### Erreur : Package name too similar

```bash
# Le nom est trop similaire à un package existant
# Changer le nom dans package.json
# Ou contacter npm support
```

### Erreur : Version already exists

```bash
# La version existe déjà
# Incrémenter la version
npm version patch
npm publish --access public
```

## 📚 Ressources

- **npm Documentation** : https://docs.npmjs.com/
- **Semantic Versioning** : https://semver.org/
- **npm Publishing Guide** : https://docs.npmjs.com/cli/v8/commands/npm-publish
- **Scoped Packages** : https://docs.npmjs.com/cli/v8/using-npm/scope

---

**Bonne publication ! 🎉**
