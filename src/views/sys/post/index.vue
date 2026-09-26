<template>
	<el-card class="layout-query">
		<el-form ref="queryRef" :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
			<el-form-item prop="postCode">
				<el-input v-model="state.queryForm.postCode" placeholder="Post code"></el-input>
			</el-form-item>
			<el-form-item prop="postName">
				<el-input v-model="state.queryForm.postName" placeholder="Post name"></el-input>
			</el-form-item>
			<el-form-item prop="status">
				<ma-dict-select v-model="state.queryForm.status" dict-type="post_status" clearable placeholder="Status"></ma-dict-select>
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
				<el-button v-auth="'sys:post:save'" icon="Plus" type="primary" @click="addOrUpdateHandle()">Add</el-button>
			</el-space>
			<el-space>
				<el-button v-auth="'sys:post:delete'" icon="Delete" plain type="danger" @click="deleteBatchHandle()">Batch delete</el-button>
			</el-space>
		</el-space>
		<el-table v-loading="state.dataListLoading" :data="state.dataList" border class="layout-table" @selection-change="selectionChangeHandle">
			<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
			<el-table-column prop="postCode" label="Post code" header-align="center" align="center"></el-table-column>
			<el-table-column prop="postName" label="Post name" header-align="center" align="center"></el-table-column>
			<el-table-column prop="sort" label="Sort" header-align="center" align="center"></el-table-column>
			<ma-dict-column prop="status" label="Status" dict-type="post_status"></ma-dict-column>
			<el-table-column label="Operation" fixed="right" header-align="center" align="center" width="150">
				<template #default="scope">
					<el-button v-auth="'sys:post:update'" type="primary" link @click="addOrUpdateHandle(scope.row.id)">Edit</el-button>
					<el-button v-auth="'sys:post:delete'" type="primary" link @click="deleteBatchHandle(scope.row.id)">Delete</el-button>
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

<script setup lang="ts" name="SysPostIndex">
import { useCrud } from '@/hooks'
import { reactive, ref } from 'vue'
import AddOrUpdate from './add-or-update.vue'
import { IHooksOptions } from '@/hooks/interface'

const state: IHooksOptions = reactive({
	dataListUrl: '/sys/post/page',
	deleteUrl: '/sys/post',
	queryForm: {
		postCode: '',
		postName: '',
		status: ''
	}
})

const queryRef = ref()
const addOrUpdateRef = ref()
const addOrUpdateHandle = (id?: number) => {
	addOrUpdateRef.value.init(id)
}

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle, reset } = useCrud(state)
</script>
