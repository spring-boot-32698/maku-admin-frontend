<template>
	<div class="upload-box">
		<el-upload
			:id="uuid"
			action="#"
			:class="['upload', self_disabled ? 'disabled' : '', drag ? 'no-border' : '']"
			:multiple="false"
			:disabled="self_disabled"
			:show-file-list="false"
			:http-request="handleHttpUpload"
			:before-upload="beforeUpload"
			:on-success="uploadSuccess"
			:on-error="uploadError"
			:drag="drag"
			:accept="fileType.join(',')"
		>
			<template v-if="imageUrl">
				<img :src="imageUrl" class="upload-image" />
				<div class="upload-handle" @click.stop>
					<div v-if="!self_disabled" class="handle-icon" @click="editImg">
						<el-icon><Edit /></el-icon>
						<span>Edit</span>
					</div>
					<div class="handle-icon" @click="imgViewVisible = true">
						<el-icon><ZoomIn /></el-icon>
						<span>View</span>
					</div>
					<div v-if="!self_disabled" class="handle-icon" @click="deleteImg">
						<el-icon><Delete /></el-icon>
						<span>Delete</span>
					</div>
				</div>
			</template>
			<template v-else>
				<div class="upload-empty">
					<slot name="empty">
						<el-icon><Plus /></el-icon>
						<!-- <span>Please upload an image</span> -->
					</slot>
				</div>
			</template>
		</el-upload>
		<div class="el-upload__tip">
			<slot name="tip"></slot>
		</div>
		<el-image-viewer v-if="imgViewVisible" :url-list="[imageUrl]" @close="imgViewVisible = false" />
	</div>
</template>

<script setup lang="ts" name="MaUploadImage">
import { ref, computed, inject } from 'vue'
import { ElNotification, formContextKey, formItemContextKey } from 'element-plus'
import type { UploadProps, UploadRequestOptions } from 'element-plus'
import { generateUUID } from '@/utils/tool'
import { uploadImg } from '@/api/sys/upload'

interface UploadFileProps {
	imageUrl: string // Image URL ==> Required
	drag?: boolean // Whether drag-and-drop upload is supported ==> Optional (default is true)
	disabled?: boolean // Whether to disable the upload component ==> Optional (default is false)
	fileSize?: number // Image size limit ==> Optional (default is 5M)
	fileType?: any[] // Image type limit ==> Optional (default is ["image/jpeg", "image/png", "image/gif"])
	height?: string // Component height ==> Optional (default is 150px)
	width?: string // Component width ==> Optional (default is 150px)
	borderRadius?: string // Component border radius ==> Optional (default is 8px)
}

// Receive parent component parameters
const props = withDefaults(defineProps<UploadFileProps>(), {
	imageUrl: '',
	drag: true,
	disabled: false,
	fileSize: 5,
	fileType: () => ['image/jpeg', 'image/png', 'image/gif'],
	height: '150px',
	width: '150px',
	borderRadius: '8px'
})

// Generate a unique component id
const uuid = ref('id-' + generateUUID())

// View image
const imgViewVisible = ref(false)
// Get the el-form component context
const formContext = inject(formContextKey, void 0)
// Get the el-form-item component context
const formItemContext = inject(formItemContextKey, void 0)
// Check whether upload and delete are disabled
const self_disabled = computed(() => {
	return props.disabled || formContext?.disabled
})

/**
 * @description Image upload
 * @param options upload All settings
 * */
const emit = defineEmits<{
	'update:imageUrl': [value: string]
	success: [value: any]
}>()
const handleHttpUpload = async (options: UploadRequestOptions) => {
	let formData = new FormData()
	formData.append('file', options.file)
	try {
		const { data } = await uploadImg(formData)
		emit('update:imageUrl', data.url)
		emit('success', data)
		// Call the validation method inside el-form (validates automatically)
		formItemContext?.prop && formContext?.validateField([formItemContext.prop as string])
	} catch (error) {
		options.onError(error as any)
	}
}

/**
 * @description Delete image
 * */
const deleteImg = () => {
	emit('update:imageUrl', '')
}

/**
 * @description Edit image
 * */
const editImg = () => {
	const dom = document.querySelector(`#${uuid.value} .el-upload__input`)
	dom && dom.dispatchEvent(new MouseEvent('click'))
}

/**
 * @description Check before file upload
 * @param rawFile Selected file
 * */
const beforeUpload: UploadProps['beforeUpload'] = rawFile => {
	const imgSize = rawFile.size / 1024 / 1024 < props.fileSize
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
				message: `Uploaded image size cannot exceed ${props.fileSize}M!`,
				type: 'warning'
			})
		}, 0)
	}
	return imgType && imgSize
}

/**
 * @description Image uploaded successfully
 * */
const uploadSuccess = () => {
	ElNotification({
		title: 'Friendly reminder',
		message: 'Image uploaded successfully!',
		type: 'success'
	})
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
</script>

<style scoped lang="scss">
.is-error {
	.upload {
		:deep(.el-upload),
		:deep(.el-upload-dragger) {
			border: 1px dashed var(--el-color-danger) !important;
			&:hover {
				border-color: var(--el-color-primary) !important;
			}
		}
	}
}
:deep(.disabled) {
	.el-upload,
	.el-upload-dragger {
		cursor: not-allowed !important;
		background: var(--el-disabled-bg-color);
		border: 1px dashed var(--el-border-color-darker) !important;
		&:hover {
			border: 1px dashed var(--el-border-color-darker) !important;
		}
	}
}
.upload-box {
	.no-border {
		:deep(.el-upload) {
			border: none !important;
		}
	}
	:deep(.upload) {
		.el-upload {
			position: relative;
			display: flex;
			align-items: center;
			justify-content: center;
			width: v-bind(width);
			height: v-bind(height);
			overflow: hidden;
			border: 1px dashed var(--el-border-color-darker);
			border-radius: v-bind(borderRadius);
			transition: var(--el-transition-duration-fast);
			&:hover {
				border-color: var(--el-color-primary);
				.upload-handle {
					opacity: 1;
				}
			}
			.el-upload-dragger {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 100%;
				height: 100%;
				padding: 0;
				overflow: hidden;
				background-color: transparent;
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
			.upload-image {
				width: 100%;
				height: 100%;
				object-fit: contain;
			}
			.upload-empty {
				position: relative;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				font-size: 12px;
				line-height: 30px;
				color: var(--el-color-info);
				.el-icon {
					font-size: 28px;
					color: var(--el-text-color-secondary);
				}
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
						margin-bottom: 40%;
						font-size: 130%;
						line-height: 130%;
					}
					span {
						font-size: 85%;
						line-height: 85%;
					}
				}
			}
		}
	}
	.el-upload__tip {
		line-height: 18px;
		text-align: center;
	}
}
</style>
