import { ConfigManager } from '../../src/ConfigManager'
import { expect } from 'chai'
import path from 'path'
import { clearEnv, loadDefaultEnv } from '../helpers'

describe('Yaml #2', () => {
	beforeEach(function() {
		ConfigManager.clearInstance()
		clearEnv()
		loadDefaultEnv()
	})

	it('Should load Yaml config', function() {
		const config = ConfigManager.getInstance(
			path.join(__dirname, 'specs.yml')
		).getConfig()
		expect(config).to.includes.keys(
			'SAMPLE_MODULE_PARAM1',
			'SAMPLE_MODULE_PARAM2',
			'SAMPLE_MODULE_SECRET',
			'SAMPLE_MODULE_REGEXP',
			'SAMPLE_MODULE_MANDAT_NO_DEF'
		)
	})
})
