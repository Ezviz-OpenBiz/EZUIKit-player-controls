# @ezuikit/control-drawer 使用指南

抽屉布局控件。只提供布局骨架：遮罩、从四个方向滑出的面板、标题栏与关闭按钮、开合动画和挂载策略；业务内容通过 `content` 注入。`@ezuikit/control-alarm-message` 基于它实现告警消息面板。

## 安装

```bash
pnpm add @ezuikit/control-drawer
```

> **仅限浏览器环境。** 构造函数会直接访问 `document` 并创建 DOM，必须在客户端创建（Next.js / Nuxt 等 SSR 框架里放到 `useEffect` / `onMounted` 等仅客户端执行的钩子中，或用动态导入关闭 SSR）。在 Node 服务端 `new Drawer()` 会抛出 `ReferenceError: document is not defined`；仅 `import` 模块不会出错。

## 快速开始

```ts
import Drawer from '@ezuikit/control-drawer';
import '@ezuikit/control-drawer/dist/style/style.css';

const list = document.createElement('div');

// 挂载容器需为定位元素（position 非 static），抽屉相对它铺满；缺省为 document.body（相对视口）
const drawer = new Drawer(document.getElementById('player')!, {
  title: '告警消息',
  content: list,
  placement: 'right',
  width: 300,
  onOpenChange: (open) => console.log('open =', open),
});

drawer.open = true;
drawer.open = false;
drawer.destroy();
```

UMD：

```html
<link rel="stylesheet" href="./style/style.css" />
<script src="./index.umd.js"></script>
<script>
  const drawer = new Drawer('#player', { title: 'Title', content: '<p>Hello</p>' });
  drawer.open = true;
</script>
```

### 动态挂载点

挂载点晚于控件创建才出现时（如移动端扩展区），用 `getContainer`：首次打开（`open = true`）前不挂载 DOM，每次打开时重新解析并在需要时移动 DOM，返回空时回退到 `container`。

```ts
const drawer = new Drawer(playerEl, {
  placement: 'bottom',
  height: '100%',
  showMask: false,
  getContainer: () => document.querySelector<HTMLElement>('.ezplayer-mobile-extend'), // 需为定位元素
});
```

## 构造函数

`new Drawer(container?, options?)`

| 参数        | 类型                    | 默认            | 说明                                                     |
| ----------- | ----------------------- | --------------- | -------------------------------------------------------- |
| `container` | `string \| HTMLElement` | `document.body` | 默认挂载容器，支持元素 ID、CSS 选择器；找不到时回退 body |
| `options`   | `DrawerOptions`         | -               | 配置项，见下表                                           |

## 配置项

| 参数            | 类型                                     | 默认      | 说明                                                                         |
| --------------- | ---------------------------------------- | --------- | ---------------------------------------------------------------------------- |
| `title`         | `string \| HTMLElement`                  | -         | 标题，字符串按 HTML 插入                                                     |
| `content`       | `string \| HTMLElement`                  | -         | 内容，字符串按 HTML 插入                                                     |
| `placement`     | `'left' \| 'right' \| 'top' \| 'bottom'` | `'right'` | 弹出方向，非法值回退 `right`                                                 |
| `width`         | `number \| string`                       | `300`     | 面板宽度（左右方向生效），number 视为 px                                     |
| `height`        | `number \| string`                       | `300`     | 面板高度（上下方向生效），number 视为 px                                     |
| `showMask`      | `boolean`                                | `true`    | 遮罩；关闭后面板以外区域可操作底层内容                                       |
| `maskClosable`  | `boolean`                                | `true`    | 点击遮罩关闭                                                                 |
| `showHeader`    | `boolean`                                | `true`    | 头部（标题 + 关闭按钮）                                                      |
| `showClose`     | `boolean`                                | `true`    | 关闭按钮，`showHeader` 为 `false` 时无效                                     |
| `closeOnEscape` | `boolean`                                | `true`    | Esc 关闭                                                                     |
| `duration`      | `number`                                 | `300`     | 开合动画时长（ms），非有限数 / 负数回退 300，自动同步到 `--edrawer-duration` |
| `open`          | `boolean`                                | `false`   | 创建后立即打开（仅构造时生效）                                               |
| `zIndex`        | `number`                                 | -         | 根节点层级，缺省取 `--edrawer-z-index`（100）                                |
| `className`     | `string`                                 | -         | 追加到根节点的类名，多个用空格分隔                                           |
| `getContainer`  | `() => HTMLElement \| null \| undefined` | -         | 动态挂载点，见上文                                                           |
| `onOpenChange`  | `(open: boolean) => void`                | -         | 打开/关闭回调，参数为当前状态                                                |
| `onOpenStart`   | `() => void`                             | -         | 打开开始（动画开始前同步触发）                                               |
| `onOpenEnd`     | `() => void`                             | -         | 打开结束（过渡结束后触发）                                                   |
| `onCloseStart`  | `() => void`                             | -         | 关闭开始（动画开始前同步触发）                                               |
| `onCloseEnd`    | `() => void`                             | -         | 关闭结束（过渡结束、根节点隐藏后触发）                                       |

