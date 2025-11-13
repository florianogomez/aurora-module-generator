/**
 * Générateur de vues Vue 3
 * Crée les vues standards d'un module (ListView, AddView, EditView)
 */

import path from "path";
import { kebabCase, pascalCase, createEnrichedContext } from "../helpers.js";

export class ViewsGenerator {
	constructor(moduleGenerator, config) {
		this.moduleGenerator = moduleGenerator;
		this.config = config;
	}

	/**
	 * Génère les vues du module
	 * @param {string} modulePath - Chemin du module
	 * @param {object} spec - Spécification du module
	 */
	generate(modulePath, spec) {
		console.log(`\n${this.config.messages.build} Génération des vues...`);

		const viewsPath = path.join(modulePath, this.config.moduleStructure.views);
		const componentsPath = path.join(modulePath, "components");
		const resource = spec.resource;
		const pascalResource = pascalCase(resource);

		// Préparer les propriétés du selector avec des valeurs par défaut
		const selectorWithDefaults = {
			displayField: spec.selector?.displayField || "name",
			secondaryField: spec.selector?.secondaryField || null,
			icon: spec.selector?.icon || "ri-list-check",
			color: spec.selector?.color || "primary",
			...spec.selector,
		};

		const context = createEnrichedContext(resource, {
			fields: spec.fields || [],
			filterAttributes: spec.filterAttributes || [],
			selector: selectorWithDefaults,
		});

		// 1. Vues
		this.moduleGenerator.createFileFromTemplate(
			this.config.templates.viewList,
			path.join(viewsPath, `${pascalResource}ListView.vue`),
			context
		);

		this.moduleGenerator.createFileFromTemplate(
			this.config.templates.viewAdd,
			path.join(viewsPath, `${pascalResource}AddView.vue`),
			context
		);

		this.moduleGenerator.createFileFromTemplate(
			this.config.templates.viewEdit,
			path.join(viewsPath, `${pascalResource}EditView.vue`),
			context
		);

		// 2. Composants
		this.moduleGenerator.createFileFromTemplate(
			this.config.templates.componentForm,
			path.join(componentsPath, `${pascalResource}Form.vue`),
			context
		);

		this.moduleGenerator.createFileFromTemplate(
			this.config.templates.componentFormDialog,
			path.join(componentsPath, `${pascalResource}FormDialog.vue`),
			context
		);

		this.moduleGenerator.createFileFromTemplate(
			this.config.templates.componentDetailDialog,
			path.join(componentsPath, `${pascalResource}DetailDialog.vue`),
			context
		);

		this.moduleGenerator.createFileFromTemplate(
			this.config.templates.componentFiltersForm,
			path.join(componentsPath, `${pascalResource}FiltersForm.vue`),
			context
		);

		this.moduleGenerator.createFileFromTemplate(
			this.config.templates.componentSelector,
			path.join(componentsPath, `${pascalResource}Selector.vue`),
			context
		);

		// 3. Navigation
		this.moduleGenerator.createFileFromTemplate(
			this.config.templates.routeNavigation,
			path.join(modulePath, "routes.ts"),
			context
		);
	}
}
