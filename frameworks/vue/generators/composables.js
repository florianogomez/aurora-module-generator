/**
 * Générateur de composables Vue 3
 * Crée les composables pour les actions CRUD et la gestion des filtres
 */

import path from "path";
import { createEnrichedContext } from "../helpers.js";

export class ComposablesGenerator {
	constructor(moduleGenerator, config) {
		this.moduleGenerator = moduleGenerator;
		this.config = config;
	}

	/**
	 * Génère les composables du module
	 * @param {string} modulePath - Chemin du module
	 * @param {object} spec - Spécification du module
	 */
	generate(modulePath, spec) {
		console.log(`\n${this.config.messages.build} Génération des composables...`);

		const composablesPath = path.join(modulePath, this.config.moduleStructure.composables);
		const resource = spec.resource;

		const context = createEnrichedContext(resource, {
			filterAttributes: spec.filterAttributes || [],
		});

		// Composable use_resource_actions
		this.moduleGenerator.createFileFromTemplate(
			this.config.templates.composableUseActions,
			path.join(composablesPath, `use_${context.resourceSnakeCase}_actions.ts`),
			context
		);

		// Composable use_resource_filters
		this.moduleGenerator.createFileFromTemplate(
			this.config.templates.composableUseFilters,
			path.join(composablesPath, `use_${context.resourceSnakeCase}_filters.ts`),
			context
		);
	}
}
