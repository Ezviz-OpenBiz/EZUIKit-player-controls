# Changelog

All notable changes to this project will be documented in this file.

## 0.0.1

### Feat

- 全局消息 / Toast 通知控件。每个实例是一个独立的消息上下文（context），拥有自己的挂载容器与消息列表，可在页面多个区域分别弹出消息
- 挂载与定位：根节点铺满挂载容器（挂到 `document.body` 时相对视口 `fixed`），点击穿透；`top` / `bottom` / `left` / `right` 四个方向布局，`left` / `right` 从左上 / 右上开始展示
- 四种类型 `info` / `success` / `warn` / `error`，带图标与不同配色；通过静态方法 `Message.setIcons()` 按类型设置全局图标（图片 URL 或 `HTMLElement`），传入 `{}` 恢复内置图标
- Toast 自动关闭（`duration`，默认 3000ms，`0` 为不自动关闭），支持 `maxCount` 限制同时显示条数；单条消息可单独指定 `duration` / `onClose`，实例级回调 `onOpen` / `onClose`
- `full(content, options)`：覆盖整个容器的全屏消息，图标在上、文案在下，可通过 `type` 指定类型，提供右上角关闭按钮；普通 Toast 不显示关闭按钮
- `notification(content, options)`：无图标通知，使用独立的右上通知区并从右侧滑入、向右滑出；不超过三条时依次排列，超过三条时叠放（第二条起叠在第一条后面并下移 2px，第三条再下移 2px，第四条及之后与第三条重合，各条完整展示）；后创建的通知层级更高，鼠标悬停时展开全部通知；关闭按钮位于右上角
- 实例 API：`info` / `success` / `warn` / `error` / `notification` / `full` / `open`（均返回消息 id）、`close(id?)`、`clear()`、`updateOptions()`、`destroy()`、`Message.VERSION`
- 消息内容支持字符串（按 HTML 解析，不可信内容请传 `HTMLElement`）与 `HTMLElement`
- 外观定制：`className` 追加类名、`zIndex`、`--emessage-*` CSS 变量
- 为各公开方法的 JSDoc 补充 `@example`，README 提供方法示例
