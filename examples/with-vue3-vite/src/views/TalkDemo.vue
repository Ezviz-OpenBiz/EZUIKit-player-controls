<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import Talk from '@ezuikit/control-talk'

let talk: Talk | null = null
const isTalking = ref(false)

onMounted(() => {
  talk = new Talk({
    deviceSerial: 'your-device-serial',
    channelNo: '1',
    accessToken: 'your-access-token',
    env: { domain: 'https://open.ys7.com' },
    capacity: { support_talk: null, support_switch_talkmode: null },
  })
})

const startTalk = () => {
  talk?.startTalk((isGb) => {
    console.log('Talk started, isGb:', isGb)
    isTalking.value = true
  })
}

const stopTalk = () => {
  talk?.stopTalk()
  isTalking.value = false
}

onUnmounted(() => {
  talk?.destroy()
})
</script>

<template>
  <div>
    <h2>Talk 对讲</h2>
    <p>状态: {{ isTalking ? '对讲中...' : '未开始' }}</p>
    <button @click="startTalk" :disabled="isTalking">开始对讲</button>
    <button @click="stopTalk" :disabled="!isTalking" style="margin-left: 8px;">停止对讲</button>
  </div>
</template>
