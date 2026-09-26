<template>
	<el-card class="layout-query">
		<el-form ref="queryRef" :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
			<el-form-item prop="jobName">
				<el-input v-model="state.queryForm.jobName" placeholder="Task name"></el-input>
			</el-form-item>
			<el-form-item prop="jobGroup">
				<ma-dict-select v-model="state.queryForm.jobGroup" dict-type="schedule_group" clearable placeholder="Task group name"></ma-dict-select>
			</el-form-item>
			<el-form-item prop="status">
				<ma-dict-select v-model="state.queryForm.status" dict-type="schedule_status" clearable placeholder="Task status"></ma-dict-select>
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
				<el-button v-auth="'schedule:save'" icon="Plus" type="primary" @click="addOrUpdateHandle()">Add</el-button>
			</el-space>
			<el-space>
				<el-button v-auth="'schedule:log'" icon="Document" plain @click="logHandle()">Task log</el-button>
			</el-space>
			<el-space>
				<el-button v-auth="'schedule:delete'" icon="Delete" plain type="danger" @click="deleteBatchHandle()">Batch delete</el-button>
			</el-space>
		</el-space>

		<el-table v-loading="state.dataListLoading" :data="state.dataList" border class="layout-table" @selection-change="selectionChangeHandle">
			<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
			<el-table-column prop="id" label="id" header-align="center" align="center"></el-table-column>
			<el-table-column prop="jobName" label="Task name" header-align="center" align="center"></el-table-column>
			<ma-dict-column prop="jobGroup" label="Task group name" dict-type="schedule_group"></ma-dict-column>
			<el-table-column prop="beanName" label="Execution method" dict-type="schedule_group">
				<template #default="scope"> {{ scope.row.beanName }}.{{ scope.row.method }}() </template>
			</el-table-column>
			<el-table-column prop="cronExpression" label="CronExpression" header-align="center" align="center"></el-table-column>
			<ma-dict-column prop="status" label="Status" dict-type="schedule_status"></ma-dict-column>
			<el-table-column label="Operation" fixed="right" header-align="center" align="center" width="260">
				<template #default="scope">
					<el-button v-auth="'schedule:update'" type="primary" link @click="addOrUpdateHandle(scope.row.id)">Edit</el-button>
					<el-button v-if="scope.row.status === 0" v-auth="'schedule:update'" type="primary" link @click="statusHandle(scope.row, 1)">Resume</el-button>
					<el-button v-if="scope.row.status === 1" v-auth="'schedule:update'" type="primary" link @click="statusHandle(scope.row, 0)">Pause</el-button>
					<el-button v-auth="'schedule:run'" type="primary" link @click="runHandle(scope.row)">Execute</el-button>
					<el-button v-auth="'schedule:log'" type="primary" link @click="logHandle(scope.row)">Log</el-button>
					<el-button v-auth="'schedule:delete'" type="primary" link @click="deleteBatchHandle(scope.row.id)">Delete</el-button>
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

		<!-- Log -->
		<el-drawer v-if="logVisible" v-model="logVisible" title="Task log" :size="1200" :close-on-press-escape="false">
			<log ref="logRef" />
		</el-drawer>
	</el-card>
</template>

<script setup lang="ts" name="QuartzScheduleIndex">
import { useCrud } from '@/hooks'
import { reactive, ref, nextTick } from 'vue'
import AddOrUpdate from './add-or-update.vue'
import Log from '../log/index.vue'
import { IHooksOptions } from '@/hooks/interface'
import { useScheduleStatusApi, useScheduleRunApi } from '@/api/quartz/schedule'
import { ElMessage, ElMessageBox } from 'element-plus/es'

const state: IHooksOptions = reactive({
	dataListUrl: '/schedule/page',
	deleteUrl: '/schedule',
	queryForm: {
		jobName: '',
		jobGroup: '',
		status: ''
	}
})

const runHandle = (row: any) => {
	ElMessageBox.confirm('Are you sure you want to run it now?', 'Tip', {
		confirmButtonText: 'OK',
		cancelButtonText: 'Cancel',
		type: 'warning'
	})
		.then(() => {
			useScheduleRunApi(row).then(() => {
				ElMessage.success({
					message: 'Operation succeeded',
					duration: 500
				})
			})
		})
		.catch(() => {})
}

const statusHandle = (row: any, status: any) => {
	const opt = status === 0 ? 'Pause' : 'Resume'
	ElMessageBox.confirm(`Are you sure you want to proceed with${opt}Operation?`, 'Tip', {
		confirmButtonText: 'OK',
		cancelButtonText: 'Cancel',
		type: 'warning'
	})
		.then(() => {
			row.status = status
			useScheduleStatusApi(row).then(() => {
				ElMessage.success({
					message: 'Operation succeeded',
					duration: 500
				})
			})
		})
		.catch(() => {})
}

const logVisible = ref(false)
const logRef = ref<any>(null)
const logHandle = (row?: any) => {
	logVisible.value = true
	nextTick(() => {
		logRef.value?.init?.(row)
	})
}

const queryRef = ref()
const addOrUpdateRef = ref()
const addOrUpdateHandle = (id?: number) => {
	addOrUpdateRef.value.init(id)
}

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle, reset } = useCrud(state)
</script>
