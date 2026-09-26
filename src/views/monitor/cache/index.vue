<template>
	<el-card class="monitor-cache">
		<el-card class="box-card">
			<template #header>
				<div class="card-header">
					<span>Basic information</span>
				</div>
			</template>
			<el-descriptions :column="3" border>
				<el-descriptions-item label="RedisVersion">{{ data.info.redis_version }}</el-descriptions-item>
				<el-descriptions-item label="Running mode">{{ data.info.redis_mode == 'standalone' ? 'Standalone' : 'Cluster' }}</el-descriptions-item>
				<el-descriptions-item label="Port">{{ data.info.tcp_port }}</el-descriptions-item>
				<el-descriptions-item label="Client">{{ data.info.connected_clients }}</el-descriptions-item>
				<el-descriptions-item label="Running time (days)">{{ data.info.uptime_in_days }}</el-descriptions-item>
				<el-descriptions-item label="KeyQuantity">{{ data.keyCount }}</el-descriptions-item>
				<el-descriptions-item label="Maximum memory setting">{{ data.info.maxmemory_human }}</el-descriptions-item>
				<el-descriptions-item label="CPU used">{{ data.info.used_cpu_user_children }}%</el-descriptions-item>
				<el-descriptions-item label="Used memory">{{ data.info.used_memory_human }}</el-descriptions-item>
				<el-descriptions-item label="AOFWhether enabled">{{ data.info.aof_enabled === 0 ? 'No' : 'Yes' }}</el-descriptions-item>
				<el-descriptions-item label="RDBWhether successful">{{ data.info.rdb_last_bgsave_status }}</el-descriptions-item>
				<el-descriptions-item label="Network inbound/outbound"
					>{{ data.info.instantaneous_input_kbps }}kps/{{ data.info.instantaneous_output_kbps }}kps</el-descriptions-item
				>
			</el-descriptions>
		</el-card>

		<el-card class="box-card">
			<template #header>
				<div class="card-header">
					<span>Command statistics</span>
				</div>
			</template>
			<el-table :data="data.commandStats" header-align="center" style="width: 100%">
				<el-table-column align="center" prop="name" label="Property" />
				<el-table-column align="center" prop="value" label="Value" />
			</el-table>
		</el-card>
	</el-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useCacheInfoApi } from '@/api/monitor/cache'

const data = ref({
	info: {
		redis_version: '',
		redis_mode: 'standalone',
		tcp_port: 6379,
		connected_clients: 1,
		uptime_in_days: 0,
		used_memory_human: 0,
		used_cpu_user_children: 0,
		maxmemory_human: 0,
		aof_enabled: 0,
		rdb_last_bgsave_status: '0',
		instantaneous_input_kbps: '0.00',
		instantaneous_output_kbps: '0.00'
	},
	keyCount: 0,
	commandStats: []
})

const init = onMounted(() => {
	getCacheInfo()
})

const getCacheInfo = () => {
	useCacheInfoApi().then(res => {
		data.value = res.data
	})
}
</script>

<style lang="scss" scoped>
.monitor-cache {
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
		width: 120px !important;
	}
	::v-deep(.el-descriptions__content) {
		width: 200px !important;
	}
}
</style>
