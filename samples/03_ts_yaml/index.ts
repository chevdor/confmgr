import { ConfigManager } from 'confmgr'

const config = ConfigManager.getInstance('configSpecs.yml').getConfig()
const valid = config.Validate()
console.log(`Your config is${valid ? '' : ' NOT'} valid!`)

config.Print({ compact: true })

console.log('\nYour default config looks like:')
console.log(config.GenEnv().join('\n'))

console.log('\nHere are some values:')
console.log(` - PARAM1=${config.Get('MODULE_01', 'PARAM1')}`)
console.log(` - BOOL1=${config.Get('MODULE_01', 'BOOL1')}`)
console.log(` - BOOL2=${config.Get('MODULE_01', 'BOOL2')}`)
