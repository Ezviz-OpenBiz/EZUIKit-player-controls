# @ezuikit/control-drawer 使用指南

抽屉布局控件。只提供布局骨架：遮罩、从四个方向滑出的面板、标题栏与关闭按钮、开合动画和挂载策略；业务内容通过 `content` 注入。`@ezuikit/control-alarm-message` 基于它实现告警消息面板。

## 安装

```bash
pnpm add @ezuikit/control-drawer
```

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

| 参数            | 类型                                     | 默认      | 说明                                          |
| --------------- | ---------------------------------------- | --------- | --------------------------------------------- |
| `title`         | `string \| HTMLElement`                  | -         | 标题，字符串按 HTML 插入                      |
| `content`       | `string \| HTMLElement`                  | -         | 内容，字符串按 HTML 插入                      |
| `placement`     | `'left' \| 'right' \| 'top' \| 'bottom'` | `'right'` | 弹出方向，非法值回退 `right`                  |
| `width`         | `number \| string`                       | `300`     | 面板宽度（左右方向生效），number 视为 px      |
| `height`        | `number \| string`                       | `300`     | 面板高度（上下方向生效），number 视为 px      |
| `showMask`      | `boolean`                                | `true`    | 遮罩；关闭后面板以外区域可操作底层内容        |
| `maskClosable`  | `boolean`                                | `true`    | 点击遮罩关闭                                  |
| `showHeader`    | `boolean`                                | `true`    | 头部（标题 + 关闭按钮）                       |
| `showClose`     | `boolean`                                | `true`    | 关闭按钮，`showHeader` 为 `false` 时无效      |
| `closeOnEscape` | `boolean`                                | `true`    | Esc 关闭                                      |
| `open`          | `boolean`                                | `false`   | 创建后立即打开（仅构造时生效）                |
| `zIndex`        | `number`                                 | -         | 根节点层级，缺省取 `--edrawer-z-index`（100） |
| `className`     | `string`                                 | -         | 追加到根节点的类名，多个用空格分隔            |
| `getContainer`  | `() => HTMLElement \| null \| undefined` | -         | 动态挂载点，见上文                            |
| `onOpenChange`  | `(open: boolean) => void`                | -         | 打开/关闭回调，参数为当前状态                  |

## 方法 / 属性

| 成员                                      | 说明                                                 |
| ----------------------------------------- | ---------------------------------------------------- |
| `open`                                    | 布尔属性（getter/setter），打开/关闭抽屉；重复设置相同状态为幂等 |
| `setTitle(title)` / `setContent(content)` | 更新标题 / 内容，不重建 DOM                          |
| `updateOptions(opts)`                     | 更新配置并重建 DOM，保持当前开合状态且不重播动画     |
| `destroy()`                               | 销毁（幂等），移除 DOM、定时器与监听，不触发 `onOpenChange` |
| `Drawer.VERSION`                          | 构建时由 Rollup 注入的版本号（静态属性）             |

## 打开 / 关闭回调

通过 `options.onOpenChange` 注册，打开与关闭时同步调用，参数为当前状态 `boolean`（`true` 打开 / `false` 关闭）；在动画开始时同步触发，关闭时不等收起动画结束。

## 样式与类名

统一前缀 `edrawer`（常量 `_DRAWER_PREFIX_CLS_`，SCSS 变量 `$edrawer-prefix-cls`）：

- 结构：`edrawer`（根）> `edrawer-mask` + `edrawer-panel` > `edrawer-header`（`edrawer-title`、`edrawer-close`）+ `edrawer-body`
- 状态：`edrawer-left` / `-right` / `-top` / `-bottom`、`edrawer-open`、`edrawer-hidden`、`edrawer-fixed`（挂在 body 上）

外观通过 CSS 变量定制，可设在 `className` 对应的根节点上按实例覆盖：

| 变量                            | 默认              | 说明               |
| ------------------------------- | ----------------- | ------------------ |
| `--edrawer-z-index`             | `100`             | 根节点层级         |
| `--edrawer-bg`                  | `#fff`            | 面板背景           |
| `--edrawer-color`               | `rgba(0,0,0,.88)` | 面板文字色         |
| `--edrawer-mask-bg`             | `rgba(0,0,0,.3)`  | 遮罩色             |
| `--edrawer-border-color`        | `rgba(0,0,0,.1)`  | 面板内侧边框       |
| `--edrawer-max-width`           | `100%`            | 左右方向的最大宽度 |
| `--edrawer-max-height`          | `100%`            | 上下方向的最大高度 |
| `--edrawer-header-padding`      | `12px 16px`       | 头部内边距         |
| `--edrawer-header-border-color` | `rgba(0,0,0,.08)` | 头部分隔线         |
| `--edrawer-title-color`         | `#333`            | 标题色             |
| `--edrawer-title-font-size`     | `14px`            | 标题字号           |
| `--edrawer-close-color`         | `rgba(0,0,0,.4)`  | 关闭按钮色         |
| `--edrawer-close-hover-color`   | `#333`            | 关闭按钮悬停色     |

```css
/* 例：告警消息面板在 PC 端最多占容器 80% 宽 */
.ezuikit-alarm-message-drawer {
  --edrawer-max-width: 80%;
}
```

## 注意事项

**挂载容器必须是定位元素。** 根节点是 `position: absolute` 铺满容器；容器为 `static` 时会相对更外层的定位祖先铺开。挂载到 `document.body` 时自动切换为 `position: fixed`（相对视口）。

**字符串按 HTML 插入。** `title` / `content` / `setTitle` / `setContent` 传字符串时写入 `innerHTML`，只能传可信内容；不可信数据请自行转义或传 `HTMLElement`。

**动画时长固定 300ms。** JS 常量 `_DRAWER_DURATION_` 与 SCSS 变量 `$edrawer-duration` 必须同步修改；只在宿主 CSS 里改 `transition` 时长不会改变 JS 的隐藏时机。系统开启"减少动效"时过渡被关闭。

**`updateOptions` 会重建 DOM。** 以 `HTMLElement` 传入的内容会被移动到新节点，引用与其上的监听保留，但内部滚动位置会重置；只改文案时用 `setTitle` / `setContent`。

**显式传 `undefined` 会覆盖默认值。** 配置按 `Object.assign({}, 默认配置, options)` 浅合并，DOM 节点与函数按引用保留；`{ width: undefined }` 会让面板失去默认宽度，不需要的字段请不要传。

**Esc 监听挂在 `document` 上**，仅在打开期间存在，多个抽屉同时打开时一次 Esc 会全部关闭。

**事件冒泡。** 根节点拦截 `dblclick` 冒泡，避免在播放器容器内双击触发全屏切换；`click` 不拦截，点击遮罩关闭后事件仍会冒泡到宿主。关闭按钮的点击会阻止冒泡。

**无障碍。** 面板带 `role="dialog"`，有头部时通过 `aria-labelledby` 关联标题；关闭按钮为 `<button type="button">`，内联 SVG 图标 `aria-hidden="true"`，未设置 `aria-label`。未做焦点管理与焦点陷阱。
