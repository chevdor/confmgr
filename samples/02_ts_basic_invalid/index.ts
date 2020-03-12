import { ConfigManager } from 'confmgr'
import mySpecs from './configSpecs'

const config = ConfigManager.getInstance(mySpecs).getConfig()
const valid = config.Validate()
console.log(`Your config is${valid ? '' : ' NOT'} valid!`)

// Here is our custom logger...
function MyLogger(...args): void {
	const s = args.join(' ')
	console.log(`▶ ${s.replace('\n', '\n▶')}`)
}

config.Print({ color: true, logger: MyLogger })
