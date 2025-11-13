/**
 * Configuration du générateur de modules
 * Centralise tous les paramètres et chemins
 */

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const config = {
	// Chemins de base
	paths: {
		// Templates restent relatifs au package
		templates: path.resolve(__dirname, "templates"),
		
		// Chemins de génération relatifs au projet utilisateur (process.cwd())
		// Ces chemins seront écrasés si une config utilisateur est trouvée
		root: process.cwd(),
		modules: path.resolve(process.cwd(), "src/modules"),
		resources: path.resolve(process.cwd(), "resources"),
	},

	// Templates disponibles
	templates: {
		// Interfaces
		interface: "interfaces/interface.hbs",
		interfaceCreate: "interfaces/interface-create.hbs",
		interfaceUpdate: "interfaces/interface-update.hbs",
		interfaceStore: "interfaces/interface-store.hbs",
		interfaceListFilter: "interfaces/interface-list-filter.hbs",
		interfaceIndex: "interfaces/interface-index.hbs",

		// Modèle
		model: "models/model.hbs",

		// Routes API
		routeBase: "routes/route-base.hbs",
		routeCreate: "routes/route-create.hbs",
		routeList: "routes/route-list.hbs",
		routeFind: "routes/route-find.hbs",
		routeUpdate: "routes/route-update.hbs",
		routeDelete: "routes/route-delete.hbs",
		routeNavigation: "routes/route-navigation.hbs",

		// Actions du store
		actionAdd: "actions/action-add.hbs",
		actionFind: "actions/action-find.hbs",
		actionUpdate: "actions/action-update.hbs",
		actionRemove: "actions/action-remove.hbs",
		actionGetAll: "actions/action-getAll.hbs",
		actionFindOne: "actions/action-findOne.hbs",
		actionCreate: "actions/action-create.hbs",
		actionUpdateOne: "actions/action-updateOne.hbs",
		actionDelete: "actions/action-delete.hbs",
		actionSet: "actions/action-set.hbs",
		actionIndex: "store/action-index.hbs",

		// Store
		storeDefinition: "store/store-definition.hbs",
		storeGetters: "store/store-getters.hbs",
		storeIndex: "store/store-index.hbs",

		// Composables
		composableUseActions: "composables/composable-use-actions.hbs",
		composableUseFilters: "composables/composable-use-filters.hbs",

		// Views
		viewList: "views/view-list.hbs",
		viewAdd: "views/view-add.hbs",
		viewEdit: "views/view-edit.hbs",

		// Components
		componentForm: "components/component-form.hbs",
		componentFormDialog: "components/component-form-dialog.hbs",
		componentDetailDialog: "components/component-detail-dialog.hbs",
		componentFiltersForm: "components/component-filters-form.hbs",
		componentSelector: "components/component-selector.hbs",
	},

	// Structure des dossiers du module
	moduleStructure: {
		interfaces: "interfaces",
		models: "models",
		apis: "apis",
		store: "store",
		actions: "store/actions",
		composables: "composables",
		views: "views",
		components: "components",
	},

	// Valeurs par défaut
	defaults: {
		extends: "ApiResourceInterface",
		storeName: null, // Sera dérivé du nom de la ressource si null
		description: "",
	},

	// Options de génération
	options: {
		overwrite: false, // Écraser les fichiers existants par défaut
		verbose: true, // Afficher les logs détaillés
		dryRun: false, // Mode simulation sans écriture
		useStoreScript: true, // Utiliser le script generate-store-full.js
	},

	// Mapping des types TypeScript vers valeurs par défaut
	typeDefaults: {
		string: '""',
		number: "0",
		boolean: "false",
		array: "[]",
		object: "{}",
		Date: "new Date()",
		null: "null",
		undefined: "undefined",
	},

	// Messages et emojis
	messages: {
		success: "✅",
		error: "❌",
		warning: "⚠️",
		info: "ℹ️",
		question: "❓",
		rocket: "🚀",
		folder: "📁",
		file: "📄",
		package: "📦",
		build: "🔨",
		clean: "🧹",
	},
};

export default config;
