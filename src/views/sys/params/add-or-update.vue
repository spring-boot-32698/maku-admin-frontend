<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? 'Add' : 'Edit'" :close-on-click-modal="false" :width="600">
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="100px" @keyup.enter="submitHandle()">
			<el-form-item label="Parameter name" prop="paramName">
				<el-input v-model="dataForm.paramName" placeholder="Parameter name"></el-input>
			</el-form-item>
			<el-form-item label="Parameter key" prop="paramKey">
				<el-input v-model="dataForm.paramKey" placeholder="Parameter key"></el-input>
			</el-form-item>
			<el-form-item label="Parameter value" prop="paramValue">
				<el-input v-model="dataForm.paramValue" placeholder="Parameter value"></el-input>
			</el-form-item>
			<el-form-item label="Remarks" prop="remark">
				<el-input v-model="dataForm.remark" placeholder="Remarks"></el-input>
			</el-form-item>
			<el-form-item label="System parameters" prop="paramType">
				<ma-dict-radio v-model="dataForm.paramType" dict-type="params_type"></ma-dict-radio>
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
import { useParamsApi, useParamsSubmitApi } from '@/api/sys/params'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataFormRef = ref()

const dataForm = reactive({
	id: '',
	paramName: '',
	paramType: 0,
	paramKey: '',
	paramValue: '',
	remark: ''
})

const init = (id?: number) => {
	visible.value = true
	dataForm.id = ''

	// Reset form data
	if (dataFormRef.value) {
		dataFormRef.value.resetFields()
	}

	if (id) {
		getParams(id)
	}
}

const getParams = (id: number) => {
	useParamsApi(id).then(res => {
		Object.assign(dataForm, res.data)
	})
}

const dataRules = ref({
	paramName: [{ required: true, message: 'Required fields cannot be empty', trigger: 'blur' }],
	paramType: [{ required: true, message: 'Required fields cannot be empty', trigger: 'blur' }],
	paramKey: [{ required: true, message: 'Required fields cannot be empty', trigger: 'blur' }],
	paramValue: [{ required: true, message: 'Required fields cannot be empty', trigger: 'blur' }]
})

// Form submission
const submitHandle = () => {
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}

		useParamsSubmitApi(dataForm).then(() => {
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
