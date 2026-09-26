<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? 'Add' : 'Edit'" :close-on-click-modal="false">
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="100px" @keyup.enter="submitHandle()">
			<el-form-item label="Code" prop="code">
				<el-input v-model="dataForm.code" placeholder="Code"></el-input>
			</el-form-item>
			<el-form-item label="Name" prop="name">
				<el-input v-model="dataForm.name" placeholder="Name"></el-input>
			</el-form-item>
			<el-form-item label="Device type" prop="type">
				<ma-dict-select v-model="dataForm.type" dict-type="device_type" placeholder="Device type" clearable></ma-dict-select>
			</el-form-item>
			<el-form-item label="Unique identifier" prop="uid">
				<el-input v-model="dataForm.uid" placeholder="Unique identifier"></el-input>
			</el-form-item>
			<el-form-item label="Communication protocol" prop="protocolType">
				<el-select v-model="dataForm.protocolType" placeholder="Communication protocol" style="width: 100%">
					<el-option label="MQTT" value="MQTT"></el-option>
					<el-option label="TCP" value="TCP"></el-option>
					<el-option label="Modbus" value="Modbus" disabled></el-option>
					<el-option label="CoAP" value="CoAP" disabled></el-option>
					<el-option label="LwM2M" value="LwM2M" disabled></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="Device key" prop="secret">
				<el-input v-model="dataForm.secret" placeholder="Device key"></el-input>
			</el-form-item>
			<el-form-item label="Status" prop="status">
				<ma-dict-radio v-model="dataForm.status" dict-type="enable_disable"></ma-dict-radio>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="visible = false">Cancel</el-button>
			<el-button type="primary" @click="submitHandle()">OK</el-button>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus/es'
import { useIotDeviceApi, useIotDeviceSubmitApi } from '@/api/iot/device'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataFormRef = ref()

const dataForm = reactive({
	id: '',
	code: '',
	name: '',
	type: '',
	uid: '',
	protocolType: '',
	secret: '',
	status: '1'
})

const init = (id?: number) => {
	visible.value = true
	dataForm.id = ''

	// Reset form data
	if (dataFormRef.value) {
		dataFormRef.value.resetFields()
	}

	if (id) {
		getIot_device(id)
	}
}

const getIot_device = (id: number) => {
	useIotDeviceApi(id).then(res => {
		Object.assign(dataForm, res.data)
	})
}

const dataRules = ref({
	code: [{ required: true, message: 'Code cannot be empty', trigger: 'blur' }],
	name: [{ required: true, message: 'Name cannot be empty', trigger: 'blur' }],
	type: [{ required: true, message: 'Device type cannot be empty', trigger: 'blur' }],
	uid: [{ required: true, message: 'Unique identifier cannot be empty', trigger: 'blur' }],
	secret: [{ required: true, message: 'Device key cannot be empty', trigger: 'blur' }],
	status: [{ required: true, message: 'Status cannot be empty', trigger: 'blur' }],
	protocolType: [{ required: true, message: 'Communication protocol cannot be empty', trigger: 'blur' }]
})

// Form submission
const submitHandle = () => {
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}

		useIotDeviceSubmitApi(dataForm).then(() => {
			ElMessage.success({
				message: 'Operation succeeded',
				duration: 500,
				onClose: () => {
					visible.value = false
					emit('refreshDataList')
				}
			})
		})
	})
}

defineExpose({
	init
})
</script>
