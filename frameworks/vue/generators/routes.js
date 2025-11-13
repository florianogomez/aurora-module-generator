/**
 * Générateur de routes API
 * Crée toutes les routes CRUD pour communiquer avec le backend
 */

import path from "path";
import { createEnrichedContext } from "../helpers.js";

export class RoutesGenerator {
	constructor(moduleGenerator, config) {
		this.moduleGenerator = moduleGenerator;
		this.config = config;
	}

	/**
	 * Génère les routes API du module
	 * @param {string} modulePath - Chemin du module
	 * @param {object} spec - Spécification du module
	 */
	generate(modulePath, spec) {
		console.log(`\n${this.config.messages.build} Génération des routes API...`);

		const apisPath = path.join(modulePath, this.config.moduleStructure.apis);
		const resource = spec.resource;

		// Créer le contexte enrichi
		const context = createEnrichedContext(resource);

		// Route de base
		this.moduleGenerator.createFileFromTemplate(
			this.config.templates.routeBase,
			path.join(apisPath, `_${context.resourceSnakeCase}_route.ts`),
			context
		);

		// Routes CRUD
		const routes = [
			{ template: this.config.templates.routeCreate, suffix: "create" },
			{ template: this.config.templates.routeList, suffix: "list" },
			{ template: this.config.templates.routeFind, suffix: "find" },
			{ template: this.config.templates.routeUpdate, suffix: "update" },
			{ template: this.config.templates.routeDelete, suffix: "delete" },
		];

		routes.forEach(({ template, suffix }) => {
			this.moduleGenerator.createFileFromTemplate(
				template,
				path.join(apisPath, `${context.resourceSnakeCase}_${suffix}_route.ts`),
				context
			);
		});
	}
}
