<template>
	<el-drawer v-model="visible" title="Send mail" :size="1000">
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="100px" label-position="top">
			<el-tabs v-model="dataForm.platform">
				<el-tab-pane label="Local mail" :name="-1"> </el-tab-pane>
				<el-tab-pane label="Alibaba Cloud mail" :name="0"> </el-tab-pane>
			</el-tabs>
			<el-form-item label="Mail group" prop="id">
				<ma-data-select
					:key="dataForm.platform"
					v-model="dataForm.id"
					:url="`/sys/mail/config/list?platform=${dataForm.platform}`"
					:props="{ label: 'groupName', value: 'id' }"
					placeholder="Select mail group"
				></ma-data-select>
			</el-form-item>
			<el-form-item label="Send method" prop="mailFormat">
				<el-radio-group v-model="dataForm.mailFormat">
					<el-radio value="text">Plain text</el-radio>
					<el-radio value="html">HTML</el-radio>
					<el-radio v-if="dataForm.platform === 0" value="template">Template mail</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item v-if="dataForm.platform === 0" label="Sender email" prop="mailFrom">
				<el-input v-model="dataForm.mailFrom" placeholder="Sender email"></el-input>
			</el-form-item>
			<el-form-item v-if="dataForm.platform === 0 && dataForm.mailFormat !== 'template'" label="Sender nickname" prop="formAlias">
				<el-input v-model="dataForm.formAlias" placeholder="Sender nickname"></el-input>
			</el-form-item>
			<el-form-item v-if="dataForm.mailFormat === 'template'" label="Recipient list" prop="receiversName">
				<el-input v-model="dataForm.receiversName" placeholder="Recipient list name"></el-input>
			</el-form-item>
			<el-form-item v-if="dataForm.mailFormat === 'template'" label="Template name" prop="templateName">
				<el-input v-model="dataForm.templateName" placeholder="Template name"></el-input>
			</el-form-item>
			<el-form-item v-if="dataForm.mailFormat === 'template'" label="Label name" prop="tagName">
				<el-input v-model="dataForm.tagName" placeholder="Label name"></el-input>
			</el-form-item>
			<el-form-item v-if="dataForm.mailFormat !== 'template'" label="Recipient email" prop="mailTos">
				<el-input v-model="dataForm.mailTos" type="textarea" :rows="2" placeholder="Recipient email, separate multiple emails with English commas"></el-input>
			</el-form-item>
			<el-form-item v-if="dataForm.mailFormat !== 'template'" label="Mail subject" prop="subject">
				<el-input v-model="dataForm.subject" placeholder="Mail subject"></el-input>
			</el-form-item>
			<el-form-item v-if="dataForm.mailFormat !== 'template'" label="Mail body" prop="content">
				<el-input v-if="dataForm.mailFormat === 'text'" v-model="dataForm.content" type="textarea" :rows="12"></el-input>
				<ma-editor v-else v-model="dataForm.content"></ma-editor>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="visible = false">Cancel</el-button>
			<el-button type="primary" @click="submitHandle()">Send</el-button>
		</template>
	</el-drawer>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { ElMessage } from 'element-plus/es'
import { useMailSendApi } from '@/api/sys/mail'
const emit = defineEmits(['refreshDataList'])

const visible = defineModel<Boolean>()

const dataFormRef = ref()
const dataForm = reactive({
	id: '',
	platform: -1,
	mailFormat: 'text',
	mailFrom: '',
	formAlias: '',
	mailTos: '',
	receiversName: '',
	templateName: '',
	tagName: '',
	subject: '',
	content: ''
})

watch(
	() => dataForm.platform,
	val => {
		// Reset form data
		if (dataFormRef.value) {
			dataFormRef.value.resetFields()
		}
	}
)

const dataRules = ref({
	id: [{ required: true, message: 'Required fields cannot be empty', trigger: 'blur' }],
	mailFormat: [{ required: true, message: 'Required fields cannot be empty', trigger: 'blur' }],
	mailFrom: [{ required: true, message: 'Required fields cannot be empty', trigger: 'blur' }],
	mailTos: [{ required: true, message: 'Required fields cannot be empty', trigger: 'blur' }],
	receiversName: [{ required: true, message: 'Required fields cannot be empty', trigger: 'blur' }],
	templateName: [{ required: true, message: 'Required fields cannot be empty', trigger: 'blur' }],
	subject: [{ required: true, message: 'Required fields cannot be empty', trigger: 'blur' }],
	content: [{ required: true, message: 'Required fields cannot be empty', trigger: 'blur' }]
})

// Form submission
const submitHandle = () => {
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}

		useMailSendApi(dataForm).then(() => {
			ElMessage.success({
				message: 'Sent successfully',
				duration: 500,
				onClose: () => {
					visible.value = false
					emit('refreshDataList')
				}
			})
		})
	})
}
</script>
