#!/usr/bin/env node

/**
 * CLI de suppression de modules multi-framework
 *
 * Usage:
 *   npx delete-module vue Product
 *   npx delete-module vue --interactive
 *
 * @author Adébayo Floriano Davidio Sergio Gomez
 * @version 2.1.0
 */

import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { existsSync } from "fs";
import { spawn } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SUPPORTED_FRAMEWORKS = ["vue", "react", "angular"];

function showHelp() {
	console.log(`
🗑️  Aurora Module Deletion

Usage:
  npx delete-module <framework> <resource>
  npx delete-module <framework> --interactive

Frameworks:
  vue         Vue 3 + Pinia + Vuetify
  react       React + Redux (à venir)
  angular     Angular + NgRx (à venir)

Exemples:
  npx delete-module vue Product
  npx delete-module vue --interactive
`);
}

async function main() {
	const args = process.argv.slice(2);

	// Aide
	if (args.includes("--help") || args.includes("-h") || args.length === 0) {
		showHelp();
		process.exit(0);
	}

	// Parse arguments
	const framework = args[0];
	const options = args.slice(1);

	// Validation
	if (!framework) {
		console.error("❌ Erreur: Framework requis");
		console.log("\nFrameworks disponibles: " + SUPPORTED_FRAMEWORKS.join(", "));
		process.exit(1);
	}

	if (!SUPPORTED_FRAMEWORKS.includes(framework)) {
		console.error(`❌ Erreur: Framework "${framework}" non supporté`);
		console.log("\nFrameworks disponibles: " + SUPPORTED_FRAMEWORKS.join(", "));
		process.exit(1);
	}

	// Vérifier si le framework est disponible
	const frameworkPath = join(__dirname, "..", "frameworks", framework);
	if (!existsSync(frameworkPath)) {
		console.error(`❌ Erreur: Framework "${framework}" pas encore implémenté`);
		console.log("\nFrameworks disponibles actuellement: vue");
		process.exit(1);
	}

	// Construire le chemin vers le script de suppression
	const deletePath = join(frameworkPath, "delete-module.js");
	if (!existsSync(deletePath)) {
		console.error(`❌ Erreur: Script de suppression non trouvé pour ${framework}`);
		process.exit(1);
	}

	// Exécuter le script de suppression
	console.log(`\n🎨 Framework: ${framework}\n`);

	const child = spawn("node", [deletePath, ...options], {
		stdio: "inherit",
		cwd: frameworkPath,
	});

	child.on("exit", (code) => {
		process.exit(code || 0);
	});

	child.on("error", (err) => {
		console.error("❌ Erreur lors de l'exécution:", err);
		process.exit(1);
	});
}

main();
