# Générateur de Modules Moderne avec Handlebars

Générateur de modules complet utilisant des templates Handlebars pour créer automatiquement toute la structure d'un module avec interfaces TypeScript, modèles, routes API, store Pinia et composables Vue 3.

## ✨ Version 2.1 - Architecture Modulaire & Composables

**Nouveautés majeures :**

- 🎯 **Composables Vue 3 standardisés** : `use_resource_actions.ts` + `use_resource_filters.ts`
- 🏗️ **Architecture modulaire** : 6 générateurs spécialisés pour meilleure maintenabilité
- 📝 **Filtres enrichis** : Support des métadonnées (label, icon, trueLabel/falseLabel)
- ✅ **28 fichiers générés** : Interfaces, modèles, routes, store, actions, composables
- 📚 **Documentation consolidée** : README + ARCHITECTURE + generators/README

**Patterns modernes TypeScript :**

- ✅ Constructor parameter properties (auto-assignation)
- ✅ `this.isMock` centralisé dans les routes
- ✅ `NotFoundApiError` pour ressources manquantes
- ✅ Destructuration dans les actions
- ✅ Composition API Vue 3

## �🚀 Caractéristiques

- **Templates Handlebars** : Tous les fichiers sont générés à partir de templates `.hbs` modifiables
- **Configuration centralisée** : Tous les paramètres dans `config.js`
- **Helpers personnalisés** : Transformations de casse (PascalCase, camelCase, kebab-case, etc.)
- **Mode interactif** : Assistant pour créer des fichiers YAML
- **Mode dry-run** : Visualiser les changements sans les appliquer
- **Patterns modernes** : Aligné avec les meilleures pratiques TypeScript et Vue 3
- **Extensible** : Facile d'ajouter de nouveaux templates

## 📁 Structure

```
generators/module/
├── 📄 generator.js              # Orchestrateur principal
├── ⚙️ config.js                 # Configuration centralisée
├── 🔧 helpers.js                # Helpers Handlebars
├── 📖 README.md                 # Cette documentation
├── 🏗️ ARCHITECTURE.md           # Architecture modulaire détaillée
├── 📋 CHANGELOG.md              # Historique des versions
├── 📝 example.yaml              # Exemple complet documenté
├── 🧪 test-module.yaml          # Module de test
├── 🎨 templates/                # Templates Handlebars (.hbs)
│   ├── interface*.hbs          # 6 templates d'interfaces
│   ├── model.hbs               # Template modèle
│   ├── route-*.hbs             # 6 templates routes API
│   ├── action-*.hbs            # 10 templates actions store
│   └── composable-*.hbs        # 2 templates composables Vue 3
└── 🔨 generators/               # Générateurs spécialisés
    ├── README.md               # Documentation générateurs
    ├── index.js                # Export des générateurs
    ├── interfaces.js           # Génère 6 interfaces TypeScript
    ├── models.js               # Génère 1 modèle métier
    ├── routes.js               # Génère 6 routes API
    ├── actions.js              # Génère 10 actions store
    ├── store.js                # Génère store Pinia complet
    └── composables.js          # Génère 2 composables Vue 3
```

## 📖 Usage

## 🚀 Utilisation

### Génération d'un module

```bash
# Mode interactif (recommandé)
node generators/module/generator.js --interactive

# Avec un fichier YAML
node generators/module/generator.js resources/product.yaml

# Mode simulation (dry-run)
node generators/module/generator.js --dry-run resources/product.yaml

# Écraser un module existant
node generators/module/generator.js --overwrite resources/product.yaml
```

### Suppression d'un module

```bash
# Supprimer un module et nettoyer tous les enregistrements
node generators/module/delete-module.js Product

# Mode interactif
node generators/module/delete-module.js
```

**Note**: La suppression d'un module effectue automatiquement :

- ✅ Suppression du dossier du module
- ✅ Retrait des exports d'interfaces
- ✅ Suppression de la clé dans `StoreKeysEnum`
- ✅ Désenregistrement du store dans Pinia

