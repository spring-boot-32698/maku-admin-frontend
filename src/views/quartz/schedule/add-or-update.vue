<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? 'Add' : 'Edit'" :close-on-click-modal="false" draggable>
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="100px" @keyup.enter="submitHandle()">
			<el-row>
				<el-col :span="12">
					<el-form-item label="Task name" prop="jobName">
						<el-input v-model="dataForm.jobName" placeholder="Task name"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="Task group name" prop="jobGroup">
						<ma-dict-select v-model="dataForm.jobGroup" dict-type="schedule_group" placeholder="Task group name" style="width: 100%"></ma-dict-select>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="12">
					<el-form-item label="beanName" prop="beanName">
						<el-input v-model="dataForm.beanName" placeholder="spring beanName"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="Method name" prop="beanName">
						<el-input v-model="dataForm.method" placeholder="Method name"></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="12">
					<el-form-item label="Method parameters" prop="params">
						<el-input v-model="dataForm.params" placeholder="Method parameters"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="cronExpression" prop="cronExpression">
						<el-input v-model="dataForm.cronExpression" placeholder="cronExpression"></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="12">
					<el-form-item label="Whether concurrent" prop="concurrent">
						<el-radio-group v-model="dataForm.concurrent">
							<el-radio-button :value="1">Allow</el-radio-button>
							<el-radio-button :value="0"> Forbid </el-radio-button>
						</el-radio-group>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="Remarks" prop="remark">
						<el-input v-model="dataForm.remark" placeholder="Remarks"></el-input>
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
import { useScheduleApi, useScheduleSubmitApi } from '@/api/quartz/schedule'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataFormRef = ref()
const dataForm = reactive({
	id: '',
	jobName: '',
	jobGroup: '',
	beanName: '',
	method: '',
	params: '',
	cronExpression: '',
	status: 0,
	concurrent: 1,
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
		getScheduleJob(id)
	}
}

const getScheduleJob = (id: number) => {
	useScheduleApi(id).then(res => {
		Object.assign(dataForm, res.data)
	})
}

const dataRules = ref({
	jobName: [{ required: true, message: 'Required fields cannot be empty', trigger: 'blur' }],
	jobGroup: [{ required: true, message: 'Required fields cannot be empty', trigger: 'blur' }],
	beanName: [{ required: true, message: 'Required fields cannot be empty', trigger: 'blur' }],
	method: [{ required: true, message: 'Required fields cannot be empty', trigger: 'blur' }],
	cronExpression: [{ required: true, message: 'Required fields cannot be empty', trigger: 'blur' }]
})

// Form submission
const submitHandle = () => {
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}

		useScheduleSubmitApi(dataForm).then(() => {
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
