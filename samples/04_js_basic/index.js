const ConfigManager = require('confmgr').ConfigManager
const mySpecs = require('./configSpecs').default

const config = ConfigManager.getInstance(mySpecs).getConfig()
const valid = config.Validate()
console.log(`Your config is${valid ? '' : ' NOT'} valid!`)

config.Print({ logger: console.log })
