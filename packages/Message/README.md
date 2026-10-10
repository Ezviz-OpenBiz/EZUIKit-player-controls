# @ezuikit/control-message

全局消息 / Toast 通知控件。每个实例是一个独立的消息上下文（context），拥有自己的挂载容器与消息列表，可在页面多个区域分别弹出消息。

## 特性

- **覆盖全部区域**：根节点铺满挂载容器（或视口，挂到 `document.body` 时为 `fixed`），是一个点击穿透的浮层，消息在其上堆叠展示。
- **Toast**：消息以轻提示形式展示，自动关闭（默认 3s），支持手动关闭 / 清空。
- **四种类型**：`info` / `success` / `warn` / `error`，带图标与不同配色。
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

| 参数        | 类型                    | 默认            | 说明                                                       |
| ----------- | ----------------------- | --------------- | ---------------------------------------------------------- |
| `container` | `string \| HTMLElement` | `document.body` | 挂载容器，支持元素 ID、CSS 选择器；找不到时回退 body       |
| `options`   | `MessageOptions`        | -               | 配置项，见下表                                             |

## 配置项

| 参数        | 类型                     | 默认    | 说明                                           |
| ----------- | ------------------------ | ------- | ---------------------------------------------- |
| `duration`  | `number`                 | `3000`  | 单条消息自动关闭时长（ms），`0` 表示不自动关闭 |
| `maxCount`  | `number`                 | `0`     | 最大同时显示条数，`0` 表示不限制（超出关闭最早） |
| `position`  | `'top' \| 'bottom'`      | `'top'` | 消息弹出位置                                   |
| `zIndex`    | `number`                 | `1000`  | 层级                                           |
| `className` | `string`                 | -       | 追加到根节点的类名，多个用空格分隔             |
| `onOpen`    | `(item) => void`         | -       | 消息打开回调                                   |
| `onClose`   | `(item) => void`         | -       | 消息关闭回调                                   |

## 方法

| 方法                                       | 说明                                       |
| ------------------------------------------ | ------------------------------------------ |
| `info(content, opts?)`                     | 弹出一条 info 消息，返回消息 id            |
| `success(content, opts?)`                  | 弹出一条 success 消息，返回消息 id         |
| `warn(content, opts?)`                     | 弹出一条 warn 消息，返回消息 id            |
| `error(content, opts?)`                    | 弹出一条 error 消息，返回消息 id           |
| `full(content, opts?)`                     | 弹出一条全屏消息（覆盖整个容器，图标在上、文案在下），返回消息 id |
| `open(options)`                            | 弹出一条消息（`options` 指定 type/content） |
| `close(id?)`                               | 关闭指定消息；不传 id 关闭全部             |
| `clear()`                                  | 清空全部消息（等价于 `close()`）           |
| `updateOptions(opts)`                      | 更新配置（position/zIndex/className 立即生效） |
| `destroy()`                                | 销毁实例（幂等），清除定时器并移除 DOM     |

## 样式与类名

统一前缀 `emessage`（常量 `_MESSAGE_PREFIX_CLS_`）：

- 结构：`emessage`（根）> `emessage-item`（`emessage-icon` + `emessage-content`）
- 状态：`emessage-fixed`（挂在 body 上）、`emessage-top` / `emessage-bottom`、`emessage-item-leave`（关闭动画）
- 类型：`emessage-item-info` / `-success` / `-warn` / `-error`
- 全屏：`emessage-item-full`（覆盖整个容器，图标与文案上下布局）

外观通过 CSS 变量定制：

| 变量                     | 默认                 | 说明         |
| ------------------------ | -------------------- | ------------ |
| `--emessage-z-index`     | `1000`               | 根节点层级   |
| `--emessage-bg`          | `#fff`               | 消息背景     |
| `--emessage-color`       | `rgba(0,0,0,.88)`    | 消息文字色   |
| `--emessage-border-color`| `rgba(0,0,0,.06)`    | 消息边框色   |
| `--emessage-icon-color`  | 按类型（见下）       | 图标颜色     |
| `--emessage-full-bg`     | `rgba(255,255,255,.96)` | 全屏消息背景 |

类型默认图标色：`info` `#4a9eff`、`success` `#52c41a`、`warn` `#faad14`、`error` `#ff4d4f`。

## 注意事项

- **挂载容器必须是定位元素。** 非 body 容器时根节点为 `position: absolute` 铺满容器；容器为 `static` 时会相对更外层定位祖先铺开。
- **字符串按文本插入。** `content` 传字符串时写入 `textContent`（不做 HTML 解析），不可信内容不会被注入；需要富文本请传 `HTMLElement`。
- **多实例互不干扰。** 每个实例独立维护消息列表与定时器，`destroy()` 只清理自身。
