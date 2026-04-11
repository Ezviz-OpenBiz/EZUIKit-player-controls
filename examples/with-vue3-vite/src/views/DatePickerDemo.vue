<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { DatePicker, Calendar } from '@ezuikit/control-date-picker'

const pickerRef = ref<HTMLElement>()
const calendarRef = ref<HTMLElement>()
let datePicker: DatePicker | null = null
let calendar: Calendar | null = null

onMounted(() => {
  // DatePicker 示例
  if (pickerRef.value) {
    datePicker = new DatePicker(pickerRef.value, {
      language: 'zh',
      current: new Date(),
      onChange: (date, mode) => {
        console.log('DatePicker onChange:', date, mode)
      },
      onCell: (date, mode) => {
        console.log('DatePicker onCell:', date, mode)
      },
    })
  }

  // Calendar 示例
  if (calendarRef.value) {
    calendar = new Calendar(calendarRef.value, {
      language: 'zh',
      current: new Date(),
      badges: [new Date()],
      onChange: (date, dateStr) => {
        console.log('Calendar onChange:', date, dateStr)
      },
    })
  }
})

onUnmounted(() => {
  datePicker?.destroy()
  calendar?.destroy()
})
</script>

<template>
  <div>
    <h2>DatePicker 日期选择器</h2>
    <section>
      <h3>DatePicker</h3>
      <div ref="pickerRef" style="width: 300px;"></div>
    </section>
    <section style="margin-top: 24px;">
      <h3>Calendar 日历</h3>
      <div ref="calendarRef" style="width: 300px;"></div>
    </section>
  </div>
</template>
