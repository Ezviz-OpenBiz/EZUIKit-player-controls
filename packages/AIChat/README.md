# @ezuikit/control-aichat

AI视频搜索对话控制模块

## 功能特性

- 💬 AI对话交互界面
- 🔍 视频搜索结果展示
- 📊 数据统计总结展示
- 🎯 重点事件展示
- 🎬 视频列表浏览
- 🌍 国际化支持（中英文）
- 🔌 纯 UI 组件，数据由上层传入
- 📱 支持移动端和桌面端

## 架构说明

AIChat 模块是一个**纯 UI 组件**，采用事件驱动架构：

1. AIChat 触发用户交互事件（`messageSent`、`quickAction`、`videoPlay`）
2. 上层（ezopen）监听这些事件，调用实际的 AI 接口
3. 上层通过 AIChat 提供的方法传入数据（`showSearchResult`、`showSummary` 等）
4. AIChat 更新 UI 显示

**数据流向：**

```
用户操作 → AIChat 触发事件 → 上层监听事件 → 调用 AI 接口 → 上层调用 AIChat 方法传入数据 → AIChat 更新 UI
```

## 安装

```bash
npm install @ezuikit/control-aichat
# or
yarn add @ezuikit/control-aichat
# or
pnpm add @ezuikit/control-aichat
```
