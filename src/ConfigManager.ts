import * as process from 'process'
import dotenv from 'dotenv'
import * as path from 'path'
import {
	ConfigSpecs,
	ConfigDictionnaryRaw,
	ConfigItem,
	ConfigItemOptions,
	PrintOptions,
	ModuleDictionnary,
	Module,
	ConfigObject,
} from './types/types'
import chalk from 'chalk'
import YAML from 'yaml'
import fs from 'fs'
import { SpecsFactory } from './SpecsFactory'
import { Key, ConfigValue } from './types/baseTypes'
import { RegexpWithAttributes } from './types/optionTypes'

/**
 * Helper fonction to clone objects
 * @param object The object to clone
 */
function clone<T>(object: T): T {
	return JSON.parse(JSON.stringify(object))
}

/**
 * The ConfigManager class is where everything happens.
 *
 * The ConfigManager allows you loading your config specs definition,
 * it also loads your actual config and lets you access it.
 */
export class ConfigManager {
	private static instance: ConfigManager
	private config: ConfigObject
	private specs: ConfigSpecs

	/**
	 * The constructor of ConfigManager is private and is called only
	 * by GetInstance to ensure it works as singleton.
	 * @param specs
	 */
	private constructor(specs: ConfigSpecs) {
		if (!specs) throw new Error('Missing specs in ctor')
		this.specs = specs
		this.refresh()
	}

	/**
	 * Load specs from a YAML file
	 * @param file Path of the YAML file
	 */
	public static loadSpecsFromYaml(file: string): ConfigSpecs {
		const configFile = fs.readFileSync(file, 'utf8')
		const yaml = YAML.parse(configFile)

		if (Object.keys(yaml)[1])
			throw new Error(
				'Multiple prefixes is not supported yet. Get in touch if you see a need.'
			)

		const prefix = Object.keys(yaml)[0]
		const factory = new SpecsFactory({ prefix })
		Object.keys(yaml[prefix]).map(module => {
			Object.keys(yaml[prefix][module]).map((key: string) => {
				const shortKey = key // key.replace(`${prefix}_${module}_`, '')
				const description: string = yaml[prefix][module][shortKey].description
				const opt: ConfigItem = yaml[prefix][module][shortKey]
				delete opt.description
				const options: ConfigItemOptions = opt as ConfigItemOptions
				factory.appendSpec(
					module,
					factory.getSpec(shortKey, description, options)
				)
			})
		})
		return factory.getSpecs()
	}

	/**
	 * ConfigManager is a singleton.
	 * @param specs The config specs the ConfigManager will rely on. It can be a ConfigSpecs object or the path of a file.
	 * In that case, the file can be either a YAML file or a JSON file.
	 */
	public static getInstance(specs?: ConfigSpecs | string): ConfigManager {
		if (!this.instance && !specs) {
			throw new Error('Missing specs')
		}
		if (!this.instance && specs) {
			if (typeof specs === 'string') {
				this.instance = new ConfigManager(
					ConfigManager.loadSpecsFromYaml(specs)
				)
			} else {
				this.instance = new ConfigManager(specs)
			}
			this.instance.rebuild()
		}

		return this.instance
	}

	/**
	 * You should not use this function. It is there only for testing.
	 */
	public static clearInstance(): void {
		this.instance = undefined
	}

	/**
	 * This function converts a string to a boolean. It ignores the case and
	 * support also values such as 0 and 1, yes and no.
	 * @param s String to convert
	 */
	private static stringToBoolean(s: string): boolean {
		if (typeof s === 'boolean') return s
		let res = null
		switch (s.toLowerCase().trim()) {
			case 'true':
			case 'yes':
			case '1':
				res = true
				break
			case 'false':
			case 'no':
			case '0':
			case null:
				res = false
				break
			default:
				res = Boolean(s)
		}

		return res
	}

	public getConfig(): ConfigObject {
		return this.config
	}

