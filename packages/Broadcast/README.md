# @ezuikit/control-broadcast

云广播喊话控制模块

## 功能特性

- 🎤 语音录制（3-59秒）
- 📋 默认语音列表查询
- 📤 临时语音下发
- 🔊 默认语音下发
- 🌍 国际化支持（中英文）
- 🔌 回调驱动，解耦接口调用

## 架构说明

Broadcast 不直接调用接口，通过配置中的回调与上层通信：

1. Broadcast 调用请求回调（`onRequestQueryVoiceList`、`onRequestSendVoiceOnce`、`onRequestSendVoice`）
2. 上层（ezopen）在回调里调用实际的接口方法
3. 上层用实例方法回填结果：`updateVoiceList(list)`、`showSuccess(msg)`、`showError(msg)`

类层次为 `Broadcast` → `BroadcastUI` → `Drawer`：

- `Drawer`（`@ezuikit/control-drawer`）提供抽屉骨架：遮罩、面板、标题栏、开合动画与挂载策略，以及 `open` 访问器
- `BroadcastUI` 负责抽屉内的广播内容：Tab、语音列表、录音按钮、轻提示，以及基于 `@ezuikit/control-message` 的录音提示（波形 + 倒计时）
- `Broadcast` 负责录音与下发流程，并调用宿主回调

## 安装

```bash
pnpm install @ezuikit/control-broadcast
```

## 使用

### 基础使用

```typescript
import Broadcast from '@ezuikit/control-broadcast';
import '@ezuikit/control-broadcast/dist/style/style.css';

// 第一个参数是挂载容器：面板挂在容器内（PC 与移动端一致），容器需为定位元素
const broadcast = new Broadcast(document.getElementById('player')!, {
  deviceSerial: 'BA5551167',
  channelNo: '1',
  accessToken: 'your-access-token',
  env: {
    domain: 'https://open.ys7.com',
  },
  onOpen: () => console.log('面板已打开'),
  onClose: () => console.log('面板已关闭'),
  onRecordComplete: (voiceFile) => console.log('录音完成', voiceFile.size),
});

// 打开 / 关闭云广播面板
broadcast.open = true;
broadcast.close(); // 等价于 broadcast.open = false

// 销毁
broadcast.destroy();
```

### 与上层集成（ezopen）

上层在请求回调里调用实际接口，再用实例方法回填结果（回调不会在构造期间触发，可以直接引用实例）：

```javascript
const broadcast = new Broadcast('player', {
  // ...其它配置
  // 查询语音列表：打开面板时没有语音列表，或调用 loadVoiceList() 时触发
  onRequestQueryVoiceList: async (params) => {
    try {
      const result = await player.queryVoiceList({ pageSize: params.pageSize });
      broadcast.updateVoiceList(result.data);
    } catch (error) {
      broadcast.showError(error.message || '语音列表加载失败');
    }
  },
  // 下发临时语音：录音结束、得到有效录音时触发，voiceFile 为 16kHz 单声道 WAV
  onRequestSendVoiceOnce: async ({ voiceFile, channelNo }) => {
    try {
      await player.sendVoiceOnce(voiceFile, channelNo);
      broadcast.showSuccess('临时语音下发成功');
    } catch (error) {
      broadcast.showError(error.message || '临时语音下发失败');
    }
  },
  // 下发默认语音：点击语音项时触发
  onRequestSendVoice: async ({ fileUrl, channelNo }) => {
    try {
      await player.sendVoice(fileUrl, channelNo);
      broadcast.showSuccess('语音下发成功');
    } catch (error) {
      broadcast.showError(error.message || '语音下发失败');
    }
  },
});
```

## API

### 构造函数

```typescript
new Broadcast(container: string | HTMLElement, options: BroadcastOptions)
```

