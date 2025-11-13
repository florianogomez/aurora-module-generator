/**
 * Aurora Generator Configuration File
 * 
 * Place this file at the root of your project as:
 * - aurora.config.js (JavaScript)
 * - aurora.config.json (JSON)
 * - .aurorarc (JSON)
 * - .aurorarc.json (JSON)
 * 
 * @example
 * export default {
 *   outputDir: './src',
 *   modulesDir: 'modules',
 *   // ... other options
 * }
 */

export default {
	/**
	 * Output directory (relative to project root)
	 * Where the 'modules' folder will be created
	 * @type {string}
	 * @default './src'
	 */
	outputDir: './src',

	/**
	 * Modules directory name
	 * @type {string}
	 * @default 'modules'
	 */
	modulesDir: 'modules',

	/**
	 * Full path override (optional)
	 * If set, overrides outputDir and modulesDir
	 * @type {string|null}
	 * @default null
	 */
	modulesPath: null,

	/**
	 * Framework configuration
	 * @type {'vue'|'react'|'angular'}
	 * @default 'vue'
	 */
	framework: 'vue',

	/**
	 * Generation options
	 */
	options: {
		/**
		 * Overwrite existing files
		 * @type {boolean}
		 * @default false
		 */
		overwrite: false,

		/**
		 * Verbose output
		 * @type {boolean}
		 * @default true
		 */
		verbose: true,

		/**
		 * Use store generation script
		 * @type {boolean}
		 * @default true
		 */
		useStoreScript: true,
	},

	/**
	 * Path configurations for different file types
	 */
	paths: {
		/**
		 * Interfaces export file (relative to project root)
		 * @type {string|null}
		 * @default './src/interfaces/index.ts'
		 */
		interfacesIndex: './src/interfaces/index.ts',

		/**
		 * Store keys enum file (relative to project root)
		 * @type {string|null}
		 * @default './src/enums/store_keys_enum.ts'
		 */
		storeKeysEnum: './src/enums/store_keys_enum.ts',

		/**
		 * Pinia plugin file (relative to project root)
		 * @type {string|null}
		 * @default './src/plugins/1.pinia/index.ts'
		 */
		piniaPlugin: './src/plugins/1.pinia/index.ts',
	},
};
