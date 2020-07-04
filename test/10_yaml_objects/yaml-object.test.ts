import { ConfigManager } from '../../src/ConfigManager'
import { expect } from 'chai'
import path from 'path'
import { clearEnv } from '../helpers'

describe('Yaml Object', () => {
	const yml = path.join(__dirname, 'specs.yml')
	beforeEach(function () {
		ConfigManager.clearInstance()
		clearEnv()
	})

	it('T1001 Should get the JS user', function () {
		expect(() => ConfigManager.getInstance(yml)).to.not.throw()
		const config = ConfigManager.getInstance(yml)
		expect(config.Validate()).to.be.true
	
		const user = config.Get('MAIN', 'USER1')
		expect(user.name).to.equal('Bob')
		expect(user.age).to.equal(18)
		expect(user.friends).to.deep.equal(['Alice', 'Charlie'])
		expect(user.happy).to.be.true;
	})

	it('T1002 Should get the YAML user', function () {
		expect(() => ConfigManager.getInstance(yml)).to.not.throw()
		const config = ConfigManager.getInstance(yml)
		const user = config.Get('MAIN', 'USER2')

		expect(config.Validate()).to.be.true
		expect(user.name).to.equal('Bob')
		expect(user.age).to.equal(18)
		expect(user.friends).to.deep.equal(['Alice', 'Charlie'])
		expect(user.happy).to.be.true;
	})

	it('T1003 Should get the YAML user', function () {
		expect(() => ConfigManager.getInstance(yml)).to.not.throw()
		const config = ConfigManager.getInstance(yml)
		const user = config.Get('MAIN', 'USER3')

		expect(config.Validate()).to.be.true
		expect(user.name).to.equal('Bob')
		expect(user.age).to.equal(18)
		expect(user.friends[0].name).to.equal('John')
		expect(user.friends[1].name).to.equal('Peter')
		expect(user.happy).to.be.true;
	})
})
