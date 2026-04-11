<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import AIChat from '@ezuikit/control-aichat'

const containerRef = ref<HTMLElement>()
let aiChat: AIChat | null = null

onMounted(() => {
  if (containerRef.value) {
    aiChat = new AIChat({
      container: containerRef.value,
      language: 'zh',
      isMobile: false,
      isAICloudEnabled: true,
      accessToken: 'your-access-token',
      deviceSerial: 'your-device-serial',
      channelNo: 1,
    })

    aiChat.on(AIChat.EVENTS.messageSent, (data: any) => {
      console.log('AIChat messageSent:', data)
    })

    aiChat.on(AIChat.EVENTS.videoPlay, (data: any) => {
      console.log('AIChat videoPlay:', data)
    })

    aiChat.open()
  }
})

onUnmounted(() => {
  aiChat?.destroy()
})
</script>

<template>
  <div>
    <h2>AIChat AI视频搜索对话</h2>
    <div ref="containerRef" style="width: 400px; height: 600px; position: relative;"></div>
  </div>
</template>
