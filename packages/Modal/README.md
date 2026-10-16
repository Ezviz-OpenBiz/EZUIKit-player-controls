## Modal 弹框控件

可拖动的模态弹框，支持多实例层级管理、点击置顶、拖动标题栏移动、Esc 关闭，且拖动时限制在视口内不超出页面。

### 特性

- 支持右上角 X 关闭、Esc 关闭、点击遮罩关闭
- 支持拖动标题栏移动窗口，约束在视口范围内
- **多实例层级管理**：后创建自动在最上层，点击任意弹框自动置顶
- **ModalProvider 单例**：统一管理全部 Modal 实例的注册、z-index 分配与批量销毁
- 用布尔属性 `open` 打开 / 关闭，开关与拖动通过配置项回调通知；与 `@ezuikit/control-drawer` 一致，不提供事件订阅与多语言

## Usage

```bash
npm install @ezuikit/control-modal
# or
pnpm add @ezuikit/control-modal
```

### ESM / CJS

```ts
import '@ezuikit/control-modal/dist/style/style.css';
import Modal, { ModalProvider } from '@ezuikit/control-modal';

// 第一个参数为挂载容器 container，第二个参数为 options
const modal = new Modal('#app', {
  title: '设备信息',
  content: '<p>这里是弹框内容</p>',
  width: 480,
  draggable: true,
  showClose: true,
  // 回调：Modal 不提供事件订阅，开关与拖动都通过回调通知
  onClose: () => console.log('closed'),
  onDragging: (pos) => console.log('dragging', pos),
});

// 打开 / 关闭：布尔属性 open（getter / setter）
modal.open = true;
console.log(modal.open); // true
modal.open = false;

// 置顶 / 销毁
modal.bringToTop();
modal.destroy();
```

> 从 `0.0.2` 升级：`open()` → `open = true`，`close()` → `open = false`，`isVisible()` → `open`；`on` / `off` 与 `Modal.EVENTS` 改为配置项回调（`onOpen` / `onClose` / `onDragStart` / `onDragging` / `onDragEnd`），`language` / `locales` 已移除。详见 [CHANGELOG](./CHANGELOG.md)。

### UMD / CDN

```html
<link rel="stylesheet" href="./style/style.css" />
<script src="./index.umd.js"></script>
<script>
  const modal = new Modal(document.body, { title: 'Title', content: 'Hello' });
  modal.open = true;

  // ModalProvider 通过 Modal.Provider 访问
  Modal.Provider.getInstance().getInstances(); // 获取全部实例
</script>
```

### 多实例 + ModalProvider

```ts
import Modal, { ModalProvider } from '@ezuikit/control-modal';

// 创建多个实例——后创建者自动在最上层
const m1 = new Modal(document.body, { title: '实例-1', content: '...', open: true });
const m2 = new Modal(document.body, { title: '实例-2', content: '...', open: true });

// 点击任一弹框，该弹框自动置顶（内部调用 bringToTop）

// 手动置顶
m1.bringToTop();

// 通过 ModalProvider 统一管理
const provider = ModalProvider.getInstance();
console.log(provider.count); // 已注册实例数
console.log(provider.getInstances()); // 全部 Modal 实例

// 批量销毁
provider.destroyAll();
```

## 构造函数

```ts
new Modal(container?, options?)
```

| 参数        | 类型                    | 默认值          | 说明                                          |
| ----------- | ----------------------- | --------------- | --------------------------------------------- |
| `container` | `string \| HTMLElement` | `document.body` | 挂载容器，支持 CSS 选择器字符串或 HTMLElement |
| `options`   | `ModalOptions`          | —               | 配置项，见下表                                |

## 配置项 ModalOptions

| 选项            | 类型                      | 默认值     | 说明                                                              |
| --------------- | ------------------------- | ---------- | ----------------------------------------------------------------- |
| `title`         | `string \| HTMLElement`   | —          | 标题                                                              |
| `content`       | `string \| HTMLElement`   | —          | 内容                                                              |
| `width`         | `number \| string`        | `420`      | 宽度（number 视为 px）                                            |
| `height`        | `number \| string`        | `auto`     | 高度                                                              |
| `position`      | `'center' \| { x, y }`    | `'center'` | 展示位置；坐标会约束在视口内                                      |
| `draggable`     | `boolean`                 | `true`     | 是否允许拖动标题栏                                                |
| `showMask`      | `boolean`                 | `true`     | 是否展示遮罩                                                      |
| `maskClosable`  | `boolean`                 | `true`     | 点击遮罩是否关闭                                                  |
| `showHeader`    | `boolean`                 | `true`     | 是否展示头部（标题栏，含标题与关闭按钮，也是拖动手柄）            |
| `showClose`     | `boolean`                 | `true`     | 是否展示 X 关闭按钮                                               |
| `closeOnEscape` | `boolean`                 | `true`     | 按 Esc 是否关闭                                                   |
| `open`          | `boolean`                 | `false`    | 创建后是否立即打开（仅构造时读取，之后用实例的 `open` 属性开关）  |
| `zIndex`        | `number`                  | `1000`     | 期望的最低 z-index（实际由 ModalProvider 分配，确保高于已有实例） |
| `className`     | `string`                  | —          | 根节点自定义类名                                                  |
| `onOpen`        | `() => void`              | —          | 打开回调，见下文「回调」                                          |
| `onClose`       | `() => void`              | —          | 关闭回调                                                          |
| `onDragStart`   | `() => void`              | —          | 开始拖动回调                                                      |
| `onDragging`    | `({ x, y }) => void`      | —          | 拖动中回调，每帧最多一次                                          |
| `onDragEnd`     | `({ left, top }) => void` | —          | 结束拖动回调                                                      |

