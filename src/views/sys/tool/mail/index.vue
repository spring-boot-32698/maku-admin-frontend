<template>
	<el-card class="layout-query">
		<el-form ref="queryRef" :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
			<el-form-item prop="platform">
				<ma-dict-select v-model="state.queryForm.platform" dict-type="mail_platform" clearable placeholder="Platform type"></ma-dict-select>
			</el-form-item>
			<el-form-item prop="mailFrom">
				<el-input v-model="state.queryForm.mailFrom" placeholder="Sender"></el-input>
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
				<el-button icon="Plus" type="primary" @click="sendHandle()">Send mail</el-button>
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
			<el-table-column prop="platformId" label="Platform ID" header-align="center" align="center"></el-table-column>
			<ma-dict-column prop="platform" label="Platform type" dict-type="mail_platform"></ma-dict-column>
			<el-table-column prop="mailFrom" label="Sender" header-align="center" align="center"></el-table-column>
			<el-table-column prop="mailTos" label="Recipient" header-align="center" align="center"></el-table-column>
			<el-table-column prop="subject" label="Topic" header-align="center" align="center"></el-table-column>
			<ma-dict-column prop="status" label="Status" dict-type="success_fail"></ma-dict-column>
			<el-table-column prop="createTime" label="Send time" header-align="center" align="center"></el-table-column>
			<el-table-column label="Operation" fixed="right" header-align="center" align="center" width="150">
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
		<detail ref="detailRef"></detail>
		<!-- Send SMS -->
		<send v-if="sendVisible" v-model="sendVisible"></send>
	</el-card>
</template>

<script setup lang="ts">
import { useCrud } from '@/hooks'
import { reactive, ref } from 'vue'
import Detail from './detail.vue'
import Send from './send.vue'
import { IHooksOptions } from '@/hooks/interface'

const state: IHooksOptions = reactive({
	dataListUrl: '/sys/mail/log/page',
	deleteUrl: '/sys/mail/log',
	queryForm: {
		mailFrom: '',
		platform: ''
	}
})

const queryRef = ref()
const detailRef = ref()
const detailHandle = (row: any) => {
	detailRef.value.init(row)
}

const sendVisible = ref()
const sendHandle = () => {
	sendVisible.value = true
}

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle, reset } = useCrud(state)
</script>
