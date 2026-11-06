# @ezuikit/control-message

全局消息 / Toast 通知控件。每个实例是一个独立的消息上下文（context），拥有自己的挂载容器与消息列表，可在页面多个区域分别弹出消息。

## 特性

- **覆盖全部区域**：根节点铺满挂载容器（或视口，挂到 `document.body` 时为 `fixed`），是一个点击穿透的浮层，消息在其上堆叠展示。
- **Toast**：消息以轻提示形式展示，自动关闭（默认 3s），支持通过 API 手动关闭 / 清空。
- **全屏消息**：支持点击消息右上角的关闭按钮关闭。
- **Notification**：`notification(content)` 在实例内独立的通知区显示无图标消息；每条通知从右侧滑入并固定在右上角。不超过三条时依次排列；超过三条时叠放：第二条起都叠在第一条后面，第二条比第一条下移 2px，第三条叠在第二条后面再下移 2px，第四条及之后叠在第三条后面、不再偏移（各条按自身尺寸与内容完整展示；默认背景半透明，重叠部分会透出后面的通知）。后创建的通知层级更高，鼠标悬停时展开全部通知，关闭时向右滑出，关闭按钮位于右上角。
- **方向支持**：`top` / `bottom` / `left` / `right` 四个方向均可配置；`left` / `right` 分别从左上 / 右上开始堆叠，默认 `top`，`notification` 始终固定在右上角。
- **四种类型**：`info` / `success` / `warn` / `error`，带图标与不同配色。
- **自定义图标**：支持通过静态方法为各消息类型设置全局图标。
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
message.notification('这是一条没有图标、可手动关闭的通知');

// 使用静态方法按类型设置全局图标（支持图片 URL 或 HTMLElement）
Message.setIcons({
  success: '/assets/upload-success.svg',
});
message.success('上传完成');

// 通过 API 手动关闭
const id = message.error('自定义时长', { duration: 5000 });
message.close(id);

// 全屏消息支持点击右上角关闭按钮
message.full('处理中', { duration: 0 });
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
const leftMessage = new Message('#left-panel', { position: 'left' });
const rightMessage = new Message('#right-panel', { position: 'right' });

topMessage.info('顶部消息');
bottomMessage.error('底部消息，不自动关闭');
leftMessage.warn('左侧消息');
rightMessage.success('右侧消息');
```

## 构造函数

`new Message(container?, options?)`

| 参数        | 类型                    | 默认            | 说明                                                 |
| ----------- | ----------------------- | --------------- | ---------------------------------------------------- |
| `container` | `string \| HTMLElement` | `document.body` | 挂载容器，支持元素 ID、CSS 选择器；找不到时回退 body |
| `options`   | `MessageOptions`        | -               | 配置项，见下表                                       |

## 配置项

| 参数        | 类型                                     | 默认    | 说明                                                                                 |
| ----------- | ---------------------------------------- | ------- | ------------------------------------------------------------------------------------ |
| `duration`  | `number`                                 | `3000`  | 单条消息自动关闭时长（ms），`0` 表示不自动关闭                                       |
| `maxCount`  | `number`                                 | `0`     | 普通消息和 notification 各自的最大显示条数，`0` 表示不限制（超出关闭各自最早的消息） |
| `position`  | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` | 消息弹出位置                                                                         |
| `zIndex`    | `number`                                 | `1000`  | 层级                                                                                 |
| `className` | `string`                                 | -       | 追加到根节点的类名，多个空格分隔                                                     |
| `onOpen`    | `(item: MessageItem) => void`            | -       | 消息打开回调                                                                         |
| `onClose`   | `(item: MessageItem) => void`            | -       | 消息关闭回调                                                                         |

### 单条消息选项

| 参数       | 类型                    | 默认         | 说明                                   |
| ---------- | ----------------------- | ------------ | -------------------------------------- |
| `type`     | `MessageType`           | `'info'`     | 消息类型                               |
| `content`  | `string \| HTMLElement` | `''`         | 消息内容                               |
| `duration` | `number`                | 继承实例配置 | 自动关闭时长（ms）；`0` 表示不自动关闭 |
| `full`     | `boolean`               | `false`      | 是否覆盖整个挂载容器                   |
| `onClose`  | `() => void`            | -            | 当前消息关闭后的回调                   |

```ts
Message.setIcons({
  info: '/assets/info.svg',
  success: '/assets/success.svg',
  warn: '/assets/warn.svg',
  error: '/assets/error.svg',
});
const message = new Message(document.body);
message.info('使用 info 图标');
message.success('使用 success 图标');
message.error('使用 error 图标');
message.warn('使用 warn 图标');
```

`Message.setIcons()` 设置的图标由所有实例共享，对后续打开的消息生效；只配置部分类型时，其余类型继续使用内置图标。`notification` 始终不显示图标。全局 `HTMLElement` 图标会克隆后用于每条消息。传入空对象 `Message.setIcons({})` 可恢复全部内置图标。

`full(content, options)` 同样接受单条消息选项（可通过 `type` 指定图标类型，默认 `info`），默认自动关闭时间继承实例 `duration`（默认 3000ms）；全屏消息提供右上角关闭按钮。如需持续显示，可传 `{ duration: 0 }`，之后通过关闭按钮或 `close(id)` 关闭。

