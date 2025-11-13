/**
 * Générateur de store Pinia
 * Utilise le script existant generate-store-full.js
 */

import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";

export class StoreGenerator {
	constructor(moduleGenerator, config) {
		this.moduleGenerator = moduleGenerator;
		this.config = config;
	}

	/**
	 * Génère le store Pinia
	 * @param {string} modulePath - Chemin du module
	 * @param {object} spec - Spécification du module
	 */
	generate(modulePath, spec) {
		if (!this.moduleGenerator.options.useStoreScript) {
			console.log(
				`\n${this.config.messages.info} Génération du store ignorée (useStoreScript=false)`
			);
			return;
		}

		console.log(`\n${this.config.messages.build} Génération du store Pinia...`);

		const storeName = spec.store_name || spec.resource;
		const scriptPath = path.join(this.config.paths.root, "scripts", "generate-store-full.js");

		if (!fs.existsSync(scriptPath)) {
			console.warn(
				`${this.config.messages.warning} Script de génération du store non trouvé: ${scriptPath}`
			);
			return;
		}

		// Convertir le chemin absolu en relatif par rapport à la racine du projet
		const relativeModulePath = path.relative(this.config.paths.root, modulePath);

		if (this.moduleGenerator.options.dryRun) {
			console.log(
				`  [DRY-RUN] Exécuterait: node ${scriptPath} ${storeName} --path ${relativeModulePath}`
			);
			return;
		}

		const result = spawnSync("node", [scriptPath, storeName, "--path", relativeModulePath], {
			stdio: ["inherit", "pipe", "pipe"],
			cwd: this.config.paths.root,
			encoding: "utf-8",
		});

		if (result.status === 0) {
			// Afficher la sortie du script
			if (result.stdout) {
				result.stdout.split("\n").forEach((line) => {
					if (line.trim()) console.log(`  ${line}`);
				});
			}
			console.log(`  ${this.config.messages.success} Store généré avec succès`);
		} else {
			const errorMsg = `Erreur lors de la génération du store (code: ${result.status})`;
			if (result.stderr) {
				console.error(`  ${result.stderr}`);
			}
			this.moduleGenerator.stats.errors.push(errorMsg);
			console.error(`  ${this.config.messages.error} ${errorMsg}`);
		}
	}
}
