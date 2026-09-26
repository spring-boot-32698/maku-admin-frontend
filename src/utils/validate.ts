export const isExternalLink = (path: string): boolean => {
	return /^(https?:|mailto:|tel:)/.test(path)
}

export const validateEmail = (rule: any, value: any, callback: (e?: Error) => any) => {
	const reg =
		/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

	if (reg.test(value)) {
		callback()
	} else {
		callback(new Error('Email format is incorrect'))
	}
}

export const validatePassword = (rule: any, value: any, callback: (e?: Error) => any) => {
	if (value.length < 4) {
		callback(new Error('Password cannot be shorter than 4 characters'))
	} else {
		callback()
	}
}

export const mobileRegExp = /^1[3456789]\d{9}$/

export const validateMobile = (rule: any, value: any, callback: (e?: Error) => any) => {
	if (mobileRegExp.test(value)) {
		callback()
	} else {
		callback(new Error('Mobile number format is incorrect'))
	}
}
