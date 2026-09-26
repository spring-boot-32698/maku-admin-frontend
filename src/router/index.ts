import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { useAppStore } from '@/store/modules/app'
import { useUserStore } from '@/store/modules/user'
import { useRouterStore } from '@/store/modules/router'
import { isExternalLink, pathToCamel } from '@/utils/tool'
import constant from '@/utils/constant'

NProgress.configure({ showSpinner: false })

const constantRoutes: RouteRecordRaw[] = [
	{
		path: '/redirect',
		component: () => import('../layout/index.vue'),
		children: [
			{
				path: '/redirect/:path(.*)',
				component: () => import('../layout/components/Router/Redirect.vue')
			}
		]
	},
	{
		path: '/iframe/:query?',
		component: () => import('../layout/components/Router/Iframe.vue')
	},
	{
		path: '/login',
		component: () => import('../views/login/index.vue')
	},
	{
		path: '/404',
		component: () => import('../views/404.vue')
	}
]

const asyncRoutes: RouteRecordRaw = {
	path: '/',
	component: () => import('../layout/index.vue'),
	redirect: '/dashboard/index',
	children: [
		{
			path: '/profile',
			name: 'ProfileIndex',
			component: () => import('../views/profile/index.vue'),
			meta: {
				title: 'Personal center',
				cache: true
			}
		}
	]
}

// Configure console menus
export const dashboardMenu = [
	{
		id: 100,
		name: 'Dashboard',
		url: null,
		openStyle: 0,
		icon: 'icon-appstore',
		children: [
			{
				id: 101,
				name: 'Home',
				url: 'dashboard/index',
				openStyle: 0,
				icon: 'icon-home',
				affix: true
			}
		]
	}
]

// Configure constant menus
export const constantMenu = [
	{
		id: 1000,
		name: 'Demo',
		url: null,
		openStyle: 0,
		icon: 'icon-windows',
		children: [
			{
				id: 1001,
				name: 'Icon Icon',
				url: 'demo/icons/index',
				openStyle: 0,
				icon: 'icon-unorderedlist'
			},
			{
				id: 1002,
				name: 'QR code generation',
				url: 'demo/qrcode/index',
				openStyle: 0,
				icon: 'icon-unorderedlist'
			},
			{
				id: 1003,
				name: 'Page printing',
				url: 'demo/printJs/index',
				openStyle: 0,
				icon: 'icon-unorderedlist'
			},
			{
				id: 1004,
				name: 'Image cropping',
				url: 'demo/cropper/index',
				openStyle: 0,
				icon: 'icon-unorderedlist'
			},
			{
				id: 1005,
				name: 'Rich text editor',
				url: 'demo/editor/index',
				openStyle: 0,
				icon: 'icon-unorderedlist'
			},
			{
				id: 1006,
				name: 'Markdown',
				url: 'demo/markdown/index',
				openStyle: 0,
				icon: 'icon-unorderedlist'
			},
			{
				id: 1007,
				name: 'EChartsChart',
				url: 'demo/echarts/index',
				openStyle: 0,
				icon: 'icon-unorderedlist'
			},
			{
				id: 1008,
				name: 'WebSocket',
				url: 'demo/websocket/index',
				openStyle: 0,
				icon: 'icon-unorderedlist'
			}
		]
	}
]

export const errorRoute: RouteRecordRaw = {
	path: '/:pathMatch(.*)',
	redirect: '/404'
}

export const router = createRouter({
	history: createWebHistory(),
	routes: constantRoutes
})

// Whitelist
const whiteList = ['/login']

