#!/usr/bin/env node

/**
 * Générateur de modules moderne avec templates Handlebars
 *
 * Ce script génère automatiquement un module complet avec :
 * - Interfaces TypeScript
 * - Modèles
 * - Routes API (CRUD)
 * - Store Pinia avec actions
 *
 * Usage:
 *   node generators/module/generator.js [chemin_yaml]
 *   node generators/module/generator.js --interactive
 *   node generators/module/generator.js --help
 *
 * @author Adébayo Floriano Davidio Sergio Gomez
 * @version 2.0.0
 */

import fs from "fs";
import path from "path";
import Handlebars from "handlebars";
import yaml from "js-yaml";
import { spawnSync } from "child_process";
import inquirer from "inquirer";
import { fileURLToPath } from "url";

// Configuration et helpers
import config from "./config.js";
import { loadAndMergeConfig } from "./config-loader.js";
import { registerHelpers, pascalCase, camelCase, kebabCase, pluralize } from "./helpers.js";

// Générateurs spécialisés
import {
	InterfacesGenerator,
	ModelsGenerator,
	RoutesGenerator,
	ActionsGenerator,
	StoreGenerator,
	ComposablesGenerator,
	ViewsGenerator,
} from "./generators/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Enregistrer les helpers Handlebars
registerHelpers(Handlebars);

/**
 * Classe principale du générateur
 */
class ModuleGenerator {
	constructor(options = {}, customConfig = null) {
		this.config = customConfig || config;
		this.options = { ...this.config.options, ...options };
		this.templates = new Map();
		this.stats = {
			filesCreated: 0,
			filesSkipped: 0,
			errors: [],
		};

		// Initialiser les générateurs spécialisés avec la config
		this.interfacesGenerator = new InterfacesGenerator(this, this.config);
		this.modelsGenerator = new ModelsGenerator(this, this.config);
		this.routesGenerator = new RoutesGenerator(this, this.config);
		this.actionsGenerator = new ActionsGenerator(this, this.config);
		this.storeGenerator = new StoreGenerator(this, this.config);
		this.composablesGenerator = new ComposablesGenerator(this, this.config);
		this.viewsGenerator = new ViewsGenerator(this, this.config);
	}

	/**
	 * Charge un template Handlebars
	 * @param {string} templateName - Nom du template
	 * @returns {Function} Template compilé
	 */
	loadTemplate(templateName) {
		if (this.templates.has(templateName)) {
			return this.templates.get(templateName);
		}

		const templatePath = path.join(this.config.paths.templates, templateName);
		if (!fs.existsSync(templatePath)) {
			throw new Error(`Template non trouvé: ${templatePath}`);
		}

		const templateContent = fs.readFileSync(templatePath, "utf-8");
		const compiled = Handlebars.compile(templateContent, { noEscape: false });
		this.templates.set(templateName, compiled);

		return compiled;
	}

	/**
	 * Crée un fichier à partir d'un template
	 * @param {string} templateName - Nom du template
	 * @param {string} outputPath - Chemin de sortie
	 * @param {object} context - Contexte pour le template
	 */
	createFileFromTemplate(templateName, outputPath, context) {
		try {
			// Vérifier si le fichier existe déjà
			if (fs.existsSync(outputPath) && !this.options.overwrite) {
				if (this.options.verbose) {
					console.log(`  ⏭️  Fichier existant ignoré: ${outputPath}`);
				}
				this.stats.filesSkipped++;
				return false;
			}

			// Mode dry-run
			if (this.options.dryRun) {
				console.log(`  [DRY-RUN] Créerait: ${outputPath}`);
				return true;
			}

			// Charger et compiler le template
			const template = this.loadTemplate(templateName);
			const content = template(context);

			// Créer les dossiers parents si nécessaire
			const dirname = path.dirname(outputPath);
			if (!fs.existsSync(dirname)) {
				fs.mkdirSync(dirname, { recursive: true });
			}

			// Écrire le fichier
			fs.writeFileSync(outputPath, content, "utf-8");

			if (this.options.verbose) {
				console.log(`  ${config.messages.success} Créé: ${outputPath}`);
			}

			this.stats.filesCreated++;
			return true;
		} catch (error) {
			const errorMsg = `Erreur lors de la création de ${outputPath}: ${error.message}`;
			this.stats.errors.push(errorMsg);
			console.error(`  ${config.messages.error} ${errorMsg}`);
			return false;
		}
	}

	/**
	 * Génère les interfaces TypeScript
	 * @param {string} modulePath - Chemin du module
	 * @param {object} spec - Spécification du module
	 */
	generateInterfaces(modulePath, spec) {
		this.interfacesGenerator.generate(modulePath, spec);
	}

