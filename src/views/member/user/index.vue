<template>
	<el-card class="layout-query">
		<el-form ref="queryRef" :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
			<el-form-item prop="nickName">
				<el-input v-model="state.queryForm.nickName" placeholder="Nickname"></el-input>
			</el-form-item>
			<el-form-item prop="mobile">
				<el-input v-model="state.queryForm.mobile" placeholder="Mobile number"></el-input>
			</el-form-item>
			<el-form-item prop="gender">
				<el-input v-model="state.queryForm.gender" placeholder="Gender"></el-input>
			</el-form-item>
			<el-form-item prop="status">
				<el-input v-model="state.queryForm.status" placeholder="Status"></el-input>
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

		<el-table v-loading="state.dataListLoading" :data="state.dataList" border class="layout-table" @selection-change="selectionChangeHandle">
			<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
			<el-table-column prop="id" label="id" header-align="center" align="center"></el-table-column>
			<el-table-column prop="nickName" label="Nickname" header-align="center" align="center"></el-table-column>
			<el-table-column prop="mobile" label="Mobile number" header-align="center" align="center"></el-table-column>
			<el-table-column prop="avatar" label="Avatar" header-align="center" align="center"></el-table-column>
			<el-table-column prop="birthday" label="Date of birth" header-align="center" align="center"></el-table-column>
			<el-table-column prop="gender" label="Gender" header-align="center" align="center"></el-table-column>
			<el-table-column prop="lastLoginIp" label="Last login IP" header-align="center" align="center"></el-table-column>
			<el-table-column prop="lastLoginTime" label="Last login time" header-align="center" align="center"></el-table-column>
			<el-table-column label="Operation" fixed="right" header-align="center" align="center" width="150">
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
	</el-card>
</template>

<script setup lang="ts" name="MemberUserIndex">
import { useCrud } from '@/hooks'
import { reactive, ref } from 'vue'
import { IHooksOptions } from '@/hooks/interface'
import AddOrUpdate from './add-or-update.vue'

const state: IHooksOptions = reactive({
	dataListUrl: '/member/user/page',
	deleteUrl: '/member/user',
	queryForm: {
		nickName: '',
		mobile: '',
		gender: '',
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
