import { ConfigManager } from 'confmgr'
import mySpecs from './configSpecs'

const config = ConfigManager.getInstance(mySpecs).getConfig()
const valid = config.Validate()
console.log(`Your config is${valid ? '' : ' NOT'} valid!`)

config.Print({ color: true, compact: false })
