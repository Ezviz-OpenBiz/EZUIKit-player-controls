<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { Ptz } from '@ezuikit/control-ptz'

const containerRef = ref<HTMLElement>()
let ptz: Ptz | null = null

onMounted(() => {
  if (containerRef.value) {
    ptz = new Ptz(containerRef.value, {
      language: 'zh',
      accessToken: 'your-access-token',
      deviceSerial: 'your-device-serial',
      channelNo: 1,
      onDirection: (info) => {
        console.log('Ptz direction:', info)
        return () => {}
      },
      onSpeedChange: (speed) => {
        console.log('Ptz speed:', speed)
      },
    })
  }
})

onUnmounted(() => {
  ptz?.destroy()
})
</script>

<template>
  <div>
    <h2>Ptz 云台控制</h2>
    <div ref="containerRef" style="width: 300px; height: 300px;"></div>
  </div>
</template>
