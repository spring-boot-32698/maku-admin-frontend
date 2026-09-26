export interface ITheme {
	// Sidebar style [light, dark]
	sidebarStyle: string
	// Top bar style [light, theme]
	headerStyle: string
	// Theme color
	primaryColor: string
	// Layout style [vertical, columns, transverse]
	layout: string
	// Sidebar exclusive expand(Keep only one submenu expanded)
	uniqueOpened: boolean
	// Enable LOGO
	isLogo: boolean
	// Enable breadcrumbs
	isBreadcrumb: boolean
	// Enable tabs
	isTabsView: boolean
	// Enable tab caching
	isTabsCache: boolean
	// Tab page style [style-1, style-2]
	tabsStyle: string
}