## 📊 Fichiers générés

## 📝 Format du fichier YAML

```yaml
resource: Product
store_name: Product
description: Gestion des produits
extends: ApiResourceInterface
fields:
  - name: title
    type: string
    required: true
    description: Titre du produit
    default: ""

  - name: price
    type: number
    required: true
    description: Prix du produit en FCFA

  - name: inStock
    type: boolean
    required: false
    description: Disponibilité en stock
    default: true

  - name: tags
    type: string[]
    required: false
    description: Tags associés
    default: []
```

### Propriétés principales

- **resource** (requis) : Nom de la ressource en PascalCase
- **store_name** (optionnel) : Nom du store (par défaut = resource)
- **description** (optionnel) : Description du module
- **extends** (optionnel) : Interface étendue (défaut = ApiResourceInterface)
- **fields** (optionnel) : Liste des champs

### Propriétés des champs

- **name** (requis) : Nom du champ
- **type** (requis) : Type TypeScript (string, number, boolean, Date, array, object, etc.)
- **required** (optionnel) : Si le champ est requis (défaut = false)
- **description** (optionnel) : Description du champ
- **default** (optionnel) : Valeur par défaut

## 🔧 Helpers Handlebars disponibles

Les helpers suivants sont disponibles dans tous les templates :

### Transformations de casse

```handlebars
{{pascalCase "user-profile"}}
{{! UserProfile }}
{{camelCase "UserProfile"}}
{{! userProfile }}
{{kebabCase "UserProfile"}}
{{! user-profile }}
{{snakeCase "UserProfile"}}
{{! user_profile }}
{{upperCase "UserProfile"}}
{{! USER_PROFILE }}
{{lowerCase "UserProfile"}}
{{! userprofile }}
```

### Pluralisation

```handlebars
{{pluralize "User"}}
{{! Users }}
{{pluralize "Category"}}
{{! Categories }}
{{singularize "Users"}}
{{! User }}
```

### Utilitaires

```handlebars
{{jsonStringify myObject}}
{{! {"key":"value"} }}
{{indent myText 4}}
{{! Indente avec 4 espaces }}
{{formatDate myDate "YYYY-MM-DD"}}
```

### Conditions

```handlebars
{{#if (compare age ">" 18)}}
	Adulte
{{/if}}
```

## 🎨 Personnalisation

### Ajouter un nouveau template

1. Créer un fichier `.hbs` dans `templates/`
2. Ajouter la référence dans `config.js` :
   ```javascript
   templates: {
     monTemplate: "mon-template.hbs",
   }
   ```
3. Utiliser dans `generator.js` :
   ```javascript
   this.createFileFromTemplate(config.templates.monTemplate, outputPath, context);
   ```

### Ajouter un helper

Dans `helpers.js` :

```javascript
export function monHelper(param) {
	// Logique
	return result;
}

// Dans registerHelpers()
Handlebars.registerHelper("monHelper", monHelper);
```

### Modifier la configuration

Éditer `config.js` pour changer :

- Les chemins par défaut
- Les options de génération
- Les messages et emojis
- Les valeurs par défaut des types

## 🏗️ Structure générée

Pour une ressource `Product`, le générateur crée :

```
src/modules/products/
├── interfaces/
│   ├── product_interface.ts
│   ├── product_create_interface.ts
│   ├── product_update_interface.ts
│   ├── product_store_interface.ts
│   └── index.ts
├── models/
│   └── product_model.ts
├── apis/
│   ├── _product_route.ts
│   ├── product_create_route.ts
│   ├── product_list_route.ts
│   ├── product_find_route.ts
│   ├── product_update_route.ts
│   └── product_delete_route.ts
└── store/
    ├── actions/
    │   ├── add.ts
    │   ├── find.ts
    │   ├── update.ts
    │   ├── remove.ts
    │   ├── getProducts.ts
    │   ├── findProduct.ts
    │   ├── createProduct.ts
    │   ├── updateProduct.ts
    │   ├── deleteProduct.ts
    │   └── index.ts
    ├── definition.ts
    ├── getters.ts
    └── index.ts
```

