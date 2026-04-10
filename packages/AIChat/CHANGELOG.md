# Changelog

All notable changes to this project will be documented in this file.

## [0.0.1] - 2026-01-19

### Added

- 初始版本发布
- AI 对话界面基础框架
- 欢迎界面、对话界面、总结界面、视频列表界面
- 消息气泡组件
- 视频卡片组件
- 事件系统（messageSent、quickAction、videoPlay、viewAll）
- 国际化支持（中文、英文）
- 移动端和桌面端适配
- 完整的 TypeScript 类型定义

### Features

- 💬 AI 对话交互界面
- 🔍 视频搜索结果展示
- 📊 数据统计总结展示
- 🎯 重点事件展示
- 🎬 视频列表浏览
- 🌍 国际化支持
- 🔌 纯 UI 组件，数据由上层传入
- 📱 响应式设计

### Architecture

- 采用事件驱动架构
- 纯 UI 组件，不包含业务逻辑
- 所有数据通过方法调用传入
- 通过事件通知上层用户操作