// Before route navigation
router.beforeEach(async (to, from, next) => {
	NProgress.start()

	const appStore = useAppStore()
	const userStore = useUserStore()
	const routerStore = useRouterStore()

	// tokenCase where it exists
	if (userStore.token) {
		if (to.path === '/login') {
			next(constant.loginPage)
		} else {
			// If the user info does not exist, fetch it again
			if (!userStore.user.id) {
				try {
					await userStore.getUserInfoAction()
					await userStore.getAuthorityListAction()
					await appStore.getDictListAction()
				} catch (error) {
					// If the request fails, redirect to the login page
					userStore?.setToken('')
					next('/login')
					return Promise.reject(error)
				}

				// Dynamic menu+Constant menu
				const menuRoutes = await routerStore.getMenuRoutes()

				// Get flattened routes, converting multi-level routes into single-level routes
				const keepAliveRoutes = getKeepAliveRoutes(menuRoutes, [])

				// Add menu routes
				asyncRoutes.children?.push(...keepAliveRoutes)
				router.addRoute(asyncRoutes)

				// Error route
				router.addRoute(errorRoute)

				// Save route data
				routerStore.setRoutes(constantRoutes.concat(asyncRoutes))

				// Searching menus requires using
				routerStore.setSearchMenu(keepAliveRoutes)

				next({ ...to, replace: true })
			} else {
				next()
			}
		}
	} else {
		// Without a token, whitelisted paths can still be accessed
		if (whiteList.indexOf(to.path) > -1) {
			next()
		} else {
			if (to.fullPath === '/') {
				next('/login')
			} else {
				next(`/login?redirect=${to.fullPath}`)
			}
		}
	}
})

// After route loaded
router.afterEach(() => {
	NProgress.done()
})

// Get flattened routes, converting multi-level routes into single-level routes
export const getKeepAliveRoutes = (rs: RouteRecordRaw[], breadcrumb: string[]): RouteRecordRaw[] => {
	const routerList: RouteRecordRaw[] = []

	rs.forEach((item: any) => {
		if (item.meta.title) {
			breadcrumb.push(item.meta.title)
		}

		if (item.children && item.children.length > 0) {
			routerList.push(...getKeepAliveRoutes(item.children, breadcrumb))
		} else {
			item.meta.breadcrumb.push(...breadcrumb)
			routerList.push(item)
		}

		breadcrumb.pop()
	})
	return routerList
}

// Load vue component
export interface ModuleMap {
	[key: string]: any
}

export const layoutModules = () => {
	return import.meta.glob('/src/views/**/*.vue')
}

// Dynamically get the vue component by path
const getDynamicComponent = (path: string): any => {
	const modules: ModuleMap = layoutModules()
	return modules[`/src/views/${path}.vue`]
}

// Generate route data from the menu list
export const generateRoutes = (menuList: any): RouteRecordRaw[] => {
	const routerList: RouteRecordRaw[] = []

	menuList.forEach((menu: any) => {
		let component
		let path
		let menuUrl = menu.url
		if (menuUrl && menuUrl.indexOf('?') > -1) {
			menuUrl = menuUrl.split('?')[0]
		}

		if (menu.children && menu.children.length > 0) {
			component = () => import('@/layout/index.vue')
			path = '/p/' + menu.id
		} else {
			// Check whether it is an iframe
			if (isIframeUrl(menu)) {
				component = () => import('@/layout/components/Router/Iframe.vue')
				path = '/iframe/' + menu.id
			} else {
				component = getDynamicComponent(menuUrl)
				path = '/' + menuUrl
			}
		}
		const route: RouteRecordRaw = {
			path: path,
			name: pathToCamel(path),
			component: component,
			children: [],
			meta: {
				title: menu.name,
				icon: menu.icon,
				id: '' + menu.id,
				url: menu.url,
				cache: true,
				newOpen: menu.openStyle === 1,
				affix: menu.affix,
				breadcrumb: []
			}
		}

		// Case with child menus
		if (menu.children && menu.children.length > 0) {
			route.children?.push(...generateRoutes(menu.children))
		}

		routerList.push(route)
	})

	return routerList
}

// Check whether it is an iframe
const isIframeUrl = (menu: any): boolean => {
	// If opened as a new page, do not use an iframe
	if (menu.openStyle === 1) {
		return false
	}

	// Whether external link
	return isExternalLink(menu.url)
}
