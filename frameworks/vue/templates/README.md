# Templates Handlebars - Documentation

Ce dossier contient tous les templates Handlebars utilisés par le générateur de modules.

## 📋 Liste des Templates

### Interfaces (5 templates)

#### `interface.hbs`

**Génère** : `<resource>_interface.ts`  
**Description** : Interface principale d'une ressource  
**Variables** :

- `resource` : Nom de la ressource (ex: "User")
- `extends` : Interface parente (ex: "ApiResourceInterface")
- `attributes` : Liste des attributs avec types

**Exemple de sortie** :

```typescript
export interface UserInterface extends ApiResourceInterface {
	name: string;
	email: string;
	is_active: boolean;
}
```

#### `interface-create.hbs`

**Génère** : `<resource>_create_interface.ts`  
**Description** : Interface pour la création d'une ressource  
**Variables** :

- `resource` : Nom de la ressource
- `create_attributes` : Liste des attributs requis pour création

**Exemple de sortie** :

```typescript
export interface UserCreateInterface {
	name: string;
	email: string;
}
```

#### `interface-update.hbs`

**Génère** : `<resource>_update_interface.ts`  
**Description** : Interface pour la mise à jour (Partial)  
**Variables** :

- `resource` : Nom de la ressource
- `update_attributes` : Attributs modifiables

**Exemple de sortie** :

```typescript
export interface UserUpdateInterface extends Partial<Omit<UserCreateInterface, "id">> {}
```

#### `interface-store.hbs`

**Génère** : `<resource>_store_interface.ts`  
**Description** : Interface du store Pinia  
**Variables** :

- `resource` : Nom de la ressource

**Exemple de sortie** :

```typescript
export interface UserStoreInterface {
	elements: UserInterface[];
	loading: boolean;
	initialized: boolean;
}
```

#### `interface-index.hbs`

**Génère** : `interfaces/index.ts`  
**Description** : Exports de toutes les interfaces  
**Variables** :

- `resource` : Nom de la ressource

---

### Modèles (1 template)

#### `model.hbs`

**Génère** : `models/<resource>_model.ts`  
**Description** : Classe modèle pour une ressource  
**Variables** :

- `resource` : Nom de la ressource
- `attributes` : Liste des attributs

**Exemple de sortie** :

```typescript
export class UserModel extends ApiResourceModel {
	constructor(data: UserInterface) {
		super(data);
	}

	get interface(): UserInterface {
		return this.data as UserInterface;
	}
}
```

---

### Routes API (6 templates)

#### `route-base.hbs`

**Génère** : `apis/_<resource>_route.ts`  
**Description** : Classe de route de base  
**Patterns modernes** :

- ✅ `get isMock()` calculé depuis `config.apiMode`
- ✅ Gestion centralisée du mode mock

**Variables** :

- `resource` : Nom de la ressource

**Exemple de sortie** :

```typescript
export abstract class UserRoute extends ApiRoute {
	static name = "users";

	get isMock(): boolean {
		return config.apiMode === ApiModeEnum.MOCK;
	}
}
```

#### `route-create.hbs`

**Génère** : `apis/<resource>_create_route.ts`  
**Description** : Route de création  
**Patterns modernes** :

- ✅ Constructor parameter property : `public data`
- ✅ Vérification `this.isMock`
- ✅ Ajout automatique de `updated_at`

**Variables** :

- `resource` : Nom de la ressource

**Exemple de sortie** :

```typescript
export class UserCreateRoute extends UserRoute {
	constructor(public data: UserCreateInterface) {
		super(`/${UserRoute.name}`, ApiHttpMethod.POST, data);
	}

	async request() {
		if (this.isMock) {
			return this.mock();
		}
		// ...
	}
}
```

#### `route-list.hbs`

**Génère** : `apis/<resource>_list_route.ts`  
**Description** : Route de liste/récupération  
**Patterns modernes** :

- ✅ Parameter property : `private filters`
- ✅ Filtrage en mode mock

**Variables** :

