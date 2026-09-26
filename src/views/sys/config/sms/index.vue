<template>
	<div style="margin-top: 10px">
		<el-space>
			<el-space>
				<el-button icon="Plus" type="primary" @click="addOrUpdateHandle()">Add</el-button>
			</el-space>
			<el-space>
				<el-button icon="Delete" plain type="danger" @click="deleteBatchHandle()">Batch delete</el-button>
			</el-space>
		</el-space>
		<el-table v-loading="state.dataListLoading" :data="state.dataList" border class="layout-table" @selection-change="selectionChangeHandle">
			<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
			<el-table-column prop="id" label="id" header-align="center" align="center"></el-table-column>
			<ma-dict-column prop="platform" label="Platform type" dict-type="sms_platform"></ma-dict-column>
			<el-table-column prop="groupName" label="Group name" header-align="center" align="center"></el-table-column>
			<el-table-column prop="signName" label="SMS signature" header-align="center" align="center"></el-table-column>
			<el-table-column prop="templateId" label="SMS template" header-align="center" align="center"></el-table-column>
			<ma-dict-column prop="status" label="Status" dict-type="enable_disable"></ma-dict-column>
			<el-table-column prop="createTime" label="Creation time" header-align="center" align="center"></el-table-column>
			<el-table-column label="Operation" fixed="right" header-align="center" align="center" width="160">
				<template #default="scope">
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

		<!-- Dialog, Add / Edit -->
		<add-or-update ref="addOrUpdateRef" @refresh-data-list="getDataList"></add-or-update>
	</div>
</template>

<script setup lang="ts">
import { useCrud } from '@/hooks'
import { reactive, ref } from 'vue'
import AddOrUpdate from './add-or-update.vue'
import { IHooksOptions } from '@/hooks/interface'

const state: IHooksOptions = reactive({
	dataListUrl: '/sys/sms/config/page',
	deleteUrl: '/sys/sms/config',
	queryForm: {
		platform: '',
		groupName: ''
	}
})

const addOrUpdateRef = ref()
const addOrUpdateHandle = (id?: number) => {
	addOrUpdateRef.value.init(id)
}

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle } = useCrud(state)
</script>
