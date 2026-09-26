<template>
	<el-drawer v-model="visible" :title="!dataForm.id ? 'Add' : 'Edit'" :size="800">
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="100px" @keyup.enter="submitHandle()">
			<el-form-item label="Platform type" prop="platform">
				<ma-dict-select v-model="dataForm.platform" dict-type="sms_platform" placeholder="Platform type" style="width: 100%"></ma-dict-select>
			</el-form-item>
			<el-form-item label="Group name" prop="groupName">
				<el-input v-model="dataForm.groupName" placeholder="Configurations with the same group name send SMS in rotation"></el-input>
			</el-form-item>
			<el-divider></el-divider>
			<el-form-item v-if="dataForm.platform == 3" label="Access address" prop="url">
				<el-input v-model="dataForm.url" placeholder="APPAccess address"></el-input>
			</el-form-item>
			<el-form-item v-if="dataForm.platform == 1" label="AppId" prop="appId">
				<el-input v-model="dataForm.appId" placeholder="AppId"></el-input>
			</el-form-item>
			<el-form-item v-if="dataForm.platform != 2" label="SMS signature" prop="signName">
				<el-input v-model="dataForm.signName" placeholder="SMS signature"></el-input>
			</el-form-item>
			<el-form-item label="SMS template" prop="templateId">
				<el-input v-model="dataForm.templateId" placeholder="SMS template"></el-input>
			</el-form-item>
			<el-form-item label="AccessKey" prop="accessKey">
				<el-input v-model="dataForm.accessKey" placeholder="AccessKey"></el-input>
			</el-form-item>
			<el-form-item label="SecretKey" prop="secretKey">
				<el-input v-model="dataForm.secretKey" placeholder="SecretKey"></el-input>
			</el-form-item>
			<el-form-item v-if="dataForm.platform == 1" label="SenderId" prop="senderId">
				<el-input v-model="dataForm.senderId" placeholder="Required for international SMS"></el-input>
			</el-form-item>
			<el-form-item v-if="dataForm.platform == 3" label="Channel number" prop="senderId">
				<el-input v-model="dataForm.senderId" placeholder="Channel number is required"></el-input>
			</el-form-item>
			<el-form-item label="Status" prop="status">
				<ma-dict-radio v-model="dataForm.status" dict-type="enable_disable"></ma-dict-radio>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="visible = false">Cancel</el-button>
			<el-button type="primary" @click="submitHandle()">OK</el-button>
		</template>
	</el-drawer>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus/es'
import { useSmsConfigApi, useSmsConfigSubmitApi } from '@/api/sys/sms'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataFormRef = ref()

const dataForm = reactive({
	id: '',
	platform: 0,
	groupName: '',
	signName: '',
	templateId: '',
	appId: '',
	senderId: '',
	url: '',
	accessKey: '',
	secretKey: '',
	status: 0,
	version: '',
	createTime: ''
})

const init = (id?: number) => {
	visible.value = true
	dataForm.id = ''

	// Reset form data
	if (dataFormRef.value) {
		dataFormRef.value.resetFields()
	}

	if (id) {
		getSmsPlatform(id)
	}
}

const getSmsPlatform = (id: number) => {
	useSmsConfigApi(id).then(res => {
		Object.assign(dataForm, res.data)
	})
}

const dataRules = ref({
	platform: [{ required: true, message: 'Required fields cannot be empty', trigger: 'blur' }],
	groupName: [{ required: true, message: 'Required fields cannot be empty', trigger: 'blur' }],
	appId: [{ required: true, message: 'Required fields cannot be empty', trigger: 'blur' }],
	signName: [{ required: true, message: 'Required fields cannot be empty', trigger: 'blur' }],
	templateId: [{ required: true, message: 'Required fields cannot be empty', trigger: 'blur' }],
	url: [{ required: true, message: 'Required fields cannot be empty', trigger: 'blur' }],
	accessKey: [{ required: true, message: 'Required fields cannot be empty', trigger: 'blur' }],
	secretKey: [{ required: true, message: 'Required fields cannot be empty', trigger: 'blur' }]
})

// Form submission
const submitHandle = () => {
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}

		useSmsConfigSubmitApi(dataForm).then(() => {
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
