import { ConfigManager } from '../../src/ConfigManager'
import { expect } from 'chai'
import path from 'path'
import { clearEnv } from '../helpers'

export function loadEnv(): void {
	process.env.SAMPLE_MODULE1_PARAM1 = '42'
	process.env.SAMPLE_MODULE2_PARAM1 = 'Bob'
}

describe('Yaml #4', () => {
	const yml = path.join(__dirname, 'multimodules.yml')
	beforeEach(function() {
		ConfigManager.clearInstance()
		clearEnv()
		loadEnv()
	})

	it('T0401 Should load Yaml specs with several modules', function() {
		expect(() => ConfigManager.getInstance(yml)).to.not.throw(
			/Multiple modules is not supported/i
		)
	})

	it('T0402 Should properly fetch params', function() {
		const config = ConfigManager.getInstance(yml).getConfig().values
		expect(config.MODULE1['PARAM1']).to.equal('42')
		expect(config.MODULE2['PARAM1']).to.equal('Bob')
		expect(() => ConfigManager.getInstance()).to.not.throw()
	})
})
