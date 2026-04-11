<template>
  <div id="app" class="app">
    <nav class="sidebar">
      <h3>EZUIKit Controls</h3>
      <router-link to="/">首页</router-link>
      <router-link to="/date-picker">DatePicker 日期选择</router-link>
      <router-link to="/ptz">Ptz 云台控制</router-link>
      <router-link to="/aichat">AIChat AI对话</router-link>
      <router-link to="/talk">Talk 对讲</router-link>
      <router-link to="/time-line">TimeLine 时间轴</router-link>
      <router-link to="/zoom">Zoom 缩放</router-link>
      <router-link to="/broadcast">Broadcast 云广播</router-link>
    </nav>
    <main class="content">
      <router-view />
    </main>
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
.app { display: flex; min-height: 100vh; }
.sidebar { width: 220px; padding: 16px; background: #f5f5f5; display: flex; flex-direction: column; gap: 8px; }
.sidebar h3 { margin-bottom: 8px; }
.sidebar a { text-decoration: none; color: #333; padding: 8px 12px; border-radius: 4px; display: block; }
.sidebar a:hover, .sidebar a.router-link-active { background: #1890ff; color: #fff; }
.content { flex: 1; padding: 24px; }
</style>
