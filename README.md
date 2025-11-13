# 📦 Aurora Generators

Package de génération de code multi-framework pour applications Aurora.

## 🎯 Objectif

Ce package fournit des générateurs de code pour standardiser la création de modules CRUD dans différents frameworks frontend. Il automatise la génération de :

- Interfaces TypeScript
- Modèles et routes API
- Stores et actions
- Vues et composants
- Composables et utilitaires

## � Installation

### Installation locale

```bash
cd generators
npm link
```

### Utilisation dans un projet

```bash
npm link @aurora/generators
```

Ou installation directe :

```bash
npm install file:./generators
```

## 📚 Frameworks supportés

| Framework   | Status        | Version | Store Management |
| ----------- | ------------- | ------- | ---------------- |
| **Vue**     | ✅ Disponible | 3.x     | Pinia            |
| **React**   | 🚧 Prévu      | 18.x    | Redux Toolkit    |
| **Angular** | 🚧 Prévu      | 17.x    | NgRx             |

## 🛠️ Commandes

### Génération de module

```bash
# Aide générale
npx generate --help

# Mode interactif (recommandé)
npx generate vue module --interactive

# Depuis un fichier YAML
npx generate vue module resources/product.yaml

# Mode simulation (sans écriture)
npx generate vue module --dry-run resources/product.yaml

# Avec options
npx generate vue module --verbose resources/product.yaml
```

### Suppression de module

```bash
# Mode interactif
npx delete-module vue --interactive

# Suppression directe
npx delete-module vue Product
```

## 📄 Format de configuration YAML

Chaque module est défini via un fichier YAML contenant :

```yaml
name: Product
description: Gestion des produits
extends: ApiResourceInterface

fields:
  - name: name
    type: string
    required: true
  - name: price
    type: number
    required: true

filterAttributes:
  - name: name
    type: string
  - name: priceMin
    type: number

selector:
  displayField: name
  secondaryField: price
  icon: mdi-package-variant
  color: primary
```

Pour plus de détails, voir la documentation spécifique à chaque framework.

## 📁 Structure du projet

```
generators/
├── package.json              # Configuration npm
├── README.md                 # Ce fichier
├── example.yaml              # Exemple complet de configuration
├── test-module.yaml          # Exemple simple pour tests
├── bin/
│   ├── generate.js          # CLI de génération
│   └── delete.js            # CLI de suppression
└── frameworks/
    ├── vue/                 # Générateur Vue 3
    │   ├── README.md        # Doc Vue spécifique
    │   ├── generator.js     # Logique de génération
    │   ├── delete-module.js # Logique de suppression
    │   ├── config.js        # Configuration
    │   ├── templates/       # Templates Handlebars
    │   └── generators/      # Sous-générateurs
    ├── react/               # 🚧 À venir
    └── angular/             # 🚧 À venir
```

## 🎨 Framework Vue

Le générateur Vue 3 crée une architecture complète basée sur :

- **Vue 3** : Composition API
- **Pinia** : State management
- **Vuetify** : UI framework
- **TypeScript** : Typage fort

### Fichiers générés (37 au total)

Pour chaque module :

- 6 interfaces TypeScript
- 1 modèle
- 5 routes API
- 9 actions de store
- 2 composables
- 1 route de navigation
- 3 vues (List, Add, Edit)
- 5 composants réutilisables
- Auto-registration dans Pinia et StoreKeysEnum

Voir `frameworks/vue/README.md` pour les détails.

## 🔧 Développement

### Ajouter un nouveau framework

1. Créer le dossier `frameworks/<framework>/`
2. Implémenter `generator.js` et `delete-module.js`
3. Créer les templates dans `templates/`
4. Ajouter la configuration dans `config.js`
5. Documenter dans `frameworks/<framework>/README.md`

Le CLI détectera automatiquement le nouveau framework.

### Contribuer

```bash
# Installer les dépendances
npm install

# Tester en local
npm link
npx generate vue module --help

# Désinstaller le link
npm unlink -g @aurora/generators
```

## 📖 Documentation

- **Vue Generator** : `frameworks/vue/README.md`
- **Architecture** : `frameworks/vue/ARCHITECTURE.md`
- **Changelog** : `frameworks/vue/CHANGELOG.md`

## 🎯 Roadmap

- [x] Générateur Vue 3 complet
- [x] Auto-registration des stores
- [x] Composants réutilisables
- [x] Architecture multi-framework
- [ ] Générateur React + Redux
- [ ] Générateur Angular + NgRx
- [ ] Tests unitaires automatisés
- [ ] Générateur de tests E2E

## 👨‍� Auteur

**Adébayo Floriano Davidio Sergio Gomez**

## 📝 License

Propriétaire Aurora - Tous droits réservés

## 🆘 Support

Pour toute question ou problème :

1. Consultez la documentation spécifique au framework
2. Vérifiez les exemples : `example.yaml` et `test-module.yaml`
3. Utilisez le mode `--dry-run` pour tester sans modifier

---

**Version actuelle** : 2.1.0

### 🏪 Store Generator (Legacy)

**Emplacement** : `store/` (si existe)  
**Description** : Générateur de stores Pinia  
**Statut** : Legacy - Intégré dans Module Generator v2.0

---

## 🚀 Commandes npm Disponibles

### Génération de Modules (Moderne)

```bash
yarn generate:module:modern <yaml-file>      # Génération complète
yarn generate:module:interactive             # Mode interactif
yarn generate:module:dry <yaml-file>         # Simulation (dry-run)
```

### Gestion des Actions

```bash
yarn add:action <Resource> <action> --path <module-path>
yarn remove:action <Resource> <action> --path <module-path>
```

