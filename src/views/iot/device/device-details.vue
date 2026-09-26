<template>
	<el-card>
		<el-tabs v-model="activeName">
			<el-tab-pane v-auth="'iot:device:info'" label="Device details" name="info">
				<DeviceInfo :device-id="props.deviceId" />
			</el-tab-pane>
			<el-tab-pane v-auth="'iot:device:info'" label="Service" name="service">
				<DeviceService :device-id="props.deviceId" />
			</el-tab-pane>
			<el-tab-pane v-auth="'iot:device:info'" label="Event" name="event">
				<DeviceEvent :device-id="props.deviceId" />
			</el-tab-pane>
			<el-tab-pane v-auth="'iot:device:update'" label="Debug" name="debug">
				<DeviceDebug :device-id="props.deviceId" :protocol-type="props.protocolType" />
			</el-tab-pane>
		</el-tabs>
	</el-card>
</template>

<script setup lang="ts">
import { defineProps, ref } from 'vue'
import DeviceService from './device-service.vue'
import DeviceEvent from './device-event.vue'
import DeviceInfo from './device-info.vue'
import DeviceDebug from './device-debug.vue'

// Receive the deviceId from the first page
const props = defineProps({
	deviceId: {
		type: Number,
		required: true
	},
	protocolType: {
		type: String,
		required: true
	}
})

// Name of the tab page displayed by default
const activeName = ref('info')
</script>
