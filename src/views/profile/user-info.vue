<template>
	<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="100px">
		<el-form-item prop="realName" label="Name">
			<el-input v-model="dataForm.realName" placeholder="Name"></el-input>
		</el-form-item>
		<el-form-item prop="mobile" label="Mobile">
			<el-input v-model="dataForm.mobile" placeholder="Mobile phone number"></el-input>
		</el-form-item>
		<el-form-item prop="email" label="Email">
			<el-input v-model="dataForm.email" placeholder="Email"></el-input>
		</el-form-item>
		<el-form-item prop="gender" label="Gender">
			<ma-dict-radio v-model="dataForm.gender" dict-type="user_gender"></ma-dict-radio>
		</el-form-item>
		<el-form-item>
			<el-button type="primary" @click="handleDataForm">{{ $t('confirm') }}</el-button>
		</el-form-item>
	</el-form>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { validatePassword } from '@/utils/validate'
import { useUserInfoSubmitApi } from '@/api/sys/user'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/modules/user'

const userStore = useUserStore()
const { t } = useI18n()
const dataFormRef: any = ref(null)

const dataForm = reactive({
	realName: userStore.user.realName,
	mobile: userStore.user.mobile,
	email: userStore.user.email,
	gender: userStore.user.gender
})

const dataRules = ref({
	realName: [{ required: true, message: t('required'), trigger: 'blur' }],
	mobile: [{ required: true, validator: validatePassword, trigger: 'blur' }]
})

const handleDataForm = () => {
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}

		// Update logged-in user info
		useUserInfoSubmitApi(dataForm).then(() => {
			// Update state management
			userStore.user.realName = dataForm.realName
			userStore.user.mobile = dataForm.mobile
			userStore.user.email = dataForm.email
			userStore.user.gender = dataForm.gender

			ElMessage.success('Update succeeded')
		})
	})
}
</script>