	/**
	 * Génère le modèle
	 * @param {string} modulePath - Chemin du module
	 * @param {object} spec - Spécification du module
	 */
	generateModel(modulePath, spec) {
		this.modelsGenerator.generate(modulePath, spec);
	}

	/**
	 * Génère les routes API
	 * @param {string} modulePath - Chemin du module
	 * @param {object} spec - Spécification du module
	 */
	generateApiRoutes(modulePath, spec) {
		this.routesGenerator.generate(modulePath, spec);
	}

	/**
	 * Génère les actions du store
	 * @param {string} modulePath - Chemin du module
	 * @param {object} spec - Spécification du module
	 */
	generateStoreActions(modulePath, spec) {
		this.actionsGenerator.generate(modulePath, spec);
	}

	/**
	 * Génère les composables
	 * @param {string} modulePath - Chemin du module
	 * @param {object} spec - Spécification du module
	 */
	generateComposables(modulePath, spec) {
		this.composablesGenerator.generate(modulePath, spec);
	}

	/**
	 * Génère les vues et la navigation
	 * @param {string} modulePath - Chemin du module
	 * @param {object} spec - Spécification du module
	 */
	generateViews(modulePath, spec) {
		this.viewsGenerator.generate(modulePath, spec);
	}

	/**
	 * Génère le store avec le script existant
	 * @param {string} modulePath - Chemin du module
	 * @param {object} spec - Spécification du module
	 */
	generateStore(modulePath, spec) {
		this.storeGenerator.generate(modulePath, spec);
	}

	/**
	 * Exporte les interfaces dans le fichier global
	 * @param {string} resource - Nom de la ressource
	 */
	exportInterfacesGlobally(resource) {
		console.log(`\n${config.messages.build} Export des interfaces...`);

		const globalInterfacePath = path.join(config.paths.root, "src", "interfaces", "index.ts");
		const kebabResource = kebabCase(resource);
		const pluralKebabResource = pluralize(kebabResource);

		const exports = [
			`export * from "@/modules/${pluralKebabResource}/interfaces/${kebabResource}_interface";`,
			`export * from "@/modules/${pluralKebabResource}/interfaces/${kebabResource}_create_interface";`,
			`export * from "@/modules/${pluralKebabResource}/interfaces/${kebabResource}_update_interface";`,
			`export * from "@/modules/${pluralKebabResource}/interfaces/${kebabResource}_store_interface";`,
		];

		if (this.options.dryRun) {
			console.log(`  [DRY-RUN] Ajouterait ${exports.length} exports à ${globalInterfacePath}`);
			return;
		}

		if (!fs.existsSync(globalInterfacePath)) {
			console.warn(
				`${config.messages.warning} Fichier d'export global non trouvé: ${globalInterfacePath}`
			);
			return;
		}

		let currentContent = fs.readFileSync(globalInterfacePath, "utf-8");
		const lines = currentContent.split("\n");

		const newExports = exports.filter((exp) => !lines.includes(exp));

		if (newExports.length > 0) {
			const updatedContent = currentContent + "\n" + newExports.join("\n") + "\n";
			fs.writeFileSync(globalInterfacePath, updatedContent, "utf-8");
			console.log(`  ${config.messages.success} ${newExports.length} interface(s) exportée(s)`);
		} else {
			console.log(`  ${config.messages.info} Interfaces déjà exportées`);
		}
	}

	/**
	 * Enregistre le store dans l'enum StoreKeysEnum
	 * @param {string} resource - Nom de la ressource
	 */
	registerStoreKey(resource) {
		console.log(`\n${config.messages.build} Enregistrement de la clé du store...`);

		const storeKeysEnumPath = path.join(config.paths.root, "src", "enums", "store_keys_enum.ts");
		const pascalResource = pascalCase(resource);

		if (this.options.dryRun) {
			console.log(`  [DRY-RUN] Ajouterait la clé ${pascalResource} à ${storeKeysEnumPath}`);
			return;
		}

		if (!fs.existsSync(storeKeysEnumPath)) {
			console.warn(
				`${config.messages.warning} Fichier StoreKeysEnum non trouvé: ${storeKeysEnumPath}`
			);
			return;
		}

		let content = fs.readFileSync(storeKeysEnumPath, "utf-8");

		// Vérifier si la clé existe déjà
		if (content.includes(`${pascalResource} = "`)) {
			console.log(`  ${config.messages.info} Clé ${pascalResource} déjà présente`);
			return;
		}

		// Ajouter la nouvelle clé avant la dernière accolade
		const lines = content.split("\n");
		const lastBraceIndex = lines.findLastIndex((line) => line.trim() === "}");

		if (lastBraceIndex === -1) {
			console.error(`  ${config.messages.error} Structure d'enum invalide`);
			return;
		}

		// Trouver la dernière ligne avec du contenu (pas juste une accolade)
		let insertIndex = lastBraceIndex;
		for (let i = lastBraceIndex - 1; i >= 0; i--) {
			const trimmed = lines[i].trim();
			if (trimmed && trimmed !== "}") {
				insertIndex = i + 1;
				break;
			}
		}

		lines.splice(insertIndex, 0, `\t${pascalResource} = "${pascalResource}",`);
		content = lines.join("\n");

		fs.writeFileSync(storeKeysEnumPath, content, "utf-8");
		console.log(`  ${config.messages.success} Clé ${pascalResource} ajoutée à StoreKeysEnum`);
	}

