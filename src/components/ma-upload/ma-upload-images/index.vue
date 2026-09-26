<template>
	<div class="upload-box">
		<el-upload
			v-model:file-list="fileList"
			action="#"
			list-type="picture-card"
			:class="['upload', self_disabled ? 'disabled' : '', drag ? 'no-border' : '', isUploadLimit ? 'hide' : '']"
			:multiple="true"
			:headers="{ Authorization: cache.getToken() }"
			:disabled="self_disabled"
			:limit="limit"
			:http-request="handleHttpUpload"
			:before-upload="beforeUpload"
			:on-exceed="handleExceed"
			:on-success="uploadSuccess"
			:on-error="uploadError"
			:drag="drag"
			:accept="fileType.join(',')"
		>
			<div class="upload-empty">
				<slot name="empty">
					<el-icon><Plus /></el-icon>
				</slot>
			</div>
			<template #file="{ file }">
				<img :src="file.url" class="upload-image" />
				<div class="upload-handle" @click.stop>
					<div class="handle-icon" @click="handlePictureCardPreview(file)">
						<el-icon><ZoomIn /></el-icon>
					</div>
					<div v-if="!self_disabled" class="handle-icon" @click="handleRemove(file)">
						<el-icon><Delete /></el-icon>
					</div>
				</div>
			</template>
		</el-upload>
		<div class="el-upload__tip">
			<slot name="tip"></slot>
		</div>
		<el-image-viewer v-if="imgViewVisible" :url-list="[viewImageUrl]" @close="imgViewVisible = false" />
	</div>
</template>

<script setup lang="ts" name="MaUploadImages">
import { ref, computed, inject, watch } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { uploadImg } from '@/api/sys/upload'
import { UploadProps, UploadFile, UploadUserFile, UploadRequestOptions } from 'element-plus'
import { ElNotification, formContextKey } from 'element-plus'
import cache from '@/utils/cache'

interface UploadFileProps {
	drag?: boolean // Whether drag-and-drop upload is supported ==> Optional (default is true)
	disabled?: boolean // Whether to disable the upload component ==> Optional (default is false)
	limit?: number // Maximum number of uploaded images ==> Optional (default is 5 images)
	size?: number // Image size limit ==> Optional (default is 5M)
	fileType?: any[] // Image type limit ==> Optional (default is ["image/jpeg", "image/png", "image/gif"])
	height?: string // Component height ==> Optional (default is 150px)
	width?: string // Component width ==> Optional (default is 150px)
	borderRadius?: string // Component border radius ==> Optional (default is 8px)
}

const props = withDefaults(defineProps<UploadFileProps>(), {
	drag: true,
	disabled: false,
	limit: 3,
	size: 5,
	fileType: () => ['image/jpeg', 'image/png', 'image/gif'],
	height: '100px',
	width: '100px',
	borderRadius: '5px'
})

// Get the el-form component context
const formContext = inject(formContextKey, void 0)
// Check whether upload and delete are disabled
const self_disabled = computed(() => {
	return props.disabled || formContext?.disabled
})

const model = defineModel<any>()
const isUploadLimit = computed(() => fileList.value.length >= props.limit)
const fileList = ref<UploadUserFile[]>([])

watch(
	() => model.value,
	async val => {
		if (val && val.length > 0) {
			const urls = model.value.split(',')
			fileList.value = urls.map((url: string) => {
				return {
					name: url.substring(url.lastIndexOf('/') + 1),
					url: url
				} as UploadUserFile
			})
		} else {
			fileList.value = []
		}
	},
	{
		immediate: true
	}
)

/**
 * @description Check before file upload
 * @param rawFile Selected file
 * */
const beforeUpload: UploadProps['beforeUpload'] = rawFile => {
	const imgSize = rawFile.size / 1024 / 1024 < props.size
	const imgType = props.fileType.includes(rawFile.type)
	if (!imgType) {
		ElNotification({
			title: 'Friendly reminder',
			message: 'The uploaded image does not match the required format!',
			type: 'warning'
		})
	}
	if (!imgSize) {
		setTimeout(() => {
			ElNotification({
				title: 'Friendly reminder',
				message: `Uploaded image size cannot exceed ${props.size}MB!`,
				type: 'warning'
			})
		}, 0)
	}
	return imgType && imgSize
}

/**
 * @description Image upload
 * @param options upload All settings
 * */
