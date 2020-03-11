const SpecsFactory = require('confmgr')
const prefix = 'SAMPLE'
const mod = 'MODULE'
const factory = new SpecsFactory.SpecsFactory({ prefix: prefix })
factory.appendSpec(mod, factory.getSpec('PARAM1', 'some param1'))
factory.appendSpec(mod, factory.getSpec('PARAM2', 'some param2'))
factory.appendSpec(
	mod,
	factory.getSpec('SECRET', 'some secret', { masked: true })
)
factory.appendSpec(
	mod,
	factory.getSpec('REGEXP', 'some regexp', { regexp: /^\d{2}_\d{2}/ })
)
factory.appendSpec(
	mod,
	factory.getSpec('MANDAT1', 'some mandatory param', { mandatory: true })
)
const specs = factory.getSpecs()
exports['default'] = specs
