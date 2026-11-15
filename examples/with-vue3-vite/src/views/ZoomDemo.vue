<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import Zoom from '@ezuikit/control-zoom'

// 内联 SVG 示例图，不依赖外部图床
const demoImage =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1890ff"/><stop offset="1" stop-color="#722ed1"/></linearGradient></defs><rect width="600" height="400" fill="url(#g)"/><circle cx="300" cy="200" r="120" fill="none" stroke="#fff" stroke-width="4"/><text x="300" y="210" font-size="32" fill="#fff" text-anchor="middle">Zoom Demo</text></svg>'
  )

const containerRef = ref<HTMLElement>()
let zoom: Zoom | null = null

onMounted(() => {
  if (containerRef.value) {
    zoom = new Zoom(containerRef.value, {
      initialZoom: 1,
      allowWheel: true,
      allowPan: true,
      max: 8,
      min: 1,
      onChange: (zoomVal, reset) => {
        console.log('Zoom onChange:', zoomVal, reset)
      },
    })
  }
})

const zoomIn = () => zoom?.zoomIn(0.5)
const zoomOut = () => zoom?.zoomOut(0.5)
const resetZoom = () => zoom?.reset()

onUnmounted(() => {
  zoom?.destroy()
})
</script>

<template>
  <div>
    <h2>Zoom 缩放控制</h2>
    <div style="margin-bottom: 12px;">
      <button @click="zoomIn">放大</button>
      <button @click="zoomOut" style="margin-left: 8px;">缩小</button>
      <button @click="resetZoom" style="margin-left: 8px;">重置</button>
    </div>
    <div ref="containerRef" style="width: 600px; height: 400px; border: 1px solid #ccc; overflow: hidden;">
      <img :src="demoImage" alt="zoom demo" style="width: 100%; height: 100%; object-fit: cover;" />
    </div>
  </div>
</template>
