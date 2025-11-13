/**
 * Générateur d'actions du store
 * Crée toutes les actions Pinia pour gérer l'état
 */

import path from "path";
import { pascalCase, pluralize, createEnrichedContext } from "../helpers.js";

export class ActionsGenerator {
	constructor(moduleGenerator, config) {
		this.moduleGenerator = moduleGenerator;
		this.config = config;
	}

	/**
	 * Génère les actions du store
	 * @param {string} modulePath - Chemin du module
	 * @param {object} spec - Spécification du module
	 */
	generate(modulePath, spec) {
		console.log(`\n${this.config.messages.build} Génération des actions du store...`);

		const actionsPath = path.join(modulePath, this.config.moduleStructure.actions);
		const resource = spec.resource;
		const pascalResource = pascalCase(resource);
		const pluralResource = pluralize(pascalResource);

		// Utiliser le contexte enrichi
		const context = createEnrichedContext(resource);

		// Actions de base
		const basicActions = [
			{ template: this.config.templates.actionAdd, file: "add.ts" },
			{ template: this.config.templates.actionFind, file: "find.ts" },
			{ template: this.config.templates.actionUpdate, file: "update.ts" },
			{ template: this.config.templates.actionRemove, file: "remove.ts" },
		];

		basicActions.forEach(({ template, file }) => {
			this.moduleGenerator.createFileFromTemplate(template, path.join(actionsPath, file), context);
		});

		// Actions API
		const apiActions = [
			{ template: this.config.templates.actionGetAll, file: `get${pluralResource}.ts` },
			{ template: this.config.templates.actionFindOne, file: `find${pascalResource}.ts` },
			{ template: this.config.templates.actionCreate, file: `create${pascalResource}.ts` },
			{ template: this.config.templates.actionUpdateOne, file: `update${pascalResource}.ts` },
			{ template: this.config.templates.actionDelete, file: `delete${pascalResource}.ts` },
			{ template: this.config.templates.actionSet, file: `set${pluralResource}.ts` },
		];

		apiActions.forEach(({ template, file }) => {
			this.moduleGenerator.createFileFromTemplate(template, path.join(actionsPath, file), context);
		});

		// Index des actions
		this.moduleGenerator.createFileFromTemplate(
			this.config.templates.actionIndex,
			path.join(actionsPath, "index.ts"),
			context
		);
	}
}
