# Architecture Modulaire du Générateur

Ce dossier contient les générateurs spécialisés pour chaque partie d'un module.

## 📋 Structure

```
generators/
├── interfaces.js       # Génère les interfaces TypeScript
├── models.js           # Génère les modèles métier
├── routes.js           # Génère les routes API CRUD
├── actions.js          # Génère les actions du store Pinia
├── store.js            # Génère le store Pinia complet
├── composables.js      # Génère les composables Vue 3
└── index.js            # Exporte tous les générateurs
```

## 🎯 Principe

Chaque générateur est une classe indépendante qui :

1. **Reçoit** une instance du `ModuleGenerator` parent et la `config`
2. **Expose** une méthode `generate(modulePath, spec)`
3. **Utilise** `moduleGenerator.createFileFromTemplate()` pour créer les fichiers
4. **Gère** sa propre logique métier

## 🔧 Utilisation

### Dans le générateur principal

```javascript
import {
	InterfacesGenerator,
	ModelsGenerator,
	RoutesGenerator,
	ActionsGenerator,
	StoreGenerator,
	ComposablesGenerator,
} from "./generators/index.js";

class ModuleGenerator {
	constructor(options = {}) {
		// ... init ...

		// Initialiser les générateurs spécialisés
		this.interfacesGenerator = new InterfacesGenerator(this, config);
		this.modelsGenerator = new ModelsGenerator(this, config);
		this.routesGenerator = new RoutesGenerator(this, config);
		this.actionsGenerator = new ActionsGenerator(this, config);
		this.storeGenerator = new StoreGenerator(this, config);
		this.composablesGenerator = new ComposablesGenerator(this, config);
	}

	generateInterfaces(modulePath, spec) {
		this.interfacesGenerator.generate(modulePath, spec);
	}
}
```

## 📦 Générateurs Disponibles

### InterfacesGenerator

Génère les 6 interfaces TypeScript d'un module :

- Interface principale (`resource_interface.ts`)
- Interface Create (`resource_create_interface.ts`)
- Interface Update (`resource_update_interface.ts`)
- Interface Store (`resource_store_interface.ts`)
- Interface List Filter (`resource_list_filter_interface.ts`)
- Index d'exports (`index.ts`)

### ModelsGenerator

Génère le modèle métier qui encapsule la logique :

- Modèle (`resource_model.ts`)

### RoutesGenerator

Génère les 6 routes API pour le backend :

- Route de base (`_resource_route.ts`)
- Route Create (`resource_create_route.ts`)
- Route List (`resource_list_route.ts`)
- Route Find (`resource_find_route.ts`)
- Route Update (`resource_update_route.ts`)
- Route Delete (`resource_delete_route.ts`)

### ActionsGenerator

Génère les 9 actions du store Pinia :

**Actions de base :**

- `add.ts` - Ajoute un élément au store
- `find.ts` - Trouve un élément dans le store
- `update.ts` - Met à jour un élément dans le store
- `remove.ts` - Supprime un élément du store

**Actions API :**

- `getResources.ts` - Récupère la liste depuis l'API
- `findResource.ts` - Récupère un élément depuis l'API
- `createResource.ts` - Crée un élément via l'API
- `updateResource.ts` - Met à jour un élément via l'API
- `deleteResource.ts` - Supprime un élément via l'API

**Index :**

- `index.ts` - Exporte toutes les actions

### StoreGenerator

Génère le store Pinia complet via le script `generate-store-full.js` :

- `definition.ts` - Définition du store
- `getters.ts` - Getters du store
- `index.ts` - Export principal du store

### ComposablesGenerator

Génère les 2 composables Vue 3 :

- `use_resource_actions.ts` - Composable pour les opérations CRUD
- `use_resource_filters.ts` - Composable pour la gestion des filtres

## ✨ Avantages

### Séparation des responsabilités

Chaque générateur a une responsabilité unique et bien définie.

### Maintenabilité

Facile de modifier la logique d'un type de génération sans impacter les autres.

### Testabilité

Chaque générateur peut être testé indépendamment.

### Extensibilité

Facile d'ajouter de nouveaux générateurs :

```javascript
// Créer generators/views.js
export class ViewsGenerator {
	constructor(moduleGenerator, config) {
		this.moduleGenerator = moduleGenerator;
		this.config = config;
	}

	generate(modulePath, spec) {
		// Logique de génération des vues
	}
}

// Ajouter à generators/index.js
export { ViewsGenerator } from "./views.js";

// Utiliser dans generator.js
this.viewsGenerator = new ViewsGenerator(this, config);
```

### Réutilisabilité

Les générateurs peuvent être utilisés dans d'autres contextes.

## 🔄 Flux de Génération

```
generator.js
    ↓
    ├─→ interfacesGenerator.generate()
    │       ↓
    │   Crée 6 interfaces TypeScript
    │
    ├─→ modelsGenerator.generate()
    │       ↓
    │   Crée le modèle métier
    │
    ├─→ routesGenerator.generate()
    │       ↓
    │   Crée 6 routes API
    │
    ├─→ storeGenerator.generate()
    │       ↓
    │   Exécute generate-store-full.js
    │
    ├─→ actionsGenerator.generate()
    │       ↓
    │   Crée 10 actions store
    │
    └─→ composablesGenerator.generate()
            ↓
        Crée 2 composables Vue 3
```

## 📝 Convention de Nommage

- **Classe** : `NomGenerator` (PascalCase)
- **Fichier** : `nom.js` (kebab-case)
- **Méthode** : `generate(modulePath, spec)` (standard)

## 🎨 Personnalisation

### Modifier un générateur existant

Éditer le fichier correspondant dans `generators/` :

```javascript
// generators/interfaces.js
generate(modulePath, spec) {
    // Ajouter votre logique personnalisée
    console.log('Génération personnalisée des interfaces');

    // Appeler la génération standard
    this.moduleGenerator.createFileFromTemplate(...);
}
```

### Créer un nouveau générateur

1. Créer `generators/mon-generateur.js`
2. Exporter dans `generators/index.js`
3. Initialiser dans `generator.js` constructor
4. Utiliser dans `generator.js` generate()

## 🧪 Tests

Pour tester un générateur spécifique :

```bash
# Mode dry-run
node generators/module/generator.js --dry-run test-module.yaml
```

## 📚 Documentation Associée

- [README.md](../README.md) - Documentation principale
- [MODERNIZATION.md](../MODERNIZATION.md) - Patterns modernes
- [ACTIONS.md](../ACTIONS.md) - Guide des actions
- [config.js](../config.js) - Configuration globale
- [helpers.js](../helpers.js) - Helpers Handlebars

## 🤝 Contribution

Pour ajouter un nouveau générateur :

1. Créer le fichier dans `generators/`
2. Suivre la structure existante
3. Documenter dans ce README
4. Ajouter des exemples d'utilisation
5. Tester avec `--dry-run`
