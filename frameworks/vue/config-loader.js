/**
 * Configuration Loader
 * Charge la configuration utilisateur depuis le projet cible
 */

import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";

const CONFIG_FILES = [
	"aurora.config.js",
	"aurora.config.mjs",
	"aurora.config.json",
	".aurorarc",
	".aurorarc.json",
];

/**
 * Charge la configuration utilisateur depuis le répertoire de travail
 * @param {string} cwd - Current working directory
 * @returns {Promise<object|null>} Configuration utilisateur ou null
 */
export async function loadUserConfig(cwd = process.cwd()) {
	for (const configFile of CONFIG_FILES) {
		const configPath = path.join(cwd, configFile);

		if (fs.existsSync(configPath)) {
			try {
				// Fichiers JSON
				if (configFile.endsWith(".json")) {
					const content = fs.readFileSync(configPath, "utf-8");
					const config = JSON.parse(content);
					return { config, configFile };
				}

				// Fichiers JavaScript/ESM
				if (configFile.endsWith(".js") || configFile.endsWith(".mjs")) {
					const fileUrl = pathToFileURL(configPath).href;
					// Ajouter un paramètre de cache-busting pour éviter les problèmes de cache ESM
					const moduleUrl = `${fileUrl}?t=${Date.now()}`;
					const module = await import(moduleUrl);
					const config = module.default || module;
					return { config, configFile };
				}
			} catch (error) {
				console.warn(`⚠️  Erreur lors du chargement de ${configFile}:`, error.message);
			}
		}
	}

	return null;
}

/**
 * Résout les chemins de la configuration
 * @param {object} userConfig - Configuration utilisateur
 * @param {string} cwd - Current working directory
 * @returns {object} Configuration avec chemins résolus
 */
export function resolveConfigPaths(userConfig, cwd = process.cwd()) {
	const resolved = { ...userConfig };

	// Résoudre modulesPath
	if (resolved.modulesPath) {
		resolved.modulesPath = path.resolve(cwd, resolved.modulesPath);
	} else {
		const outputDir = resolved.outputDir || "./src";
		const modulesDir = resolved.modulesDir || "modules";
		resolved.modulesPath = path.resolve(cwd, outputDir, modulesDir);
	}

	// Résoudre les autres chemins
	if (resolved.paths) {
		const paths = resolved.paths;

		if (paths.interfacesIndex) {
			paths.interfacesIndex = path.resolve(cwd, paths.interfacesIndex);
		}
		if (paths.storeKeysEnum) {
			paths.storeKeysEnum = path.resolve(cwd, paths.storeKeysEnum);
		}
		if (paths.piniaPlugin) {
			paths.piniaPlugin = path.resolve(cwd, paths.piniaPlugin);
		}
	}

	return resolved;
}

/**
 * Merge la configuration utilisateur avec la configuration par défaut
 * @param {object} defaultConfig - Configuration par défaut
 * @param {object} userConfig - Configuration utilisateur
 * @returns {object} Configuration fusionnée
 */
export function mergeConfig(defaultConfig, userConfig) {
	if (!userConfig) {
		return defaultConfig;
	}

	return {
		...defaultConfig,
		paths: {
			...defaultConfig.paths,
			// Utiliser modulesPath de la config utilisateur si défini
			modules: userConfig.modulesPath || defaultConfig.paths.modules,
		},
		options: {
			...defaultConfig.options,
			...(userConfig.options || {}),
		},
		// Garder les chemins utilisateur pour référence
		userPaths: userConfig.paths || {},
	};
}

/**
 * Fonction principale pour charger et fusionner la configuration
 * @param {object} defaultConfig - Configuration par défaut
 * @param {string} cwd - Current working directory
 * @returns {Promise<object>} Configuration finale
 */
export async function loadAndMergeConfig(defaultConfig, cwd = process.cwd()) {
	const result = await loadUserConfig(cwd);

	if (!result) {
		return { ...defaultConfig, userConfigPath: null };
	}

	const { config: userConfig, configFile } = result;
	const resolvedUserConfig = resolveConfigPaths(userConfig, cwd);
	const mergedConfig = mergeConfig(defaultConfig, resolvedUserConfig);

	return { ...mergedConfig, userConfigPath: configFile };
}

export default {
	loadUserConfig,
	resolveConfigPaths,
	mergeConfig,
	loadAndMergeConfig,
};
