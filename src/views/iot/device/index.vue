<template>
	<el-card class="layout-query">
		<el-form ref="queryRef" :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
			<el-form-item prop="type">
				<ma-dict-select v-model="state.queryForm.type" dict-type="device_type" placeholder="Device type" clearable></ma-dict-select>
			</el-form-item>
			<el-form-item prop="status">
				<ma-dict-select v-model="state.queryForm.status" dict-type="enable_disable" placeholder="Device status" clearable></ma-dict-select>
			</el-form-item>
			<el-form-item prop="runningStatus">
				<ma-dict-select v-model="state.queryForm.runningStatus" dict-type="device_running_status" placeholder="Running status" clearable></ma-dict-select>
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
				<el-button v-auth="'iot:device:save'" icon="Plus" type="primary" @click="addOrUpdateHandle()">Add </el-button>
			</el-space>
			<el-space>
				<el-button v-auth="'iot:device:delete'" icon="Delete" plain type="danger" @click="deleteBatchHandle()"> Batch delete </el-button>
			</el-space>
		</el-space>
		<el-table
			v-loading="state.dataListLoading"
			:data="state.dataList"
			show-overflow-tooltip
			border
			class="layout-table"
			@selection-change="selectionChangeHandle"
		>
			<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
			<ma-dict-column prop="status" label="Status" dict-type="enable_disable"></ma-dict-column>
			<el-table-column prop="code" label="Code" header-align="center" align="center"></el-table-column>
			<el-table-column prop="name" label="Name" header-align="center" align="center"></el-table-column>
			<ma-dict-column prop="type" label="Device type" dict-type="device_type"></ma-dict-column>
			<el-table-column prop="uid" label="Unique identifier" header-align="center" align="center"></el-table-column>
			<el-table-column prop="protocolType" label="Communication protocol" header-align="center" align="center"></el-table-column>
			<el-table-column prop="secret" label="Device key" header-align="center" align="center"></el-table-column>
			<el-table-column prop="appVersion" label="AppVersion" header-align="center" align="center"></el-table-column>
			<el-table-column prop="batteryPercent" label="Battery level" header-align="center" align="center">
				<template #default="scope">
					<el-progress
						:percentage="formatBatteryPercentage(scope.row.batteryPercent)"
						type="circle"
						:format="batteryFormat"
						:color="getBatteryColor(scope.row.batteryPercent)"
						:width="75"
					/>
				</template>
			</el-table-column>

			<el-table-column prop="temperature" label="Temperature" header-align="center" align="center"></el-table-column>
			<ma-dict-column prop="runningStatus" label="Running status" dict-type="device_running_status"></ma-dict-column>
			<el-table-column prop="upTime" label="Last online time" header-align="center" align="center"></el-table-column>
			<el-table-column label="Operation" fixed="right" header-align="center" align="center" width="150">
				<template #default="scope">
					<el-button v-auth="'iot:device:info'" type="primary" link @click="showDeviceDetailsHandle(scope.row)">Device details</el-button>
					<el-button v-auth="'iot:device:delete'" type="primary" link @click="deleteBatchHandle(scope.row.id)">Delete</el-button>
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
		<el-drawer v-if="deviceDetailsVisible" v-model="deviceDetailsVisible" :title="deviceDetailsTitle" :size="1000" :close-on-press-escape="false">
			<device-details :device-id="deviceId" :protocol-type="protocolType"></device-details>
		</el-drawer>
	</el-card>
</template>

<script setup lang="ts" name="IotDeviceIndex">
import { useCrud } from '@/hooks'
import { reactive, ref } from 'vue'
import { IHooksOptions } from '@/hooks/interface'
import DeviceDetails from './device-details.vue'
import AddOrUpdate from './add-or-update.vue'

const state: IHooksOptions = reactive({
	dataListUrl: '/iot/device/page',
	deleteUrl: '/iot/device',
	queryForm: {}
})

const queryRef = ref()
const addOrUpdateRef = ref()

const deviceDetailsVisible = ref(false)
const deviceDetailsTitle = ref()
const deviceId = ref()
const protocolType = ref()
const showDeviceDetailsHandle = (row: any) => {
	deviceId.value = row.id
	protocolType.value = row.protocolType
	deviceDetailsTitle.value = 'Device - ' + row.code + '-' + row.name
	deviceDetailsVisible.value = true
}

const addOrUpdateHandle = (id?: number) => {
	addOrUpdateRef.value.init(id)
}

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle, reset } = useCrud(state)

const batteryFormat = (percentage: number) => {
	return percentage === 100 ? 'Full' : `${percentage}%`
}

const formatBatteryPercentage = (percentage: number | undefined) => {
	return percentage !== undefined ? percentage : 0
}

const getBatteryColor = (percentage: any) => {
	if (percentage >= 80) {
		return '#67C23A'
	} // Green
	if (percentage >= 60) {
		return '#409EFF'
	} // Blue
	if (percentage >= 30) {
		return '#E6A23C'
	} // Yellow
	return '#F56C6C' // Red
}
</script>
