import { ConfigManager } from '../../src/ConfigManager';
import { expect } from 'chai';
import path from 'path';
import { clearEnv } from '../helpers';

/**
 * Check that the ConfigManager handles conversions properly
 */
export function loadDefaultEnvForTypes(): void {
  process.env.SAMPLE_MODULE_STRING2 = '42';
  process.env.SAMPLE_MODULE_NUMBER2 = '3.14';
  process.env.SAMPLE_MODULE_OBJECT2 = '{"name": "bar", "age": 43}';
  process.env.SAMPLE_MODULE_BOOL2 = 'true';
  process.env.SAMPLE_MODULE_BOOL3 = 'TRUE';
  process.env.SAMPLE_MODULE_ARRAY2 = '[1,2,3]';
  process.env.SAMPLE_MODULE_ARRAY3 = '["a","b","c"]';
}

describe('Types', () => {
  beforeEach(function () {
    ConfigManager.clearInstance();
    clearEnv();
    loadDefaultEnvForTypes();
  });

  it('Should load Yaml config and env locally', function () {
    const config = ConfigManager.getInstance(path.join(__dirname, 'specs.yml')).getConfig();
    expect(config).to.includes.keys(
      'SAMPLE_MODULE_STRING1',
      'SAMPLE_MODULE_NUMBER1',
      'SAMPLE_MODULE_BOOL1',
      'SAMPLE_MODULE_ARRAY1',
    );
  });

  it('Should handle default strings properly', function () {
    const config = ConfigManager.getInstance(path.join(__dirname, 'specs.yml')).getConfig();
    expect(config['SAMPLE_MODULE_STRING1']).to.be.a('string');
  });

  it('Should handle default number properly', function () {
    const config = ConfigManager.getInstance(path.join(__dirname, 'specs.yml')).getConfig();
    expect(config['SAMPLE_MODULE_NUMBER1']).to.be.a('number');
  });

  it('Should handle default number properly', function () {
    const config = ConfigManager.getInstance(path.join(__dirname, 'specs.yml')).getConfig();
    expect(config['SAMPLE_MODULE_BOOL1']).to.be.a('boolean');
  });

  it('Should handle default object properly', function () {
    const config = ConfigManager.getInstance(path.join(__dirname, 'specs.yml')).getConfig();
    expect(config['SAMPLE_MODULE_OBJECT1']).to.be.a('object');
  });

  it('Should handle default array properly', function () {
    const config = ConfigManager.getInstance(path.join(__dirname, 'specs.yml')).getConfig();
    expect(config['SAMPLE_MODULE_ARRAY1']).to.be.a('array');
  });

  it('Should contain the value default values', function () {
    const config = ConfigManager.getInstance(path.join(__dirname, 'specs.yml')).getConfig();
    expect(config.Validate()).to.be.true;
  });

  it('Should convert srings', function () {
    const config = ConfigManager.getInstance(path.join(__dirname, 'specs.yml')).getConfig();
    expect(config['SAMPLE_MODULE_STRING2']).to.be.a('string');
  });

  it('Should convert number', function () {
    const config = ConfigManager.getInstance(path.join(__dirname, 'specs.yml')).getConfig();
    expect(config['SAMPLE_MODULE_NUMBER2']).to.be.a('number');
  });

  it('Should convert boolean - case 1', function () {
    const config = ConfigManager.getInstance(path.join(__dirname, 'specs.yml')).getConfig();
    expect(config['SAMPLE_MODULE_BOOL2']).to.be.a('boolean');
  });

  it('Should convert boolean - case 2', function () {
    const config = ConfigManager.getInstance(path.join(__dirname, 'specs.yml')).getConfig();
    expect(config['SAMPLE_MODULE_BOOL3']).to.be.a('boolean');
  });

  it('Should convert array - case 1', function () {
    const config = ConfigManager.getInstance(path.join(__dirname, 'specs.yml')).getConfig();
    expect(config['SAMPLE_MODULE_ARRAY2']).to.be.a('array');
  });

  it('Should convert array - case 2', function () {
    const config = ConfigManager.getInstance(path.join(__dirname, 'specs.yml')).getConfig();
    expect(config['SAMPLE_MODULE_ARRAY3']).to.be.a('array');
  });

  it('Should convert object - case 1', function () {
    const config = ConfigManager.getInstance(path.join(__dirname, 'specs.yml')).getConfig();
    const item = config['SAMPLE_MODULE_OBJECT2']; 
    expect(item).to.be.a('object');
    expect(item.name).to.equal('bar');
    expect(item.age).to.equal(43);

  });

  it('Should throw an exception on unsupported types', function () {
    const yml = path.join(__dirname, 'specs-error.yml');
    expect(() => ConfigManager.getInstance(yml).getConfig()).to.throw(/not supported: foobar/i);
  });
});
