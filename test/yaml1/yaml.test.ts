import { ConfigManager } from '../../src/ConfigManager'
import { expect } from 'chai'
import path from 'path'
import { clearEnv, loadDefaultEnv } from '../helpers'

describe('Yaml #1', () => {
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
			'Validate',
			'ValidateField',
			'Print',
			'SAMPLE_MODULE_PARAM1',
			'SAMPLE_MODULE_PARAM2',
			'SAMPLE_MODULE_SECRET',
			'SAMPLE_MODULE_REGEXP',
			'SAMPLE_MODULE_MANDAT_NO_DEF'
		)
	})

	it('Should fill up mandatory with default', function() {
		const config = ConfigManager.getInstance(
			path.join(__dirname, 'specs.yml')
		).getConfig()
		expect(config['SAMPLE_MODULE_OPTIONAL_WITH_DEF']).to.not.be.undefined
	})

	it('Should fill up non mandatory with default', function() {
		const config = ConfigManager.getInstance(
			path.join(__dirname, 'specs.yml')
		).getConfig()
		expect(config['SAMPLE_MODULE_OPTIONAL_WITH_DEF']).to.not.be.undefined
	})

	it('Should fail validation when mandat and no default', function() {
		const config = ConfigManager.getInstance(
			path.join(__dirname, 'specs.yml')
		).getConfig()
		expect(config.ValidateField('SAMPLE_MODULE_MANDAT_NO_DEF')).to.be.false
	})
})
