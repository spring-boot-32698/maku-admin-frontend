import axios, { AxiosResponse } from 'axios'
import qs from 'qs'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/modules/user'
import cache from '@/utils/cache'
import { ElMessageBox } from 'element-plus/es'

// axiosInstance
const service = axios.create({
	baseURL: import.meta.env.VITE_API_URL as any,
	timeout: 60000,
	headers: { 'Content-Type': 'application/json;charset=UTF-8' }
})

// Request interceptor
service.interceptors.request.use(
	(config: any) => {
		const userStore = useUserStore()

		if (userStore?.token) {
			config.headers.Authorization = userStore.token
		}

		config.headers['Accept-Language'] = cache.getLanguage()

		// Append a timestamp to prevent caching of GET requests
		if (config.method?.toUpperCase() === 'GET') {
			config.params = { ...config.params, t: new Date().getTime() }
		}

		if (Object.values(config.headers).includes('application/x-www-form-urlencoded')) {
			config.data = qs.stringify(config.data)
		}

		return config
	},
	error => {
		return Promise.reject(error)
	}
)

// Whether to refresh
let isRefreshToken = false
// Retry request
let requests: any[] = []

// Refresh token
const getRefreshToken = (refreshToken: string) => {
	return service.post('/sys/auth/token?refreshToken=' + refreshToken)
}

// Response interceptor
service.interceptors.response.use(
	async (response: AxiosResponse<any>) => {
		const userStore = useUserStore()

		if (response.status !== 200) {
			return Promise.reject(new Error(response.statusText || 'Error'))
		}

		const res = response.data
		if (Object.prototype.toString.call(res) === '[object Blob]') {
			return response
		}

		// Response succeeded
		if (res.code === 0) {
			return res
		}

		// refreshTokenInvalid, redirect to the login page
		if (res.code === 400) {
			return handleAuthorized()
		}

		// No permission, e.g.: not logged in, token expired
		if (res.code === 401) {
			const config = response.config
			if (!isRefreshToken) {
				isRefreshToken = true

				// refreshToken does not exist, log in again
				const refreshToken = cache.getRefreshToken()
				if (!refreshToken) {
					return handleAuthorized()
				}

				try {
					const { data } = await getRefreshToken(refreshToken)
					// Set the new token
					userStore.setToken(data.access_token)
					config.headers!.Authorization = data.access_token
					requests.forEach((cb: any) => {
						cb()
					})
					requests = []
					return service(config)
				} catch (e) {
					// Refresh failed
					requests.forEach((cb: any) => {
						cb()
					})
					return handleAuthorized()
				} finally {
					requests = []
					isRefreshToken = false
				}
			} else {
				// Case of multiple requests
				return new Promise(resolve => {
					requests.push(() => {
						config.headers!.Authorization = userStore.token
						resolve(service(config))
					})
				})
			}
		}

		// Error prompt
		ElMessage.error(res.msg)

		return Promise.reject(new Error(res.msg || 'Error'))
	},
	error => {
		ElMessage.error(error.message)
		return Promise.reject(error)
	}
)

const handleAuthorized = () => {
	ElMessageBox.confirm('Login timed out, please log in again', 'Tip', {
		showCancelButton: false,
		closeOnClickModal: false,
		showClose: false,
		confirmButtonText: 'Log in again',
		type: 'warning'
	}).then(() => {
		const userStore = useUserStore()

		userStore?.setToken('')
		userStore?.setRefreshToken('')
		location.reload()

		return Promise.reject('Login timed out, please log in again')
	})
}

// Export the axios instance
export default service
