<template>
	<el-card>
		<el-space>
			<el-space>
				<el-button v-auth="'sys:org:save'" type="primary" icon="Plus" @click="addOrUpdateHandle(false, null)">Add</el-button>
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
			row-key="id"
			border
			class="layout-table"
		>
			<el-table-column prop="name" label="Name" header-align="center"></el-table-column>
			<el-table-column prop="parentName" label="Parent" header-align="center" align="center"></el-table-column>
			<el-table-column prop="sort" label="Sort" header-align="center" align="center"></el-table-column>
			<el-table-column label="Operation" fixed="right" header-align="center" align="center" width="160">
				<template #default="scope">
					<el-button v-auth="'sys:org:save'" type="primary" link @click="addOrUpdateHandle(false, scope.row)">Add</el-button>
					<el-button v-auth="'sys:org:update'" type="primary" link @click="addOrUpdateHandle(true, scope.row)">Edit</el-button>
					<el-button v-auth="'sys:org:delete'" type="primary" link @click="deleteHandle(scope.row.id)">Delete</el-button>
				</template>
			</el-table-column>
		</el-table>
		<add-or-update ref="addOrUpdateRef" @refresh-data-list="getDataList"></add-or-update>
	</el-card>
</template>

<script setup lang="ts">
import { useCrud } from '@/hooks'
import { nextTick, reactive, ref } from 'vue'
import AddOrUpdate from './add-or-update.vue'
import { IHooksOptions } from '@/hooks/interface'
import { ArrowDown, ArrowUp } from '@element-plus/icons-vue'

const state: IHooksOptions = reactive({
	dataListUrl: '/sys/org/list',
	deleteUrl: '/sys/org',
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
