#!/usr/bin/env node

/**
 * Script pour supprimer une action d'un store existant
 *
 * Usage:
 *   node generators/module/remove-action.js <StoreName> <ActionName> --path <module-path>
 *   node generators/module/remove-action.js Product fetchByCategory --path src/modules/products
 *
 * @author Adébayo Floriano Davidio Sergio Gomez
 * @version 2.0.0
 */

import fs from "fs";
import path from "path";
import { pascalCase, camelCase } from "./helpers.js";

/**
 * Supprime une action du store
 */
function removeActionFromStore(modulePath, storeName, actionName) {
	const storeDir = path.join(process.cwd(), modulePath, "store");
	const actionsDir = path.join(storeDir, "actions");

	const pascalName = pascalCase(storeName);
	const camelName = camelCase(pascalName);

	// Vérifier si le dossier actions existe
	if (!fs.existsSync(actionsDir)) {
		console.error(`❌ Dossier actions introuvable: ${actionsDir}`);
		process.exit(1);
	}

	console.log(`\n🗑️  Suppression de l'action "${actionName}" du store "${storeName}"...`);

	// 1. Supprimer le fichier d'action
	const actionFile = path.join(actionsDir, `${actionName}.ts`);
	if (fs.existsSync(actionFile)) {
		fs.unlinkSync(actionFile);
		console.log(`  ✅ Fichier supprimé: ${actionFile}`);
	} else {
		console.warn(`  ⚠️  Fichier d'action introuvable: ${actionFile}`);
	}

	// 2. Mettre à jour actions/index.ts
	updateActionsIndex(actionsDir, actionName);

	// 3. Mettre à jour store/index.ts
	updateStoreIndex(storeDir, actionName);

	console.log(`\n✅ Action "${actionName}" supprimée avec succès du store "${storeName}"`);
}

/**
 * Met à jour le fichier actions/index.ts pour retirer l'action
 */
function updateActionsIndex(actionsDir, actionName) {
	const indexPath = path.join(actionsDir, "index.ts");

	if (!fs.existsSync(indexPath)) {
		console.warn(`  ⚠️  Fichier index.ts introuvable: ${indexPath}`);
		return;
	}

	let content = fs.readFileSync(indexPath, "utf-8");
	let lines = content.split(/\r?\n/);
	let modified = false;

	// Retirer la ligne d'import
	const importPattern = new RegExp(
		`^import\\s*\\{\\s*${actionName}\\s*\\}\\s*from\\s*"\\.\\/${actionName}";?$`
	);
	const originalLength = lines.length;
	lines = lines.filter((line) => !importPattern.test(line.trim()));

	if (lines.length < originalLength) {
		modified = true;
		console.log(`  ✅ Import retiré de ${indexPath}`);
	}

	// Retirer l'export de l'objet
	let inExportObject = false;
	let braceDepth = 0;

	lines = lines.filter((line) => {
		const trimmed = line.trim();

		// Détecter le début de l'export
		if (trimmed.match(/^export const \w+StoreActions\s*=\s*\{/)) {
			inExportObject = true;
			braceDepth = 1;
			return true;
		}

		if (inExportObject) {
			// Compter les accolades
			for (const char of line) {
				if (char === "{") braceDepth++;
				if (char === "}") braceDepth--;
			}

			// Fin de l'objet
			if (braceDepth === 0) {
				inExportObject = false;
			}

			// Retirer la ligne si elle contient uniquement l'action
			if (trimmed === `${actionName},` || trimmed === `${actionName}`) {
				modified = true;
				console.log(`  ✅ Export retiré de ${indexPath}`);
				return false;
			}
		}

		return true;
	});

	if (modified) {
		fs.writeFileSync(indexPath, lines.join("\n"), "utf-8");
	} else {
		console.log(`  ℹ️  Aucune modification dans ${indexPath}`);
	}
}

/**
 * Met à jour le fichier store/index.ts pour retirer la méthode
 */
function updateStoreIndex(storeDir, actionName) {
	const storeIndexPath = path.join(storeDir, "index.ts");

	if (!fs.existsSync(storeIndexPath)) {
		console.warn(`  ⚠️  Fichier store/index.ts introuvable: ${storeIndexPath}`);
		return;
	}

	let content = fs.readFileSync(storeIndexPath, "utf-8");
	let lines = content.split(/\r?\n/);
	let modified = false;

	// Trouver et retirer la méthode dans le bloc actions
	let inActions = false;
	let inMethod = false;
	let braceDepth = 0;
	let methodStartLine = -1;

	const result = [];

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		const trimmed = line.trim();

		// Détecter le début du bloc actions
		if (!inActions && trimmed.includes("actions:")) {
			inActions = true;
			result.push(line);
			continue;
		}

		if (inActions) {
			// Compter les accolades
			for (const char of line) {
				if (char === "{") braceDepth++;
				if (char === "}") braceDepth--;
			}

			// Détecter le début de la méthode à supprimer
			if (!inMethod && trimmed.startsWith(`${actionName}(`)) {
				inMethod = true;
				methodStartLine = i;
				modified = true;
				continue; // Ne pas ajouter cette ligne
			}

			// Si on est dans la méthode à supprimer
			if (inMethod) {
				// Chercher la fin de la méthode (accolade fermante suivie d'une virgule)
				if (trimmed === "}," || trimmed === "}") {
					inMethod = false;
					console.log(`  ✅ Méthode "${actionName}" retirée de ${storeIndexPath}`);
					continue; // Ne pas ajouter cette ligne
				}
				continue; // Ignorer toutes les lignes de la méthode
			}

			// Fin du bloc actions
			if (braceDepth === 0) {
				inActions = false;
			}
		}

		result.push(line);
	}

	if (modified) {
		fs.writeFileSync(storeIndexPath, result.join("\n"), "utf-8");
	} else {
		console.log(`  ℹ️  Aucune modification dans ${storeIndexPath}`);
	}
}

/**
 * Affiche l'aide
 */
function showHelp() {
	console.log(`
🗑️  Script de suppression d'action du store

Usage:
  node generators/module/remove-action.js <StoreName> <ActionName> --path <module-path>

Arguments:
  StoreName     Nom du store (PascalCase)
  ActionName    Nom de l'action à supprimer (camelCase)
  --path        Chemin du module contenant le store

Exemples:
  node generators/module/remove-action.js Product fetchByCategory --path src/modules/products
  node generators/module/remove-action.js User validateEmail --path src/modules/users
  node generators/module/remove-action.js PaymentProvider syncProviders --path src/modules/payment-providers

Le script va:
  1. Supprimer le fichier de l'action
  2. Retirer l'import et l'export de actions/index.ts
  3. Retirer la méthode de store/index.ts
`);
}

/**
 * Point d'entrée
 */
function main() {
	const args = process.argv.slice(2);

	// Aide
	if (args.includes("--help") || args.includes("-h") || args.length === 0) {
		showHelp();
		process.exit(0);
	}

	// Parser les arguments
	const storeName = args[0];
	const actionName = args[1];
	const pathIndex = args.indexOf("--path");

	if (!storeName || !actionName || pathIndex === -1 || !args[pathIndex + 1]) {
		console.error("❌ Arguments manquants");
		showHelp();
		process.exit(1);
	}

	const modulePath = args[pathIndex + 1];

	console.log(`\n🚀 Suppression de l'action "${actionName}" du store "${storeName}"`);
	console.log(`📁 Module: ${modulePath}\n`);

	try {
		removeActionFromStore(modulePath, storeName, actionName);
	} catch (error) {
		console.error(`\n❌ Erreur:`, error.message);
		process.exit(1);
	}
}

main();
