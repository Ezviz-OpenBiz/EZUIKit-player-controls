<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { TimeLine, MobileTimeLine } from '@ezuikit/control-time-line'

const pcRef = ref<HTMLElement>()
const mobileRef = ref<HTMLElement>()
let timeLine: TimeLine | null = null
let mobileTimeLine: MobileTimeLine | null = null

const now = new Date()
const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 8, 0, 0)
const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0)

const timeSections = [
  { startTime: todayStart.getTime(), endTime: todayEnd.getTime(), coverPic: '' },
]

onMounted(() => {
  // PC 时间轴
  if (pcRef.value) {
    timeLine = new TimeLine(pcRef.value, {
      current: now,
      language: 'zh',
      timeSections,
      width: 800,
      height: 60,
      onChange: (time) => {
        console.log('TimeLine onChange:', time)
      },
    })
  }

  // 移动端时间轴
  if (mobileRef.value) {
    mobileTimeLine = new MobileTimeLine(mobileRef.value, {
      current: now,
      language: 'zh',
      timeSections,
      height: 200,
      showTimeWidthBtn: true,
      onChange: (time) => {
        console.log('MobileTimeLine onChange:', time)
      },
    })
  }
})

onUnmounted(() => {
  timeLine?.destroy()
  mobileTimeLine?.destroy()
})
</script>

<template>
  <div>
    <h2>TimeLine 时间轴</h2>
    <section>
      <h3>PC 时间轴</h3>
      <div ref="pcRef"></div>
    </section>
    <section style="margin-top: 24px;">
      <h3>移动端时间轴</h3>
      <div ref="mobileRef" style="width: 375px;"></div>
    </section>
  </div>
</template>
