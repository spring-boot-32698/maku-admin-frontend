/**
 * window.localStorage Permanent browser cache
 * @method setItem Set cache
 * @method getItem Get cache
 * @method removeItem Remove cache
 * @method clear Remove all caches
 */
export const Storage = {
	setItem(key: string, value: any) {
		if (value === undefined) {
			return
		}
		window.localStorage.setItem(key, JSON.stringify(value))
	},
	getItem(key: string) {
		let json: any = window.localStorage.getItem(key)
		return JSON.parse(json)
	},
	removeItem(key: string) {
		window.localStorage.removeItem(key)
	},
	clear() {
		window.localStorage.clear()
	}
}

/**
 * window.sessionStorage Temporary browser cache
 * @method setItem Set cache
 * @method getItem Get cache
 * @method removeItem Remove cache
 * @method clear Remove all caches
 */
export const SessionStorage = {
	setItem(key: string, value: any) {
		if (value === undefined) {
			return
		}
		window.sessionStorage.setItem(key, JSON.stringify(value))
	},
	getItem(key: string) {
		let json: any = window.sessionStorage.getItem(key)
		return JSON.parse(json)
	},
	removeItem(key: string) {
		window.sessionStorage.removeItem(key)
	},
	clear() {
		window.sessionStorage.clear()
	}
}
