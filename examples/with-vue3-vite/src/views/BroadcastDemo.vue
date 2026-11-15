<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import Broadcast from '@ezuikit/control-broadcast'
import '@ezuikit/control-broadcast/dist/style/style.css'

// 模拟宿主接口（实际项目中替换为 player.queryVoiceList / sendVoice / sendVoiceOnce）
const mockVoiceList = [
  { voiceName: '欢迎光临', fileUrl: 'https://example.com/welcome.wav', duration: 3 },
  { voiceName: '请勿靠近', fileUrl: 'https://example.com/warning.wav', duration: 5 },
]
const mockRequest = <T,>(data?: T) => new Promise<T | undefined>((resolve) => setTimeout(() => resolve(data), 500))

const containerRef = ref<HTMLElement>()
let broadcast: Broadcast | null = null

onMounted(() => {
  if (!containerRef.value) return

  // 第一个参数是挂载容器，容器需为定位元素
  const instance = new Broadcast(containerRef.value, {
    deviceSerial: 'your-device-serial',
    channelNo: 1,
    accessToken: 'your-access-token',
    language: 'zh',
    direction: 'bottom',
    onOpen: () => console.log('Broadcast: 面板已打开'),
    onClose: () => console.log('Broadcast: 面板已关闭'),
    onRecordComplete: (voiceFile) => console.log('Broadcast: 录音完成', voiceFile.size),
    onRecordError: ({ msg }) => console.log('Broadcast: 录音错误', msg),
    // 查询语音列表：打开面板时没有语音列表，或调用 loadVoiceList() 时触发
    onRequestQueryVoiceList: async (params) => {
      console.log('Broadcast: 请求语音列表', params)
      try {
        const list = await mockRequest(mockVoiceList)
        instance.updateVoiceList(list ?? [])
      } catch (error: any) {
        instance.showError(error?.message || '语音列表加载失败')
      }
    },
    // 下发默认语音：点击语音项时触发
    onRequestSendVoice: async ({ fileUrl, channelNo }) => {
      console.log('Broadcast: 下发语音', fileUrl, channelNo)
      try {
        await mockRequest()
        instance.showSuccess('语音下发成功')
      } catch (error: any) {
        instance.showError(error?.message || '语音下发失败')
      }
    },
    // 下发临时语音：录音结束、得到有效录音时触发
    onRequestSendVoiceOnce: async ({ voiceFile, channelNo }) => {
      console.log('Broadcast: 下发临时语音', voiceFile, channelNo)
      try {
        await mockRequest()
        instance.showSuccess('临时语音下发成功')
      } catch (error: any) {
        instance.showError(error?.message || '临时语音下发失败')
      }
    },
  })

  broadcast = instance
  broadcast.open = true
})

onUnmounted(() => {
  broadcast?.destroy()
  broadcast = null
})

const open = () => {
  if (broadcast) broadcast.open = true
}
const close = () => broadcast?.close()
</script>

<template>
  <div>
    <h2>Broadcast 云广播</h2>
    <div style="margin-bottom: 12px;">
      <button @click="open">打开</button>
      <button @click="close" style="margin-left: 8px;">关闭</button>
    </div>
    <div ref="containerRef" style="width: 400px; height: 500px; position: relative; background: #000;"></div>
  </div>
</template>