## 方法 / 属性

| 成员                                      | 说明                                                                                                                                      |
| ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `open`                                    | 布尔属性（getter/setter），打开/关闭抽屉；重复设置相同状态为幂等，销毁后设置无效；`getContainer` 抛错时异常向上抛出，状态与回调均保持不变 |
| `options`                                 | 当前生效的配置对象（实例独享，已与默认配置合并）                                                                                          |
| `setTitle(title)` / `setContent(content)` | 更新标题 / 内容，不重建 DOM                                                                                                               |
| `updateOptions(opts)`                     | 更新配置并重建 DOM，保持当前开合状态且不重播动画                                                                                          |
| `destroy()`                               | 销毁（幂等），移除 DOM、定时器与监听，不触发任何回调                                                                                      |
| `Drawer.VERSION`                          | 构建时由 Rollup 注入的版本号（静态属性）                                                                                                  |

没有事件订阅（无 `on` / `off`），状态变化统一通过配置项回调通知，见下节。

类型从入口导出：`import Drawer, { type DrawerOptions, type DrawerPlacement, type DrawerContainerGetter } from '@ezuikit/control-drawer'`。

### 继承

`@ezuikit/control-alarm-message`、`@ezuikit/control-broadcast` 都以子类方式复用 Drawer。子类可重写 `open` 访问器，需 getter / setter 成对重写，并通过 `super.open` 复用基类逻辑：

```ts
class MyDrawer extends Drawer {
  get open() {
    return super.open;
  }
  set open(value: boolean) {
    // 自定义逻辑
    super.open = value;
  }
}
```

**构造配置 `open: true` 对子类不会自动生效。** 基类构造函数先于子类字段初始化执行，此时触发 `open` 访问器与回调会读到未初始化的子类状态（例如重写的 `open` 里访问子类字段会抛 `TypeError`）。因此直接 `new Drawer({ open: true })` 仍会自动打开，而子类实例（`new.target !== Drawer`）不会；子类需在自己的构造函数末尾（字段与回调都就绪后）调用受保护方法 `applyInitialOpen()`：

```ts
class MyDrawer extends Drawer {
  private readonly logs: string[] = [];

  constructor(container: HTMLElement, options: DrawerOptions) {
    super(container, options);
    this.options.onOpenChange = (open) => this.logs.push(`open=${open}`);
    this.applyInitialOpen(); // 按 options.open 决定是否打开；open 缺省或为 false 时什么也不做
  }
}
```

不需要构造即打开的子类（如 AlarmMessage、Broadcast）无需处理，构造后设置 `open = true` 即可。

## 打开 / 关闭回调

抽屉在开合过程中按生命周期派发回调，触发顺序如下：

- 打开：`onOpenStart`（同步，动画开始前）→ `onOpenEnd`（过渡结束后）
- 关闭：`onCloseStart`（同步，动画开始前）→ `onCloseEnd`（过渡结束、根节点隐藏后）

