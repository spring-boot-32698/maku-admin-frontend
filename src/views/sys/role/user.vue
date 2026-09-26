<template>
	<el-form :inline="true" :model="state.queryForm">
		<el-form-item>
			<el-input v-model="state.queryForm.username" placeholder="Username"></el-input>
		</el-form-item>
		<el-form-item>
			<el-input v-model="state.queryForm.mobile" placeholder="Mobile number"></el-input>
		</el-form-item>
		<el-form-item>
			<ma-dict-select v-model="state.queryForm.gender" dict-type="user_gender" clearable placeholder="Gender"></ma-dict-select>
		</el-form-item>
		<el-form-item>
			<el-button icon="Search" type="primary" @click="getDataList()">Query</el-button>
		</el-form-item>
		<el-form-item>
			<el-button icon="Plus" type="primary" @click="userSelectVisible = true">Add</el-button>
			<ma-user-dialog :key="userSelectVisible" v-model:visible="userSelectVisible" multiple @select="userHandle"></ma-user-dialog>
		</el-form-item>
		<el-form-item>
			<el-button icon="Delete" plain type="danger" @click="deleteBatchHandle()">Batch delete</el-button>
		</el-form-item>
	</el-form>
	<el-table
		v-loading="state.dataListLoading"
		:data="state.dataList"
		border
		style="width: 100%"
		@selection-change="selectionChangeHandle"
		@sort-change="sortChangeHandle"
	>
		<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
		<el-table-column prop="username" label="Username" header-align="center" align="center"></el-table-column>
		<el-table-column prop="mobile" label="Mobile number" header-align="center" align="center"></el-table-column>
		<el-table-column prop="realName" label="Name" header-align="center" align="center"></el-table-column>
		<ma-dict-column prop="gender" label="Gender" dict-type="user_gender"></ma-dict-column>
		<el-table-column label="Operation" fixed="right" header-align="center" align="center" width="150">
			<template #default="scope">
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
</template>

<script setup lang="ts">
import { useCrud } from '@/hooks'
import { reactive, ref } from 'vue'
import { IHooksOptions } from '@/hooks/interface'
import { useRoleUserSubmitApi } from '@/api/sys/role'
import { ElMessage } from 'element-plus/es'

const props = defineProps({
	roleId: {
		type: Number,
		required: true
	}
})

const userSelectVisible = ref(false)

const state: IHooksOptions = reactive({
	dataListUrl: '/sys/role/user/page',
	deleteUrl: '/sys/role/user/' + props.roleId,
	queryForm: {
		roleId: props.roleId,
		username: '',
		mobile: '',
		gender: ''
	}
})

const userHandle = (users: any[]) => {
	const userIdList = users.map((item: any) => item.id)
	useRoleUserSubmitApi(props.roleId, userIdList).then(() => {
		ElMessage.success({
			message: 'Operation succeeded',
			duration: 500,
			onClose: () => {
				getDataList()
			}
		})
	})
}

const { getDataList, sizeChangeHandle, selectionChangeHandle, sortChangeHandle, currentChangeHandle, deleteBatchHandle } = useCrud(state)
</script>
