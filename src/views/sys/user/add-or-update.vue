<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? 'Add' : 'Edit'" :close-on-click-modal="false" draggable>
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="120px" @keyup.enter="submitHandle()">
			<el-row>
				<el-col :span="12">
					<el-form-item prop="username" label="Username">
						<el-input v-model="dataForm.username" placeholder="Username"></el-input>
					</el-form-item>
					<el-form-item prop="orgId" label="Organization">
						<ma-org-select v-model="dataForm.orgId" placeholder="Please select"></ma-org-select>
					</el-form-item>
					<el-form-item prop="leaderId" label="Direct supervisor">
						<ma-user-input v-model="dataForm.leaderId" placeholder="Please select"></ma-user-input>
					</el-form-item>
					<el-form-item prop="mobile" label="Mobile number">
						<el-input v-model="dataForm.mobile" placeholder="Mobile number"></el-input>
					</el-form-item>
					<el-form-item prop="password" label="Password">
						<el-input v-model="dataForm.password" type="password" placeholder="Password"></el-input>
					</el-form-item>
					<el-form-item prop="postIdList" label="Post">
						<el-select v-model="dataForm.postIdList" multiple placeholder="Post" style="width: 100%">
							<el-option v-for="post in postList" :key="post.id" :label="post.postName" :value="post.id"></el-option>
						</el-select>
					</el-form-item>
				</el-col>

				<el-col :span="12">
					<el-form-item prop="realName" label="Name">
						<el-input v-model="dataForm.realName" placeholder="Name"></el-input>
					</el-form-item>
					<el-form-item prop="gender" label="Gender">
						<ma-dict-radio v-model="dataForm.gender" dict-type="user_gender"></ma-dict-radio>
					</el-form-item>
					<el-form-item prop="email" label="Email">
						<el-input v-model="dataForm.email" placeholder="Email"></el-input>
					</el-form-item>
					<el-form-item prop="roleIdList" label="Role">
						<el-select v-model="dataForm.roleIdList" multiple placeholder="Role" style="width: 100%">
							<el-option v-for="role in roleList" :key="role.id" :label="role.name" :value="role.id"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item prop="status" label="Status">
						<ma-dict-radio v-model="dataForm.status" dict-type="user_status"></ma-dict-radio>
					</el-form-item>
				</el-col>
			</el-row>
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
import { useUserApi, useUserSubmitApi } from '@/api/sys/user'
import { usePostListApi } from '@/api/sys/post'
import { useRoleListApi } from '@/api/sys/role'
import MaUserInput from '@/components/ma-user/ma-user-input/index.vue'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const postList = ref<any[]>([])
const roleList = ref<any[]>([])
const dataFormRef = ref()

const dataForm = reactive({
	id: '',
	username: '',
	realName: '',
	orgId: '',
	leaderId: '',
	password: '',
	gender: 0,
	email: '',
	mobile: '',
	roleIdList: [] as any[],
	postIdList: [] as any[],
	status: 1
})

const init = (id?: number) => {
	visible.value = true
	dataForm.id = ''

	// Reset form data
	if (dataFormRef.value) {
		dataFormRef.value.resetFields()
	}

	// id If it exists, it is an update
	if (id) {
		getUser(id)
	}

	getPostList()
	getRoleList()
}

// Get post list
const getPostList = async () => {
	let res = await usePostListApi()
	postList.value = res.data
}

// Get role list
const getRoleList = async () => {
	let res = await useRoleListApi()
	roleList.value = res.data
}

// Get info
const getUser = (id: number) => {
	useUserApi(id).then(res => {
		Object.assign(dataForm, res.data)
	})
}

const dataRules = ref({
	username: [{ required: true, message: 'Required fields cannot be empty', trigger: 'blur' }],
	realName: [{ required: true, message: 'Required fields cannot be empty', trigger: 'blur' }],
	mobile: [{ required: true, message: 'Required fields cannot be empty', trigger: 'blur' }],
	orgId: [{ required: true, message: 'Required fields cannot be empty', trigger: 'blur' }]
})

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
