<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? 'Add' : 'Edit'" :close-on-click-modal="false" draggable>
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="80px">
			<el-form-item prop="dictType" label="Dictionary type">
				<el-input v-model="dataForm.dictType" placeholder="Dictionary type"></el-input>
			</el-form-item>
			<el-form-item prop="dictName" label="Dictionary name">
				<el-input v-model="dataForm.dictName" placeholder="Dictionary name"></el-input>
			</el-form-item>
			<el-form-item prop="pid" label="Parent node">
				<ma-data-tree-select
					v-model="dataForm.pid"
					url="/sys/dict/type/list"
					:props="{ label: 'dictType', children: 'children' }"
					placeholder="Please select a parent"
				></ma-data-tree-select>
			</el-form-item>
			<el-form-item prop="sort" label="Sort">
				<el-input-number v-model="dataForm.sort" controls-position="right" :min="0" aria-label="Sort"></el-input-number>
			</el-form-item>
			<el-form-item prop="remark" label="Remarks">
				<el-input v-model="dataForm.remark" placeholder="Remarks"></el-input>
			</el-form-item>
			<el-form-item label="Data source" prop="dictSource">
				<el-radio-group v-model="dataForm.dictSource">
					<el-radio-button :value="0">Dictionary data</el-radio-button>
					<el-radio-button :value="1">Dynamic SQL</el-radio-button>
				</el-radio-group>
			</el-form-item>
			<el-form-item v-if="dataForm.dictSource === 1" prop="dictSql" label="Dynamic SQL">
				<el-input
					v-model="dataForm.dictSql"
					type="textarea"
					:rows="6"
					placeholder="E.g.: select id as dictValue, name as dictLabel from sys_role where deleted = 0"
				></el-input>
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
import { useDictTypeApi, useDictTypeSubmitApi } from '@/api/sys/dict'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataFormRef = ref()
const dataForm = reactive({
	id: '',
	dictType: '',
	dictName: '',
	sort: 0,
	pid: '',
	dictSource: 0,
	dictSql: '',
	remark: ''
})

const dataRules = ref({
	dictType: [{ required: true, message: 'Required fields cannot be empty', trigger: 'blur' }],
	dictName: [{ required: true, message: 'Required fields cannot be empty', trigger: 'blur' }],
	dictSource: [{ required: true, message: 'Required fields cannot be empty', trigger: 'blur' }],
	dictSql: [{ required: true, message: 'Required fields cannot be empty', trigger: 'blur' }]
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
		getDictType(id)
	}
}

const getDictType = (id: number) => {
	useDictTypeApi(id).then(res => {
		Object.assign(dataForm, res.data)
	})
}

// Form submission
const submitHandle = () => {
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}

		useDictTypeSubmitApi(dataForm).then(() => {
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