	/**
	 * This retrieves the config and fills defaults.
	 * Additionnaly, the config object you get is decorated with a few helper fonctions
	 * such as Print, Validate, etc... to help you easily use your config
	 */
	public buildConfig(): ConfigObject {
		// here we clone the config specs so we dont lose the specs
		const confClone: ConfigObject = {
			values: clone(this.specs.config) as ModuleDictionnary,
			Get: this.Get.bind(this),
			Print: this.Print.bind(this),
			Validate: this.Validate.bind(this),
			ValidateField: this.ValidateField.bind(this),
			GenEnv: this.GenEnv.bind(this),
		}

		const specs = this.getSpecs()

		Object.entries(confClone.values).map(
			([mod, _confItems]: [string, ConfigDictionnaryRaw]) => {
				Object.entries(confClone.values[mod]).map(([key, _val]) => {
					const longKey = `${this.specs.container.prefix}_${mod}_${key}`
					confClone.values[mod][key] = process.env[longKey]

					// Here we check if we need to apply some default values
					if (
						!confClone.values[mod][key] &&
						specs[mod][key].options &&
						specs[mod][key].options.default
					) {
						confClone.values[mod][key] = specs[mod][key].options.default
					}

					// Here we check if a type is defined, and if so, we try to convert
					if (specs[mod][key].options && specs[mod][key].options.type) {
						switch (specs[mod][key].options.type) {
							case 'string':
								// nothing to do for strings...
								break

							case 'number':
								confClone.values[mod][key] = Number(confClone.values[mod][key])
								break

							case 'boolean':
								confClone.values[mod][key] = ConfigManager.stringToBoolean(
									confClone.values[mod][key] as string
								)

								break

							case 'array':
								confClone.values[mod][key] =
									typeof confClone.values[mod][key] === 'string'
										? JSON.parse(confClone.values[mod][key])
										: confClone.values[mod][key]
								break

							case 'object':
								confClone.values[mod][key] =
									typeof confClone.values[mod][key] === 'string'
										? JSON.parse(confClone.values[mod][key])
										: confClone.values[mod][key]
								break

							default:
								throw new Error(
									`Type not supported: ${specs[mod][key].options.type}`
								)
						}
					}
				})
			}
		)
		return confClone
	}

	public getSpecs(): ModuleDictionnary {
		return this.specs.config
	}

	/**
	 * This function defines what '.env' file will be loaded.
	 * By default, '.env' will be used.
	 * However, if you pass NODE_ENV=abc, the loaded file will
	 * be .env.abc
	 */
	private static getEnvFile(): string {
		const profile = process.env.NODE_ENV || 'production'
		const envfile =
			profile == 'production'
				? path.resolve(process.cwd(), '.env')
				: path.resolve(process.cwd(), '.env.' + profile.toLowerCase())
		return envfile
	}

	/** You likely will never have to use this function which
	 * is mostly use for the tests. If you don't know, do NOT call
	 * this function, it would take time and likely do nothing
	 * interesting for you.
	 */
	public refresh(): void {
		const envfile = ConfigManager.getEnvFile()
		dotenv.config({ path: envfile })
	}

	/** Does not touch the ENV but rebuild the config.
	 * This is useful if you know that the ENV changed
	 */
	public rebuild(): void {
		this.config = this.buildConfig()
	}

	/** Calling this function will get an instance of the Config and attach it
	 * to the global scope.
	 */
	public static loadToGlobal(): void {
		global['Config'] = ConfigManager.getInstance().getConfig()
	}

	private static isregExpWithAttributes(
		r: RegExp | RegexpWithAttributes
	): r is RegexpWithAttributes {
		return (r as RegexpWithAttributes).pattern !== undefined
	}

	/**
	 * This is the actual function performing the validation of a given field according to the spcs
	 * @param specs The specs
	 */
	private validaFieldsSpecs(module: Module, specs: ConfigItem): boolean {
		let result = true
		const config = this.getConfig().values

		if (specs && specs.options) {
			const item = config[module][specs.name]
			if (specs.options.regexp !== undefined) {
				let regexp_options = {
					pattern: undefined,
					attributes: undefined,
				}

				if (!ConfigManager.isregExpWithAttributes(specs.options.regexp))
					regexp_options.pattern = specs.options.regexp
				else {
					regexp_options = specs.options.regexp as RegexpWithAttributes
				}

				const regex = RegExp(regexp_options.pattern, regexp_options.attributes)
				const testResult = regex.test(item)
				result = result && testResult
			}

			result =
				result &&
				(!specs.options.mandatory ||
					(specs.options.mandatory && item !== undefined))
		}
		return result
	}

	public getFieldSpecs(module: Module, key: string): ConfigItem {
		const configSpecs = this.getSpecs()
		const res = Object.entries(configSpecs[module]).find(
			([_key, env]: [string, ConfigItem]) => env.name == key
		)
		return res && res[1] ? res[1] : null
	}

	/**
	 * Validate a single field.
	 * @param key Key of the field
	 */
	public ValidateField(module: Module, key: string): boolean {
		const fieldSpecs = this.getFieldSpecs(module, key)

		return this.validaFieldsSpecs(module, fieldSpecs)
	}

	/** Validate the config and return wheather it is valid or not */
	public Validate(): boolean {
		let result = true
		const configSpecs = this.getSpecs()

		Object.entries(configSpecs).map(
			([mod, _data]: [Module, ConfigDictionnaryRaw]) => {
				Object.entries(configSpecs[mod]).map(
					([_key, env]: [string, ConfigItem]) => {
						result = result && this.validaFieldsSpecs(mod, env)
					}
				)
			}
		)
		return result
	}

