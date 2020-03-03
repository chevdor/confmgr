import * as process from 'process';
import dotenv from 'dotenv';
import * as path from 'path';
import { ConfigSpecs, ConfigDictionnaryRaw, ConfigDictionnarySimple, ConfigItem, ConfigItemOptions } from './types';
import chalk from 'chalk';
import YAML from 'yaml';
import fs from 'fs';
import { SpecsFactory } from './SpecsFactory';

function clone(object: unknown): unknown {
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

  public static loadSpecsFromYaml(file: string): ConfigSpecs {
    const configFile = fs.readFileSync(file, 'utf8');
    const yaml = YAML.parse(configFile);
    
    try {
      const prefix = Object.keys(yaml)[0];
      const module = Object.keys(yaml[prefix])[0];
      const factory = new SpecsFactory({ prefix, module });
      
      Object.keys(yaml[prefix][module]).map((key: string) => {
        const shortKey = key.replace(`${prefix}_${module}_`, '');
        const description: string = yaml[prefix][module][shortKey].description;
        const opt: ConfigItem = yaml[prefix][module][shortKey];
        delete opt.description;
        const options: ConfigItemOptions = opt as ConfigItemOptions;
        factory.appendSpec(factory.getSpec(shortKey, description, options));
      });
      
      return factory.getSpecs();
      
    } catch (e){
      console.log('Error parsing YAML', e);
    }
    return null;
  }

  public static getInstance(specs?: ConfigSpecs | string): ConfigManager {
    if (!this.instance && !specs) {
      throw new Error('Missing specs');
    }
    if (!this.instance && specs) {
      if (typeof (specs) === 'string') {
        this.instance = new ConfigManager(ConfigManager.loadSpecsFromYaml(specs));
      } else {
        this.instance = new ConfigManager(specs);
      }
    }

    return this.instance;
  }

  public getConfig(): ConfigDictionnarySimple {
    // here we clone the config specs so we dont lose the specs
    const confClone = clone(this.specs.config); //process.env;

    Object.entries(confClone).map(([key, _val]) => {
      confClone[key] = process.env[key];
    });

    // Hook up functions
    ['Validate', 'Print', 'ValidateField'].map((f: string) => {
      confClone[f] = this[f].bind(this);
    });

    return confClone;
  }

  public getSpecs(): ConfigDictionnaryRaw {
    return this.specs.config;
  }

  /**
   * This function defines what '.env' file will be loaded.
   * By default, '.env' will be used.
   * However, if you pass NODE_ENV=abc, the loaded file will
   * be .env.abc
   */
  private static getEnvFile(): string {
    const profile = process.env.NODE_ENV || 'production';
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
    dotenv.config({ path: envfile });
  }

  /** Calling this function will get an instance of the Config and attach it
   * to the global scope.
   */
  public static loadToGlobal(): void {
    global['Config'] = ConfigManager.getInstance().getConfig();
  }

  public getFieldSpecs(key: string): ConfigItem {
    const configSpecs = this.getSpecs();
    const res = Object.entries(configSpecs).find(([_key, env]: [string, ConfigItem]) => env.name == key);    
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

  /**
   * Display the current ENV using either the logger you provide or console.log by default.
   */
  public Print(opt: PrintOptions): void {
    const container = `${this.specs.container.prefix}_${this.specs.container.module}`;
    if (!opt) opt = {color: true};
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
