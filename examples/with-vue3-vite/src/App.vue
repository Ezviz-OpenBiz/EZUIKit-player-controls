<script setup lang="ts">
import { RouterView, RouterLink } from 'vue-router'
</script>

<template>
  <div class="app">
    <nav class="sidebar">
      <h3>EZUIKit Controls</h3>
      <RouterLink to="/">首页</RouterLink>
      <RouterLink to="/date-picker">DatePicker 日期选择</RouterLink>
      <RouterLink to="/ptz">Ptz 云台控制</RouterLink>
      <RouterLink to="/aichat">AIChat AI对话</RouterLink>
      <RouterLink to="/talk">Talk 对讲</RouterLink>
      <RouterLink to="/time-line">TimeLine 时间轴</RouterLink>
      <RouterLink to="/zoom">Zoom 缩放</RouterLink>
      <RouterLink to="/broadcast">Broadcast 云广播</RouterLink>
    </nav>
    <main class="content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app {
  display: flex;
  min-height: 100vh;
}
.sidebar {
  width: 220px;
  padding: 16px;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.sidebar a {
  text-decoration: none;
  color: #333;
  padding: 8px 12px;
  border-radius: 4px;
}
.sidebar a:hover,
.sidebar a.router-link-active {
  background: #1890ff;
  color: #fff;
}
.content {
  flex: 1;
  padding: 24px;
}
</style>