- `container` - 挂载容器，PC 与移动端一致；非 body 容器需为定位元素（`position` 非 `static`）。字符串先按元素 ID 查找，再按 CSS 选择器查找，都找不到时回退到 `document.body`；传 `document.body` 时面板相对视口铺满
- `options` - 配置项见 [GUIDE.md](./GUIDE.md#配置项)；`options.container` 已废弃，不再生效

### 属性

- `open` - 继承自 Drawer 的访问器：设为 `true` / `false` 打开 / 关闭面板，读取得到当前状态
- `broadcastOptions` - 当前配置（用 `updateOptions` 更新）
- `voiceList` - 当前语音列表

### 方法

- `close()` - 关闭面板，等价于 `open = false`
- `loadVoiceList()` - 通过 `onRequestQueryVoiceList` 重新请求语音列表
- `updateVoiceList(list)` - 回填语音列表（非数组按空列表处理）
- `showSuccess(msg)` / `showError(msg)` - 底部轻提示，2 秒自动消失，用于回填下发结果
- `setLoading(loading)` / `setError(msg)` - 列表区的加载态 / 错误态（`setError('')` 清除）
- `sendVoice(fileUrl)` / `sendVoiceOnce(blob)` - 主动发起下发请求（触发对应的请求回调）
- `requestMicrophonePermission()` - 请求麦克风权限，返回 `Promise<boolean>`
- `updateOptions(options)` - 更新配置；回调在下次触发时读取新值，方向、语言、移动端、日志等界面相关配置只在构造时生效（容器是构造参数，无法更新）
- `destroy()` - 销毁实例

### 回调

| 回调                      | 参数                                     | 触发时机                                                                                |
| ------------------------- | ---------------------------------------- | --------------------------------------------------------------------------------------- |
| `onOpen`                  | -                                        | 面板打开                                                                                |
| `onClose`                 | -                                        | 面板关闭：关闭按钮、遮罩、Esc、`close()` / `open = false`，以及打开状态下的 `destroy()` |
| `onRequestQueryVoiceList` | `{ deviceSerial, channelNo, pageSize }`  | 打开面板时没有语音列表，或调用 `loadVoiceList()`                                        |
| `onRequestSendVoice`      | `{ fileUrl, deviceSerial, channelNo }`   | 点击语音项                                                                              |
| `onRequestSendVoiceOnce`  | `{ voiceFile, deviceSerial, channelNo }` | 录音结束并得到有效录音                                                                  |
| `onVoiceRecorded`         | 同 `onRequestSendVoiceOnce`              | 录到有效语音，紧挨着在 `onRequestSendVoiceOnce` 之前                                    |
| `onRecordStart`           | -                                        | 开始录音                                                                                |
| `onRecordStop`            | -                                        | 停止录音并得到有效录音；关闭面板取消录音时不触发                                        |
| `onRecordComplete`        | `voiceFile: Blob`                        | 录音完成：正常停止，或达到最长时长自动停止并暂存                                        |
| `onRecordError`           | `{ msg, error }`                         | 开始录音失败、录音时长不足等                                                            |
| `onError`                 | `{ msg, error }`                         | 其它错误，如麦克风权限请求失败                                                          |

回调抛出的异常会被捕获并通过 `logger` 打印，不会中断控件流程。录音中关闭面板会取消本次录音（停止采集、丢弃录音、不下发）。

### 从事件 API 迁移（0.1.x → 1.x）

| 0.1.x                                                                                | 1.x                                                                                         |
| ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------- |
| `new Broadcast({ container, ...options })`                                           | `new Broadcast(container, options)`（`options.container` 不再生效）                         |
| `broadcast.open()`                                                                   | `broadcast.open = true`                                                                     |
| `broadcast.isOpen`                                                                   | `broadcast.open`                                                                            |
| `broadcast.broadcastUI.close()`                                                      | `broadcast.close()`                                                                         |
| `broadcast.options`                                                                  | `broadcast.broadcastOptions`（`options` 现为 Drawer 的配置）                                |
| `eventEmitter.on('requestQueryVoiceList', fn)`（参数 `{ params }`）                  | 配置 `onRequestQueryVoiceList`，参数直接是 `params`                                         |
| `eventEmitter.on('requestSendVoice' / 'requestSendVoiceOnce' / 'voiceRecorded', fn)` | `onRequestSendVoice` / `onRequestSendVoiceOnce` / `onVoiceRecorded`（参数去掉 `eventType`） |
| `eventEmitter.on('open' / 'close' / 'recordStart' / 'recordStop', fn)`               | `onOpen` / `onClose` / `onRecordStart` / `onRecordStop`（无参数）                           |
| `eventEmitter.on('recordComplete', fn)`（录音在 `data.data`）                        | `onRecordComplete(voiceFile)`                                                               |
| `eventEmitter.on('recordError' / 'error', fn)`                                       | `onRecordError` / `onError`（参数 `{ msg, error }`）                                        |
| `eventEmitter.emit('voiceListLoaded', { data })`                                     | `updateVoiceList(data)`                                                                     |
| `eventEmitter.emit('voiceSent', { msg })`                                            | `showSuccess(msg)`                                                                          |
| `eventEmitter.emit('voiceListError' / 'voiceSendError', { msg })`                    | `showError(msg)`                                                                            |
| `Broadcast.EVENTS`                                                                   | 移除（其中 `voiceSelected` 此前从未触发）                                                   |


## License

Copyright © Ezviz-OpenBiz
