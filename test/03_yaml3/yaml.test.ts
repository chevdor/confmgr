import { ConfigManager } from '../../src/ConfigManager'
import { expect } from 'chai'
import path from 'path'
import { clearEnv, loadDefaultEnv } from '../helpers'

describe('Yaml #3', () => {
	const yml = path.join(__dirname, 'specs.yml')
	beforeEach(function () {
		ConfigManager.clearInstance()
		clearEnv()
		loadDefaultEnv()
	})

	it('T0301 Should fail loging load Yaml config with several modules', function () {
		expect(() => ConfigManager.getInstance(yml)).to.not.throw()
	})
})
