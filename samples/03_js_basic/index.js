const ConfigManager = require('envconfman');
const mySpecs = require('./configSpecs');
// console.log('My specs:', JSON.stringify( mySpecs, null, 2));

const config = ConfigManager.getInstance(mySpecs).getConfig();
const valid = config.Validate();
console.log(`Your config is${valid ? '' : ' NOT'} valid!`);

// WARNING!
// You should NOT display your config, especially in your logs, 
// it may contain some secrets!
// console.log('My Config:', JSON.stringify(config, null, 2));
    
// Instead, ask the ConfigManager to display it.
// It will also look better
// if (valid)
config.DumpEnv(console.log);
// else
//   console.log('Your .env is not valid');