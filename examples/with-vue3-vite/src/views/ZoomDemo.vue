<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import Zoom from '@ezuikit/control-zoom'

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
      <img src="https://via.placeholder.com/600x400" alt="zoom demo" style="width: 100%; height: 100%; object-fit: cover;" />
    </div>
  </div>
</template>
