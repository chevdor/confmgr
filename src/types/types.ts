import { ConfigItemOptions } from './types'
import { ConfigValue } from './baseTypes'

/** This type describes our main config specs */
export type ConfigSpecs = {
	container: FactoryCtorInitParams
	config: ModuleDictionnary | {}
}

export type FactoryCtorInitParams = {
	prefix: string
}

export interface ConfigObject {
	Validate(): boolean
	Get(Module, Key): ConfigValue
	Print(PrintOptions?): void
	ValidateField(Module, string): boolean
	GenEnv(): string[]
	values: ModuleDictionnary
}

export type ModuleDictionnary = {
	[module: string]: ConfigDictionnaryRaw | ConfigDictionnarySimple
}

/** Currently not used */
export type ConfigDictionnary = {
	[key: string]: ConfigItem | ConfigValue
}

/**
 * This is a spec item: key: Specs
 */
export type ConfigDictionnaryRaw = {
	[key: string]: ConfigItem
}

/**
 * This is the simple form of your config: bascically `key: value`.
 */
export type ConfigDictionnarySimple = {
	[key: string]: ConfigValue /** Some test */
}

export interface ConfigItem {
	name: string // Name of the envrionment varibale
	description: string // Description of what the var does
	options?: ConfigItemOptions
	value?: ConfigValue
}

/**
 * The FullConfig type is a wrapper around the raw config itself and some params
 */
export type FullConfig = {
	factoryParams: FactoryCtorInitParams
	config: ConfigDictionnaryRaw
}

export { ConfigItemOptions, PrintOptions } from './optionTypes'
export { ConfigValue, Module, Type } from './baseTypes'
