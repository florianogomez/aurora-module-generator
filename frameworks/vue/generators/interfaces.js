/**
 * Générateur d'interfaces TypeScript
 * Crée toutes les interfaces d'un module (principale, create, update, store, list filter)
 */

import path from "path";
import { createEnrichedContext } from "../helpers.js";

export class InterfacesGenerator {
	constructor(moduleGenerator, config) {
		this.moduleGenerator = moduleGenerator;
		this.config = config;
	}

	/**
	 * Génère toutes les interfaces du module
	 * @param {string} modulePath - Chemin du module
	 * @param {object} spec - Spécification du module
	 */
	generate(modulePath, spec) {
		console.log(`\n${this.config.messages.build} Génération des interfaces...`);

		const interfacesPath = path.join(modulePath, this.config.moduleStructure.interfaces);
		const resource = spec.resource;

		const context = createEnrichedContext(resource, {
			extends: spec.extends || this.config.defaults.extends,
			description: spec.description || "",
			fields: spec.fields || [],
			filterAttributes: spec.filterAttributes || [],
		});

		// Interface principale
		this.moduleGenerator.createFileFromTemplate(
			this.config.templates.interface,
			path.join(interfacesPath, `${context.resourceSnakeCase}_interface.ts`),
			context
		);

		// Interface Create
		this.moduleGenerator.createFileFromTemplate(
			this.config.templates.interfaceCreate,
			path.join(interfacesPath, `${context.resourceSnakeCase}_create_interface.ts`),
			context
		);

		// Interface Update
		this.moduleGenerator.createFileFromTemplate(
			this.config.templates.interfaceUpdate,
			path.join(interfacesPath, `${context.resourceSnakeCase}_update_interface.ts`),
			context
		);

		// Interface Store
		this.moduleGenerator.createFileFromTemplate(
			this.config.templates.interfaceStore,
			path.join(interfacesPath, `${context.resourceSnakeCase}_store_interface.ts`),
			context
		);

		// Interface List Filter
		this.moduleGenerator.createFileFromTemplate(
			this.config.templates.interfaceListFilter,
			path.join(interfacesPath, `${context.resourceSnakeCase}_list_filter_interface.ts`),
			context
		);

		// Index des interfaces
		this.moduleGenerator.createFileFromTemplate(
			this.config.templates.interfaceIndex,
			path.join(interfacesPath, "index.ts"),
			context
		);
	}
}
