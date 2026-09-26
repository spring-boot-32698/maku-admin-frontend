<template>
	<div id="printJs-vue">
		<el-card shadow="hover" header="Page printing">
			<el-alert title="Page printing demo, using `print-js`, project address: https://github.com/crabbly/Print.js" type="success" :closable="false"></el-alert>
			<p style="margin-top: 10px"><el-button size="default" type="primary" @click="handlePrintJs"> Click to print </el-button></p>
		</el-card>
	</div>
</template>

<script lang="ts" setup>
import printJs from 'print-js'

const handlePrintJs = () => {
	printJs({
		printable: 'printJs-vue',
		type: 'html',
		css: ['//unpkg.com/element-plus/dist/index.css'],
		scanStyles: false
	})
}
</script>
