<template>
	<div style="border: 1px solid #ccc; z-index: 100">
		<!-- Toolbar -->
		<Toolbar :editor="editorRef" :mode="mode" style="border-bottom: 1px solid #ccc" />
		<!-- Editor -->
		<Editor
			:model-value="modelValue"
			:style="style"
			:disabled="disabled"
			:default-config="editorConfig"
			:mode="mode"
			@on-created="handleCreated"
			@on-change="handleChange"
		/>
	</div>
</template>

<script lang="ts" setup name="MaEditor">
import '@wangeditor/editor/dist/css/style.css'
import { onBeforeUnmount, shallowRef } from 'vue'
import constant from '@/utils/constant'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { IDomEditor, IEditorConfig } from '@wangeditor/editor'
import cache from '@/utils/cache'

const props = defineProps({
	modelValue: {
		type: String,
		default: ''
	},
	mode: {
		type: String,
		default: 'default' // Optional values:[default | simple]
	},
	placeholder: {
		type: String,
		default: ''
	},
	style: {
		type: String,
		default: 'height: 400px;'
	},
	disabled: {
		type: Boolean,
		default: false
	}
})

// Editor instance, must use shallowRef
const editorRef = shallowRef()

type InsertFnType = (url: string, alt: string, href: string) => void

// Editor settings
const editorConfig: Partial<IEditorConfig> = {
	placeholder: props.placeholder,
	readOnly: props.disabled,
	MENU_CONF: {
		uploadImage: {
			server: constant.uploadUrl + '?access_token=' + cache.getToken(),
			fieldName: 'file',
			// Custom insert image
			customInsert(res: any, insertFn: InsertFnType) {
				// res The result returned by the server
				// Find url alt href in res, then insert the image
				insertFn(res.data.url, res.data.name, '')
			}
		}
	}
}

// Destroy the editor promptly when the component is destroyed
onBeforeUnmount(() => {
	const editor = editorRef.value
	if (editor == null) {
		return
	}
	editor.destroy()
})

const handleCreated = (editor: IDomEditor) => {
	editorRef.value = editor
}

// Editor change event triggered
const emit = defineEmits(['update:modelValue'])
const handleChange = (editor: IDomEditor) => {
	emit('update:modelValue', editor.getHtml())
}
</script>
