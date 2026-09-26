<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? 'Add' : 'Edit'" :width="600" :close-on-click-modal="false" draggable>
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="80px" @keyup.enter="submitHandle()">
			<el-form-item prop="dictValue" label="Dictionary value">
				<el-input v-model="dataForm.dictValue" placeholder="Dictionary value"></el-input>
			</el-form-item>
			<el-form-item prop="dictLabel" label="Dictionary label">
				<el-input v-model="dataForm.dictLabel" placeholder="Dictionary label"></el-input>
			</el-form-item>
			<el-form-item prop="labelClass" label="Label style">
				<el-select v-model="dataForm.labelClass" style="width: 100%" clearable>
					<el-option
						v-for="item in [
							{ value: 'primary', label: 'primary' },
							{ value: 'success', label: 'success' },
							{ value: 'info', label: 'info' },
							{ value: 'warning', label: 'warning' },
							{ value: 'danger', label: 'danger' }
						]"
						:key="item.value"
						:label="item.label"
						:value="item.value"
					>
						<el-tag v-if="item.value === 'primary'" style="width: 100%">{{ item.label }}</el-tag>
						<el-tag v-else style="width: 100%" :type="item.value">{{ item.label }}</el-tag>
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item prop="sort" label="Sort">
				<el-input-number v-model="dataForm.sort" controls-position="right" :min="0" aria-label="Sort"></el-input-number>
			</el-form-item>
			<el-form-item prop="remark" label="Remarks">
				<el-input v-model="dataForm.remark" placeholder="Remarks"></el-input>
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
import { useDictDataApi, useDictDataSubmitApi } from '@/api/sys/dict'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataFormRef = ref()
const dataForm = reactive({
	id: '',
	dictTypeId: 0,
	dictLabel: '',
	dictValue: '',
	labelClass: '',
	sort: 0,
	remark: ''
})

const dataRules = ref({
	dictLabel: [{ required: true, message: 'Required fields cannot be empty', trigger: 'blur' }],
	dictValue: [{ required: true, message: 'Required fields cannot be empty', trigger: 'blur' }]
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
		getDictData(id)
	}
}

const getDictData = (id: number) => {
	useDictDataApi(id).then(res => {
		Object.assign(dataForm, res.data)
	})
}

// Form submission
const submitHandle = () => {
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}

		useDictDataSubmitApi(dataForm).then(() => {
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
	init,
	dataForm
})
</script>
