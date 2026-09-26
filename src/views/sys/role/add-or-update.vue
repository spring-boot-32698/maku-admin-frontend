<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? 'Add' : 'Edit'" :close-on-click-modal="false" draggable>
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="120px" @keyup.enter="submitHandle()">
			<el-form-item prop="name" label="Name">
				<el-input v-model="dataForm.name" placeholder="Name"></el-input>
			</el-form-item>
			<el-form-item prop="roleCode" label="Code">
				<el-input v-model="dataForm.roleCode" placeholder="Code"></el-input>
			</el-form-item>
			<el-form-item prop="remark" label="Remarks">
				<el-input v-model="dataForm.remark" placeholder="Remarks"></el-input>
			</el-form-item>
			<el-form-item label="Menu permission">
				<el-tree ref="menuListTree" :data="menuList" :props="{ label: 'name', children: 'children' }" node-key="id" accordion show-checkbox></el-tree>
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
import { useRoleApi, useRoleMenuApi, useRoleSubmitApi } from '@/api/sys/role'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const menuList = ref([])
const menuListTree = ref()
const dataFormRef = ref()

const dataForm = reactive({
	id: '',
	name: '',
	roleCode: '',
	menuIdList: [] as any[],
	orgIdList: [],
	remark: ''
})

const init = async (id?: number) => {
	visible.value = true
	dataForm.id = ''

	// Reset form data
	if (dataFormRef.value) {
		dataFormRef.value.resetFields()
	}
	if (menuListTree.value) {
		menuListTree.value.setCheckedKeys([])
	}

	// Menu list
	await getMenuList()

	// id If it exists, it is an update
	if (id) {
		getRole(id)
	}
}

// Get menu list
const getMenuList = async () => {
	const res = await useRoleMenuApi()
	menuList.value = res.data
}

// Get info
const getRole = (id: number) => {
	useRoleApi(id).then(res => {
		Object.assign(dataForm, res.data)

		dataForm.menuIdList.forEach(item => menuListTree.value.setChecked(item, true))
	})
}

const dataRules = ref({
	name: [{ required: true, message: 'Required fields cannot be empty', trigger: 'blur' }],
	roleCode: [{ required: true, message: 'Required fields cannot be empty', trigger: 'blur' }]
})

// Form submission
const submitHandle = () => {
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}
		dataForm.menuIdList = [...menuListTree.value.getHalfCheckedKeys(), ...menuListTree.value.getCheckedKeys()]

		useRoleSubmitApi(dataForm).then(() => {
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
