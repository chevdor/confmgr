import { ConfigManager } from '../../src/ConfigManager'
import { expect } from 'chai'
import path from 'path'
import { clearEnv, loadDefaultEnv } from '../helpers'

describe('Yaml #1', () => {
	const yml = path.join(__dirname, 'specs.yml')
	beforeEach(function () {
		ConfigManager.clearInstance()
		clearEnv()
		loadDefaultEnv()
	})

	it('T0101 Should load Yaml config', function () {
		const config = ConfigManager.getInstance(yml).getConfig()
		expect(config).to.includes.keys('Validate', 'ValidateField', 'Print')
	})

	it('T0102 Should contain module', function () {
		const config = ConfigManager.getInstance(yml).getConfig()
		expect(config.values.MODULE).to.not.be.undefined
	})

	it('T0103 Should have content', function () {
		const config = ConfigManager.getInstance(yml).getConfig()
		expect(config.values.MODULE.PARAM1).to.not.be.undefined
	})

	it('T0104 Should fill up mandatory with default', function () {
		const config = ConfigManager.getInstance(yml).getConfig()
		expect(config.values.MODULE['OPTIONAL_WITH_DEF']).to.not.be.undefined
	})

	it('T0105 Should fill up mandatory with default', function () {
		const config = ConfigManager.getInstance(yml).getConfig()
		expect(config.values.MODULE['OPTIONAL_WITH_DEF']).to.not.be.undefined
	})

	it('T0106 Should fill up non mandatory with default', function () {
		const config = ConfigManager.getInstance(yml).getConfig()
		expect(config.values.MODULE['OPTIONAL_WITH_DEF']).to.not.be.undefined
	})

	it('T0107 Should fail validation when mandat and no default', function () {
		const config = ConfigManager.getInstance(yml).getConfig()
		expect(config.ValidateField('MODULE', 'MANDAT_NO_DEF')).to.be.false
	})
})
