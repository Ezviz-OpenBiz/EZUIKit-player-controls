# @ezuikit/control-message

全局消息 / Toast 通知控件。每个实例是一个独立的消息上下文（context），拥有自己的挂载容器与消息列表，可在页面多个区域分别弹出消息。

## 特性

- **覆盖全部区域**：根节点铺满挂载容器（或视口，挂到 `document.body` 时为 `fixed`），是一个点击穿透的浮层，消息在其上堆叠展示。
- **Toast**：消息以轻提示形式展示，自动关闭（默认 3s），支持手动关闭 / 清空。
- **四种类型**：`info` / `success` / `warn` / `error`，带图标与不同配色。
- **自定义图标**：支持全局设置默认图标，也支持为单条消息单独指定图标。
- **多 context**：每个 `new Message(container)` 都是独立实例，互不干扰。

## 安装

```bash
pnpm add @ezuikit/control-message
```

## 快速开始

```ts
import Message from '@ezuikit/control-message';
import '@ezuikit/control-message/dist/style/style.css';

// 默认挂到 document.body（相对视口，覆盖全部区域）
const message = new Message();

message.info('这是一条信息');
message.success('操作成功');
message.warn('请注意');
message.error('出错了');

// 自定义图标：传图片 URL 或 HTMLElement
message.success('上传完成', { icon: '/assets/upload-success.svg' });

const icon = document.createElement('span');
icon.textContent = '★';
message.info('收藏成功', { icon });

// 手动关闭
const id = message.error('自定义时长', { duration: 5000 });
message.close(id);
```

UMD：

```html
<link rel="stylesheet" href="./style/style.css" />
<script src="./index.umd.js"></script>
<script>
  const message = new Message();
  message.info('Hello');
</script>
```

### 多 context

```ts
// 两个互不干扰的消息上下文
const topMessage = new Message('#player', { position: 'top' });
const bottomMessage = new Message('#extend', { position: 'bottom', duration: 0 });

topMessage.info('顶部消息');
bottomMessage.error('底部消息，不自动关闭');
```

## 构造函数

`new Message(container?, options?)`

| 参数        | 类型                    | 默认            | 说明                                                 |
| ----------- | ----------------------- | --------------- | ---------------------------------------------------- |
| `container` | `string \| HTMLElement` | `document.body` | 挂载容器，支持元素 ID、CSS 选择器；找不到时回退 body |
| `options`   | `MessageOptions`        | -               | 配置项，见下表                                       |

## 配置项

| 参数        | 类型                                                   | 默认    | 说明 |
| ----------- | ------------------------------------------------------ | ------- | ---- |
| `icon`      | `string \| HTMLElement`                                | - | 所有类型统一使用的全局默认图标；单条消息可覆盖 |
| `icons`     | `Partial<Record<MessageType, string \| HTMLElement>>`  | - | 按 `info` / `success` / `warn` / `error` 分别设置全局图标，可只设置部分类型 |
| `duration`  | `number`                                               | `3000` | 单条消息自动关闭时长（ms），`0` 表示不自动关闭 |
| `maxCount`  | `number`                                               | `0` | 最大同时显示条数，`0` 表示不限制（超出关闭最早） |
| `position`  | `'top' \| 'bottom'`                                    | `'top'` | 消息弹出位置 |
| `zIndex`    | `number`                                               | `1000` | 层级 |
| `className` | `string`                                               | - | 追加到根节点的类名，多个空格分隔 |
| `onOpen`    | `(item: MessageItem) => void`                          | - | 消息打开回调 |
| `onClose`   | `(item: MessageItem) => void`                          | - | 消息关闭回调 |

`info`、`success`、`warn`、`error`、`full` 和 `open` 的单条消息配置均支持 `icon` 和 `icons`。`icon` 为该条消息指定统一图标；`icons` 可按 `info`、`success`、`warn`、`error` 类型分别指定图标，也可只配置其中部分类型。图标值支持图片 URL 字符串或 `HTMLElement`。

### 单条消息选项

| 参数       | 类型                                                  | 默认 | 说明 |
| ---------- | ----------------------------------------------------- | ---- | ---- |
| `type`     | `MessageType`                                         | `'info'` | 消息类型 |
| `content`  | `string \| HTMLElement`                               | `''` | 消息内容 |
| `icon`     | `string \| HTMLElement`                               | - | 为当前消息指定统一图标 |
| `icons`    | `Partial<Record<MessageType, string \| HTMLElement>>` | - | 按类型指定图标；仅使用与当前消息 `type` 对应的值 |
| `duration` | `number`                                              | 继承实例配置 | 自动关闭时长（ms）；`0` 表示不自动关闭 |
| `full`     | `boolean`                                             | `false` | 是否覆盖整个挂载容器 |
| `onClose`  | `() => void`                                          | - | 当前消息关闭后的回调 |

