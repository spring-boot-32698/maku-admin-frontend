<template>
	<el-card class="mod__menu">
		<el-space>
			<el-space>
				<el-button v-auth="'sys:menu:save'" icon="Plus" type="primary" @click="addOrUpdateHandle(false, null)">Add</el-button>
			</el-space>
			<el-space>
				<el-button plain @click="toggleExpandAll()">
					<template v-if="!isExpandAll">
						Expand all&nbsp;<el-icon><ArrowDown /></el-icon>
					</template>
					<template v-else>
						Collapse all&nbsp;<el-icon><ArrowUp /></el-icon>
					</template>
				</el-button>
			</el-space>
		</el-space>

		<el-table
			v-if="refreshTable"
			v-loading="state.dataListLoading"
			:default-expand-all="isExpandAll"
			:data="state.dataList"
			show-overflow-tooltip
			row-key="id"
			border
			class="layout-table"
		>
			<el-table-column prop="name" label="Name" header-align="center" min-width="150"></el-table-column>
			<el-table-column prop="icon" label="Icon" header-align="center" align="center">
				<template #default="scope">
					<ma-icon :icon="scope.row.icon"></ma-icon>
				</template>
			</el-table-column>
			<el-table-column prop="type" label="Type" header-align="center" align="center">
				<template #default="scope">
					<el-tag v-if="scope.row.type === 0" type="info">Menu</el-tag>
					<el-tag v-if="scope.row.type === 1" type="success">Button</el-tag>
					<el-tag v-if="scope.row.type === 2" type="warning">API</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="openStyle" label="Open mode" header-align="center" align="center">
				<template #default="scope">
					<span v-if="scope.row.type !== 0"></span>
					<el-tag v-else-if="scope.row.openStyle === 0">Open internally</el-tag>
					<el-tag v-else type="info">Open externally</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="sort" label="Sort" header-align="center" align="center"></el-table-column>
			<el-table-column prop="url" label="Route" header-align="center" align="center" width="150"></el-table-column>
			<el-table-column prop="authority" label="Authorization identifier" header-align="center" align="center" width="150"></el-table-column>
			<el-table-column label="Operation" fixed="right" header-align="center" align="center" width="160">
				<template #default="scope">
					<el-button v-if="scope.row.type === 0" v-auth="'sys:menu:save'" type="primary" link @click="addOrUpdateHandle(false, scope.row)"
						>Add</el-button
					>
					<el-button v-auth="'sys:menu:update'" type="primary" link @click="addOrUpdateHandle(true, scope.row)">Edit</el-button>
					<el-button v-auth="'sys:menu:delete'" type="primary" link @click="deleteHandle(scope.row.id)">Delete</el-button>
				</template>
			</el-table-column>
		</el-table>
		<add-or-update ref="addOrUpdateRef" @refresh-data-list="getDataList"></add-or-update>
	</el-card>
</template>

<script setup lang="ts">
import { useCrud } from '@/hooks'
import { reactive, ref, nextTick } from 'vue'
import AddOrUpdate from './add-or-update.vue'
import { IHooksOptions } from '@/hooks/interface'
import { ArrowDown, ArrowUp } from '@element-plus/icons-vue'

const state: IHooksOptions = reactive({
	dataListUrl: '/sys/menu/list',
	deleteUrl: '/sys/menu',
	isPage: false
})

const addOrUpdateRef = ref()
const addOrUpdateHandle = (isUpdate: Boolean, row: any) => {
	addOrUpdateRef.value.init(isUpdate, row)
}

const { getDataList, deleteHandle } = useCrud(state)

// Whether expanded, all collapsed by default
const isExpandAll = ref(false)
// Whether to re-render the table state
const refreshTable = ref(true)

// Toggle expand and collapse
const toggleExpandAll = () => {
	refreshTable.value = false
	isExpandAll.value = !isExpandAll.value
	nextTick(() => {
		refreshTable.value = true
	})
}
</script>
