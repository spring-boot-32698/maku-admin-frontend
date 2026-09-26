<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? 'Add' : 'Edit'" :close-on-click-modal="false" draggable>
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="120px" @keyup.enter="submitHandle()">
			<el-form-item prop="name" label="Name">
				<el-input v-model="dataForm.name" placeholder="Name"></el-input>
			</el-form-item>
			<el-form-item prop="pid" label="Parent organization">
				<ma-org-select v-model="dataForm.pid" placeholder="Please select"></ma-org-select>
			</el-form-item>
			<el-form-item prop="leaderId" label="Person in charge">
				<ma-user-input v-model="dataForm.leaderId" placeholder="Organization head"></ma-user-input>
			</el-form-item>
			<el-form-item prop="sort" label="Sort">
				<el-input-number v-model="dataForm.sort" controls-position="right" :min="0" aria-label="Sort"></el-input-number>
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
import { useOrgSubmitApi } from '@/api/sys/orgs'
import MaUserInput from '@/components/ma-user/ma-user-input/index.vue'
import MaOrgSelect from '@/components/ma-org/ma-org-select/index.vue'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataFormRef = ref()

const dataForm = reactive({
	id: '',
	name: '',
	pid: '',
	parentName: '',
	leaderId: '',
	sort: 0
})

const init = (isUpdate: boolean, row: any) => {
	visible.value = true

	// Reset form data
	if (dataFormRef.value) {
		dataFormRef.value.resetFields()
	}

	// Update form data
	if (row) {
		getOrg(isUpdate, row)
	} else {
		dataForm.id = ''
		dataForm.pid = ''
		dataForm.parentName = ''
		dataForm.name = ''
		dataForm.sort = 0
		dataForm.leaderId = ''
	}
}

// Get info
const getOrg = (isUpdate: boolean, row: any) => {
	Object.assign(dataForm, row)
	if (!isUpdate) {
		// If adding, reset the form data
		dataForm.pid = dataForm.id
		dataForm.parentName = dataForm.name
		dataForm.id = ''
		dataForm.name = ''
		dataForm.sort = 0
	}
}

const dataRules = ref({
	name: [{ required: true, message: 'Required fields cannot be empty', trigger: 'blur' }],
	parentName: [{ required: true, message: 'Required fields cannot be empty', trigger: 'blur' }]
})

// Form submission
const submitHandle = () => {
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}

		useOrgSubmitApi(dataForm).then(() => {
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