	/**
	 * Enregistre le store dans le plugin Pinia
	 * @param {string} resource - Nom de la ressource
	 */
	registerStoreInPinia(resource) {
		console.log(`\n${config.messages.build} Enregistrement du store dans Pinia...`);

		const piniaPluginPath = path.join(config.paths.root, "src", "plugins", "1.pinia", "index.ts");
		const pascalResource = pascalCase(resource);
		const camelResource = camelCase(resource);
		const kebabResource = kebabCase(resource);
		const pluralKebabResource = pluralize(kebabResource);

		if (this.options.dryRun) {
			console.log(`  [DRY-RUN] Enregistrerait le store ${pascalResource} dans ${piniaPluginPath}`);
			return;
		}

		if (!fs.existsSync(piniaPluginPath)) {
			console.warn(
				`${config.messages.warning} Fichier plugin Pinia non trouvé: ${piniaPluginPath}`
			);
			return;
		}

		let content = fs.readFileSync(piniaPluginPath, "utf-8");

		// Vérifier si le store est déjà enregistré
		if (content.includes(`${camelResource}StoreDefinition`)) {
			console.log(`  ${config.messages.info} Store ${pascalResource} déjà enregistré`);
			return;
		}

		// Ajouter l'import après les autres imports
		const importLine = `import { ${camelResource}StoreDefinition } from "@/modules/${pluralKebabResource}/store/definition";`;

		// Trouver la dernière ligne d'import
		const lines = content.split("\n");
		let lastImportIndex = -1;
		for (let i = 0; i < lines.length; i++) {
			if (lines[i].trim().startsWith("import ")) {
				lastImportIndex = i;
			}
		}

		if (lastImportIndex !== -1) {
			lines.splice(lastImportIndex + 1, 0, importLine);
		}

		// Ajouter l'enregistrement dans le plugin
		// Trouver la ligne avec "application]: undefined," et ajouter avant
		const pluginConfigIndex = lines.findIndex((line) =>
			line.includes("[StoreKeysEnum.application]: undefined,")
		);

		if (pluginConfigIndex !== -1) {
			const storeRegistration = `\t\t\t[StoreKeysEnum.${pascalResource}]: {\n\t\t\t\tservice: ${camelResource}StoreDefinition.service,\n\t\t\t\tthrottleMs: 1000,\n\t\t\t},`;
			lines.splice(pluginConfigIndex, 0, storeRegistration);
		}

		content = lines.join("\n");
		fs.writeFileSync(piniaPluginPath, content, "utf-8");
		console.log(`  ${config.messages.success} Store ${pascalResource} enregistré dans Pinia`);
	}

