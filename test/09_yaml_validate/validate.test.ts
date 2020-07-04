import { ConfigManager } from '../../src/ConfigManager'
import { expect } from 'chai'
import path from 'path'
import { clearEnv, loadEnv } from '../helpers'

describe('Yaml Validate', () => {
	const yml = path.join(__dirname, 'specs.yml')
	beforeEach(function () {
		ConfigManager.clearInstance()
		clearEnv()
	})

	it('T0901 Should pass validation when all keys are present', function () {
		loadEnv({
			SAMPLE_MATRIX_TOKEN:
				'0123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789',
			SAMPLE_MATRIX_USER_ID: 'foobar',
		})
		expect(() => ConfigManager.getInstance(yml)).to.not.throw()
		const config = ConfigManager.getInstance(yml)
		expect(config.Validate()).to.be.true
	})

	it('T0902 Should fail validation when some keys are missing 1/2', function () {
		loadEnv({
			SAMPLE_MATRIX_TOKEN:
				'0123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789',
		})
		expect(() => ConfigManager.getInstance(yml)).to.not.throw()
		const config = ConfigManager.getInstance(yml)
		expect(config.Validate()).to.be.false // Missing USER_ID
	})

	it('T0903 Should fail validation when some keys are missing 2/2', function () {
		loadEnv({
			SAMPLE_MATRIX_USER_ID: 'foobar',
		})
		expect(() => ConfigManager.getInstance(yml)).to.not.throw()
		const config = ConfigManager.getInstance(yml)
		expect(config.Validate()).to.be.false // MISSING TOKEN
	})

	it('T0904 Should fail validation when all keys are missing', function () {
		expect(() => ConfigManager.getInstance(yml)).to.not.throw()
		const config = ConfigManager.getInstance(yml)
		expect(config.Validate()).to.be.false
	})
})
