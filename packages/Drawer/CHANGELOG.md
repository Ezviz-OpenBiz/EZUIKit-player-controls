## v0.0.1(2026-09-30)

### Feat

- 抽屉布局骨架：遮罩 + 从四方向（left / right / top / bottom）滑出的面板，带开合过渡动画
- 头部标题栏与关闭按钮（`showHeader` / `showClose`）
- 挂载策略：默认挂载容器（需为定位元素）、挂载到 `document.body` 时相对视口 `fixed`、`getContainer` 动态挂载点（如移动端扩展区）
- 关闭方式：点击遮罩（`maskClosable`）、关闭按钮、Esc（`closeOnEscape`）
- 尺寸配置：`width` / `height`，左右方向应用宽度、上下方向应用高度，number 视为 px
- 外观定制：`className` 追加类名、`zIndex`、`--edrawer-*` CSS 变量
- 实例 API：`open`（getter / setter）、`setTitle`、`setContent`、`updateOptions`、`destroy`、`Drawer.VERSION`
- 打开 / 关闭回调 `onOpenChange`
- 无障碍：面板 `role="dialog"`，头部通过 `aria-labelledby` 关联标题
- 遵循 `prefers-reduced-motion` 关闭过渡动画
