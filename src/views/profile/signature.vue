<template>
	<div class="signature-container">
		<el-card shadow="never">
			<div class="signature-header">
				<el-text type="info">My signature (sign directly on the canvas, then click save)</el-text>
			</div>
			<div class="signature-content">
				<div class="canvas-wrapper">
					<canvas
						ref="canvasRef"
						class="signature-canvas"
						@mousedown="startDrawing"
						@mousemove="draw"
						@mouseup="stopDrawing"
						@mouseleave="stopDrawing"
						@touchstart="handleTouchStart"
						@touchmove="handleTouchMove"
						@touchend="stopDrawing"
					></canvas>
				</div>
				<div class="signature-actions">
					<el-button @click="clearCanvas">Clear</el-button>
					<el-button type="primary" @click="saveSignature">Save signature</el-button>
				</div>
			</div>
		</el-card>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { uploadImg } from '@/api/sys/upload'
import { useUserSignatureApi } from '@/api/sys/user'
import { useUserStore } from '@/store/modules/user'
const userStore = useUserStore()

const canvasRef = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null
const isDrawing = ref(false)
const savedSignature = ref<string>('')

// Load the saved signature from local storage
onMounted(() => {
	initCanvas()
	loadSavedSignature()
	window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
	window.removeEventListener('resize', handleResize)
})

// Watch user info changes and reload when the signature is updated
watch(
	() => userStore.user?.signature,
	newSignature => {
		if (newSignature && newSignature !== savedSignature.value) {
			savedSignature.value = newSignature
			setTimeout(() => {
				loadSignatureToCanvas(newSignature)
			}, 100)
		}
	}
)

const initCanvas = () => {
	if (!canvasRef.value) {
		return
	}

	const canvas = canvasRef.value
	const container = canvas.parentElement

	if (container) {
		canvas.width = container.clientWidth - 4
		canvas.height = 400
	}

	ctx = canvas.getContext('2d')
	if (ctx) {
		ctx.lineCap = 'round'
		ctx.lineJoin = 'round'
		ctx.strokeStyle = '#000000'
		ctx.lineWidth = 3
		// Fill background color
		ctx.fillStyle = '#ffffff'
		ctx.fillRect(0, 0, canvas.width, canvas.height)
	}
}

const handleResize = () => {
	// Save the current canvas content
	if (!canvasRef.value || !ctx) {
		return
	}
	const imageData = canvasRef.value.toDataURL()

	// Reinitialize the canvas
	initCanvas()

	// Restore canvas content
	const img = new Image()
	img.onload = () => {
		if (ctx && canvasRef.value) {
			ctx.drawImage(img, 0, 0)
		}
	}
	img.src = imageData
}

const startDrawing = (e: MouseEvent) => {
	if (!ctx || !canvasRef.value) {
		return
	}
	isDrawing.value = true

	const rect = canvasRef.value.getBoundingClientRect()
	const x = e.clientX - rect.left
	const y = e.clientY - rect.top

	ctx.beginPath()
	ctx.moveTo(x, y)
}

const draw = (e: MouseEvent) => {
	if (!isDrawing.value || !ctx || !canvasRef.value) {
		return
	}

	const rect = canvasRef.value.getBoundingClientRect()
	const x = e.clientX - rect.left
	const y = e.clientY - rect.top

	ctx.lineTo(x, y)
	ctx.stroke()
}

const stopDrawing = () => {
	if (isDrawing.value && ctx) {
		ctx.closePath()
	}
	isDrawing.value = false
}

// Touch events support mobile
const handleTouchStart = (e: TouchEvent) => {
	e.preventDefault()
	if (!ctx || !canvasRef.value) {
		return
	}
	isDrawing.value = true

	const rect = canvasRef.value.getBoundingClientRect()
	const touch = e.touches[0]
	const x = touch.clientX - rect.left
	const y = touch.clientY - rect.top

	ctx.beginPath()
	ctx.moveTo(x, y)
}

const handleTouchMove = (e: TouchEvent) => {
	e.preventDefault()
	if (!isDrawing.value || !ctx || !canvasRef.value) {
		return
	}

	const rect = canvasRef.value.getBoundingClientRect()
	const touch = e.touches[0]
	const x = touch.clientX - rect.left
	const y = touch.clientY - rect.top

	ctx.lineTo(x, y)
	ctx.stroke()
}

const clearCanvas = () => {
	if (!ctx || !canvasRef.value) {
		return
	}

	ctx.fillStyle = '#ffffff'
	ctx.fillRect(0, 0, canvasRef.value.width, canvasRef.value.height)
	ElMessage.success('Canvas cleared')
}

const saveSignature = async () => {
	if (!canvasRef.value) {
		return
	}

	const dataURL = canvasRef.value.toDataURL('image/png')

	// Convert base64 to Blob object
	const base64Data = dataURL.split(',')[1]
	const byteCharacters = atob(base64Data)
	const byteNumbers = new Array(byteCharacters.length)
	for (let i = 0; i < byteCharacters.length; i++) {
		byteNumbers[i] = byteCharacters.charCodeAt(i)
	}
	const byteArray = new Uint8Array(byteNumbers)
	const blob = new Blob([byteArray], { type: 'image/png' })

	// Convert Blob to File object
	const file = new File([blob], `${userStore.user.username}.png`, { type: 'image/png' })

	// Create FormData to upload image
	const formData = new FormData()
	formData.append('file', file)

	// Upload signature image
	const { data } = await uploadImg(formData)
	savedSignature.value = dataURL

	// Update user signature
	await useUserSignatureApi({ signature: data.url })

	ElMessage.success('Signature saved')
}

const loadSignatureToCanvas = (imageUrl: string) => {
	if (!ctx || !canvasRef.value) {
		return
	}

	const img = new Image()
	// Set the cross-origin attribute to allow loading images from the server
	img.crossOrigin = 'anonymous'
	img.onload = () => {
		if (ctx && canvasRef.value) {
			// Clear the canvas first and fill it with a white background
			ctx.fillStyle = '#ffffff'
			ctx.fillRect(0, 0, canvasRef.value.width, canvasRef.value.height)
			// Draw signature image
			ctx.drawImage(img, 0, 0, canvasRef.value.width, canvasRef.value.height)
		}
	}
	img.onerror = error => {
		console.error('Failed to load signature image:', error)
	}
	img.src = imageUrl
}

const loadSavedSignature = () => {
	try {
		const signature = userStore.user?.signature
		if (signature) {
			savedSignature.value = signature
			// Delay loading the signature onto the canvas to make sure the canvas is initialized
			setTimeout(() => {
				loadSignatureToCanvas(signature)
			}, 100)
		}
	} catch (error) {
		console.error('Failed to load signature:', error)
	}
}
</script>

<style scoped lang="scss">
.signature-container {
	.signature-header {
		margin-bottom: 20px;
		font-weight: 600;
	}

	.signature-content {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.canvas-wrapper {
		width: 100%;
		background-color: #f5f5f5;
		border: 2px dashed #dcdfe6;
		border-radius: 8px;
		overflow: hidden;
	}

	.signature-canvas {
		display: block;
		cursor: crosshair;
		touch-action: none;
	}

	.signature-actions {
		display: flex;
		justify-content: center;
		gap: 15px;
	}
}
</style>
