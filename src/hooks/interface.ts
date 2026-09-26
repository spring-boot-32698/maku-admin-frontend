export interface IHooksOptions {
	// Whether to call the data list API when the page is created
	createdIsNeed?: boolean
	// Data list Url
	dataListUrl?: string
	// Whether pagination is needed
	isPage?: boolean
	// Delete Url
	deleteUrl?: string
	// Primary key, used in delete scenarios
	primaryKey?: string
	// Export Url
	exportUrl?: string
	// Query conditions
	queryForm?: any
	// Data list
	dataList?: any[]
	// Sort field
	order?: string
	// Whether ascending
	asc?: boolean
	// Current page number
	page?: number
	// Items per page
	limit?: number
	// Total number of items
	total?: number
	pageSizes?: any[]
	// Data list, loading state
	dataListLoading?: boolean
	// Data list, multiple selection
	dataListSelections?: any[]
	dataListSelectionKeys?: any[]
}
