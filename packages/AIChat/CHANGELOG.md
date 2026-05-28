# Changelog

All notable changes to this project will be documented in this file.

## [0.1.0-beta.5] - 2026-05-28

### Added

- 新增嵌入模式 `AIChatOptions.embed`（默认 `false`）
  - 设为 `true` 时 UI 直接挂进 `container`，宽高跟随容器，自动关闭拖拽和左上角关闭按钮
  - 未传 `container` 时降级为 `false` 并打印 warn
  - 嵌入模式下 container 最小宽度 300px

### Changed

- 视频卡尺寸由固定高度改为 152:85 比例自适应

### Compatibility

- 不传 `embed` 时行为与 0.1.0-beta.4 一致，无 breaking change

---

## [0.1.0-beta.4] - 2026-05-28

### Added

- 快捷操作 `actionList` 新增 `children` 字段，含子项时渲染为下拉按钮 + popover
- 新增内置"相关度"按钮（低 / 中 / 高，默认高）+ `onRelevanceLevelChange` 回调
- `chat/completions` 新增 `relevanceLevel` 请求参数（1/2/3）
- 视频卡支持鼠标 hover 蒙层与点击播放动画（带可选播放延迟）
- 快捷操作横滚支持鼠标拖拽

### Fixed

- 升级页"立即升级"按钮未触发 `onUpgradeService` 回调

### Notes

- 主 SDK 接入升级页时 `onUpgradeService` 需挂在 `params.onUpgradeService`
- `chat/suggested` 接口的 `intelligentType` 暂保持不传

---

## [0.0.1] - 2026-01-19

初始版本发布。
