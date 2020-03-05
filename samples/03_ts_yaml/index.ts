import { ConfigManager } from 'confmgr'

const config = ConfigManager.getInstance('configSpecs.yml').getConfig()
const valid = config.Validate()
console.log(`Your config is${valid ? '' : ' NOT'} valid!`)

config.Print()