- `resource` : Nom de la ressource

#### `route-find.hbs`

**Génère** : `apis/<resource>_find_route.ts`  
**Description** : Route de recherche par ID  
**Patterns modernes** :

- ✅ Parameter property : `private elementId`
- ✅ URL avec `/${elementId}`
- ✅ `NotFoundApiError` si non trouvé

**Variables** :

- `resource` : Nom de la ressource

#### `route-update.hbs`

**Génère** : `apis/<resource>_update_route.ts`  
**Description** : Route de mise à jour  
**Patterns modernes** :

- ✅ Parameters : `private elementId, public data`
- ✅ Vérification d'existence avec `NotFoundApiError`
- ✅ Merge des données existantes

**Variables** :

- `resource` : Nom de la ressource

#### `route-delete.hbs`

**Génère** : `apis/<resource>_delete_route.ts`  
**Description** : Route de suppression  
**Patterns modernes** :

- ✅ Parameter : `private elementId`
- ✅ Vérification avant suppression
- ✅ Retour de l'élément supprimé

**Variables** :

- `resource` : Nom de la ressource

---

### Actions Store (10 templates)

#### Actions de Base (4 templates)

##### `action-add.hbs`

**Génère** : `store/actions/add.ts`  
**Description** : Ajoute un élément au store local  
**Signature** : `(store, element: Interface)`

##### `action-find.hbs`

**Génère** : `store/actions/find.ts`  
**Description** : Cherche un élément par ID dans le store  
**Signature** : `(store, { id }: { id: Interface["id"] })`

##### `action-update.hbs`

**Génère** : `store/actions/update.ts`  
**Description** : Met à jour un élément dans le store  
**Signature** : `(store, { id, data }: { ... })`

##### `action-remove.hbs`

**Génère** : `store/actions/remove.ts`  
**Description** : Supprime un élément du store  
**Signature** : `(store, { id }: { id: Interface["id"] })`

#### Actions API (5 templates)

##### `action-getAll.hbs`

**Génère** : `store/actions/get<Resources>.ts`  
**Description** : Récupère tous les éléments via API  
**Patterns modernes** :

- ✅ Destructuration : `{ args }`
- ✅ Appel `.request()` uniquement
- ✅ Mise à jour conditionnelle du store

**Signature** : `(store, { args }: { args?: ListApiArgsInterface } = {})`

##### `action-findOne.hbs`

**Génère** : `store/actions/find<Resource>.ts`  
**Description** : Récupère un élément par ID via API  
**Patterns modernes** :

- ✅ Destructuration : `{ elementId }`
- ✅ Pas de paramètre `mock`

**Signature** : `(store, { elementId }: { elementId: Interface["id"] })`

##### `action-create.hbs`

**Génère** : `store/actions/create<Resource>.ts`  
**Description** : Crée un nouvel élément via API  
**Patterns modernes** :

- ✅ Destructuration : `{ data }`

**Signature** : `(store, { data }: { data: CreateInterface })`

##### `action-updateOne.hbs`

**Génère** : `store/actions/update<Resource>.ts`  
**Description** : Met à jour un élément via API  
**Patterns modernes** :

- ✅ Destructuration : `{ elementId, data }`

**Signature** : `(store, { elementId, data }: { ... })`

##### `action-delete.hbs`

**Génère** : `store/actions/delete<Resource>.ts`  
**Description** : Supprime un élément via API  
**Patterns modernes** :

- ✅ Destructuration : `{ elementId }`

**Signature** : `(store, { elementId }: { elementId: Interface["id"] })`

#### Actions Personnalisées

##### `action-custom.hbs`

**Génère** : `store/actions/<custom-action>.ts`  
**Description** : Template pour actions custom  
**Variables** :

- `action.name` : Nom de l'action
- `action.description` : Description

#### Index des Actions

##### `action-index.hbs`

**Génère** : `store/actions/index.ts`  
**Description** : Exports de toutes les actions  
**Patterns modernes** :

