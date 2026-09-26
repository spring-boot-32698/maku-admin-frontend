<template>
	<el-upload
		:action="uploadUrl"
		:headers="{ Authorization: cache.getToken() }"
		:before-upload="beforeUpload"
		:on-success="handleSuccess"
		:show-file-list="false"
	>
		<slot />
	</el-upload>
</template>

<script setup lang="ts" name="MaUploadExcel">
import type { UploadProps } from 'element-plus'
import constant from '@/utils/constant'
import { ElMessage } from 'element-plus/es'
import cache from '@/utils/cache'

const props = defineProps({
	action: {
		type: String,
		required: true
	}
})

// Upload URL
const uploadUrl = constant.apiUrl + props.action
const handleSuccess: UploadProps['onSuccess'] = (res, file) => {
	if (res.code !== 0) {
		ElMessage.error('Upload failed:' + res.msg)
		return false
	}

	ElMessage.success({
		message: 'Upload succeeded',
		duration: 500,
		onClose: () => {
			//
		}
	})
}

const beforeUpload: UploadProps['beforeUpload'] = file => {
	if (file.size / 1024 / 1024 / 1024 / 1024 > 1) {
		ElMessage.error('File size cannot exceed 100M')
		return false
	}
	return true
}
</script>
