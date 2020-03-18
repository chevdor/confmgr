import { ConfigValue, Type } from './baseTypes'

export type RegexpWithAttributes = {
	pattern: RegExp
	attributes: string
}

// tag::ConfigItemOptions[]
export type ConfigItemOptions = {
	masked?: boolean // true for tokens, passwords, etc..
	regexp?: RegExp | RegexpWithAttributes // validation regexp
	mandatory?: boolean // Do we explode if this ENV is not defined and there is no default?
	default?: ConfigValue // The default if nothing is provided
	type?: Type // If provided, the ConfigManager will do some conversion for us
}
// end::ConfigItemOptions[]

/**
 * Options you may pass to the `Print()` method.
 */
export type PrintOptions = {
	color?: boolean
	compact?: boolean
	logger?: (...args) => void
}
