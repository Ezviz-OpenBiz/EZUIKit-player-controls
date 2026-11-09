# Changelog

All notable changes to this project will be documented in this file.

## 0.0.1 (2026-11-09)

### Feat

- 抽屉布局控件：只负责布局骨架，业务内容通过 `content` / `setContent()` 注入。遮罩 + 从四方向（`left` / `right` / `top` / `bottom`）滑出的面板，带开合过渡动画；非法 `placement` 回退 `right`
- 头部标题栏与关闭按钮（`showHeader` / `showClose`），标题与内容支持字符串（按 HTML 解析，不可信内容请传 `HTMLElement`）与 `HTMLElement`
- 挂载策略：默认挂载容器（支持元素 ID、CSS 选择器、`HTMLElement`，需为定位元素）、挂载到 `document.body` 时相对视口 `fixed`、`getContainer` 动态挂载点（每次 `open = true` 时解析，如移动端扩展区；返回空值回退到构造容器，抛错时 `open` 保持原状态且不触发回调）
- 关闭方式：点击遮罩（`maskClosable`）、关闭按钮、Esc（`closeOnEscape`）。Esc 监听仅在打开期间存在，注册在容器所属的文档上（iframe 内的容器在 iframe 内按 Esc 生效），输入法组合输入中以及已被内部控件 `preventDefault()` 的 Esc 不会关闭抽屉
- 尺寸配置：`width` / `height`，左右方向应用宽度、上下方向应用高度，number 视为 px
- 动画时长 `duration`（默认 300ms）：写入根节点 `--edrawer-duration`，使 CSS 过渡与 JS 定时器一致；非有限数 / 负数回退默认值
- 外观定制：`className` 追加类名、`zIndex`、`--edrawer-*` CSS 变量（含 `--edrawer-max-width` / `--edrawer-max-height`）
- 实例 API：`open`（getter / setter）、`options`、`setTitle`、`setContent`、`updateOptions`、`destroy`、`Drawer.VERSION`；`updateOptions` 重建 DOM 并保持当前开合状态，不重播动画
- 打开 / 关闭回调：`onOpenChange`，以及生命周期回调 `onOpenStart` / `onOpenEnd` / `onCloseStart` / `onCloseEnd`；反向切换、`updateOptions`、`destroy` 会取消未触发的结束回调，`destroy` 不触发任何回调；开始回调内再次设置 `open`、调用 `updateOptions()` 或 `destroy()` 时以最终状态为准
- 继承：可作为基类扩展（AlarmMessage、Broadcast 即以子类方式复用），可重写 `open` 访问器；构造配置 `open: true` 仅对直接 `new Drawer()` 自动生效，子类在构造函数末尾调用受保护方法 `applyInitialOpen()`
- 无障碍：面板 `role="dialog"`，头部通过 `aria-labelledby` 关联标题，关闭按钮带 `aria-label`
- 仅限浏览器环境：构造函数会访问 `document`，SSR 下需在客户端创建
- 为构造函数与各公开成员的 JSDoc 补充 `@example`，README 提供方法示例，`public/index.html` 提供配置与 API 演示
- 测试：Jest 单测（回调顺序、`duration`、`updateOptions`、`getContainer`、开始回调重入、iframe、Esc 过滤、子类继承）与 Playwright e2e（四方向滑入滑出、遮罩、`fixed` 定位、过渡时长）