	/**
	 * Génère un module complet à partir d'une spécification YAML
	 * @param {object} spec - Spécification du module
	 * @returns {boolean} Succès ou échec
	 */
	async generate(spec) {
		try {
			const resource = spec.resource;
			const pluralResource = pluralize(kebabCase(resource));
			const modulePath = path.join(this.config.paths.modules, pluralResource);

			console.log(`\n${this.config.messages.rocket} Génération du module "${resource}"`);
			console.log(`${this.config.messages.folder} Chemin: ${modulePath}`);

			// Vérifier si le module existe
			if (fs.existsSync(modulePath)) {
				if (!this.options.overwrite) {
					const { overwrite } = await inquirer.prompt([
						{
							type: "confirm",
							name: "overwrite",
							message: `${config.messages.warning} Le module "${resource}" existe déjà. Écraser?`,
							default: false,
						},
					]);

					if (!overwrite) {
						console.log(`${config.messages.error} Génération annulée`);
						return false;
					}

					this.options.overwrite = true;
				}

				if (!this.options.dryRun) {
					console.log(`${config.messages.clean} Nettoyage de l'ancien module...`);
					fs.rmSync(modulePath, { recursive: true, force: true });
				}
			}

			// Générer les composants
			this.generateInterfaces(modulePath, spec);
			this.generateModel(modulePath, spec);
			this.generateApiRoutes(modulePath, spec);
			this.generateStoreActions(modulePath, spec); // Actions d'abord
			this.generateStore(modulePath, spec); // Store ensuite (génère definition, getters, index)
			this.generateComposables(modulePath, spec);
			this.generateViews(modulePath, spec);
			this.exportInterfacesGlobally(resource);
			this.registerStoreKey(resource);
			this.registerStoreInPinia(resource);

			// Statistiques
			console.log(`\n${config.messages.success} Génération terminée!`);
			console.log(`  📊 Fichiers créés: ${this.stats.filesCreated}`);
			console.log(`  ⏭️  Fichiers ignorés: ${this.stats.filesSkipped}`);

			if (this.stats.errors.length > 0) {
				console.log(`  ${config.messages.error} Erreurs: ${this.stats.errors.length}`);
				this.stats.errors.forEach((err) => console.error(`    - ${err}`));
			}

			return this.stats.errors.length === 0;
		} catch (error) {
			console.error(`\n${config.messages.error} Erreur fatale:`, error);
			return false;
		}
	}
}

/**
 * Charge et valide un fichier YAML
 * @param {string} yamlPath - Chemin du fichier YAML
 * @returns {object} Spécification du module
 */
function loadYamlSpec(yamlPath) {
	if (!fs.existsSync(yamlPath)) {
		throw new Error(`Fichier YAML introuvable: ${yamlPath}`);
	}

	const yamlContent = fs.readFileSync(yamlPath, "utf-8");
	const spec = yaml.load(yamlContent);

	// Validation minimale
	if (!spec.resource) {
		throw new Error("Le fichier YAML doit contenir une clé 'resource'");
	}

	// Valeurs par défaut
	spec.store_name = spec.store_name || spec.resource;
	spec.extends = spec.extends || config.defaults.extends;
	spec.fields = spec.fields || [];
	spec.description = spec.description || "";

	return spec;
}

/**
 * Crée un fichier YAML interactivement
 * @returns {string} Chemin du fichier YAML créé
 */
async function createYamlInteractively() {
	console.log(`\n${config.messages.package} Création interactive d'un fichier YAML\n`);

	const answers = await inquirer.prompt([
		{
			type: "input",
			name: "resource",
			message: "Nom de la ressource (PascalCase):",
			validate: (input) => input.trim().length > 0 || "Le nom est requis",
		},
		{
			type: "input",
			name: "storeName",
			message: "Nom du store:",
			default: (answers) => answers.resource,
		},
		{
			type: "input",
			name: "description",
			message: "Description:",
			default: "",
		},
		{
			type: "input",
			name: "extends",
			message: "Interface étendue:",
			default: config.defaults.extends,
		},
	]);

	// Champs
	const fields = [];
	let addMore = true;

	while (addMore) {
		console.log(`\n${config.messages.info} Ajout d'un champ:`);

		const field = await inquirer.prompt([
			{
				type: "input",
				name: "name",
				message: "  Nom du champ:",
				validate: (input) => input.trim().length > 0 || "Le nom est requis",
			},
			{
				type: "list",
				name: "type",
				message: "  Type:",
				choices: ["string", "number", "boolean", "Date", "array", "object"],
				default: "string",
			},
			{
				type: "confirm",
				name: "required",
				message: "  Requis?",
				default: true,
			},
			{
				type: "input",
				name: "description",
				message: "  Description:",
				default: (ans) => `Le champ ${ans.name}`,
			},
			{
				type: "input",
				name: "default",
				message: "  Valeur par défaut (laisser vide si aucune):",
				default: "",
			},
		]);

		if (field.default) {
			try {
				field.default = JSON.parse(field.default);
			} catch {
				// Garder comme chaîne si ce n'est pas du JSON valide
			}
		} else {
			delete field.default;
		}

		fields.push(field);

		const { continueAdding } = await inquirer.prompt([
			{
				type: "confirm",
				name: "continueAdding",
				message: "Ajouter un autre champ?",
				default: true,
			},
		]);

		addMore = continueAdding;
	}

	// Créer le YAML
	const spec = {
		resource: answers.resource,
		store_name: answers.storeName,
		description: answers.description,
		extends: answers.extends,
		fields,
	};

	const yamlContent = yaml.dump(spec, { indent: 2 });

	// Sauvegarder
	const timestamp = new Date().toISOString().replace(/[:.]/g, "-").substring(0, 19);
	const yamlPath = path.join(
		config.paths.resources,
		`${kebabCase(answers.resource)}-${timestamp}.yaml`
	);

	fs.mkdirSync(config.paths.resources, { recursive: true });
	fs.writeFileSync(yamlPath, yamlContent, "utf-8");

	console.log(`\n${config.messages.success} Fichier YAML créé: ${yamlPath}`);

	return yamlPath;
}

