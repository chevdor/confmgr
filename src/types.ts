export type ConfigItemOptions = {
  masked?: boolean; // true for tokens, passwords, etc..
  regexp?: RegExp; // validation regexp
  mandatory?: boolean; // Do we explode if this ENV is not defined and there is no default?
  default?: any; // The default if nothing is provided
};

type ConfigValue = any;

export interface ConfigItem {
  name: string; // Name of the envrionment varibale
  description: string; // Description of what the var does
  options?: ConfigItemOptions;
  value?: ConfigValue;
}

// TODO: rename those
export type ConfigDictionnarySimple = {
  [key: string]: ConfigValue;
};

/**
 *
 */
// TODO: rename those
export type ConfigDictionnaryRaw = {
  [key: string]: ConfigItem;
};

// export type CleanConfig = ConfigDictionnary;

export type FullConfig = {
  factoryParams: FactoryCtorInitParams;
  config: ConfigDictionnaryRaw;
};

export type FactoryCtorInitParams = {
  prefix: string;
  module: string;
};

export type ConfigSpecs = {
  container: FactoryCtorInitParams;
  config: ConfigDictionnaryRaw;
};
