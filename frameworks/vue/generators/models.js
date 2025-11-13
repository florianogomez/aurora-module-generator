/**
 * Générateur de modèles
 * Crée le modèle métier d'une ressource
 */

import path from "path";
import { snakeCase, createEnrichedContext } from "../helpers.js";

export class ModelsGenerator {
	constructor(moduleGenerator, config) {
		this.moduleGenerator = moduleGenerator;
		this.config = config;
	}

	/**
	 * Génère le modèle du module
	 * @param {string} modulePath - Chemin du module
	 * @param {object} spec - Spécification du module
	 */
	generate(modulePath, spec) {
		console.log(`\n${this.config.messages.build} Génération du modèle...`);

		const modelsPath = path.join(modulePath, this.config.moduleStructure.models);
		const resource = spec.resource;

		const context = createEnrichedContext(resource, {
			fields: spec.fields || [],
		});

		this.moduleGenerator.createFileFromTemplate(
			this.config.templates.model,
			path.join(modelsPath, `${context.resourceSnakeCase}_model.ts`),
			context
		);
	}
}
