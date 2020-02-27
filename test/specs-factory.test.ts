import { SpecsFactory } from '../src/SpecsFactory';
import { expect } from 'chai';

import { ConfigItem } from '../src/types';

const PREFIX = 'PREFIX'
const MODULE = 'MODULE'

describe('Specs Factory', () => {
  it('Should pass', function() {
    const f = new SpecsFactory({ prefix: PREFIX, module: MODULE });
    const param = 'param'
    const desc = 'some desc'

    const spec: ConfigItem = f.getSpec(param, desc);
    expect(spec.name).equal(`${PREFIX}_${MODULE}_${param}`);
  });

});