另有 `onOpenChange(open)`：打开与关闭时同步调用，参数为当前状态 `boolean`，在 `onOpenStart` / `onCloseStart` 之后触发。完整顺序：

```text
open = true   →  onOpenStart → onOpenChange(true)  → （duration 后）onOpenEnd
open = false  →  onCloseStart → onOpenChange(false) → （duration 后）onCloseEnd
```

- 结束回调依赖与过渡时长（`duration`，默认 300ms）一致的定时器，而非 `transitionend`；`duration: 0` 在下一个定时器周期触发。
- 反向切换（如打开动画中途关闭）会取消尚未触发的结束回调，`destroy()` 与 `updateOptions()`（重建 DOM）同样会取消。
- 点击关闭按钮 / 遮罩、按 Esc 与直接设置 `open = false` 走同一条路径，回调一致。
- 直接 `new Drawer({ open: true })` 同样会触发 `onOpenStart` / `onOpenChange(true)` / `onOpenEnd`（子类见上文“继承”）。
- `destroy()` 不触发任何回调。

**在开始回调里再次改变状态。** `onOpenStart` / `onCloseStart` 内可以再设置 `open`、调用 `updateOptions()` 或 `destroy()`，以回调内的最终状态为准，被覆盖的那次开合不再继续（其 `onOpenChange` 与结束回调不会触发）：

| 回调内的操作                    | 结果                                                                                                |
| ------------------------------- | --------------------------------------------------------------------------------------------------- |
| `onOpenStart` 内 `open = false` | 保持关闭，只触发 `onCloseStart` / `onOpenChange(false)`，不触发 `onOpenChange(true)` 与 `onOpenEnd` |
| `onCloseStart` 内 `open = true` | 保持打开，不触发 `onCloseEnd`                                                                       |
| 开始回调内 `destroy()`          | 不再渲染，不残留 Esc 监听与定时器，后续回调均不触发                                                 |
| 开始回调内 `updateOptions()`    | 以重建后的节点完成本次开合                                                                          |

## 样式与类名

统一前缀 `edrawer`（常量 `__DRAWER_PREFIX_CLS__`，SCSS 变量 `$edrawer-prefix-cls`）：

- 结构：`edrawer`（根）> `edrawer-mask` + `edrawer-panel` > `edrawer-header`（`edrawer-title`、`edrawer-close`）+ `edrawer-body`
- 状态：`edrawer-left` / `-right` / `-top` / `-bottom`、`edrawer-open`、`edrawer-hidden`、`edrawer-fixed`（挂在 body 上）

外观通过 CSS 变量定制，可设在 `className` 对应的根节点上按实例覆盖：

| 变量                            | 默认              | 说明                 |
| ------------------------------- | ----------------- | -------------------- |
| `--edrawer-z-index`             | `100`             | 根节点层级           |
| `--edrawer-duration`            | `0.3s`            | 开合动画时长         |
| `--edrawer-bg`                  | `#fff`            | 面板背景             |
| `--edrawer-color`               | `rgba(0,0,0,.88)` | 面板文字色           |
| `--edrawer-mask-bg`             | `rgba(0,0,0,.3)`  | 遮罩色               |
| `--edrawer-border-color`        | `rgba(0,0,0,.1)`  | 面板内侧边框         |
| `--edrawer-max-width`           | `100%`            | 左右方向的最大宽度   |
| `--edrawer-max-height`          | `100%`            | 上下方向的最大高度   |
| `--edrawer-header-height`       | `40px`            | 头部高度（含分隔线） |
| `--edrawer-header-padding`      | `0 16px`          | 头部内边距           |
| `--edrawer-header-border-color` | `rgba(0,0,0,.08)` | 头部分隔线           |
| `--edrawer-title-color`         | `#333`            | 标题色               |
| `--edrawer-title-font-size`     | `14px`            | 标题字号             |
| `--edrawer-close-color`         | `rgba(0,0,0,.45)` | 关闭按钮色           |
| `--edrawer-close-hover-color`   | `rgba(0,0,0,.88)` | 关闭按钮悬停色       |
| `--edrawer-close-hover-bg`      | `rgba(0,0,0,.06)` | 关闭按钮悬停背景     |

