<template>
	<el-sub-menu v-if="menu.children.length > 0" :key="menu.path" :index="menu.path">
		<template #title>
			<ma-icon v-if="showIcon" :icon="menu.meta.icon"></ma-icon>
			<span>{{ menu.meta.title }}</span>
		</template>
		<menu-item v-for="sub in menu.children" :key="sub.path" :menu="sub"></menu-item>
	</el-sub-menu>
	<el-menu-item v-else :key="menu.path" :index="menuIndex(menu)" @click="handleClickMenu(menu)">
		<ma-icon v-if="showIcon" :icon="menu.meta.icon"></ma-icon>
		<template #title>
			{{ menu.meta.title }}
		</template>
	</el-menu-item>
</template>

<script setup lang="ts">
import { computed, PropType } from 'vue'
import { useRouter } from 'vue-router'
import { isExternalLink, replaceLinkParam } from '@/utils/tool'
import { useAppStore } from '@/store/modules/app'

const appStore = useAppStore()

// Show icon
const showIcon = computed(() => {
	return appStore.theme.layout !== 'columns'
})

defineProps({
	menu: {
		type: Object as PropType<any>,
		required: true
	}
})

const router = useRouter()

const menuIndex = (menu: any) => {
	if (menu.meta && menu.meta.url && menu.meta.url.indexOf('?') > -1 && !isExternalLink(menu.meta.url)) {
		return '/' + menu.meta.url
	}
	return menu.path
}

// Menu click event
const handleClickMenu = (menu: any) => {
	// If it is not a new page, switch the route directly
	if (!menu.meta.newOpen) {
		router.push(menuIndex(menu))
		return
	}

	// New page opening logic
	if (isExternalLink(menu.meta.url)) {
		// External link
		window.open(replaceLinkParam(menu.meta.url), '_blank')
	} else {
		// Internal component
		window.open('#' + menu.meta.url, '_blank')
	}
}
</script>
