<template>
	<el-row :gutter="15">
		<el-col :span="12">
			<el-card style="height: 700px">
				<template #header>
					<span style="margin-right: 10px">WebSocketConnect</span>
					<el-tag :type="openState ? 'primary' : 'danger'">{{ openState ? 'Connected' : 'Disconnected' }}</el-tag>
					<el-button :type="openState ? 'danger' : 'primary'" style="margin-left: 20px" @click="handleConnect">
						{{ openState ? 'Disconnect' : 'Connect' }}
					</el-button>
				</template>
				<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="80px">
					<el-form-item label="Service address">
						<el-input v-model="webSocketUrl" disabled />
					</el-form-item>
					<el-form-item prop="userId" label="Send to whom">
						<ma-user-input v-model="dataForm.userId"></ma-user-input>
					</el-form-item>
					<el-form-item prop="content" label="Send content">
						<el-input v-model="dataForm.content" :rows="3" type="textarea" />
					</el-form-item>
				</el-form>
				<div style="float: right">
					<el-button type="primary" :disabled="!openState" @click="submitHandle()">Send</el-button>
				</div>
			</el-card>
		</el-col>
		<el-col :span="12">
			<el-card style="height: 700px">
				<template #header> Message list </template>
				<el-scrollbar height="620px">
					<chat-item
						v-for="message in messageList"
						:key="message.name"
						:avatar="message.avatar"
						:name="message.name"
						:content="message.content"
						:datetime="message.sendTime"
						role="user"
						variant="text"
					></chat-item>
				</el-scrollbar>
			</el-card>
		</el-col>
	</el-row>
</template>

<script lang="ts" setup>
import { ChatItem } from '@tdesign-vue-next/chat'
import { computed, reactive, ref, watch } from 'vue'
import constant from '@/utils/constant'
import cache from '@/utils/cache'
import MaUserInput from '@/components/ma-user/ma-user-input/index.vue'
import { ElNotification } from 'element-plus'
import service from '@/utils/request'
import { useWebSocket } from '@vueuse/core'
import { useUserStore } from '@/store/modules/user'

const webSocketUrl = ref(constant.apiUrl.replace('http://', 'ws://').replace('https://', 'wss://') + '/ws?access_token=' + cache.getToken())
const { data, status, open, close } = useWebSocket(webSocketUrl, {
	autoReconnect: true,
	onConnected() {
		console.log('websocket connected')
	},
	onError() {
		ElNotification({
			type: 'error',
			title: 'Connection interrupted',
			message: 'WebSocketConnection has been disconnected!'
		})
	}
})
watch(
	() => data.value,
	val => {
		const result = JSON.parse(val)

		const message: any = {
			name: result.data.name,
			avatar: result.data.avatar,
			content: result.data.content,
			sendTime: result.data.sendTime
		}
		messageList.value.push(message)
	}
)

const openState = computed(() => status.value === 'OPEN')
const handleConnect = () => {
	if (openState.value) {
		close()
	} else {
		open()
	}
}

const messageList = ref<any[]>([])

const dataFormRef = ref()
const dataForm = reactive({
	content: '',
	userId: ''
})

const dataRules = ref({
	content: [{ required: true, message: 'Required fields cannot be empty', trigger: 'blur' }],
	userId: [{ required: true, message: 'Required fields cannot be empty', trigger: 'blur' }]
})

const submitHandle = () => {
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}

		service.postForm('/ws/message/send', dataForm).then(() => {
			// Sent successfully
			const userStore = useUserStore()
			const message: any = {
				name: userStore.user.realName,
				avatar: userStore.user.avatar,
				content: dataForm.content,
				sendTime: getCurrentDate()
			}
			messageList.value.push(message)

			// Clear input box
			dataForm.content = ''
		})
	})
}

// Current time
const getCurrentDate = () => {
	return new Date().toLocaleString('zh-CN', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit'
	})
}
</script>
<style lang="scss">
@use '@tdesign-vue-next/chat/dist/tdesign-vue-chat.min.css';
</style>