	/** Check whether the module mod is part of ours specs */
	private isModuleValid(mod: Module): boolean {
		const hit = Object.entries(this.specs.config).find(val => val[0] === mod)
		return hit !== undefined
	}

	/** Check wether the key is valid. We assume here that the module does exist */
	private isKeyValid(mod: Module, key: Key): boolean {
		const hit = Object.entries(this.specs.config[mod]).find(
			val => val[0] === key
		)
		return hit !== undefined
	}

	/**
	 * This Getter is the safest way to access your configuration values as it will throw errors in case you try access an invalid module/key
	 * @param mod
	 * @param key
	 */
	public Get(mod: Module, key: Key): ConfigValue {
		const moduleExists = this.isModuleValid(mod)

		if (!moduleExists)
			throw new Error(`Module '${mod}' does not exist in your specs`)
		const keyExists = this.isKeyValid(mod, key)
		if (!keyExists)
			throw new Error(`Key '${mod}/${key}' does not exist in your specs`)

		const config = this.getConfig().values

		return config[mod][key]
	}

	private printItemColor(
		mod: Module,
		item: ConfigItem,
		opt: PrintOptions
	): void {
		const config = this.getConfig().values
		const container = `${this.specs.container.prefix}`
		const valid = this.validaFieldsSpecs(mod, item)

		let entry = '    '
		entry += chalk[valid ? 'green' : 'red'](
			`${valid ? ' ✅' : ' ❌'} ${item.name.replace(container + '_', '')}: `
		)

		const io = item.options

		// the value itself
		/* eslint-disable */
		entry += chalk[valid ? 'white' : 'red'](
			`${
			io && io.masked ?
				config[mod][item.name] ?
					'*****' :
					'empty' :
				JSON.stringify(config[mod][item.name], null, 0)}`
		)
		/* eslint-enable */

		if (!opt.compact) {
			entry += chalk.grey(`\n    ${item.description}\n`)
		}
		if (!opt.compact) {
			entry += chalk[valid ? 'white' : 'red'](
				`${io && io.regexp ? '    regexp: ' + io.regexp + '\n' : ''} `
			)
		}

		opt.logger(entry)
	}

	private printItemNoColor(
		mod: Module,
		item: ConfigItem,
		opt: PrintOptions
	): void {
		const config = this.getConfig().values
		const container = `${this.specs.container.prefix}`
		const valid = this.validaFieldsSpecs(mod, item)
		let entry = '    '
		entry += `${valid ? ' ✅' : ' ❌'} ${item.name.replace(
			container + '_',
			''
		)}: `

		const io = item.options

		// the value itself
		/* eslint-disable */
		entry += `${io && io.masked ?
			config[mod][item.name] ?
				'*****' :
				'empty' :
			JSON.stringify(config[mod][item.name], null, 0)}`
		/* eslint-enable */

		if (!opt.compact) {
			entry += `\n    ${item.description}\n`
		}
		if (!opt.compact) {
			entry += `${io && io.regexp ? '    regexp: ' + io.regexp + '\n' : ''} `
		}

		opt.logger(entry)
	}

	/**
	 * Display the current ENV using either the logger you provide or console.log by default.
	 */
	public Print(opt: PrintOptions): void {
		const container = `${this.specs.container.prefix}`
		if (!opt) opt = { color: true }
		if (opt.color === undefined) opt.color = true

		if (!opt.logger) opt.logger = console.log

		if (opt.color) opt.logger(chalk.blue(`${container}:`))
		else opt.logger(`${container}:`)

		Object.entries(this.specs.config).map(
			([mod, moduleContent]: [Module, ConfigDictionnaryRaw]) => {
				if (opt.color) opt.logger(chalk.cyan(`  📦 ${mod}:`))
				else opt.logger(`  📦 ${mod}:`)

				Object.entries(moduleContent).map(
					([_key, env]: [string, ConfigItem]) => {
						opt.color
							? this.printItemColor(mod, env, opt)
							: this.printItemNoColor(mod, env, opt)
					}
				)
			}
		)
	}

	public GenEnv(): string[] {
		const container = `${this.specs.container.prefix}`
		const res: string[] = []
		Object.entries(this.specs.config).map(
			([mod, moduleContent]: [Module, ConfigDictionnaryRaw]) => {
				Object.entries(moduleContent).map(
					([key, env]: [string, ConfigItem]) => {
						/* eslint-disable */
						res.push(`${container}_${mod}_${key}=${env.options?.default ? JSON.stringify(env.options.default, null, 0) : ''}`)
						/* eslint-enable */
					}
				)
			}
		)
		return res
	}
}
