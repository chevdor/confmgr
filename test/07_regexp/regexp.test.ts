import { ConfigManager } from '../../src/ConfigManager'
import { expect } from 'chai'
import path from 'path'
import { clearEnv } from '../helpers'
// import { Module } from 'module'

describe('RegExp', () => {
	const yml = path.join(__dirname, 'specs.yml')
	beforeEach(function () {
		ConfigManager.clearInstance()
		clearEnv()
		process.env.SAMPLE_MODULE_BOOL1 = 'init'
		process.env.SAMPLE_MODULE_BOOL2 = 'init'
		process.env.SAMPLE_MODULE_BOOL3 = 'init'
	})

	function testValue(name: string, val: string, expectation: boolean): void {
		const key = `SAMPLE_MODULE_${name}`
		process.env[key] = val
		ConfigManager.getInstance(yml).rebuild()
		expect(ConfigManager.getInstance().ValidateField('MODULE', name)).to.be[
			expectation.toString()
		]
	}

	it('T0701 Should accept all valid booleans', function () {
		testValue('BOOL1', 'true', true)
		testValue('BOOL1', 'True', true)
		testValue('BOOL1', 'tRUe', true)
		testValue('BOOL1', 'false', true)
		testValue('BOOL1', 'False', true)
		testValue('BOOL1', 'faLSe', true)
		testValue('BOOL1', 'yes', true)
		testValue('BOOL1', 'no', true)
		testValue('BOOL1', '0', true)
		testValue('BOOL1', '1', true)
	})

	it('T0702 Should accept all valid booleans matching regexp', function () {
		testValue('BOOL2', 'true', true)
		testValue('BOOL2', 'True', true)
		testValue('BOOL2', 'tRUe', true)
		testValue('BOOL2', 'false', true)
		testValue('BOOL2', 'False', true)
		testValue('BOOL2', 'faLSe', true)
	})

	it('T0703 Should accept everything that can be converted to boolean for boolean type', function () {
		testValue('BOOL2', 'yes', true)
		testValue('BOOL2', 'no', true)
		testValue('BOOL2', '0', true)
		testValue('BOOL2', '1', true)
		testValue('BOOL2', 'foo', true) // Boolean('foo') => true
	})

	it('T0704 Should reject according to regexp for non boolean type', function () {
		testValue('BOOL3', 'true', true)
		testValue('BOOL3', 'false', true)
		testValue('BOOL3', 'yes', false)
		testValue('BOOL3', 'no', false)
		testValue('BOOL3', '0', false)
		testValue('BOOL3', '1', false)
		testValue('BOOL3', 'foo', false) // Boolean('foo') => true
	})

	it('T0705 Should pass issue #8', function () {
		process.env.SAMPLE_MODULE_URL = 'xx://localhost:9944'
		ConfigManager.getInstance(yml).rebuild()
		expect(ConfigManager.getInstance().ValidateField('MODULE', 'URL')).to.be
			.false
	})
})