## 实例属性与方法

| 成员                     | 说明                                                                                                                                        |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `open`                   | 布尔属性（getter / setter）。设为 `true` 打开（按 `position` 定位并约束在视口内），`false` 关闭；重复设置相同状态无效果，销毁后恒为 `false` |
| `bringToTop()`           | 将当前弹框置顶（z-index 升至全局最高）                                                                                                      |
| `setTitle(title)`        | 设置标题                                                                                                                                    |
| `setContent(content)`    | 设置内容                                                                                                                                    |
| `setPosition(x, y)`      | 设置位置坐标（自动约束在视口内）                                                                                                            |
| `updateOptions(options)` | 更新配置（结构变更会重建 DOM；打开时重建后保持打开，并再次调用 `onOpen`）                                                                   |
| `destroy()`              | 销毁（释放 DOM 与监听、Provider 注册），不调用 `onClose`                                                                                    |

## 回调

Modal 不提供事件订阅（没有 `on` / `off`），开关与拖动都通过配置项回调通知。回调在调用时从 `options` 读取，可用 `updateOptions({ onXxx })` 或直接改 `modal.options.onXxx` 替换；回调抛出的异常会抛给触发它的调用方。

| 回调          | 时机                                                                           | 参数            |
| ------------- | ------------------------------------------------------------------------------ | --------------- |
| `onOpen`      | 打开并定位之后（含 `options.open` 构造时打开、`updateOptions` 重建后恢复打开） | —               |
| `onClose`     | 关闭之后（关闭按钮、Esc、点击遮罩或 `open = false`；销毁时不调用）             | —               |
| `onDragStart` | 在标题栏按下鼠标左键或触摸，开始拖动                                           | —               |
| `onDragging`  | 拖动中，每帧最多一次，位置已约束在视口内                                       | `{ x, y }`      |
| `onDragEnd`   | 松开鼠标或触摸结束                                                             | `{ left, top }` |

## 子类扩展

需要在打开 / 关闭后追加逻辑时，覆盖 `protected _afterOpenChange()`：它在状态真正变化、`onOpen` / `onClose` 之后调用，构造时 `options.open` 为 `true`（此时子类构造函数尚未执行完）和 `updateOptions` 重建后恢复打开时也会调用。通过 `this.open` 读取当前状态。

```ts
class MyModal extends Modal {
  protected _afterOpenChange(): void {
    if (this.open) this.refreshList();
  }
}
```

不要在子类里重写 `open` 访问器：构建产物由 swc 编译到 ES5，访问器中的 `super.open` 会变成 `Modal.prototype.open`（读不到实例状态），`super.open = value` 会变成 `this.open = value`（无限递归）。`@ezuikit/control-rec-list-modal` 即按上面的方式实现。

## ModalProvider

`ModalProvider` 是 Modal 实例的**单例管理器**，统一管理所有 Modal 实例的注册、z-index 分配与批量销毁。

### 获取实例

```ts
import { ModalProvider } from '@ezuikit/control-modal';

const provider = ModalProvider.getInstance();

// UMD 场景
const provider = Modal.Provider.getInstance();
```

### API

| 成员 / 方法                           | 说明                                       |
| ------------------------------------- | ------------------------------------------ |
| `getInstance(): ModalProvider`        | 获取单例                                   |
| `register(modal, minZIndex?): number` | 注册实例并分配初始 z-index（内部自动调用） |
| `unregister(modal): void`             | 注销实例（`modal.destroy()` 时自动调用）   |
| `bringToTop(): number`                | 分配一个全局最高 z-index（内部自动调用）   |
| `getInstances(): Modal[]`             | 获取全部已注册实例                         |
| `destroyAll(): void`                  | 销毁全部实例                               |
| `count` (getter)                      | 当前已注册的实例数量                       |
| `resetInstance(): void`               | 重置单例（测试用）                         |

### 工作流程

1. `new Modal(...)` 时 → 自动调用 `ModalProvider.getInstance().register(this)` 分配最高 z-index
2. `modal.destroy()` 时 → 自动调用 `ModalProvider.getInstance().unregister(this)` 注销
3. 点击弹框任意位置 → `pointerdown` → `bringToTop()` → Provider 分配新的最高 z-index
4. 无需手动管理 z-index，Provider 全自动处理

## 边界约束

拖动与窗口 `resize` 时，左上角坐标会被约束在 `[0, 视口宽 - 弹框宽]` × `[0, 视口高 - 弹框高]` 范围内，确保窗口始终完整可见、不超出页面区域。

## 测试

```bash
# 单元测试：Jest + jsdom，用例位于 src/__tests__
pnpm --filter @ezuikit/control-modal test
# 覆盖率：语句 / 分支 / 函数 / 行任一项低于 98% 即失败（jest.config.js 的 coverageThreshold）
pnpm --filter @ezuikit/control-modal test:coverage

# e2e：Playwright，先构建，再在真实浏览器中验证 dist 产物的定位、拖动约束、关闭方式与多实例层级，用例位于 e2e/
pnpm --filter @ezuikit/control-modal test:e2e
```

e2e 默认使用本机安装的 Google Chrome，无需下载浏览器。可设置环境变量 `PLAYWRIGHT_CHANNEL=msedge` 改用 Edge；或先执行 `pnpm --filter @ezuikit/control-modal exec playwright install chromium`，再设置 `PLAYWRIGHT_CHANNEL=chromium` 使用 Playwright 自带的 Chromium。
