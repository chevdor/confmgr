import { ConfigManager } from '../../src/ConfigManager';
import { expect } from 'chai';
import path from 'path';
import { clearEnv, loadDefaultEnv } from '../helpers';

describe('Yaml #2', () => {
  beforeEach(function () {
    ConfigManager.clearInstance();
    clearEnv();
    loadDefaultEnv();
  });

  it('Should load Yaml config', function () {
    const config = ConfigManager.getInstance(path.join(__dirname, 'specs.yml')).getConfig();
    expect(config).to.includes.keys(
      'TS_SAMPLE_MODULE_01_PARAM1',
      'TS_SAMPLE_MODULE_01_PARAM2',
      'TS_SAMPLE_MODULE_01_SECRET',
      'TS_SAMPLE_MODULE_01_REGEXP',
      'TS_SAMPLE_MODULE_01_MANDAT_NO_DEF'
    );
  });
});