### Génération Legacy (Ancien système)

```bash
yarn generate:module <yaml-file>             # Ancien générateur
# Note : Préférer les commandes modernes ci-dessus
```

---

## 📚 Structure du Dossier

```
generators/
├── README.md              → Ce fichier
│
├── module/                → 🔥 Générateur moderne v2.0
│   ├── INDEX.md           → **COMMENCEZ ICI** - Navigation
│   ├── QUICK_START.md     → Démarrage rapide
│   ├── README.md          → Documentation complète
│   ├── MODERNIZATION.md   → Patterns modernes
│   ├── VALIDATION_GUIDE.md→ Guide de validation
│   ├── CHANGELOG.md       → Historique
│   ├── generator.js       → Script principal
│   ├── templates/         → 22 templates Handlebars
│   └── ...                → 10 fichiers de doc au total
│
└── store/                 → Générateur de stores (legacy)
    └── ...
```

---

## 🎯 Cas d'Usage

### Créer un Nouveau Module

1. **Préparer la spécification**

   ```bash
   cp generators/module/example.yaml resources/my-module.yaml
   # Éditer my-module.yaml
   ```

2. **Tester la génération**

   ```bash
   yarn generate:module:dry resources/my-module.yaml
   ```

3. **Générer le module**

   ```bash
   yarn generate:module:modern resources/my-module.yaml
   ```

4. **Valider**
   ```bash
   # Suivre generators/module/VALIDATION_GUIDE.md
   cd src/modules/my-module
   npx tsc --noEmit
   ```

### Ajouter une Action Personnalisée

```bash
yarn add:action User activateAccount --path src/modules/users
# Éditer le fichier généré : src/modules/users/store/actions/activateAccount.ts
```

---

## ✨ Nouveautés v2.0

Le Module Generator a été complètement modernisé :

### Patterns TypeScript Modernes

- ✅ Constructor parameter properties (`private`, `public`)
- ✅ Gestion centralisée du mock via `this.isMock`
- ✅ Erreurs explicites avec `NotFoundApiError`
- ✅ Destructuration d'objets dans les actions
- ✅ Code aligné avec le module `users` (référence)

### Documentation Exhaustive

- 📖 10 fichiers de documentation
- 📝 3000+ lignes de doc
- 🎯 Guides pour tous les niveaux (débutant → expert)
- ✅ Checklist de validation complète
- 🗺️ Résumé technique détaillé

### Qualité et Maintenance

- 🧪 Module de test inclus (`test-module.yaml`)
- 🔍 Guide de validation pas à pas
- 📊 CHANGELOG structuré
- 🎨 Documentation des templates
- 💡 Exemples complets

---

## 📖 Pour Aller Plus Loin

### Niveau Débutant (30 min)

```bash
cd generators/module/
cat QUICK_START.md        # 2 min
cat README.md             # 15 min
# Générer test-module.yaml pour pratiquer
```

### Niveau Intermédiaire (1h30)

```bash
cd generators/module/
cat SUMMARY.md            # Vue d'ensemble
cat ACTIONS.md            # Gestion des actions
cat MODERNIZATION.md      # Comprendre les patterns
cat templates/README.md   # Documentation des templates
```

### Niveau Avancé (3h)

```bash
cd generators/module/
cat VALIDATION_GUIDE.md   # Guide de validation
cat MIGRATION_SUMMARY.md  # Détails techniques
cat CHANGELOG.md          # Historique
# Lire le code des scripts (generator.js, helpers.js)
```

---

## 🆘 Besoin d'Aide ?

### Questions Fréquentes

**Q: Par où commencer ?**  
A: `generators/module/INDEX.md` → Puis `QUICK_START.md`

**Q: Comment générer mon premier module ?**  
A: `yarn generate:module:interactive`

**Q: Où trouver un exemple ?**  
A: `generators/module/example.yaml` (complet) ou `test-module.yaml` (simple)

**Q: Comment valider mon module ?**  
A: Suivre `generators/module/VALIDATION_GUIDE.md`

**Q: Pourquoi v2.0 ?**  
A: Lire `generators/module/MODERNIZATION.md` pour comprendre les améliorations

---

## 🔗 Liens Rapides

- 🚀 [Démarrage Rapide](./module/QUICK_START.md)
- 📚 [Documentation Complète](./module/README.md)
- 🗺️ [Navigation](./module/INDEX.md)
- ✨ [Patterns Modernes](./module/MODERNIZATION.md)
- ✅ [Validation](./module/VALIDATION_GUIDE.md)
- 📝 [Exemple YAML](./module/example.yaml)
- 🧪 [Module de Test](./module/test-module.yaml)

---

## 📊 Statistiques

### Module Generator v2.0

- **Fichiers** : 39 (5 scripts, 22 templates, 10 docs, 2 YAML)
- **Lignes de code** : ~5650
- **Lignes de doc** : ~3000
- **Templates** : 22 fichiers .hbs
- **Helpers** : 12 fonctions
- **Patterns modernes** : 5 majeurs

---

## 📅 Maintenance

**Version actuelle** : 2.0.0  
**Dernière mise à jour** : Janvier 2024  
**Statut** : ✅ Production Ready  
**Module de référence** : `src/modules/users/`

---

## 🎉 Conclusion

Le système de génération de modules est **complet, moderne et prêt pour la production**.

### Commencer Maintenant

```bash
cd generators/module/
cat INDEX.md              # Navigation complète
cat QUICK_START.md        # Commencer en 2 minutes
```

ou directement :

```bash
yarn generate:module:interactive
```

---

**💡 Tip** : Ajoutez `generators/module/INDEX.md` à vos favoris !
