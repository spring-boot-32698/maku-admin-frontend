<template>
	<el-row :gutter="20">
		<el-col :span="8">
			<el-card class="profile-card">
				<template #header> Personal information </template>
				<div class="avatar">
					<ma-upload-image v-model:image-url="userStore.user.avatar" :drag="false" border-radius="50%" @success="handleSuccess">
						<template #empty>
							<el-icon><Avatar /></el-icon>
							<span>Please upload an avatar</span>
						</template>
					</ma-upload-image>
				</div>
				<ul>
					<li>
						<ma-icon icon="icon-user" /> Username <span>{{ userStore.user.username }}</span>
					</li>
					<li>
						<ma-icon icon="icon-idcard" /> Name <span>{{ userStore.user.realName }}</span>
					</li>
					<li>
						<ma-icon icon="icon-phone" /> Mobile phone number <span>{{ userStore.user.mobile }}</span>
					</li>
					<li>
						<ma-icon icon="icon-mail" /> User email <span>{{ userStore.user.email || '/' }}</span>
					</li>
					<li>
						<ma-icon icon="icon-apartment" /> Organization <span>{{ userStore.user.orgName || '/' }}</span>
					</li>
					<li>
						<ma-icon icon="icon-tag" /> Post <span>{{ userStore.user.postNameList || '/' }} </span>
					</li>
					<li>
						<ma-icon icon="icon-calendar-check" /> Creation date <span>{{ userStore.user.createTime }}</span>
					</li>
				</ul>
			</el-card>
		</el-col>
		<el-col :span="16">
			<el-card>
				<template #header> Basic information </template>
				<el-tabs v-model="activeName">
					<el-tab-pane label="Basic profile" name="info">
						<UserInfo />
					</el-tab-pane>
					<el-tab-pane label="Change password" name="password">
						<Password />
					</el-tab-pane>
					<el-tab-pane label="Personal signature" name="signature" lazy>
						<Signature />
					</el-tab-pane>
					<el-tab-pane label="Third-party login" name="third" lazy>
						<ThirdLogin />
					</el-tab-pane>
				</el-tabs>
			</el-card>
		</el-col>
	</el-row>
</template>

<script setup lang="ts" name="ProfileIndex">
import { ref } from 'vue'
import { useUserStore } from '@/store/modules/user'
import Password from '@/views/profile/password.vue'
import UserInfo from '@/views/profile/user-info.vue'
import Signature from '@/views/profile/signature.vue'
import ThirdLogin from '@/views/profile/third-login.vue'
import { useUserAvatarApi } from '@/api/sys/user'
import { ElMessage } from 'element-plus'

const userStore = useUserStore()
const activeName = ref('info')

const handleSuccess = (data: any) => {
	const dataForm = {
		avatar: data.url
	}
	// Update logged-in user avatar
	useUserAvatarApi(dataForm).then(() => {
		ElMessage.success('Update succeeded')
	})
}
</script>

<style scoped lang="scss">
.profile-card {
	.avatar {
		display: flex;
		justify-content: space-around;
		margin-bottom: 20px;
	}
	ul {
		list-style: none;
		padding: 0;
		li {
			padding: 12px 0;
			border-bottom: 1px solid #f0f0f0;
			&:last-child {
				border-bottom: none;
				padding-top: 12px;
			}
			span {
				float: right;
			}
		}
	}
}
</style>
