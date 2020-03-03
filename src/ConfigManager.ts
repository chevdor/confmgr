import * as process from 'process';
import dotenv from 'dotenv';
import * as path from 'path';
import { ConfigSpecs, ConfigDictionnaryRaw, ConfigDictionnarySimple, ConfigItem } from './types';
import chalk from 'chalk';

//@ts-ignore
function clone(object: any): any {
  return JSON.parse(JSON.stringify(object));
}

  type PrintOptions = {
    color?: boolean;
    logger?: (...args) => void;
  }

export class ConfigManager {
  private static instance: ConfigManager;

  private specs: ConfigSpecs;

  private constructor(specs: ConfigSpecs) {
    if (!specs) throw new Error('Missing specs in ctor');
    this.specs = specs;
    this.refresh();
  }

  public static getInstance(specs?: ConfigSpecs): ConfigManager {
    if (!this.instance && !specs) {
      throw new Error('Missing specs');
    }
    if (!this.instance && specs) {
      this.instance = new ConfigManager(specs);
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
    ['Validate', 'Print', 'ValidateField'].map((f: string) => {
      //@ts-ignore
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
    const envfile = ConfigManager.getEnvFile();
    // console.log('ENV file:', envfile);
    dotenv.config({ path: envfile });
    // const ENV = process.env;

    // console.log(ENV);
    // this.filteredEnv = Object.entries(process.env).filter(([key, val]) => {
    //   return key.startsWith('SAMPLE');
    // });
    // ConfigManager.instance = new ConfigManager(this.specs)
  }

  // assert((ConfigManager.instance.polkadot.nodeName || '').length > 0, "The extracted config does not look OK")
  // }

  /** Calling this function will get an instance of the Config and attach it
   * to the global scope.
   */
  // public static loadToGlobal(): void {
  //   global['Config'] = ConfigManager.getInstance().getConfig();
  // }

  public getFieldSpecs(key: string): ConfigItem {
    // console.log('looking for key:', key);
    
    const configSpecs = this.getSpecs();
    const res = Object.entries(configSpecs).find(([_key, env]: [string, ConfigItem]) => env.name == key);
  
    // console.log('res:', res);
    
    return res && res[1] ? res[1] : null ;
  }

  /**
   * This is the actual function performing the validation of a given field according to the spcs
   * @param specs The specs
   */
  private static validaFieldsSpecs(specs: ConfigItem): boolean {
    let result = true;
    if (specs && specs.options) {
      const value = process.env[specs.name] || '';
      if (specs.options.regexp != undefined) {
        const regex = RegExp(specs.options.regexp);
        const testResult = regex.test(value);
        result = result && testResult;
      }
      result = result && (!specs.options.mandatory || (specs.options.mandatory && value.length > 0));
    }
    return result;
  }

  /**
   * Validate a single field.
   * @param key Key of the field
   */
  public ValidateField(key: string): boolean {
    const fieldSpecs = this.getFieldSpecs(key);
    return ConfigManager.validaFieldsSpecs(fieldSpecs);
  }

  /** Validate the config and return wheather it is valid or not */
  public Validate(): boolean {
    let result = true;
    const configSpecs = this.getSpecs();
    Object.entries(configSpecs).map(([_key, env]: [string, ConfigItem]) => {
      result = result = ConfigManager.validaFieldsSpecs(env);
    });
    return result;
  }

  /** Show the ENV variables this application cares about */
  // public static getSupportedEnv(): ConfigSpecs {
  //   return ConfigManager.g;
  // }



  /**
   * Display the current ENV using either the logger you provide or console.log by default.
   */
  public Print(opt: PrintOptions): void {
    const container = `${this.specs.container.prefix}_${this.specs.container.module}`;
    if (!opt.logger) opt.logger = console.log;
    
    if (opt.color)
      opt.logger(chalk.blue(`===> ${container} ENV:`));
    else
      opt.logger(`===> ${container} ENV:`);

    Object.entries(this.specs.config).map(([_key, env]) => {
      const valid = ConfigManager.validaFieldsSpecs(env);
      if (opt.color)
        opt.logger(
          chalk[valid?'green':'red'](`${valid?'✅':'❌'} ${env.name.replace(container + '_', '')}: ` + chalk.grey(`${env.description}`)
          +chalk[valid?'white':'red'](`\n${
            env.options && env.options.regexp ? '    regexp: ' + env.options.regexp + '\n' : ''
          }    value: ${
            env.options && env.options.masked
              ? process.env[env.name]
                ? '*****'
                : 'empty'
              : process.env[env.name]
          }`)
          ));
      else
        opt.logger(
          `${valid?'✅':'❌'} ${env.name.replace(container + '_', '')}: ${env.description}` +`\n${
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

    opt.logger('========================================');
  }
}
