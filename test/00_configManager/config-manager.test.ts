import { ConfigManager } from '../../src/ConfigManager'
import { expect } from 'chai'
import specs from './config-specs'
import {
	clearEnv,
	loadDefaultEnv,
	param1,
	param2,
	secret,
	regexp,
} from '../helpers'

describe('ConfigManager', () => {
	beforeEach(function() {
		ConfigManager.clearInstance()
		clearEnv()
		loadDefaultEnv()
	})

	it('T0001 Should fail the first call without config specs', function() {
		expect(() => ConfigManager.getInstance()).to.throw(/missing/i)
	})

	it('T0002 Should pass the second call with config specs', function() {
		expect(() => ConfigManager.getInstance(specs)).to.not.throw()
		expect(() => ConfigManager.getInstance(specs)).to.not.throw()
	})

	it('T0003 Should pass the second call without config specs', function() {
		expect(() => ConfigManager.getInstance(specs)).to.not.throw()
		expect(() => ConfigManager.getInstance()).to.not.throw()
	})

	it('T0004 Should properly fetch params', function() {
		const config = ConfigManager.getInstance(specs).getConfig()
		expect(config.values.MODULE['PARAM1']).to.equal(param1)
		expect(config.values.MODULE['PARAM2']).to.equal(param2)
		expect(config.values.MODULE['SECRET']).to.equal(secret)
		expect(config.values.MODULE['REGEXP']).to.equal(regexp)
		expect(() => ConfigManager.getInstance()).to.not.throw()
	})

	it('T0005 Should properly fetch config specs', function() {
		const configSpecs = ConfigManager.getInstance(specs).getSpecs()
		expect(configSpecs.MODULE['PARAM1'].description).to.have.length.above(3)
	})

	it('T0006 Should return clean config', function() {
		const config = ConfigManager.getInstance(specs).getConfig().values
		expect(config.MODULE['PARAM1']).to.equal(param1)
		expect(config.MODULE['PARAM2']).to.equal(param2)
		expect(config.MODULE['SECRET']).to.equal(secret)
		expect(config.MODULE['REGEXP']).to.equal(regexp)
		expect(() => ConfigManager.getInstance()).to.not.throw()
	})

	it('T0007 Should fail regexp validation', function() {
		process.env.SAMPLE_MODULE_REGEXP = '123_45'
		const res = ConfigManager.getInstance(specs).Validate()
		expect(res).to.be.false
	})

	it('T0008 Should fail is a mandatory field is missing', function() {
		delete process.env.SAMPLE_MODULE_MANDAT1 // just in case
		const res = ConfigManager.getInstance(specs).Validate()
		expect(res).to.be.false
	})

	it('T0009 Should not fail is a non mandatory field is missing', function() {
		delete process.env.SAMPLE_MODULE_PARAM2
		const config = ConfigManager.getInstance(specs)
		const res = config.Validate()
		expect(res).to.be.false
	})

	it('T0010 Should get field specs', function() {
		const config = ConfigManager.getInstance(specs)
		const fieldSepcs = config.getFieldSpecs('MODULE', 'MANDAT1')
		expect(fieldSepcs.name).to.equal('MANDAT1')
		expect(fieldSepcs.description).to.equal('some mandatory param')
		expect(fieldSepcs.options).include.keys('mandatory')
	})

	it('T0011 Should not fails requesting non existant field specs', function() {
		const config = ConfigManager.getInstance(specs)
		const fieldSepcs = config.getFieldSpecs('MODULE', 'FOO')
		expect(fieldSepcs).to.be.null
	})

	it('T0012 Should validate a single field', function() {
		let config
		ConfigManager.getInstance(specs)

		process.env.SAMPLE_MODULE_REGEXP = '22_33'
		ConfigManager.getInstance().rebuild()
		config = ConfigManager.getInstance().getConfig()

		expect(config.values.MODULE['REGEXP']).to.equal('22_33')
		expect(config.ValidateField('MODULE', 'REGEXP')).to.be.true

		process.env.SAMPLE_MODULE_REGEXP = '222_33'
		ConfigManager.getInstance().rebuild()
		config = ConfigManager.getInstance().getConfig()
		expect(config.values.MODULE['REGEXP']).to.equal('222_33')
		expect(config.ValidateField('MODULE', 'REGEXP')).to.be.false

		// put back the ENV as it was so we dont affect other tests
		process.env.SAMPLE_MODULE_REGEXP = '12_34'
		ConfigManager.getInstance().rebuild()
	})

	it('T0013 Should load config to global', function() {
		ConfigManager.getInstance(specs)
		ConfigManager.loadToGlobal()
		expect(global['Config'].values.MODULE).to.include.keys('PARAM1', 'PARAM2')
	})

	it('T0014 Print() should not change th config', function() {
		const config = ConfigManager.getInstance(specs).getConfig()
		expect(config.values.MODULE['PARAM1']).to.equal(param1)
		config.Print({ compact: true })
		expect(config.values.MODULE['PARAM1']).to.equal(param1)
	})

	it('T0015 Should call the Getter', function() {
		const config = ConfigManager.getInstance(specs).getConfig()
		expect(config.Get('MODULE', 'PARAM1')).to.equal(param1)
		expect(config.Get('MODULE', 'PARAM2')).to.equal(param2)
		expect(config.Get('MODULE', 'SECRET')).to.equal(secret)
		expect(config.Get('MODULE', 'REGEXP')).to.equal(regexp)
	})

	it('T0016 Should throw when calling Getter on a missing module', function() {
		const config = ConfigManager.getInstance(specs).getConfig()
		expect(() => config.Get('MODULE_99', 'PARAM1')).to.throw(
			/Module .* does not exist/i
		)
	})

	it('T0017 Should throw when calling Getter on a missing variable', function() {
		const config = ConfigManager.getInstance(specs).getConfig()
		expect(() => config.Get('MODULE', 'PARAM_99')).to.throw(
			/Key .* does not exist/i
		)
	})
})
