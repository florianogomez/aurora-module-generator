# Changelog - Générateur de Modules

Toutes les modifications notables de ce projet seront documentées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/lang/fr/).

## [2.0.0] - 2024-01-XX - Modernisation Complète

### 🎯 Objectif

Alignement complet avec les patterns modernes du module `users` et adoption des meilleures pratiques TypeScript/Vue 3.

### ✨ Ajouts

#### Routes API

- Ajout de la propriété `this.isMock` calculée automatiquement depuis `config.apiMode`
- Utilisation de `NotFoundApiError` pour les ressources manquantes
- Gestion explicite des erreurs dans tous les mocks
- Ajout de `updated_at` automatique dans les routes create et update

#### Actions Store

- Toutes les actions utilisent maintenant la destructuration d'objets
- Suppression des paramètres `mock` (gestion centralisée dans les routes)
- Mise à jour conditionnelle de `store.elements` dans `getAll`
- Cohérence entre actions API et actions de base

#### Documentation

- Nouveau fichier `MODERNIZATION.md` détaillant tous les patterns
- Nouveau fichier `test-module.yaml` pour validation rapide
- Mise à jour complète du `README.md`
- Ajout de ce `CHANGELOG.md`

### 🔄 Modifications

#### Templates de Routes

- **route-base.hbs** : Ajout de `get isMock()`
- **route-create.hbs** :
  - Paramètre `public data` au lieu d'assignation manuelle
  - Utilisation de `this.isMock`
  - Ajout de `updated_at`
- **route-list.hbs** :
  - Paramètre `private filters` au lieu de `args`
  - Filtrage des résultats en mode mock
- **route-find.hbs** :
  - Paramètre `private elementId` au lieu de `id`
  - Retour de `NotFoundApiError` si non trouvé
- **route-update.hbs** :
  - Paramètres `private elementId` et `public data`
  - Vérification d'existence avec `NotFoundApiError`
  - Merge des données existantes
- **route-delete.hbs** :
  - Paramètre `private elementId`
  - Vérification d'existence avant suppression
  - Retour de l'élément supprimé

#### Templates d'Actions

- **action-getAll.hbs** :
  - Destructuration `{ args }`
  - Mise à jour conditionnelle de `store.elements`
- **action-findOne.hbs** : Destructuration `{ elementId }`
- **action-create.hbs** : Destructuration `{ data }`
- **action-updateOne.hbs** : Destructuration `{ elementId, data }`
- **action-delete.hbs** : Destructuration `{ elementId }`
- **action-add.hbs** : Reformatage propre
- **action-find.hbs** : Reformatage propre
- **action-update.hbs** : Reformatage propre
- **action-remove.hbs** : Reformatage propre
- **action-index.hbs** :
  - Suppression de `createBaseStoreActions`
  - Export direct de toutes les actions

### 🗑️ Suppressions

- Dépendance à `createBaseStoreActions` dans l'index des actions
- Paramètres `mock` dans toutes les actions
- Pattern verbeux d'assignation de propriétés dans les constructeurs

### 🐛 Corrections

- Formatage cassé dans plusieurs templates d'actions (add, find, update, remove)
- Incohérence entre les signatures d'actions API
- Gestion d'erreurs manquante en mode mock

### 📊 Impact

- **Breaking Changes** : Oui - Les signatures d'actions ont changé
- **Migration nécessaire** : Non - Nouveaux modules uniquement
- **Modules existants** : Non affectés (peuvent être migrés manuellement si souhaité)

### 🔍 Validation

#### Checklist de conformité

- [x] Routes utilisent `this.isMock` ✅
- [x] Constructeurs utilisent parameter properties ✅
- [x] `NotFoundApiError` pour ressources manquantes ✅
- [x] Actions destructurent les paramètres ✅
- [x] Actions appellent uniquement `.request()` ✅
- [x] Index des actions sans `createBaseStoreActions` ✅
- [x] `getAll` met à jour `store.elements` conditionnellement ✅

#### Tests effectués

- ✅ Lecture complète du module `users` (référence)
- ✅ Comparaison systématique de tous les templates
- ✅ Vérification de la cohérence entre routes et actions
- ✅ Validation de la documentation

### 📚 Références

- Module de référence : `src/modules/users/`
- 17 fichiers analysés du module users
- Patterns TypeScript modernes appliqués
- Conventions Vue 3 / Pinia respectées

---

## [1.0.0] - 2024-01-XX - Version Initiale

### ✨ Ajouts Initiaux

- Système de templates Handlebars
- 12 helpers de transformation de casse
- Configuration centralisée dans `config.js`
- Mode interactif pour création de YAML
- Mode dry-run pour simulation
- Scripts d'ajout/suppression d'actions
- Documentation complète (README, ACTIONS, SUMMARY)
- Exemple de spécification YAML

### 🏗️ Structure Créée

- Templates pour interfaces (4 types)
- Templates pour modèles
- Templates pour routes API (5 types)
- Templates pour actions store (9 types)
- Générateur principal avec classe `ModuleGenerator`
- Système de helpers Handlebars extensible

### 📦 Dépendances

- handlebars: ^4.7.8
- js-yaml: ^4.1.1
- inquirer: ^12.6.3

### 🎯 Objectifs Atteints

- ✅ Génération automatique complète de modules
- ✅ Maintenabilité via templates séparés
- ✅ Facilité de personnalisation
- ✅ Documentation exhaustive
- ✅ Intégration npm scripts

---

## Types de Changements

- **Ajouts** : Nouvelles fonctionnalités
- **Modifications** : Changements dans les fonctionnalités existantes
- **Suppressions** : Fonctionnalités retirées
- **Corrections** : Corrections de bugs
- **Sécurité** : Changements liés à la sécurité
- **Breaking Changes** : Modifications incompatibles avec les versions précédentes

## Convention de Versionnement

- **MAJOR** (X.0.0) : Breaking changes
- **MINOR** (1.X.0) : Nouvelles fonctionnalités (rétrocompatibles)
- **PATCH** (1.0.X) : Corrections de bugs
