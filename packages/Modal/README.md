## Modal 弹框控件

可拖动的模态弹框，支持多实例层级管理、点击置顶、拖动标题栏移动、Esc 关闭，且拖动时限制在视口内不超出页面。

### 特性

- 支持右上角 X 关闭、Esc 关闭、点击遮罩关闭
- 支持拖动标题栏移动窗口，约束在视口范围内
- **多实例层级管理**：后创建自动在最上层，点击任意弹框自动置顶
- **ModalProvider 单例**：统一管理全部 Modal 实例的注册、z-index 分配与批量销毁

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
});

modal.open();

// 关闭 / 置顶 / 销毁
modal.close();
modal.bringToTop();
modal.destroy();

// 事件
modal.on(Modal.EVENTS.dragging, (pos) => console.log('dragging', pos));
modal.on(Modal.EVENTS.close, () => console.log('closed'));
```

### UMD / CDN

```html
<link rel="stylesheet" href="./style/style.css" />
<script src="./index.umd.js"></script>
<script>
  const modal = new Modal(document.body, { title: 'Title', content: 'Hello' });
  modal.open();

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

| 选项            | 类型                    | 默认值     | 说明                                                              |
| --------------- | ----------------------- | ---------- | ----------------------------------------------------------------- |
| `title`         | `string \| HTMLElement` | —          | 标题                                                              |
| `content`       | `string \| HTMLElement` | —          | 内容                                                              |
| `width`         | `number \| string`      | `420`      | 宽度（number 视为 px）                                            |
| `height`        | `number \| string`      | `auto`     | 高度                                                              |
| `position`      | `'center' \| { x, y }`  | `'center'` | 展示位置；坐标会约束在视口内                                      |
| `draggable`     | `boolean`               | `true`     | 是否允许拖动标题栏                                                |
| `showMask`      | `boolean`               | `true`     | 是否展示遮罩                                                      |
| `maskClosable`  | `boolean`               | `true`     | 点击遮罩是否关闭                                                  |
| `showHeader`    | `boolean`               | `true`     | 是否展示头部（标题栏，含标题与关闭按钮，也是拖动手柄）            |
| `showClose`     | `boolean`               | `true`     | 是否展示 X 关闭按钮                                               |
| `closeOnEscape` | `boolean`               | `true`     | 按 Esc 是否关闭                                                   |
| `open`          | `boolean`               | `false`    | 创建后是否立即打开                                                |
| `zIndex`        | `number`                | `1000`     | 期望的最低 z-index（实际由 ModalProvider 分配，确保高于已有实例） |
| `className`     | `string`                | —          | 根节点自定义类名                                                  |
| `language`      | `'zh' \| 'en'`          | `'zh'`     | 语言                                                              |
| `locales`       | `I18nTranslation`       | —          | 自定义文案                                                        |
| `onOpen`        | `() => void`            | —          | 打开回调                                                          |
| `onClose`       | `() => void`            | —          | 关闭回调                                                          |

## 实例方法

| 方法                               | 说明                                     |
| ---------------------------------- | ---------------------------------------- |
| `open()`                           | 打开弹框（打开时自动居中并约束在视口内） |
| `close()`                          | 关闭弹框                                 |
| `isVisible()`                      | 是否可见                                 |
| `bringToTop()`                     | 将当前弹框置顶（z-index 升至全局最高）   |
| `setTitle(title)`                  | 设置标题                                 |
| `setContent(content)`              | 设置内容                                 |
| `setPosition(x, y)`                | 设置位置坐标（自动约束在视口内）         |
| `updateOptions(options)`           | 更新配置（结构变更会重建 DOM）           |
| `on(event, cb)` / `off(event, cb)` | 事件监听 / 取消                          |
| `destroy()`                        | 销毁（释放 DOM、事件、Provider 注册）    |

## 事件 Modal.EVENTS

| 事件        | 说明     | 回调参数        |
| ----------- | -------- | --------------- |
| `open`      | 打开     | —               |
| `close`     | 关闭     | —               |
| `dragStart` | 开始拖动 | —               |
| `dragging`  | 拖动中   | `{ x, y }`      |
| `dragEnd`   | 结束拖动 | `{ left, top }` |

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
