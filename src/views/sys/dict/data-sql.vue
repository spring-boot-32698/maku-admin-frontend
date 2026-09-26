<template>
	<el-table
		v-loading="state.dataListLoading"
		:data="state.dataList"
		border
		show-overflow-tooltip
		style="width: 100%"
		@selection-change="selectionChangeHandle"
		@sort-change="sortChangeHandle"
	>
		<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
		<el-table-column prop="dictValue" label="Dictionary value" header-align="center" align="center"></el-table-column>
		<el-table-column prop="dictLabel" label="Dictionary label" header-align="center" align="center"> </el-table-column>
	</el-table>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'

const props = defineProps({
	dictTypeId: {
		type: Number,
		required: true
	}
})

const state: IHooksOptions = reactive({
	dataListUrl: '/sys/dict/type/list/sql',
	isPage: true,
	queryForm: {
		id: props.dictTypeId
	}
})

const { selectionChangeHandle, sortChangeHandle } = useCrud(state)
</script>
