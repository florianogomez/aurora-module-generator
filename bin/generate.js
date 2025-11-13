#!/usr/bin/env node

/**
 * CLI principal pour les générateurs Aurora
 * Support multi-framework (Vue, React, Angular...)
 *
 * Usage:
 *   npx generate vue module resources/product.yaml
 *   npx generate vue module --interactive
 *   npx generate --help
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
const SUPPORTED_TYPES = ["module"];
const SPECIAL_COMMANDS = ["config", "show-config"];

function showHelp() {
	console.log(`
🚀 Aurora Code Generators

Usage:
  npx generate <framework> <type> [options] [file]
  npx generate config                    Affiche la configuration

Frameworks:
  vue         Vue 3 + Pinia + Vuetify (disponible)
  react       React + Redux (à venir)
  angular     Angular + NgRx (à venir)

Types:
  module      Génère un module complet (CRUD)

Commands:
  config      Affiche la configuration actuelle et les chemins résolus

Options:
  --interactive     Mode interactif
  --dry-run        Simulation sans écriture
  --overwrite      Écrase les fichiers existants
  --help           Affiche cette aide

Exemples:
  npx generate vue module resources/product.yaml
  npx generate vue module --interactive
  npx generate vue module --dry-run resources/product.yaml
  npx generate config

Documentation:
  README.md                     Documentation générale
  frameworks/vue/README.md      Documentation Vue spécifique
`);
}

async function main() {
	const args = process.argv.slice(2);

	// Aide
	if (args.includes("--help") || args.includes("-h") || args.length === 0) {
		showHelp();
		process.exit(0);
	}

	// Commande spéciale: afficher la configuration
	if (args[0] === "config" || args[0] === "show-config") {
		const { default: config } = await import("../frameworks/vue/config.js");
		const { loadAndMergeConfig } = await import("../frameworks/vue/config-loader.js");
		
		console.log("\n📦 Configuration Aurora Generator\n");
		console.log("📂 Répertoire de travail:", process.cwd());
		
		const finalConfig = await loadAndMergeConfig(config);
		
		if (finalConfig.userConfigPath) {
			console.log("✅ Configuration chargée depuis:", finalConfig.userConfigPath);
		} else {
			console.log("ℹ️  Aucune configuration trouvée, utilisation des valeurs par défaut");
		}
		console.log("📁 Répertoire de génération:", finalConfig.paths.modules);
		
		console.log("\n🔧 Chemins de génération:");
		console.log("  Modules:     ", finalConfig.paths.modules);
		console.log("  Templates:   ", finalConfig.paths.templates);
		console.log("  Resources:   ", finalConfig.paths.resources);
		
		if (finalConfig.userPaths) {
			console.log("\n📝 Chemins personnalisés (depuis config):");
			if (finalConfig.userPaths.interfacesIndex) {
				console.log("  Interfaces:  ", finalConfig.userPaths.interfacesIndex);
			}
			if (finalConfig.userPaths.storeKeysEnum) {
				console.log("  Store Keys:  ", finalConfig.userPaths.storeKeysEnum);
			}
			if (finalConfig.userPaths.piniaPlugin) {
				console.log("  Pinia Plugin:", finalConfig.userPaths.piniaPlugin);
			}
		}
		
		console.log("\n⚙️  Options:");
		console.log("  Overwrite:   ", finalConfig.options.overwrite);
		console.log("  Verbose:     ", finalConfig.options.verbose);
		console.log("  Dry Run:     ", finalConfig.options.dryRun);
		
		console.log("\n💡 Pour modifier la configuration, créez un fichier:");
		console.log("  - aurora.config.js");
		console.log("  - aurora.config.json");
		console.log("  - .aurorarc\n");
		
		process.exit(0);
	}

	// Parse arguments
	const framework = args[0];
	const type = args[1];
	const options = args.slice(2);

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

	if (!type) {
		console.error("❌ Erreur: Type de générateur requis");
		console.log("\nTypes disponibles: " + SUPPORTED_TYPES.join(", "));
		process.exit(1);
	}

	if (!SUPPORTED_TYPES.includes(type)) {
		console.error(`❌ Erreur: Type "${type}" non supporté`);
		console.log("\nTypes disponibles: " + SUPPORTED_TYPES.join(", "));
		process.exit(1);
	}

	// Vérifier si le framework est disponible
	const frameworkPath = join(__dirname, "..", "frameworks", framework);
	if (!existsSync(frameworkPath)) {
		console.error(`❌ Erreur: Framework "${framework}" pas encore implémenté`);
		console.log("\nFrameworks disponibles actuellement: vue");
		process.exit(1);
	}

	// Construire le chemin vers le générateur
	const generatorPath = join(frameworkPath, "generator.js");
	if (!existsSync(generatorPath)) {
		console.error(`❌ Erreur: Générateur non trouvé pour ${framework}/${type}`);
		process.exit(1);
	}

	// Exécuter le générateur
	console.log(`\n🎨 Framework: ${framework}`);
	console.log(`📦 Type: ${type}\n`);

	// Résoudre les chemins de fichiers en chemins absolus
	const resolvedOptions = options.map((opt) => {
		// Si l'option est un chemin de fichier (ne commence pas par --)
		if (!opt.startsWith("--") && opt.includes(".yaml")) {
			return join(process.cwd(), opt);
		}
		return opt;
	});

	const child = spawn("node", [generatorPath, ...resolvedOptions], {
		stdio: "inherit",
		cwd: process.cwd(),
	});

	child.on("exit", (code) => {
		process.exit(code || 0);
	});

	child.on("error", (err) => {
		console.error("❌ Erreur lors de l'exécution du générateur:", err);
		process.exit(1);
	});
}

main();
