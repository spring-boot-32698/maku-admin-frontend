<template>
	<el-row :gutter="10">
		<el-col :span="5">
			<ma-data-tree-left url="/sys/org/list" title="Organization list" tree-data @click="handleClick" @manage="treeVisible = true" />
		</el-col>
		<el-col :span="19">
			<el-card class="layout-query">
				<el-form ref="queryRef" :inline="true" :model="state.queryForm">
					<el-form-item prop="username">
						<el-input v-model="state.queryForm.username" placeholder="Username"></el-input>
					</el-form-item>
					<el-form-item prop="mobile">
						<el-input v-model="state.queryForm.mobile" placeholder="Mobile number"></el-input>
					</el-form-item>
					<el-form-item prop="gender">
						<ma-dict-select v-model="state.queryForm.gender" dict-type="user_gender" clearable placeholder="Gender"></ma-dict-select>
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
						<el-button v-auth="'sys:user:save'" icon="Plus" type="primary" @click="addOrUpdateHandle()">Add</el-button>
					</el-space>
					<el-space v-auth="'sys:user:import'">
						<ma-upload-excel action="/sys/user/import">
							<el-button plain icon="Upload">Import</el-button>
						</ma-upload-excel>
					</el-space>
					<el-space>
						<el-button v-auth="'sys:user:export'" plain icon="Download" @click="downloadHandle('/sys/user/export')">Export</el-button>
					</el-space>
					<el-space>
						<el-button v-auth="'sys:user:delete'" icon="Delete" plain type="danger" @click="deleteBatchHandle()">Batch delete</el-button>
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
					<el-table-column prop="realName" label="Name" header-align="center" align="center"></el-table-column>
					<el-table-column prop="username" label="Username" header-align="center" align="center"></el-table-column>
					<ma-dict-column prop="gender" label="Gender" dict-type="user_gender"></ma-dict-column>
					<el-table-column prop="mobile" label="Mobile number" header-align="center" align="center"></el-table-column>
					<el-table-column prop="orgName" label="Organization" header-align="center" align="center"></el-table-column>
					<ma-dict-column prop="status" label="Status" dict-type="user_status"></ma-dict-column>
					<el-table-column prop="createTime" label="Creation time" header-align="center" align="center"></el-table-column>
					<el-table-column label="Operation" fixed="right" header-align="center" align="center" width="120">
						<template #default="scope">
							<el-button v-auth="'sys:user:update'" type="primary" link @click="addOrUpdateHandle(scope.row.id)">Edit</el-button>
							<el-button v-auth="'sys:user:delete'" type="primary" link @click="deleteBatchHandle(scope.row.id)">Delete</el-button>
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
			</el-card>
		</el-col>
	</el-row>

	<!-- Dialog, Add / Edit -->
	<add-or-update ref="addOrUpdateRef" @refresh-data-list="getDataList"></add-or-update>
</template>

<script setup lang="ts" name="SysUserIndex">
import { useCrud } from '@/hooks'
import { reactive, ref } from 'vue'
import AddOrUpdate from './add-or-update.vue'
import { IHooksOptions } from '@/hooks/interface'

const state: IHooksOptions = reactive({
	dataListUrl: '/sys/user/page',
	deleteUrl: '/sys/user',
	queryForm: {
		username: '',
		mobile: '',
		gender: '',
		orgId: []
	}
})

const queryRef = ref()
const addOrUpdateRef = ref()
const addOrUpdateHandle = (id?: number) => {
	addOrUpdateRef.value.init(id)
}

const handleClick = (orgId: any[]) => {
	state.queryForm.orgId = orgId
	getDataList()
}

const treeVisible = ref(false)

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle, downloadHandle, reset } = useCrud(state)
</script>
