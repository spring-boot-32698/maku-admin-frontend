import { useTabsStore } from '@/store/modules/tabs'

// Close tab
export const closeTab = (router: any, tab: any) => {
	const tabsStore = useTabsStore()
	if (tab.meta && tab.meta.affix) {
		return
	}

	tabsStore.delView(tab)
	toLastView(router, tabsStore.visitedViews, tab)
}

// Close other tabs
export const closeOthersTabs = (router: any, tab: any) => {
	const tabsStore = useTabsStore()

	router.push(tab)
	tabsStore.delOthersViews(tab)
}

// Close all tabs
export const closeAllTabs = (router: any, tab: any) => {
	const tabsStore = useTabsStore()

	tabsStore.delAllViews()
	toLastView(router, tabsStore.visitedViews, tab)
}

// Jump to the last tab
export const toLastView = (router: any, visitedViews: any[], view: any) => {
	const latestView = visitedViews.slice(-1)[0]
	if (latestView) {
		router.push(latestView.fullPath)
	} else {
		if (view.name === 'Home') {
			router.replace({ path: '/redirect' + view.fullPath })
		} else {
			router.push('/')
		}
	}
}
