/**
 * Helpers Handlebars pour la génération de modules
 * Ces fonctions sont disponibles dans tous les templates .hbs
 */

/**
 * Convertit une chaîne en PascalCase
 * @param {string} str - Chaîne à convertir
 * @returns {string} Chaîne en PascalCase
 * @example
 * pascalCase("user-profile") // => "UserProfile"
 * pascalCase("user_profile") // => "UserProfile"
 */
export function pascalCase(str) {
	if (!str) return "";
	return str
		.replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ""))
		.replace(/^[a-z]/, (c) => c.toUpperCase());
}

/**
 * Convertit une chaîne en camelCase
 * @param {string} str - Chaîne à convertir
 * @returns {string} Chaîne en camelCase
 * @example
 * camelCase("UserProfile") // => "userProfile"
 * camelCase("user-profile") // => "userProfile"
 */
export function camelCase(str) {
	if (!str) return "";
	const pascal = pascalCase(str);
	return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

/**
 * Convertit une chaîne en kebab-case
 * @param {string} str - Chaîne à convertir
 * @returns {string} Chaîne en kebab-case
 * @example
 * kebabCase("UserProfile") // => "user-profile"
 * kebabCase("userProfile") // => "user-profile"
 */
export function kebabCase(str) {
	if (!str) return "";
	return str
		.replace(/([a-z])([A-Z])/g, "$1-$2")
		.replace(/[\s_]+/g, "-")
		.toLowerCase();
}

/**
 * Convertit une chaîne en snake_case
 * @param {string} str - Chaîne à convertir
 * @returns {string} Chaîne en snake_case
 * @example
 * snakeCase("UserProfile") // => "user_profile"
 * snakeCase("userProfile") // => "user_profile"
 */
export function snakeCase(str) {
	if (!str) return "";
	return str
		.replace(/([a-z])([A-Z])/g, "$1_$2")
		.replace(/[\s-]+/g, "_")
		.toLowerCase();
}

/**
 * Convertit une chaîne en UPPER_CASE
 * @param {string} str - Chaîne à convertir
 * @returns {string} Chaîne en UPPER_CASE
 * @example
 * upperCase("UserProfile") // => "USER_PROFILE"
 */
export function upperCase(str) {
	if (!str) return "";
	return snakeCase(str).toUpperCase();
}

/**
 * Convertit une chaîne en minuscules
 * @param {string} str - Chaîne à convertir
 * @returns {string} Chaîne en minuscules
 * @example
 * lowerCase("UserProfile") // => "userprofile"
 */
export function lowerCase(str) {
	if (!str) return "";
	return str.toLowerCase();
}

/**
 * Pluralise une chaîne (règles simples en anglais)
 * @param {string} str - Chaîne à pluraliser
 * @returns {string} Chaîne pluralisée
 * @example
 * pluralize("User") // => "Users"
 * pluralize("Category") // => "Categories"
 * pluralize("status") // => "statuses"
 */
export function pluralize(str) {
	if (!str) return "";

	// Règles de pluralisation simples
	if (str.endsWith("y") && !["a", "e", "i", "o", "u"].includes(str[str.length - 2])) {
		return str.slice(0, -1) + "ies";
	}
	if (
		str.endsWith("s") ||
		str.endsWith("x") ||
		str.endsWith("z") ||
		str.endsWith("ch") ||
		str.endsWith("sh")
	) {
		return str + "es";
	}
	return str + "s";
}

/**
 * Singularise une chaîne (règles simples en anglais)
 * @param {string} str - Chaîne à singulariser
 * @returns {string} Chaîne singularisée
 * @example
 * singularize("Users") // => "User"
 * singularize("Categories") // => "Category"
 */
export function singularize(str) {
	if (!str) return "";

	if (str.endsWith("ies")) {
		return str.slice(0, -3) + "y";
	}
	if (str.endsWith("es")) {
		return str.slice(0, -2);
	}
	if (str.endsWith("s")) {
		return str.slice(0, -1);
	}
	return str;
}

/**
 * Sérialise une valeur en JSON
 * @param {any} value - Valeur à sérialiser
 * @returns {string} Chaîne JSON
 * @example
 * jsonStringify({ foo: "bar" }) // => '{"foo":"bar"}'
 * jsonStringify("hello") // => '"hello"'
 */
export function jsonStringify(value) {
	return JSON.stringify(value);
}

/**
 * Compare deux valeurs (helper conditionnel Handlebars)
 * @param {any} a - Première valeur
 * @param {string} operator - Opérateur (==, !=, <, >, <=, >=)
 * @param {any} b - Deuxième valeur
 * @returns {boolean} Résultat de la comparaison
 * @example
 * {{#if (compare age ">" 18)}}Adulte{{/if}}
 */
export function compare(a, operator, b) {
	switch (operator) {
		case "==":
			return a == b;
		case "===":
			return a === b;
		case "!=":
			return a != b;
		case "!==":
			return a !== b;
		case "<":
			return a < b;
		case ">":
			return a > b;
		case "<=":
			return a <= b;
		case ">=":
			return a >= b;
		case "&&":
			return a && b;
		case "||":
			return a || b;
		default:
			return false;
	}
}

/**
 * Indente un texte
 * @param {string} text - Texte à indenter
 * @param {number} spaces - Nombre d'espaces
 * @returns {string} Texte indenté
 */
export function indent(text, spaces = 2) {
	if (!text) return "";
	const indentation = " ".repeat(spaces);
	return text
		.split("\n")
		.map((line) => indentation + line)
		.join("\n");
}

/**
 * Formate une date
 * @param {Date|string} date - Date à formater
 * @param {string} format - Format de sortie
 * @returns {string} Date formatée
 */
export function formatDate(date, format = "YYYY-MM-DD") {
	const d = new Date(date);
	if (isNaN(d.getTime())) return "";

	const year = d.getFullYear();
	const month = String(d.getMonth() + 1).padStart(2, "0");
	const day = String(d.getDate()).padStart(2, "0");

	return format.replace("YYYY", year).replace("MM", month).replace("DD", day);
}

/**
 * Détermine si un mot est féminin (règles simples en français)
 * @param {string} word - Mot à vérifier
 * @returns {boolean} True si féminin
 */
export function isFeminine(word) {
	if (!word) return false;
	const feminineEndings = ["e", "ion", "tion", "ée", "té", "ure"];
	const lowerWord = word.toLowerCase();
	return feminineEndings.some((ending) => lowerWord.endsWith(ending));
}

/**
 * Retourne l'article indéfini approprié (un/une)
 * @param {string} word - Mot
 * @returns {string} Article indéfini
 */
export function article(word) {
	return isFeminine(word) ? "une" : "un";
}

/**
 * Alias pour article (compatibilité)
 */
export function indefiniteArticle(word) {
	return article(word);
}

/**
 * Retourne l'article défini approprié (le/la)
 * @param {string} word - Mot
 * @returns {string} Article défini
 */
export function definiteArticle(word) {
	return isFeminine(word) ? "la" : "le";
}

/**
 * Retourne le suffixe féminin approprié (e/vide)
 * @param {string} word - Mot
 * @returns {string} Suffixe féminin
 */
export function feminineSuffix(word) {
	return isFeminine(word) ? "e" : "";
}

/**
 * Vérifie si un type est un tableau
 * @param {string} type - Type à vérifier
 * @returns {boolean} True si array
 */
export function isArrayType(type) {
	return type && type.endsWith("[]");
}

/**
 * Helper d'égalité pour Handlebars
 * @param {any} a - Première valeur
 * @param {any} b - Deuxième valeur
 * @returns {boolean} True si égales
 */
export function eq(a, b) {
	return a === b;
}

/**
 * Helper de comparaison supérieur à
 * @param {any} a - Première valeur
 * @param {any} b - Deuxième valeur
 * @returns {boolean} True si a > b
 */
export function gt(a, b) {
	return a > b;
}

/**
 * Helper de comparaison inférieur à
 * @param {any} a - Première valeur
 * @param {any} b - Deuxième valeur
 * @returns {boolean} True si a < b
 */
export function lt(a, b) {
	return a < b;
}

/**
 * Helper de négation logique
 * @param {any} value - Valeur à négativer
 * @returns {boolean} Négation de la valeur
 */
export function not(value) {
	return !value;
}

/**
 * Enregistre tous les helpers dans Handlebars
 * @param {object} Handlebars - Instance Handlebars
 */
export function registerHelpers(Handlebars) {
	Handlebars.registerHelper("pascalCase", pascalCase);
	Handlebars.registerHelper("camelCase", camelCase);
	Handlebars.registerHelper("kebabCase", kebabCase);
	Handlebars.registerHelper("snakeCase", snakeCase);
	Handlebars.registerHelper("upperCase", upperCase);
	Handlebars.registerHelper("lowerCase", lowerCase);
	Handlebars.registerHelper("pluralize", pluralize);
	Handlebars.registerHelper("singularize", singularize);
	Handlebars.registerHelper("jsonStringify", jsonStringify);
	Handlebars.registerHelper("compare", compare);
	Handlebars.registerHelper("indent", indent);
	Handlebars.registerHelper("formatDate", formatDate);
	Handlebars.registerHelper("isFeminine", isFeminine);
	Handlebars.registerHelper("article", article);
	Handlebars.registerHelper("indefiniteArticle", indefiniteArticle);
	Handlebars.registerHelper("definiteArticle", definiteArticle);
	Handlebars.registerHelper("feminineSuffix", feminineSuffix);
	Handlebars.registerHelper("isArrayType", isArrayType);
	Handlebars.registerHelper("eq", eq);
	Handlebars.registerHelper("gt", gt);
	Handlebars.registerHelper("lt", lt);
	Handlebars.registerHelper("not", not);
}

/**
 * Crée un contexte enrichi avec toutes les variations du nom de ressource
 * @param {string} resource - Nom de la ressource
 * @param {object} additionalContext - Contexte additionnel
 * @returns {object} Contexte enrichi
 */
export function createEnrichedContext(resource, additionalContext = {}) {
	return {
		resource,
		resourcePascalCase: pascalCase(resource),
		resourceCamelCase: camelCase(resource),
		resourceKebabCase: kebabCase(resource),
		resourceSnakeCase: snakeCase(resource),
		resourceLowerCase: lowerCase(resource),
		resourcePlural: pluralize(resource),
		resourcePluralLowerCase: lowerCase(pluralize(resource)),
		resourcePluralKebabCase: kebabCase(pluralize(resource)),
		resourcePluralPascalCase: pascalCase(pluralize(resource)),
		resourcePluralCamelCase: camelCase(pluralize(resource)),
		...additionalContext,
	};
}
