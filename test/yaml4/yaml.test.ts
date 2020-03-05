import { ConfigManager } from '../../src/ConfigManager'
import { expect } from 'chai'
import path from 'path'
import { clearEnv, loadDefaultEnv } from '../helpers'

describe('Yaml #4', () => {
	beforeEach(function() {
		ConfigManager.clearInstance()
		clearEnv()
		loadDefaultEnv()
	})

	it('Should not load Yaml config with several prefixes', function() {
		const yml = path.join(__dirname, 'specs.yml')
		expect(() => ConfigManager.getInstance(yml)).to.throw(/not supported/i)
	})
})
