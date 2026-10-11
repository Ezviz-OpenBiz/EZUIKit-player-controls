# Changelog

All notable changes to this project will be documented in this file.

## 0.0.1

### Feat

- 全局消息 / Toast 通知控件。每个实例是一个独立的消息上下文（context），拥有自己的挂载容器与消息列表，可在页面多个区域分别弹出消息。

- 支持通过单条消息的 `icon` 配置传入图片 URL 或 `HTMLElement`，自定义消息图标。
- 支持通过实例配置 `icon` 设置全局默认图标，并由单条消息图标配置覆盖。
- 支持通过 `icons` 按 `info` / `success` / `warn` / `error` 分别配置消息图标。
