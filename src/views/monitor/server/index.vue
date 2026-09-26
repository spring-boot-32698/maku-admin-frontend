<template>
	<el-card class="monitor-server">
		<el-card class="box-card">
			<template #header>
				<div class="card-header">
					<span>CPU</span>
					<el-button :icon="Refresh" size="small" circle @click="refreshCpuInfo" />
				</div>
			</template>
			<el-descriptions :column="2" border>
				<el-descriptions-item label="CPU Model">{{ data.cpu.cpuModel }}</el-descriptions-item>
				<el-descriptions-item label="Number of cores">{{ data.cpu.cpuNum }}</el-descriptions-item>
				<el-descriptions-item label="User usage rate">{{ data.cpu.used }}%</el-descriptions-item>
				<el-descriptions-item label="System usage rate">{{ data.cpu.sys }}%</el-descriptions-item>
				<el-descriptions-item label="Current idle rate">{{ data.cpu.free }}%</el-descriptions-item>
			</el-descriptions>
		</el-card>

		<el-card class="box-card">
			<template #header>
				<div class="card-header">
					<span>System memory</span>
					<el-button :icon="Refresh" size="small" circle @click="refreshMemInfo" />
				</div>
			</template>
			<el-descriptions :column="2" border>
				<el-descriptions-item label="Total memory amount">{{ data.mem.total }} GB</el-descriptions-item>
				<el-descriptions-item label="Used memory">{{ data.mem.used }} GB</el-descriptions-item>
				<el-descriptions-item label="Free memory">{{ data.mem.free }} GB</el-descriptions-item>
				<el-descriptions-item label="Memory usage">{{ data.mem.usage }}%</el-descriptions-item>
			</el-descriptions>
		</el-card>

		<el-card class="box-card">
			<template #header>
				<div class="card-header">
					<span>JVMInformation</span>
					<el-button :icon="Refresh" size="small" circle @click="refreshJvmInfo" />
				</div>
			</template>
			<el-descriptions :column="2" border>
				<el-descriptions-item label="Name">{{ data.jvm.name }}</el-descriptions-item>
				<el-descriptions-item label="Version">{{ data.jvm.version }}</el-descriptions-item>
				<el-descriptions-item label="Manufacturer">{{ data.jvm.vendor }}</el-descriptions-item>
				<el-descriptions-item label="Maximum available memory">{{ data.jvm.max }} GB</el-descriptions-item>
				<el-descriptions-item label="Total memory">{{ data.jvm.total }} GB</el-descriptions-item>
				<el-descriptions-item label="Used memory">{{ data.jvm.used }} GB</el-descriptions-item>
				<el-descriptions-item label="Idle memory">{{ data.jvm.free }} GB</el-descriptions-item>
				<el-descriptions-item label="Memory usage">{{ data.jvm.usage }}%</el-descriptions-item>
				<el-descriptions-item label="Jvm Path">{{ data.jvm.home }}</el-descriptions-item>
				<el-descriptions-item label="Jar Path">{{ data.jvm.userDir }}</el-descriptions-item>
				<el-descriptions-item label="Start time">{{ data.jvm.startTime }}</el-descriptions-item>
				<el-descriptions-item label="Running time">{{ data.jvm.runTime }}</el-descriptions-item>
				<el-descriptions-item label="Running parameters">{{ data.jvm.inputArguments }}</el-descriptions-item>
			</el-descriptions>
		</el-card>

		<el-card class="box-card">
			<template #header>
				<div class="card-header">
					<span>System info</span>
					<el-button :icon="Refresh" size="small" circle @click="refreshSysInfo" />
				</div>
			</template>
			<el-descriptions :column="2" border>
				<el-descriptions-item label="Operating system">{{ data.sys.osName }}</el-descriptions-item>
				<el-descriptions-item label="System architecture">{{ data.sys.osArch }}</el-descriptions-item>
				<el-descriptions-item label="System version">{{ data.sys.osVersion }}</el-descriptions-item>
				<el-descriptions-item label="System name">{{ data.sys.computerName }}</el-descriptions-item>
				<el-descriptions-item label="System IP">{{ data.sys.computerIp }}</el-descriptions-item>
			</el-descriptions>
		</el-card>

		<el-card class="box-card">
			<template #header>
				<div class="card-header">
					<span>Disk info</span>
					<el-button :icon="Refresh" size="small" circle @click="refreshDiskInfo" />
				</div>
			</template>
			<el-table :data="data.disks" header-align="center" style="width: 100%">
				<el-table-column align="center" prop="diskName" label="Disk name" />
				<el-table-column align="center" prop="diskType" label="Disk type" />
				<el-table-column align="center" prop="dirName" label="Disk path" />
				<el-table-column align="center" prop="total" label="Total memory" />
				<el-table-column align="center" prop="used" label="Used memory" />
				<el-table-column align="center" prop="free" label="Idle memory" />
				<el-table-column align="center" prop="usage" label="Space usage rate">
					<template #default="scope"> {{ scope.row.usage }}% </template>
				</el-table-column>
			</el-table>
		</el-card>
	</el-card>
</template>

<script setup lang="ts">
import { useCpuInfoApi, useMemInfoApi, useJvmInfoApi, useSysInfoApi, useServerInfoApi, useDiskInfoApi } from '@/api/monitor/server'
import { onMounted, reactive } from 'vue'
import { Refresh } from '@element-plus/icons-vue'

const data = reactive({
	cpu: {
		cpuModel: '',
		cpuNum: 0,
		used: 0,
		sys: 0,
		free: 0
	},
	mem: {
		total: 0,
		used: 0,
		free: 0,
		usage: 0
	},
	jvm: {
		name: '',
		version: '',
		vendor: '',
		max: 0,
		total: 0,
		used: 0,
		free: 0,
		usage: 0,
		home: '',
		userDir: '',
		startTime: '',
		runTime: '',
		inputArguments: ''
	},
	sys: {
		osName: '',
		osArch: '',
		osVersion: '',
		computerName: '',
		computerIp: ''
	},
	disks: []
})

const init = onMounted(() => {
	getServerInfo()
})

const getServerInfo = () => {
	useServerInfoApi().then((res: any) => {
		Object.assign(data, res.data)
	})
}

const refreshCpuInfo = () => {
	useCpuInfoApi().then((res: any) => {
		data.cpu = res.data
	})
}

const refreshMemInfo = () => {
	useMemInfoApi().then((res: any) => {
		data.mem = res.data
	})
}

const refreshJvmInfo = () => {
	useJvmInfoApi().then((res: any) => {
		data.jvm = res.data
	})
}

const refreshSysInfo = () => {
	useSysInfoApi().then((res: any) => {
		data.sys = res.data
	})
}

const refreshDiskInfo = () => {
	useDiskInfoApi().then((res: any) => {
		data.disks = res.data
	})
}
</script>

<style lang="scss" scoped>
.monitor-server {
	.box-card {
		margin-bottom: 15px;
	}
	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		span {
			font-size: 16px;
			font-weight: bold;
		}
	}
	::v-deep(.el-descriptions__label) {
		width: 100px !important;
	}
	::v-deep(.el-descriptions__content) {
		width: 400px !important;
	}
}
</style>
