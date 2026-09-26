module.exports = {
	root: true,
	env: {
		node: true
	},
	extends: ['plugin:vue/vue3-recommended', 'plugin:prettier/recommended'],
	parser: 'vue-eslint-parser',
	parserOptions: {
		parser: '@typescript-eslint/parser',
		ecmaVersion: 2022,
		ecmaFeatures: {
			jsx: true
		}
	},
	rules: {
		curly: 'error', // Control statements require braces
		'vue/multi-word-component-names': 'off',
		'vue/require-prop-types': 'off'
	}
}
