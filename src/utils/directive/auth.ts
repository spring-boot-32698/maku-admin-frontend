import type { App } from 'vue'
import { useUserStore } from '@/store/modules/user'

export function auth(app: App) {
	// Permission verification
	app.directive('auth', {
		mounted(el, binding) {
			const userStore = useUserStore()

			if (!userStore.authorityList.some((v: string) => v === binding.value)) {
				el.parentNode.removeChild(el)
			}
		}
	})
}
