import prettier from 'eslint-plugin-prettier'
import typescriptEslint from '@typescript-eslint/eslint-plugin'
import globals from 'globals'
import tsParser from '@typescript-eslint/parser'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all,
})

export default [
	{
		ignores: [
			'**/node_modules/',
			'node_modules/*',
			'**/lib',
			'**/doc',
			'**/docs',
		],
	},
	...compat.extends('prettier', 'plugin:prettier/recommended'),
	{
		plugins: {
			prettier,
			'@typescript-eslint': typescriptEslint,
		},

		languageOptions: {
			globals: {
				...globals.node,
				Atomics: 'readonly',
				SharedArrayBuffer: 'readonly',
			},

			parser: tsParser,
			ecmaVersion: 2018,
			sourceType: 'module',
		},

		rules: {
			'prettier/prettier': 'error',
			indent: 0,
			'linebreak-style': ['error', 'unix'],
			quotes: ['error', 'single'],
			semi: ['error', 'never'],
			'no-unused-vars': 0,

			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					vars: 'all',
					args: 'after-used',
					ignoreRestSiblings: true,
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_',
				},
			],

			'no-console': 0,
			'no-undef': 0,
			'@typescript-eslint/explicit-function-return-type': 0,
			'@typescript-eslint/no-use-before-define': 'warn',
			'@/indent': ['error', 'tab'],

			'no-warning-comments': [
				'warn',
				{
					terms: ['todo', 'fixme', 'xxx'],
					location: 'anywhere',
				},
			],
		},
	},
]
