import { SpecsFactory } from '../../src/SpecsFactory'
import { expect } from 'chai'
import { ConfigItem } from '../../src/types/types'

const prefix = 'PREFIX'

describe('Specs Factory', () => {
	it('T0101 Should pass', function() {
		const f = new SpecsFactory({ prefix })
		const param = 'param'
		const desc = 'some desc'

		const spec: ConfigItem = f.getSpec(param, desc)
		expect(spec.name).equal(`${param}`)
	})
})
