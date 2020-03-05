/**
 * We don't want to have ENV from other tests polluting our tests.
 */
export function clearEnv(): void {
	Object.keys(process.env).map(env => {
		if (env.startsWith('SAMPLE')) delete process.env[env]
	})
}

export const param1 = '72'
export const param2 = 'r=3.14'
export const secret = 'password123'
export const regexp = '12_34'

/**
 * Here we set some ENV for testing.
 */
export function loadDefaultEnv(): void {
	process.env.SAMPLE_MODULE_PARAM1 = param1
	process.env.SAMPLE_MODULE_PARAM2 = param2
	process.env.SAMPLE_MODULE_SECRET = secret
	process.env.SAMPLE_MODULE_REGEXP = regexp
}
