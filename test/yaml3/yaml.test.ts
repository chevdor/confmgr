import { ConfigManager } from '../../src/ConfigManager';
import { expect } from 'chai';
import path from 'path';
import { clearEnv, loadDefaultEnv } from '../helpers';

describe('Yaml #3', () => {
  beforeEach(function () {
    ConfigManager.clearInstance();
    clearEnv();
    loadDefaultEnv();
  });

  it('Should fail loging load Yaml config with several modules', function () {
    const yml = path.join(__dirname, 'specs.yml');
    expect(() => ConfigManager.getInstance(yml)).to.throw(/not supported/i);
  });
});
