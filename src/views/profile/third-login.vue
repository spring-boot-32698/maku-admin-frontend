<template>
	<el-table :data="thirdList">
		<el-table-column type="index" label="No." width="100" align="center" />
		<el-table-column prop="openType" label="Platform type" align="center">
			<template #default="scope">
				<el-text v-if="scope.row.openType === 'wechat_work'"><ma-icon icon="icon-workweixin" size="16" /> WeCom</el-text>
				<el-text v-else-if="scope.row.openType === 'dingtalk'"><ma-icon icon="icon-dingding" size="16" /> DingTalk</el-text>
				<el-text v-else-if="scope.row.openType === 'feishu'"><ma-icon icon="icon-feishu" size="16" /> Feishu</el-text>
				<el-text v-else-if="scope.row.openType === 'wechat_open'"><ma-icon icon="icon-weixin" size="16" /> WeChat</el-text>
			</template>
		</el-table-column>
		<el-table-column prop="username" label="Nickname" align="center" />
		<el-table-column prop="status" label="Status" align="center">
			<template #default="scope">
				<el-tag v-if="scope.row.status === 0" type="danger">Unbound</el-tag>
				<el-tag v-else type="success">Bound</el-tag>
			</template>
		</el-table-column>
		<el-table-column label="Operation" align="center" width="100">
			<template #default="scope">
				<el-button v-if="scope.row.status === 0" type="primary" link @click="handleBind(scope.row.openType)">Bind</el-button>
				<el-button v-else type="danger" link @click="handleUnBind(scope.row.openType)">Unbind</el-button>
			</template>
		</el-table-column>
	</el-table>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useThirdBindApi, useThirdListApi, useThirdUnBindApi } from '@/api/sys/third'
import { ElMessage } from 'element-plus'
import constant from '@/utils/constant'

let thirdList = reactive([
	{ openType: 'wechat_work', username: '-', status: 0 },
	{ openType: 'dingtalk', username: '-', status: 0 },
	{ openType: 'feishu', username: '-', status: 0 },
	{ openType: 'wechat_open', username: '-', status: 0 }
])

const getThirdList = async () => {
	const res = await useThirdListApi()

	thirdList.forEach(third => {
		// Initialize
		third.status = 0
		third.username = '-'

		res.data.forEach((item: any) => {
			if (third.openType === item.openType) {
				third.status = 1
				third.username = item.username
			}
		})
	})
}

getThirdList()

// Bind
const handleBind = (openType: string) => {
	// Request API
	const url = constant.thirdLoginUrl + openType
	// Open in new window
	window.open(url, 'Third-party login', 'width=600, height=400, toolbar=no')

	window.onmessage = function (e) {
		if (!e.data?.openType) {
			return
		}

		useThirdBindApi(e.data).then(() => {
			ElMessage.success({
				message: 'Operation succeeded',
				duration: 500,
				onClose: () => {
					getThirdList()
				}
			})
		})
	}
}

// Unbind
const handleUnBind = (openType: string) => {
	useThirdUnBindApi(openType).then(() => {
		ElMessage.success({
			message: 'Operation succeeded',
			duration: 500,
			onClose: () => {
				getThirdList()
			}
		})
	})
}
</script>

<style lang="scss" scoped>
.profile-password .el-input {
	--el-input-width: 280px;
}
</style>
