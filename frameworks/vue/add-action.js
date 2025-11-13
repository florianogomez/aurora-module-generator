#!/usr/bin/env node

/**
 * Script pour ajouter une action à un store existant
 * Utilise les templates Handlebars pour générer l'action
 *
 * Usage:
 *   node generators/module/add-action.js <StoreName> <ActionName> --path <module-path>
 *   node generators/module/add-action.js Product fetchByCategory --path src/modules/products
 *
 * @author Adébayo Floriano Davidio Sergio Gomez
 * @version 2.0.0
 */

import fs from "fs";
import path from "path";
import Handlebars from "handlebars";
import { fileURLToPath } from "url";
import { registerHelpers, pascalCase, camelCase, kebabCase } from "./helpers.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Enregistrer les helpers Handlebars
registerHelpers(Handlebars);

/**
 * Charge et compile le template d'action personnalisée
 */
function loadActionTemplate() {
	const templatePath = path.join(__dirname, "templates", "action-custom.hbs");

	if (!fs.existsSync(templatePath)) {
		throw new Error(`Template non trouvé: ${templatePath}`);
	}

	const templateContent = fs.readFileSync(templatePath, "utf-8");
	return Handlebars.compile(templateContent, { noEscape: false });
}

/**
 * Ajoute une action au store
 */
function addActionToStore(modulePath, storeName, actionName) {
	const storeDir = path.join(process.cwd(), modulePath, "store");
	const actionsDir = path.join(storeDir, "actions");

	const pascalName = pascalCase(storeName);
	const camelName = camelCase(pascalName);

	// Vérifier si le dossier actions existe
	if (!fs.existsSync(actionsDir)) {
		console.error(`❌ Dossier actions introuvable: ${actionsDir}`);
		process.exit(1);
	}

	// Vérifier si l'action existe déjà
	const actionFile = path.join(actionsDir, `${actionName}.ts`);
	if (fs.existsSync(actionFile)) {
		console.log(`⚠️  L'action "${actionName}" existe déjà dans ${actionFile}`);
		const readline = require("readline").createInterface({
			input: process.stdin,
			output: process.stdout,
		});

		readline.question("Écraser? (o/N): ", (answer) => {
			readline.close();
			if (answer.toLowerCase() !== "o") {
				console.log("❌ Opération annulée");
				process.exit(0);
			}
			createAction();
		});
		return;
	}

	createAction();

	function createAction() {
		// Générer le fichier d'action depuis le template
		console.log(`\n🔨 Génération de l'action "${actionName}"...`);

		const template = loadActionTemplate();
		const content = template({
			resource: storeName,
			actionName: actionName,
		});

		fs.writeFileSync(actionFile, content, "utf-8");
		console.log(`  ✅ Fichier créé: ${actionFile}`);

		// Mettre à jour actions/index.ts
		updateActionsIndex(actionsDir, actionName, camelName);

		// Mettre à jour store/index.ts
		updateStoreIndex(storeDir, actionName, camelName, pascalName);

		console.log(`\n✅ Action "${actionName}" ajoutée avec succès au store "${storeName}"`);
		console.log(`\n📝 N'oubliez pas d'implémenter la logique dans ${actionFile}`);
	}
}

/**
 * Met à jour le fichier actions/index.ts
 */
