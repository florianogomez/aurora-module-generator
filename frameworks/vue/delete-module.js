#!/usr/bin/env node

/**
 * Script de suppression de module
 * Supprime un module et nettoie tous ses enregistrements
 *
 * Usage:
 *   node generators/module/delete-module.js <resource-name>
 *
 * @author Adébayo Floriano Davidio Sergio Gomez
 * @version 1.0.0
 */

import fs from "fs";
import path from "path";
import inquirer from "inquirer";
import { fileURLToPath } from "url";
import { pascalCase, camelCase, kebabCase, pluralize } from "./helpers.js";
import config from "./config.js";
import { loadAndMergeConfig } from "./config-loader.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Supprime la clé du store de l'enum
 */
function removeStoreKey(resource) {
	console.log(`\n${config.messages.clean} Suppression de la clé du store...`);

	const storeKeysEnumPath = path.join(config.paths.root, "src", "enums", "store_keys_enum.ts");
	const pascalResource = pascalCase(resource);

	if (!fs.existsSync(storeKeysEnumPath)) {
		console.warn(`${config.messages.warning} Fichier StoreKeysEnum non trouvé`);
		return;
	}

	let content = fs.readFileSync(storeKeysEnumPath, "utf-8");
	const lines = content.split("\n");
	const filteredLines = lines.filter((line) => !line.includes(`${pascalResource} = "`));

	if (lines.length === filteredLines.length) {
		console.log(`  ${config.messages.info} Clé ${pascalResource} non trouvée`);
		return;
	}

	content = filteredLines.join("\n");
	fs.writeFileSync(storeKeysEnumPath, content, "utf-8");
	console.log(`  ${config.messages.success} Clé ${pascalResource} supprimée`);
}

/**
 * Désenregistre le store du plugin Pinia
 */
function unregisterStoreFromPinia(resource) {
	console.log(`\n${config.messages.clean} Désenregistrement du store de Pinia...`);

	const piniaPluginPath = path.join(config.paths.root, "src", "plugins", "1.pinia", "index.ts");
	const pascalResource = pascalCase(resource);
	const camelResource = camelCase(resource);

	if (!fs.existsSync(piniaPluginPath)) {
		console.warn(`${config.messages.warning} Fichier plugin Pinia non trouvé`);
		return;
	}

	let content = fs.readFileSync(piniaPluginPath, "utf-8");
	const lines = content.split("\n");

	// Supprimer l'import
	const filteredLines = lines.filter(
		(line) =>
			!line.includes(`${camelResource}StoreDefinition`) &&
			!line.includes(`[StoreKeysEnum.${pascalResource}]`)
	);

	if (lines.length === filteredLines.length) {
		console.log(`  ${config.messages.info} Store ${pascalResource} non trouvé`);
		return;
	}

	content = filteredLines.join("\n");
	fs.writeFileSync(piniaPluginPath, content, "utf-8");
	console.log(`  ${config.messages.success} Store ${pascalResource} désenregistré`);
}

/**
 * Supprime les exports d'interfaces
 */
function removeInterfaceExports(resource) {
	console.log(`\n${config.messages.clean} Suppression des exports d'interfaces...`);

	const globalInterfacePath = path.join(config.paths.root, "src", "interfaces", "index.ts");
	const kebabResource = kebabCase(resource);
	const pluralKebabResource = pluralize(kebabResource);

	if (!fs.existsSync(globalInterfacePath)) {
		console.warn(`${config.messages.warning} Fichier d'export global non trouvé`);
		return;
	}

	let content = fs.readFileSync(globalInterfacePath, "utf-8");
	const lines = content.split("\n");
	const filteredLines = lines.filter(
		(line) => !line.includes(`@/modules/${pluralKebabResource}/interfaces/`)
	);

	if (lines.length === filteredLines.length) {
		console.log(`  ${config.messages.info} Aucun export trouvé`);
		return;
	}

	content = filteredLines.join("\n");
	fs.writeFileSync(globalInterfacePath, content, "utf-8");
	console.log(`  ${config.messages.success} Exports supprimés`);
}

/**
 * Supprime le dossier du module
 */
function deleteModuleFolder(resource, finalConfig) {
	console.log(`\n${config.messages.clean} Suppression du dossier du module...`);

	const pluralResource = pluralize(kebabCase(resource));
	const modulePath = path.join(finalConfig.paths.modules, pluralResource);

	if (!fs.existsSync(modulePath)) {
		console.warn(`  ${config.messages.warning} Dossier non trouvé: ${modulePath}`);
		return;
	}

	fs.rmSync(modulePath, { recursive: true, force: true });
	console.log(`  ${config.messages.success} Dossier supprimé: ${modulePath}`);
}

/**
 * Point d'entrée principal
 */
async function main() {
	console.log(`\n${config.messages.rocket} Suppression de module\n`);

	// Récupérer le nom de la ressource
	let resource = process.argv[2];

	if (!resource) {
		const { inputResource } = await inquirer.prompt([
			{
				type: "input",
				name: "inputResource",
				message: "Nom de la ressource à supprimer:",
				validate: (input) => input.trim().length > 0 || "Le nom est requis",
			},
		]);
		resource = inputResource;
	}

	// Charger la configuration utilisateur
	console.log(`\n${config.messages.package} Chargement de la configuration...`);
	const finalConfig = await loadAndMergeConfig(config);

	const pluralResource = pluralize(kebabCase(resource));
	const modulePath = path.join(finalConfig.paths.modules, pluralResource);

	console.log(`\nℹ️  Ressource: ${resource}`);
	console.log(`📁 Chemin: ${modulePath}`);

	// Confirmation
	const { confirm } = await inquirer.prompt([
		{
			type: "confirm",
			name: "confirm",
			message: `⚠️  Êtes-vous sûr de vouloir supprimer le module "${resource}" ?`,
			default: false,
		},
	]);

	if (!confirm) {
		console.log(`\n${config.messages.error} Suppression annulée`);
		process.exit(0);
	}

	// Suppression
	try {
		deleteModuleFolder(resource, finalConfig);
		removeInterfaceExports(resource);
		removeStoreKey(resource);
		unregisterStoreFromPinia(resource);

		console.log(`\n${config.messages.success} Module "${resource}" supprimé avec succès!`);
	} catch (error) {
		console.error(`\n${config.messages.error} Erreur lors de la suppression:`, error);
		process.exit(1);
	}
}

// Exécution
main();
