import { defineStore } from 'pinia'
import { useAccountLoginApi, useMobileLoginApi, useLogoutApi, useThirdLoginApi } from '@/api/auth'
import { useUserInfoApi } from '@/api/sys/user'
import cache from '@/utils/cache'
import { useAuthorityListApi } from '@/api/sys/menu'

export const useUserStore = defineStore('userStore', {
	state: () => ({
		// User info
		user: {
			id: '',
			superAdmin: 0,
			username: '',
			realName: '',
			gender: 0,
			mobile: '',
			email: '',
			avatar: '',
			signature: '',
			orgName: '',
			postNameList: [],
			createTime: ''
		},
		// Permission list
		authorityList: [],
		// Access token
		token: cache.getToken(),
		// Refresh token
		refreshToken: cache.getRefreshToken()
	}),
	actions: {
		setUser(val: any) {
			this.user = val
		},
		setToken(val: any) {
			this.token = val
			cache.setToken(val)
		},
		setRefreshToken(val: any) {
			this.refreshToken = val
			cache.setRefreshToken(val)
		},
		// Account login
		async accountLoginAction(loginForm: any) {
			const { data } = await useAccountLoginApi(loginForm)
			this.setToken(data.access_token)
			this.setRefreshToken(data.refresh_token)
		},
		// Mobile number login
		async mobileLoginAction(loginForm: any) {
			const { data } = await useMobileLoginApi(loginForm)
			this.setToken(data.access_token)
			this.setRefreshToken(data.refresh_token)
		},
		// Third-party login
		async thirdLoginAction(loginForm: any) {
			const { data } = await useThirdLoginApi(loginForm)
			this.setToken(data.access_token)
			this.setRefreshToken(data.refresh_token)
		},
		// Get user info
		async getUserInfoAction() {
			const { data } = await useUserInfoApi()
			this.setUser(data)
		},
		// Get permissions
		async getAuthorityListAction() {
			const { data } = await useAuthorityListApi()
			this.authorityList = data || []
		},
		// User logout
		async logoutAction() {
			await useLogoutApi()

			// Remove token
			this.setToken(null)
			this.setRefreshToken(null)
		}
	}
})
