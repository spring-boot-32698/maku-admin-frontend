<template>
	<el-card>
		<el-table
			v-loading="state.dataListLoading"
			show-overflow-tooltip
			:data="state.dataList"
			border
			style="width: 100%"
			@selection-change="selectionChangeHandle"
		>
			<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
			<el-table-column prop="accessToken" label="Session number" header-align="center" align="center"></el-table-column>
			<el-table-column prop="username" label="Username" header-align="center" align="center"></el-table-column>
			<el-table-column prop="realName" label="Name" header-align="center" align="center"></el-table-column>
			<ma-dict-column prop="gender" label="Gender" dict-type="user_gender"></ma-dict-column>
			<el-table-column prop="email" label="Email" header-align="center" align="center"></el-table-column>
			<el-table-column label="Operation" fixed="right" header-align="center" align="center" width="150">
				<template #default="scope">
					<el-button type="primary" link @click="logoutHandle(scope.row.accessToken)">Kick out</el-button>
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
</template>

<script setup lang="ts">
import { useCrud } from '@/hooks'
import { reactive } from 'vue'
import { IHooksOptions } from '@/hooks/interface'
import { useMonitorUserLogoutApi } from '@/api/monitor/user'
import { ElMessage, ElMessageBox } from 'element-plus'

const state: IHooksOptions = reactive({
	dataListUrl: 'monitor/user/page'
})

const logoutHandle = (accessToken: string) => {
	ElMessageBox.confirm('Are you sure you want to kick this user out?', 'Tip', {
		confirmButtonText: 'OK',
		cancelButtonText: 'Cancel',
		type: 'warning'
	})
		.then(() => {
			useMonitorUserLogoutApi(accessToken).then(() => {
				ElMessage.success({
					message: 'Operation succeeded',
					duration: 500
				})
				getDataList()
			})
		})
		.catch(() => {})
}
const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle } = useCrud(state)
</script>
