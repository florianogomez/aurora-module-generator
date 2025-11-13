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
		interface: "interface.hbs",
		interfaceCreate: "interface-create.hbs",
		interfaceUpdate: "interface-update.hbs",
		interfaceStore: "interface-store.hbs",
		interfaceListFilter: "interface-list-filter.hbs",
		interfaceIndex: "interface-index.hbs",

		// Modèle
		model: "model.hbs",

		// Routes API
		routeBase: "route-base.hbs",
		routeCreate: "route-create.hbs",
		routeList: "route-list.hbs",
		routeFind: "route-find.hbs",
		routeUpdate: "route-update.hbs",
		routeDelete: "route-delete.hbs",

		// Actions du store
		actionAdd: "action-add.hbs",
		actionFind: "action-find.hbs",
		actionUpdate: "action-update.hbs",
		actionRemove: "action-remove.hbs",
		actionGetAll: "action-getAll.hbs",
		actionFindOne: "action-findOne.hbs",
		actionCreate: "action-create.hbs",
		actionUpdateOne: "action-updateOne.hbs",
		actionDelete: "action-delete.hbs",
		actionIndex: "action-index.hbs",

		// Composables
		composableUseActions: "composable-use-actions.hbs",
		composableUseFilters: "composable-use-filters.hbs",

		// Views
		routeNavigation: "route-navigation.hbs",
		viewList: "view-list.hbs",
		viewAdd: "view-add.hbs",
		viewEdit: "view-edit.hbs",

		// Components
		componentForm: "component-form.hbs",
		componentFormDialog: "component-form-dialog.hbs",
		componentDetailDialog: "component-detail-dialog.hbs",
		componentFiltersForm: "component-filters-form.hbs",
		componentSelector: "component-selector.hbs",
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