## 🧪 Tests

Mode dry-run pour tester sans créer de fichiers :

```bash
node generators/module/generator.js --dry-run resources/test.yaml
# OU avec yarn
yarn generate:module:dry test-module.yaml
```

Un fichier de test est inclus : `test-module.yaml`

```bash
yarn generate:module:dry test-module.yaml
```

## 🎯 Patterns Modernes TypeScript

Le générateur produit du code aligné avec les meilleures pratiques modernes.

### 1. Constructor Parameter Properties

```typescript
// ✅ Code généré (moderne)
constructor(
  private elementId: string,
  public data: CreateInterface
) {
  super(...);
}

// ❌ Ancien pattern (verbeux)
private elementId: string;
public data: CreateInterface;

constructor(elementId: string, data: CreateInterface) {
  this.elementId = elementId;
  this.data = data;
  super(...);
}
```

### 2. Gestion du Mode Mock

```typescript
// ✅ Code généré (centralisé)
async request() {
  if (this.isMock) {
    return this.mock();
  }
  // Appel API réel
}

get isMock(): boolean {
  return config.apiMode === ApiModeEnum.MOCK;
}

// ❌ Ancien pattern (paramètre externe)
async request(mock?: boolean) {
  if (mock) return this.mock();
  // Appel API réel
}
```

### 3. Gestion d'Erreurs

```typescript
// ✅ Code généré (explicite)
async mock() {
  const element = store.find(this.elementId);

  if (!element) {
    return new NotFoundApiError({
      message: `Aucun élément trouvé avec l'ID ${this.elementId}.`,
    });
  }

  return new Model(element);
}

// ❌ Ancien pattern (crash ou undefined)
async mock() {
  const element = store.find(this.elementId);
  return new Model(element); // Peut crasher si undefined
}
```

### 4. Destructuration dans les Actions

```typescript
// ✅ Code généré (destructuration)
export async function getUsers(
  store: UserStore,
  { args }: { args?: ListApiArgsInterface } = {}
) {
  const route = new UserListRoute(args);
  return await route.request();
}

// Appel depuis le store
getUsers(args?) {
  return actions.getUsers(this, { args });
}

// ❌ Ancien pattern (paramètres directs)
export async function getUsers(
  store: UserStore,
  args?: ListApiArgsInterface
) {
  // ...
}
```

### 5. Mise à Jour Conditionnelle du Store

```typescript
// ✅ Code généré (intelligent)
export async function getAll(store, { args } = {}) {
	const result = await route.request();

	// Ne met à jour que si aucun filtre (= liste complète)
	if (Object.values(args || {}).length === 0) {
		store.elements = result.map((model) => model.interface);
	}

	return result;
}
```

📖 **Documentation complète** : [MODERNIZATION.md](./MODERNIZATION.md)

## 🐛 Débogage

### Mode verbose (par défaut)

Affiche tous les fichiers créés et les étapes :

```bash
node generators/module/generator.js resources/product.yaml
```

### Mode quiet

Affiche uniquement les erreurs :

```bash
node generators/module/generator.js --quiet resources/product.yaml
```

## 📚 Documentation Complémentaire

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Architecture modulaire détaillée et patterns
- **[generators/README.md](./generators/README.md)** - Documentation des générateurs spécialisés
- **[CHANGELOG.md](./CHANGELOG.md)** - Historique des versions
- **[example.yaml](./example.yaml)** - Spécification YAML complète avec exemples
- **[test-module.yaml](./test-module.yaml)** - Module de test pour validation

## 📚 Exemples d'utilisation

### Exemple 1 : Création simple

```bash
node generators/module/generator.js resources/category.yaml
```

### Exemple 2 : Mode interactif complet

```bash
node generators/module/generator.js --interactive
# Suivre les instructions à l'écran
```

### Exemple 3 : Écraser un module existant

```bash
node generators/module/generator.js --overwrite resources/product.yaml
```

### Exemple 4 : Simulation avant génération

```bash
# 1. Tester d'abord
node generators/module/generator.js --dry-run resources/order.yaml

