<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import Broadcast from '@ezuikit/control-broadcast'
import '@ezuikit/control-broadcast/dist/style/style.css'

// 模拟宿主下发接口（实际项目中替换为真实的下发请求）
const mockRequest = () => new Promise<void>((resolve) => setTimeout(resolve, 500))

const containerRef = ref<HTMLElement>()
const voiceCount = ref(0)
let broadcast: Broadcast | null = null

onMounted(() => {
  if (!containerRef.value) return

  // 第一个参数是挂载容器，非 body 容器需为定位元素
  const instance = new Broadcast(containerRef.value, {
    deviceSerial: 'your-device-serial',
    channelNo: 1,
    accessToken: 'your-access-token',
    language: 'zh',
    direction: 'bottom',
    onOpen: () => console.log('Broadcast: 面板已打开'),
    onClose: () => console.log('Broadcast: 面板已关闭'),
    // 语音列表由控件调用内置接口查询，加载完后通过该回调通知宿主
    onVoiceListChange: (list) => {
      voiceCount.value = list.length
    },
    onApiResult: (result) => console.log('Broadcast: 内置接口结果', result),
    onRecordComplete: (voiceFile) => console.log('Broadcast: 录音完成', voiceFile.size),
    onError: ({ type, code, msg }) => console.log('Broadcast: 错误', type, code, msg),
    // 配置后由宿主接管「下发默认语音」，下发后用 showSuccess / showError 回填结果
    onRequestSendVoice: async ({ fileUrl, channelNo }) => {
      console.log('Broadcast: 下发语音', fileUrl, channelNo)
      try {
        await mockRequest()
        instance.showSuccess('语音下发成功')
      } catch (error: any) {
        instance.showError(error?.message || '语音下发失败')
      }
    },
    // 配置后由宿主接管「下发临时语音」（录音结束时触发）
    onRequestSendVoiceOnce: async ({ voiceFile, channelNo }) => {
      console.log('Broadcast: 下发临时语音', voiceFile.size, channelNo)
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
const reload = () => broadcast?.loadVoiceList()
</script>

<template>
  <div>
    <h2>Broadcast 云广播</h2>
    <div style="margin-bottom: 12px;">
      <button @click="open">打开</button>
      <button @click="close" style="margin-left: 8px;">关闭</button>
      <button @click="reload" style="margin-left: 8px;">重新加载语音列表</button>
      <span style="margin-left: 12px;">语音数量：{{ voiceCount }}</span>
    </div>
    <div ref="containerRef" style="width: 400px; height: 500px; position: relative; background: #000;"></div>
  </div>
</template>
