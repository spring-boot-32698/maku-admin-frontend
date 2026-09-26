<template>
	<ma-data-table
		:key="visible + ''"
		v-model:visible="visible"
		title="User selection"
		url="/sys/user/page"
		:multiple
		:columns="[
			{ field: 'id', label: 'User ID' },
			{ field: 'username', label: 'Username' },
			{ field: 'realName', label: 'Name' },
			{ field: 'mobile', label: 'Mobile number' },
			{ field: 'createTime', label: 'Creation time' }
		]"
		:query-params="[
			{ field: 'username', label: 'Username' },
			{ field: 'mobile', label: 'Mobile number' }
		]"
		@select="onSelect"
	></ma-data-table>
</template>

<script setup lang="ts" name="MaUserDialog">
defineProps({
	multiple: {
		type: Boolean,
		required: false,
		default: false
	}
})

const visible = defineModel<boolean>()

const emit = defineEmits(['select'])
const onSelect = (rows: any[]) => {
	emit('select', rows)
}
</script>