```css
/* 例：告警消息面板在 PC 端最多占容器 80% 宽 */
.ezuikit-alarm-message-drawer {
  --edrawer-max-width: 80%;
}
```

## 注意事项

**挂载容器必须是定位元素。** 根节点是 `position: absolute` 铺满容器；容器为 `static` 时会相对更外层的定位祖先铺开。挂载到 `document.body` 时自动切换为 `position: fixed`（相对视口）。

**字符串按 HTML 插入。** `title` / `content` / `setTitle` / `setContent` 传字符串时写入 `innerHTML`，只能传可信内容；不可信数据请自行转义或传 `HTMLElement`。

**动画时长可配。** 通过 `duration`（ms）配置开合时长，默认 300；组件会把该值写入根节点的 `--edrawer-duration`，使遮罩/面板的 CSS 过渡与 JS 定时器保持一致。只在宿主 CSS 里改 `transition` 时长不会改变 JS 的隐藏时机。面板为 CSS `transition: transform` 滑入滑出，遮罩为 `transition: opacity` 淡入淡出，不使用 `@keyframes`。组件内置样式不响应 `prefers-reduced-motion`（Windows 关闭"显示动画"、远程桌面 / 虚拟机、省电模式下浏览器都会命中该偏好，会导致抽屉瞬间出现）；需要尊重该偏好的宿主可自行追加 `@media (prefers-reduced-motion: reduce) { .edrawer-mask, .edrawer-panel { transition: none; } }`。

**`updateOptions` 会重建 DOM。** 以 `HTMLElement` 传入的内容会被移动到新节点，引用与其上的监听保留，但内部滚动位置会重置；只改文案时用 `setTitle` / `setContent`。

**显式传 `undefined` 会覆盖默认值。** 配置按 `Object.assign({}, 默认配置, options)` 浅合并，DOM 节点与函数按引用保留；`{ width: undefined }` 会让面板失去默认宽度，不需要的字段请不要传。

**Esc 监听挂在容器所属的 `document` 上**，仅在打开期间存在（兼容旧浏览器的 `Esc` 键值）。容器位于 iframe 等其它文档内时，监听注册在该 iframe 的 `document` 上（在 iframe 内按 Esc 才会关闭，顶层页面按 Esc 不会）；`getContainer` 把抽屉移到另一个文档时监听随之迁移。以下按键不会关闭抽屉：输入法组合输入中的 Esc（`isComposing` / `keyCode === 229`，用于取消候选词），以及已被内部控件调用 `preventDefault()` 处理过的 Esc（如抽屉内的下拉框）。同一文档中多个抽屉同时打开时，一次 Esc 会全部关闭。

**挂载到 `body` 判定为 `fixed`** 时，同样以挂载点自身所属文档的 `body` 为准，iframe 内挂到其 `body` 时也相对该 iframe 视口定位。

**`getContainer` 的调用时机。** 仅在 `open = true` 时调用（构造与 `updateOptions` 都不调用）；已打开状态下 `updateOptions` 沿用当前挂载点。返回空值回退到构造函数传入的 `container`；返回的元素与当前父节点相同时不移动 DOM。

**事件冒泡。** 根节点拦截 `dblclick` 冒泡，避免在播放器容器内双击触发全屏切换；`click` 不拦截，点击遮罩关闭后事件仍会冒泡到宿主。关闭按钮的点击会阻止冒泡。

**无障碍。** 面板带 `role="dialog"`，有头部时通过 `aria-labelledby` 关联标题；关闭按钮为 `<button type="button">`，带 `aria-label="close"`，内联 SVG 图标 `aria-hidden="true"`。未做焦点管理与焦点陷阱。