const handleHttpUpload = async (options: UploadRequestOptions) => {
	let formData = new FormData()
	formData.append('file', options.file)
	try {
		const { data } = await uploadImg(formData)
		options.onSuccess(data)
	} catch (error) {
		options.onError(error as any)
	}
}

/**
 * @description Image uploaded successfully
 * @param response Upload response result
 * @param uploadFile Uploaded file
 * */
const emit = defineEmits<{ 'update:fileList': [value: UploadUserFile[]] }>()
const uploadSuccess = (response: { url: string } | undefined, uploadFile: UploadFile) => {
	if (!response) {
		return
	}
	uploadFile.url = response.url

	if (model.value) {
		model.value = model.value + ',' + response.url
	} else {
		model.value = response.url
	}
}

/**
 * @description Delete image
 * @param file Deleted files
 * */
const handleRemove = (file: UploadFile) => {
	fileList.value = fileList.value.filter(item => item.url !== file.url || item.name !== file.name)
	const files = fileList.value.map((file: any) => {
		return file.url
	})

	if (files.length === 0) {
		model.value = ''
	} else {
		model.value = files.join(',')
	}
}

/**
 * @description Image upload error
 * */
const uploadError = () => {
	ElNotification({
		title: 'Friendly reminder',
		message: 'Image upload failed, please upload again!',
		type: 'error'
	})
}

/**
 * @description Number of files exceeded
 * */
const handleExceed = () => {
	ElNotification({
		title: 'Friendly reminder',
		message: `At most the following can be uploaded currently: ${props.limit} images, please remove some before uploading!`,
		type: 'warning'
	})
}

/**
 * @description Image preview
 * @param file File to preview
 * */
const viewImageUrl = ref('')
const imgViewVisible = ref(false)
const handlePictureCardPreview: UploadProps['onPreview'] = file => {
	viewImageUrl.value = file.url!
	imgViewVisible.value = true
}
</script>

<style scoped lang="scss">
.is-error {
	.upload {
		:deep(.el-upload--picture-card),
		:deep(.el-upload-dragger) {
			border: 1px dashed var(--el-color-danger) !important;
			&:hover {
				border-color: var(--el-color-primary) !important;
			}
		}
	}
}
:deep(.disabled) {
	.el-upload--picture-card,
	.el-upload-dragger {
		cursor: not-allowed;
		background: var(--el-disabled-bg-color) !important;
		border: 1px dashed var(--el-border-color-darker);
		&:hover {
			border-color: var(--el-border-color-darker) !important;
		}
	}
}
.upload-box {
	.no-border {
		:deep(.el-upload--picture-card) {
			border: none !important;
		}
	}
	.hide {
		:deep(.el-upload--picture-card) {
			display: none !important;
		}
	}
	:deep(.upload) {
		.el-upload-dragger {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 100%;
			height: 100%;
			padding: 0;
			overflow: hidden;
			border: 1px dashed var(--el-border-color-darker);
			border-radius: v-bind(borderRadius);
			&:hover {
				border: 1px dashed var(--el-color-primary);
			}
		}
		.el-upload-dragger.is-dragover {
			background-color: var(--el-color-primary-light-9);
			border: 2px dashed var(--el-color-primary) !important;
		}
		.el-upload-list__item,
		.el-upload--picture-card {
			width: v-bind(width);
			height: v-bind(height);
			background-color: transparent;
			border-radius: v-bind(borderRadius);
		}
		.upload-image {
			width: 100%;
			height: 100%;
			object-fit: contain;
		}
		.upload-handle {
			position: absolute;
			top: 0;
			right: 0;
			box-sizing: border-box;
			display: flex;
			align-items: center;
			justify-content: center;
			width: 100%;
			height: 100%;
			cursor: pointer;
			background: rgb(0 0 0 / 60%);
			opacity: 0;
			transition: var(--el-transition-duration-fast);
			.handle-icon {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				padding: 0 6%;
				color: aliceblue;
				.el-icon {
					margin-bottom: 15%;
					font-size: 140%;
				}
				span {
					font-size: 100%;
				}
			}
		}
		.el-upload-list__item {
			&:hover {
				.upload-handle {
					opacity: 1;
				}
			}
		}
		.upload-empty {
			display: flex;
			flex-direction: column;
			align-items: center;
			font-size: 12px;
			line-height: 30px;
			color: var(--el-color-info);
			.el-icon {
				font-size: 28px;
				color: var(--el-text-color-secondary);
			}
		}
	}
	.el-upload__tip {
		line-height: 15px;
		text-align: center;
	}
}
</style>
