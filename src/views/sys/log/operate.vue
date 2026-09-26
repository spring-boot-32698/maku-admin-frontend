<template>
	<el-card class="layout-query">
		<el-form ref="queryRef" :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
			<el-form-item prop="realName">
				<el-input v-model="state.queryForm.realName" placeholder="User"></el-input>
			</el-form-item>
			<el-form-item prop="module">
				<el-input v-model="state.queryForm.module" placeholder="Module name"></el-input>
			</el-form-item>
			<el-form-item prop="reqUri">
				<el-input v-model="state.queryForm.reqUri" placeholder="Request URI"></el-input>
			</el-form-item>
			<el-form-item prop="status">
				<ma-dict-select v-model="state.queryForm.status" placeholder="Operation status" dict-type="success_fail" clearable> </ma-dict-select>
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
		<el-table
			v-loading="state.dataListLoading"
			show-overflow-tooltip
			:data="state.dataList"
			border
			class="layout-table"
			@selection-change="selectionChangeHandle"
		>
			<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
			<el-table-column prop="realName" label="User" header-align="center" align="center"></el-table-column>
			<el-table-column prop="module" label="Module name" header-align="center" align="center"></el-table-column>
			<el-table-column prop="reqUri" label="Request URI" header-align="center" align="center"></el-table-column>
			<el-table-column prop="reqMethod" label="Request method" header-align="center" align="center"></el-table-column>
			<el-table-column prop="address" label="Login location" header-align="center" align="center"></el-table-column>
			<ma-dict-column prop="operateType" label="Operation type" dict-type="log_operate_type" header-align="center" align="center"></ma-dict-column>
			<el-table-column prop="duration" label="Execution duration" header-align="center" align="center">
				<template #default="scope"> {{ scope.row.duration }}ms </template>
			</el-table-column>
			<ma-dict-column prop="status" label="Operation status" dict-type="success_fail"></ma-dict-column>
			<el-table-column prop="createTime" label="Creation time" header-align="center" align="center"></el-table-column>
			<el-table-column label="Operation" fixed="right" header-align="center" align="center" width="80">
				<template #default="scope">
					<el-button type="primary" link @click="detailHandle(scope.row)">Details</el-button>
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

		<!-- Details -->
		<operate-detail ref="detailRef"></operate-detail>
	</el-card>
</template>

<script setup lang="ts" name="SysLogOperate">
import { useCrud } from '@/hooks'
import { reactive, ref } from 'vue'
import { IHooksOptions } from '@/hooks/interface'
import OperateDetail from './operate-detail.vue'

const state: IHooksOptions = reactive({
	dataListUrl: '/sys/log/operate/page',
	queryForm: {
		realName: '',
		module: '',
		reqUri: '',
		status: ''
	}
})

const queryRef = ref()
const detailRef = ref()
const detailHandle = (row: any) => {
	detailRef.value.init(row)
}

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle, reset } = useCrud(state)
</script>
