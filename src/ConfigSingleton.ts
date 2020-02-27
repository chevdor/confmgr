import process = require('process');
import dotenv from 'dotenv';
import * as path from 'path';
import { ConfigSpecs, ConfigDictionnaryRaw, ConfigDictionnarySimple, ConfigItem } from './types';

function clone(object: any): any {
  return JSON.parse(JSON.stringify(object));
}

export class ConfigSingleton {
  private static instance: ConfigSingleton;

  private specs: ConfigSpecs;

  private constructor(specs: ConfigSpecs) {
    if (!specs) throw new Error('Missing specs in ctor');
    this.specs = specs;
    this.refresh();
  }

  public static getInstance(specs?: ConfigSpecs): ConfigSingleton {
    if (!this.instance && !specs) {
      throw new Error('Missing specs');
    }
    if (!this.instance && specs) {
      this.instance = new ConfigSingleton(specs);
    }

    return this.instance;
  }

  public getConfig(): ConfigDictionnarySimple {
    // here we clone the config specs so we dont lose the specs
    const confClone: any = clone(this.specs.config); //process.env;

    Object.entries(confClone).map(([key, _val]) => {
      confClone[key] = process.env[key];
    });

    // Hook up functions
    ['Validate', 'DumpEnv'].map((f: string) => {
      confClone[f] = this[f].bind(this);
    });

    return confClone;
  }

  public getSpecs(): ConfigDictionnaryRaw {
    return this.specs.config;
  }

  private static getEnvFile(): string {
    const profile = process.env.NODE_ENV || 'production';
    // console.log('NODE_ENV profile: ', profile);
    const envfile =
      profile == 'production'
        ? path.resolve(process.cwd(), '.env')
        : path.resolve(process.cwd(), '.env.' + profile.toLowerCase());
    return envfile;
  }

  /** You likely will never have to use this function which
   * is mostly use for the tests. If you don't know, do NOT call
   * this function, it would take time and likely do nothing
   * interesting for you.
   */
  public refresh(): void {
    const envfile = ConfigSingleton.getEnvFile();
    // console.log('ENV file:', envfile);
    dotenv.config({ path: envfile });
    // const ENV = process.env;

    // console.log(ENV);
    // this.filteredEnv = Object.entries(process.env).filter(([key, val]) => {
    //   return key.startsWith('SAMPLE');
    // });
    // ConfigSingleton.instance = new ConfigSingleton(this.specs)
  }

  // assert((ConfigSingleton.instance.polkadot.nodeName || '').length > 0, "The extracted config does not look OK")
  // }

  /** Calling this function will get an instance of the Config and attach it
   * to the global scope.
   */
  public static loadToGlobal(): void {
    global['Config'] = ConfigSingleton.getInstance().getConfig();
  }

  /** Validate the config and return wheather it is valid or not */
  public Validate(): boolean {
    let result = true;
    const configSpecs = this.getSpecs();
    Object.entries(configSpecs).map(([_key, env]: [string, ConfigItem]) => {
      if (env && env.options) {
        const value = process.env[env.name] || '';
        if (env.options.regexp != undefined) {
          const regex = RegExp(env.options.regexp);
          const testResult = regex.test(value);
          result = result && testResult;
        }
        result = result && (!env.options.mandatory || (env.options.mandatory && value.length > 0));
      }
    });
    return result;
  }

  /** Show the ENV variables this application cares about */
  // public static getSupportedEnv(): ConfigSpecs {
  //   return ConfigSingleton.g;
  // }

  /**
   * Display the current ENV to ensure everything that is used matches
   * the expectations.
   */
  public DumpEnv(logger: (...args) => void): void {
    const container = `${this.specs.container.prefix}_${this.specs.container.module}`;
    logger(`===> ${container} ENV:`);
    Object.entries(this.specs.config).map(([_key, env]) => {
      logger(
        `- ${env.name.replace(container + '_', '')}: ${env.description}\n${
          env.options && env.options.regexp ? '    regexp: ' + env.options.regexp + '\n' : ''
        }    value: ${
          env.options && env.options.masked
            ? process.env[env.name]
              ? '*****'
              : 'empty'
            : process.env[env.name]
        }`
      );
    });

    logger('========================================');
  }
}
