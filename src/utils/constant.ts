import appPackage from '../../package.json'

/**
 * Constant
 */
export default {
	// Version number
	version: appPackage.version,

	// Redirect to a page after successful login
	loginPage: '/dashboard/index',

	// APIAddress
	apiUrl: import.meta.env.VITE_API_URL,

	// Third-party login address
	thirdLoginUrl: import.meta.env.VITE_API_URL + '/sys/third/render/',

	// File upload address
	uploadUrl: import.meta.env.VITE_API_URL + '/sys/file/upload',

	// Environment variables
	env: {
		MODE: import.meta.env.MODE,
		PROD: import.meta.env.PROD,
		DEV: import.meta.env.DEV,
		SSR: import.meta.env.SSR
	}
}
