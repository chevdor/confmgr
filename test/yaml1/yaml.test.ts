import { ConfigManager } from '../../src/ConfigManager';
import { expect } from 'chai';
import path from 'path';
import { clearEnv, loadDefaultEnv } from '../helpers';

describe('Yaml #1', () => {
  beforeEach(function () {
    ConfigManager.clearInstance();
    clearEnv();
    loadDefaultEnv();
  });

  it('Should load Yaml config', function () {
    const config = ConfigManager.getInstance(path.join(__dirname, 'specs.yml')).getConfig();
    expect(config).to.includes.keys(
      'Validate',
      'ValidateField',
      'Print',
      'TS_SAMPLE_MODULE_01_PARAM1',
      'TS_SAMPLE_MODULE_01_PARAM2',
      'TS_SAMPLE_MODULE_01_SECRET',
      'TS_SAMPLE_MODULE_01_REGEXP',
      'TS_SAMPLE_MODULE_01_MANDAT_NO_DEF'
    );
  });
    
  it('Should fill up mandatory with default', function () {
    const config = ConfigManager.getInstance(path.join(__dirname, 'specs.yml')).getConfig();
    expect(config['TS_SAMPLE_MODULE_01_OPTIONAL_WITH_DEF']).to.not.be.undefined;
  });
  
  it('Should fill up non mandatory with default', function () {
    const config = ConfigManager.getInstance(path.join(__dirname, 'specs.yml')).getConfig();
    expect(config['TS_SAMPLE_MODULE_01_OPTIONAL_WITH_DEF']).to.not.be.undefined;
  });

  it('Should fail validation when mandat and no default', function () {
    const config = ConfigManager.getInstance(path.join(__dirname, 'specs.yml')).getConfig();
    expect(config.ValidateField('TS_SAMPLE_MODULE_01_MANDAT_NO_DEF')).to.be.false;
  });
});