# 2. Si OK, générer pour de vrai
node generators/module/generator.js resources/order.yaml
```

## � Gestion des actions

### Ajouter une action

Pour ajouter une action personnalisée à un store existant :

```bash
node generators/module/add-action.js <StoreName> <ActionName> --path <module-path>

# Exemples
node generators/module/add-action.js Product fetchByCategory --path src/modules/products
node generators/module/add-action.js User validateEmail --path src/modules/users
node generators/module/add-action.js PaymentProvider syncProviders --path src/modules/payment-providers
```

Le script va :

1. Créer le fichier de l'action depuis le template `action-custom.hbs`
2. Ajouter l'import et l'export dans `actions/index.ts`
3. Ajouter la méthode dans `store/index.ts`

### Supprimer une action

Pour supprimer une action d'un store :

```bash
node generators/module/remove-action.js <StoreName> <ActionName> --path <module-path>

# Exemples
node generators/module/remove-action.js Product fetchByCategory --path src/modules/products
node generators/module/remove-action.js User validateEmail --path src/modules/users
```

Le script va :

1. Supprimer le fichier de l'action
2. Retirer l'import et l'export de `actions/index.ts`
3. Retirer la méthode de `store/index.ts`

## 🔗 Intégration avec les scripts npm

Les scripts suivants sont disponibles dans `package.json` :

```json
{
	"scripts": {
		"generate:module:modern": "node generators/module/generator.js",
		"generate:module:interactive": "node generators/module/generator.js --interactive",
		"generate:module:dry": "node generators/module/generator.js --dry-run",
		"add:action": "node generators/module/add-action.js",
		"remove:action": "node generators/module/remove-action.js"
	}
}
```

Utilisation :

````bash
# Générer un module
yarn generate:module:modern resources/product.yaml
yarn generate:module:interactive
yarn generate:module:dry resources/test.yaml

# Gérer les actions
yarn add:action Product fetchByCategory --path src/modules/products
yarn remove:action Product fetchByCategory --path src/modules/products
```

## 🎯 Composables Générés

Le générateur crée automatiquement deux composables Vue 3 pour chaque module, suivant les patterns du module `users` :

### 1. Composable Actions (`use_resource_actions.ts`)

Gère toutes les opérations CRUD avec gestion uniforme des erreurs et snackbars :

```typescript
// Exemple d'utilisation
const {
	processing,
	products,
	getProducts,
	findProduct,
	createProduct,
	updateProduct,
	deleteProduct,
} = useProductActions();

// Récupérer la liste avec filtres
await getProducts({ category: "electronics", inStock: true });

// Créer un produit
const result = await createProduct({
	name: "Nouveau produit",
	price: 1500,
});

// Mettre à jour
await updateProduct(productId, { price: 1200 });

// Supprimer
await deleteProduct(product);
```

**Fonctionnalités :**

- ✅ Initialisation automatique du store
- ✅ Gestion des erreurs avec `ApiError`
- ✅ Snackbars automatiques (succès/erreur)
- ✅ Messages personnalisés selon la ressource
- ✅ État `processing` pour l'UI
- ✅ Chargement initial au `onMounted`

### 2. Composable Filtres (`use_resource_filters.ts`)

Gère la logique des filtres de liste avec métadonnées configurables :

```typescript
// Exemple d'utilisation
const {
	filters,
	draftFilters,
	activeFilters,
	setIsPublished,
	setCategory,
	setMinPrice,
	setMaxPrice,
	applyFilters,
	resetFilters,
	hasActiveFilters,
} = useProductFilters();

// Définir des filtres
setIsPublished(true);
setCategory("electronics");
setMinPrice(500);

// Appliquer les filtres
applyFilters();

// Obtenir les filtres actifs formatés pour l'UI
console.log(activeFilters.value);
// [
//   { key: 'isPublished', label: 'Statut de publication', icon: 'ri-eye-line', value: 'Publié' },
//   { key: 'category', label: 'Catégorie', icon: 'ri-folder-line', value: 'electronics' },
//   { key: 'minPrice', label: 'Prix minimum', icon: 'ri-money-dollar-circle-line', value: 500 }
// ]

// Réinitialiser
resetFilters();
```

