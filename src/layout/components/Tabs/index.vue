<template>
	<div class="tabs-container">
		<div class="tabs-item">
			<el-tabs v-model="activeTabName" :class="tabsStyleClass" @tab-click="tabClick" @tab-remove="tabRemove">
				<el-tab-pane v-for="tab in tabsStore.visitedViews" :key="tab" :label="tab.title" :name="tab.fullPath" :closable="!isAffix(tab)">
					<template #label>
						<el-dropdown
							:id="tab.fullPath"
							ref="dropdownRef"
							trigger="contextmenu"
							placement="bottom-end"
							@visible-change="handleChange($event, tab)"
							@command="onClose"
						>
							<span>{{ tab.title }}</span>
							<template #dropdown>
								<el-dropdown-menu>
									<el-dropdown-item :icon="Close" command="close">{{ $t('app.close') }}</el-dropdown-item>
									<el-dropdown-item :icon="CircleClose" command="closeOthers">{{ $t('app.closeOthers') }}</el-dropdown-item>
									<el-dropdown-item :icon="CircleCloseFilled" command="closeAll">{{ $t('app.closeAll') }}</el-dropdown-item>
								</el-dropdown-menu>
							</template>
						</el-dropdown>
					</template>
				</el-tab-pane>
			</el-tabs>
		</div>
		<el-dropdown class="tabs-action" trigger="click" placement="bottom-end" @command="onClose">
			<template #dropdown>
				<el-dropdown-menu>
					<el-dropdown-item :icon="Close" command="close">{{ $t('app.close') }}</el-dropdown-item>
					<el-dropdown-item :icon="CircleClose" command="closeOthers">{{ $t('app.closeOthers') }}</el-dropdown-item>
					<el-dropdown-item :icon="CircleCloseFilled" command="closeAll">{{ $t('app.closeAll') }}</el-dropdown-item>
				</el-dropdown-menu>
			</template>
			<el-icon><arrow-down /></el-icon>
		</el-dropdown>
	</div>
</template>

