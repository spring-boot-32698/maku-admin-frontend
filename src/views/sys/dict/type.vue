<template>
	<el-card class="layout-query">
		<el-form ref="queryRef" :inline="true" :model="state.queryForm" @keyup.enter="getDataList">
			<el-form-item prop="dictType">
				<el-input v-model="state.queryForm.dictType" placeholder="Dictionary type"></el-input>
			</el-form-item>
			<el-form-item prop="dictName">
				<el-input v-model="state.queryForm.dictName" placeholder="Dictionary name"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button icon="Search" type="primary" @click="getDataList()">Query</el-button>
			</el-form-item>
			<el-form-item>
				<el-button icon="RefreshRight" @click="reset(queryRef)">Reset</el-button>
			</el-form-item>
		</el-form>
	</el-card>

	<el-card>
		<el-space>
			<el-space>
				<el-button icon="Plus" type="primary" @click="addOrUpdateHandle()">Add</el-button>
			</el-space>
			<el-space>
				<el-button icon="Delete" plain type="danger" @click="deleteBatchHandle()">Batch delete</el-button>
			</el-space>
		</el-space>

		<el-table
			v-loading="state.dataListLoading"
			:data="state.dataList"
			border
			show-overflow-tooltip
			class="layout-table"
			row-key="id"
			lazy
			:load="load"
			:tree-props="{ children: 'children', hasChildren: 'hasChild' }"
			@selection-change="selectionChangeHandle"
			@sort-change="sortChangeHandle"
		>
			<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
			<el-table-column prop="dictType" label="Dictionary type" header-align="center" align="center"> </el-table-column>
			<el-table-column prop="dictName" label="Dictionary name" header-align="center" align="center"></el-table-column>
			<el-table-column prop="remark" label="Remarks" header-align="center" align="center"></el-table-column>
			<el-table-column prop="dictSource" label="Data source" header-align="center" align="center">
				<template #default="scope">
					<span v-if="scope.row.dictSource === 0">Dictionary data</span>
					<span v-else>Dynamic SQL</span>
				</template>
			</el-table-column>
			<el-table-column prop="sort" label="Sort" sortable="custom" header-align="center" align="center"></el-table-column>
			<el-table-column prop="createTime" label="Creation time" header-align="center" align="center" width="180"></el-table-column>
			<el-table-column label="Operation" fixed="right" header-align="center" align="center" width="200">
				<template #default="scope">
					<el-button v-if="scope.row.dictSource === 0" type="primary" link @click="showDictDataHandle(scope.row)">Dictionary settings</el-button>
					<el-button v-if="scope.row.dictSource === 1" type="primary" link @click="showDataSqlHandle(scope.row)">Dynamic data</el-button>
					<el-button type="primary" link @click="addOrUpdateHandle(scope.row.id)">Edit</el-button>
					<el-button type="primary" link @click="deleteBatchHandle(scope.row.id)">Delete</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination
			:current-page="state.page"
			:page-sizes="state.pageSizes"
			:page-size="state.limit"
			:total="state.total"
			layout="total, sizes, prev, pager, next, jumper"
			@size-change="sizeChangeHandle"
			@current-change="currentChangeHandle"
		>
		</el-pagination>
		<!-- Add / Edit -->
		<add-or-update ref="addOrUpdateRef" @refresh-data-list="getDataList"></add-or-update>

		<!-- Dynamic data -->
		<el-drawer v-if="dataSqlVisible" v-model="dataSqlVisible" :title="dataSqlTitle" :size="800" :close-on-press-escape="false">
			<data-sql :dict-type-id="dictTypeId"></data-sql>
		</el-drawer>

		<!-- Dictionary settings -->
		<el-drawer v-if="dictDataVisible" v-model="dictDataVisible" :title="dictDataTitle" :size="800" :close-on-press-escape="false">
			<dict-data :dict-type-id="dictTypeId"></dict-data>
		</el-drawer>
	</el-card>
</template>

<script setup lang="ts" name="SysDictType">
import { useCrud } from '@/hooks'
import { reactive, ref } from 'vue'
import AddOrUpdate from './type-add-or-update.vue'
import DataSql from './data-sql.vue'
import DictData from './data.vue'
import { IHooksOptions } from '@/hooks/interface'
import { useDictTypeListApi } from '@/api/sys/dict'

const state: IHooksOptions = reactive({
	dataListUrl: '/sys/dict/type/page',
	deleteUrl: '/sys/dict/type',
	queryForm: {
		dictName: '',
		dictType: ''
	}
})

const dictDataVisible = ref(false)
const dictDataTitle = ref()
const dictTypeId = ref()
const showDictDataHandle = (row: any) => {
	dictTypeId.value = row.id
	dictDataTitle.value = 'Dictionary settings - ' + row.dictType
	dictDataVisible.value = true
}

const dataSqlVisible = ref(false)
const dataSqlTitle = ref()
const showDataSqlHandle = (row: any) => {
	dataSqlVisible.value = true
	dictTypeId.value = row.id
	dataSqlTitle.value = 'Dynamic data - ' + row.dictType
}

// Handle refresh when the data changes
const nodeMap = new Map()
const load = (tree: any, treeNode: unknown, resolve: (data: any[]) => void) => {
	if (!nodeMap.has(tree.id)) {
		nodeMap.set(tree.id, { tree, treeNode, resolve })
	}

	useDictTypeListApi(tree.id).then((res: any) => {
		if (res.data.length > 0) {
			resolve(res.data)
		} else {
			resolve([])
			// location.reload()
		}
	})
}

const queryRef = ref()
const addOrUpdateRef = ref()
const addOrUpdateHandle = (id?: Number) => {
	addOrUpdateRef.value.init(id)
}

const { getDataList, sizeChangeHandle, selectionChangeHandle, sortChangeHandle, currentChangeHandle, deleteBatchHandle, reset } = useCrud(state)
</script>
