import { ConfigSingleton } from '../src/ConfigSingleton';
import { expect } from 'chai';
import specs from './config-specs';

const param1 = '42';
const param2 = 'r=3.14';
const secret = 'password123';
const regexp = '12_34';

// Here we set some ENV for testing
function loadDefaultEnv() {
  process.env.SAMPLE_MODULE_PARAM1 = param1;
  process.env.SAMPLE_MODULE_PARAM2 = param2;
  process.env.SAMPLE_MODULE_SECRET = secret;
  process.env.SAMPLE_MODULE_REGEXP = regexp;
}

describe('ConfigSingleton', () => {
  beforeEach(function() {
    loadDefaultEnv();
  });

  it('Should fail the first call without config specs', function() {
    expect(() => ConfigSingleton.getInstance()).to.throw(/missing/i);
  });

  it('Should pass the second call with config specs', function() {
    expect(() => ConfigSingleton.getInstance(specs)).to.not.throw();
    expect(() => ConfigSingleton.getInstance(specs)).to.not.throw();
  });

  it('Should pass the second call without config specs', function() {
    expect(() => ConfigSingleton.getInstance(specs)).to.not.throw();
    expect(() => ConfigSingleton.getInstance()).to.not.throw();
  });

  it('Should properly fetch params', function() {
    const config = ConfigSingleton.getInstance(specs).getConfig();
    // console.log(JSON.stringify(config, null, 2));
    expect(config['SAMPLE_MODULE_PARAM1']).to.equal(param1);
    expect(config['SAMPLE_MODULE_PARAM2']).to.equal(param2);
    expect(config['SAMPLE_MODULE_SECRET']).to.equal(secret);
    expect(config['SAMPLE_MODULE_REGEXP']).to.equal(regexp);
    expect(() => ConfigSingleton.getInstance()).to.not.throw();
  });

  it('Should properly fetch config specs', function() {
    const configSpecs = ConfigSingleton.getInstance(specs).getSpecs();
    // console.log('configSpecs', JSON.stringify(configSpecs, null, 2));
    expect(configSpecs['SAMPLE_MODULE_PARAM1'].description).to.have.length.above(3);

    // expect(() => ConfigSingleton.getInstance()).to.not.throw();
  });

  it('Should return clean config', function() {
    const config = ConfigSingleton.getInstance(specs).getConfig();
    // console.log(JSON.stringify(config, null, 2));
    expect(config['SAMPLE_MODULE_PARAM1']).to.equal(param1);
    expect(config['SAMPLE_MODULE_PARAM2']).to.equal(param2);
    expect(config['SAMPLE_MODULE_SECRET']).to.equal(secret);
    expect(config['SAMPLE_MODULE_REGEXP']).to.equal(regexp);
    expect(() => ConfigSingleton.getInstance()).to.not.throw();
  });

  it('Should fail regexp validation', function() {
    process.env.SAMPLE_MODULE_REGEXP = '123_45';
    const configSpecs = ConfigSingleton.getInstance(specs).getSpecs();
    // console.log('specs', configSpecs);
    const config = ConfigSingleton.getInstance(specs).getConfig();
    // console.log('config', config);

    const res = ConfigSingleton.getInstance().Validate();
    expect(res).to.be.false;
  });

  it('Should fail is a mandatory field is missing', function() {
    delete process.env.SAMPLE_MODULE_MANDAT1; // just in case
    const res = ConfigSingleton.getInstance(specs).Validate();
    expect(res).to.be.false;
  });

  it('Should not fail is a non mandatory field is missing', function() {
    delete process.env.SAMPLE_MODULE_PARAM2;
    const config = ConfigSingleton.getInstance(specs);
    const res = config.Validate();
    expect(res).to.be.false;
  });
});
