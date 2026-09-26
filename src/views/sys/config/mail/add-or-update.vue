<template>
	<el-drawer v-model="visible" :title="!dataForm.id ? 'Add' : 'Edit'" :size="800">
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="100px" @keyup.enter="submitHandle()">
			<el-form-item label="Platform type" prop="platform">
				<ma-dict-select v-model="dataForm.platform" dict-type="mail_platform" placeholder="Platform type" style="width: 100%"></ma-dict-select>
			</el-form-item>
			<el-form-item label="Group name" prop="groupName">
				<el-input v-model="dataForm.groupName" placeholder="Configurations with the same group name send mail in rotation"></el-input>
			</el-form-item>
			<el-divider></el-divider>
			<el-form-item label="Email account" prop="mailFrom" v-if="dataForm.platform == -1">
				<el-input v-model="dataForm.mailFrom" placeholder="Sender mailbox"></el-input>
			</el-form-item>
			<el-form-item label="Email password" prop="mailPass" v-if="dataForm.platform == -1">
				<el-input v-model="dataForm.mailPass" placeholder="Email password"></el-input>
			</el-form-item>
			<el-form-item label="SMTPServer" prop="mailHost" v-if="dataForm.platform == -1">
				<el-input v-model="dataForm.mailHost" placeholder="Required for enterprise mailboxes or self-hosted ones"></el-input>
			</el-form-item>
			<el-form-item label="SMTPPort" prop="mailPort" v-if="dataForm.platform == -1">
				<el-input v-model="dataForm.mailPort" placeholder="Default port 25"></el-input>
			</el-form-item>
			<el-form-item label="AccessKey" prop="accessKey" v-if="dataForm.platform != -1">
				<el-input v-model="dataForm.accessKey" placeholder="AccessKey"></el-input>
			</el-form-item>
			<el-form-item label="SecretKey" prop="secretKey" v-if="dataForm.platform != -1">
				<el-input v-model="dataForm.secretKey" placeholder="SecretKey"></el-input>
			</el-form-item>
			<el-form-item label="RegionId" prop="regionId" v-if="dataForm.platform != -1">
				<el-input v-model="dataForm.regionId" placeholder="RegionId"></el-input>
			</el-form-item>
			<el-form-item label="Endpoint" prop="endpoint" v-if="dataForm.platform == 0">
				<el-input v-model="dataForm.endpoint" placeholder="Alibaba Cloud endpoint"></el-input>
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
import { reactive, ref, watch } from 'vue'
import { ElMessage } from 'element-plus/es'
import { useMailConfigApi, useMailConfigSubmitApi } from '@/api/sys/mail'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataFormRef = ref()

const dataForm = reactive({
	id: '',
	platform: -1,
	groupName: '',
	mailHost: '',
	mailPort: '',
	mailFrom: '',
	mailPass: '',
	regionId: '',
	endpoint: '',
	accessKey: '',
	secretKey: '',
	status: '0'
})

const init = (id?: number) => {
	visible.value = true
	dataForm.id = ''

	// Reset form data
	if (dataFormRef.value) {
		dataFormRef.value.resetFields()
	}

	if (id) {
		getEmailPlatform(id)
	}
}

const getEmailPlatform = (id: number) => {
	useMailConfigApi(id).then(res => {
		Object.assign(dataForm, res.data)
	})
}

const dataRules = ref({
	platform: [{ required: true, message: 'Required fields cannot be empty', trigger: 'blur' }],
	groupName: [{ required: true, message: 'Required fields cannot be empty', trigger: 'blur' }],
	mailFrom: [{ required: true, message: 'Required fields cannot be empty', trigger: 'blur' }],
	mailPass: [{ required: true, message: 'Required fields cannot be empty', trigger: 'blur' }],
	regionId: [{ required: true, message: 'Required fields cannot be empty', trigger: 'blur' }],
	endpoint: [{ required: true, message: 'Required fields cannot be empty', trigger: 'blur' }],
	accessKey: [{ required: true, message: 'Required fields cannot be empty', trigger: 'blur' }],
	secretKey: [{ required: true, message: 'Required fields cannot be empty', trigger: 'blur' }]
})

// Form submission
const submitHandle = () => {
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}

		useMailConfigSubmitApi(dataForm).then(() => {
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
