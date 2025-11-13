/**
 * Générateur de store Pinia
 * Crée la structure complète du store avec definition, getters, et index
 */

import path from "path";
import { createEnrichedContext } from "../helpers.js";

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
		console.log(`\n${this.config.messages.build} Génération du store Pinia...`);

		const storePath = path.join(modulePath, this.config.moduleStructure.store);
		const resource = spec.resource;

		const context = createEnrichedContext(resource, {
			extends: spec.extends || this.config.defaults.extends,
			description: spec.description || "",
			fields: spec.fields || [],
		});

		// Générer store/definition.ts
		this.moduleGenerator.createFileFromTemplate(
			this.config.templates.storeDefinition,
			path.join(storePath, "definition.ts"),
			context
		);

		// Générer store/getters/index.ts
		const gettersPath = path.join(storePath, "getters");
		this.moduleGenerator.createFileFromTemplate(
			this.config.templates.storeGetters,
			path.join(gettersPath, "index.ts"),
			context
		);

		// Générer store/index.ts
		this.moduleGenerator.createFileFromTemplate(
			this.config.templates.storeIndex,
			path.join(storePath, "index.ts"),
			context
		);
	}
}
