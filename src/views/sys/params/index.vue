<template>
	<el-card class="layout-query">
		<el-form ref="queryRef" :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
			<el-form-item prop="paramKey">
				<el-input v-model="state.queryForm.paramKey" placeholder="Parameter key"></el-input>
			</el-form-item>
			<el-form-item prop="paramValue">
				<el-input v-model="state.queryForm.paramValue" placeholder="Parameter value"></el-input>
			</el-form-item>
			<el-form-item prop="paramType">
				<ma-dict-select v-model="state.queryForm.paramType" dict-type="params_type" placeholder="System parameters" clearable></ma-dict-select>
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
			show-overflow-tooltip
			:data="state.dataList"
			border
			class="layout-table"
			@selection-change="selectionChangeHandle"
		>
			<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
			<el-table-column prop="paramName" label="Parameter name" header-align="center" align="center"></el-table-column>
			<el-table-column prop="paramKey" label="Parameter key" header-align="center" align="center"></el-table-column>
			<el-table-column prop="paramValue" label="Parameter value" header-align="center" align="center"></el-table-column>
			<ma-dict-column prop="paramType" label="System parameters" dict-type="params_type"></ma-dict-column>
			<el-table-column prop="remark" label="Remarks" header-align="center" align="center"></el-table-column>
			<el-table-column prop="createTime" label="Creation time" header-align="center" align="center"></el-table-column>
			<el-table-column label="Operation" fixed="right" header-align="center" align="center" width="150">
				<template #default="scope">
					<el-button type="primary" link @click="addOrUpdateHandle(scope.row.id)">Edit </el-button>
					<el-button type="primary" link @click="deleteBatchHandle(scope.row.id)">Delete </el-button>
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

		<!-- Dialog, Add / Edit -->
		<add-or-update ref="addOrUpdateRef" @refresh-data-list="getDataList"></add-or-update>
	</el-card>
</template>

<script setup lang="ts" name="SysParamsIndex">
import { useCrud } from '@/hooks'
import { reactive, ref } from 'vue'
import AddOrUpdate from './add-or-update.vue'
import { IHooksOptions } from '@/hooks/interface'

const state: IHooksOptions = reactive({
	dataListUrl: '/sys/params/page',
	deleteUrl: '/sys/params',
	queryForm: {
		paramType: '',
		paramKey: '',
		paramValue: ''
	}
})

const queryRef = ref()
const addOrUpdateRef = ref()
const addOrUpdateHandle = (id?: number) => {
	addOrUpdateRef.value.init(id)
}

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle, reset } = useCrud(state)
</script>
