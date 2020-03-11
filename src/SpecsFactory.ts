import {
	ConfigItem,
	FactoryCtorInitParams,
	ConfigSpecs,
	ConfigItemOptions,
} from './types/types'

/**
 * The SpecsFactory class is used under the hood when loading your YAML specs.
 *
 * This class is also accessible if you want to build your specs from code.
 */
export class SpecsFactory {
	private specs: ConfigSpecs

	constructor(container: FactoryCtorInitParams) {
		this.specs = {
			config: {},
			container,
		}
	}

	public getSpec(
		name: string,
		description: string,
		options?: ConfigItemOptions
	): ConfigItem {
		const res: ConfigItem = {
			name,
			description,
			options,
		}
		return res
	}

	public getSpecs(): ConfigSpecs {
		return this.specs
	}

	public appendSpec(module: string, newSpec: ConfigItem): ConfigSpecs {
		// console.log('appendSpec', module, newSpec)

		if (!this.specs.config) this.specs.config = {}
		if (!this.specs.config[module]) this.specs.config[module] = {}
		this.specs.config[module][newSpec.name] = newSpec
		return this.specs
	}
}
