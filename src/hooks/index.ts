import { IHooksOptions } from '@/hooks/interface'
import service from '@/utils/request'
import { onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import qs from 'qs'

export const useCrud = (options: IHooksOptions) => {
	const defaultOptions: IHooksOptions = {
		createdIsNeed: true,
		dataListUrl: '',
		isPage: true,
		deleteUrl: '',
		primaryKey: 'id',
		exportUrl: '',
		queryForm: {},
		dataList: [],
		order: '',
		asc: false,
		page: 1,
		limit: 10,
		total: 0,
		pageSizes: [10, 20, 50, 100, 200, 500, 1000],
		dataListLoading: false,
		dataListSelections: [],
		dataListSelectionKeys: []
	}

	const mergeDefaultOptions = (options: any, props: any): IHooksOptions => {
		for (const key in options) {
			if (!Object.getOwnPropertyDescriptor(props, key)) {
				props[key] = options[key]
			}
		}
		return props
	}

	// Override the default value
	const state = mergeDefaultOptions(defaultOptions, options)

	onMounted(() => {
		if (state.createdIsNeed) {
			query()
		}
	})

	const query = () => {
		if (!state.dataListUrl) {
			return
		}

		state.dataListLoading = true

		service
			.get(state.dataListUrl, {
				params: {
					order: state.order,
					asc: state.asc,
					page: state.isPage ? state.page : null,
					limit: state.isPage ? state.limit : null,
					...state.queryForm
				},
				paramsSerializer: params => {
					return qs.stringify(params)
				}
			})
			.then((res: any) => {
				state.dataList = state.isPage ? res.data.list : res.data
				state.total = state.isPage ? res.data.total : 0
			})
			.finally(() => {
				state.dataListLoading = false
			})
	}

	const getDataList = () => {
		state.page = 1
		query()
	}

	const sizeChangeHandle = (val: number) => {
		state.page = 1
		state.limit = val
		query()
	}

	const currentChangeHandle = (val: number) => {
		state.page = val
		query()
	}

	// Multiple choice
	const selectionChangeHandle = (selections: any[]) => {
		state.dataListSelections = selections
		state.dataListSelectionKeys = selections.map((item: any) => state.primaryKey && item[state.primaryKey])
	}

	// Single choice value
	const singleSelectionHandle = () => {
		const selectionKeys = state.dataListSelectionKeys ? state.dataListSelectionKeys : []

		if (selectionKeys.length === 0) {
			ElMessage.warning('Please select a record')
			return
		}

		if (selectionKeys.length > 1) {
			ElMessage.warning('Only one record can be selected')
			return
		}

		return selectionKeys[0]
	}

	// Sort
	const sortChangeHandle = (data: any) => {
		const { prop, order } = data

		if (prop && order) {
			state.order = prop
			state.asc = order === 'ascending'
		} else {
			state.order = ''
		}

		query()
	}

	const deleteHandle = (key: number | string) => {
		if (!state.deleteUrl) {
			return
		}

		ElMessageBox.confirm('Are you sure you want to delete?', 'Tip', {
			confirmButtonText: 'OK',
			cancelButtonText: 'Cancel',
			type: 'warning'
		})
			.then(() => {
				service.delete(state.deleteUrl + '/' + key).then(() => {
					ElMessage.success('Deleted successfully')

					query()
				})
			})
			.catch(() => {})
	}

	const deleteBatchHandle = (key?: number | string) => {
		let data: any[] = []
		if (key) {
			data = [key]
		} else {
			data = state.dataListSelectionKeys ? state.dataListSelectionKeys : []

			if (data.length === 0) {
				ElMessage.warning('Please select records to delete')
				return
			}
		}

		ElMessageBox.confirm('Are you sure you want to delete?', 'Tip', {
			confirmButtonText: 'OK',
			cancelButtonText: 'Cancel',
			type: 'warning'
		})
			.then(() => {
				if (state.deleteUrl) {
					service.delete(state.deleteUrl, { data }).then(() => {
						ElMessage.success('Deleted successfully')

						query()
					})
				}
			})
			.catch(() => {})
	}

	const downloadHandle = async (url: string, filename?: string, method: string = 'GET'): Promise<any> => {
		try {
			const res = await service({
				responseType: 'blob',
				url: url,
				method: method
			})
			// Create an a tag
			const down = document.createElement('a')

			// If no file name is passed, use a timestamp
			if (filename) {
				down.download = filename
			} else {
				const downName = res.headers['content-disposition'].split('=')[1]
				down.download = decodeURI(downName)
			}

			// Hide the a tag
			down.style.display = 'none'

			// Create download url
			down.href = URL.createObjectURL(
				new Blob([res.data], {
					type: res.data.type
				})
			)

			// Simulate click to download
			document.body.appendChild(down)
			down.click()

			// Release URL
			URL.revokeObjectURL(down.href)
			// Remove after download completes
			document.body.removeChild(down)
		} catch (err: any) {
			ElMessage.error(err.message)
		}
	}

	const reset = (queryRef: any) => {
		queryRef.resetFields()

		getDataList()
	}

	return {
		getDataList,
		sizeChangeHandle,
		currentChangeHandle,
		selectionChangeHandle,
		singleSelectionHandle,
		sortChangeHandle,
		deleteHandle,
		deleteBatchHandle,
		downloadHandle,
		reset
	}
}
