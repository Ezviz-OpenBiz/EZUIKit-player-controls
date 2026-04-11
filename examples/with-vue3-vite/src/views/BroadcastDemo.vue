<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import Broadcast from '@ezuikit/control-broadcast'

const containerRef = ref<HTMLElement>()
let broadcast: Broadcast | null = null

onMounted(() => {
  if (containerRef.value) {
    broadcast = new Broadcast({
      container: containerRef.value,
      deviceSerial: 'your-device-serial',
      channelNo: 1,
      accessToken: 'your-access-token',
      language: 'zh',
      direction: 'bottom',
    })

    broadcast.on(Broadcast.EVENTS.requestQueryVoiceList, () => {
      console.log('Broadcast: 请求语音列表')
    })

    broadcast.on(Broadcast.EVENTS.requestSendVoice, (data: any) => {
      console.log('Broadcast: 下发语音', data)
    })

    broadcast.on(Broadcast.EVENTS.requestSendVoiceOnce, (data: any) => {
      console.log('Broadcast: 下发临时语音', data)
    })

    broadcast.open()
  }
})

onUnmounted(() => {
  broadcast?.destroy()
})
</script>

<template>
  <div>
    <h2>Broadcast 云广播</h2>
    <div ref="containerRef" style="width: 400px; height: 500px; position: relative;"></div>
  </div>
</template>
