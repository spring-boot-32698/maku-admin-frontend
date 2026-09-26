<template>
	<el-drawer v-model="visible" title="Mail log details" :size="1000">
		<el-form label-width="100px">
			<el-row>
				<el-col :span="12">
					<el-form-item label="Log ID" prop="id">
						<el-input v-model="dataForm.id" disabled></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="Platform ID" prop="platformId">
						<el-input v-model="dataForm.platformId" disabled></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="12">
					<el-form-item label="Platform type" prop="platform">
						<ma-dict-select v-model="dataForm.platform" dict-type="mail_platform" disabled style="width: 100%"></ma-dict-select>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="Status" prop="status">
						<el-tag v-if="dataForm.status === 0" type="danger">Failed</el-tag>
						<el-tag v-else type="success">Success</el-tag>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="12">
					<el-form-item label="Sender" prop="mailFrom">
						<el-input v-model="dataForm.mailFrom" disabled></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="Send time" prop="createTime">
						<el-input v-model="dataForm.createTime" disabled></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-form-item label="Recipient" prop="mailTos">
				<el-input v-model="dataForm.mailTos" disabled></el-input>
			</el-form-item>
			<el-form-item label="Topic" prop="subject">
				<el-input v-model="dataForm.subject" disabled></el-input>
			</el-form-item>
			<el-form-item label="Content" prop="content">
				<div v-html="dataForm.content"></div>
			</el-form-item>
			<el-form-item v-if="dataForm.status === 0" label="Error message" prop="error">
				<el-input v-model="dataForm.error" :rows="12" type="textarea" disabled />
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button type="primary" @click="visible = false">Close</el-button>
		</template>
	</el-drawer>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

const visible = ref(false)
const dataForm = reactive({
	id: '',
	platformId: '',
	platform: '',
	mailFrom: '',
	status: 0,
	mailTos: '',
	subject: '',
	content: '',
	error: '',
	createTime: ''
})

const init = (data?: any) => {
	visible.value = true

	Object.assign(dataForm, data)
}

defineExpose({
	init
})
</script>
