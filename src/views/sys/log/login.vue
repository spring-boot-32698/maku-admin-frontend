<template>
	<el-card class="layout-query">
		<el-form ref="queryRef" :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
			<el-form-item prop="username">
				<el-input v-model="state.queryForm.username" placeholder="Username"></el-input>
			</el-form-item>
			<el-form-item prop="address">
				<el-input v-model="state.queryForm.address" placeholder="Login location"></el-input>
			</el-form-item>
			<el-form-item prop="status">
				<ma-dict-select v-model="state.queryForm.status" dict-type="success_fail" placeholder="Login status" clearable></ma-dict-select>
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
			<el-button icon="Download" @click="downloadHandle('/sys/log/login/export')">Export</el-button>
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
			<el-table-column prop="id" label="No." header-align="center" align="center"></el-table-column>
			<el-table-column prop="username" label="Username" header-align="center" align="center"></el-table-column>
			<el-table-column prop="ip" label="Login IP" header-align="center" align="center"></el-table-column>
			<el-table-column prop="address" label="Login location" header-align="center" align="center"></el-table-column>
			<el-table-column prop="userAgent" label="User Agent" header-align="center" align="center"></el-table-column>
			<ma-dict-column prop="status" label="Login status" dict-type="success_fail"></ma-dict-column>
			<ma-dict-column prop="operation" label="Operation info" dict-type="login_operation"></ma-dict-column>
			<el-table-column prop="createTime" label="Login time" header-align="center" align="center" width="165"></el-table-column>
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
	</el-card>
</template>

<script setup lang="ts" name="SysLogLogin">
import { useCrud } from '@/hooks'
import { reactive, ref } from 'vue'
import { IHooksOptions } from '@/hooks/interface'

const state: IHooksOptions = reactive({
	dataListUrl: '/sys/log/login/page',
	queryForm: {
		username: '',
		address: '',
		status: ''
	}
})

const queryRef = ref()

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, downloadHandle, reset } = useCrud(state)
</script>
