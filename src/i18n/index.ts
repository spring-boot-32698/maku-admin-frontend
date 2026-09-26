import { createI18n } from 'vue-i18n'
import cache from '@/utils/cache'

// element-plus Internationalization file
import element_zh_cn from 'element-plus/es/locale/lang/zh-cn'
import element_en from 'element-plus/es/locale/lang/en'

// Framework internationalization file
const zh_cn = import.meta.glob('./lang/**/zh-CN.ts', { eager: true })
const en_us = import.meta.glob('./lang/**/en-US.ts', { eager: true })

// Load the internationalization under the lang folder
export const loadLang = (modules: Record<string, any>) => {
	const messages: { [key: string]: string } = {}

	Object.keys(modules).forEach(module => {
		Object.assign(messages, { ...modules[module].default })
	})
	return messages
}

export const messages: { [key: string]: any } = {
	'zh-CN': {
		langName: 'Simplified Chinese',
		...loadLang(zh_cn),
		el: {
			...element_zh_cn
		}
	},
	'en-US': {
		langName: 'English',
		...loadLang(en_us),
		el: {
			...element_en
		}
	}
}

// Return the current Language
function getLanguage() {
	return cache.getLanguage()
}

export const i18n = createI18n({
	allowComposition: true,
	globalInjection: true,
	legacy: false,
	locale: getLanguage(),
	messages
})