function updateActionsIndex(actionsDir, actionName, camelStoreName) {
	const indexPath = path.join(actionsDir, "index.ts");

	if (!fs.existsSync(indexPath)) {
		console.warn(`⚠️  Fichier index.ts introuvable: ${indexPath}`);
		return;
	}

	let content = fs.readFileSync(indexPath, "utf-8");
	const lines = content.split(/\r?\n/);

	// Ajouter l'import si pas déjà présent
	const importLine = `import { ${actionName} } from "./${actionName}";`;
	if (!content.includes(importLine)) {
		// Trouver la dernière ligne d'import
		let lastImportIndex = -1;
		for (let i = 0; i < lines.length; i++) {
			if (lines[i].match(/^import .* from "\.\/.*";/)) {
				lastImportIndex = i;
			}
		}

		if (lastImportIndex !== -1) {
			lines.splice(lastImportIndex + 1, 0, importLine);
			console.log(`  ✅ Import ajouté à ${indexPath}`);
		}
	}

	// Ajouter l'export dans l'objet
	const exportRegex = /export const \w+StoreActions\s*=\s*\{/;
	const exportIndex = lines.findIndex((line) => exportRegex.test(line));

	if (exportIndex !== -1) {
		// Trouver la ligne après l'ouverture de l'objet
		const insertIndex = exportIndex + 1;

		// Vérifier si l'action n'est pas déjà exportée
		const actionExported = lines.some(
			(line) => line.trim().startsWith(`${actionName},`) || line.trim() === `${actionName}`
		);

		if (!actionExported) {
			// Détecter l'indentation
			const indentMatch = lines[insertIndex]?.match(/^(\s+)/);
			const indent = indentMatch ? indentMatch[1] : "  ";

			lines.splice(insertIndex, 0, `${indent}${actionName},`);
			console.log(`  ✅ Export ajouté à ${indexPath}`);
		}
	}

	fs.writeFileSync(indexPath, lines.join("\n"), "utf-8");
}

/**
 * Met à jour le fichier store/index.ts
 */
function updateStoreIndex(storeDir, actionName, camelStoreName, pascalStoreName) {
	const storeIndexPath = path.join(storeDir, "index.ts");

	if (!fs.existsSync(storeIndexPath)) {
		console.warn(`⚠️  Fichier store/index.ts introuvable: ${storeIndexPath}`);
		return;
	}

	let content = fs.readFileSync(storeIndexPath, "utf-8");

	// Vérifier si l'action est déjà dans le store
	if (content.includes(`${actionName}(`)) {
		console.log(`  ℹ️  L'action est déjà dans store/index.ts`);
		return;
	}

	// Trouver le bloc actions
	const actionsMatch = content.match(/actions:\s*\{/);
	if (!actionsMatch) {
		console.warn(`⚠️  Bloc "actions" introuvable dans ${storeIndexPath}`);
		return;
	}

	const actionsStart = actionsMatch.index + actionsMatch[0].length;

	// Trouver la fin du bloc actions
	let depth = 1;
	let pos = actionsStart;
	while (depth > 0 && pos < content.length) {
		if (content[pos] === "{") depth++;
		if (content[pos] === "}") depth--;
		pos++;
	}

	const actionsEnd = pos - 1;
	const actionsContent = content.substring(actionsStart, actionsEnd);

	// Détecter l'indentation
	const indentMatch = actionsContent.match(/\n(\s+)\w+\(/);
	const indent = indentMatch ? indentMatch[1] : "    ";

	// Créer la nouvelle méthode
	const newMethod = `\n${indent}${actionName}(payload: object) {
${indent}  return ${camelStoreName}StoreActions.${actionName}(this, payload);
${indent}},`;

	// Insérer la méthode avant la fermeture du bloc actions
	const before = content.substring(0, actionsEnd);
	const after = content.substring(actionsEnd);

	fs.writeFileSync(storeIndexPath, before + newMethod + after, "utf-8");
	console.log(`  ✅ Méthode ajoutée à ${storeIndexPath}`);
}

/**
 * Affiche l'aide
 */
function showHelp() {
	console.log(`
🔨 Script d'ajout d'action au store (avec templates Handlebars)

Usage:
  node generators/module/add-action.js <StoreName> <ActionName> --path <module-path>

Arguments:
  StoreName     Nom du store (PascalCase)
  ActionName    Nom de l'action à créer (camelCase)
  --path        Chemin du module contenant le store

Exemples:
  node generators/module/add-action.js Product fetchByCategory --path src/modules/products
  node generators/module/add-action.js User validateEmail --path src/modules/users
  node generators/module/add-action.js PaymentProvider syncProviders --path src/modules/payment-providers

Le script va:
  1. Créer le fichier de l'action depuis le template
  2. Ajouter l'import et l'export dans actions/index.ts
  3. Ajouter la méthode dans store/index.ts
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

	console.log(`\n🚀 Ajout de l'action "${actionName}" au store "${storeName}"`);
	console.log(`📁 Module: ${modulePath}\n`);

	try {
		addActionToStore(modulePath, storeName, actionName);
	} catch (error) {
		console.error(`\n❌ Erreur:`, error.message);
		process.exit(1);
	}
}

main();
