<template>
	<el-dialog v-model="visible" title="Data permission" :close-on-click-modal="false" :width="600" draggable>
		<el-form ref="dataFormRef" :model="dataForm" label-width="120px" @keyup.enter="submitHandle()">
			<el-form-item prop="name" label="Name">
				<el-input v-model="dataForm.name" disabled></el-input>
			</el-form-item>
			<el-form-item prop="dataScope" label="Data scope">
				<ma-dict-select v-model="dataForm.dataScope" dict-type="role_data_scope" placeholder="Data scope" style="width: 100%"></ma-dict-select>
			</el-form-item>
			<el-form-item v-show="dataForm.dataScope == 4" label="Data permission">
				<el-tree ref="orgListTree" :data="orgList" :props="{ label: 'name', children: 'children' }" node-key="id" accordion show-checkbox> </el-tree>
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
import { useRoleApi, useRoleDataScopeSubmitApi } from '@/api/sys/role'
import { useOrgListApi } from '@/api/sys/orgs'

const visible = ref(false)
const orgList = ref([])
const orgListTree = ref()
const dataFormRef = ref()

const dataForm = reactive({
	id: '',
	name: '',
	orgIdList: [],
	dataScope: 0,
	remark: ''
})

const init = (id?: number) => {
	visible.value = true
	dataForm.id = ''

	// Reset form data
	if (dataFormRef.value) {
		dataFormRef.value.resetFields()
	}
	if (orgListTree.value) {
		orgListTree.value.setCheckedKeys([])
	}

	// id If it exists, it is an update
	if (id) {
		getRole(id)
	}

	// Organization list
	getOrgList()
}

// Get organization list
const getOrgList = async () => {
	const res = await useOrgListApi()
	orgList.value = res.data
}

// Get info
const getRole = (id: number) => {
	useRoleApi(id).then(res => {
		Object.assign(dataForm, res.data)

		orgListTree.value.setCheckedKeys(dataForm.orgIdList)
	})
}

// Form submission
const submitHandle = () => {
	dataForm.orgIdList = orgListTree.value.getCheckedKeys()

	useRoleDataScopeSubmitApi(dataForm).then(() => {
		ElMessage.success({
			message: 'Operation succeeded',
			duration: 500,
			onClose: () => {
				visible.value = false
			}
		})
	})
}

defineExpose({
	init
})
</script>