**Fonctionnalités :**

- ✅ Gestion séparée des filtres draft/appliqués
- ✅ Configuration des métadonnées (label, icon)
- ✅ Formatage automatique des valeurs
- ✅ Labels personnalisés pour booléens
- ✅ Méthodes setters spécifiques générées automatiquement
- ✅ État `hasActiveFilters` pour l'UI
- ✅ Support des filtres complexes (arrays, enums)

### Configuration des Filtres dans le YAML

Les filtres sont configurés dans la section `filterAttributes` avec métadonnées complètes :

```yaml
filterAttributes:
  - name: isPublished
    type: boolean
    label: "Statut de publication" # Label affiché
    icon: "ri-eye-line" # Icône RemixIcon
    trueLabel: "Publié" # Label quand true
    falseLabel: "Brouillon" # Label quand false

  - name: category
    type: string
    label: "Catégorie"
    icon: "ri-folder-line"

  - name: minPrice
    type: number
    label: "Prix minimum"
    icon: "ri-money-dollar-circle-line"

  - name: status
    type: string
    label: "Statut"
    icon: "ri-shield-line"
    enumType: "ProductStatus" # Pour les enums
```

**Propriétés disponibles :**

- `name` : Nom du champ (requis)
- `type` : Type TypeScript (requis)
- `label` : Libellé affiché (optionnel, défaut: nom en PascalCase)
- `icon` : Icône RemixIcon (optionnel, défaut: ri-filter-line)
- `trueLabel` / `falseLabel` : Pour les booléens (optionnel)
- `enumType` : Nom du type enum si applicable (optionnel)
- `optional` : Si le filtre est optionnel (défaut: true)

### Intégration dans les Composants

```vue
<script setup lang="ts">
const { products, getProducts, deleteProduct } = useProductActions();
const { filters, setSearch, setCategory, applyFilters, activeFilters } =
	useProductFilters();

// Appliquer les filtres et recharger
const handleApplyFilters = async () => {
	applyFilters();
	await getProducts(filters.value);
};

// Supprimer un filtre actif
const removeActiveFilter = async (filterKey: string) => {
	removeFilter(filterKey);
	await getProducts(filters.value);
};
</script>

<template>
	<!-- Chips des filtres actifs -->
	<div v-if="hasActiveFilters">
		<v-chip v-for="filter in activeFilters" :key="filter.key" closable @click:close="removeActiveFilter(filter.key)">
			<v-icon :icon="filter.icon" start />
			{{ filter.label }}: {{ filter.value }}
		</v-chip>
	</div>

	<!-- Liste des produits -->
	<div v-for="product in products" :key="product.id">
		{{ product.name }}
	</div>
</template>
```

## 📞 Support

**Documentation :**

1. Consulter [ARCHITECTURE.md](./ARCHITECTURE.md) pour l'architecture détaillée
2. Consulter [generators/README.md](./generators/README.md) pour les générateurs
3. Voir [example.yaml](./example.yaml) pour un exemple complet
4. Utiliser `--dry-run` pour tester sans créer de fichiers

**En cas de problème :**

- Vérifier que le fichier YAML est valide
- S'assurer que `handlebars` et `js-yaml` sont installés
- Tester avec `test-module.yaml` en dry-run
- Consulter les logs en mode `--verbose`

---

**Version :** 2.1
**Auteur :** Adébayo Floriano Davidio Sergio Gomez
**Date :** Novembre 2025

## 📄 Licence

© 2025 SanlamAllianz Bénin Assurances Vie. All rights reserved.
Propriétaire : Adébayo Floriano Davidio Sergio Gomez
````
