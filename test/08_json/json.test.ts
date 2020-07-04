import { ConfigManager } from '../../src/ConfigManager'
import { expect } from 'chai'
import path from 'path'
import { clearEnv } from '../helpers'
// import { Module } from 'module'

describe('JSON', () => {
	beforeEach(function () {
		ConfigManager.clearInstance()
		clearEnv()
		process.env.SAMPLE_MODULE_BOOL1 = 'init'
		process.env.SAMPLE_MODULE_BOOL2 = 'init'
		process.env.SAMPLE_MODULE_BOOL3 = 'init'
	})

	it('T0801 Should accept loading valid JSON specs', function () {
		const json = path.join(__dirname, 'good.json')
		expect(() => ConfigManager.getInstance(json)).to.not.throw()
		const configSpecs = ConfigManager.getInstance(json).getSpecs()
		expect(configSpecs.MODULE['BOOL1'].description).to.have.length.above(3)
		const config = ConfigManager.getInstance(json).getConfig()
		expect(config.Get('MODULE', 'BOOL1')).to.be.a('boolean')
	})

	it('T0801 Should reject loading bad JSON specs', function () {
		const json = path.join(__dirname, 'bad.json')
		expect(() => ConfigManager.getInstance(json)).to.throw()
	})
})
