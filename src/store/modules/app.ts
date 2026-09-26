import { defineStore } from 'pinia'
import { ITheme } from '@/store/theme/interface'
import cache from '@/utils/cache'
import { useDictTypeAllApi } from '@/api/sys/dict'

export const useAppStore = defineStore('appStore', {
	state: () => ({
		// sidebar Whether expanded
		sidebarOpened: cache.getSidebarOpened(),
		// Internationalization
		language: cache.getLanguage(),
		// Component size
		componentSize: cache.getComponentSize(),
		// Dictionary list
		dictList: [],
		// Topic
		theme: cache.getTheme()
	}),
	actions: {
		setSidebarOpened() {
			this.sidebarOpened = !this.sidebarOpened
			cache.setSidebarOpened(this.sidebarOpened)
		},
		setSidebarStatus(status: boolean) {
			this.sidebarOpened = status
			cache.setSidebarOpened(this.sidebarOpened)
		},
		setLanguage(locale: string) {
			this.language = locale
			cache.setLanguage(locale)
		},
		setComponentSize(size: string) {
			this.componentSize = size
			cache.setComponentSize(size)
		},
		async getDictListAction() {
			const { data } = await useDictTypeAllApi()
			this.dictList = data || []
		},
		setTheme(theme: ITheme) {
			this.theme = theme
			cache.setTheme(theme)
		}
	}
})