## 静态方法

| 方法                      | 说明                                                                                 |
| ------------------------- | ------------------------------------------------------------------------------------ |
| `Message.setIcons(icons)` | 替换所有实例共用的类型图标配置；未设置的类型使用内置图标，传入 `{}` 恢复全部内置图标 |

## 方法

| 方法                           | 说明                                                                |
| ------------------------------ | ------------------------------------------------------------------- |
| `info(content, opts?)`         | 弹出一条 info 消息，返回消息 id                                     |
| `success(content, opts?)`      | 弹出一条 success 消息，返回消息 id                                  |
| `warn(content, opts?)`         | 弹出一条 warn 消息，返回消息 id                                     |
| `error(content, opts?)`        | 弹出一条 error 消息，返回消息 id                                    |
| `notification(content, opts?)` | 在独立通知区添加一条无图标通知；超过三条叠放，悬停展开，返回消息 id |
| `full(content, opts?)`         | 弹出一条全屏消息（覆盖整个容器，图标在上、文案在下），返回消息 id   |
| `open(options)`                | 弹出一条消息（`options` 指定 type/content）                         |
| `close(id?)`                   | 关闭指定消息；不传 id 关闭全部                                      |
| `clear()`                      | 清空全部消息（等价于 `close()`）                                    |
| `updateOptions(opts)`          | 更新实例配置（position/zIndex/className 立即生效）                  |
| `destroy()`                    | 销毁实例（幂等），清除定时器并移除 DOM                              |

所有弹出消息的方法都返回消息 id，可传给 `close(id)`；实例销毁后再调用返回空字符串 `''`，不会弹出消息。

### 方法示例

```ts
const message = new Message('#player');

// info / success / warn / error：默认 3 秒后关闭；单条可指定时长与关闭回调
message.info('这是一条信息');
message.info('即将重连', { duration: 5000, onClose: () => console.log('closed') });
message.warn('网络不稳定', { duration: 0 }); // 不自动关闭

// 内容可以是 HTMLElement（字符串按 HTML 解析，用户输入请用 textContent）
const el = document.createElement('span');
el.textContent = '请求失败，请重试';
message.error(el);

// notification：独立通知区，无图标，带关闭按钮；duration: 0 持续显示
const noticeId = message.notification('新版本可用', { duration: 0 });

// full：覆盖整个容器；可指定 type
const fullId = message.full('设备离线', { type: 'error', duration: 0 });

// open：通过选项指定 type / content
const warnId = message.open({ type: 'warn', content: '磁盘空间不足', duration: 0 });

// 关闭：notification 与 full 也通过 id 关闭
message.close(noticeId); // 关闭指定消息
message.close(); // 关闭全部消息（等价于 message.clear()）

// 更新配置：duration / maxCount 对后续新消息生效，position / zIndex / className 立即生效
message.updateOptions({ duration: 5000, maxCount: 3, position: 'bottom' });

// 销毁
message.destroy();
```

## 样式与类名

统一前缀 `emessage`（常量 `_MESSAGE_PREFIX_CLS_`）：

- 结构：`emessage`（根）> `emessage-item`（普通消息含 `emessage-icon`；`notification` 不含图标，置于独立 `emessage-notifications` context；全屏和 `notification` 含 `emessage-close`）
- 状态：`emessage-fixed`（挂在 body 上）、`emessage-top` / `emessage-bottom` / `emessage-left` / `emessage-right`、`emessage-item-leave`（关闭动画）
- 类型：`emessage-item-info` / `-success` / `-warn` / `-error` / `-notification`
- 全屏：`emessage-item-full`（覆盖整个容器，图标与文案上下布局）

外观通过 CSS 变量定制：

| 变量                      | 默认                  | 说明         |
| ------------------------- | --------------------- | ------------ |
| `--emessage-z-index`      | `1000`                | 根节点层级   |
| `--emessage-bg`           | `rgba(0,0,0,.7)`      | 消息背景     |
| `--emessage-color`        | `rgba(255,255,255,1)` | 消息文字色   |
| `--emessage-border-color` | `rgba(0,0,0,.06)`     | 消息边框色   |
| `--emessage-icon-color`   | 按类型（见下）        | 图标颜色     |
| `--emessage-full-bg`      | `rgba(0,0,0,.7)`      | 全屏消息背景 |

类型默认图标色：`info` `#4a9eff`、`success` `#52c41a`、`warn` `#faad14`、`error` `#ff4d4f`。

## 注意事项

- **挂载容器必须是定位元素。** 非 body 容器时根节点为 `position: absolute` 铺满容器；容器为 `static` 时会相对更外层定位祖先铺开。
- **字符串内容按 HTML 解析。** `content` 字符串会写入 `innerHTML`；不得传入未经可信化的用户输入，否则可能导致 XSS。普通文本可传 `HTMLElement`，并通过 `textContent` 设置内容。
- **多实例互不干扰。** 每个实例独立维护消息列表与定时器，`destroy()` 只清理自身。
