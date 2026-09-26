<template>
	<el-card class="layout-query">
		<el-form ref="queryRef" :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
			<el-form-item prop="name">
				<el-input v-model="state.queryForm.name" placeholder="Name"></el-input>
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
				<el-button v-auth="'sys:role:save'" icon="Plus" type="primary" @click="addOrUpdateHandle()">Add</el-button>
			</el-space>
			<el-space>
				<el-button v-auth="'sys:role:delete'" icon="Delete" plain type="danger" @click="deleteBatchHandle()">Batch delete</el-button>
			</el-space>
		</el-space>

		<el-table v-loading="state.dataListLoading" :data="state.dataList" border class="layout-table" @selection-change="selectionChangeHandle">
			<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
			<el-table-column prop="name" label="Name" header-align="center" align="center"></el-table-column>
			<el-table-column prop="roleCode" label="Code" header-align="center" align="center"></el-table-column>
			<el-table-column prop="remark" label="Remarks" header-align="center" align="center"></el-table-column>
			<el-table-column prop="createTime" label="Creation time" header-align="center" align="center" width="180"></el-table-column>
			<el-table-column label="Operation" fixed="right" header-align="center" align="center" width="200">
				<template #default="scope">
					<el-button v-auth="'sys:role:update'" type="primary" link @click="addOrUpdateHandle(scope.row.id)">Edit</el-button>
					<el-button v-auth="'sys:role:delete'" type="primary" link @click="deleteBatchHandle(scope.row.id)">Delete</el-button>
					<el-dropdown v-auth="'sys:role:update'" @command="(command: string) => handleCommand(command, scope.row)">
						<el-button type="primary" class="el-dropdown-link" link>More</el-button>
						<template #dropdown>
							<el-dropdown-menu>
								<el-dropdown-item command="dataScope">Data permission</el-dropdown-item>
								<el-dropdown-item command="user">Assign users</el-dropdown-item>
							</el-dropdown-menu>
						</template>
					</el-dropdown>
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
		<!-- Data permission -->
		<data-scope ref="dataScopeRef"></data-scope>
		<!-- Assign users -->
		<el-drawer v-if="userVisible" v-model="userVisible" :title="userTitle" :size="1000" :close-on-press-escape="false">
			<user :role-id="roleId"></user>
		</el-drawer>
	</el-card>
</template>

<script setup lang="ts" name="SysRoleIndex">
import { useCrud } from '@/hooks'
import { reactive, ref } from 'vue'
import AddOrUpdate from './add-or-update.vue'
import DataScope from './data-scope.vue'
import User from './user.vue'
import { IHooksOptions } from '@/hooks/interface'

const state: IHooksOptions = reactive({
	dataListUrl: '/sys/role/page',
	deleteUrl: '/sys/role',
	queryForm: {
		name: ''
	}
})

const queryRef = ref()
const addOrUpdateRef = ref()
const addOrUpdateHandle = (id?: number) => {
	addOrUpdateRef.value.init(id)
}

const dataScopeRef = ref()
const userVisible = ref(false)
const roleId = ref()
const userTitle = ref()
const handleCommand = (command: string, row: any) => {
	if (command === 'dataScope') {
		dataScopeRef.value.init(row.id)
	} else if (command === 'user') {
		roleId.value = row.id
		userTitle.value = 'Assign users - ' + row.name
		userVisible.value = true
	}
}

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle, reset } = useCrud(state)
</script>

<style scoped>
.el-dropdown-link {
	display: flex;
	align-items: center;
	line-height: normal;
	margin-left: 10px;
}
</style>
