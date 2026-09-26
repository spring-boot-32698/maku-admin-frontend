<template>
	<el-dialog v-model="visible" title="Log details" :close-on-click-modal="false" draggable>
		<el-form label-width="100px">
			<el-row>
				<el-col :span="12">
					<el-form-item label="Log ID">
						<el-input v-model="dataForm.id" disabled></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="Operator">
						<el-input v-model="dataForm.realName" disabled></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="12">
					<el-form-item label="Module name">
						<el-input v-model="dataForm.module" disabled></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="Operation name">
						<el-input v-model="dataForm.name" disabled></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="12">
					<el-form-item label="Request URI">
						<el-input v-model="dataForm.reqUri" disabled></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="Request method">
						<el-input v-model="dataForm.reqMethod" disabled></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="12">
					<el-form-item label="Operation IP">
						<el-input v-model="dataForm.ip" disabled></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="Login location">
						<el-input v-model="dataForm.address" disabled></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="12">
					<el-form-item label="Operation type">
						<ma-dict-select v-model="dataForm.operateType" dict-type="log_operate_type" disabled style="width: 100%"></ma-dict-select>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="Execution duration">
						<el-input v-model="dataForm.duration" disabled>
							<template #append>ms</template>
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="12">
					<el-form-item label="Status" prop="status">
						<el-tag v-if="dataForm.status === 0" type="danger">Failed</el-tag>
						<el-tag v-else type="success">Success</el-tag>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="Creation time" prop="createTime">
						<el-input v-model="dataForm.createTime" disabled></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-form-item label="User Agent">
				<el-input v-model="dataForm.userAgent" disabled></el-input>
			</el-form-item>
			<el-form-item label="Request parameters">
				<el-input v-model="dataForm.reqParams" :rows="8" type="textarea" disabled />
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button type="primary" @click="visible = false">Close</el-button>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

const visible = ref(false)
const dataForm = reactive({
	id: '',
	realName: '',
	module: '',
	name: '',
	reqUri: '',
	reqMethod: '',
	ip: '',
	address: '',
	operateType: '',
	duration: '',
	status: 0,
	userAgent: '',
	reqParams: '',
	createTime: ''
})

const init = (data?: any) => {
	visible.value = true

	Object.assign(dataForm, data)
}

defineExpose({
	init
})
</script>
