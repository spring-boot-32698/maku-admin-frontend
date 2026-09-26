<template>
	<div class="card-container">
		<el-divider content-position="left">Device identifier</el-divider>
		<el-row :gutter="30">
			<el-col :span="12">
				<el-form-item label="Code">
					<el-input v-model="dataForm.code" disabled />
				</el-form-item>
			</el-col>
			<el-col :span="12">
				<el-form-item label="Device name">
					<el-input v-model="dataForm.name" disabled />
				</el-form-item>
			</el-col>
			<el-col :span="12">
				<el-form-item label="Unique identifier">
					<el-input v-model="dataForm.uid" disabled />
				</el-form-item>
			</el-col>
			<el-col :span="12">
				<el-form-item label="Device type">
					<ma-dict-select v-model="dataForm.type" dict-type="device_type" disabled style="width: 100%"></ma-dict-select>
				</el-form-item>
			</el-col>
		</el-row>
		<el-divider content-position="left">Basic information</el-divider>
		<el-row :gutter="30">
			<el-col :span="12">
				<el-form-item label="Device status">
					<ma-dict-select v-model="dataForm.status" dict-type="enable_disable" disabled style="width: 100%"></ma-dict-select>
				</el-form-item>
			</el-col>
			<el-col :span="12">
				<el-form-item label="Running status">
					<ma-dict-select v-model="dataForm.runningStatus" dict-type="device_running_status" disabled style="width: 100%"></ma-dict-select>
				</el-form-item>
			</el-col>
		</el-row>
		<el-row :gutter="30">
			<el-col :span="12">
				<el-form-item label="Online time">
					<el-input v-model="dataForm.upTime" disabled />
				</el-form-item>
			</el-col>
			<el-col :span="12">
				<el-form-item label="Offline time">
					<el-input v-model="dataForm.downTime" disabled />
				</el-form-item>
			</el-col>
		</el-row>
		<el-row :gutter="30">
			<el-col :span="12">
				<el-form-item label="Communication protocol">
					<el-input v-model="dataForm.protocolType" disabled />
				</el-form-item>
			</el-col>
			<el-col :span="12">
				<el-form-item label="Device version">
					<el-input v-model="dataForm.appVersion" disabled />
				</el-form-item>
			</el-col>
		</el-row>
		<el-row :gutter="30">
			<el-col :span="12">
				<el-form-item label="Battery level">
					<el-input v-model="dataForm.batteryPercent" disabled />
				</el-form-item>
			</el-col>
			<el-col :span="12">
				<el-form-item label="Device temperature">
					<el-input v-model="dataForm.temperature" disabled />
				</el-form-item>
			</el-col>
		</el-row>
		<el-divider content-position="left">Create info</el-divider>
		<el-row :gutter="30">
			<el-col :span="12">
				<el-form-item label="Creation time">
					<el-input v-model="dataForm.createTime" disabled />
				</el-form-item>
			</el-col>
			<el-col :span="12">
				<el-form-item label="Update time">
					<el-input v-model="dataForm.updateTime" disabled />
				</el-form-item>
			</el-col>
		</el-row>
	</div>
</template>

<script setup lang="ts">
import { defineProps, onMounted, reactive, ref } from 'vue'
import { useIotDeviceApi } from '@/api/iot/device'

const visible = ref(false)
const dataFormRef = ref()

const dataForm = reactive({
	id: '',
	code: '',
	name: '',
	type: '',
	uid: '',
	secret: '',
	appVersion: '',
	batteryPercent: '',
	temperature: '',
	protocolType: '',
	status: '',
	runningStatus: '',
	upTime: '',
	downTime: '',
	createTime: '',
	updateTime: ''
})

const props = defineProps({
	deviceId: {
		type: Number,
		required: true
	}
})
const init = () => {
	visible.value = true
	// Reset form data
	if (dataFormRef.value) {
		dataFormRef.value.resetFields()
	}

	if (props.deviceId) {
		getIot_device(props.deviceId)
	}
}

const getIot_device = (id: number) => {
	useIotDeviceApi(id).then(res => {
		Object.assign(dataForm, res.data)
	})
}

onMounted(() => {
	init()
})
</script>
<style scoped>
.card-container {
	display: flex;
	flex-direction: column;
	gap: 20px;
}
</style>
