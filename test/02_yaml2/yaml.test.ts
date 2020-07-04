import { ConfigManager } from '../../src/ConfigManager'
import { expect } from 'chai'
import path from 'path'
import { clearEnv, loadDefaultEnv } from '../helpers'

describe('Yaml #2', () => {
	const yml = path.join(__dirname, 'specs.yml')

	beforeEach(function () {
		ConfigManager.clearInstance()
		clearEnv()
		loadDefaultEnv()
	})

	it('T0201 Should load Yaml config', function () {
		const config = ConfigManager.getInstance(yml).getConfig().values
		expect(config).to.includes.keys('MODULE')
		expect(config.MODULE).to.includes.keys(
			'PARAM1',
			'PARAM2',
			'SECRET',
			'REGEXP',
			'MANDAT_NO_DEF'
		)
	})
})
