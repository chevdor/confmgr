import { ConfigManager } from '../../src/ConfigManager'
import { expect } from 'chai'
import path from 'path'
import { clearEnv } from '../helpers'

/**
 * Check that the ConfigManager handles conversions properly
 */
export function loadDefaultEnvForTypes(): void {
	process.env.SAMPLE_MODULE_STRING2 = '42'
	process.env.SAMPLE_MODULE_NUMBER2 = '3.14'
	process.env.SAMPLE_MODULE_OBJECT2 = '{"name": "bar", "age": 43}'
	process.env.SAMPLE_MODULE_BOOL2 = 'true'
	process.env.SAMPLE_MODULE_BOOL3 = 'TRUE'
	process.env.SAMPLE_MODULE_ARRAY2 = '[1,2,3]'
	process.env.SAMPLE_MODULE_ARRAY3 = '["a","b","c"]'
}

describe('Types', () => {
	const yml = path.join(__dirname, 'specs.yml')
	beforeEach(function() {
		ConfigManager.clearInstance()
		clearEnv()
		loadDefaultEnvForTypes()
	})

	it('T0501 Should load Yaml config and env locally', function() {
		const config = ConfigManager.getInstance(yml).getConfig().values
		expect(config.MODULE).to.includes.keys(
			'STRING1',
			'NUMBER1',
			'BOOL1',
			'ARRAY1'
		)
	})

	it('T0502 Should handle default strings properly', function() {
		const config = ConfigManager.getInstance(yml).getConfig().values
		expect(config.MODULE['STRING1']).to.be.a('string')
	})

	it('T0503 Should handle default number properly', function() {
		const config = ConfigManager.getInstance(yml).getConfig().values
		expect(config.MODULE['NUMBER1']).to.be.a('number')
	})

	it('T0504 Should handle default number properly', function() {
		const config = ConfigManager.getInstance(yml).getConfig().values
		expect(config.MODULE['BOOL1']).to.be.a('boolean')
	})

	it('T0505 Should handle default object properly', function() {
		const config = ConfigManager.getInstance(yml).getConfig().values
		expect(config.MODULE['OBJECT1']).to.be.a('object')
	})

	it('T0506 Should handle default array properly', function() {
		const config = ConfigManager.getInstance(yml).getConfig().values
		expect(config.MODULE['ARRAY1']).to.be.a('array')
	})

	it('T0507 Should contain the value default values', function() {
		const config = ConfigManager.getInstance(yml).getConfig()
		expect(config.Validate()).to.be.true
	})

	it('T0508 Should convert srings', function() {
		const config = ConfigManager.getInstance(yml).getConfig().values
		expect(config.MODULE['STRING2']).to.be.a('string')
	})

	it('T0509 Should convert number', function() {
		const config = ConfigManager.getInstance(yml).getConfig().values
		expect(config.MODULE['NUMBER2']).to.be.a('number')
	})

	it('T0510 Should convert boolean - case 1', function() {
		const config = ConfigManager.getInstance(yml).getConfig().values
		expect(config.MODULE['BOOL2']).to.be.a('boolean')
	})

	it('T0511 Should convert boolean - case 2', function() {
		const config = ConfigManager.getInstance(yml).getConfig().values
		expect(config.MODULE['BOOL3']).to.be.a('boolean')
	})

	it('T0512 Should convert array - case 1', function() {
		const config = ConfigManager.getInstance(yml).getConfig().values
		expect(config.MODULE['ARRAY2']).to.be.a('array')
	})

	it('T0513 Should convert array - case 2', function() {
		const config = ConfigManager.getInstance(yml).getConfig().values
		expect(config.MODULE['ARRAY3']).to.be.a('array')
	})

	it('T0514 Should convert object - case 1', function() {
		const config = ConfigManager.getInstance(yml).getConfig().values
		const item = config.MODULE['OBJECT2']
		expect(item).to.be.a('object')
		expect(item.name).to.equal('bar')
		expect(item.age).to.equal(43)
	})

	it('T0515 Should throw an exception on unsupported types', function() {
		const yml = path.join(__dirname, 'specs-error.yml')
		expect(() => ConfigManager.getInstance(yml).getConfig()).to.throw(
			/not supported: foobar/i
		)
	})
})
