<template>
	<el-card class="layout-query">
		<el-form ref="queryRef" :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
			<el-form-item prop="name">
				<el-input v-model="state.queryForm.name" placeholder="Attachment name"></el-input>
			</el-form-item>
			<el-form-item prop="platform">
				<el-input v-model="state.queryForm.platform" placeholder="Storage platform"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button icon="Search" type="primary" @click="getDataList()">Query</el-button>
			</el-form-item>
			<el-form-item>
				<el-button icon="RefreshRight" @click="reset(queryRef)">Reset</el-button>
			</el-form-item>
		</el-form>
	</el-card>

	<el-card>
		<el-space>
			<el-space>
				<el-upload
					:action="constant.uploadUrl"
					:headers="{ Authorization: cache.getToken() }"
					:before-upload="beforeUpload"
					:on-success="handleSuccess"
					:show-file-list="false"
				>
					<el-button v-auth="'sys:attachment:save'" icon="Plus" type="primary">Upload</el-button>
				</el-upload>
			</el-space>
			<el-space>
				<el-button v-auth="'sys:attachment:delete'" icon="Delete" plain type="danger" @click="deleteBatchHandle()">Batch delete</el-button>
			</el-space>
		</el-space>
		<el-table
			v-loading="state.dataListLoading"
			show-overflow-tooltip
			:data="state.dataList"
			border
			class="layout-table"
			@selection-change="selectionChangeHandle"
		>
			<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
			<el-table-column prop="name" label="Attachment name" header-align="center" align="center"></el-table-column>
			<el-table-column prop="url" label="Attachment address" header-align="center" align="center"></el-table-column>
			<el-table-column prop="size" label="Attachment size" header-align="center" align="center">
				<template #default="scope">
					{{ convertSizeFormat(scope.row.size) }}
				</template>
			</el-table-column>
			<el-table-column prop="platform" label="Storage platform" header-align="center" align="center"></el-table-column>
			<el-table-column prop="createTime" label="Creation time" header-align="center" align="center"></el-table-column>
			<el-table-column label="Operation" fixed="right" header-align="center" align="center" width="150">
				<template #default="scope">
					<el-button type="primary" link @click="downloadHandle(scope.row.url, scope.row.name)">Download</el-button>
					<el-button v-auth="'sys:attachment:delete'" type="primary" link @click="deleteBatchHandle(scope.row.id)">Delete</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination
			:current-page="state.page"
			:page-sizes="state.pageSizes"
			:page-size="state.limit"
			:total="state.total"
			layout="total, sizes, prev, pager, next, jumper"
			@size-change="sizeChangeHandle"
			@current-change="currentChangeHandle"
		>
		</el-pagination>
	</el-card>
</template>

<script setup lang="ts" name="SysAttachmentIndex">
import { useCrud } from '@/hooks'
import { reactive, ref } from 'vue'
import constant from '@/utils/constant'
import cache from '@/utils/cache'
import { convertSizeFormat } from '@/utils/tool'
import { IHooksOptions } from '@/hooks/interface'
import { ElMessage } from 'element-plus'
import type { UploadProps } from 'element-plus'
import { useAttachmentSubmitApi } from '@/api/sys/attachment'

const state: IHooksOptions = reactive({
	dataListUrl: '/sys/attachment/page',
	deleteUrl: '/sys/attachment',
	queryForm: {
		name: '',
		platform: ''
	}
})

const queryRef = ref()
const dataForm = reactive({
	name: '',
	platform: '',
	size: '',
	url: ''
})

const handleSuccess: UploadProps['onSuccess'] = (res, file) => {
	if (res.code !== 0) {
		ElMessage.error('Upload failed:' + res.msg)
		return false
	}

	Object.assign(dataForm, res.data)

	useAttachmentSubmitApi(dataForm).then(() => {
		ElMessage.success({
			message: 'Upload succeeded',
			duration: 500,
			onClose: () => {
				getDataList()
			}
		})
	})
}

const beforeUpload: UploadProps['beforeUpload'] = file => {
	if (file.size / 1024 / 1024 / 100 > 1) {
		ElMessage.error('File size cannot exceed 100M')
		return false
	}
	return true
}

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle, downloadHandle, reset } = useCrud(state)
</script>
