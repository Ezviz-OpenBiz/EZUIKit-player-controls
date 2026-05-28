# Changelog

All notable changes to this project will be documented in this file.

## [0.1.0-beta.4] - 2026-05-28

### Added

- 快捷操作 `actionList` 支持 `children`
  - 含 `children` 的项渲染为带"▾"的下拉按钮，点击弹 popover（fixed 定位 + body 挂载）
  - 完整键盘交互：Enter/Space/Esc/Tab/方向键
- 内置"相关度"按钮
  - 固定追加在 `actionList` 最右
  - 子项 低 / 中 / 高（默认"高"，level=3）
  - 选中后不发消息，只切 level 状态 + 改父按钮文案
  - 新增 `onRelevanceLevelChange` 回调
- `chat/completions` 接口新增 `relevanceLevel` 参数（1/2/3）
- 横滚虚化提示：quickActions 容器溢出时按方向给出 `data-can-scroll-left/right` 渐隐遮罩
- 横滚支持鼠标拖拽（H5 / 桌面统一）
- 视频卡 hover 蒙层 + 点击播放动画（含 3s 延迟选项，给后端拉流留时间）
- README 补充：升级页 / actionList / relevanceLevel / CSS 引入说明


### Fixed

- 升级页"立即升级"按钮无回调（`handleUpgradeService` 内部漏调 `options.onUpgradeService?.()`）

### Notes

- 主 SDK 接入升级页时 `onUpgradeService` 必须挂在 `params.onUpgradeService`，ezopen 内部从这里读取
- `actionList` `intelligentType` 参数暂保持不传，与历史版本一致

---

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