<script setup lang="ts">
import { watch, onMounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { closeAllTabs, closeOthersTabs, closeTab } from '@/utils/tabs'
import { ArrowDown, Close, CircleClose, CircleCloseFilled } from '@element-plus/icons-vue'
import { useAppStore } from '@/store/modules/app'
import { useRouterStore } from '@/store/modules/router'
import { useTabsStore } from '@/store/modules/tabs'

const appStore = useAppStore()
const routerStore = useRouterStore()
const tabsStore = useTabsStore()
const route = useRoute()
const router = useRouter()

const activeTabName = ref(route.fullPath)
const tabsStyleClass = computed(() => 'tabs-item-' + appStore.theme.tabsStyle)

// Whether pinned
const isAffix = (tab: any) => {
	return tab.meta && tab.meta.affix
}

watch(route, () => {
	// Current route, add it to tabs
	if (route.name) {
		addTab()
	}
})

onMounted(() => {
	// Initialize
	initTabs()
	addTab()
})

// Initialize pinned tabs
const initTabs = () => {
	const affixTabs = getAffixTabs(routerStore.routes)
	for (const tab of affixTabs) {
		// A tab name is required
		if (tab.name) {
			tabsStore.addView(tab)
		}
	}
}

// Get the tabs that need to be pinned
const getAffixTabs = (routes: any) => {
	let tabs: any[] = []
	routes.forEach((route: any) => {
		if (route.meta && route.meta.affix) {
			tabs.push({
				fullPath: route.path,
				path: route.path,
				name: route.name,
				meta: { ...route.meta }
			})
		}
		if (route.children) {
			const tempTabs = getAffixTabs(route.children)
			if (tempTabs.length >= 1) {
				tabs = [...tabs, ...tempTabs]
			}
		}
	})
	return tabs
}

// Add tab
const addTab = () => {
	tabsStore.addView(route)
	tabsStore.addCachedView(route)
	activeTabName.value = route.fullPath
}

// tabSelected
const tabClick = (tab: any) => {
	tab.props.name && router.push(tab.props.name)
}

// Click to close tab
const tabRemove = (fullPath: string) => {
	const tab = tabsStore.visitedViews.filter((tab: any) => tab.fullPath === fullPath)
	closeTab(router, tab[0])
}

// dropdown Close event
const onClose = (type: string) => {
	switch (type) {
		case 'close':
			closeTab(router, route)
			break
		case 'closeOthers':
			closeOthersTabs(router, route)
			break
		case 'closeAll':
			closeAllTabs(router, route)
			break
	}
}

// Ensure right-clicking a tab pops up only one dropdown
const dropdownRef = ref()
const handleChange = (visible: boolean, tab: any) => {
	if (!visible) {
		return
	}
	dropdownRef.value.forEach((item: { id: string; handleClose: () => void }) => {
		if (item.id === tab.fullPath) {
			return
		}
		item.handleClose()
	})
}
</script>

<style lang="scss" scoped>
.tabs-container {
	display: flex;
	position: relative;
	z-index: 6;
	height: 40px;
	background-color: #fff;
	.tabs-item {
		transition: left 0.3s;
		flex-grow: 1;
		overflow: hidden;
		::v-deep(.el-tabs__nav-prev) {
			padding: 0 10px;
			border-right: var(--el-border-color-extra-light) 1px solid;
		}
		::v-deep(.el-tabs__nav-next) {
			padding: 0 10px;
			border-left: var(--el-border-color-extra-light) 1px solid;
		}
		::v-deep(.is-scrollable) {
			padding: 0 32px;
		}
		::v-deep(.el-tabs__active-bar) {
			height: 0;
		}
		::v-deep(.el-tabs__item) {
			.is-icon-close {
				transition: none !important;
				&:hover {
					color: var(--el-color-primary-light-9);
					background-color: var(--el-color-primary);
					border-radius: 50%;
				}
			}
		}
	}
}
.tabs-item-style-1 {
	::v-deep(.el-tabs__item) {
		padding: 0 15px !important;
		border-right: var(--el-border-color-extra-light) 1px solid;
		user-select: none;
		color: #8c8c8c;
		&:hover {
			color: #444;
			background: rgba(0, 0, 0, 0.02);
		}
		&.is-active {
			.el-dropdown {
				color: var(--el-color-primary) !important;
			}
			color: var(--el-color-primary);
			background-color: var(--el-color-primary-light-9);
			border-bottom: var(--el-border-color-light) 2px solid;
			&:before {
				background-color: var(--el-color-primary);
			}
		}
		&:before {
			content: '';
			width: 9px;
			height: 9px;
			margin-right: 8px;
			display: inline-block;
			background-color: #ddd;
			border-radius: 50%;
		}
	}
}
.tabs-item-style-2 {
	::v-deep(.el-tabs__item) {
		padding: 0 15px !important;
		border-right: none;
		user-select: none;
		color: #8c8c8c;
		//display: inline-block;

		&:hover {
			color: #444;
			background: rgba(0, 0, 0, 0.02);
			border-bottom: var(--el-color-primary) 2px solid;
		}

		&.is-active {
			.el-dropdown {
				color: var(--el-color-primary) !important;
			}
			color: var(--el-color-primary) !important;
			background-color: var(--el-color-primary-light-9) !important;
			border-bottom: var(--el-color-primary) 2px solid;
			&:before {
				background-color: var(--el-color-primary);
			}
		}
	}
}
.tabs-action {
	height: 40px;
	line-height: 40px;
	box-sizing: border-box;
	padding: 0 12px;
	align-items: center;
	cursor: pointer;
	color: #666;
	border-left: var(--el-border-color-extra-light) 1px solid;
	border-bottom: var(--el-border-color-light) 2px solid;
}
</style>
