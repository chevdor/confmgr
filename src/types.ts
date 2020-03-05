// tag::ConfigItemOptions[]
export type ConfigItemOptions = {
	masked?: boolean // true for tokens, passwords, etc..
	regexp?: RegExp // validation regexp
	mandatory?: boolean // Do we explode if this ENV is not defined and there is no default?
	default?: ConfigValue // The default if nothing is provided
	type?: Type // If provided, the ConfigManager will do some conversion for us
}
// end::ConfigItemOptions[]

export type ConfigValue = any

// tag::Type[]
/**
 * This describes the type of the config items.
 */
export type Type = 'string' | 'boolean' | 'number' | 'array' | 'object'
// end::Type[]

export interface ConfigItem {
	name: string // Name of the envrionment varibale
	description: string // Description of what the var does
	options?: ConfigItemOptions
	value?: ConfigValue
}

/**
 * This is the simple form of your config: bascically `key: value`.
 */
export type ConfigDictionnarySimple = {
	[key: string]: ConfigValue /** Some test */
}

/**
 * This is a spec item
 */
export type ConfigDictionnaryRaw = {
	[key: string]: ConfigItem
}

/**
 * The FullConfig type is a wrapper around the raw config itself and some params
 */
export type FullConfig = {
	factoryParams: FactoryCtorInitParams
	config: ConfigDictionnaryRaw
}

export type FactoryCtorInitParams = {
	prefix: string
	module: string
}

export type ConfigSpecs = {
	container: FactoryCtorInitParams
	config: ConfigDictionnaryRaw
}

/**
 * Options you may pass to the `Print()` method.
 */
export type PrintOptions = {
	color?: boolean
	logger?: (...args) => void
}
