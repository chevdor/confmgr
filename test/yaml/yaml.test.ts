import { ConfigManager } from '../../src/ConfigManager';
import { expect } from 'chai';
import path from 'path';

const param1 = '72';
const param2 = 'r=3.14';
const secret = 'password123';
const regexp = '12_34';
const mandat1 = '7844';

// Here we set some ENV for testing
function loadDefaultEnv(): void {
  process.env.TS_SAMPLE_MODULE_01_PARAM1 = param1;
  process.env.TS_SAMPLE_MODULE_01_PARAM2 = param2;
  process.env.TS_SAMPLE_MODULE_01_SECRET = secret;
  process.env.TS_SAMPLE_MODULE_01_REGEXP = regexp;
  process.env.TS_SAMPLE_MODULE_01_MANDAT1 = mandat1;
}

describe('Yaml', () => {
  beforeEach(function () {
    ConfigManager.clearInstance();
    loadDefaultEnv();
  });

  it('Should load Yaml config', function () {
    const config = ConfigManager.getInstance(path.join(__dirname, 'specs.yml')).getConfig();
    expect(config).to.includes.keys(
      'TS_SAMPLE_MODULE_01_PARAM1',
      'TS_SAMPLE_MODULE_01_PARAM2',
      'TS_SAMPLE_MODULE_01_SECRET',
      'TS_SAMPLE_MODULE_01_REGEXP',
      'TS_SAMPLE_MODULE_01_MANDAT1'
    );
  });
    
  it('Should fill up mandatory with default', function () {
    const config = ConfigManager.getInstance('test/yaml/specs.yml').getConfig();
    
    expect(config['TS_SAMPLE_MODULE_01_OPTIONAL_WITH_DEF']).to.not.be.undefined;
  });
  
  it('Should fill up non mandatory with default', function () {
    const config = ConfigManager.getInstance('test/yaml/specs.yml').getConfig();
    expect(config['TS_SAMPLE_MODULE_01_OPTIONAL_NOT_MANDAT_DEF']).to.not.be.undefined;
  });

  it('Should fail validation when mandat and no default', function () {
    const config = ConfigManager.getInstance('test/yaml/specs.yml').getConfig();
    expect(config.ValidateField('TS_SAMPLE_MODULE_01_OPTIONAL_NO_DEF')).to.be.false;
  });
});
