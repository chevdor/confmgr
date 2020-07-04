import { ConfigManager } from '../../src/ConfigManager'
import { expect } from 'chai'
import path from 'path'
import { clearEnv, loadDefaultEnv } from '../helpers'

describe('Benchmarks', () => {
	beforeEach(function () {
		ConfigManager.clearInstance()
		clearEnv()
		loadDefaultEnv()
	})

	it('B0001 Should load the specs fast', function () {
		this.timeout(300)
		const yml = path.join(__dirname, 'benchmark.yml')
		for (let i = 0; i < 2000; i++)
			expect(() => ConfigManager.getInstance(yml)).to.not.throw()
	})

	it('B0002 Should load the config fast', function () {
		this.timeout(1000)
		const yml = path.join(__dirname, 'benchmark.yml')
		let _config = null
		for (let i = 0; i < 1000; i++)
			_config = ConfigManager.getInstance(yml).getConfig()
	})
})
