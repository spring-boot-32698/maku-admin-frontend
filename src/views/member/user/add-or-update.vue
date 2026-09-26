<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? 'Add' : 'Edit'" :close-on-click-modal="false">
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="100px" @keyup.enter="submitHandle()">
			<el-form-item label="Nickname" prop="nickName">
				<el-input v-model="dataForm.nickName" placeholder="Nickname"></el-input>
			</el-form-item>
			<el-form-item label="Mobile number" prop="mobile">
				<el-input v-model="dataForm.mobile" placeholder="Mobile number"></el-input>
			</el-form-item>
			<el-form-item label="Avatar" prop="avatar">
				<el-input v-model="dataForm.avatar" placeholder="Avatar"></el-input>
			</el-form-item>
			<el-form-item label="Date of birth" prop="birthday">
				<el-input v-model="dataForm.birthday" placeholder="Date of birth"></el-input>
			</el-form-item>
			<el-form-item label="Gender" prop="gender">
				<el-input v-model="dataForm.gender" placeholder="Gender"></el-input>
			</el-form-item>
			<el-form-item label="Remarks" prop="remark">
				<el-input v-model="dataForm.remark" placeholder="Remarks"></el-input>
			</el-form-item>
			<el-form-item label="Status" prop="status">
				<el-input v-model="dataForm.status" placeholder="Status"></el-input>
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
import { useUserApi, useUserSubmitApi } from '@/api/member/user'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataFormRef = ref()

const dataForm = reactive({
	id: '',
	nickName: '',
	mobile: '',
	avatar: '',
	birthday: '',
	gender: '',
	remark: '',
	status: ''
})

const init = (id?: number) => {
	visible.value = true
	dataForm.id = ''

	// Reset form data
	if (dataFormRef.value) {
		dataFormRef.value.resetFields()
	}

	if (id) {
		getUser(id)
	}
}

const getUser = (id: number) => {
	useUserApi(id).then(res => {
		Object.assign(dataForm, res.data)
	})
}

const dataRules = ref({})

// Form submission
const submitHandle = () => {
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}

		useUserSubmitApi(dataForm).then(() => {
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
