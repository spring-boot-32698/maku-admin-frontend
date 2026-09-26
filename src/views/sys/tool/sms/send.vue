<template>
	<el-drawer v-model="visible" title="Send SMS" :size="800">
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="100px" @keyup.enter="submitHandle()">
			<el-tabs v-model="dataForm.platform">
				<el-tab-pane label="Alibaba Cloud" :name="0"> </el-tab-pane>
				<el-tab-pane label="Tencent Cloud" :name="1"> </el-tab-pane>
				<el-tab-pane label="Qiniu Cloud" :name="2"> </el-tab-pane>
				<el-tab-pane label="Huawei Cloud" :name="3"> </el-tab-pane>
			</el-tabs>
			<el-form-item label="SMS template" prop="id">
				<ma-data-select
					:key="dataForm.platform"
					v-model="dataForm.id"
					:url="`/sys/sms/config/list?platform=${dataForm.platform}`"
					:props="{ label: 'templateId', value: 'id' }"
					placeholder="Select SMS template"
				></ma-data-select>
			</el-form-item>
			<el-form-item label="Mobile number" prop="mobile">
				<el-input v-model="dataForm.mobile" placeholder="Mobile number"></el-input>
			</el-form-item>
			<el-form-item v-if="dataForm.platform == 0 || dataForm.platform == 2" label="Parameter Key" prop="paramKey">
				<el-input v-model="dataForm.paramKey" placeholder="Parameter Key"></el-input>
			</el-form-item>
			<el-form-item label="Parameter Value" prop="paramValue">
				<el-input v-model="dataForm.paramValue" placeholder="Parameter Value"></el-input>
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
import { useSmsSendApi } from '@/api/sys/sms'
const emit = defineEmits(['refreshDataList'])

const visible = defineModel<Boolean>()

const dataFormRef = ref()
const dataForm = reactive({
	id: '',
	platform: 0,
	paramKey: '',
	paramValue: '',
	mobile: ''
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
	mobile: [{ required: true, message: 'Required fields cannot be empty', trigger: 'blur' }]
})

// Form submission
const submitHandle = () => {
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}

		useSmsSendApi(dataForm).then(() => {
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