/**
 * Affiche l'aide
 */
function showHelp() {
	console.log(`
${config.messages.rocket} Générateur de modules moderne avec Handlebars

Usage:
  node generators/module/generator.js [options] [chemin_yaml]

Options:
  --interactive     Mode interactif pour créer un YAML
  --dry-run         Simulation sans écriture de fichiers
  --overwrite       Écrase les fichiers existants
  --no-store        Ne génère pas le store avec le script
  --verbose         Affiche les logs détaillés (défaut)
  --quiet           Affiche uniquement les erreurs
  --help            Affiche cette aide

Exemples:
  node generators/module/generator.js resources/product.yaml
  node generators/module/generator.js --interactive
  node generators/module/generator.js --dry-run resources/user.yaml
  node generators/module/generator.js --overwrite resources/order.yaml

Documentation:
  Les templates sont dans: generators/module/templates/
  Configuration dans: generators/module/config.js
  Helpers dans: generators/module/helpers.js
`);
}

/**
 * Point d'entrée principal
 */
async function main() {
	const args = process.argv.slice(2);

	// Aide
	if (args.includes("--help") || args.includes("-h")) {
		showHelp();
		process.exit(0);
	}

	// Options
	const options = {
		interactive: args.includes("--interactive"),
		dryRun: args.includes("--dry-run"),
		overwrite: args.includes("--overwrite"),
		useStoreScript: !args.includes("--no-store"),
		verbose: !args.includes("--quiet"),
	};

	// Chemin YAML
	let yamlPath = args.find((arg) => !arg.startsWith("--"));

	// Mode interactif
	if (options.interactive || !yamlPath) {
		const { action } = await inquirer.prompt([
			{
				type: "list",
				name: "action",
				message: "Que voulez-vous faire?",
				choices: [
					{ name: "Créer un nouveau fichier YAML", value: "create" },
					{ name: "Utiliser un fichier YAML existant", value: "select" },
				],
			},
		]);

		if (action === "create") {
			yamlPath = await createYamlInteractively();
		} else {
			const { selectedPath } = await inquirer.prompt([
				{
					type: "input",
					name: "selectedPath",
					message: "Chemin du fichier YAML:",
					validate: (input) => fs.existsSync(input) || "Fichier introuvable",
				},
			]);
			yamlPath = selectedPath;
		}
	}

	// Charger la spécification
	console.log(`\n${config.messages.file} Chargement de ${yamlPath}...`);
	const spec = loadYamlSpec(yamlPath);

	// Aperçu
	console.log(`\n${config.messages.info} Aperçu:`);
	console.log(`  Ressource: ${spec.resource}`);
	console.log(`  Store: ${spec.store_name}`);
	console.log(`  Étend: ${spec.extends}`);
	console.log(`  Champs: ${spec.fields.length}`);

	if (options.dryRun) {
		console.log(`\n${config.messages.warning} Mode DRY-RUN activé (aucun fichier ne sera créé)`);
	}

	// Confirmation
	const { confirm } = await inquirer.prompt([
		{
			type: "confirm",
			name: "confirm",
			message: "Générer le module?",
			default: true,
		},
	]);

	if (!confirm) {
		console.log(`\n${config.messages.error} Génération annulée`);
		process.exit(0);
	}

	// Charger la configuration utilisateur
	console.log(`\n${config.messages.package} Chargement de la configuration...`);
	const finalConfig = await loadAndMergeConfig(config);

	// Génération
	const generator = new ModuleGenerator(options, finalConfig);
	const success = await generator.generate(spec);

	process.exit(success ? 0 : 1);
}

// Gestion des interruptions
process.on("SIGINT", () => {
	console.log(`\n\n${config.messages.warning} Interruption détectée. Arrêt...`);
	process.exit(130);
});

process.on("unhandledRejection", (err) => {
	if (err && err.message && err.message.includes("User force closed the prompt")) {
		console.log(`\n${config.messages.warning} Interruption par l'utilisateur`);
		process.exit(130);
	} else {
		console.error(`\n${config.messages.error} Erreur non gérée:`, err);
		process.exit(1);
	}
});

// Exécution
main();
