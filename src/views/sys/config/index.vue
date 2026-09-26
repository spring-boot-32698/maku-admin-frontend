<template>
	<el-card>
		<el-tabs v-model="activeName">
			<el-tab-pane v-auth="'sys:sms:config'" label="SMS settings" name="sms">
				<SmsConfig />
			</el-tab-pane>
			<el-tab-pane v-auth="'sys:mail:config'" label="Mail settings" name="email">
				<MailConfig />
			</el-tab-pane>
			<el-tab-pane v-auth="'sys:third:config'" label="Third-party login" name="third">
				<ThirdConfig />
			</el-tab-pane>
		</el-tabs>
	</el-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SmsConfig from './sms/index.vue'
import MailConfig from './mail/index.vue'
import ThirdConfig from './third/index.vue'

const activeName = ref('sms')
</script>