- ✅ Pas de `createBaseStoreActions`
- ✅ Export direct

**Exemple de sortie** :

```typescript
import { add } from "./add";
import { find } from "./find";
// ... autres imports

export const userStoreActions = {
	add,
	find,
	update,
	remove,
	getUsers,
	findUser,
	createUser,
	updateUser,
	deleteUser,
};
```

---

## 🎨 Helpers Handlebars Disponibles

Tous les helpers sont utilisables dans tous les templates :

### Transformations de Casse

```handlebars
{{pascalCase resource}}
→ UserProfile
{{camelCase resource}}
→ userProfile
{{kebabCase resource}}
→ user-profile
{{snakeCase resource}}
→ user_profile
{{upperCase resource}}
→ USERPROFILE
{{lowerCase resource}}
→ userprofile
```

### Pluralisation

```handlebars
{{pluralize resource}}
→ Users
{{singularize resources}}
→ User
```

### Utilitaires

```handlebars
{{jsonStringify object}}
→ {"key":"value"}
{{indent text 2}}
→ Indente de 2 espaces
{{formatDate date "YYYY"}}
→ 2024
```

### Conditions

```handlebars
{{#if (compare age ">" 18)}}
	Adulte
{{/if}}
```

---

## 📝 Conventions de Nommage

### Fichiers Générés

- Interfaces : `<resource>_<type>_interface.ts` (snake_case)
- Modèles : `<resource>_model.ts`
- Routes : `<resource>_<action>_route.ts`
- Actions : `<action><Resource>.ts` (camelCase + PascalCase)

### Classes et Types

- Interfaces : `<Resource><Type>Interface` (PascalCase)
- Classes : `<Resource>Model` / `<Resource><Action>Route`
- Actions : `get<Resources>`, `find<Resource>`, `create<Resource>`, etc.

---

## 🔧 Modification d'un Template

### Étapes

1. Ouvrir le template `.hbs` concerné
2. Modifier le contenu en respectant la syntaxe Handlebars
3. Tester avec `yarn generate:module:dry test-module.yaml`
4. Valider avec génération réelle

### Exemple : Ajouter un commentaire dans route-create.hbs

```handlebars
/** * Route de création
{{pascalCase resource}}
* Créé le
{{formatDate "now" "DD/MM/YYYY"}}
*/ export class
{{pascalCase resource}}CreateRoute extends
{{pascalCase resource}}Route { // ... reste du template }
```

---

## 📚 Patterns Modernes Appliqués

### 1. Constructor Parameter Properties ✅

```typescript
// Généré par nos templates
constructor(private elementId: string, public data: Interface) {
  super(...);
}
```

### 2. Gestion Centralisée du Mock ✅

```typescript
// Dans route-base.hbs
get isMock(): boolean {
  return config.apiMode === ApiModeEnum.MOCK;
}

// Dans toutes les routes
async request() {
  if (this.isMock) {
    return this.mock();
  }
  // ...
}
```

### 3. Gestion d'Erreurs Explicite ✅

```typescript
// Dans route-find.hbs, route-update.hbs, route-delete.hbs
if (!element) {
	return new NotFoundApiError({
		message: `Aucun élément trouvé avec l'ID ${this.elementId}.`,
	});
}
```

### 4. Destructuration dans Actions ✅

```typescript
// Toutes les actions API
export async function getUsers(
  store: Store,
  { args }: { args?: ListApiArgsInterface } = {}
) { ... }
```

### 5. Mise à Jour Conditionnelle ✅

```typescript
// Dans action-getAll.hbs
if (Object.values(args || {}).length === 0) {
	store.elements = result.map((model) => model.interface);
}
```

---

## 🎯 Référence Complète

- **Module de référence** : `src/modules/users/`
- **Documentation** : `../MODERNIZATION.md`
- **Validation** : `../VALIDATION_GUIDE.md`
- **Exemples** : `../example.yaml`, `../test-module.yaml`

---

✅ **Tous les templates sont alignés avec les patterns modernes !**
