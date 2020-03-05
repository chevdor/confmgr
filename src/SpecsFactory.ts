import {
	ConfigItem,
	FactoryCtorInitParams,
	ConfigSpecs,
	ConfigItemOptions,
} from './types'

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
			name: `${this.specs.container.prefix}_${this.specs.container.module}_${name}`,
			description,
			options,
		}
		return res
	}

	public getSpecs(): ConfigSpecs {
		return this.specs
	}

	public appendSpec(newSpec: ConfigItem): ConfigSpecs {
		if (!this.specs.config) this.specs.config = {}
		this.specs.config[newSpec.name] = newSpec
		return this.specs
	}
}
