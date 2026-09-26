<template>
	<el-input v-model="roleName" :clearable :disabled readonly :placeholder @clear="model = ''">
		<template #append>
			<el-button icon="Search" @click="visible = true"></el-button>
		</template>
	</el-input>
	<ma-data-table
		v-if="!disabled && visible"
		:key="visible + ''"
		v-model:visible="visible"
		title="Role selection"
		url="/sys/role/page"
		:multiple
		:columns="[
			{ field: 'name', label: 'Name' },
			{ field: 'roleCode', label: 'Code' },
			{ field: 'remark', label: 'Remarks' }
		]"
		:query-params="[{ field: 'name', label: 'Name' }]"
		@select="onSelect"
	></ma-data-table>
</template>

<script setup lang="ts" name="MaRoleInput">
import { ref, watch } from 'vue'
import { useRoleNameListApi } from '@/api/sys/role'

const props = defineProps({
	multiple: {
		type: Boolean,
		required: false,
		default: false
	},
	clearable: {
		type: Boolean,
		required: false,
		default: () => true
	},
	disabled: {
		type: Boolean,
		required: false,
		default: () => false
	},
	placeholder: {
		type: String,
		required: false,
		default: () => ''
	}
})

const model = defineModel<any | any[]>()
const visible = ref(false)
const roleName = ref()

watch(
	() => model.value,
	async val => {
		if (val) {
			const idList = props.multiple ? val : [val]
			if (idList.length > 0) {
				const { data } = await useRoleNameListApi(idList)
				roleName.value = data.join(',')
			}
		} else {
			roleName.value = ''
		}
	},
	{
		immediate: true
	}
)

const emit = defineEmits(['select'])
const onSelect = (rows: any[]) => {
	if (props.multiple) {
		model.value = rows.map((item: any) => item.id)
	} else {
		model.value = rows[0].id
	}

	emit('select', rows)
}
</script>