单条图标优先级为：单条 `icon` → 单条 `icons[type]` → 全局 `icons[type]` → 全局 `icon` → 内置类型图标。
因此，单条 `icons` 未设置当前消息类型时，会继续使用全局图标或内置图标。

```ts
const starIcon = document.createElement('span');
starIcon.textContent = '★';

const message = new Message(document.body, {
  icon: '/assets/common.svg',
  icons: {
    info: '/assets/info.svg',
    success: '/assets/success.svg',
    warn: '/assets/warn.svg',
    error: '/assets/error.svg',
  },
});
message.info('使用 info 图标');
message.success('全局 icons 优先于全局 icon');
message.error('单条 icon 优先级最高', { icon: starIcon });
message.open({
  type: 'warn',
  content: '单条 icons 也可只覆盖指定类型',
  icons: { warn: '/assets/custom-warn.svg' },
});
```

`icons` 可以只配置部分类型；未配置的类型继续使用统一 `icon` 或内置图标。实例级 `HTMLElement` 图标会克隆后用于每条消息，单条消息配置中的 `HTMLElement` 则直接移动到图标区域。可通过 `updateOptions({ icon })` 或 `updateOptions({ icons })` 更新全局图标，新配置对之后打开的消息生效。

`full(content, options)` 同样接受单条消息选项，默认自动关闭时间继承实例 `duration`（默认 3000ms）；如需持续显示，可传 `{ duration: 0 }`，之后通过 `close(id)` 关闭。

## 方法

| 方法                      | 说明                                                                  |
| ------------------------- | --------------------------------------------------------------------- |
| `info(content, opts?)`    | 弹出一条 info 消息，返回消息 id                                       |
| `success(content, opts?)` | 弹出一条 success 消息，返回消息 id                                    |
| `warn(content, opts?)`    | 弹出一条 warn 消息，返回消息 id                                       |
| `error(content, opts?)`   | 弹出一条 error 消息，返回消息 id                                      |
| `full(content, opts?)`    | 弹出一条全屏消息（覆盖整个容器，图标在上、文案在下），返回消息 id     |
| `open(options)`           | 弹出一条消息（`options` 指定 type/content）                           |
| `close(id?)`              | 关闭指定消息；不传 id 关闭全部                                        |
| `clear()`                 | 清空全部消息（等价于 `close()`）                                      |
| `updateOptions(opts)`     | 更新配置（position/zIndex/className 立即生效；icon/icons 对后续新消息生效） |
| `destroy()`               | 销毁实例（幂等），清除定时器并移除 DOM                                |

## 样式与类名

统一前缀 `emessage`（常量 `_MESSAGE_PREFIX_CLS_`）：

- 结构：`emessage`（根）> `emessage-item`（`emessage-icon` + `emessage-content`）
- 状态：`emessage-fixed`（挂在 body 上）、`emessage-top` / `emessage-bottom`、`emessage-item-leave`（关闭动画）
- 类型：`emessage-item-info` / `-success` / `-warn` / `-error`
- 全屏：`emessage-item-full`（覆盖整个容器，图标与文案上下布局）

外观通过 CSS 变量定制：

| 变量                      | 默认                    | 说明         |
| ------------------------- | ----------------------- | ------------ |
| `--emessage-z-index`      | `1000`                  | 根节点层级   |
| `--emessage-bg`           | `rgba(0,0,0,.7)`        | 消息背景     |
| `--emessage-color`        | `rgba(255,255,255,1)`   | 消息文字色   |
| `--emessage-border-color` | `rgba(0,0,0,.06)`       | 消息边框色   |
| `--emessage-icon-color`   | 按类型（见下）          | 图标颜色     |
| `--emessage-full-bg`      | `rgba(0,0,0,.7)`        | 全屏消息背景 |

类型默认图标色：`info` `#4a9eff`、`success` `#52c41a`、`warn` `#faad14`、`error` `#ff4d4f`。

## 注意事项

- **挂载容器必须是定位元素。** 非 body 容器时根节点为 `position: absolute` 铺满容器；容器为 `static` 时会相对更外层定位祖先铺开。
- **字符串内容按 HTML 解析。** `content` 字符串会写入 `innerHTML`；不得传入未经可信化的用户输入，否则可能导致 XSS。普通文本可传 `HTMLElement`，并通过 `textContent` 设置内容。
- **多实例互不干扰。** 每个实例独立维护消息列表与定时器，`destroy()` 只清理自身。
